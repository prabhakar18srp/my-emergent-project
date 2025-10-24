import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { TrendingUp, Users, Target, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [campaignsResp, statsResp] = await Promise.all([
        axios.get(`${API}/admin/campaigns`),
        axios.get(`${API}/admin/stats`)
      ]);
      
      setCampaigns(campaignsResp.data);
      setStats(statsResp.data);
      
      // Fetch all users (we'll add an endpoint for this)
      try {
        const usersResp = await axios.get(`${API}/admin/users`);
        setUsers(usersResp.data);
      } catch (err) {
        console.error('Failed to load users:', err);
        setUsers([]);
      }
    } catch (error) {
      toast.error('Failed to load admin data');
      if (error.response?.status === 403) {
        navigate('/');
      }
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
    <div className="min-h-screen py-12" data-testid="admin-dashboard">
      <div className="container px-6">
        <h1 className="text-5xl font-bold mb-12">Admin Dashboard</h1>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8 text-purple-400" />
                <span className="text-2xl">🎯</span>
              </div>
              <p className="text-sm text-slate-400 mb-1">Total Campaigns</p>
              <p className="text-3xl font-bold">{stats.total_campaigns}</p>
            </div>

            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <span className="text-2xl">📈</span>
              </div>
              <p className="text-sm text-slate-400 mb-1">Active Campaigns</p>
              <p className="text-3xl font-bold">{stats.active_campaigns}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-blue-400" />
                <span className="text-2xl">👥</span>
              </div>
              <p className="text-sm text-slate-400 mb-1">Total Users</p>
              <p className="text-3xl font-bold">{stats.total_users}</p>
            </div>

            <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-amber-400" />
                <span className="text-2xl">💰</span>
              </div>
              <p className="text-sm text-slate-400 mb-1">Total Raised</p>
              <p className="text-3xl font-bold">₹{stats.total_raised.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Campaigns Table */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold">All Campaigns</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="text-left p-4 font-semibold">Campaign</th>
                  <th className="text-left p-4 font-semibold">Category</th>
                  <th className="text-left p-4 font-semibold">Creator</th>
                  <th className="text-left p-4 font-semibold">Goal</th>
                  <th className="text-left p-4 font-semibold">Raised</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(campaign => (
                  <tr key={campaign.id} className="border-t border-slate-700 hover:bg-slate-800/30" data-testid={`admin-campaign-row-${campaign.id}`}>
                    <td className="p-4">
                      <p className="font-semibold">{campaign.title}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm">
                        {campaign.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{campaign.creator_name}</td>
                    <td className="p-4">${campaign.goal_amount.toLocaleString()}</td>
                    <td className="p-4 text-purple-400 font-semibold">${campaign.raised_amount.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        campaign.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-slate-500/10 text-slate-400'
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => navigate(`/campaign/${campaign.id}`)}
                          className="bg-slate-700 hover:bg-slate-600"
                          data-testid={`admin-view-button-${campaign.id}`}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => navigate(`/campaign/${campaign.id}/edit`)}
                          className="bg-blue-600 hover:bg-blue-500"
                          data-testid={`admin-edit-button-${campaign.id}`}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(campaign.id)}
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          data-testid={`admin-delete-button-${campaign.id}`}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users Table */}
        {users.length > 0 && (
          <div className="bg-slate-800/30 border border-slate-700 rounded-2xl overflow-hidden mt-8">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-2xl font-bold">All Users</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="text-left p-4 font-semibold">User</th>
                    <th className="text-left p-4 font-semibold">Email</th>
                    <th className="text-left p-4 font-semibold">Role</th>
                    <th className="text-left p-4 font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-t border-slate-700 hover:bg-slate-800/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <p className="font-semibold">{user.name}</p>
                        </div>
                      </td>
                      <td className="p-4 text-slate-400">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          user.is_admin ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-500/10 text-slate-400'
                        }`}>
                          {user.is_admin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
