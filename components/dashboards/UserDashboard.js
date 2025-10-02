import { useState, useEffect } from 'react';
import CandidateForm from '../forms/CandidateForm';
import { fetchPdfAndCreateUrl } from '../shared/pdfHelper';

export default function UserDashboard({ user, onMessage, onBack }) {
  const [submissions, setSubmissions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/submissions', {
        headers: { Authorization: 'Bearer ' + token }
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
        onMessage(`✅ Loaded ${data.length} submissions`, 'success');
      } else {
        onMessage('❌ Failed to load submissions', 'error');
      }
    } catch (error) {
      onMessage('❌ Network error', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


// Mobile pe directly download karayein ya new tab mein kholen

  // Handle PDF view/download
  // const handleView = async (id) => {
  //   const r = await fetchPdfAndCreateUrl(id, onMessage);
  //   if (r) {
  //     setPreviewUrl(r.url);
      
  //     
  //     if (isMobile) {
  //       // Option 1: Direct download
  //       const a = document.createElement('a');
  //       a.href = r.url;
  //       a.download = `application_${id}.pdf`;
  //       document.body.appendChild(a);
  //       a.click();
  //       document.body.removeChild(a);
  //       onMessage('📱 PDF downloaded for mobile viewing', 'success');
  //     } else {
  //       // Desktop pe preview show karen
  //       setPreviewing(true);
  //     }
  //   }
  // };
// end of handleView

// new preview on mobile is none and desktop pe preview show karne ke liye
  // Single handleView function for all devices
  const handleView = async (id) => {
    const r = await fetchPdfAndCreateUrl(id, onMessage);
    if (r) {
      setPreviewUrl(r.url);
      setPreviewing(true); // Always show preview for both mobile & desktop
    }
  };

  

  const handleDownload = async (id) => {
    const r = await fetchPdfAndCreateUrl(id, onMessage);
    if (r) {
      const a = document.createElement('a');
      a.href = r.url;
      a.download = `application_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  const handlePrint = async (id) => {
    const r = await fetchPdfAndCreateUrl(id, onMessage);
    if (r) {
      const w = window.open(r.url, '_blank');
      if (w) setTimeout(() => w.print(), 500);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(`Delete submission ${id}? This cannot be undone.`)) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/submissions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token }
      });
      const data = await res.json();
      if (res.ok) {
        onMessage('✅ Submission deleted', 'success');
        loadSubmissions();
      } else {
        onMessage(`❌ ${data.error || 'Delete failed'}`, 'error');
      }
    } catch (err) {
      onMessage('❌ Network error', 'error');
    }
  };

  // Mobile ke liye PDF new tab mein open kare
  const openPdfInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="p-4">
      {/* PDF Preview Modal - Only for Desktop */}
      {previewing && previewUrl && !isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-2">
          <div className="w-full h-full bg-white rounded-lg overflow-hidden relative flex flex-col">
            {/* Header with close button */}
            <div className="flex justify-between items-center p-3 bg-gray-100 border-b">
              <h3 className="font-semibold">PDF Preview</h3>
              <button 
                onClick={() => { setPreviewing(false); setPreviewUrl(null); }} 
                className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
              >
                Close 
              </button>
            </div>
            
            {/* PDF Container */}
            <div className="flex-1 w-full overflow-hidden">
              <object 
                data={previewUrl} 
                type="application/pdf"
                className="w-full h-full"
              >
                <div className="flex flex-col items-center justify-center h-full p-4">
                  <p className="text-lg mb-4">PDF Preview Not Supported</p>
                  <div className="flex gap-3">
                    <a 
                      href={previewUrl} 
                      download="submission.pdf"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Download PDF
                    </a>
                    <button 
                      onClick={() => openPdfInNewTab(previewUrl)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Open in New Tab
                    </button>
                  </div>
                </div>
              </object>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-2xl font-bold">👤 User Dashboard</h3>
        <button 
          onClick={onBack} 
          className="px-4 py-2 bg-gray-600 text-white border-none rounded-lg cursor-pointer hover:bg-gray-700 transition-colors w-full sm:w-auto"
        >
          ← Back
        </button>
      </div>

      <p className="mb-6">Welcome, <strong>{user.username}</strong>! Manage your candidate applications.</p>

      {/* Mobile Notice */}
      {isMobile && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
          <p className="text-yellow-800 text-sm">
            📱 <strong>Mobile Mode:</strong> PDF preview will download files directly for better compatibility.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button 
          onClick={() => setShowForm(!showForm)} 
          className={`px-6 py-3 text-white border-none rounded-lg cursor-pointer text-base font-medium transition-colors w-full sm:w-auto ${
            showForm ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {showForm ? '📋 Hide Form' : '📝 New Application'}
        </button>
        <button 
          onClick={loadSubmissions} 
          disabled={loading}
          className="px-6 py-3 bg-green-600 text-white border-none rounded-lg cursor-pointer text-base font-medium hover:bg-green-700 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '⏳ Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {/* Candidate Form */}
      {showForm && (
        <div className="mb-6">
          <CandidateForm 
            onSuccess={() => { 
              setShowForm(false); 
              loadSubmissions(); 
              onMessage('✅ Application submitted successfully!', 'success'); 
            }} 
            onError={(error) => onMessage(`❌ ${error}`, 'error')} 
          />
        </div>
      )}

      {/* Applications Section */}
      <div className="mt-6">
        <h4 className="text-xl font-semibold mb-4">Your Applications ({submissions.length})</h4>
        
        {submissions.length === 0 ? (
          <div className="p-6 text-center bg-gray-50 rounded-lg border border-gray-300">
            <p className="text-gray-600 mb-2">No applications submitted yet.</p>
            <p className="text-gray-500 text-sm">Click &quot;New Application&quot; to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub, index) => (
              <div 
                key={sub.id || index} 
                className="border border-gray-300 p-4 rounded-lg bg-gray-50 shadow-sm"
              >
                {/* Header Row */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 mb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <strong className="text-lg">{sub.fullName || 'Unnamed Application'}</strong>
                    <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs whitespace-nowrap">
                      {sub.id || 'N/A'}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs text-white whitespace-nowrap ${
                    sub.status === 'approved' ? 'bg-green-500' : 
                    sub.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}>
                    {sub.status || 'pending'}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="text-gray-600 mb-2 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <span>📧 {sub.email || 'No email'}</span>
                    <span>📞 {sub.phone || 'No phone'}</span>
                  </div>
                </div>

                {/* Qualification & Experience */}
                <div className="text-gray-600 text-sm mb-4 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <span>🎓 {sub.qualification || 'No qualification'}</span>
                    <span>💼 {sub.experienceYears || '0'} years experience</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {/* <button 
                    onClick={() => handleView(sub.id)} 
                    className="px-3 py-2 bg-blue-600 text-white border-none rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    {isMobile ? '📥 Download' : 'Preview'}
                  </button> */}
                  <button
                    onClick={() => handleView(sub.id)}
                    className="px-3 py-2 hidden md:inline-block bg-blue-600 text-white border-none rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Preview
                  </button>
                  <button 
                    onClick={() => handleDownload(sub.id)} 
                    className="px-3 py-2 bg-gray-600 text-white border-none rounded text-sm hover:bg-gray-700 transition-colors"
                  >
                    Download
                  </button>
                  <button 
                    onClick={() => handlePrint(sub.id)} 
                    className="px-3 py-2 bg-cyan-600 text-white border-none rounded text-sm hover:bg-cyan-700 transition-colors"
                  >
                    Print
                  </button>
                  <button 
                    onClick={() => handleDelete(sub.id)} 
                    className="px-3 py-2 bg-red-600 text-white border-none rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}