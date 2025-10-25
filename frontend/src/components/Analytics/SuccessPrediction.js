import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import axios from 'axios';
import { Brain, Zap, TrendingUp, AlertCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function SuccessPrediction({ campaign }) {
  const [prediction, setPrediction] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [error, setError] = useState(null);

  const generatePrediction = async () => {
    if (!campaign) return;

    setIsPredicting(true);
    setError(null);
    try {
      const response = await axios.get(`${API}/analytics/strategic-recommendations/${campaign.id}`);
      setPrediction(response.data);
    } catch (error) {
      console.error('Error generating prediction:', error);
      setError('Failed to generate prediction. Please try again.');
    } finally {
      setIsPredicting(false);
    }
  };

  const getProbabilityColor = (percentage) => {
    if (percentage > 70) return 'from-green-400 to-green-600';
    if (percentage > 40) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!campaign) {
    return (
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm h-full">
        <CardContent className="p-6 text-center text-slate-500">
          <Brain className="w-12 h-12 mx-auto mb-3" />
          Select a campaign for success prediction analysis
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
          <Brain className="w-6 h-6 text-green-500" />
          Success Prediction
        </CardTitle>
        <p className="text-slate-600">
          AI-powered analysis of campaign success likelihood
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {isPredicting ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4" />
            <p className="text-slate-600">Analyzing campaign factors...</p>
          </div>
        ) : prediction && prediction.success_prediction ? (
          <div className="space-y-6">
            {/* Success Probability */}
            <div className={`p-6 bg-gradient-to-r ${getProbabilityColor(prediction.success_prediction.percentage)} rounded-xl text-white`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-4xl font-bold">
                    {prediction.success_prediction.percentage}%
                  </div>
                  <div className="text-sm opacity-90 mt-1">Success Probability</div>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-0 px-3 py-1">
                  {prediction.success_prediction.level}
                </Badge>
              </div>
              <Progress
                value={prediction.success_prediction.percentage}
                className="h-2 bg-white/20"
              />
            </div>

            {/* Market Comparison */}
            {prediction.success_prediction && (
              <div className="p-4 bg-blue-50 rounded-xl">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  Market Context
                </h3>
                <div className="text-sm text-slate-600 space-y-2">
                  <p>
                    <strong className="text-slate-700">Category Average:</strong>{' '}
                    {prediction.success_prediction.category_average}
                  </p>
                  <p>
                    <strong className="text-slate-700">Similar Campaigns:</strong>{' '}
                    {prediction.success_prediction.similar_campaigns}
                  </p>
                </div>
              </div>
            )}

            {/* Success & Risk Factors */}
            <div className="grid md:grid-cols-2 gap-4">
              {prediction.success_factors && prediction.success_factors.length > 0 && (
                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                  <h3 className="font-semibold text-green-800 mb-3">Success Factors</h3>
                  <ul className="space-y-2">
                    {prediction.success_factors.slice(0, 3).map((factor, idx) => (
                      <li key={idx} className="text-sm text-green-700 flex gap-2">
                        <span className="mt-0.5">•</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {prediction.risk_factors && prediction.risk_factors.length > 0 && (
                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                  <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Risk Factors
                  </h3>
                  <ul className="space-y-2">
                    {prediction.risk_factors.slice(0, 3).map((risk, idx) => (
                      <li key={idx} className="text-sm text-red-700 flex gap-2">
                        <span className="mt-0.5">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action Recommendations */}
            {prediction.action_recommendations && prediction.action_recommendations.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">Action Recommendations</h3>
                <div className="space-y-3">
                  {prediction.action_recommendations.slice(0, 4).map((rec, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg border-l-4 border-blue-400">
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-medium text-slate-800 text-sm flex-1">{rec.title}</div>
                        <Badge className={`${getPriorityColor(rec.priority)} text-xs border ml-2`}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={generatePrediction}
              variant="outline"
              size="sm"
              className="w-full hover:bg-green-50"
              data-testid="refresh-prediction-button"
            >
              <Zap className="w-4 h-4 mr-2" />
              Refresh Analysis
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <Button 
              onClick={generatePrediction} 
              className="bg-green-500 hover:bg-green-600"
              data-testid="analyze-success-button"
            >
              <Brain className="w-4 h-4 mr-2" />
              Analyze Success Probability
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
