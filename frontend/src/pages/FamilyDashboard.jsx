import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { censusAPI } from '../services/api.js';
import { 
  Users, UserPlus, Trash2, ArrowLeft, GraduationCap, Briefcase, 
  Calendar, Shield, Sparkles, CheckCircle, AlertTriangle, AlertCircle, Info
} from 'lucide-react';

/* Qualification list aligned with Wizard.jsx */
const QUALIFICATION_OPTIONS = [
  'Illiterate', 'Literate', 'Primary School', 'Middle School',
  'High School (10th)', 'Senior Secondary (12th)', 'Diploma',
  'Graduate / Bachelor', 'Post Graduate / Master', 'Doctorate (PhD)'
];

const RELATIONSHIP_OPTIONS = [
  'Spouse', 'Son', 'Daughter', 'Father', 'Mother', 'Sibling', 'Grandchild', 'Other'
];

const FamilyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [draft, setDraft] = useState(null);
  const [family, setFamily] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Add Member form state
  const [newMember, setNewMember] = useState({
    fullName: '',
    dob: '',
    gender: '',
    relationship: '',
    aadhaar: '',
    qualification: '',
    occupation: ''
  });

  const loadFamilyData = async () => {
    try {
      const response = await censusAPI.getDraft();
      setDraft(response.data.draft);
      setFamily(response.data.family || []);
    } catch (err) {
      setError('Failed to load household details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFamilyData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAadhaarChange = (e) => {
    // Only numbers allowed, max 12 digits
    const val = e.target.value.replace(/\D/g, '').slice(0, 12);
    setNewMember(prev => ({
      ...prev,
      aadhaar: val
    }));
  };

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validations
    if (!newMember.fullName.trim() || newMember.fullName.trim().length < 3) {
      setError('Please enter a valid full legal name.');
      return;
    }
    if (!newMember.dob) {
      setError('Date of birth is required.');
      return;
    }
    if (!newMember.gender) {
      setError('Please select a gender.');
      return;
    }
    if (!newMember.relationship) {
      setError('Please specify relationship to household head.');
      return;
    }
    if (newMember.aadhaar && newMember.aadhaar.length !== 12) {
      setError('Aadhaar number must be exactly 12 numerical digits.');
      return;
    }

    setSaving(true);
    try {
      const response = await censusAPI.addFamilyMember(newMember);
      setSuccess('Family member registered in household successfully!');
      setFamily(prev => [...prev, response.data.member]);
      // Reset form
      setNewMember({
        fullName: '',
        dob: '',
        gender: '',
        relationship: '',
        aadhaar: '',
        qualification: '',
        occupation: ''
      });
      // Refresh draft to make sure calculations stay in sync
      loadFamilyData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred while adding family member.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from your household registry?`)) {
      return;
    }

    setError('');
    setSuccess('');
    try {
      await censusAPI.deleteFamilyMember(id);
      setSuccess(`${name} removed successfully.`);
      setFamily(prev => prev.filter(m => m.id !== id));
      loadFamilyData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove family member.');
    }
  };

  // Dynamic calculations for demographics
  const calculateAge = (dobString) => {
    if (!dobString) return 'N/A';
    const dob = new Date(dobString);
    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const totalCount = family.length;
  const maleCount  = family.filter(m => m.gender === 'Male').length;
  const femaleCount = family.filter(m => m.gender === 'Female').length;
  const otherCount = totalCount - maleCount - femaleCount;

  // Age Profiles
  let children = 0; // < 18
  let adults   = 0; // 18 - 60
  let seniors  = 0; // > 60

  family.forEach(m => {
    const age = calculateAge(m.dob);
    if (age !== 'N/A') {
      if (age < 18) children++;
      else if (age <= 60) adults++;
      else seniors++;
    }
  });

  // Literacy rate calculation
  const literateCount = family.filter(m => m.qualification && m.qualification !== 'Illiterate').length;
  const literacyRate = totalCount > 0 ? Math.round((literateCount / totalCount) * 100) : 0;

  // Check form editing status
  const canEdit = draft?.status === 'DRAFT' || draft?.status === 'REJECTED';

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center p-6 bg-slate-50/50">
        <div className="flex flex-col items-center gap-4 text-[#0b2447]">
          <div className="w-12 h-12 border-4 border-t-[#0b2447] border-[#0b2447]/10 rounded-full animate-spin" />
          <p className="text-xs font-semibold tracking-wide">Loading Household Command Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow w-full bg-slate-50/50 min-h-screen pb-12">
      
      {/* Premium Hero Banner Section */}
      <div className="bg-[#0b2447] text-white py-10 px-6 sm:px-12 relative overflow-hidden shadow-md">
        {/* Subtle orange/green Indian tricolor theme nodes */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#ff9933]/10 rounded-full blur-3xl" />
        <div className="absolute left-1/2 bottom-0 w-80 h-80 bg-[#12800d]/10 rounded-full blur-3xl" />
        
        <div className="max-w-containerMax mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white mb-3 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Citizen Dashboard
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <Users className="w-8 h-8 text-[#ff9933]" /> Household Registry Command Center
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl font-light">
              Add and manage your family dependents, review demographic balances, and verify qualifications registered under Census ID: <span className="font-semibold text-white">CEN-2026-{String(draft?.id || 1).padStart(6, '0')}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
            <Shield className="w-4 h-4 text-[#ff9933]" />
            <div className="text-left">
              <span className="block text-[8px] text-slate-300 uppercase tracking-widest font-bold">Registry Status</span>
              <span className="text-xs font-bold text-[#10b981]">{draft?.status === 'APPROVED' ? 'Verified (Approved)' : draft?.status === 'SUBMITTED' ? 'Under Verification' : 'Editable Draft'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-containerMax mx-auto px-6 sm:px-12 mt-8">
        
        {/* Alerts & Notices */}
        {error && (
          <div className="bg-red-50 text-red-700 text-xs p-4 rounded-xl border border-red-150 mb-6 flex items-start gap-2.5 shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 text-xs p-4 rounded-xl border border-green-150 mb-6 flex items-start gap-2.5 shadow-sm animate-fade-in">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {!canEdit && (
          <div className="bg-blue-50 text-blue-900 text-xs p-4 rounded-xl border border-blue-150 mb-6 flex items-start gap-2.5 shadow-sm">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-700" />
            <div>
              <p className="font-bold">Registry Locked</p>
              <p className="text-blue-700/90 mt-0.5">Your census registry application has been submitted and is currently locked. To make updates, please contact your National Census Officer or wait for validation feedback.</p>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            SECTION 1 · HOUSEHOLD DEMOGRAPHIC METRICS
        ══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          
          {/* Total Dependents Card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Dependents</span>
              <h3 className="text-2xl font-extrabold text-[#0b2447] mt-1">{totalCount}</h3>
              <p className="text-[10px] text-slate-400 mt-1">Excludes household head</p>
            </div>
            <div className="w-12 h-12 bg-[#0b2447]/5 rounded-xl flex items-center justify-center text-[#0b2447]">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Gender Profile Card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Gender Split</span>
                <div className="flex gap-3 mt-1 items-baseline">
                  <span className="text-lg font-bold text-blue-600">{maleCount}M</span>
                  <span className="text-slate-350">|</span>
                  <span className="text-lg font-bold text-pink-500">{femaleCount}F</span>
                </div>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">Ratio</span>
            </div>
            
            {/* Visual ratio bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden flex">
              {totalCount > 0 ? (
                <>
                  <div className="bg-blue-500 h-full transition-all" style={{ width: `${(maleCount/totalCount)*100}%` }} />
                  <div className="bg-pink-400 h-full transition-all" style={{ width: `${(femaleCount/totalCount)*100}%` }} />
                  <div className="bg-purple-400 h-full transition-all" style={{ width: `${(otherCount/totalCount)*100}%` }} />
                </>
              ) : (
                <div className="bg-slate-200 w-full h-full" />
              )}
            </div>
          </div>

          {/* Age Distribution Card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Age Profile Breakdown</span>
              <div className="grid grid-cols-3 gap-1 text-center mt-1 text-xs">
                <div className="bg-blue-50/50 p-1.5 rounded-lg border border-blue-100/50">
                  <span className="block font-bold text-blue-700">{children}</span>
                  <span className="text-[8px] text-slate-450 uppercase font-bold">Child</span>
                </div>
                <div className="bg-green-50/50 p-1.5 rounded-lg border border-green-150/30">
                  <span className="block font-bold text-green-700">{adults}</span>
                  <span className="text-[8px] text-slate-450 uppercase font-bold">Adult</span>
                </div>
                <div className="bg-amber-50/50 p-1.5 rounded-lg border border-amber-150/30">
                  <span className="block font-bold text-amber-700">{seniors}</span>
                  <span className="text-[8px] text-slate-450 uppercase font-bold">Senior</span>
                </div>
              </div>
            </div>
          </div>

          {/* Literacy Metrics Card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Literacy Proportion</span>
              <h3 className="text-2xl font-extrabold text-[#12800d] mt-1">{literacyRate}%</h3>
              <p className="text-[10px] text-slate-400 mt-1">{literateCount} of {totalCount} members literate</p>
            </div>
            <div className="w-12 h-12 bg-green-500/5 rounded-xl flex items-center justify-center text-[#12800d]">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════
            MAIN CONTENT SPLIT
        ══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Add Member Form Card (5 columns) */}
          <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative">
            <h2 className="font-extrabold text-base text-[#0b2447] mb-1 flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <UserPlus className="w-5 h-5 text-[#ff9933]" /> Register New Dependent
            </h2>

            {canEdit ? (
              <form onSubmit={handleAddMemberSubmit} className="space-y-4 mt-4">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#0b2447] uppercase tracking-wide">Full Legal Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={newMember.fullName}
                    onChange={handleInputChange}
                    placeholder="As registered in legal document"
                    required
                    className="w-full px-3.5 py-2 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:border-[#0b2447] rounded-xl text-xs outline-none transition-all"
                  />
                </div>

                {/* Aadhaar Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#0b2447] uppercase tracking-wide">Aadhaar Number (12 Digits)</label>
                  <input 
                    type="text" 
                    name="aadhaar"
                    value={newMember.aadhaar}
                    onChange={handleAadhaarChange}
                    maxLength={12}
                    placeholder="Enter 12-digit Aadhaar ID"
                    className="w-full px-3.5 py-2 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:border-[#0b2447] rounded-xl text-xs outline-none transition-all tracking-wider"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* DOB */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#0b2447] uppercase tracking-wide">Date of Birth <span className="text-red-500">*</span></label>
                    <input 
                      type="date" 
                      name="dob"
                      value={newMember.dob}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:border-[#0b2447] rounded-xl text-xs outline-none transition-all"
                    />
                  </div>

                  {/* Gender */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#0b2447] uppercase tracking-wide">Gender <span className="text-red-500">*</span></label>
                    <select 
                      name="gender"
                      value={newMember.gender}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:border-[#0b2447] rounded-xl text-xs outline-none transition-all"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Transgender">Transgender</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Relationship */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#0b2447] uppercase tracking-wide">Relationship <span className="text-red-500">*</span></label>
                    <select 
                      name="relationship"
                      value={newMember.relationship}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:border-[#0b2447] rounded-xl text-xs outline-none transition-all"
                    >
                      <option value="">To Household Head</option>
                      {RELATIONSHIP_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Qualification */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#0b2447] uppercase tracking-wide">Qualification</label>
                    <select 
                      name="qualification"
                      value={newMember.qualification}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:border-[#0b2447] rounded-xl text-xs outline-none transition-all"
                    >
                      <option value="">Select Education</option>
                      {QUALIFICATION_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Occupation */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#0b2447] uppercase tracking-wide">Occupation / Profession</label>
                  <input 
                    type="text" 
                    name="occupation"
                    value={newMember.occupation}
                    onChange={handleInputChange}
                    placeholder="e.g. Student, Farmer, Service, Housewife"
                    className="w-full px-3.5 py-2 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:border-[#0b2447] rounded-xl text-xs outline-none transition-all"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 bg-[#ff9933] hover:bg-orange-500 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-50"
                  >
                    <UserPlus className="w-4 h-4" /> {saving ? 'Registering...' : 'Add Family Member'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-xl mt-4 border border-dashed border-slate-200">
                <AlertTriangle className="w-8 h-8 text-amber-500 mb-2" />
                <p className="text-xs font-semibold text-slate-600">Form Submission Locked</p>
                <p className="text-[10px] text-slate-400 max-w-[200px] mt-1">You cannot add new family members because the registry is locked.</p>
              </div>
            )}
          </div>

          {/* RIGHT: Family Member List View (7 columns) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Header / List overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="font-extrabold text-base text-[#0b2447] mb-1 flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <Users className="w-5 h-5 text-[#10b981]" /> Household Dependent Registry
              </h2>

              {family.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <h4 className="font-bold text-[#0b2447] text-sm">No household dependents registered yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-normal">
                    Get started by filling out the left registration form to add family members (spouse, children, parents, siblings) to your digital census file.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  {family.map((member, index) => {
                    const age = calculateAge(member.dob);
                    
                    return (
                      <div 
                        key={member.id || index}
                        className="p-4 bg-slate-50 hover:bg-slate-100/40 border border-slate-200 rounded-2xl transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          {/* Avatar matching gender color */}
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-extrabold shrink-0 mt-0.5"
                            style={{ background: member.gender === 'Male' ? '#3b82f6' : member.gender === 'Female' ? '#ec4899' : '#8b5cf6' }}
                          >
                            {member.fullName?.[0]?.toUpperCase() || '?'}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <h4 className="font-bold text-xs text-[#0b2447] truncate">{member.fullName}</h4>
                              <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">
                                {member.relationship}
                              </span>
                            </div>
                            
                            {/* Member Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4 mt-2 text-[10px] text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                DOB: {member.dob} (Age: {age} yrs)
                              </span>
                              <span className="flex items-center gap-1">
                                <Shield className="w-3 h-3 text-slate-400" />
                                Aadhaar: {member.aadhaar ? `XXXX-XXXX-${member.aadhaar.slice(-4)}` : 'Not Provided'}
                              </span>
                              {member.qualification && (
                                <span className="flex items-center gap-1 min-w-0">
                                  <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate">Edu: {member.qualification}</span>
                                </span>
                              )}
                              {member.occupation && (
                                <span className="flex items-center gap-1 min-w-0">
                                  <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate">Job: {member.occupation}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        {canEdit ? (
                          <button
                            onClick={() => handleDeleteMember(member.id, member.fullName)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer self-end sm:self-center"
                            title="Remove Member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[9px] font-bold text-blue-800 bg-blue-50 px-2 py-1 rounded-md shrink-0">
                            Verified
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Assist Info Tip */}
            <div className="bg-[#f8faff] rounded-2xl border border-slate-100 p-5 flex gap-3 text-xs leading-relaxed text-slate-600 shadow-sm">
              <Sparkles className="w-5 h-5 text-[#ff9933] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[#0b2447]">Why keep this updated?</h4>
                <p className="text-slate-500 mt-0.5 text-[11px]">
                  All household members registered here are automatically synchronized into Step 5 of your master digital census file. Keeping this current ensures exact benefit calculations for government assistance schemes (e.g. food subsidies, health cover cards).
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default FamilyDashboard;
