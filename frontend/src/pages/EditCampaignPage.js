import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const EditCampaignPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [campaign, setCampaign] = useState({
    title: '',
    description: '',
    category: '',
    goal_amount: '',
    image_url: '',
    status: 'active'
  });

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const response = await axios.get(`${API}/campaigns/${id}`);
      setCampaign({
        title: response.data.title,
        description: response.data.description,
        category: response.data.category,
        goal_amount: response.data.goal_amount,
        image_url: response.data.image_url || '',
        status: response.data.status
      });
    } catch (error) {
      toast.error('Failed to load campaign');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData = {
        title: campaign.title,
        description: campaign.description,
        category: campaign.category,
        goal_amount: parseFloat(campaign.goal_amount),
        image_url: campaign.image_url || null,
        status: campaign.status
      };

      await axios.put(`${API}/campaigns/${id}`, updateData);
      toast.success('Campaign updated successfully!');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update campaign');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampaign(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-4xl px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate('/admin')}
            variant="ghost"
            className="hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Admin
          </Button>
        </div>

        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8">
          <h1 className="text-3xl font-bold mb-8">Edit Campaign</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Campaign Title</label>
              <Input
                name="title"
                value={campaign.title}
                onChange={handleChange}
                placeholder="Enter campaign title"
                required
                className="bg-slate-900/50 border-slate-600"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                name="description"
                value={campaign.description}
                onChange={handleChange}
                placeholder="Enter campaign description"
                rows={6}
                required
                className="bg-slate-900/50 border-slate-600"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={campaign.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select a category</option>
                <option value="Technology">Technology</option>
                <option value="Art">Art</option>
                <option value="Music">Music</option>
                <option value="Film">Film</option>
                <option value="Games">Games</option>
                <option value="Food">Food</option>
                <option value="Fashion">Fashion</option>
                <option value="Publishing">Publishing</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Environment">Environment</option>
                <option value="Community">Community</option>
              </select>
            </div>

            {/* Goal Amount */}
            <div>
              <label className="block text-sm font-medium mb-2">Goal Amount ($)</label>
              <Input
                type="number"
                name="goal_amount"
                value={campaign.goal_amount}
                onChange={handleChange}
                placeholder="10000"
                min="1"
                step="0.01"
                required
                className="bg-slate-900/50 border-slate-600"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium mb-2">Image URL (optional)</label>
              <Input
                name="image_url"
                value={campaign.image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="bg-slate-900/50 border-slate-600"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                name="status"
                value={campaign.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                onClick={() => navigate('/admin')}
                variant="outline"
                className="border-slate-600"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCampaignPage;
