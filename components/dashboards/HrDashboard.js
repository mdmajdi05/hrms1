// import { useState, useEffect } from 'react';
// import { fetchPdfAndCreateUrl } from '../shared/pdfHelper';

// export default function HRDashboard({ user, onMessage, onBack }) {
//   const [submissions, setSubmissions] = useState([]);
//   const [previewing, setPreviewing] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState(null);

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

//   const hrHandleView = async (id) => {
//     const r = await fetchPdfAndCreateUrl(id, onMessage);
//     if (r) {
//       setPreviewUrl(r.url);
//       setPreviewing(true);
//     }
//   };

//   const hrHandleDownload = async (id) => {
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

//   const hrHandlePrint = async (id) => {
//     const r = await fetchPdfAndCreateUrl(id, onMessage);
//     if (r) {
//       const w = window.open(r.url, '_blank');
//       if (w) setTimeout(() => w.print(), 500);
//     }
//   };

//   const handleApprove = (id) => {
//     if (confirm(`Approve submission ${id}?`)) {
//       onMessage(`✅ Submission ${id} approved!`, 'success');
//     }
//   };

//   const handleReject = (id) => {
//     if (confirm(`Reject submission ${id}?`)) {
//       onMessage(`❌ Submission ${id} rejected!`, 'error');
//     }
//   };

//   useEffect(() => {
//     loadSubmissions();
//   }, []);

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
//         <h3>💼 HR Dashboard</h3>
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

//       <p>Welcome, <strong>{user.username}</strong>! Review candidate applications.</p>

//       <div style={{ marginBottom: '20px' }}>
//         <button
//           onClick={loadSubmissions}
//           style={{
//             padding: '10px 20px',
//             backgroundColor: '#007bff',
//             color: 'white',
//             border: 'none',
//             borderRadius: '6px',
//             cursor: 'pointer',
//             fontSize: '16px'
//           }}
//         >
//           🔄 Refresh Submissions
//         </button>
//       </div>

//       <div>
//         <h4>Candidate Submissions ({submissions.length})</h4>

//         {submissions.length === 0 ? (
//           <div style={{
//             padding: '40px',
//             textAlign: 'center',
//             backgroundColor: '#f8f9fa',
//             borderRadius: '6px',
//             border: '1px solid #dee2e6'
//           }}>
//             <p>No submissions found.</p>
//             <p>Click "Refresh Submissions" to load applications.</p>
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
//                     <strong style={{ fontSize: '18px' }}>{sub.fullName || 'Unnamed Application'}</strong>
//                     <span style={{
//                       background: '#007bff',
//                       color: 'white',
//                       padding: '2px 8px',
//                       borderRadius: '12px',
//                       fontSize: '12px',
//                       marginLeft: '10px'
//                     }}>
//                       {sub.id || 'N/A'}
//                     </span>
//                   </div>
//                   <span style={{
//                     background: sub.status === 'approved' ? '#28a745' :
//                       sub.status === 'rejected' ? '#dc3545' : '#ffc107',
//                     color: 'white',
//                     padding: '4px 12px',
//                     borderRadius: '15px',
//                     fontSize: '12px'
//                   }}>
//                     {sub.status || 'pending'}
//                   </span>
//                 </div>
//                 <div style={{ color: '#666', margin: '8px 0' }}>
//                   📧 {sub.email || 'No email'} | 📞 {sub.phone || 'No phone'}
//                 </div>
//                 <div style={{ color: '#666' }}>
//                   🎓 {sub.qualification || 'No qualification'} | 💼 {sub.experienceYears || '0'} years experience
//                 </div>
//                 <div style={{ color: '#666', margin: '8px 0' }}>
//                   🔧 Skills: {sub.skills || 'Not specified'}
//                 </div>

//                 <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
//                   <button
//                     onClick={() => handleApprove(sub.id)}
//                     style={{
//                       padding: '6px 12px',
//                       backgroundColor: '#28a745',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '4px',
//                       cursor: 'pointer',
//                       fontSize: '12px'
//                     }}
//                   >
//                     Approve
//                   </button>
//                   <button
//                     onClick={() => handleReject(sub.id)}
//                     style={{
//                       padding: '6px 12px',
//                       backgroundColor: '#dc3545',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '4px',
//                       cursor: 'pointer',
//                       fontSize: '12px'
//                     }}
//                   >
//                     Reject
//                   </button>
//                   <button
//                     onClick={() => hrHandleView(sub.id)}
//                     style={{
//                       padding: '6px 12px',
//                       backgroundColor: '#007bff',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '4px',
//                       cursor: 'pointer',
//                       fontSize: '12px'
//                     }}
//                   >
//                     Preview
//                   </button>
//                   <button
//                     onClick={() => hrHandleDownload(sub.id)}
//                     style={{
//                       padding: '6px 12px',
//                       backgroundColor: '#6c757d',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '4px',
//                       cursor: 'pointer',
//                       fontSize: '12px'
//                     }}
//                   >
//                     Download
//                   </button>
//                   <button
//                     onClick={() => hrHandlePrint(sub.id)}
//                     style={{
//                       padding: '6px 12px',
//                       backgroundColor: '#17a2b8',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '4px',
//                       cursor: 'pointer',
//                       fontSize: '12px'
//                     }}
//                   >
//                     Print
//                   </button>
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

export default function HRDashboard({ user, onMessage, onBack }) {
  const [submissions, setSubmissions] = useState([]);
  const [previewing, setPreviewing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

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

  const hrHandleView = async (id) => {
    const r = await fetchPdfAndCreateUrl(id, onMessage);
    if (r) {
      setPreviewUrl(r.url);
      setPreviewing(true);
    }
  };

  const hrHandleDownload = async (id) => {
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

  const hrHandlePrint = async (id) => {
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

  const handleApprove = (id) => {
    if (confirm(`Approve submission ${id}?`)) {
      onMessage(`✅ Submission ${id} approved!`, 'success');
    }
  };

  const handleReject = (id) => {
    if (confirm(`Reject submission ${id}?`)) {
      onMessage(`❌ Submission ${id} rejected!`, 'error');
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        <h3 className="text-2xl font-bold">💼 HR Dashboard</h3>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-600 text-white border-none rounded-lg cursor-pointer hover:bg-gray-700 transition-colors w-full sm:w-auto"
        >
          ← Back
        </button>
      </div>

      <p className="mb-6">Welcome, <strong>{user.username}</strong>! Review candidate applications.</p>

      {/* Refresh Button */}
      <div className="mb-6">
        <button
          onClick={loadSubmissions}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white border-none rounded-lg cursor-pointer hover:bg-blue-700 transition-colors text-base font-medium"
        >
          🔄 Refresh Submissions
        </button>
      </div>

      {/* Submissions Section */}
      <div>
        <h4 className="text-xl font-semibold mb-4">Candidate Submissions ({submissions.length})</h4>

        {submissions.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-300">
            <p className="text-gray-600 mb-2">No submissions found.</p>
            <p className="text-gray-500 text-sm">Click &quot;Refresh Submissions&quot; to load applications.</p>
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
                <div className="text-gray-600 text-sm mb-2 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <span>🎓 {sub.qualification || 'No qualification'}</span>
                    <span>💼 {sub.experienceYears || '0'} years experience</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="text-gray-600 text-sm mb-4">
                  <span className="font-medium">🔧 Skills:</span> {sub.skills || 'Not specified'}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    onClick={() => handleApprove(sub.id)}
                    className="px-3 py-2 bg-green-600 text-white border-none rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(sub.id)}
                    className="px-3 py-2 bg-red-600 text-white border-none rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => hrHandleView(sub.id)}
                    className="px-3 py-2 md:hidden bg-blue-600 text-white border-none rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => hrHandleDownload(sub.id)}
                    className="px-3 py-2 bg-gray-600 text-white border-none rounded text-sm hover:bg-gray-700 transition-colors"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => hrHandlePrint(sub.id)}
                    className="px-3 py-2 bg-cyan-600 text-white border-none rounded text-sm hover:bg-cyan-700 transition-colors"
                  >
                    Print
                  </button>
                  <button
                    onClick={() => handleDelete(sub.id)}
                    className="px-3 py-2 bg-red-700 text-white border-none rounded text-sm hover:bg-red-800 transition-colors"
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