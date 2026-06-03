import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { censusAPI } from '../services/api.js';
import { 
  ArrowLeft, ArrowRight, Save, User, Landmark, Phone, Mail, MapPin, 
  Users, BookOpen, Briefcase, Home, Activity, Check, Plus, Trash2, Upload, FileText, AlertTriangle 
} from 'lucide-react';

const STEP_TITLES = [
  'Personal Details',
  'Identity Proof',
  'Contact Details',
  'Address details',
  'Family Structure',
  'Education Details',
  'Employment Details',
  'Housing Details',
  'Health Details',
  'Review & Submit'
];

const Wizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dbResponseId, setDbResponseId] = useState(null);

  // Form states matching step mapping
  const [formData, setFormData] = useState({
    // Step 1: Personal
    fullName: '',
    dob: '',
    gender: '',
    maritalStatus: '',
    nationality: 'Indian',

    // Step 2: Identity
    aadhaar: '',

    // Step 3: Contact
    email: '',
    phone: '',

    // Step 4: Address
    state: '',
    district: '',
    subDistrict: '',
    pinCode: '',
    houseDetails: '',

    // Step 5: Family Members
    family: [], // Array of { fullName, dob, gender, relationship, aadhaar }

    // Step 6: Education
    literacy: '',
    highestLevel: '',
    languages: '',

    // Step 7: Employment
    occupation: '',
    industry: '',

    // Step 8: Housing
    type: '',
    lighting: '',
    water: '',
    ownership: '',

    // Step 9: Health
    disabilities: '',
    illnesses: '',
    insurance: '',

    // Step 10: Declaration
    declaration: false
  });

  // Upload states for step 7
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('aadhaar_proof');
  const [uploadedDocs, setUploadedDocs] = useState([]);

  // Fetch draft details on load
  const loadDraft = async () => {
    try {
      const response = await censusAPI.getDraft();
      const { draft, family, documents } = response.data;
      
      setDbResponseId(draft.id);
      setUploadedDocs(documents);

      if (draft.status !== 'DRAFT' && draft.status !== 'REJECTED') {
        // Already filed, send to dashboard
        navigate('/dashboard');
        return;
      }

      // Prepopulate state
      setFormData({
        fullName: draft.personal_fullName || '',
        dob: draft.personal_dob || '',
        gender: draft.personal_gender || '',
        maritalStatus: draft.personal_maritalStatus || '',
        nationality: draft.personal_nationality || 'Indian',
        aadhaar: draft.identity_aadhaar || '',
        email: draft.contact_email || '',
        phone: draft.contact_phone || '',
        state: draft.address_state || '',
        district: draft.address_district || '',
        subDistrict: draft.address_subDistrict || '',
        pinCode: draft.address_pinCode || '',
        houseDetails: draft.address_houseDetails || '',
        family: family || [],
        literacy: draft.education_literacy || '',
        highestLevel: draft.education_highestLevel || '',
        languages: draft.education_languages || '',
        occupation: draft.employment_occupation || '',
        industry: draft.employment_industry || '',
        type: draft.housing_type || '',
        lighting: draft.housing_lighting || '',
        water: draft.housing_water || '',
        ownership: draft.housing_ownership || '',
        disabilities: draft.health_disabilities || '',
        illnesses: draft.health_illnesses || '',
        insurance: draft.health_insurance || '',
        declaration: false
      });

      // Resume from draft step
      setCurrentStep(draft.step || 1);
    } catch (err) {
      console.error(err);
      setError('Could not establish draft registration session.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDraft();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Family management logic
  const handleAddFamilyMember = () => {
    setFormData(prev => ({
      ...prev,
      family: [
        ...prev.family,
        { fullName: '', dob: '', gender: '', relationship: '', aadhaar: '' }
      ]
    }));
  };

  const handleFamilyMemberChange = (index, field, value) => {
    setFormData(prev => {
      const updatedFamily = [...prev.family];
      updatedFamily[index] = { ...updatedFamily[index], [field]: value };
      return { ...prev, family: updatedFamily };
    });
  };

  const handleRemoveFamilyMember = (index) => {
    setFormData(prev => ({
      ...prev,
      family: prev.family.filter((_, i) => i !== index)
    }));
  };

  // Upload handler logic
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    const uploadData = new FormData();
    uploadData.append('document', selectedFile);
    uploadData.append('documentType', documentType);

    try {
      const response = await censusAPI.uploadDocument(uploadData);
      setSuccess('Document uploaded successfully.');
      setSelectedFile(null);
      
      // Reload draft state to refresh uploaded docs list
      const draftRes = await censusAPI.getDraft();
      setUploadedDocs(draftRes.data.documents);
    } catch (err) {
      setError(err.response?.data?.message || 'File upload failed. Ensure size is under 5MB.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveStep = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess('');
    
    // Step-specific client-side checks
    if (currentStep === 10 && !formData.declaration) {
      setError('You must confirm the legal accuracy declaration checkbox to submit.');
      return;
    }

    setSaving(true);
    try {
      const response = await censusAPI.saveStep(currentStep, formData);
      
      if (currentStep === 10) {
        navigate('/dashboard');
      } else {
        // Go to next step
        setCurrentStep(response.data.nextStep);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred saving draft details.');
    } finally {
      setSaving(false);
    }
  };

  const handlePrevStep = () => {
    setError('');
    setSuccess('');
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 text-primary">
          <div className="w-12 h-12 border-4 border-t-primary border-primary-container rounded-full animate-spin" />
          <p className="text-xs font-semibold">Resuming census wizard draft...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow w-full max-w-containerMax mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Progress Stepper */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 sticky top-24 h-max">
        <h2 className="font-bold text-base text-primary mb-4">Registration Stepper</h2>
        <nav className="flex flex-col relative before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-[2px] before:bg-outlineVariant/50">
          {STEP_TITLES.map((title, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isActive = stepNum === currentStep;

            return (
              <div 
                key={title} 
                className={`flex items-start gap-3 relative z-10 mb-4 transition-opacity duration-250 ${
                  isActive || isCompleted ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-sm text-[10px] font-bold ${
                  isCompleted 
                    ? 'bg-success text-white' 
                    : isActive 
                      ? 'bg-primary text-white' 
                      : 'bg-surface-container border border-outline text-onSurfaceVariant'
                }`}>
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepNum}
                </div>
                <div>
                  <p className={`text-xs font-bold ${isActive ? 'text-primary' : 'text-onSurfaceVariant'}`}>
                    {title}
                  </p>
                  <p className="text-[10px] text-onSurfaceVariant/70">Step {stepNum} of 10</p>
                </div>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Stepper Header */}
      <div className="md:hidden w-full flex flex-col gap-1 sticky top-16 bg-background z-40 py-3 border-b border-outlineVariant/30">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-primary">Step {currentStep} of 10</span>
          <span className="text-[10px] font-bold text-onSurfaceVariant">{STEP_TITLES[currentStep - 1]}</span>
        </div>
        <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
          <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${currentStep * 10}%` }} />
        </div>
      </div>

      {/* Form Container */}
      <main className="flex-grow max-w-[720px] mx-auto w-full">
        <div className="bg-surface border border-outlineVariant/30 rounded-md shadow-sm p-6 md:p-8">
          
          <div className="border-b border-outlineVariant/20 pb-4 mb-6">
            <h3 className="text-xl font-bold text-primary mb-1">{STEP_TITLES[currentStep - 1]}</h3>
            <p className="text-xs text-onSurfaceVariant">Please ensure information matches official details.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-xs p-3 rounded-md border border-red-200 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-700 text-xs p-3 rounded-md border border-green-200 mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSaveStep} className="space-y-6">
            
            {/* Step 1: Personal Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary">Full Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-outline" />
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      required
                      className="w-full pl-10 pr-4 py-2 bg-surface border border-outlineVariant rounded-md text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-primary">Date of Birth <span className="text-red-500">*</span></label>
                    <input 
                      type="date" 
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded-md text-sm outline-none focus:border-primary focus:ring-2"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-primary">Gender <span className="text-red-500">*</span></label>
                    <select 
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded-md text-sm outline-none focus:border-primary focus:ring-2"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Transgender">Transgender</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-primary">Marital Status <span className="text-red-500">*</span></label>
                    <select 
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded-md text-sm outline-none focus:border-primary focus:ring-2"
                    >
                      <option value="">Select status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Divorced">Divorced</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-primary">Nationality <span className="text-red-500">*</span></label>
                    <select 
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded-md text-sm outline-none"
                    >
                      <option value="Indian">Indian</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Identity Proof */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary">Aadhaar Card Reference <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="aadhaar"
                    maxLength={12}
                    value={formData.aadhaar}
                    onChange={(e) => setFormData(prev => ({ ...prev, aadhaar: e.target.value.replace(/\D/g, '') }))}
                    placeholder="0000 0000 0000"
                    required
                    className="w-full px-4 py-2.5 bg-surface border border-outlineVariant rounded-md text-sm tracking-widest text-center focus:border-primary focus:ring-2"
                  />
                  <p className="text-[10px] text-onSurfaceVariant">Must match the Aadhaar verified on registration.</p>
                </div>
              </div>
            )}

            {/* Step 3: Contact Details */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-primary">Mobile Phone <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 w-4 h-4 text-outline" />
                      <input 
                        type="text" 
                        name="phone"
                        maxLength={10}
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
                        required
                        className="w-full pl-10 pr-4 py-2 bg-surface border border-outlineVariant rounded-md text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-primary">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-outline" />
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. name@domain.com"
                        className="w-full pl-10 pr-4 py-2 bg-surface border border-outlineVariant rounded-md text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Address Details */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-primary">State / UT <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="e.g. Maharashtra"
                      required
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded-md text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-primary">District <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="e.g. Mumbai"
                      required
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded-md text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-primary">Sub-District</label>
                    <input 
                      type="text" 
                      name="subDistrict"
                      value={formData.subDistrict}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded-md text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-primary">PIN Code <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="pinCode"
                      maxLength={6}
                      value={formData.pinCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, pinCode: e.target.value.replace(/\D/g, '') }))}
                      required
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded-md text-sm tracking-wide"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary">House Details (Flat, Building, Street) <span className="text-red-500">*</span></label>
                  <textarea 
                    name="houseDetails"
                    rows={2}
                    value={formData.houseDetails}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded-md text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Family Structure */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-outlineVariant/20 pb-2">
                  <span className="text-xs font-bold text-onSurfaceVariant">Household Dependents</span>
                  <button 
                    type="button"
                    onClick={handleAddFamilyMember}
                    className="text-xs font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Member
                  </button>
                </div>

                {formData.family.length === 0 ? (
                  <p className="text-xs text-onSurfaceVariant text-center py-6">No household family members registered yet.</p>
                ) : (
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    {formData.family.map((member, index) => (
                      <div key={index} className="bg-surface-low border border-outlineVariant/30 p-4 rounded-md flex flex-col gap-3 relative animate-fade-in">
                        <button 
                          type="button"
                          onClick={() => handleRemoveFamilyMember(index)}
                          className="absolute right-3 top-3 text-onSurfaceVariant hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="text-[10px] font-bold text-primary">Member #{index + 1}</span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input 
                            type="text" 
                            placeholder="Full Name"
                            value={member.fullName}
                            onChange={(e) => handleFamilyMemberChange(index, 'fullName', e.target.value)}
                            required
                            className="px-3 py-1.5 bg-surface border border-outlineVariant rounded text-xs outline-none focus:border-primary"
                          />
                          <input 
                            type="text" 
                            maxLength={12}
                            placeholder="Aadhaar Number (12 digits)"
                            value={member.aadhaar}
                            onChange={(e) => handleFamilyMemberChange(index, 'aadhaar', e.target.value.replace(/\D/g, ''))}
                            className="px-3 py-1.5 bg-surface border border-outlineVariant rounded text-xs outline-none focus:border-primary"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <input 
                            type="date" 
                            value={member.dob}
                            onChange={(e) => handleFamilyMemberChange(index, 'dob', e.target.value)}
                            className="px-2 py-1 bg-surface border border-outlineVariant rounded text-[11px] outline-none"
                          />
                          <select 
                            value={member.gender}
                            onChange={(e) => handleFamilyMemberChange(index, 'gender', e.target.value)}
                            className="px-2 py-1 bg-surface border border-outlineVariant rounded text-[11px] outline-none"
                          >
                            <option value="">Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Transgender">Trans</option>
                          </select>
                          <select 
                            value={member.relationship}
                            onChange={(e) => handleFamilyMemberChange(index, 'relationship', e.target.value)}
                            className="px-2 py-1 bg-surface border border-outlineVariant rounded text-[11px] outline-none"
                          >
                            <option value="">Relationship</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Son">Son</option>
                            <option value="Daughter">Daughter</option>
                            <option value="Father">Father</option>
                            <option value="Mother">Mother</option>
                            <option value="Sibling">Sibling</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Education details */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-primary">Literacy Status <span className="text-red-500">*</span></label>
                    <select 
                      name="literacy"
                      value={formData.literacy}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded-md text-sm outline-none focus:border-primary"
                    >
                      <option value="">Select Option</option>
                      <option value="Literate">Literate</option>
                      <option value="Illiterate">Illiterate</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-primary">Highest Education Attained</label>
                    <select 
                      name="highestLevel"
                      value={formData.highestLevel}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded-md text-sm outline-none focus:border-primary"
                    >
                      <option value="">Select Level</option>
                      <option value="Primary School">Primary School</option>
                      <option value="High School">High School</option>
                      <option value="Graduate / Bachelor">Graduate / Bachelor</option>
                      <option value="Post Graduate / Master">Post Graduate / Master</option>
                      <option value="Doctorate / PhD">Doctorate / PhD</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary">Languages Spoken / Written</label>
                  <input 
                    type="text" 
                    name="languages"
                    value={formData.languages}
                    onChange={handleChange}
                    placeholder="e.g. Hindi, English, Marathi"
                    className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded-md text-sm"
                  />
                </div>
              </div>
            )}

            {/* Step 7: Employment & Uploads */}
            {currentStep === 7 && (
              <div className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-primary">Occupation</label>
                    <input 
                      type="text" 
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      placeholder="e.g. Software Engineer"
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded-md text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-primary">Industry Segment</label>
                    <input 
                      type="text" 
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      placeholder="e.g. Information Technology"
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded-md text-sm"
                    />
                  </div>
                </div>

                {/* Upload Section */}
                <div className="border-t border-outlineVariant/30 pt-4 mt-6">
                  <span className="text-xs font-bold text-primary block mb-3">Upload Supporting Proofs (PDF, JPEG, PNG)</span>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <select 
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      className="w-full sm:w-max px-3 py-1.5 bg-surface border border-outlineVariant rounded text-xs"
                    >
                      <option value="aadhaar_proof">Aadhaar Card Scan</option>
                      <option value="address_proof">Address Proof (Utility Bill / Rent Agreement)</option>
                    </select>
                    <input 
                      type="file" 
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      className="text-xs"
                    />
                    <button 
                      type="button"
                      onClick={handleFileUpload}
                      className="bg-primary text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-1 hover:bg-primary-light active:scale-95 transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload File
                    </button>
                  </div>

                  {uploadedDocs.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <span className="text-[10px] font-bold text-onSurfaceVariant uppercase">Uploaded Scans:</span>
                      {uploadedDocs.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-2 bg-surface-low rounded border border-outlineVariant/20 text-xs">
                          <span className="font-semibold text-primary truncate max-w-xs">{doc.fileName}</span>
                          <span className="text-[9px] bg-primary-container text-primary font-bold uppercase px-2 py-0.5 rounded">
                            {doc.documentType.replace('_', ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 8: Housing Details */}
            {currentStep === 8 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-primary">Housing Type</label>
                    <select 
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded-md text-sm"
                    >
                      <option value="">Select Type</option>
                      <option value="Pucca / Concrete">Pucca / Concrete</option>
                      <option value="Kutcha / Temporary">Kutcha / Temporary</option>
                      <option value="Semi-Pucca">Semi-Pucca</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-primary">Primary Source of Lighting</label>
                    <select 
                      name="lighting"
                      value={formData.lighting}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded-md text-sm"
                    >
                      <option value="">Select Source</option>
                      <option value="Electricity">Electricity</option>
                      <option value="Kerosene / Oil">Kerosene / Oil</option>
                      <option value="Solar Energy">Solar Energy</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-primary">Primary Drinking Water Source</label>
                    <select 
                      name="water"
                      value={formData.water}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded-md text-sm"
                    >
                      <option value="">Select Source</option>
                      <option value="Tap Water">Tap Water</option>
                      <option value="Well / Tube Well">Well / Tube Well</option>
                      <option value="Handpump">Handpump</option>
                      <option value="River / Canal">River / Canal</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-primary">Ownership Status</label>
                    <select 
                      name="ownership"
                      value={formData.ownership}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded-md text-sm"
                    >
                      <option value="">Select Status</option>
                      <option value="Owned">Owned</option>
                      <option value="Rented">Rented</option>
                      <option value="Shared">Shared / Family Owned</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 9: Health Details */}
            {currentStep === 9 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-primary">Physical / Mental Disabilities</label>
                    <input 
                      type="text" 
                      name="disabilities"
                      value={formData.disabilities}
                      onChange={handleChange}
                      placeholder="e.g. None"
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded-md text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-primary">Chronic Illnesses</label>
                    <input 
                      type="text" 
                      name="illnesses"
                      value={formData.illnesses}
                      onChange={handleChange}
                      placeholder="e.g. None"
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded-md text-sm"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary">Health Insurance Details</label>
                  <input 
                    type="text" 
                    name="insurance"
                    value={formData.insurance}
                    onChange={handleChange}
                    placeholder="e.g. PM-JAY / Ayushman Bharat"
                    className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded-md text-sm"
                  />
                </div>
              </div>
            )}

            {/* Step 10: Review Summary */}
            {currentStep === 10 && (
              <div className="space-y-6">
                
                {/* Summary View Grid */}
                <div className="max-h-[300px] overflow-y-auto pr-1 space-y-4 text-xs">
                  <div className="bg-surface-low p-4 rounded border border-outlineVariant/30">
                    <h4 className="font-bold text-primary mb-2">Personal &amp; Identity Details</h4>
                    <p><strong>Full Name:</strong> {formData.fullName}</p>
                    <p><strong>DOB:</strong> {formData.dob}</p>
                    <p><strong>Gender:</strong> {formData.gender}</p>
                    <p><strong>Aadhaar:</strong> {formData.aadhaar}</p>
                  </div>
                  
                  <div className="bg-surface-low p-4 rounded border border-outlineVariant/30">
                    <h4 className="font-bold text-primary mb-2">Contact &amp; Address Details</h4>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Phone:</strong> {formData.phone}</p>
                    <p><strong>Address:</strong> {formData.houseDetails}, {formData.district}, {formData.state} - {formData.pinCode}</p>
                  </div>

                  <div className="bg-surface-low p-4 rounded border border-outlineVariant/30">
                    <h4 className="font-bold text-primary mb-2">Family Dependents</h4>
                    {formData.family.length === 0 ? (
                      <p className="text-onSurfaceVariant">No household members registered.</p>
                    ) : (
                      <ul className="list-disc pl-4 space-y-1">
                        {formData.family.map((mem, i) => (
                          <li key={i}>{mem.fullName} ({mem.relationship}) - Aadhaar: {mem.aadhaar || 'N/A'}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-blue-50/50 p-4 rounded border border-blue-200">
                  <input 
                    type="checkbox" 
                    name="declaration"
                    id="declaration"
                    checked={formData.declaration}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <label htmlFor="declaration" className="text-[11px] text-blue-950 font-medium leading-relaxed">
                    I hereby declare that the details provided in this census registration are true, complete, and correct to the best of my knowledge and official records. I understand that submitting false declarations is punishable under the Indian Census Act.
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center border-t border-outlineVariant/20 pt-5 mt-8">
              <button 
                type="button" 
                onClick={handlePrevStep}
                disabled={currentStep === 1 || saving}
                className="px-5 py-2 font-bold text-xs text-primary border border-outlineVariant rounded-full hover:bg-surface-high disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
              
              <button 
                type="submit" 
                disabled={saving}
                className="bg-primary hover:bg-primary-light text-white font-bold text-xs px-6 py-2 rounded-full flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {saving 
                  ? 'Saving...' 
                  : currentStep === 10 
                    ? 'Final Submit' 
                    : 'Save & Continue'
                }
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>

        </div>
      </main>

    </div>
  );
};

export default Wizard;
