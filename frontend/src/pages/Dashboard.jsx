import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { censusAPI } from '../services/api.js';
import { FileText, Download, CheckCircle, Clock, AlertTriangle, UserCheck, ArrowRight, ShieldCheck, MapPin, Users, Heart } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [draft, setDraft] = useState(null);
  const [family, setFamily] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCensusStatus = async () => {
    try {
      const response = await censusAPI.getDraft();
      setDraft(response.data.draft);
      setFamily(response.data.family);
      setDocuments(response.data.documents);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch census registry data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCensusStatus();
  }, []);

  const handleDownloadCertificate = () => {
    window.open(censusAPI.getCertificateDownloadUrl(), '_blank');
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 text-primary">
          <div className="w-12 h-12 border-4 border-t-primary border-primary-container rounded-full animate-spin" />
          <p className="text-xs font-semibold">Loading registry details...</p>
        </div>
      </div>
    );
  }

  // Calculate overall percentage of draft completion
  const getPercentComplete = (step) => {
    if (!step) return 0;
    return (step - 1) * 10;
  };

  return (
    <div className="flex-grow w-full max-w-containerMax mx-auto px-6 py-8 flex flex-col gap-8 animate-fade-in">
      
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-outlineVariant/30 pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary">Citizen Dashboard</h2>
          <p className="text-xs text-onSurfaceVariant">Manage your household census registration details.</p>
        </div>
        <div className="flex items-center gap-2 bg-primary-container/20 text-primary-light px-4 py-2 rounded-md border border-primary-container/30">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wide">Validated Profile</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-xs p-4 rounded-md border border-red-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Status Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Status Callout Card */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <div className="bg-surface border border-outlineVariant/50 rounded-md p-6 shadow-sm flex flex-col gap-6">
            <h3 className="font-bold text-base text-primary border-b border-outlineVariant/30 pb-2">Filing Status</h3>
            
            {/* Status Alert Panels */}
            {draft?.status === 'DRAFT' && (
              <div className="bg-amber-50 text-amber-900 border border-amber-200 rounded-md p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex gap-3 items-start">
                  <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">Census Filing in Progress</h4>
                    <p className="text-xs text-amber-800/80 mt-1">You have completed {getPercentComplete(draft.step)}% of the registration wizard.</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/wizard')}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-2.5 rounded-full shrink-0 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  Resume Wizard
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {draft?.status === 'SUBMITTED' && (
              <div className="bg-blue-50 text-blue-900 border border-blue-200 rounded-md p-5 flex flex-col gap-4">
                <div className="flex gap-3 items-start">
                  <Clock className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">Census Under Verification</h4>
                    <p className="text-xs text-blue-800/80 mt-1">
                      Your census registration details have been submitted and are currently undergoing documentation and audit checks by a Census Officer.
                    </p>
                  </div>
                </div>
                
                {/* Visual timeline */}
                <div className="flex items-center justify-between max-w-xs mt-2 relative before:absolute before:left-0 before:top-2.5 before:w-full before:h-0.5 before:bg-outlineVariant/50 z-0">
                  <div className="flex flex-col items-center gap-1 relative z-10">
                    <div className="w-5 h-5 rounded-full bg-success text-white flex items-center justify-center text-[10px]"><CheckCircle className="w-3.5 h-3.5" /></div>
                    <span className="text-[10px] text-onSurfaceVariant">Submitted</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 relative z-10">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] animate-pulse">●</div>
                    <span className="text-[10px] text-blue-800 font-bold">Reviewing</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 relative z-10">
                    <div className="w-5 h-5 rounded-full bg-surface-container-high border border-outline text-outline flex items-center justify-center text-[10px]">3</div>
                    <span className="text-[10px] text-onSurfaceVariant">Registry</span>
                  </div>
                </div>
              </div>
            )}

            {draft?.status === 'APPROVED' && (
              <div className="bg-green-50 text-green-900 border border-green-200 rounded-md p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex gap-3 items-start">
                  <CheckCircle className="w-6 h-6 text-success shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">Census Approved &amp; Documented</h4>
                    <p className="text-xs text-green-800/80 mt-1">Verification successful. Your digital census certificate is ready for download.</p>
                  </div>
                </div>
                <button 
                  onClick={handleDownloadCertificate}
                  className="bg-success hover:bg-success-dark text-white font-bold text-xs px-5 py-2.5 rounded-full shrink-0 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download Certificate
                </button>
              </div>
            )}

            {draft?.status === 'REJECTED' && (
              <div className="bg-red-50 text-red-900 border border-red-200 rounded-md p-5 flex flex-col gap-4">
                <div className="flex gap-3 items-start">
                  <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">Filing Needs Revision</h4>
                    <p className="text-xs text-red-800/80 mt-1">Your registry submission was rejected by the audit officer.</p>
                  </div>
                </div>
                {draft?.officerComments && (
                  <div className="bg-white/80 p-3 rounded border border-red-200/50">
                    <span className="text-[10px] font-bold text-red-700 uppercase">Officer comments:</span>
                    <p className="text-xs font-medium text-red-900/90 mt-1">{draft.officerComments}</p>
                  </div>
                )}
                <button 
                  onClick={() => navigate('/wizard')}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-full w-max flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  Edit &amp; Re-submit
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Profile Brief Data */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
              <div className="bg-surface-low p-4 rounded-md border border-outlineVariant/20 flex flex-col gap-1">
                <span className="text-[9px] font-bold text-onSurfaceVariant uppercase tracking-wider">Aadhaar Linked</span>
                <span className="text-xs font-semibold text-primary">
                  {draft?.identity_aadhaar ? `XXXX-XXXX-${draft.identity_aadhaar.slice(-4)}` : 'N/A'}
                </span>
              </div>
              <div className="bg-surface-low p-4 rounded-md border border-outlineVariant/20 flex flex-col gap-1">
                <span className="text-[9px] font-bold text-onSurfaceVariant uppercase tracking-wider">State / UT</span>
                <span className="text-xs font-semibold text-primary truncate">
                  {draft?.address_state || 'N/A'}
                </span>
              </div>
              <div className="bg-surface-low p-4 rounded-md border border-outlineVariant/20 flex flex-col gap-1">
                <span className="text-[9px] font-bold text-onSurfaceVariant uppercase tracking-wider">Family Members</span>
                <span className="text-xs font-semibold text-primary">
                  {family.length} Registered
                </span>
              </div>
              <div className="bg-surface-low p-4 rounded-md border border-outlineVariant/20 flex flex-col gap-1">
                <span className="text-[9px] font-bold text-onSurfaceVariant uppercase tracking-wider">Verification Steps</span>
                <span className="text-xs font-semibold text-primary capitalize">
                  {draft?.status === 'APPROVED' ? 'Approved' : 'Pending Approval'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info Card */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-surface border border-outlineVariant/50 rounded-md p-6 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-base text-primary border-b border-outlineVariant/30 pb-2">Household Profile</h3>
            
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-onSurfaceVariant uppercase">Primary Registrant</span>
                  <span className="text-xs font-semibold text-primary">{draft?.personal_fullName || user?.fullName}</span>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-onSurfaceVariant uppercase">Residential Address</span>
                  <span className="text-xs font-semibold text-primary truncate max-w-[200px]">
                    {draft?.address_houseDetails 
                      ? `${draft.address_houseDetails}, ${draft.address_district}, ${draft.address_state} - ${draft.address_pinCode}` 
                      : 'Not declared yet'}
                  </span>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-onSurfaceVariant uppercase">Relational Dependents</span>
                  <span className="text-xs font-semibold text-primary">
                    {family.length > 0 ? `${family.length} household members` : 'None added'}
                  </span>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Heart className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-onSurfaceVariant uppercase">Uploaded Proofs</span>
                  <span className="text-xs font-semibold text-primary">
                    {documents.length > 0 ? `${documents.length} verified scans` : 'No documents uploaded'}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
