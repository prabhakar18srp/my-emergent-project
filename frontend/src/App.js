import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axiosInstance from './utils/axios';
import './App.css';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import CreateCampaignPage from './pages/CreateCampaignPage';
import MyCampaignsPage from './pages/MyCampaignsPage';
import AdminDashboard from './pages/AdminDashboard';
import AnalyticsPage from './pages/AnalyticsPage';
import AuthModal from './components/AuthModal';
import AIChatWidget from './components/AIChatWidget';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

export const AuthContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    checkAuth();
    processGoogleAuth();
  }, []);

  const processGoogleAuth = async () => {
    const hash = window.location.hash;
    if (hash && hash.includes('session_id=')) {
      const sessionId = hash.split('session_id=')[1].split('&')[0];
      
      try {
        const response = await axiosInstance.post(
          '/auth/google/callback',
          {},
          { headers: { 'X-Session-ID': sessionId } }
        );
        
        localStorage.setItem('session_token', response.data.session_token);
        setUser(response.data.user);
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error('Google auth error:', error);
      }
    }
  };

  const checkAuth = async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.log('Not authenticated');
      localStorage.removeItem('session_token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      localStorage.removeItem('session_token');
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen" data-testid="loading-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, checkAuth, handleLogout, setShowAuthModal }}>
      <BrowserRouter>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/campaign/:id" element={<CampaignDetailPage />} />
            <Route 
              path="/create-campaign" 
              element={user ? <CreateCampaignPage /> : <Navigate to="/" />} 
            />
            <Route 
              path="/my-campaigns" 
              element={user ? <MyCampaignsPage /> : <Navigate to="/" />} 
            />
            <Route 
              path="/admin" 
              element={user?.is_admin ? <AdminDashboard /> : <Navigate to="/" />} 
            />
            <Route 
              path="/analytics" 
              element={user ? <AnalyticsPage /> : <Navigate to="/" />} 
            />
          </Routes>
          
          {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
          <AIChatWidget />
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
