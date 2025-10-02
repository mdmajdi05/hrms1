// import { useState, useEffect } from 'react';
// import { fetchPdfAndCreateUrl } from '../shared/pdfHelper';

// export default function AdminDashboard({ user, onMessage, onBack }) {
//   const [submissions, setSubmissions] = useState([]);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [previewing, setPreviewing] = useState(false);
//   const [hrForm, setHrForm] = useState({ username: '', password: '' });

//   const loadSubmissions = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('/api/submissions', {
//         headers: { Authorization: 'Bearer ' + token }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setSubmissions(data);
//         onMessage(`✅ Loaded ${data.length} submissions`, 'success');
//       } else {
//         onMessage('❌ Failed to load submissions', 'error');
//       }
//     } catch (error) {
//       onMessage('❌ Network error', 'error');
//     }
//   };

//   const createHRAccount = async () => {
//     if (!hrForm.username || !hrForm.password) {
//       onMessage('❌ Please fill all fields', 'error');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('/api/auth/create-hr', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: 'Bearer ' + token
//         },
//         body: JSON.stringify(hrForm)
//       });

//       const data = await response.json();

//       if (response.ok) {
//         onMessage(`✅ HR account created for: ${data.username}`, 'success');
//         setHrForm({ username: '', password: '' });
//       } else {
//         onMessage(`❌ ${data.error}`, 'error');
//       }
//     } catch (error) {
//       onMessage('❌ Network error', 'error');
//     }
//   };

//   useEffect(() => {
//     loadSubmissions();
//   }, []);

//   const adminHandleView = async (id) => {
//     const r = await fetchPdfAndCreateUrl(id, onMessage);
//     if (r) {
//       setPreviewUrl(r.url);
//       setPreviewing(true);
//     }
//   };

//   const adminHandleDownload = async (id) => {
//     const r = await fetchPdfAndCreateUrl(id, onMessage);
//     if (r) {
//       const a = document.createElement('a');
//       a.href = r.url;
//       a.download = `${id}.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//     }
//   };

//   const adminHandlePrint = async (id) => {
//     const r = await fetchPdfAndCreateUrl(id, onMessage);
//     if (r) {
//       const w = window.open(r.url, '_blank');
//       if (w) setTimeout(() => w.print(), 500);
//     }
//   };

//   return (
//     <div>
//       {previewing && previewUrl && (
//         <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
//           <div style={{ width: '80%', height: '80%', background: 'white', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
//             <button onClick={() => { setPreviewing(false); setPreviewUrl(null); }} style={{ position: 'absolute', right: '10px', top: '10px', zIndex: 10, padding: '6px 10px', borderRadius: '4px', border: 'none', background: '#dc3545', color: 'white' }}>Close</button>
//             <iframe src={previewUrl} style={{ width: '100%', height: '100%', border: 'none' }} title="submission-preview" />
//           </div>
//         </div>
//       )}

//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//         <h3>👑 Admin Dashboard</h3>
//         <button
//           onClick={onBack}
//           style={{
//             padding: '8px 16px',
//             backgroundColor: '#6c757d',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer'
//           }}
//         >
//           ← Back
//         </button>
//       </div>

//       <p>Welcome, <strong>{user.username}</strong>! Manage the system.</p>

//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
//         <div style={{
//           border: '1px solid #ddd',
//           padding: '20px',
//           borderRadius: '8px',
//           backgroundColor: '#f8f9fa'
//         }}>
//           <h5>Create HR Account</h5>
//           <div style={{ marginBottom: '15px' }}>
//             <input
//               type="text"
//               placeholder="HR Username"
//               value={hrForm.username}
//               onChange={(e) => setHrForm({ ...hrForm, username: e.target.value })}
//               style={{
//                 padding: '10px',
//                 width: '100%',
//                 margin: '5px 0',
//                 border: '1px solid #ddd',
//                 borderRadius: '4px',
//                 boxSizing: 'border-box'
//               }}
//             />
//             <input
//               type="password"
//               placeholder="HR Password"
//               value={hrForm.password}
//               onChange={(e) => setHrForm({ ...hrForm, password: e.target.value })}
//               style={{
//                 padding: '10px',
//                 width: '100%',
//                 margin: '5px 0',
//                 border: '1px solid #ddd',
//                 borderRadius: '4px',
//                 boxSizing: 'border-box'
//               }}
//             />
//           </div>
//           <button
//             onClick={createHRAccount}
//             style={{
//               padding: '10px 20px',
//               backgroundColor: '#28a745',
//               color: 'white',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer'
//             }}
//           >
//             Create HR Account
//           </button>
//         </div>

//         <div style={{
//           border: '1px solid #ddd',
//           padding: '20px',
//           borderRadius: '8px',
//           backgroundColor: '#f8f9fa'
//         }}>
//           <h5>System Overview</h5>
//           <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
//             <div>📊 Total Submissions: <strong>{submissions.length}</strong></div>
//             <div>👤 User Accounts: <strong>{new Set(submissions.map(s => s.userId)).size}</strong></div>
//             <div>⏰ Last Updated: <strong>{new Date().toLocaleTimeString()}</strong></div>
//           </div>
//         </div>
//       </div>

//       <div>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
//           <h4>All Submissions ({submissions.length})</h4>
//           <button
//             onClick={loadSubmissions}
//             style={{
//               padding: '8px 16px',
//               backgroundColor: '#007bff',
//               color: 'white',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer'
//             }}
//           >
//             🔄 Refresh
//           </button>
//         </div>

//         {submissions.length === 0 ? (
//           <div style={{
//             padding: '40px',
//             textAlign: 'center',
//             backgroundColor: '#f8f9fa',
//             borderRadius: '6px',
//             border: '1px solid #dee2e6'
//           }}>
//             <p>No submissions found.</p>
//           </div>
//         ) : (
//           <div>
//             {submissions.map((sub, index) => (
//               <div
//                 key={sub.id || index}
//                 style={{
//                   border: '1px solid #ddd',
//                   padding: '15px',
//                   margin: '10px 0',
//                   borderRadius: '6px',
//                   backgroundColor: 'white'
//                 }}
//               >
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                   <div>
//                     <strong style={{ fontSize: '16px' }}>{sub.fullName || 'Unnamed Application'}</strong>
//                     <span style={{
//                       background: '#6c757d',
//                       color: 'white',
//                       padding: '2px 8px',
//                       borderRadius: '12px',
//                       fontSize: '11px',
//                       marginLeft: '10px'
//                     }}>
//                       {sub.id || 'N/A'}
//                     </span>
//                   </div>
//                   <div>
//                     <span style={{
//                       background: sub.status === 'approved' ? '#28a745' :
//                         sub.status === 'rejected' ? '#dc3545' : '#ffc107',
//                       color: 'white',
//                       padding: '4px 12px',
//                       borderRadius: '15px',
//                       fontSize: '12px',
//                       marginRight: '10px'
//                     }}>
//                       {sub.status || 'pending'}
//                     </span>
//                     <span style={{
//                       background: '#17a2b8',
//                       color: 'white',
//                       padding: '4px 8px',
//                       borderRadius: '12px',
//                       fontSize: '11px'
//                     }}>
//                       User: {sub.userId ? sub.userId.substring(0, 8) + '...' : 'Unknown'}
//                     </span>
//                   </div>
//                 </div>
//                 <div style={{ color: '#666', margin: '8px 0' }}>
//                   📧 {sub.email || 'No email'} | 📞 {sub.phone || 'No phone'}
//                 </div>
//                 <div style={{ color: '#666', fontSize: '14px' }}>
//                   🎓 {sub.qualification || 'No qualification'} | 💼 {sub.experienceYears || '0'} years
//                 </div>
//                 <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
//                   <button onClick={() => adminHandleView(sub.id)} style={{ padding: '6px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}>Preview</button>
//                   <button onClick={() => adminHandleDownload(sub.id)} style={{ padding: '6px 10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}>Download</button>
//                   <button onClick={() => adminHandlePrint(sub.id)} style={{ padding: '6px 10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}>Print</button>
//                 </div>
//                 <div style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
//                   Submitted: {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : 'Unknown date'}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { fetchPdfAndCreateUrl } from '../shared/pdfHelper';

export default function AdminDashboard({ user, onMessage, onBack }) {
  const [submissions, setSubmissions] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewing, setPreviewing] = useState(false);
  const [hrForm, setHrForm] = useState({ username: '', password: '' });

  const loadSubmissions = async () => {
    try {
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
    }
  };

  const createHRAccount = async () => {
    if (!hrForm.username || !hrForm.password) {
      onMessage('❌ Please fill all fields', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/create-hr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify(hrForm)
      });

      const data = await response.json();

      if (response.ok) {
        onMessage(`✅ HR account created for: ${data.username}`, 'success');
        setHrForm({ username: '', password: '' });
      } else {
        onMessage(`❌ ${data.error}`, 'error');
      }
    } catch (error) {
      onMessage('❌ Network error', 'error');
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

  useEffect(() => {
    loadSubmissions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const adminHandleView = async (id) => {
    const r = await fetchPdfAndCreateUrl(id, onMessage);
    if (r) {
      setPreviewUrl(r.url);
      setPreviewing(true);
    }
  };

  const adminHandleDownload = async (id) => {
    const r = await fetchPdfAndCreateUrl(id, onMessage);
    if (r) {
      const a = document.createElement('a');
      a.href = r.url;
      a.download = `${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  const adminHandlePrint = async (id) => {
    const r = await fetchPdfAndCreateUrl(id, onMessage);
    if (r) {
      const w = window.open(r.url, '_blank');
      if (w) setTimeout(() => w.print(), 500);
    }
  };

  return (
    <div className="p-4">
      {/* PDF Preview Modal */}
      {previewing && previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="w-full h-full md:w-4/5 md:h-4/5 bg-white rounded-lg overflow-hidden relative">
            <button 
              onClick={() => { setPreviewing(false); setPreviewUrl(null); }} 
              className="absolute right-3 top-3 z-10 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Close
            </button>
            <iframe 
              src={previewUrl} 
              className="w-full h-full border-none" 
              title="submission-preview" 
            />
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-2xl font-bold">👑 Admin Dashboard</h3>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-600 text-white border-none rounded-lg cursor-pointer hover:bg-gray-700 transition-colors w-full sm:w-auto"
        >
          ← Back
        </button>
      </div>

      <p className="mb-6">Welcome, <strong>{user.username}</strong>! Manage the system.</p>

      {/* Stats and Create HR Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Create HR Account */}
        <div className="border border-gray-300 p-6 rounded-lg bg-gray-50">
          <h5 className="text-lg font-semibold mb-4">Create HR Account</h5>
          <div className="mb-4 space-y-3">
            <input
              type="text"
              placeholder="HR Username"
              value={hrForm.username}
              onChange={(e) => setHrForm({ ...hrForm, username: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="HR Password"
              value={hrForm.password}
              onChange={(e) => setHrForm({ ...hrForm, password: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={createHRAccount}
            className="w-full px-6 py-3 bg-green-600 text-white border-none rounded-lg cursor-pointer hover:bg-green-700 transition-colors"
          >
            Create HR Account
          </button>
        </div>

        {/* System Overview */}
        <div className="border border-gray-300 p-6 rounded-lg bg-gray-50">
          <h5 className="text-lg font-semibold mb-4">System Overview</h5>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span>📊</span>
              <span>Total Submissions: <strong>{submissions.length}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span>👤</span>
              <span>User Accounts: <strong>{new Set(submissions.map(s => s.userId)).size}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span>⏰</span>
              <span>Last Updated: <strong>{new Date().toLocaleTimeString()}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions Section */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h4 className="text-xl font-semibold">All Submissions ({submissions.length})</h4>
          <button
            onClick={loadSubmissions}
            className="px-4 py-2 bg-blue-600 text-white border-none rounded-lg cursor-pointer hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            🔄 Refresh
          </button>
        </div>

        {submissions.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-300">
            <p className="text-gray-600">No submissions found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub, index) => (
              <div
                key={sub.id || index}
                className="border border-gray-300 p-4 rounded-lg bg-white shadow-sm"
              >
                {/* Header Row */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 mb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <strong className="text-lg">{sub.fullName || 'Unnamed Application'}</strong>
                    <span className="bg-gray-600 text-white px-2 py-1 rounded-full text-xs whitespace-nowrap">
                      {sub.id || 'N/A'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs text-white whitespace-nowrap ${
                      sub.status === 'approved' ? 'bg-green-500' :
                      sub.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}>
                      {sub.status || 'pending'}
                    </span>
                    <span className="bg-cyan-500 text-white px-2 py-1 rounded-full text-xs whitespace-nowrap">
                      User: {sub.userId ? sub.userId.substring(0, 8) + '...' : 'Unknown'}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="text-gray-600 mb-2 space-y-1">
                  <div className="flex flex-wrap gap-4">
                    <span>📧 {sub.email || 'No email'}</span>
                    <span>📞 {sub.phone || 'No phone'}</span>
                  </div>
                </div>

                {/* Qualification & Experience */}
                <div className="text-gray-600 text-sm mb-4 space-y-1">
                  <div className="flex flex-wrap gap-4">
                    <span>🎓 {sub.qualification || 'No qualification'}</span>
                    <span>💼 {sub.experienceYears || '0'} years</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <button 
                    onClick={() => adminHandleView(sub.id)} 
                    className="px-3 py-2 md:hidden bg-blue-600 text-white border-none rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Preview
                  </button>
                  <button 
                    onClick={() => adminHandleDownload(sub.id)} 
                    className="px-3 py-2 bg-gray-600 text-white border-none rounded text-sm hover:bg-gray-700 transition-colors"
                  >
                    Download
                  </button>
                  <button 
                    onClick={() => adminHandlePrint(sub.id)} 
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

                {/* Submission Date */}
                <div className="text-xs text-gray-500">
                  Submitted: {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : 'Unknown date'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}