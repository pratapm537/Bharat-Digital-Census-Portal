import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api.js';
import { 
  Users, CheckCircle2, Clock, XCircle, Search, Filter, Eye, FileText, Check, X, 
  MessageSquare, Info, ShieldAlert, Download 
} from 'lucide-react';

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [citizens, setCitizens] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Selected citizen for review drawer
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [citizenDetails, setCitizenDetails] = useState(null);
  const [reviewComments, setReviewComments] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const loadDashboardData = async () => {
    try {
      const statsRes = await adminAPI.getStats();
      setStats(statsRes.data.stats);
      
      const citizensRes = await adminAPI.listCitizens(search, statusFilter);
      setCitizens(citizensRes.data.citizens);
    } catch (err) {
      console.error(err);
      setError('Failed to load portal registry details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [search, statusFilter]);

  const handleOpenReview = async (citizen) => {
    setSelectedCitizen(citizen);
    setReviewComments('');
    setSuccess('');
    setError('');
    
    try {
      const response = await adminAPI.getCitizenDetails(citizen.id);
      setCitizenDetails(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load application details.');
    }
  };

  const handleReviewAction = async (action) => {
    if (!selectedCitizen) return;
    
    if (action === 'REJECT' && !reviewComments.trim()) {
      setError('Comments/Rejection reasons are required when rejecting an application.');
      return;
    }

    setReviewLoading(true);
    setError('');
    
    try {
      await adminAPI.reviewCensus(selectedCitizen.id, action, reviewComments);
      setSuccess(`Application successfully ${action === 'APPROVE' ? 'Approved' : 'Rejected'}.`);
      setSelectedCitizen(null);
      setCitizenDetails(null);
      loadDashboardData(); // Refresh lists
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review decision.');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 text-primary">
          <div className="w-12 h-12 border-4 border-t-primary border-primary-container rounded-full animate-spin" />
          <p className="text-xs font-semibold">Loading verification console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow w-full max-w-containerMax mx-auto px-6 py-8 flex flex-col gap-8">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-primary">National Census Verification Portal</h2>
        <p className="text-xs text-onSurfaceVariant">Officer Dashboard for audit, registry tracking, and compliance approvals.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-xs p-4 rounded-md border border-red-200 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 text-xs p-4 rounded-md border border-green-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Stats Cards Row */}
      {stats && (
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-surface p-4 rounded-md border border-outlineVariant/50 shadow-sm flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-wider">Total Citizens</span>
            <div className="text-xl font-bold text-primary flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" /> {stats.totalCitizens}
            </div>
          </div>
          <div className="bg-surface p-4 rounded-md border border-outlineVariant/50 shadow-sm flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-wider">Pending Audit</span>
            <div className="text-xl font-bold text-primary flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500 animate-pulse" /> {stats.submitted}
            </div>
          </div>
          <div className="bg-surface p-4 rounded-md border border-outlineVariant/50 shadow-sm flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-wider">Approved Registry</span>
            <div className="text-xl font-bold text-primary flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-success" /> {stats.approved}
            </div>
          </div>
          <div className="bg-surface p-4 rounded-md border border-outlineVariant/50 shadow-sm flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-wider">Rejected Revision</span>
            <div className="text-xl font-bold text-primary flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-red-500" /> {stats.rejected}
            </div>
          </div>
          <div className="bg-surface p-4 rounded-md border border-outlineVariant/50 shadow-sm flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-wider">Draft Filing</span>
            <div className="text-xl font-bold text-primary flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-outline" /> {stats.drafts}
            </div>
          </div>
        </section>
      )}

      {/* Main Review and Table Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Table List Column */}
        <div className="lg:col-span-2 bg-surface border border-outlineVariant/50 rounded-md shadow-sm overflow-hidden flex flex-col gap-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outlineVariant/20 pb-4">
            <h3 className="font-bold text-base text-primary">Applications Audit Queue</h3>
            
            {/* Filters */}
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-outline" />
                <input 
                  type="text"
                  placeholder="Search name or Aadhaar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-48 pl-9 pr-3 py-1.5 bg-surface border border-outlineVariant rounded text-xs outline-none"
                />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-surface border border-outlineVariant rounded text-xs outline-none"
              >
                <option value="">All Statuses</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-low border-b border-outlineVariant/30 text-onSurfaceVariant font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">FullName</th>
                  <th className="py-3 px-4">Aadhaar Proof</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submission Date</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outlineVariant/20">
                {citizens.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-onSurfaceVariant">No filings matching active criteria found.</td>
                  </tr>
                ) : (
                  citizens.map(citizen => (
                    <tr key={citizen.id} className="hover:bg-surface-container/20 transition-colors">
                      <td className="py-3 px-4 font-semibold text-primary">{citizen.fullName || 'Draft Citizen'}</td>
                      <td className="py-3 px-4 tracking-wider">{citizen.aadhaar ? `XXXX-XXXX-${citizen.aadhaar.slice(-4)}` : 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                          citizen.status === 'APPROVED' ? 'bg-green-50 text-green-700' :
                          citizen.status === 'REJECTED' ? 'bg-red-50 text-red-700' :
                          citizen.status === 'SUBMITTED' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {citizen.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-onSurfaceVariant">
                        {citizen.submittedAt ? new Date(citizen.submittedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button 
                          onClick={() => handleOpenReview(citizen)}
                          className="bg-primary/5 hover:bg-primary text-primary hover:text-white px-3 py-1 rounded-full font-bold text-[10px] transition-all flex items-center gap-1 mx-auto cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Citizen Review Column / Drawer */}
        <div className="lg:col-span-1">
          {selectedCitizen && citizenDetails ? (
            <div className="bg-surface border border-outlineVariant/50 rounded-md shadow-sm p-6 flex flex-col gap-5 animate-fade-in">
              <div className="flex items-center justify-between border-b border-outlineVariant/20 pb-3">
                <h3 className="font-bold text-base text-primary">Application Inspect</h3>
                <button onClick={() => setSelectedCitizen(null)} className="text-onSurfaceVariant hover:text-primary text-xs font-bold cursor-pointer">Close</button>
              </div>

              {/* Citizen Personal Summary */}
              <div className="space-y-3 text-xs leading-relaxed">
                <div>
                  <span className="text-[10px] font-bold text-onSurfaceVariant uppercase">Primary Applicant</span>
                  <p className="font-bold text-primary text-sm">{citizenDetails.census.personal_fullName}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-onSurfaceVariant uppercase">DOB / Gender</span>
                    <p className="font-semibold text-primary">{citizenDetails.census.personal_dob} ({citizenDetails.census.personal_gender})</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-onSurfaceVariant uppercase">Aadhaar Proof</span>
                    <p className="font-semibold text-primary tracking-wide">{citizenDetails.census.identity_aadhaar}</p>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-onSurfaceVariant uppercase">Residential Address</span>
                  <p className="font-semibold text-primary">
                    {citizenDetails.census.address_houseDetails}, {citizenDetails.census.address_district}, {citizenDetails.census.address_state} - {citizenDetails.census.address_pinCode}
                  </p>
                </div>

                {/* Family Members list */}
                <div>
                  <span className="text-[10px] font-bold text-onSurfaceVariant uppercase">Household Dependents ({citizenDetails.family.length})</span>
                  {citizenDetails.family.length === 0 ? (
                    <p className="text-[11px] text-outline italic">No dependents registered.</p>
                  ) : (
                    <ul className="list-disc pl-4 mt-1 space-y-1 text-[11px] font-medium text-primary">
                      {citizenDetails.family.map(mem => (
                        <li key={mem.id}>{mem.fullName} ({mem.relationship}) - DOB: {mem.dob}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Uploaded Scans review */}
                <div>
                  <span className="text-[10px] font-bold text-onSurfaceVariant uppercase">Uploaded Documents ({citizenDetails.documents.length})</span>
                  {citizenDetails.documents.length === 0 ? (
                    <p className="text-[11px] text-outline italic">No scans attached.</p>
                  ) : (
                    <div className="mt-1.5 space-y-2">
                      {citizenDetails.documents.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-2 bg-surface-low rounded border border-outlineVariant/20">
                          <span className="font-semibold text-primary truncate max-w-[120px]">{doc.fileName}</span>
                          <a 
                            href={`http://localhost:5000/${doc.filePath}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-[9px] bg-primary text-white font-bold uppercase px-2 py-0.5 rounded flex items-center gap-0.5 hover:bg-primary-light"
                          >
                            <Download className="w-2.5 h-2.5" /> View
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Review Controls (Only show if submitted or rejected, allow adjustments) */}
              {selectedCitizen.status === 'SUBMITTED' ? (
                <div className="border-t border-outlineVariant/20 pt-4 flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-primary uppercase">Audit Comments / Remarks</label>
                    <textarea 
                      rows={2}
                      value={reviewComments}
                      onChange={(e) => setReviewComments(e.target.value)}
                      placeholder="Specify comments or rejection grounds..."
                      className="w-full px-3 py-1.5 bg-surface border border-outlineVariant rounded text-xs outline-none focus:border-primary"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <button 
                      onClick={() => handleReviewAction('REJECT')}
                      disabled={reviewLoading}
                      className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 py-2 rounded-full font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Reject Revision
                    </button>
                    <button 
                      onClick={() => handleReviewAction('APPROVE')}
                      disabled={reviewLoading}
                      className="bg-success text-white hover:bg-success-dark py-2 rounded-full font-bold text-xs flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve Registry
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-surface-low border border-outlineVariant/20 p-4 rounded text-center text-xs text-onSurfaceVariant">
                  This application has already been verified and set to <strong>{selectedCitizen.status}</strong>.
                </div>
              )}

            </div>
          ) : (
            <div className="bg-surface border border-outlineVariant/50 rounded-md p-6 text-center text-xs text-onSurfaceVariant shadow-sm flex flex-col items-center gap-3">
              <Info className="w-8 h-8 text-outline" />
              <span>Select any registration card row to inspect verification details.</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Admin;
