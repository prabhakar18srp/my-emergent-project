import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import axios from 'axios';
import { Zap, Search, TrendingUp, Users, DollarSign, Lightbulb } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function CompetitorAnalysis({ campaign }) {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const analyzeCompetitors = async () => {
    if (!campaign) return;

    setIsAnalyzing(true);
    setError(null);
    try {
      const response = await axios.get(`${API}/analytics/competitor-analysis/${campaign.id}`);
      setAnalysis(response.data);
    } catch (error) {
      console.error('Error analyzing competitors:', error);
      setError('Failed to analyze competitors. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
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
          <Search className="w-12 h-12 mx-auto mb-3" />
          Select a campaign for competitor analysis
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
          <Zap className="w-6 h-6 text-purple-500" />
          Competitor Analysis
        </CardTitle>
        <p className="text-slate-600">
          Research similar campaigns and market insights
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAnalyzing ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4" />
            <p className="text-slate-600">Analyzing market and competitors...</p>
          </div>
        ) : analysis ? (
          <div className="space-y-6">
            {/* Market Overview */}
            {analysis.market_overview && (
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  Market Overview
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-600 leading-relaxed">
                    <strong>Category Performance:</strong> {analysis.market_overview.category_performance}
                  </p>
                  {analysis.market_overview.average_success_rate && (
                    <p className="text-slate-600">
                      <strong>Average Success Rate:</strong> {analysis.market_overview.average_success_rate}
                    </p>
                  )}
                  {analysis.market_overview.typical_funding_min && analysis.market_overview.typical_funding_max && (
                    <p className="text-slate-600">
                      <strong>Typical Funding:</strong> ₹{(analysis.market_overview.typical_funding_min / 1000).toFixed(0)}k to ₹{(analysis.market_overview.typical_funding_max / 1000).toFixed(0)}k
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Key Trends */}
            {analysis.key_trends && analysis.key_trends.length > 0 && (
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-800 mb-3">Key Trends:</h4>
                <ul className="space-y-2">
                  {analysis.key_trends.slice(0, 3).map((trend, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-slate-600">
                      <span className="text-purple-400 mt-0.5">•</span>
                      <span>{trend}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Top Competitors */}
            {analysis.top_competitors && analysis.top_competitors.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  Top Competitors
                </h3>
                <div className="space-y-3">
                  {analysis.top_competitors.slice(0, 3).map((competitor, idx) => (
                    <div key={idx} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-slate-800 text-sm">{competitor.name}</h4>
                        <Badge variant="outline" className="bg-white text-xs">
                          ₹{(competitor.funding / 1000).toFixed(0)}k
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{competitor.description}</p>
                      <div className="bg-white/50 rounded p-2">
                        <p className="text-xs font-semibold text-blue-700 mb-1">Success Factors:</p>
                        <p className="text-xs text-slate-600">{competitor.success_factors}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={analyzeCompetitors}
              variant="outline"
              size="sm"
              className="w-full hover:bg-purple-50"
              data-testid="refresh-competitor-button"
            >
              <Search className="w-4 h-4 mr-2" />
              Refresh Analysis
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <Button 
              onClick={analyzeCompetitors} 
              className="bg-purple-500 hover:bg-purple-600"
              data-testid="analyze-competitors-button"
            >
              <Search className="w-4 h-4 mr-2" />
              Analyze Competitors
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
