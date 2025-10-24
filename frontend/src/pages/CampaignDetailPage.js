import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Sparkles, Users, TrendingUp, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CampaignDetailPage = () => {
  const { id } = useParams();
  const { user, setShowAuthModal } = useContext(AuthContext);
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [pledging, setPledging] = useState(false);

  useEffect(() => {
    fetchCampaignDetails();
    checkPaymentStatus();
  }, [id]);

  const checkPaymentStatus = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId) {
      pollPaymentStatus(sessionId, 0);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const pollPaymentStatus = async (sessionId, attempts) => {
    if (attempts >= 5) {
      toast.info('Payment processing - please check back shortly');
      return;
    }

    try {
      const response = await axios.get(`${API}/payments/status/${sessionId}`);
      
      if (response.data.payment_status === 'paid') {
        toast.success('Payment successful! Thank you for backing this campaign.');
        fetchCampaignDetails(); // Refresh campaign data
        return;
      }
      
      // Continue polling
      setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), 2000);
    } catch (error) {
      console.error('Payment status error:', error);
    }
  };

  const fetchCampaignDetails = async () => {
    try {
      const [campaignResp, analysisResp, commentsResp] = await Promise.all([
        axios.get(`${API}/campaigns/${id}`),
        axios.get(`${API}/campaigns/${id}/analysis`),
        axios.get(`${API}/campaigns/${id}/comments`)
      ]);
      
      setCampaign(campaignResp.data);
      setAnalysis(analysisResp.data);
      setComments(commentsResp.data);
    } catch (error) {
      toast.error('Failed to load campaign');
      navigate('/discover');
    } finally {
      setLoading(false);
    }
  };

  const handlePledge = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setPledging(true);
    try {
      const originUrl = window.location.origin;
      const response = await axios.post(`${API}/payments/create-checkout`, {
        campaign_id: id,
        origin_url: originUrl
      });
      
      // Redirect to Stripe checkout
      window.location.href = response.data.url;
    } catch (error) {
      toast.error('Failed to initiate payment');
      setPledging(false);
    }
  };

  const handleComment = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`${API}/campaigns/${id}/comments`, {
        content: newComment
      });
      
      setComments([response.data, ...comments]);
      setNewComment('');
      toast.success('Comment posted!');
    } catch (error) {
      toast.error('Failed to post comment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (!campaign) return null;

  const fundingPercentage = (campaign.raised_amount / campaign.goal_amount) * 100;

  return (
    <div className="min-h-screen py-12" data-testid="campaign-detail-page">
      <div className="container px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Campaign Image */}
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src={campaign.image_url || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=600&fit=crop'}
                alt={campaign.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute top-4 right-4 px-4 py-2 bg-slate-900/90 backdrop-blur-sm rounded-xl">
                <span className="text-sm font-semibold uppercase">{campaign.category}</span>
              </div>
            </div>

            {/* Campaign Info */}
            <div>
              <h1 className="text-4xl font-bold mb-4" data-testid="campaign-title">{campaign.title}</h1>
              <div className="flex items-center gap-3 mb-6">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500">
                    {campaign.creator_name?.charAt(0) || 'C'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">by {campaign.creator_name || 'Campaign Creator'}</p>
                  <p className="text-sm text-slate-400">Creator</p>
                </div>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-slate-300 leading-relaxed">{campaign.description}</p>
              </div>
            </div>

            {/* AI Analysis */}
            {analysis && (
              <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-2xl p-6" data-testid="ai-analysis-section">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">AI Success Prediction</h3>
                    <p className="text-sm text-slate-400">Powered by advanced AI analysis</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl font-bold gradient-text" data-testid="success-probability">
                    {Math.round(analysis.success_probability)}%
                  </div>
                  <div className="text-slate-300">
                    <p className="font-semibold">Success Probability</p>
                    <p className="text-sm text-slate-400">Based on multiple factors</p>
                  </div>
                </div>
                <p className="text-slate-300">{analysis.analysis_text}</p>
              </div>
            )}

            {/* Comments Section */}
            <div data-testid="comments-section">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                Comments ({comments.length})
              </h3>
              
              {user && (
                <div className="mb-6">
                  <Textarea
                    placeholder="Share your thoughts about this campaign..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mb-3 bg-slate-800/50 border-slate-700"
                    data-testid="comment-input"
                  />
                  <Button 
                    onClick={handleComment}
                    className="bg-gradient-to-r from-purple-500 to-blue-500"
                    data-testid="post-comment-button"
                  >
                    Post Comment
                  </Button>
                </div>
              )}
              
              <div className="space-y-4">
                {comments.length > 0 ? comments.map(comment => (
                  <div key={comment.id} className="bg-slate-800/30 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-sm">
                          {comment.user_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold mb-1">{comment.user_name}</p>
                        <p className="text-slate-300">{comment.content}</p>
                        <p className="text-xs text-slate-500 mt-2">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-slate-400 text-center py-8">No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 sticky top-24">
              <div className="mb-6">
                <p className="text-3xl font-bold text-purple-400 mb-1">
                  ${campaign.raised_amount.toLocaleString()}
                </p>
                <p className="text-slate-400">pledged of ${campaign.goal_amount.toLocaleString()} goal</p>
              </div>

              <div className="progress-bar mb-6">
                <div className="progress-fill" style={{ width: `${Math.min(fundingPercentage, 100)}%` }}></div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Backers</span>
                  </div>
                  <p className="text-2xl font-bold">{campaign.backers_count}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">Funded</span>
                  </div>
                  <p className="text-2xl font-bold">{Math.round(fundingPercentage)}%</p>
                </div>
              </div>

              <Button 
                onClick={handlePledge}
                disabled={pledging}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 py-6 text-lg font-bold"
                data-testid="back-project-button"
              >
                {pledging ? 'Processing...' : 'Back This Project'}
              </Button>
              
              <p className="text-xs text-slate-500 mt-4 text-center">
                Secure payment powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailPage;
