import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, TrendingUp, Target, DollarSign, BarChart3, Search, Sparkles, Zap, AlertCircle, Lightbulb, Users, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [monteCarloData, setMonteCarloData] = useState(null);
  const [competitorData, setCompetitorData] = useState(null);
  const [strategicData, setStrategicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${API}/campaigns`);
      setCampaigns(response.data);
      if (response.data.length > 0) {
        setSelectedCampaign(response.data[0]);
        await fetchAllAnalytics(response.data[0].id);
      }
    } catch (error) {
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllAnalytics = async (campaignId) => {
    setAnalysisLoading(true);
    try {
      const [monteCarloResp, competitorResp, strategicResp] = await Promise.all([
        axios.get(`${API}/analytics/monte-carlo/${campaignId}`),
        axios.get(`${API}/analytics/competitor-analysis/${campaignId}`),
        axios.get(`${API}/analytics/strategic-recommendations/${campaignId}`)
      ]);
      
      setMonteCarloData(monteCarloResp.data);
      setCompetitorData(competitorResp.data);
      setStrategicData(strategicResp.data);
    } catch (error) {
      console.error('Failed to fetch analytics', error);
      toast.error('Failed to load analytics data');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleCampaignChange = (campaignId) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    setSelectedCampaign(campaign);
    fetchAllAnalytics(campaignId);
  };

  const handleRefreshAnalysis = () => {
    if (selectedCampaign) {
      toast.success('Refreshing analysis...');
      fetchAllAnalytics(selectedCampaign.id);
    }
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
      <div className="min-h-screen py-12" data-testid="analytics-page">
        <div className="container px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">No Campaigns Available</h1>
          <p className="text-slate-400 mb-8">Create your first campaign to access analytics.</p>
          <Button onClick={() => navigate('/create-campaign')}>
            Create Campaign
          </Button>
        </div>
      </div>
    );
  }

  const fundingPercentage = (selectedCampaign.raised_amount / selectedCampaign.goal_amount) * 100;

  return (
    <div className="min-h-screen py-12 bg-[#0a0e1a]" data-testid="analytics-predictions-page">
      <div className="container px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <h1 className="text-5xl font-bold mb-4">Analytics & Predictions</h1>
          <p className="text-lg text-slate-400">Advanced AI-powered insights for your crowdfunding campaigns</p>
        </div>

        {/* Campaign Selector */}
        <div className="bg-[#0f172a] border border-slate-700 rounded-2xl p-6 mb-8">
          <Select value={selectedCampaign.id} onValueChange={handleCampaignChange}>
            <SelectTrigger className="w-full bg-slate-800/50 border-slate-700 h-14 text-lg" data-testid="campaign-selector">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0f172a] border-slate-700 max-h-80">
              {campaigns.map(campaign => (
                <SelectItem key={campaign.id} value={campaign.id} className="text-base py-3">
                  {campaign.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {analysisLoading ? (
          <div className="flex justify-center py-20">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Monte Carlo Simulation */}
              <div className="space-y-8">
                {/* Monte Carlo Simulation */}
                {monteCarloData && (
                  <div className="bg-[#0f172a] border border-slate-700 rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-2">
                      <BarChart3 className="w-6 h-6 text-blue-400" />
                      <h3 className="text-2xl font-bold text-white">Monte Carlo Simulation</h3>
                    </div>
                    <p className="text-slate-400 mb-6 text-sm">Predict funding progression with statistical modeling</p>

                    {/* Three Scenarios */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-red-400 mb-1">₹{monteCarloData.pessimistic.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">Pessimistic</p>
                      </div>
                      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-yellow-400 mb-1">₹{monteCarloData.realistic.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">Realistic</p>
                      </div>
                      <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-green-400 mb-1">${monteCarloData.optimistic.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">Optimistic</p>
                      </div>
                    </div>

                    {/* Success Probability */}
                    <div className="bg-slate-800/30 rounded-xl p-6 mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-bold text-white">Success Probability</h4>
                        <span className="text-3xl font-bold text-white">{monteCarloData.success_probability}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${monteCarloData.success_probability}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Funding Progression Chart */}
                    <div className="bg-slate-800/30 rounded-xl p-4 mb-6" style={{ height: '300px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monteCarloData.progression_data}>
                          <defs>
                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis 
                            dataKey="day" 
                            stroke="#94a3b8"
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                          />
                          <YAxis 
                            stroke="#94a3b8"
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1e293b', 
                              border: '1px solid #475569',
                              borderRadius: '8px'
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="amount" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorAmount)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Key Insights */}
                    <div className="bg-slate-800/30 rounded-xl p-6 mb-4">
                      <h4 className="text-lg font-bold text-white mb-4">Key Insights:</h4>
                      <ul className="space-y-3">
                        {monteCarloData.key_insights.map((insight, idx) => (
                          <li key={idx} className="flex gap-2 text-sm text-slate-300">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      data-testid="run-new-simulation-button"
                      onClick={handleRefreshAnalysis}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Run New Simulation
                    </Button>
                  </div>
                )}

                {/* Success Prediction */}
                {strategicData && (
                  <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/20 rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-2">
                      <Sparkles className="w-6 h-6 text-green-400" />
                      <h3 className="text-2xl font-bold text-white">Success Prediction</h3>
                    </div>
                    <p className="text-slate-400 mb-6 text-sm">AI-powered analysis of campaign success likelihood</p>
                    
                    <div className="bg-green-600/20 rounded-2xl p-8 mb-6">
                      <div className="flex items-center gap-6 mb-4">
                        <div className="text-7xl font-bold text-green-400">
                          {strategicData.success_prediction.percentage}%
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-xl font-semibold text-white">Success Probability</p>
                            <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
                              {strategicData.success_prediction.level}
                            </span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${strategicData.success_prediction.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Market Context */}
                    <div className="bg-slate-800/30 rounded-xl p-6 mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                        <h4 className="text-lg font-bold text-white">Market Context</h4>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-300 mb-1">Category Average:</p>
                          <p className="text-sm text-slate-400">{strategicData.success_prediction.category_average}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-semibold text-slate-300 mb-1">Similar Campaigns:</p>
                          <p className="text-sm text-slate-400">{strategicData.success_prediction.similar_campaigns}</p>
                        </div>
                      </div>
                    </div>

                    {/* Success and Risk Factors */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-green-900/20 border border-green-500/20 rounded-xl p-4">
                        <h4 className="text-md font-bold text-green-400 mb-3">Success Factors</h4>
                        <ul className="space-y-2">
                          {strategicData.success_factors.map((factor, idx) => (
                            <li key={idx} className="flex gap-2 text-xs text-slate-300">
                              <span className="text-green-400">•</span>
                              <span>{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-4">
                        <h4 className="text-md font-bold text-red-400 mb-3 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          Risk Factors
                        </h4>
                        <ul className="space-y-2">
                          {strategicData.risk_factors.map((risk, idx) => (
                            <li key={idx} className="flex gap-2 text-xs text-slate-300">
                              <span className="text-red-400">•</span>
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action Recommendations */}
                    <div className="bg-slate-800/30 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-white mb-4">Action Recommendations</h4>
                      <div className="space-y-3">
                        {strategicData.action_recommendations.map((action, idx) => (
                          <div 
                            key={idx}
                            className="flex gap-3 p-3 bg-slate-700/30 rounded-lg border-l-4"
                            style={{ 
                              borderLeftColor: action.priority === 'High' ? '#f87171' : action.priority === 'Medium' ? '#fbbf24' : '#4ade80'
                            }}
                          >
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-white mb-1">{action.title}</p>
                              <p className="text-xs text-slate-400">{action.description}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold h-fit ${
                              action.priority === 'High' ? 'bg-red-900/50 text-red-300' :
                              action.priority === 'Medium' ? 'bg-yellow-900/50 text-yellow-300' :
                              'bg-green-900/50 text-green-300'
                            }`}>
                              {action.priority}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Competitor Analysis & Strategic Recommendations */}
              <div className="space-y-8">
                {/* Competitor Analysis */}
                {competitorData && (
                  <div className="bg-[#0f172a] border border-slate-700 rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="w-6 h-6 text-purple-400" />
                      <h3 className="text-2xl font-bold text-white">Competitor Analysis</h3>
                    </div>
                    <p className="text-slate-400 mb-6 text-sm">Research similar campaigns and market insights</p>

                    {/* Market Overview */}
                    <div className="bg-purple-900/10 border border-purple-500/20 rounded-xl p-6 mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                        <h4 className="text-lg font-bold text-white">Market Overview</h4>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-semibold text-slate-300 mb-2">Category Performance:</p>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {competitorData.market_overview.category_performance}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <p className="text-xs text-slate-400 mb-1">Average Success Rate:</p>
                          <p className="text-lg font-bold text-purple-400">{competitorData.market_overview.average_success_rate}</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <p className="text-xs text-slate-400 mb-1">Typical Funding:</p>
                          <p className="text-lg font-bold text-purple-400">
                            ${(competitorData.market_overview.typical_funding_min / 1000).toFixed(0)}k to ${(competitorData.market_overview.typical_funding_max / 1000).toFixed(0)}k
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Key Trends */}
                    <div className="bg-slate-800/30 rounded-xl p-6 mb-6">
                      <h4 className="text-lg font-bold text-white mb-4">Key Trends:</h4>
                      <ul className="space-y-2">
                        {competitorData.key_trends.map((trend, idx) => (
                          <li key={idx} className="flex gap-2 text-sm text-slate-300">
                            <span className="text-purple-400">•</span>
                            <span>{trend}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Top Competitors */}
                    {competitorData.top_competitors && competitorData.top_competitors.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Users className="w-5 h-5 text-purple-400" />
                          <h4 className="text-lg font-bold text-white">Top Competitors</h4>
                        </div>
                        
                        <div className="space-y-4">
                          {competitorData.top_competitors.map((competitor, idx) => (
                            <div key={idx} className="bg-slate-800/30 border border-slate-700 rounded-xl p-5">
                              <div className="flex items-start justify-between mb-3">
                                <h5 className="text-md font-bold text-white flex-1">{competitor.name}</h5>
                                <span className="text-lg font-bold text-purple-400 ml-2">
                                  ${(competitor.funding / 1000).toFixed(0)}k
                                </span>
                              </div>
                              
                              <p className="text-sm text-slate-400 mb-3">{competitor.description}</p>
                              
                              <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-3">
                                <p className="text-xs font-semibold text-blue-300 mb-1">Success Factors:</p>
                                <p className="text-xs text-slate-400">{competitor.success_factors}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                      data-testid="refresh-competitor-analysis-button"
                      onClick={handleRefreshAnalysis}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Analysis
                    </Button>
                  </div>
                )}

                {/* Strategic Recommendations */}
                {strategicData && strategicData.strategic_recommendations && (
                  <div className="bg-[#0f172a] border border-slate-700 rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Lightbulb className="w-6 h-6 text-yellow-400" />
                      <h3 className="text-2xl font-bold text-white">Strategic Recommendations</h3>
                    </div>

                    <div className="space-y-4">
                      {strategicData.strategic_recommendations.map((rec, idx) => (
                        <div 
                          key={idx}
                          className="rounded-xl p-6"
                          style={{ 
                            backgroundColor: rec.priority === 'High' ? 'rgba(254, 243, 199, 0.1)' : 'rgba(209, 250, 229, 0.1)',
                            border: `1px solid ${rec.priority === 'High' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(52, 211, 153, 0.2)'}`
                          }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-bold text-white">{rec.category}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              rec.priority === 'High' ? 'bg-yellow-900/50 text-yellow-300' : 'bg-green-900/50 text-green-300'
                            }`}>
                              {rec.priority}
                            </span>
                          </div>
                          
                          <p className="text-sm text-slate-300 mb-3">{rec.description}</p>
                          
                          {rec.reward_tiers && (
                            <div className="bg-slate-800/50 rounded-lg p-4 mt-4">
                              <p className="text-sm font-semibold text-green-400 mb-3">Optimal Reward Tiers:</p>
                              <ul className="space-y-2">
                                {rec.reward_tiers.map((tier, tidx) => (
                                  <li key={tidx} className="flex gap-2 text-sm text-slate-300">
                                    <span className="text-green-400 font-bold">•</span>
                                    <span><strong>${tier.amount}</strong> - {tier.description}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
