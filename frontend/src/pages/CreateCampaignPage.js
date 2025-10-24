import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import axiosInstance from '../utils/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Sparkles, TrendingUp, Lightbulb, Target, Check } from 'lucide-react';
import { toast } from 'sonner';

const CreateCampaignPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Step 1: Campaign Basics
  const [campaignData, setCampaignData] = useState({
    title: '',
    description: '',
    category: '',
    goal_amount: '',
    duration_days: 30,
    status: 'active',
    tags: '',
    image_url: ''
  });
  
  // Step 2: Reward Tiers
  const [rewardTiers, setRewardTiers] = useState([
    { amount: '', description: '' }
  ]);
  
  // Step 3: AI Optimization
  const [aiOptimizations, setAiOptimizations] = useState({
    suggestedTitles: [],
    enhancedDescription: '',
    successPrediction: null,
    marketingStrategy: null
  });

  const categories = ['Technology', 'Health', 'Food', 'Environment', 'Education', 'Art', 'Film', 'Music', 'Games', 'Fashion'];

  const handleBasicsChange = (field, value) => {
    setCampaignData(prev => ({ ...prev, [field]: value }));
  };

  const addRewardTier = () => {
    setRewardTiers(prev => [...prev, { amount: '', description: '' }]);
  };

  const removeRewardTier = (index) => {
    setRewardTiers(prev => prev.filter((_, i) => i !== index));
  };

  const updateRewardTier = (index, field, value) => {
    setRewardTiers(prev => prev.map((tier, i) => 
      i === index ? { ...tier, [field]: value } : tier
    ));
  };

  const handleOptimizeTitle = async () => {
    if (!campaignData.title || !campaignData.description || !campaignData.category) {
      toast.error('Please fill in title, description, and category first');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axiosInstance.post('/ai/optimize-title', {
        title: campaignData.title,
        description: campaignData.description,
        category: campaignData.category
      });
      setAiOptimizations(prev => ({ ...prev, suggestedTitles: response.data.titles }));
      toast.success('Title suggestions generated!');
    } catch (error) {
      toast.error('Failed to generate title suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleEnhanceDescription = async () => {
    if (!campaignData.title || !campaignData.description || !campaignData.category || !campaignData.goal_amount) {
      toast.error('Please fill in all basic fields first');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axiosInstance.post('/ai/enhance-description', {
        title: campaignData.title,
        description: campaignData.description,
        category: campaignData.category,
        goal_amount: parseFloat(campaignData.goal_amount)
      });
      setAiOptimizations(prev => ({ ...prev, enhancedDescription: response.data.enhanced_description }));
      toast.success('Description enhanced!');
    } catch (error) {
      toast.error('Failed to enhance description');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessPrediction = async () => {
    if (!campaignData.title || !campaignData.description || !campaignData.category || !campaignData.goal_amount) {
      toast.error('Please fill in all basic fields first');
      return;
    }
    
    setLoading(true);
    try {
      const validTiers = rewardTiers.filter(tier => tier.amount && tier.description);
      const response = await axiosInstance.post('/ai/success-prediction', {
        title: campaignData.title,
        description: campaignData.description,
        category: campaignData.category,
        goal_amount: parseFloat(campaignData.goal_amount),
        reward_tiers: validTiers.map(tier => ({ amount: parseFloat(tier.amount), description: tier.description }))
      });
      setAiOptimizations(prev => ({ ...prev, successPrediction: response.data }));
      toast.success('Success prediction generated!');
    } catch (error) {
      toast.error('Failed to generate success prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleMarketingStrategy = async () => {
    if (!campaignData.title || !campaignData.description || !campaignData.category || !campaignData.goal_amount) {
      toast.error('Please fill in all basic fields first');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axiosInstance.post('/ai/marketing-strategy', {
        title: campaignData.title,
        description: campaignData.description,
        category: campaignData.category,
        goal_amount: parseFloat(campaignData.goal_amount)
      });
      setAiOptimizations(prev => ({ ...prev, marketingStrategy: response.data }));
      toast.success('Marketing strategy generated!');
    } catch (error) {
      toast.error('Failed to generate marketing strategy');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!campaignData.title || !campaignData.description || !campaignData.category || !campaignData.goal_amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const validTiers = rewardTiers.filter(tier => tier.amount && tier.description);
      const tagsArray = campaignData.tags ? campaignData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
      
      const finalDescription = aiOptimizations.enhancedDescription || campaignData.description;
      
      const payload = {
        title: campaignData.title,
        description: finalDescription,
        category: campaignData.category,
        goal_amount: parseFloat(campaignData.goal_amount),
        duration_days: parseInt(campaignData.duration_days),
        status: campaignData.status,
        tags: tagsArray,
        reward_tiers: validTiers.map(tier => ({ amount: parseFloat(tier.amount), description: tier.description })),
        image_url: campaignData.image_url || null
      };

      const response = await axiosInstance.post('/campaigns/extended', payload);
      toast.success('Campaign created successfully!');
      navigate(`/campaign/${response.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 space-x-4">
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <div className="flex items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep === step 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                  : currentStep > step
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              {currentStep > step ? <Check className="w-5 h-5" /> : step}
            </div>
            <span className={`ml-2 ${currentStep === step ? 'text-white font-semibold' : 'text-slate-400'}`}>
              {step === 1 ? 'Campaign Basics' : step === 2 ? 'Reward Tiers' : 'AI Optimization'}
            </span>
          </div>
          {step < 3 && <div className="w-16 h-1 bg-slate-700"></div>}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700" data-testid="campaign-basics-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            Campaign Basics
          </CardTitle>
          <CardDescription>Essential information about your campaign</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Campaign Title *</Label>
            <Input
              id="title"
              placeholder="e.g., BrightFutures: Empowering Underserved Youth with STEM Education"
              value={campaignData.title}
              onChange={(e) => handleBasicsChange('title', e.target.value)}
              className="bg-slate-900/50 border-slate-600"
              data-testid="campaign-title-input"
            />
          </div>

          <div>
            <Label htmlFor="description">Campaign Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your campaign in detail..."
              value={campaignData.description}
              onChange={(e) => handleBasicsChange('description', e.target.value)}
              className="bg-slate-900/50 border-slate-600 min-h-[150px]"
              data-testid="campaign-description-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="goal">Funding Goal ($) *</Label>
              <Input
                id="goal"
                type="number"
                placeholder="50000"
                value={campaignData.goal_amount}
                onChange={(e) => handleBasicsChange('goal_amount', e.target.value)}
                className="bg-slate-900/50 border-slate-600"
                data-testid="campaign-goal-input"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={campaignData.category} onValueChange={(value) => handleBasicsChange('category', value)}>
                <SelectTrigger className="bg-slate-900/50 border-slate-600" data-testid="campaign-category-select">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Campaign Duration (days) *</Label>
              <Input
                id="duration"
                type="number"
                value={campaignData.duration_days}
                onChange={(e) => handleBasicsChange('duration_days', e.target.value)}
                className="bg-slate-900/50 border-slate-600"
                data-testid="campaign-duration-input"
              />
            </div>

            <div>
              <Label htmlFor="status">Status *</Label>
              <Select value={campaignData.status} onValueChange={(value) => handleBasicsChange('status', value)}>
                <SelectTrigger className="bg-slate-900/50 border-slate-600" data-testid="campaign-status-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="Add tags (press Enter to add)"
              value={campaignData.tags}
              onChange={(e) => handleBasicsChange('tags', e.target.value)}
              className="bg-slate-900/50 border-slate-600"
              data-testid="campaign-tags-input"
            />
            <p className="text-xs text-slate-400 mt-1">Separate tags with commas</p>
          </div>

          <div>
            <Label htmlFor="image">Campaign Image URL (optional)</Label>
            <Input
              id="image"
              placeholder="https://example.com/image.jpg"
              value={campaignData.image_url}
              onChange={(e) => handleBasicsChange('image_url', e.target.value)}
              className="bg-slate-900/50 border-slate-600"
              data-testid="campaign-image-input"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={() => setCurrentStep(2)}
          className="bg-gradient-to-r from-purple-500 to-blue-500"
          data-testid="next-to-step-2-button"
        >
          Next: Reward Tiers
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700" data-testid="reward-tiers-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Reward Tiers
          </CardTitle>
          <CardDescription>Create reward tiers for your backers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {rewardTiers.map((tier, index) => (
            <div key={index} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Tier {index + 1}</h4>
                {rewardTiers.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRewardTier(index)}
                    className="text-red-400 hover:text-red-300"
                    data-testid={`remove-tier-${index}-button`}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Amount ($)</Label>
                  <Input
                    type="number"
                    placeholder="25"
                    value={tier.amount}
                    onChange={(e) => updateRewardTier(index, 'amount', e.target.value)}
                    className="bg-slate-800 border-slate-600"
                    data-testid={`tier-${index}-amount-input`}
                  />
                </div>
                <div className="col-span-1">
                  <Label>Description</Label>
                  <Input
                    placeholder="Digital copy of the product"
                    value={tier.description}
                    onChange={(e) => updateRewardTier(index, 'description', e.target.value)}
                    className="bg-slate-800 border-slate-600"
                    data-testid={`tier-${index}-description-input`}
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addRewardTier}
            className="w-full border-slate-600 hover:bg-slate-700"
            data-testid="add-reward-tier-button"
          >
            + Add Reward Tier
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => setCurrentStep(1)}
          className="border-slate-600"
          data-testid="back-to-step-1-button"
        >
          Back
        </Button>
        <Button 
          onClick={() => setCurrentStep(3)}
          className="bg-gradient-to-r from-purple-500 to-blue-500"
          data-testid="next-to-step-3-button"
        >
          Next: AI Optimization
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700" data-testid="ai-optimizer-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            AI Campaign Optimizer
          </CardTitle>
          <CardDescription>Enhance your campaign with AI-powered suggestions and insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Optimize Title */}
          <div className="p-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-500/20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  Optimize Title
                </h3>
                <p className="text-sm text-slate-400 mt-1">Generate compelling campaign titles that attract backers</p>
              </div>
              <Button
                onClick={handleOptimizeTitle}
                disabled={loading}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600"
                data-testid="optimize-title-button"
              >
                {loading ? 'Optimizing...' : 'Optimize'}
              </Button>
            </div>
            
            {aiOptimizations.suggestedTitles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-3">Suggested Titles:</h4>
                <div className="space-y-2">
                  {aiOptimizations.suggestedTitles.map((title, index) => (
                    <div key={index} className="p-3 bg-slate-800/50 rounded flex items-center justify-between">
                      <span className="text-sm">{title}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleBasicsChange('title', title)}
                        className="text-blue-400"
                        data-testid={`use-title-${index}-button`}
                      >
                        Use
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enhance Description */}
          <div className="p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-lg border border-purple-500/20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-purple-400" />
                  Enhance Description
                </h3>
                <p className="text-sm text-slate-400 mt-1">Improve your campaign story with persuasive copy</p>
              </div>
              <Button
                onClick={handleEnhanceDescription}
                disabled={loading}
                size="sm"
                className="bg-purple-500 hover:bg-purple-600"
                data-testid="enhance-description-button"
              >
                {loading ? 'Enhancing...' : 'Enhance'}
              </Button>
            </div>
            
            {aiOptimizations.enhancedDescription && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-3">Improved Description:</h4>
                <div className="p-4 bg-slate-800/50 rounded">
                  <p className="text-sm whitespace-pre-wrap">{aiOptimizations.enhancedDescription}</p>
                  <Button
                    size="sm"
                    onClick={() => handleBasicsChange('description', aiOptimizations.enhancedDescription)}
                    className="mt-3 bg-purple-500"
                    data-testid="apply-description-button"
                  >
                    Apply Description
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Success Prediction */}
          <div className="p-6 bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-lg border border-green-500/20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Success Prediction
                </h3>
                <p className="text-sm text-slate-400 mt-1">Get AI insights on your campaign's success probability</p>
              </div>
              <Button
                onClick={handleSuccessPrediction}
                disabled={loading}
                size="sm"
                className="bg-green-500 hover:bg-green-600"
                data-testid="success-prediction-button"
              >
                {loading ? 'Predicting...' : 'Predict'}
              </Button>
            </div>
            
            {aiOptimizations.successPrediction && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-green-400">
                    {aiOptimizations.successPrediction.success_percentage}%
                  </div>
                  <div className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-semibold">
                    {aiOptimizations.successPrediction.confidence_level}
                  </div>
                </div>
                <p className="text-sm text-slate-300">{aiOptimizations.successPrediction.analysis}</p>
                
                {aiOptimizations.successPrediction.recommendations && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Recommendations:</h4>
                    <ul className="space-y-2">
                      {aiOptimizations.successPrediction.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Marketing Strategy */}
          <div className="p-6 bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-lg border border-orange-500/20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-400" />
                  Marketing Strategy
                </h3>
                <p className="text-sm text-slate-400 mt-1">Generate a comprehensive marketing plan</p>
              </div>
              <Button
                onClick={handleMarketingStrategy}
                disabled={loading}
                size="sm"
                className="bg-orange-500 hover:bg-orange-600"
                data-testid="marketing-strategy-button"
              >
                {loading ? 'Generating...' : 'Generate'}
              </Button>
            </div>
            
            {aiOptimizations.marketingStrategy && (
              <div className="mt-4 space-y-4">
                <p className="text-sm text-slate-300">{aiOptimizations.marketingStrategy.overview}</p>
                
                {aiOptimizations.marketingStrategy.channels && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Marketing Channels:</h4>
                    <div className="space-y-2">
                      {aiOptimizations.marketingStrategy.channels.map((channel, index) => (
                        <div key={index} className="p-3 bg-slate-800/50 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-sm">{channel.name}</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              channel.priority === 'High' ? 'bg-red-500/20 text-red-300' : 
                              channel.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' : 
                              'bg-blue-500/20 text-blue-300'
                            }`}>
                              {channel.priority}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{channel.strategy}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => setCurrentStep(2)}
          className="border-slate-600"
          data-testid="back-to-step-2-button"
        >
          Back
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={loading}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          data-testid="submit-campaign-button"
        >
          {loading ? 'Creating Campaign...' : 'Create Campaign'}
        </Button>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-slate-400">Please log in to create a campaign.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" data-testid="create-campaign-page">
      <div className="container max-w-4xl px-6">
        <h1 className="text-4xl font-bold mb-2 text-center">Create Your Campaign</h1>
        <p className="text-slate-400 text-center mb-8">Follow the steps to launch your crowdfunding campaign</p>
        
        {renderStepIndicator()}
        
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default CreateCampaignPage;
