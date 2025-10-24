import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { AuthContext } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Sparkles, Target, Gift, TrendingUp, X, Plus, Check, Lightbulb, Brain, LineChart, Megaphone } from 'lucide-react';
import { toast } from 'sonner';

const CreateCampaignPageNew = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Step 1: Campaign Basics
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    goal_amount: '',
    duration_days: '30',
    status: 'active',
    tags: [],
    image_url: ''
  });

  const [tagInput, setTagInput] = useState('');

  // Step 2: Reward Tiers
  const [rewardTiers, setRewardTiers] = useState([]);
  const [newReward, setNewReward] = useState({ amount: '', description: '' });

  // Step 3: AI Optimization
  const [aiData, setAiData] = useState({
    suggestedTitles: [],
    enhancedDescription: '',
    successPrediction: null,
    marketingStrategy: null
  });

  const categories = ['Education', 'Technology', 'Health', 'Environment', 'Arts', 'Community', 'Innovation', 'Sports'];
  const statusOptions = ['draft', 'active'];

  const steps = [
    { number: 1, title: 'Campaign Basics', icon: Target },
    { number: 2, title: 'Reward Tiers', icon: Gift },
    { number: 3, title: 'AI Optimization', icon: Sparkles }
  ];

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleAddReward = () => {
    if (newReward.amount && newReward.description) {
      setRewardTiers([...rewardTiers, { ...newReward, amount: parseFloat(newReward.amount) }]);
      setNewReward({ amount: '', description: '' });
    }
  };

  const handleRemoveReward = (index) => {
    setRewardTiers(rewardTiers.filter((_, i) => i !== index));
  };

  const handleOptimizeTitle = async () => {
    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Please fill in title, description, and category first');
      return;
    }

    setAiLoading(true);
    try {
      const response = await axiosInstance.post('/ai/optimize-title', {
        title: formData.title,
        description: formData.description,
        category: formData.category
      });
      setAiData({ ...aiData, suggestedTitles: response.data.titles });
      toast.success('Title suggestions generated!');
    } catch (error) {
      toast.error('Failed to generate title suggestions');
    } finally {
      setAiLoading(false);
    }
  };

  const handleEnhanceDescription = async () => {
    if (!formData.title || !formData.description || !formData.category || !formData.goal_amount) {
      toast.error('Please fill in all basic fields first');
      return;
    }

    setAiLoading(true);
    try {
      const response = await axiosInstance.post('/ai/enhance-description', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        goal_amount: parseFloat(formData.goal_amount)
      });
      setAiData({ ...aiData, enhancedDescription: response.data.enhanced_description });
      toast.success('Description enhanced!');
    } catch (error) {
      toast.error('Failed to enhance description');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSuccessPrediction = async () => {
    if (!formData.title || !formData.description || !formData.category || !formData.goal_amount) {
      toast.error('Please fill in all basic fields first');
      return;
    }

    setAiLoading(true);
    try {
      const response = await axiosInstance.post('/ai/success-prediction', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        goal_amount: parseFloat(formData.goal_amount),
        reward_tiers: rewardTiers
      });
      setAiData({ ...aiData, successPrediction: response.data });
      toast.success('Success prediction calculated!');
    } catch (error) {
      toast.error('Failed to generate success prediction');
    } finally {
      setAiLoading(false);
    }
  };

  const handleMarketingStrategy = async () => {
    if (!formData.title || !formData.description || !formData.category || !formData.goal_amount) {
      toast.error('Please fill in all basic fields first');
      return;
    }

    setAiLoading(true);
    try {
      const response = await axiosInstance.post('/ai/marketing-strategy', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        goal_amount: parseFloat(formData.goal_amount)
      });
      setAiData({ ...aiData, marketingStrategy: response.data });
      toast.success('Marketing strategy generated!');
    } catch (error) {
      toast.error('Failed to generate marketing strategy');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const campaignData = {
        ...formData,
        goal_amount: parseFloat(formData.goal_amount),
        duration_days: parseInt(formData.duration_days),
        reward_tiers: rewardTiers,
        description: aiData.enhancedDescription || formData.description
      };

      const response = await axiosInstance.post('/campaigns/extended', campaignData);
      toast.success('Campaign created successfully!');
      navigate(`/campaign/${response.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <Card className="bg-slate-800/30 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-400" />
            Campaign Basics
          </CardTitle>
          <CardDescription>Tell us about your campaign</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Campaign Title *</Label>
            <Input
              id="title"
              placeholder="Enter a compelling campaign title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="bg-slate-800/50 border-slate-700 mt-2"
            />
          </div>

          <div>
            <Label htmlFor="description">Campaign Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your campaign in detail"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={6}
              className="bg-slate-800/50 border-slate-700 mt-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="goal_amount">Funding Goal ($) *</Label>
              <Input
                id="goal_amount"
                type="number"
                placeholder="10000"
                value={formData.goal_amount}
                onChange={(e) => setFormData({ ...formData, goal_amount: e.target.value })}
                required
                min="100"
                className="bg-slate-800/50 border-slate-700 mt-2"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700 mt-2">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f172a] border-slate-700">
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration_days">Campaign Duration (days) *</Label>
              <Input
                id="duration_days"
                type="number"
                placeholder="30"
                value={formData.duration_days}
                onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                required
                min="1"
                max="90"
                className="bg-slate-800/50 border-slate-700 mt-2"
              />
            </div>

            <div>
              <Label htmlFor="status">Status *</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700 mt-2">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f172a] border-slate-700">
                  {statusOptions.map(status => (
                    <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="tags"
                placeholder="Add tags (press Enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="bg-slate-800/50 border-slate-700"
              />
              <Button type="button" onClick={handleAddTag} variant="outline" className="border-slate-700">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="ml-2">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="image_url">Image URL (Optional)</Label>
            <Input
              id="image_url"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="bg-slate-800/50 border-slate-700 mt-2"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={() => setCurrentStep(2)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          Next: Reward Tiers
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <Card className="bg-slate-800/30 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-purple-400" />
            Reward Tiers
          </CardTitle>
          <CardDescription>Add reward tiers for backers (Optional)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Add New Reward Tier</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reward_amount">Amount ($)</Label>
                <Input
                  id="reward_amount"
                  type="number"
                  placeholder="25"
                  value={newReward.amount}
                  onChange={(e) => setNewReward({ ...newReward, amount: e.target.value })}
                  min="1"
                  className="bg-slate-800/50 border-slate-700 mt-2"
                />
              </div>
              <div>
                <Label htmlFor="reward_description">Description</Label>
                <Input
                  id="reward_description"
                  placeholder="Digital copy of the product"
                  value={newReward.description}
                  onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 mt-2"
                />
              </div>
            </div>
            <Button 
              onClick={handleAddReward} 
              className="mt-4 w-full bg-purple-500 hover:bg-purple-600"
              disabled={!newReward.amount || !newReward.description}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Reward Tier
            </Button>
          </div>

          {rewardTiers.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold">Current Reward Tiers</h4>
              {rewardTiers.map((tier, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <div>
                    <div className="font-bold text-lg text-purple-400">${tier.amount}</div>
                    <div className="text-sm text-slate-300">{tier.description}</div>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleRemoveReward(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {rewardTiers.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Gift className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No reward tiers added yet. You can skip this step if you prefer.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          onClick={() => setCurrentStep(1)}
          variant="outline"
          className="border-slate-700"
        >
          Back
        </Button>
        <Button 
          onClick={() => setCurrentStep(3)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          Next: AI Optimization
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Optimize Title */}
      <Card className="bg-slate-800/30 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-blue-400" />
            Optimize Title
          </CardTitle>
          <CardDescription>Generate compelling campaign titles that attract backers</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleOptimizeTitle} 
            disabled={aiLoading || !formData.title}
            className="w-full bg-blue-500 hover:bg-blue-600 mb-4"
          >
            {aiLoading ? 'Generating...' : 'Generate Title Suggestions'}
          </Button>

          {aiData.suggestedTitles.length > 0 && (
            <div className="space-y-2">
              <Label>Suggested Titles:</Label>
              {aiData.suggestedTitles.map((title, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between bg-slate-800/50 border border-slate-700 rounded-lg p-3 cursor-pointer hover:bg-slate-800/70 transition-colors"
                  onClick={() => setFormData({ ...formData, title })}
                >
                  <span className="text-sm">{title}</span>
                  <Button size="sm" variant="ghost">
                    <Check className="w-4 h-4 text-green-400" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhance Description */}
      <Card className="bg-slate-800/30 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            Enhance Description
          </CardTitle>
          <CardDescription>Improve your campaign story with persuasive copy</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleEnhanceDescription} 
            disabled={aiLoading || !formData.description}
            className="w-full bg-purple-500 hover:bg-purple-600 mb-4"
          >
            {aiLoading ? 'Enhancing...' : 'Enhance Description'}
          </Button>

          {aiData.enhancedDescription && (
            <div className="space-y-3">
              <Label>Improved Description:</Label>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 max-h-60 overflow-y-auto">
                <p className="text-sm whitespace-pre-wrap">{aiData.enhancedDescription}</p>
              </div>
              <Button 
                onClick={() => setFormData({ ...formData, description: aiData.enhancedDescription })}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                Apply Enhanced Description
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Success Prediction */}
      <Card className="bg-slate-800/30 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="w-6 h-6 text-green-400" />
            Success Prediction
          </CardTitle>
          <CardDescription>Get AI insights on your campaign's success probability</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleSuccessPrediction} 
            disabled={aiLoading}
            className="w-full bg-green-500 hover:bg-green-600 mb-4"
          >
            {aiLoading ? 'Calculating...' : 'Calculate Success Probability'}
          </Button>

          {aiData.successPrediction && (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-green-400">{aiData.successPrediction.success_percentage}%</div>
                  <Badge className="mt-2 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                    {aiData.successPrediction.confidence_level} Confidence
                  </Badge>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <p className="text-sm text-slate-300">{aiData.successPrediction.analysis}</p>
              </div>

              <div>
                <h5 className="font-semibold mb-2">Recommendations:</h5>
                <ul className="space-y-2">
                  {aiData.successPrediction.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Marketing Strategy */}
      <Card className="bg-slate-800/30 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-orange-400" />
            Marketing Strategy
          </CardTitle>
          <CardDescription>Generate a comprehensive marketing plan</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleMarketingStrategy} 
            disabled={aiLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 mb-4"
          >
            {aiLoading ? 'Generating...' : 'Generate Marketing Strategy'}
          </Button>

          {aiData.marketingStrategy && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <h5 className="font-semibold mb-2">Overview</h5>
                <p className="text-sm text-slate-300">{aiData.marketingStrategy.overview}</p>
              </div>

              {aiData.marketingStrategy.channels && (
                <div>
                  <h5 className="font-semibold mb-2">Marketing Channels</h5>
                  <div className="space-y-2">
                    {aiData.marketingStrategy.channels.map((channel, index) => (
                      <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">{channel.name}</span>
                          <Badge className={`text-xs ${
                            channel.priority === 'High' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                            channel.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                            'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          }`}>
                            {channel.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400">{channel.strategy}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {aiData.marketingStrategy.key_messages && (
                <div>
                  <h5 className="font-semibold mb-2">Key Messages</h5>
                  <ul className="space-y-1">
                    {aiData.marketingStrategy.key_messages.map((msg, index) => (
                      <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="text-orange-400">•</span>
                        <span>{msg}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          onClick={() => setCurrentStep(2)}
          variant="outline"
          className="border-slate-700"
        >
          Back
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={loading || !formData.title || !formData.description || !formData.category || !formData.goal_amount}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-8"
        >
          {loading ? 'Creating Campaign...' : 'Create Campaign'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-12" data-testid="create-campaign-page-new">
      <div className="container px-6 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-semibold">AI-Powered Campaign Builder</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">Create Your Campaign</h1>
          <p className="text-lg text-slate-400">
            Build your campaign in 3 easy steps with AI-powered optimization
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      isActive ? 'bg-purple-500 border-purple-500' :
                      isCompleted ? 'bg-green-500 border-green-500' :
                      'bg-slate-800 border-slate-700'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-6 h-6 text-white" />
                      ) : (
                        <Icon className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <span className={`mt-2 text-sm font-medium ${
                      isActive ? 'text-purple-400' : 'text-slate-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-slate-700'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Steps Content */}
        <div className="max-w-3xl mx-auto">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignPageNew;
