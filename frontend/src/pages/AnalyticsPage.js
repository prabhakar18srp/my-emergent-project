import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import CompetitorAnalysis from '../components/Analytics/CompetitorAnalysis';
import MonteCarloSimulator from '../components/Analytics/MonteCarloSimulator';
import SuccessPrediction from '../components/Analytics/SuccessPrediction';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${API}/campaigns`);
      setCampaigns(response.data);
      if (response.data.length > 0) {
        setSelectedCampaign(response.data[0]);
      }
    } catch (error) {
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignChange = (campaignId) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    setSelectedCampaign(campaign);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (!selectedCampaign) {
    return (
      <div className="min-h-screen py-12 bg-gradient-to-br from-slate-50 to-slate-100" data-testid="analytics-page">
        <div className="container px-6 text-center">
          <h1 className="text-4xl font-bold mb-4 text-slate-800">No Campaigns Available</h1>
          <p className="text-slate-600 mb-8">Create your first campaign to access analytics.</p>
          <Button onClick={() => navigate('/create-campaign')}>
            Create Campaign
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-slate-50 to-slate-100" data-testid="analytics-predictions-page">
      <div className="container px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6"
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <h1 className="text-5xl font-bold mb-4 text-slate-900">Analytics & Predictions</h1>
          <p className="text-lg text-slate-600">Advanced AI-powered insights for your crowdfunding campaigns</p>
        </div>

        {/* Campaign Selector */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-3">Select Campaign</label>
          <Select value={selectedCampaign.id} onValueChange={handleCampaignChange}>
            <SelectTrigger className="w-full bg-white border-slate-300 h-14 text-lg" data-testid="campaign-selector">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 max-h-80">
              {campaigns.map(campaign => (
                <SelectItem key={campaign.id} value={campaign.id} className="text-base py-3">
                  {campaign.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Analytics Components Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <MonteCarloSimulator campaign={selectedCampaign} />
            <SuccessPrediction campaign={selectedCampaign} />
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            <CompetitorAnalysis campaign={selectedCampaign} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
