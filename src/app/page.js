'use client';
import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import UserAuth from '../../components/auth/UserAuth';
import StaffAuth from '../../components/auth/StaffAuth';
import UserDashboard from '../../components/dashboards/UserDashboard';
import AdminDashboard from '../../components/dashboards/AdminDashboard';
import HRDashboard from '../../components/dashboards/HrDashboard';
import { fetchPdfAndCreateUrl } from '../../components/shared/pdfHelper';

export default function Home() {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');
    if (token && role && username) {
      setUser({ token, role, username });
      if (role === 'user') setCurrentView('userDashboard');
      else if (role === 'admin') setCurrentView('adminDashboard');
      else if (role === 'hr') setCurrentView('hrDashboard');
    }
  }, []);

  const showHome = () => setCurrentView('home');
  const showUser = () => setCurrentView('user');
  const showStaff = () => setCurrentView('staff');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    setUser(null);
    setCurrentView('home');
    setMessage('Logged out successfully');
  };

  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUserLogin = (userData) => {
    setUser(userData);
    setCurrentView('userDashboard');
    showMessage('Login successful!', 'success');
  };

  const handleStaffLogin = (userData) => {
    setUser(userData);
    if (userData.role === 'admin') setCurrentView('adminDashboard');
    else setCurrentView('hrDashboard');
    showMessage('Login successful!', 'success');
  };

  return (
    <div className="font-sans p-5 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto my-3">
        <Header user={user} onNavigate={(v) => setCurrentView(v)} onLogout={logout} />

        <div className="border border-gray-300 p-5 rounded-lg max-w-6xl mx-auto my-5 bg-white shadow-lg">

          {message && (
            <div className={`p-3 my-3 rounded border ${
              message.includes('success') 
                ? 'bg-green-100 border-green-300 text-green-800' 
                : 'bg-red-100 border-red-300 text-red-800'
            }`}>
              {message}
            </div>
          )}

          {user && (
            <div className="flex flex-col sm:flex-row justify-between items-center mb-5 p-3 bg-gray-50 rounded-lg gap-3">
              <span>Welcome, <strong>{user.username}</strong> ({user.role})</span>
              <button 
                onClick={logout} 
                className="px-4 py-2 md:hidden bg-red-600 text-white border-none rounded cursor-pointer hover:bg-red-700 transition-colors w-full sm:w-auto"
              >
                Logout
              </button>
            </div>
          )}

          {currentView === 'home' && (
            <div id="home">
              <section className="flex flex-col lg:flex-row gap-6 items-start p-6">
                {/* Left Content - Hire smarter section */}
                <div className="flex-1 w-full">
                  <h1 className="text-3xl lg:text-4xl font-bold mb-4">Hire smarter. Onboard faster.</h1>
                  <p className="text-gray-600 max-w-2xl mb-4 text-lg">
                    Create beautiful candidate profiles, review applications, and download complete PDF dossiers. Fast for teams — simple for small businesses.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mt-5">
                    <button 
                      onClick={showUser} 
                      className="px-6 py-3 bg-blue-600 text-white border-none rounded-lg cursor-pointer text-base hover:bg-blue-700 transition-colors w-full sm:w-auto"
                    >
                      Get Started
                    </button>
                    <button 
                      onClick={showStaff} 
                      className="px-6 py-3 bg-gray-600 text-white border-none rounded-lg cursor-pointer text-base hover:bg-gray-700 transition-colors w-full sm:w-auto"
                    >
                      For HR / Admin
                    </button>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-4 text-gray-600 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✅</span>
                      <span>Quick candidate form</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✅</span>
                      <span>PDF export</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✅</span>
                      <span>Role-based access</span>
                    </div>
                  </div>
                </div>

                {/* Right Content - Apply now section */}
                <div className="w-full lg:w-96 bg-blue-50 border border-blue-200 p-5 rounded-xl shadow-lg mt-6 lg:mt-0">
                  <h3 className="text-xl font-semibold mt-0 mb-4">Apply now</h3>
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      Open the User Portal to fill the full application form and upload documents.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 mt-3">
                      <button 
                        onClick={showUser} 
                        className="flex-1 px-4 py-3 bg-blue-600 text-white border-none rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Open User Portal
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {currentView === 'user' && !user && (
            <UserAuth onLogin={handleUserLogin} onMessage={showMessage} />
          )}

          {currentView === 'userDashboard' && user && user.role === 'user' && (
            <UserDashboard user={user} onMessage={showMessage} onBack={showHome} />
          )}

          {currentView === 'staff' && !user && (
            <StaffAuth onLogin={handleStaffLogin} onMessage={showMessage} />
          )}

          {currentView === 'adminDashboard' && user && user.role === 'admin' && (
            <AdminDashboard user={user} onMessage={showMessage} onBack={showHome} />
          )}

          {currentView === 'hrDashboard' && user && user.role === 'hr' && (
            <HRDashboard user={user} onMessage={showMessage} onBack={showHome} />
          )}

          {(currentView === 'user' || currentView === 'staff') && !user && (
            <button 
              onClick={showHome} 
              className="px-4 py-2 mt-5 bg-gray-600 text-white border-none rounded cursor-pointer hover:bg-gray-700 transition-colors w-full sm:w-auto"
            >
              ← Back
            </button>
          )}

        </div>

        <Footer />
      </div>
    </div>
  );
}