import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, ShieldCheck, Users, ClipboardCheck, AlertTriangle, 
  MapPin, Check, X, ShieldAlert, Clock, ArrowRight, Download, Eye, 
  FileText, ExternalLink, Calendar, Map, Navigation, CheckCircle2, 
  AlertCircle, Activity, ChevronRight, HelpCircle, Send, Play, RefreshCw, 
  BarChart2, Award, FileSpreadsheet, Lock, UserCheck, Shield, Edit2, 
  FileDown, Plus, EyeOff, Info, CheckCircle
} from 'lucide-react';

// ==========================================
// MOCK REGISTRY DATABASE (INTEGRATED DATASET)
// ==========================================
const MOCK_CITIZENS = [
  {
    citizenId: 'CEN-2026-458796',
    aadhaar: '1234 5678 4587',
    mobile: '9876543210',
    familyId: 'FAM-2026-90812',
    appId: 'APP-2026-458796',
    fullName: 'Mohit Pratap Mehra',
    dob: '1994-04-12',
    gender: 'Male',
    nationality: 'Indian',
    maritalStatus: 'Single',
    occupation: 'Corporate Professional',
    education: 'Graduate (B.Tech)',
    householdType: 'Owned (Brick/Concrete)',
    state: 'Delhi',
    district: 'Central Delhi',
    address: 'H-452, Sector 21, Dwarka, Central Delhi, Delhi - 110075',
    pinCode: '110075',
    gps: { lat: '28.6139', lng: '77.2090', accuracy: '3.4m' },
    verificationStatus: 'Verified',
    registrationStatus: 'Active',
    assignedOfficer: 'Rahul Sharma',
    verificationDate: '2026-06-15',
    officerRemarks: 'All physical document verifications match. Family size verified at dwelling.',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    familyHead: 'Yes (Self)',
    familyMembers: [
      { name: 'Mohit Pratap Mehra', relation: 'Self', status: 'Verified' },
      { name: 'Suman Mehra', relation: 'Mother', status: 'Verified' },
      { name: 'Vijay Mehra', relation: 'Father', status: 'Verified' },
      { name: 'Aakash Mehra', relation: 'Brother', status: 'Pending Review' }
    ],
    documents: {
      aadhaarCard: { status: 'Verified', number: '1234 5678 4587', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
      voterId: { status: 'Verified', number: 'DL/98/045879', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80' },
      passport: { status: 'Not Provided', number: '-', url: null },
      addressProof: { status: 'Verified', name: 'Electricity Bill', url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80' },
      incomeCert: { status: 'Verified', amount: '₹8,50,000 p.a.', url: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=400&q=80' }
    },
    activityTimeline: [
      { date: '2026-06-01 10:00 AM', event: 'Registration Created', desc: 'Digital portal application initialized by citizen.' },
      { date: '2026-06-01 10:45 AM', event: 'Document Uploaded', desc: 'Aadhaar, Voter ID, and address proof verified by system gate.' },
      { date: '2026-06-03 02:30 PM', event: 'Family Member Added', desc: 'Aakash Mehra linked to the family card.' },
      { date: '2026-06-15 11:30 AM', event: 'Verification Completed', desc: 'Field verification approved by officer Rahul Sharma.' },
      { date: '2026-06-16 09:00 AM', event: 'Certificate Issued', desc: 'National Registry Certificate compiled and stamped.' }
    ],
    fraudAlerts: [
      { id: 'FRD-01', type: 'Biometric Ping Conflict', detail: 'Aakash Mehra (Brother) biometric ping matched with active Ward 12 profile.', risk: 'High' }
    ],
    analytics: {
      incomeTier: 'Middle Class',
      benefitsEligible: 'No (Exceeds Slab Limit)',
      occupancyDuration: '8 Years',
      educationTier: 'Higher Tier'
    }
  },
  {
    citizenId: 'CEN-2026-124951',
    aadhaar: '4321 8765 1249',
    mobile: '9123456780',
    familyId: 'FAM-2026-10492',
    appId: 'APP-2026-124951',
    fullName: 'Priya Rajan',
    dob: '1989-09-05',
    gender: 'Female',
    nationality: 'Indian',
    maritalStatus: 'Married',
    occupation: 'Self Employed (Consultant)',
    education: 'Post Graduate (MBA)',
    householdType: 'Rented (Apartment)',
    state: 'Maharashtra',
    district: 'Mumbai City',
    address: 'Block 4, Cuffe Parade, Colaba, Mumbai City, Maharashtra - 400005',
    pinCode: '400005',
    gps: { lat: '18.9219', lng: '72.8347', accuracy: '4.1m' },
    verificationStatus: 'Pending Review',
    registrationStatus: 'Active',
    assignedOfficer: 'Anjali Desai',
    verificationDate: '2026-06-14',
    officerRemarks: 'Biometrics check requested. Resident address confirmed but voter list match shows parent household.',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    familyHead: 'No (Head: K. Rajan)',
    familyMembers: [
      { name: 'Karthik Rajan', relation: 'Husband (Head)', status: 'Verified' },
      { name: 'Priya Rajan', relation: 'Self', status: 'Pending Review' },
      { name: 'Aarav Rajan', relation: 'Son', status: 'Pending Review' }
    ],
    documents: {
      aadhaarCard: { status: 'Verified', number: '4321 8765 1249', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
      voterId: { status: 'Pending Review', number: 'MH/12/099182', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80' },
      passport: { status: 'Verified', number: 'Z8749321', url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80' },
      addressProof: { status: 'Verified', name: 'Rent Agreement', url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80' },
      incomeCert: { status: 'Pending Review', amount: '₹12,40,000 p.a.', url: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=400&q=80' }
    },
    activityTimeline: [
      { date: '2026-06-05 11:00 AM', event: 'Registration Created', desc: 'Portal entry submitted under Colaba block.' },
      { date: '2026-06-05 11:20 AM', event: 'Document Uploaded', desc: 'Passport and Rent agreement verified.' },
      { date: '2026-06-14 02:15 PM', event: 'Verification Escalate', desc: 'Case flagged for supervisor check by Anjali Desai due to biometric overlaps.' }
    ],
    fraudAlerts: [
      { id: 'FRD-02', type: 'Identity Conflict', detail: 'Aadhaar profile matches and links to duplicate card entry in Pune Central division.', risk: 'Critical' }
    ],
    analytics: {
      incomeTier: 'Upper Middle Class',
      benefitsEligible: 'No (High Income)',
      occupancyDuration: '2 Years',
      educationTier: 'Higher Tier'
    }
  },
  {
    citizenId: 'CEN-2026-004128',
    aadhaar: '9876 5432 0041',
    mobile: '9988776655',
    familyId: 'FAM-2026-78411',
    appId: 'APP-2026-004128',
    fullName: 'Suresh Kumar Hegde',
    dob: '1972-07-20',
    gender: 'Male',
    nationality: 'Indian',
    maritalStatus: 'Married',
    occupation: 'Retired Public Servant',
    education: 'Graduate (B.A)',
    householdType: 'Owned (Independent)',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    address: '#24, 5th Main Rd, Indiranagar, Bengaluru, Karnataka - 560038',
    pinCode: '560038',
    gps: { lat: '12.9716', lng: '77.5946', accuracy: '2.8m' },
    verificationStatus: 'Verified',
    registrationStatus: 'Active',
    assignedOfficer: 'Priyanka Sen',
    verificationDate: '2026-06-16',
    officerRemarks: 'Pensioner proof verified. Location accurately mapped. Zero anomalies.',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    familyHead: 'Yes (Self)',
    familyMembers: [
      { name: 'Suresh Kumar Hegde', relation: 'Self', status: 'Verified' },
      { name: 'Usha Hegde', relation: 'Wife', status: 'Verified' },
      { name: 'Deepa Hegde', relation: 'Daughter', status: 'Verified' }
    ],
    documents: {
      aadhaarCard: { status: 'Verified', number: '9876 5432 0041', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
      voterId: { status: 'Verified', number: 'KA/04/879641', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80' },
      passport: { status: 'Verified', number: 'T9812490', url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80' },
      addressProof: { status: 'Verified', name: 'Tax Invoice Receipt', url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80' },
      incomeCert: { status: 'Verified', amount: '₹4,20,000 p.a. (Pension)', url: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=400&q=80' }
    },
    activityTimeline: [
      { date: '2026-06-10 09:30 AM', event: 'Registration Created', desc: 'Government officer verification submission.' },
      { date: '2026-06-10 10:10 AM', event: 'Document Uploaded', desc: 'Pension order document attached.' },
      { date: '2026-06-16 11:30 AM', event: 'Verification Completed', desc: 'Field audit marked successful by Priyanka Sen.' }
    ],
    fraudAlerts: [],
    analytics: {
      incomeTier: 'Lower Middle Class',
      benefitsEligible: 'Yes (Standard Senior Citizen)',
      occupancyDuration: '15 Years',
      educationTier: 'Medium Tier'
    }
  },
  {
    citizenId: 'CEN-2026-302914',
    aadhaar: '5678 1234 3029',
    mobile: '8877665544',
    familyId: 'FAM-2026-44910',
    appId: 'APP-2026-302914',
    fullName: 'Deepak Chawla',
    dob: '1985-11-30',
    gender: 'Male',
    nationality: 'Indian',
    maritalStatus: 'Married',
    occupation: 'Agricultural Supervisor',
    education: 'Secondary School',
    householdType: 'Owned (Brick/Concrete)',
    state: 'Rajasthan',
    district: 'Jaipur',
    address: '128, Hawa Mahal Rd, Jaipur, Rajasthan - 302002',
    pinCode: '302002',
    gps: { lat: '26.9124', lng: '75.7873', accuracy: '15.2m' },
    verificationStatus: 'Revisit Required',
    registrationStatus: 'Suspended',
    assignedOfficer: 'Vikram Singh',
    verificationDate: '2026-06-12',
    officerRemarks: 'Door locked on multiple schedules. Mobile unreachable. Resident verification pending re-route.',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    familyHead: 'Yes (Self)',
    familyMembers: [
      { name: 'Deepak Chawla', relation: 'Self', status: 'Revisit Required' },
      { name: 'Sarla Chawla', relation: 'Wife', status: 'Pending Review' },
      { name: 'Karan Chawla', relation: 'Son', status: 'Pending Review' },
      { name: 'Ritu Chawla', relation: 'Daughter', status: 'Pending Review' }
    ],
    documents: {
      aadhaarCard: { status: 'Verified', number: '5678 1234 3029', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
      voterId: { status: 'Verified', number: 'RJ/02/765412', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80' },
      passport: { status: 'Not Provided', number: '-', url: null },
      addressProof: { status: 'Pending Review', name: 'Land Revenue Stamp', url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80' },
      incomeCert: { status: 'Verified', amount: '₹1,80,000 p.a.', url: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=400&q=80' }
    },
    activityTimeline: [
      { date: '2026-06-02 02:00 PM', event: 'Registration Created', desc: 'Rural agricultural registry uploaded.' },
      { date: '2026-06-12 04:50 PM', event: 'Verification Visit Fail', desc: 'Officer Vikram Singh reported locked house status.' }
    ],
    fraudAlerts: [
      { id: 'FRD-03', type: 'Contact Unreachable', detail: 'Primary mobile number associated with 4 other family profiles has bad ping feedback.', risk: 'Medium' }
    ],
    analytics: {
      incomeTier: 'Lower Tier',
      benefitsEligible: 'Yes (Agricultural Welfare Scheme)',
      occupancyDuration: '22 Years',
      educationTier: 'Lower Tier'
    }
  },
  {
    citizenId: 'CEN-2026-891024',
    aadhaar: '7654 3210 8910',
    mobile: '7766554433',
    familyId: 'FAM-2026-33921',
    appId: 'APP-2026-891024',
    fullName: 'Lakshmi Narayanan',
    dob: '1991-03-18',
    gender: 'Female',
    nationality: 'Indian',
    maritalStatus: 'Married',
    occupation: 'Government School Teacher',
    education: 'Post Graduate (M.Ed)',
    householdType: 'Owned (Brick/Concrete)',
    state: 'Tamil Nadu',
    district: 'Chennai',
    address: '12, Adyar Canal Bank Rd, Chennai, Tamil Nadu - 600020',
    pinCode: '600020',
    gps: { lat: '13.0067', lng: '80.2578', accuracy: '3.1m' },
    verificationStatus: 'Pending Review',
    registrationStatus: 'Active',
    assignedOfficer: 'Rohit Verma',
    verificationDate: '2026-06-15',
    officerRemarks: 'All academic certificates uploaded. Household address confirmed.',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    familyHead: 'Yes (Self)',
    familyMembers: [
      { name: 'Lakshmi Narayanan', relation: 'Self', status: 'Pending Review' },
      { name: 'Ramanathan S.', relation: 'Husband', status: 'Verified' }
    ],
    documents: {
      aadhaarCard: { status: 'Verified', number: '7654 3210 8910', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
      voterId: { status: 'Verified', number: 'TN/01/992288', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80' },
      passport: { status: 'Not Provided', number: '-', url: null },
      addressProof: { status: 'Verified', name: 'Gas Connection Slip', url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80' },
      incomeCert: { status: 'Verified', amount: '₹5,60,000 p.a.', url: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=400&q=80' }
    },
    activityTimeline: [
      { date: '2026-06-08 10:30 AM', event: 'Registration Created', desc: 'Portal entry loaded by citizen.' },
      { date: '2026-06-08 10:45 AM', event: 'Document Uploaded', desc: 'Employment contract scan attached.' },
      { date: '2026-06-15 09:20 AM', event: 'Verification Visit Completed', desc: 'Officer Rohit Verma completed Dwelling visual checks.' }
    ],
    fraudAlerts: [],
    analytics: {
      incomeTier: 'Middle Class',
      benefitsEligible: 'Yes (Teacher Housing Allowance)',
      occupancyDuration: '6 Years',
      educationTier: 'Higher Tier'
    }
  }
];

// Zonal Dropdowns lists
const STATES_LIST = ['Delhi', 'Maharashtra', 'Karnataka', 'Rajasthan', 'Tamil Nadu', 'Uttar Pradesh'];
const DISTRICTS_MAP = {
  'Delhi': ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi'],
  'Maharashtra': ['Mumbai City', 'Mumbai Suburban', 'Pune', 'Nagpur'],
  'Karnataka': ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Dharwad'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Ajmer'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Trichy'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Noida', 'Varanasi']
};

const CitizenSearch = () => {
  const navigate = useNavigate();

  // -------------------------------------------------------------
  // STATES & DUAL BINDINGS
  // -------------------------------------------------------------
  const [citizens, setCitizens] = useState(MOCK_CITIZENS);
  const [selectedCitizen, setSelectedCitizen] = useState(MOCK_CITIZENS[0]);

  // Search Box states
  const [searchAadhaar, setSearchAadhaar] = useState('');
  const [searchMobile, setSearchMobile] = useState('');
  const [searchFamilyId, setSearchFamilyId] = useState('');
  const [searchAppId, setSearchAppId] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchState, setSearchState] = useState('');
  const [searchDistrict, setSearchDistrict] = useState('');

  // Search settings
  const [aadhaarExact, setAadhaarExact] = useState(false);
  const [mobileFamilyLinked, setMobileFamilyLinked] = useState(false);

  // Filters Panel
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterGender, setFilterGender] = useState('');
  const [filterAgeGroup, setFilterAgeGroup] = useState('');
  const [filterVerifyStatus, setFilterVerifyStatus] = useState('');
  const [filterRegStatus, setFilterRegStatus] = useState('');
  const [filterOccupation, setFilterOccupation] = useState('');
  const [filterEducation, setFilterEducation] = useState('');
  const [filterHousehold, setFilterHousehold] = useState('');

  // Detailed Modal Views
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editedFieldsLog, setEditedFieldsLog] = useState([
    { field: 'Initial Creation', oldValue: '-', newValue: 'Official Registry Card', timestamp: '2026-06-01 10:00 AM', author: 'System' }
  ]);

  // Edit fields controller
  const [editForm, setEditForm] = useState({
    mobile: '',
    address: '',
    occupation: '',
    education: '',
    maritalStatus: ''
  });

  // Verification states
  const [verificationRemarks, setVerificationRemarks] = useState('');
  const [assignedOfficerName, setAssignedOfficerName] = useState('');

  // Lightbox document viewer
  const [lightboxDoc, setLightboxDoc] = useState(null);

  // Reports compilation state
  const [compiledReportState, setCompiledReportState] = useState(null); // 'compiling', 'done'
  const [reportSelection, setReportSelection] = useState('Citizen Profile Report');
  
  // Feedback popup notifications
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Reset feedback
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Load Edit Form fields when selected citizen changes
  useEffect(() => {
    if (selectedCitizen) {
      setEditForm({
        mobile: selectedCitizen.mobile,
        address: selectedCitizen.address,
        occupation: selectedCitizen.occupation,
        education: selectedCitizen.education,
        maritalStatus: selectedCitizen.maritalStatus
      });
      setVerificationRemarks(selectedCitizen.officerRemarks || '');
      setAssignedOfficerName(selectedCitizen.assignedOfficer || 'Rahul Sharma');
    }
  }, [selectedCitizen]);

  // Reset districts dropdown when state selector changes
  useEffect(() => {
    setSearchDistrict('');
  }, [searchState]);

  // -------------------------------------------------------------
  // DYNAMIC CLIENT-SIDE FILTERING & SEARCH
  // -------------------------------------------------------------
  const filteredResults = citizens.filter(citizen => {
    // 1. Aadhaar
    if (searchAadhaar.trim()) {
      const clearAadhaarInput = searchAadhaar.replace(/\s+/g, '');
      const clearCitizenAadhaar = citizen.aadhaar.replace(/\s+/g, '');
      if (aadhaarExact) {
        if (clearCitizenAadhaar !== clearAadhaarInput) return false;
      } else {
        if (!clearCitizenAadhaar.includes(clearAadhaarInput)) return false;
      }
    }

    // 2. Mobile
    if (searchMobile.trim() && !citizen.mobile.includes(searchMobile.trim())) {
      return false;
    }

    // 3. Family ID
    if (searchFamilyId.trim() && !citizen.familyId.toLowerCase().includes(searchFamilyId.trim().toLowerCase())) {
      return false;
    }

    // 4. Application ID
    if (searchAppId.trim() && !citizen.appId.toLowerCase().includes(searchAppId.trim().toLowerCase())) {
      return false;
    }

    // 5. Name Fuzzy Search (simulated)
    if (searchName.trim()) {
      const matchQuery = searchName.trim().toLowerCase();
      const matchName = citizen.fullName.toLowerCase();
      // Similar letters or startsWith / includes fuzzy matching
      if (!matchName.includes(matchQuery)) return false;
    }

    // 6. Geographic State/District
    if (searchState && citizen.state !== searchState) return false;
    if (searchDistrict && citizen.district !== searchDistrict) return false;

    // 7. Advanced Collapsible Filters
    if (filterGender && citizen.gender !== filterGender) return false;
    if (filterVerifyStatus && citizen.verificationStatus !== filterVerifyStatus) return false;
    if (filterRegStatus && citizen.registrationStatus !== filterRegStatus) return false;
    if (filterOccupation && !citizen.occupation.includes(filterOccupation)) return false;
    if (filterEducation && !citizen.education.includes(filterEducation)) return false;
    if (filterHousehold && !citizen.householdType.includes(filterHousehold)) return false;

    // Age Group calculations
    if (filterAgeGroup) {
      const birthYear = parseInt(citizen.dob.split('-')[0]);
      const currentYear = 2026;
      const age = currentYear - birthYear;
      if (filterAgeGroup === 'Youth' && (age < 18 || age > 35)) return false;
      if (filterAgeGroup === 'Adult' && (age < 36 || age > 60)) return false;
      if (filterAgeGroup === 'Senior' && age <= 60) return false;
    }

    return true;
  });

  // -------------------------------------------------------------
  // ACTION ACTIONS HANDLERS
  // -------------------------------------------------------------
  const handleVerifyAction = (actionType) => {
    if (!selectedCitizen) return;

    let updatedStatus = 'Verified';
    let message = '';

    if (actionType === 'approve') {
      updatedStatus = 'Verified';
      message = 'Citizen verification successfully approved.';
    } else if (actionType === 'reject') {
      updatedStatus = 'Rejected';
      message = 'Citizen verification marked as Rejected.';
    } else if (actionType === 'reverify') {
      updatedStatus = 'Revisit Required';
      message = 'Reverification task dispatched to field enumerators.';
    } else if (actionType === 'escalate') {
      updatedStatus = 'Pending Review';
      message = 'Case escalated to Senior Supervisory Panel.';
    }

    const updatedDb = citizens.map(c => {
      if (c.citizenId === selectedCitizen.citizenId) {
        return { 
          ...c, 
          verificationStatus: updatedStatus,
          officerRemarks: verificationRemarks,
          assignedOfficer: assignedOfficerName
        };
      }
      return c;
    });

    setCitizens(updatedDb);
    setSelectedCitizen(prev => ({ 
      ...prev, 
      verificationStatus: updatedStatus,
      officerRemarks: verificationRemarks,
      assignedOfficer: assignedOfficerName
    }));

    // Add activity event
    const newEvent = {
      date: 'Just Now',
      event: `Status Set: ${updatedStatus}`,
      desc: `Verification status updated by Administrator. Remarks: "${verificationRemarks || 'None'}"`
    };
    setSelectedCitizen(prev => ({
      ...prev,
      activityTimeline: [newEvent, ...prev.activityTimeline]
    }));

    setFeedback({ type: 'success', message });
  };

  // Certificate Download Handler
  const handleCompileCertificate = (certName) => {
    setCompiledReportState('compiling');
    setTimeout(() => {
      setCompiledReportState('done');
      setFeedback({ type: 'success', message: `${certName} successfully compiled and saved (PDF Observatory Format).` });
      setTimeout(() => setCompiledReportState(null), 3000);
    }, 2000);
  };

  // Edit Submission Change Tracking System
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedCitizen) return;

    const changes = [];
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (editForm.mobile !== selectedCitizen.mobile) {
      changes.push({ field: 'Mobile Phone', oldValue: selectedCitizen.mobile, newValue: editForm.mobile, timestamp, author: 'Admin' });
    }
    if (editForm.address !== selectedCitizen.address) {
      changes.push({ field: 'Address Dwelling', oldValue: selectedCitizen.address, newValue: editForm.address, timestamp, author: 'Admin' });
    }
    if (editForm.occupation !== selectedCitizen.occupation) {
      changes.push({ field: 'Occupation Sector', oldValue: selectedCitizen.occupation, newValue: editForm.occupation, timestamp, author: 'Admin' });
    }
    if (editForm.education !== selectedCitizen.education) {
      changes.push({ field: 'Education level', oldValue: selectedCitizen.education, newValue: editForm.education, timestamp, author: 'Admin' });
    }
    if (editForm.maritalStatus !== selectedCitizen.maritalStatus) {
      changes.push({ field: 'Marital Status', oldValue: selectedCitizen.maritalStatus, newValue: editForm.maritalStatus, timestamp, author: 'Admin' });
    }

    if (changes.length === 0) {
      setFeedback({ type: 'warning', message: 'No profile parameters were changed.' });
      setEditFormOpen(false);
      return;
    }

    // Update main database
    const updatedDb = citizens.map(c => {
      if (c.citizenId === selectedCitizen.citizenId) {
        return { 
          ...c, 
          ...editForm 
        };
      }
      return c;
    });

    setCitizens(updatedDb);
    setSelectedCitizen(prev => ({ 
      ...prev, 
      ...editForm,
      activityTimeline: [
        { date: 'Just Now', event: 'Profile Updated', desc: `${changes.length} demographic parameter fields edited.` },
        ...prev.activityTimeline
      ]
    }));

    setEditedFieldsLog([...changes, ...editedFieldsLog]);
    setEditFormOpen(false);
    setFeedback({ type: 'success', message: 'Citizen profile records successfully updated. Changes tracked.' });
  };

  const handleClearFilters = () => {
    setSearchAadhaar('');
    setSearchMobile('');
    setSearchFamilyId('');
    setSearchAppId('');
    setSearchName('');
    setSearchState('');
    setSearchDistrict('');
    setFilterGender('');
    setFilterAgeGroup('');
    setFilterVerifyStatus('');
    setFilterRegStatus('');
    setFilterOccupation('');
    setFilterEducation('');
    setFilterHousehold('');
    setFeedback({ type: 'success', message: 'All active lookup parameters cleared.' });
  };

  // -------------------------------------------------------------
  // CALCULATE ACTIVE SEARCH CHIPS
  // -------------------------------------------------------------
  const getSearchChips = () => {
    const chips = [];
    if (searchState) chips.push({ label: `State: ${searchState}`, key: 'state' });
    if (searchDistrict) chips.push({ label: `District: ${searchDistrict}`, key: 'district' });
    if (filterGender) chips.push({ label: `Gender: ${filterGender}`, key: 'gender' });
    if (filterAgeGroup) chips.push({ label: `Age: ${filterAgeGroup}`, key: 'age' });
    if (filterVerifyStatus) chips.push({ label: `Verification: ${filterVerifyStatus}`, key: 'vstatus' });
    if (filterRegStatus) chips.push({ label: `Registry: ${filterRegStatus}`, key: 'rstatus' });
    return chips;
  };

  return (
    <div className="flex-grow w-full max-w-containerMax mx-auto px-6 py-8 flex flex-col gap-8 text-onSurface bg-background">
      
      {/* SOLID BLACK CARDS IN DARK MODE STYLES */}
      <style>{`
        .dark .flex-grow .bg-surface,
        .dark .flex-grow .bg-surface-low,
        .dark .flex-grow .bg-surface-container,
        .dark .flex-grow .bg-surface-high,
        .dark .flex-grow .bg-surface-highest,
        .dark .flex-grow .bg-white,
        .dark .flex-grow .premium-card,
        .dark .flex-grow .absolute.z-20 {
          background-color: #000000 !important;
        }
        .dark select option {
          background-color: #000000 !important;
          color: #ffffff !important;
        }
        select option {
          background-color: #ffffff;
          color: #191c1e;
        }
      `}</style>

      {/* TOAST FEEDBACK NOTIFICATIONS */}
      {feedback.message && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-lg shadow-xl flex items-center gap-3 border text-xs max-w-sm animate-fade-in ${
          feedback.type === 'success' ? 'bg-green-50 text-green-800 border-green-200 dark:bg-green-950/80 dark:text-green-300 dark:border-green-800' :
          feedback.type === 'warning' ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800' :
          'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800'
        }`}>
          {feedback.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0 text-success" />}
          {feedback.type === 'warning' && <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />}
          {feedback.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* SECURE DOCUMENT LIGHTBOX VIEWER */}
      {lightboxDoc && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full flex flex-col gap-3">
            <button 
              onClick={() => setLightboxDoc(null)}
              className="absolute -top-10 right-0 text-white hover:text-secondary font-bold text-sm flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-5 h-5" /> Close Document
            </button>
            <div className="bg-surface border border-outlineVariant/30 rounded-xl overflow-hidden shadow-2xl p-6 flex flex-col gap-4 text-xs">
              <div className="border-b border-outlineVariant/20 pb-3 flex justify-between items-center">
                <span className="font-bold text-primary uppercase text-sm">{lightboxDoc.title} Verification Scan</span>
                <span className="bg-success/10 text-success font-extrabold uppercase text-[9px] px-2 py-0.5 rounded">Secure Audit Link</span>
              </div>
              <img src={lightboxDoc.url} alt="Document Scan" className="w-full h-auto max-h-[60vh] object-contain rounded border border-outlineVariant/50 bg-black/5" />
              <div className="flex justify-between items-center pt-2">
                <span className="text-onSurfaceVariant">ID Reference: <strong className="text-primary font-mono">{lightboxDoc.number}</strong></span>
                <button 
                  onClick={() => { setLightboxDoc(null); setFeedback({ type: 'success', message: 'Document download verified.' }); }}
                  className="bg-primary text-white px-4 py-2 rounded-full font-bold text-[10px] flex items-center gap-1.5 cursor-pointer hover:bg-primary-light"
                >
                  <Download className="w-3.5 h-3.5" /> Download Original File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: PAGE HEADER */}
      <section className="relative overflow-hidden rounded-xl border border-outlineVariant/50 bg-primary p-6 text-white shadow-ambient flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#ff9933]/20 border border-[#ff9933]/30 text-[#ff9933] font-bold uppercase text-[9px] px-2.5 py-0.5 rounded-full tracking-wider">
              National Citizen Registry
            </span>
            <span className="text-[10px] text-white/70 font-semibold">• Ministry of Home Affairs</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Citizen Search Center</h2>
          <p className="text-xs text-white/80 max-w-xl leading-relaxed">
            Search, verify, manage, and review citizen census records across all regions and territories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          <button 
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="bg-secondary text-primary-dark font-bold text-xs px-4 py-2.5 rounded-full hover:bg-secondary/90 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" /> Advanced Search
          </button>
          <button 
            onClick={() => setFeedback({ type: 'success', message: `Exporting lookup list (${filteredResults.length} records) to Excel spreadsheet.` })}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Export Results
          </button>
          <button 
            onClick={() => handleCompileCertificate('National Registry Summary Report')}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Generate Report
          </button>
          <button 
            onClick={() => navigate('/admin/field-verification')}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ClipboardCheck className="w-3.5 h-3.5" /> Open Verification
          </button>
        </div>
      </section>

      {/* SECTION 2: SEARCH OVERVIEW STATS */}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Registered Citizens', count: '1.46 Billion', status: 'Total records', icon: Users, color: 'text-primary' },
          { label: 'Verified Citizens', count: '1.32 Billion', status: 'Approved files', icon: ShieldCheck, color: 'text-success' },
          { label: 'Pending Verification', count: '15 Million', status: 'In Queue', icon: Clock, color: 'text-amber-500' },
          { label: 'Active Applications', count: '1.2 Million', status: 'In Progress', icon: Activity, color: 'text-sky-500' },
          { label: 'Today\'s Searches', count: '450 Lookup', status: 'Audited log', icon: Search, color: 'text-purple-500' },
          { label: 'Recently Updated', count: '2,450 Edit', status: 'Tracked today', icon: RefreshCw, color: 'text-indigo-500' }
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-surface p-4 rounded-xl border border-outlineVariant/50 shadow-sm flex flex-col gap-1.5 hover:border-primary/50 transition-colors">
              <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-wider">{stat.label}</span>
              <div className="text-xl font-bold text-primary flex items-end justify-between">
                <span>{stat.count}</span>
                <Icon className={`w-4 h-4 ${stat.color} opacity-80`} />
              </div>
              <p className="text-[9px] text-onSurfaceVariant">{stat.status}</p>
            </div>
          );
        })}
      </section>

      {/* SEARCH AND DETAIL SPLIT SCREEN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: SEARCH FILTERS & RESULTS GRID (7 COLS) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* SECTION 3: ADVANCED SEARCH LOOKUP PANEL */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-5">
            <div className="border-b border-outlineVariant/20 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" /> Registry Advanced Search
              </h3>
              <button 
                onClick={handleClearFilters}
                className="text-[10px] text-primary font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3 animate-spin-hover" /> Clear Parameters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Aadhaar Search */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-primary uppercase text-[9px]">Aadhaar Number</label>
                  <label className="flex items-center gap-1 text-[8px] text-onSurfaceVariant cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={aadhaarExact} 
                      onChange={() => setAadhaarExact(!aadhaarExact)} 
                      className="rounded text-primary scale-75"
                    /> Exact Match
                  </label>
                </div>
                <input 
                  type="text" 
                  maxLength={14} 
                  placeholder="XXXX XXXX 4587" 
                  value={searchAadhaar}
                  onChange={(e) => setSearchAadhaar(e.target.value.replace(/[^0-9\s]/g, ''))}
                  className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary tracking-wider"
                />
              </div>

              {/* Mobile Search */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-primary uppercase text-[9px]">Mobile Number</label>
                  <label className="flex items-center gap-1 text-[8px] text-onSurfaceVariant cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={mobileFamilyLinked} 
                      onChange={() => setMobileFamilyLinked(!mobileFamilyLinked)} 
                      className="rounded text-primary scale-75"
                    /> Linked Family
                  </label>
                </div>
                <input 
                  type="text" 
                  maxLength={10} 
                  placeholder="e.g. 9876543210" 
                  value={searchMobile}
                  onChange={(e) => setSearchMobile(e.target.value.replace(/\D/g, ''))}
                  className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                />
              </div>

              {/* Family ID Search */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase text-[9px]">Family ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. FAM-2026-90812" 
                  value={searchFamilyId}
                  onChange={(e) => setSearchFamilyId(e.target.value)}
                  className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary font-mono"
                />
              </div>

              {/* Application ID Search */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase text-[9px]">Application ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. APP-2026-458796" 
                  value={searchAppId}
                  onChange={(e) => setSearchAppId(e.target.value)}
                  className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary font-mono"
                />
              </div>

              {/* Name Search */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase text-[9px]">Citizen Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Mohit Pratap Mehra" 
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                />
              </div>

              {/* State/District Search selectors */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase text-[9px]">State</label>
                  <select 
                    value={searchState} 
                    onChange={(e) => setSearchState(e.target.value)}
                    className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none text-xs"
                  >
                    <option value="">All States</option>
                    {STATES_LIST.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase text-[9px]">District</label>
                  <select 
                    value={searchDistrict} 
                    onChange={(e) => setSearchDistrict(e.target.value)}
                    disabled={!searchState}
                    className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none text-xs disabled:opacity-50"
                  >
                    <option value="">All Districts</option>
                    {searchState && DISTRICTS_MAP[searchState]?.map(dst => (
                      <option key={dst} value={dst}>{dst}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>

            {/* COLLAPSIBLE ADVANCED FILTERS */}
            {filtersOpen && (
              <div className="border-t border-outlineVariant/25 pt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-[10px] animate-fade-in">
                
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-primary uppercase text-[8px]">Gender</label>
                  <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)} className="px-2 py-1.5 bg-surface border border-outlineVariant rounded">
                    <option value="">All</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-primary uppercase text-[8px]">Age cohort</label>
                  <select value={filterAgeGroup} onChange={(e) => setFilterAgeGroup(e.target.value)} className="px-2 py-1.5 bg-surface border border-outlineVariant rounded">
                    <option value="">All</option>
                    <option value="Youth">Youth (18-35)</option>
                    <option value="Adult">Adult (36-60)</option>
                    <option value="Senior">Senior (60+)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-primary uppercase text-[8px]">Verification Status</label>
                  <select value={filterVerifyStatus} onChange={(e) => setFilterVerifyStatus(e.target.value)} className="px-2 py-1.5 bg-surface border border-outlineVariant rounded">
                    <option value="">All</option>
                    <option value="Verified">Verified</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Revisit Required">Revisit Required</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-primary uppercase text-[8px]">Registry status</label>
                  <select value={filterRegStatus} onChange={(e) => setFilterRegStatus(e.target.value)} className="px-2 py-1.5 bg-surface border border-outlineVariant rounded">
                    <option value="">All</option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-primary uppercase text-[8px]">Occupation Sector</label>
                  <select value={filterOccupation} onChange={(e) => setFilterOccupation(e.target.value)} className="px-2 py-1.5 bg-surface border border-outlineVariant rounded">
                    <option value="">All</option>
                    <option value="Corporate">Corporate Private</option>
                    <option value="Self Employed">Self Employed</option>
                    <option value="Teacher">Government / Education</option>
                    <option value="Retired">Retired / Pensioner</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-primary uppercase text-[8px]">Education Tier</label>
                  <select value={filterEducation} onChange={(e) => setFilterEducation(e.target.value)} className="px-2 py-1.5 bg-surface border border-outlineVariant rounded">
                    <option value="">All</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Post Graduate">Post Graduate</option>
                    <option value="Secondary">Secondary School</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-primary uppercase text-[8px]">Household Dwelling</label>
                  <select value={filterHousehold} onChange={(e) => setFilterHousehold(e.target.value)} className="px-2 py-1.5 bg-surface border border-outlineVariant rounded">
                    <option value="">All</option>
                    <option value="Owned">Owned</option>
                    <option value="Rented">Rented Apartment</option>
                  </select>
                </div>

              </div>
            )}

            {/* Filter chips overview */}
            {getSearchChips().length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 border-t border-outlineVariant/10 pt-3 text-[10px]">
                <span className="text-onSurfaceVariant">Active Filters:</span>
                {getSearchChips().map(chip => (
                  <span key={chip.label} className="bg-primary-container/20 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    {chip.label}
                  </span>
                ))}
              </div>
            )}

          </div>

          {/* SECTION 4: SEARCH RESULTS DATA GRID */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Citizen Search Results ({filteredResults.length} Matches)</h3>
              <span className="text-[10px] text-onSurfaceVariant font-semibold">Click row to investigate profile</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="bg-surface-low border-b border-outlineVariant/30 text-onSurfaceVariant font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Citizen Name</th>
                    <th className="py-2.5 px-3">Citizen ID</th>
                    <th className="py-2.5 px-3">Family ID</th>
                    <th className="py-2.5 px-3">State / District</th>
                    <th className="py-2.5 px-3 text-center">Verification</th>
                    <th className="py-2.5 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outlineVariant/20">
                  {filteredResults.map(citizen => (
                    <tr 
                      key={citizen.citizenId}
                      onClick={() => setSelectedCitizen(citizen)}
                      className={`hover:bg-primary-container/5 transition-colors cursor-pointer ${
                        selectedCitizen?.citizenId === citizen.citizenId ? 'bg-primary-container/10 border-l-4 border-l-primary' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="font-bold text-primary flex items-center gap-1.5">
                          {citizen.fullName}
                          {citizen.verificationStatus === 'Verified' && <ShieldCheck className="w-3.5 h-3.5 text-success" />}
                        </div>
                        <span className="text-[9px] text-onSurfaceVariant">Ph: {citizen.mobile} • {citizen.gender}</span>
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-primary">{citizen.citizenId}</td>
                      <td className="py-3 px-3 font-mono text-onSurfaceVariant">{citizen.familyId}</td>
                      <td className="py-3 px-3 text-onSurfaceVariant">
                        <div>{citizen.district}</div>
                        <span className="text-[9px] font-semibold">{citizen.state}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded font-extrabold uppercase text-[9px] ${
                          citizen.verificationStatus === 'Verified' ? 'bg-green-50 text-green-700' :
                          citizen.verificationStatus === 'Rejected' ? 'bg-red-50 text-red-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {citizen.verificationStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => { setSelectedCitizen(citizen); setProfileModalOpen(true); }}
                            className="bg-primary/5 hover:bg-primary hover:text-white p-1 rounded transition-colors text-[9px] font-bold"
                            title="Open detailed modal lookup"
                          >
                            Investigate
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredResults.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-onSurfaceVariant italic">No citizen entries matched your search criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination simulator */}
            <div className="flex justify-between items-center border-t border-outlineVariant/10 pt-3 text-[10px] text-onSurfaceVariant">
              <span>Showing 1 to {filteredResults.length} of {filteredResults.length} records</span>
              <div className="flex gap-1.5">
                <button disabled className="px-2 py-1 border rounded opacity-50 cursor-not-allowed">Previous</button>
                <button disabled className="px-2 py-1 border rounded bg-primary text-white">1</button>
                <button disabled className="px-2 py-1 border rounded opacity-50 cursor-not-allowed">Next</button>
              </div>
            </div>

          </div>

          {/* SECTION 10: FRAUD & DUPLICATE DETECTION */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-500" /> Fraud & Duplicate Detection Radar
            </h3>
            
            {selectedCitizen && selectedCitizen.fraudAlerts?.length > 0 ? (
              <div className="flex flex-col gap-3">
                {selectedCitizen.fraudAlerts.map(alert => (
                  <div key={alert.id} className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 rounded-lg flex items-start justify-between gap-3 text-xs">
                    <div className="flex gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-red-800 dark:text-red-300 uppercase text-[10px] tracking-wide">{alert.type}</div>
                        <p className="text-onSurfaceVariant mt-0.5">{alert.detail}</p>
                      </div>
                    </div>
                    <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-200 px-2 py-0.5 rounded font-extrabold uppercase text-[8px] tracking-wider shrink-0">
                      {alert.risk} Risk Level
                    </span>
                  </div>
                ))}
                <div className="flex justify-end gap-2 text-[10px]">
                  <button 
                    onClick={() => {
                      setFeedback({ type: 'success', message: 'Biometrics ticket created. Security dispatched.' });
                    }}
                    className="bg-red-600 text-white font-bold px-3 py-1.5 rounded-full hover:bg-red-700 cursor-pointer"
                  >
                    Lock Registry File
                  </button>
                  <button 
                    onClick={() => handleVerifyAction('escalate')}
                    className="border border-outlineVariant hover:bg-surface-low px-3 py-1.5 rounded-full font-bold cursor-pointer"
                  >
                    Flag to Supervisor
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-green-50 dark:bg-green-950/10 border border-green-200 dark:border-green-900/40 rounded-lg flex items-center gap-2.5 text-xs text-green-800 dark:text-green-300">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                <div>
                  <strong>Biometrics Radar Clean</strong>: No Aadhaar overlap anomalies, duplicate phones, or family mismatches found.
                </div>
              </div>
            )}
          </div>

          {/* SECTION 14: HELP & FAQ SUPPORT */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-3">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> FAQ & Operator guidelines
            </h3>
            
            <div className="space-y-2 text-xs">
              <details className="group border border-outlineVariant/20 rounded p-2.5 cursor-pointer">
                <summary className="font-bold text-primary flex justify-between items-center">
                  <span>How do I search using partial Aadhaar records?</span>
                  <ChevronRight className="w-3.5 h-3.5 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="text-onSurfaceVariant mt-2 text-[11px] leading-relaxed">
                  Toggle off the 'Exact Match' checkbox. Enter the last 4 digits (e.g. 4587) into the Aadhaar field. The engine will display matches immediately.
                </p>
              </details>
              
              <details className="group border border-outlineVariant/20 rounded p-2.5 cursor-pointer">
                <summary className="font-bold text-primary flex justify-between items-center">
                  <span>What triggers a "Critical" fraud alert flag?</span>
                  <ChevronRight className="w-3.5 h-3.5 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="text-onSurfaceVariant mt-2 text-[11px] leading-relaxed">
                  Flags occur when an Aadhaar biometric scan matches multiple separate census files, or when a landlord and tenant submit claims for the identical structure coordinate.
                </p>
              </details>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: DETAILED INVESTIGATION DASHBOARD (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {selectedCitizen ? (
            <div className="flex flex-col gap-6 animate-fade-in">
              
              {/* SECTION 5: CITIZEN PROFILE DASHBOARD */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-5">
                <div className="flex justify-between items-center border-b border-outlineVariant/20 pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-primary uppercase">Citizen Record Details</h3>
                    <span className="text-[10px] text-onSurfaceVariant font-mono font-semibold">ID: {selectedCitizen.citizenId}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                    selectedCitizen.registrationStatus === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {selectedCitizen.registrationStatus} File
                  </span>
                </div>

                {/* Profile overview box */}
                <div className="flex items-center gap-4 bg-surface-low border border-outlineVariant/20 p-3 rounded-xl">
                  <img src={selectedCitizen.photo} alt={selectedCitizen.fullName} className="w-16 h-16 rounded-full border border-primary/20 object-cover" />
                  <div className="flex-grow text-xs">
                    <h4 className="font-extrabold text-primary text-base flex items-center gap-1">
                      {selectedCitizen.fullName}
                      {selectedCitizen.verificationStatus === 'Verified' && <ShieldCheck className="w-4 h-4 text-success" />}
                    </h4>
                    <p className="text-onSurfaceVariant mt-0.5">Mobile: <strong>{selectedCitizen.mobile}</strong></p>
                    <div className="flex gap-1.5 mt-2">
                      <span className="bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded-full font-bold text-[8px] uppercase">
                        {selectedCitizen.gender}
                      </span>
                      <span className="bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded-full font-bold text-[8px] uppercase">
                        {selectedCitizen.nationality}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Personal metadata tables */}
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-[9px] font-bold text-primary uppercase tracking-wider block mb-1">Identity Specifications</span>
                    <div className="grid grid-cols-2 gap-2.5 p-3 bg-surface-low border border-outlineVariant/20 rounded-lg">
                      <div>
                        <span className="text-[9px] text-onSurfaceVariant uppercase">Date of Birth</span>
                        <div className="font-semibold text-primary">{selectedCitizen.dob}</div>
                      </div>
                      <div>
                        <span className="text-[9px] text-onSurfaceVariant uppercase">Marital Status</span>
                        <div className="font-semibold text-primary">{selectedCitizen.maritalStatus}</div>
                      </div>
                      <div>
                        <span className="text-[9px] text-onSurfaceVariant uppercase">Occupation</span>
                        <div className="font-semibold text-primary truncate">{selectedCitizen.occupation}</div>
                      </div>
                      <div>
                        <span className="text-[9px] text-onSurfaceVariant uppercase">Education Level</span>
                        <div className="font-semibold text-primary truncate">{selectedCitizen.education}</div>
                      </div>
                    </div>
                  </div>

                  {/* Family details summary */}
                  <div>
                    <span className="text-[9px] font-bold text-primary uppercase tracking-wider block mb-1">Family & Household (Card: {selectedCitizen.familyId})</span>
                    <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg flex flex-col gap-3">
                      <div className="flex justify-between text-[10px] pb-1 border-b border-outlineVariant/10">
                        <span>Head: <strong className="text-primary">{selectedCitizen.familyHead}</strong></span>
                        <span>Total Members: <strong className="text-primary">{selectedCitizen.familyMembers?.length}</strong></span>
                      </div>
                      {/* Family members list */}
                      <div className="space-y-1.5 text-[10px]">
                        {selectedCitizen.familyMembers?.map(m => (
                          <div key={m.name} className="flex justify-between items-center py-0.5">
                            <span className="font-medium text-primary">{m.name} ({m.relation})</span>
                            <span className={`text-[8px] font-bold uppercase px-1.5 py-0.2 rounded ${
                              m.status === 'Verified' ? 'text-success' : 'text-amber-600'
                            }`}>{m.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Secure Document Center */}
                  <div>
                    <span className="text-[9px] font-bold text-primary uppercase tracking-wider block mb-1">Compliance Document Scans</span>
                    <div className="space-y-2">
                      {[
                        { key: 'aadhaarCard', title: 'Aadhaar Card', value: selectedCitizen.documents.aadhaarCard },
                        { key: 'voterId', title: 'Voter Identification', value: selectedCitizen.documents.voterId },
                        { key: 'passport', title: 'Passport Bio-Page', value: selectedCitizen.documents.passport },
                        { key: 'addressProof', title: 'Dwelling Address Proof', value: selectedCitizen.documents.addressProof },
                        { key: 'incomeCert', title: 'Income & Slab Cert', value: selectedCitizen.documents.incomeCert }
                      ].map(doc => {
                        const exists = doc.value.status !== 'Not Provided';
                        return (
                          <div key={doc.key} className="p-2.5 bg-surface-low border border-outlineVariant/20 rounded-lg flex items-center justify-between text-[10px]">
                            <div className="flex items-center gap-2">
                              <FileText className={`w-4 h-4 ${exists ? 'text-primary' : 'text-outline'}`} />
                              <div>
                                <span className="font-bold text-primary">{doc.title}</span>
                                <p className="text-[8px] text-onSurfaceVariant mt-0.5">
                                  {exists ? `Ref: ${doc.value.number || doc.value.name || doc.value.amount}` : 'File not uploaded'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded ${
                                doc.value.status === 'Verified' ? 'bg-green-100 text-green-700' :
                                doc.value.status === 'Pending Review' ? 'bg-amber-100 text-amber-700' :
                                'bg-slate-100 text-slate-500'
                              }`}>
                                {doc.value.status}
                              </span>
                              {exists && (
                                <button 
                                  onClick={() => setLightboxDoc({ title: doc.title, url: doc.value.url, number: doc.value.number || 'TAX-9821' })}
                                  className="bg-primary/5 hover:bg-primary hover:text-white p-1 rounded font-bold cursor-pointer"
                                >
                                  View
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Verification Timeline Progress */}
                  <div>
                    <span className="text-[9px] font-bold text-primary uppercase tracking-wider block mb-1">Verification Milestone Progress</span>
                    <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg">
                      <div className="flex justify-between items-center text-[10px] mb-3">
                        <span>Audit Status: <strong className="text-primary">{selectedCitizen.verificationStatus}</strong></span>
                        <span className="bg-primary/5 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold text-[8px]">
                          Phase 4 Completed
                        </span>
                      </div>
                      {/* Timeline steps */}
                      <div className="flex items-center justify-between text-[8px] font-bold uppercase text-onSurfaceVariant relative">
                        <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-outlineVariant -translate-y-1/2 z-0" />
                        {[
                          { name: 'Register', active: true },
                          { name: 'Doc Verify', active: true },
                          { name: 'Field Check', active: selectedCitizen.verificationStatus !== 'Revisit Required' },
                          { name: 'Approval', active: selectedCitizen.verificationStatus === 'Verified' }
                        ].map((step, idx) => (
                          <div key={step.name} className="flex flex-col items-center gap-1.5 relative z-10 bg-surface-low px-1">
                            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono text-[7px] text-white ${
                              step.active ? 'bg-success' : 'bg-outlineVariant'
                            }`}>
                              {idx + 1}
                            </span>
                            <span>{step.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* SECTION 7: CITIZEN LOCATION & MAP */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-secondary" /> Zonal Dwelling & Location
                </h3>

                <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg text-xs flex flex-col gap-2">
                  <p className="font-semibold text-primary">{selectedCitizen.address}</p>
                  <div className="grid grid-cols-3 gap-2 border-t border-outlineVariant/10 pt-2 text-[10px] text-onSurfaceVariant">
                    <div>State: <strong className="text-primary">{selectedCitizen.state}</strong></div>
                    <div>District: <strong className="text-primary">{selectedCitizen.district}</strong></div>
                    <div>PIN Code: <strong className="text-primary font-mono">{selectedCitizen.pinCode}</strong></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] mt-1 bg-primary/5 p-2 rounded">
                    <span>GPS Coordinates: <strong className="text-primary font-mono">{selectedCitizen.gps.lat}, {selectedCitizen.gps.lng}</strong></span>
                    <span className="text-success font-semibold">Accuracy: {selectedCitizen.gps.accuracy}</span>
                  </div>
                </div>

                {/* MOCK GIS MAP BOX */}
                <div className="relative h-44 rounded-xl border border-outlineVariant/30 overflow-hidden bg-slate-900/10 flex items-center justify-center">
                  
                  {/* Styled Map Graphics */}
                  <svg viewBox="0 0 400 200" className="w-full h-full object-cover opacity-80">
                    <rect width="400" height="200" fill="#f7f9fb" />
                    {/* Grid lines */}
                    <line x1="0" y1="50" x2="400" y2="50" stroke="#eceef0" strokeWidth="0.5" />
                    <line x1="0" y1="100" x2="400" y2="100" stroke="#eceef0" strokeWidth="0.5" />
                    <line x1="0" y1="150" x2="400" y2="150" stroke="#eceef0" strokeWidth="0.5" />
                    <line x1="100" y1="0" x2="100" y2="200" stroke="#eceef0" strokeWidth="0.5" />
                    <line x1="200" y1="0" x2="200" y2="200" stroke="#eceef0" strokeWidth="0.5" />
                    <line x1="300" y1="0" x2="300" y2="200" stroke="#eceef0" strokeWidth="0.5" />
                    {/* Map paths contours */}
                    <path d="M50 80 Q100 40, 150 90 T250 80 T350 120" fill="none" stroke="#d8dadc" strokeWidth="2" strokeDasharray="5" />
                    <path d="M30 140 Q110 120, 180 160 T290 140 T370 180" fill="none" stroke="#d8dadc" strokeWidth="1.5" />
                    
                    {/* Household Pin Marker */}
                    <g transform="translate(200, 100)">
                      <circle cx="0" cy="0" r="12" fill="#ff9933" className="animate-ping" opacity="0.4" />
                      <circle cx="0" cy="0" r="6" fill="#0b2447" />
                      <circle cx="0" cy="0" r="3" fill="#ff9933" />
                      <path d="M-8 -15 H8 V-32 H-8 Z" fill="#0b2447" rx="2" />
                      <text x="0" y="-23" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">Target</text>
                    </g>
                  </svg>
                  
                  {/* Floating Controls */}
                  <div className="absolute bottom-2 left-2 flex gap-1 bg-surface border border-outlineVariant/50 p-1 rounded shadow-sm text-[8px] font-bold">
                    <button onClick={() => setFeedback({ type: 'success', message: 'GIS boundary coordinates zoomed in.' })} className="px-1.5 py-0.5 border hover:bg-surface-low">+</button>
                    <button onClick={() => setFeedback({ type: 'success', message: 'GIS boundary coordinates zoomed out.' })} className="px-1.5 py-0.5 border hover:bg-surface-low">-</button>
                  </div>
                  <button 
                    onClick={() => setFeedback({ type: 'success', message: `Plotting route navigation vectors to GPS: ${selectedCitizen.gps.lat}, ${selectedCitizen.gps.lng}` })}
                    className="absolute top-2 right-2 bg-primary text-white text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 hover:bg-primary-light"
                  >
                    <Navigation className="w-3 h-3" /> Navigate
                  </button>
                </div>
              </div>

              {/* SECTION 8: VERIFICATION CARD */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Verification Audit & Remarks</h3>
                
                <div className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-primary uppercase text-[8px]">Assigned Officer</label>
                      <input 
                        type="text" 
                        value={assignedOfficerName}
                        onChange={(e) => setAssignedOfficerName(e.target.value)}
                        className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-primary uppercase text-[8px]">Audit Date</label>
                      <input 
                        type="date" 
                        value={selectedCitizen.verificationDate} 
                        disabled 
                        className="px-2.5 py-1.5 bg-surface-low border border-outlineVariant rounded outline-none text-xs text-onSurfaceVariant"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[8px]">Verification Remarks</label>
                    <textarea 
                      rows={2}
                      value={verificationRemarks}
                      onChange={(e) => setVerificationRemarks(e.target.value)}
                      placeholder="Enter operational notes..."
                      className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary"
                    />
                  </div>

                  {/* Action Center Workflows */}
                  <div className="grid grid-cols-2 gap-2 border-t border-outlineVariant/15 pt-3">
                    <button 
                      onClick={() => handleVerifyAction('approve')}
                      className="py-2 bg-success text-white font-bold rounded-full hover:bg-success-dark transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve Record
                    </button>
                    <button 
                      onClick={() => handleVerifyAction('reject')}
                      className="py-2 bg-red-50 text-red-600 border border-red-200 font-bold rounded-full hover:bg-red-100 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Reject Record
                    </button>
                    <button 
                      onClick={() => handleVerifyAction('reverify')}
                      className="py-2 bg-amber-50 text-amber-700 border border-amber-200 font-bold rounded-full hover:bg-amber-100 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Re-audit File
                    </button>
                    <button 
                      onClick={() => handleVerifyAction('escalate')}
                      className="py-2 bg-red-100 text-red-700 font-bold rounded-full hover:bg-red-200 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" /> Escalate Case
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 9: ACTION & CERTIFICATE COMPILER */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Document & Certificate Compiler</h3>
                
                <div className="text-xs space-y-3">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleCompileCertificate('Citizen Registration Certificate')}
                      className="flex-1 py-2 border border-outlineVariant hover:bg-surface-low rounded font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-primary" /> Reg Certificate
                    </button>
                    <button 
                      onClick={() => handleCompileCertificate('Family Union Card')}
                      className="flex-1 py-2 border border-outlineVariant hover:bg-surface-low rounded font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-primary" /> Family Card
                    </button>
                  </div>

                  <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg text-[10px]">
                    <span className="font-bold text-primary block mb-1">Interactive Operations Log</span>
                    <div className="flex justify-between items-center mt-1.5">
                      <button 
                        onClick={() => setEditFormOpen(true)}
                        className="bg-primary text-white font-bold px-3 py-1.5 rounded-full hover:bg-primary-light flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" /> Modify Profile Parameters
                      </button>
                      <span className="text-onSurfaceVariant">Tracking: <strong>Active</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 11: DEMOGRAPHIC ANALYTICS INSIGHTS */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Citizen Analytics & Slab Indexes</h3>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-surface-low border border-outlineVariant/20 rounded-lg">
                    <span className="text-[8px] text-onSurfaceVariant uppercase">Income Tier Classification</span>
                    <div className="font-extrabold text-primary text-sm mt-0.5">{selectedCitizen.analytics.incomeTier}</div>
                  </div>
                  <div className="p-2.5 bg-surface-low border border-outlineVariant/20 rounded-lg">
                    <span className="text-[8px] text-onSurfaceVariant uppercase">Benefits Welfare Slab</span>
                    <div className="font-extrabold text-primary text-sm mt-0.5 truncate">{selectedCitizen.analytics.benefitsEligible}</div>
                  </div>
                  <div className="p-2.5 bg-surface-low border border-outlineVariant/20 rounded-lg">
                    <span className="text-[8px] text-onSurfaceVariant uppercase">Residence Duration Index</span>
                    <div className="font-extrabold text-primary text-sm mt-0.5">{selectedCitizen.analytics.occupancyDuration}</div>
                  </div>
                  <div className="p-2.5 bg-surface-low border border-outlineVariant/20 rounded-lg">
                    <span className="text-[8px] text-onSurfaceVariant uppercase">Qualification Tier</span>
                    <div className="font-extrabold text-primary text-sm mt-0.5">{selectedCitizen.analytics.educationTier}</div>
                  </div>
                </div>
              </div>

              {/* SECTION 12: REPORTS GENERATION CENTER */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Reports Center</h3>
                
                <div className="text-xs flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-primary uppercase text-[8px]">Select Report Theme</label>
                    <select 
                      value={reportSelection} 
                      onChange={(e) => setReportSelection(e.target.value)}
                      className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none"
                    >
                      <option value="Citizen Profile Report">Citizen Profile Report</option>
                      <option value="Verification Report">Verification Report</option>
                      <option value="Family Report">Family Report</option>
                      <option value="Document Report">Document Report</option>
                      <option value="Activity Report">Activity Report</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleCompileCertificate(reportSelection)}
                      className="flex-1 bg-primary text-white font-bold py-2 rounded-full hover:bg-primary-light transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </button>
                    <button 
                      onClick={() => setFeedback({ type: 'success', message: `${reportSelection} generated as Excel spreadsheet.` })}
                      className="flex-grow py-2 border border-outlineVariant hover:bg-surface-low font-bold rounded-full flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" /> Export Excel
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 6: CITIZEN ACTIVITY TIMELINE */}
              <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Citizen Registry Activity timeline</h3>
                
                <div className="relative border-l border-outlineVariant/40 pl-4 ml-2 space-y-4 text-xs">
                  {selectedCitizen.activityTimeline?.map((act, index) => (
                    <div key={index} className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-surface" />
                      <div className="text-[9px] text-onSurfaceVariant font-semibold">{act.date}</div>
                      <div className="font-bold text-primary mt-0.5">{act.event}</div>
                      <p className="text-onSurfaceVariant text-[10px] mt-0.5">{act.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-surface border border-outlineVariant/50 rounded-xl p-10 shadow-sm text-center text-onSurfaceVariant italic text-xs">
              Please select a citizen row from the lookup table to investigate profiles.
            </div>
          )}

        </div>

      </div>

      {/* FLOAT SIDEBAR SHORTCUTS (SECTION 13) */}
      <div className="fixed bottom-6 left-6 z-40 bg-surface border border-outlineVariant/40 shadow-xl rounded-full p-1.5 flex flex-col gap-1.5">
        <button 
          onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="p-2 hover:bg-primary/10 text-primary rounded-full transition-colors cursor-pointer"
          title="Search Citizen"
        >
          <Search className="w-4.5 h-4.5" />
        </button>
        <button 
          onClick={() => { if (selectedCitizen) setProfileModalOpen(true); }}
          className="p-2 hover:bg-primary/10 text-primary rounded-full transition-colors cursor-pointer"
          title="View Profile Modal"
        >
          <UserCheck className="w-4.5 h-4.5" />
        </button>
        <button 
          onClick={() => handleCompileCertificate('Floating Registry Audit report')}
          className="p-2 hover:bg-primary/10 text-primary rounded-full transition-colors cursor-pointer"
          title="Download Certificate"
        >
          <FileText className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* -------------------------------------------------------------
          MODAL 1: DETAILED CITIZEN PROFILE POPUP (SECTION 9 VIEW)
          ------------------------------------------------------------- */}
      {profileModalOpen && selectedCitizen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-outlineVariant/50 rounded-xl max-w-2xl w-full p-6 shadow-2xl flex flex-col gap-4 text-xs animate-fade-in relative">
            <button 
              onClick={() => setProfileModalOpen(false)}
              className="absolute top-4 right-4 text-onSurfaceVariant hover:text-primary cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-outlineVariant/20 pb-3">
              <h3 className="font-extrabold text-base text-primary uppercase">Full Profile: {selectedCitizen.fullName}</h3>
              <span className="text-[10px] text-onSurfaceVariant font-mono">Reference Registry ID: {selectedCitizen.citizenId}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <img src={selectedCitizen.photo} alt={selectedCitizen.fullName} className="w-24 h-24 rounded-lg border object-cover shadow-sm" />
                <div className="space-y-1">
                  <div>Nationality: <strong className="text-primary">{selectedCitizen.nationality}</strong></div>
                  <div>Aadhaar status: <strong className="text-success">{selectedCitizen.documents.aadhaarCard.status}</strong></div>
                  <div>Voter ID status: <strong className="text-success">{selectedCitizen.documents.voterId.status}</strong></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="p-2 bg-surface-low border rounded">
                  <span className="text-[8px] text-onSurfaceVariant uppercase font-bold">Residential Dwelling</span>
                  <p className="font-semibold text-primary mt-0.5">{selectedCitizen.address}</p>
                </div>
                <div className="p-2 bg-surface-low border rounded">
                  <span className="text-[8px] text-onSurfaceVariant uppercase font-bold">Zonal Area Coordinates</span>
                  <p className="font-mono text-primary mt-0.5">{selectedCitizen.gps.lat}, {selectedCitizen.gps.lng}</p>
                </div>
                <div className="p-2 bg-surface-low border rounded">
                  <span className="text-[8px] text-onSurfaceVariant uppercase font-bold">Officer Remarks</span>
                  <p className="italic text-onSurfaceVariant mt-0.5">"{selectedCitizen.officerRemarks || 'No remark record'}"</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-outlineVariant/20 pt-3 mt-2">
              <button 
                onClick={() => { setProfileModalOpen(false); setEditFormOpen(true); }}
                className="bg-primary text-white font-bold px-4 py-2 rounded-full hover:bg-primary-light cursor-pointer"
              >
                Modify Records
              </button>
              <button 
                onClick={() => setProfileModalOpen(false)}
                className="border border-outlineVariant px-4 py-2 rounded-full font-bold hover:bg-surface-low cursor-pointer"
              >
                Close Investigator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL 2: EDIT CITIZEN FORM & CHANGE TRACKING (SECTION 9 EDIT)
          ------------------------------------------------------------- */}
      {editFormOpen && selectedCitizen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleEditSubmit} className="bg-surface border border-outlineVariant/50 rounded-xl max-w-xl w-full p-6 shadow-2xl flex flex-col gap-4 text-xs animate-fade-in">
            <div className="border-b border-outlineVariant/20 pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-base text-primary uppercase">Modify Profile Details</h3>
                <span className="text-[10px] text-onSurfaceVariant font-mono">Modifying: {selectedCitizen.fullName}</span>
              </div>
              <button 
                type="button"
                onClick={() => setEditFormOpen(false)}
                className="text-onSurfaceVariant hover:text-primary cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="flex flex-col gap-1">
                <label className="font-bold text-primary uppercase text-[8px]">Mobile Phone</label>
                <input 
                  type="text" 
                  value={editForm.mobile}
                  onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                  className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-primary uppercase text-[8px]">Marital Status</label>
                <select 
                  value={editForm.maritalStatus}
                  onChange={(e) => setEditForm({ ...editForm, maritalStatus: e.target.value })}
                  className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="font-bold text-primary uppercase text-[8px]">Address Dwelling</label>
                <input 
                  type="text" 
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-primary uppercase text-[8px]">Occupation Sector</label>
                <input 
                  type="text" 
                  value={editForm.occupation}
                  onChange={(e) => setEditForm({ ...editForm, occupation: e.target.value })}
                  className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-primary uppercase text-[8px]">Education Level</label>
                <input 
                  type="text" 
                  value={editForm.education}
                  onChange={(e) => setEditForm({ ...editForm, education: e.target.value })}
                  className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary"
                />
              </div>

            </div>

            {/* CHANGE TRACKING HISTORY PANEL */}
            <div className="border-t border-outlineVariant/20 pt-4 mt-2">
              <span className="font-bold text-primary uppercase text-[8px] block mb-2">Change Tracking Log history</span>
              <div className="max-h-24 overflow-y-auto border border-outlineVariant/20 rounded divide-y divide-outlineVariant/10 p-2 bg-surface-low">
                {editedFieldsLog.map((log, idx) => (
                  <div key={idx} className="py-1 text-[9px] flex justify-between items-center text-onSurfaceVariant">
                    <span>Field: <strong className="text-primary">{log.field}</strong> ({log.oldValue} → {log.newValue})</span>
                    <span className="font-semibold text-right">{log.timestamp} • {log.author}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-outlineVariant/20 pt-3">
              <button 
                type="submit"
                className="bg-success text-white font-bold px-4 py-2 rounded-full hover:bg-success-dark cursor-pointer"
              >
                Save Updates & Log
              </button>
              <button 
                type="button"
                onClick={() => setEditFormOpen(false)}
                className="border border-outlineVariant px-4 py-2 rounded-full font-bold hover:bg-surface-low cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default CitizenSearch;
