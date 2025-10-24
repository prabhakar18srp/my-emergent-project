import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CampaignCard = ({ campaign, analysis }) => {
  const navigate = useNavigate();
  const fundingPercentage = (campaign.raised_amount / campaign.goal_amount) * 100;

  return (
    <div 
      className="campaign-card group" 
      onClick={() => navigate(`/campaign/${campaign.id}`)}
      data-testid={`campaign-card-${campaign.id}`}
    >
      <div className="relative">
        <img 
          src={campaign.image_url || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop'} 
          alt={campaign.title}
          className="w-full h-56 object-cover"
        />
        {analysis && analysis.success_probability >= 70 && (
          <div className="ai-success-badge" data-testid="ai-success-badge">
            <Sparkles className="w-3 h-3" />
            {Math.round(analysis.success_probability)}% Success
          </div>
        )}
        <div className="campaign-category">{campaign.category}</div>
      </div>
      
      <div className="campaign-content">
        <h3 className="campaign-title">{campaign.title}</h3>
        <p className="text-sm text-slate-400 mb-1">by {campaign.creator_name || 'Campaign Creator'}</p>
        <p className="campaign-description">{campaign.description}</p>
        
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xl font-bold text-purple-400">${campaign.raised_amount.toLocaleString()}</p>
            <p className="text-xs text-slate-500">of ${campaign.goal_amount.toLocaleString()} goal</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-300">{campaign.backers_count} Backers</p>
            <p className="text-xs text-slate-500">{Math.round(fundingPercentage)}% Funded</p>
          </div>
        </div>
        
        <Button 
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/campaign/${campaign.id}`);
          }}
          data-testid={`view-details-button-${campaign.id}`}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

const DiscoverPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [analyses, setAnalyses] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${API}/campaigns`);
      setCampaigns(response.data);
      
      // Fetch AI analyses for each campaign
      const analysesData = {};
      for (const campaign of response.data) {
        try {
          const analysisResp = await axios.get(`${API}/campaigns/${campaign.id}/analysis`);
          analysesData[campaign.id] = analysisResp.data;
        } catch (err) {
          console.error(`Failed to fetch analysis for ${campaign.id}`);
        }
      }
      setAnalyses(analysesData);
    } catch (error) {
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || campaign.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(campaigns.map(c => c.category))];

  return (
    <div className="min-h-screen py-12" data-testid="discover-page">
      <div className="container px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Discover Campaigns</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Browse AI-analyzed campaigns with success predictions to make informed backing decisions.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-slate-800/50 border-slate-700 h-12"
              data-testid="search-campaigns-input"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48 bg-slate-800/50 border-slate-700 h-12" data-testid="category-filter">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f172a] border-slate-700">
              {categories.map(category => (
                <SelectItem key={category} value={category} className="capitalize">
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Campaigns Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="loader"></div>
          </div>
        ) : filteredCampaigns.length > 0 ? (
          <div className="campaign-grid">
            {filteredCampaigns.map(campaign => (
              <CampaignCard 
                key={campaign.id} 
                campaign={campaign} 
                analysis={analyses[campaign.id]}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20" data-testid="no-campaigns-message">
            <p className="text-xl text-slate-400">No campaigns found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverPage;
