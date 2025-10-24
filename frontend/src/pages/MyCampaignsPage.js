import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Sparkles, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MyCampaignsPage = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCampaigns();
  }, []);

  const fetchMyCampaigns = async () => {
    try {
      const response = await axios.get(`${API}/my-campaigns`);
      setCampaigns(response.data);
    } catch (error) {
      toast.error('Failed to load your campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;

    try {
      await axios.delete(`${API}/campaigns/${id}`);
      setCampaigns(campaigns.filter(c => c.id !== id));
      toast.success('Campaign deleted');
    } catch (error) {
      toast.error('Failed to delete campaign');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" data-testid="my-campaigns-page">
      <div className="container px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-bold mb-2">My Campaigns</h1>
            <p className="text-lg text-slate-400">Manage and track your crowdfunding campaigns</p>
          </div>
          <Button
            onClick={() => navigate('/create-campaign')}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            data-testid="create-new-campaign-button"
          >
            Create New Campaign
          </Button>
        </div>

        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map(campaign => {
              const fundingPercentage = (campaign.raised_amount / campaign.goal_amount) * 100;
              return (
                <div key={campaign.id} className="bg-slate-800/30 border border-slate-700 rounded-2xl overflow-hidden" data-testid={`my-campaign-card-${campaign.id}`}>
                  <img
                    src={campaign.image_url || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop'}
                    alt={campaign.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs uppercase font-semibold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">
                        {campaign.category}
                      </span>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        campaign.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-slate-500/10 text-slate-400'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3">{campaign.title}</h3>
                    
                    <div className="progress-bar mb-4">
                      <div className="progress-fill" style={{ width: `${Math.min(fundingPercentage, 100)}%` }}></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-400">Raised</p>
                        <p className="text-lg font-bold text-purple-400">${campaign.raised_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Goal</p>
                        <p className="text-lg font-bold">${campaign.goal_amount.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4 text-sm text-slate-400">
                      <span>{campaign.backers_count} backers</span>
                      <span>{Math.round(fundingPercentage)}% funded</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => navigate(`/campaign/${campaign.id}`)}
                        className="flex-1 bg-slate-700 hover:bg-slate-600"
                        data-testid={`view-campaign-button-${campaign.id}`}
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => handleDelete(campaign.id)}
                        variant="outline"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        data-testid={`delete-campaign-button-${campaign.id}`}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20" data-testid="no-campaigns-message">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-slate-500" />
            <h3 className="text-2xl font-bold mb-2">No campaigns yet</h3>
            <p className="text-slate-400 mb-8">Create your first campaign to get started</p>
            <Button
              onClick={() => navigate('/create-campaign')}
              className="bg-gradient-to-r from-purple-500 to-blue-500"
            >
              Create Campaign
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCampaignsPage;
