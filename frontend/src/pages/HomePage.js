import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Sparkles, TrendingUp, Users } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CampaignCard = ({ campaign }) => {
  const navigate = useNavigate();
  const fundingPercentage = (campaign.raised_amount / campaign.goal_amount) * 100;

  return (
    <div className="bg-[#0f172a] border border-slate-700 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all group">
      <div className="relative">
        <img
          src={campaign.image_url || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop'}
          alt={campaign.title}
          className="w-full h-56 object-cover"
        />
        <div className="absolute top-4 right-4 px-3 py-1.5 bg-slate-900/90 backdrop-blur-sm rounded-full text-xs font-semibold uppercase">
          {campaign.category}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
          {campaign.title}
        </h3>
        <p className="text-sm text-slate-400 mb-4 line-clamp-2">
          {campaign.description}
        </p>
        
        <div className="progress-bar mb-4">
          <div className="progress-fill" style={{ width: `${Math.min(fundingPercentage, 100)}%` }}></div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-purple-400">₹{campaign.raised_amount.toLocaleString()}</p>
            <p className="text-xs text-slate-500">of ₹{campaign.goal_amount.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold flex items-center gap-1 justify-end text-slate-300">
              <Users className="w-4 h-4" />
              {campaign.backers_count} Backers
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1 justify-end">
              <TrendingUp className="w-3 h-3" />
              {Math.round(fundingPercentage)}% Funded
            </p>
          </div>
        </div>
        
        <Button
          onClick={() => navigate(`/campaign/${campaign.id}`)}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

const HomePage = () => {
  const { user, setShowAuthModal } = useContext(AuthContext);
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${API}/campaigns`);
      setCampaigns(response.data.slice(0, 6)); // Show first 6 campaigns
    } catch (error) {
      console.error('Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#1a1f35] to-[#0a0e1a]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDEzOSwgOTIsIDI0NiwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        
        {/* Content */}
        <div className="container relative z-10 text-center px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-semibold">AI-Powered Crowdfunding</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6" data-testid="hero-title">
            Fund Smarter with
            <br />
            <span className="gradient-text">AI Insights</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-12" data-testid="hero-subtitle">
            The first crowdfunding platform that predicts campaign success, optimizes your
            strategy, and connects you with the right backers using advanced AI technology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-lg px-8 py-6 rounded-xl"
              onClick={() => user ? navigate('/create-campaign') : setShowAuthModal(true)}
              data-testid="start-campaign-button"
            >
              Start Your Campaign
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-slate-700 hover:bg-slate-800/50 text-lg px-8 py-6 rounded-xl"
              onClick={() => navigate('/discover')}
              data-testid="discover-projects-button"
            >
              Discover Projects
            </Button>
          </div>
        </div>
      </section>

      {/* Discover Campaigns Section */}
      <section className="py-20 bg-gradient-to-b from-[#0a0e1a] to-[#0f172a]">
        <div className="container px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Discover Campaigns</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Explore some of the most promising and innovative projects currently funding on our platform.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="loader"></div>
            </div>
          ) : campaigns.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {campaigns.map(campaign => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
              
              <div className="text-center">
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/discover')}
                  className="border-slate-700 hover:bg-slate-800/50"
                  data-testid="explore-campaigns-button"
                >
                  Explore More Campaigns
                </Button>
              </div>
            </>
          ) : (
            <p className="text-center text-slate-400 py-20">No campaigns available yet.</p>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20"></div>
        <div className="container relative z-10 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <svg className="w-16 h-16 mx-auto mb-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Launch Your Campaign?</h2>
            <p className="text-lg text-slate-300 mb-10">
              Bring your creative idea to life. Our platform gives you the tools and insights to
              build a successful crowdfunding campaign.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-slate-100 text-lg px-8 py-6 rounded-xl font-bold"
              onClick={() => user ? navigate('/create-campaign') : setShowAuthModal(true)}
              data-testid="create-campaign-cta-button"
            >
              Create Campaign
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
