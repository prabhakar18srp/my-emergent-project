import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import axios from 'axios';
import { BarChart3, Play } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function MonteCarloSimulator({ campaign }) {
  const [simulation, setSimulation] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);

  const runSimulation = async () => {
    if (!campaign) return;

    setIsRunning(true);
    setError(null);
    try {
      const response = await axios.get(`${API}/analytics/monte-carlo/${campaign.id}`);
      setSimulation(response.data);
    } catch (error) {
      console.error('Error running simulation:', error);
      setError('Failed to run simulation. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  if (!campaign) {
    return (
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm h-full">
        <CardContent className="p-6 text-center text-slate-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-3" />
          Select a campaign to run Monte Carlo simulation
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-blue-500" />
          Monte Carlo Simulation
        </CardTitle>
        <p className="text-slate-600">
          Predict funding progression with statistical modeling
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {isRunning ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4" />
            <p className="text-slate-600">Running 10,000 simulations...</p>
          </div>
        ) : simulation ? (
          <div className="space-y-6">
            {/* Scenarios */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="text-xl font-bold text-red-600">
                  ₹{simulation.pessimistic?.toLocaleString() || '0'}
                </div>
                <div className="text-xs text-slate-600 mt-1">Pessimistic</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <div className="text-xl font-bold text-yellow-600">
                  ₹{simulation.realistic?.toLocaleString() || '0'}
                </div>
                <div className="text-xs text-slate-600 mt-1">Realistic</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="text-xl font-bold text-green-600">
                  ₹{simulation.optimistic?.toLocaleString() || '0'}
                </div>
                <div className="text-xs text-slate-600 mt-1">Optimistic</div>
              </div>
            </div>

            {/* Success Probability */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800">Success Probability</h3>
                <Badge className={`${
                  simulation.success_probability > 70 ? 'bg-green-100 text-green-800' :
                  simulation.success_probability > 40 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                } border-0 font-bold`}>
                  {simulation.success_probability?.toFixed(0) || 0}%
                </Badge>
              </div>
              <Progress
                value={simulation.success_probability || 0}
                className="h-3"
              />
            </div>

            {/* Chart */}
            {simulation.progression_data && simulation.progression_data.length > 0 && (
              <div className="h-64 w-full bg-slate-50 rounded-xl p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={simulation.progression_data.slice(0, 30)}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="day" 
                      stroke="#64748b"
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#64748b"
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value) => [`₹${value?.toLocaleString()}`, 'Projected']}
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#colorAmount)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Key Insights */}
            {simulation.key_insights && simulation.key_insights.length > 0 && (
              <div className="p-4 bg-slate-50 rounded-xl">
                <h3 className="font-semibold text-slate-800 mb-3">Key Insights:</h3>
                <ul className="space-y-2">
                  {simulation.key_insights.slice(0, 4).map((insight, idx) => (
                    <li key={idx} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              onClick={runSimulation}
              variant="outline"
              size="sm"
              className="w-full hover:bg-blue-50"
              data-testid="run-new-simulation-button"
            >
              <Play className="w-4 h-4 mr-2" />
              Run New Simulation
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <Button 
              onClick={runSimulation} 
              className="bg-blue-500 hover:bg-blue-600"
              data-testid="run-simulation-button"
            >
              <Play className="w-4 h-4 mr-2" />
              Run Monte Carlo Simulation
            </Button>
          </div>
        )}
        {error && (
          <div className="mt-4 text-center text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
