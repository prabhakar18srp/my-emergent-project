import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Sparkles, Settings } from 'lucide-react';

const FeaturesModal = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#0f172a] border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center">
            <span className="gradient-text">Platform Features</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-6" data-testid="features-modal-content">
          <div className="feature-item">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">AI-Powered Success Prediction</h3>
                <p className="text-slate-400">Our advanced AI analyzes your campaign and predicts success probability based on category, funding goal, and description.</p>
              </div>
            </div>
          </div>
          
          <div className="feature-item">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">AI Campaign Assistant</h3>
                <p className="text-slate-400">Get instant answers to campaign-related queries with our intelligent AI chatbot.</p>
              </div>
            </div>
          </div>

          <div className="feature-item">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Secure Payment Processing</h3>
                <p className="text-slate-400">Back projects safely with integrated Stripe payment processing.</p>
              </div>
            </div>
          </div>

          <div className="feature-item">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Real-Time Analytics</h3>
                <p className="text-slate-400">Track your campaign performance with comprehensive analytics dashboards.</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Navigation = () => {
  const { user, handleLogout, setShowAuthModal } = useContext(AuthContext);
  const [showFeatures, setShowFeatures] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#0a0e1a]/80 backdrop-blur-xl border-b border-white/5" data-testid="navigation-bar">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">FundAI</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-slate-300 hover:text-white transition-colors font-medium" data-testid="nav-home">
                Home
              </Link>
              <Link to="/discover" className="text-slate-300 hover:text-white transition-colors font-medium" data-testid="nav-discover">
                Discover
              </Link>
              <button 
                onClick={() => setShowFeatures(true)} 
                className="text-slate-300 hover:text-white transition-colors font-medium"
                data-testid="nav-features"
              >
                Features
              </button>
              <Link to="/analytics" className="text-slate-300 hover:text-white transition-colors font-medium" data-testid="nav-analytics">
                Analytics
              </Link>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Button 
                    onClick={() => navigate('/create-campaign')} 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    data-testid="create-campaign-nav-button"
                  >
                    Start Campaign
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger data-testid="user-menu-trigger">
                      <Avatar className="w-10 h-10 cursor-pointer ring-2 ring-purple-500/20 hover:ring-purple-500/40 transition-all">
                        <AvatarImage src={user.picture} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold">
                          {user.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-[#0f172a] border-white/10" data-testid="user-menu-dropdown">
                      <div className="px-3 py-2 border-b border-white/10">
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                      <DropdownMenuItem onClick={() => navigate('/my-campaigns')} data-testid="my-campaigns-menu-item">
                        My Campaigns
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/analytics')} data-testid="analytics-menu-item">
                        Analytics
                      </DropdownMenuItem>
                      {user.is_admin && (
                        <DropdownMenuItem onClick={() => navigate('/admin')} data-testid="admin-menu-item">
                          Admin Dashboard
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={handleLogout} className="text-red-400" data-testid="logout-menu-item">
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button 
                  onClick={() => setShowAuthModal(true)} 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  data-testid="login-button"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <FeaturesModal open={showFeatures} onClose={() => setShowFeatures(false)} />
    </>
  );
};

export default Navigation;
