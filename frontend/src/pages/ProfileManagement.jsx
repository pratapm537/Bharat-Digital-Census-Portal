import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  User, Lock, MapPin, Calendar, RefreshCw, Edit, UserCheck, Shield,
  Bell, Settings, Eye, EyeOff, Search, Plus, CheckCircle, AlertTriangle,
  ChevronRight, Clock, ArrowLeft, Send, Star, UploadCloud, Trash2,
  Phone, Mail, Download, ArrowUpRight, Sliders, X, Check, FileText,
  Smartphone, HelpCircle, Laptop, Globe, Info, Heart
} from 'lucide-react';

const translations = {
  English: {
    // Nav / Sidebar tabs
    overview: "Dashboard Overview",
    personal: "Identity & Info",
    contact: "Contact Details",
    address: "Address & Mapping",
    family: "Family & Household",
    security: "Security & Access",
    preferences: "Settings & Vault",
    directoryTitle: "Citizen Directory",
    quickActions: "Quick Actions",
    
    // Header
    backToDashboard: "Back to Dashboard",
    liveAlertsSync: "Live Alerts Sync",
    mhaComm: "MHA Communications",
    verifiedBadge: "Verified",
    activeRegistry: "Active Registry",
    citizenId: "Citizen ID",
    familyId: "Family ID",
    editProfile: "Edit Profile",
    downloadSummary: "Download Summary",
    
    // Completion Card
    completionScore: "Completion Score",
    of: "of",
    profileCardsDone: "Profile Cards Done",
    incompleteItems: "Incomplete Items:",
    alternateMobile: "Alternate Mobile",
    emergencyContact: "Emergency Contact",
    profileCompleted: "Citizen Profile Completed!",
    
    // Tab 1: Overview Dashboard
    aadhaarLink: "Aadhaar Link",
    verifiedLinked: "Verified & Linked",
    syncedUidai: "Synced successfully with UIDAI",
    censusHousehold: "Census Household",
    members: "Members",
    unitVerified: "Unit Verified",
    addressProofLabel: "Address Proof",
    lastSyncJan: "Last Sync Jan 2026",
    residencySweep: "Annual residency sweep verified",
    identityInfoTitle: "Identity Information",
    fullNameLabel: "Full Name",
    genderLabel: "Gender",
    aadhaarMaskedLabel: "Aadhaar (Masked)",
    primaryContactLabel: "Primary Contact",
    mobileLabel: "Mobile",
    emailIdLabel: "Email ID",
    resAddressLabel: "Residential Address",
    accountShieldTitle: "Account Shield",
    twoFactorLabel: "2-Factor Authentication",
    enabledText: "Enabled",
    disabledText: "Disabled",
    activeDevicesLabel: "Active Devices",
    mobileAlertsLabel: "Mobile Alerts",
    verifiedBadgeText: "Verified Badge",
    recentHistoryTitle: "Recent Profile History",
    viewDetailsBtn: "View Details",
    manageContactsBtn: "Manage Contacts",
    updateAddrBtn: "Update Address",
    manageSecurityBtn: "Manage Security",
    
    // Tab 2: Identity & Info
    basicInfoDossier: "Basic Information Dossier",
    citizenFullName: "Citizen Full Name",
    genderText: "Gender",
    dateOfBirthText: "Date of Birth",
    calculatedAgeText: "Calculated Age",
    yearsText: "Years",
    maritalStatusText: "Marital Status",
    nationalityText: "Nationality",
    secureNationalCreds: "Secure National Credentials",
    secureDataIndicators: "Secure Data Indicators",
    aadhaarCardLabel: "Aadhaar Card",
    voterIdCardLabel: "Voter ID Card",
    panNumberLabel: "PAN Number",
    passportNumberLabel: "Passport Number",
    pendingAuditText: "Pending Audit",
    requestCorrectionBtn: "Request Correction",
    submitVerificationReq: "Submit Verification Request",
    
    // Tab 3: Contacts
    commDetailsPrefs: "Communication details & Preferences",
    primaryMobileLabel: "Primary Mobile",
    altMobileLabel: "Alternate Mobile",
    emailAddrLabel: "Email Address",
    commPrefsChannels: "Communication Preference Channels",
    smsAlertsText: "SMS Alerts",
    highPriorityAlerts: "High-priority transactional alerts",
    emailAlertsText: "Email Alerts",
    monthlyReportsText: "Monthly reports & certificate updates",
    pushAlertsText: "Push Notifications",
    realTimeTrackingText: "Real-time status tracking updates",
    emergencyContactCards: "Emergency Contact Cards",
    contactNameLabel: "Contact Name",
    relationshipLabel: "Relationship",
    selectRelationText: "Select Relation",
    spouseText: "Spouse",
    fatherText: "Father",
    motherText: "Mother",
    sonText: "Son",
    daughterText: "Daughter",
    brotherText: "Brother",
    saveSettingsBtn: "Save Settings",
    
    // Tab 4: Address
    currentAddressCoords: "Current Address & Geographic Coordinates",
    lastVerifiedDate: "Last Verified: 12 January 2026",
    houseNumberLabel: "House Number",
    streetLaneLabel: "Street / Lane",
    localityVillageLabel: "Locality / Village",
    districtLabel: "District",
    stateLabel: "State",
    pinCodeLabel: "PIN Code",
    gpsCoordsLabel: "GPS Coordinates",
    locationMarkerLabel: "Household Location Marker",
    gpsLiveConnection: "GPS Live Connection",
    uploadProofBtn: "Upload Address Proof",
    requestReverifBtn: "Request Reverification",
    
    // Tab 5: Family
    householdSummaryTitle: "Household & Family Summary",
    declarationStatusLabel: "Declaration status",
    censusConfirmedLabel: "Census Confirmed",
    familyRegistryPreview: "Family Members Registry Preview",
    addFamilyMemberBtn: "Add Family Member",
    editFamilyInfoBtn: "Edit Family Information",
    openFamilyProfileBtn: "Open Family Profile",
    
    // Tab 6: Security
    accSecurityShields: "Account Security Shields & Badges",
    mobileVerifLabel: "Mobile Verification",
    verifiedMobileText: "Verified Mobile",
    emailVerifLabel: "Email Verification",
    verifiedEmailText: "Verified Email",
    twoFaShieldStatus: "2FA Shield Status",
    protectedAccountText: "Protected Account",
    vulnerableAccountText: "Vulnerable Account",
    disable2FaBtn: "Disable 2FA",
    enable2FaBtn: "Enable 2FA",
    passwordMgmtTitle: "Password Management",
    currentPasswordLabel: "Current Password",
    newPasswordLabel: "New Password",
    confirmPasswordLabel: "Confirm New Password",
    changePasswordBtn: "Change Password",
    activeDeviceSessions: "Active Device Sessions",
    logoutAllDevicesBtn: "Logout All Devices",
    terminateSessionBtn: "Terminate Session",
    securityAlertsTitle: "Security Alerts Dashboard",
    
    // Tab 7: Settings & Vault
    personalizationTheme: "Portal Personalization & Theme",
    portalLanguageLabel: "Portal Language",
    themeSelectorLabel: "Theme Selector",
    lightModeBtn: "Light Mode",
    darkModeBtn: "Dark Mode",
    accessibilityFontLabel: "Accessibility font settings",
    preferredNotificationPath: "Preferred Notification Path",
    digitalCredsVault: "Digital Credentials Vault",
    syncVaultBtn: "Sync Vault",
    uploadText: "Upload",
    downloadText: "Download",
    registryAuditLogs: "Registry Audit Logs & Activity History",
    
    // Help & Support
    helpdeskTitle: "Census Helpdesk & Grievance Tickets",
    faqTitle: "Frequently Asked Questions",
    submitTicketTitle: "Submit Registry Ticket",
    subjectLabel: "Subject",
    categoryLabel: "Category",
    descriptionLabel: "Description",
    raiseTicketBtn: "Raise Complaint Ticket",
    aiAgentText: "AI Agent",
    askChatInput: "Ask about details, security, or address proof...",
    
    // Modals
    editPersonalTitle: "Edit Personal Registry Data",
    cancelText: "Cancel",
    saveChangesBtn: "Save Profile Changes",
    identityVerifCorrection: "Identity Verification Correction",
    targetDocField: "Target Document / Field",
    proposedCorrVal: "Proposed Correction Value",
    reasonRequest: "Reason for request",
    proofAttachment: "Proof Attachment (Simulation)",
    submitQueryBtn: "Submit Query",
    linkFamilyMember: "Link Family Member",
    verifyFamilyBiometrics: "Verify via Linked Aadhaar Biometrics",
    linkMemberBtn: "Link Member"
  },
  Hindi: {
    // Nav / Sidebar tabs
    overview: "डैशबोर्ड अवलोकन",
    personal: "पहचान और जानकारी",
    contact: "संपर्क विवरण",
    address: "पता और मानचित्रण",
    family: "परिवार और गृहस्थी",
    security: "सुरक्षा और पहुंच",
    preferences: "सेटिंग्स और दस्तावेज़",
    directoryTitle: "नागरिक निर्देशिका",
    quickActions: "त्वरित कार्रवाई",
    
    // Header
    backToDashboard: "डैशबोर्ड पर वापस जाएं",
    liveAlertsSync: "लाइव अलर्ट सिंक",
    mhaComm: "गृह मंत्रालय संचार",
    verifiedBadge: "सत्यापित",
    activeRegistry: "सक्रिय रजिस्ट्री",
    citizenId: "नागरिक आईडी",
    familyId: "परिवार आईडी",
    editProfile: "प्रोफ़ाइल संपादित करें",
    downloadSummary: "विवरण सारांश डाउनलोड करें",
    
    // Completion Card
    completionScore: "पूर्णता स्कोर",
    of: "में से",
    profileCardsDone: "प्रोफ़ाइल कार्ड पूर्ण",
    incompleteItems: "अपूर्ण विवरण:",
    alternateMobile: "वैकल्पिक मोबाइल",
    emergencyContact: "आपातकालीन संपर्क",
    profileCompleted: "नागरिक प्रोफ़ाइल पूर्ण!",
    
    // Tab 1: Overview Dashboard
    aadhaarLink: "आधार लिंक",
    verifiedLinked: "सत्यापित और लिंक किया गया",
    syncedUidai: "सफलतापूर्वक UIDAI के साथ सिंक किया गया",
    censusHousehold: "जनगणना परिवार",
    members: "सदस्य",
    unitVerified: "यूनिट सत्यापित",
    addressProofLabel: "पता प्रमाण",
    lastSyncJan: "अंतिम सिंक जनवरी 2026",
    residencySweep: "वार्षिक निवास सत्यापन सत्यापित",
    identityInfoTitle: "पहचान संबंधी जानकारी",
    fullNameLabel: "पूरा नाम",
    genderLabel: "लिंग",
    aadhaarMaskedLabel: "आधार (मास्क्ड)",
    primaryContactLabel: "प्राथमिक संपर्क",
    mobileLabel: "मोबाइल",
    emailIdLabel: "ईमेल आईडी",
    resAddressLabel: "आवासीय पता",
    accountShieldTitle: "खाता सुरक्षा",
    twoFactorLabel: "द्वि-कारक प्रमाणीकरण",
    enabledText: "सक्षम",
    disabledText: "अक्षम",
    activeDevicesLabel: "सक्रिय उपकरण",
    mobileAlertsLabel: "मोबाइल अलर्ट",
    verifiedBadgeText: "सत्यापित बैज",
    recentHistoryTitle: "हालिया प्रोफ़ाइल इतिहास",
    viewDetailsBtn: "विवरण देखें",
    manageContactsBtn: "संपर्क प्रबंधित करें",
    updateAddrBtn: "पता अपडेट करें",
    manageSecurityBtn: "सुरक्षा प्रबंधित करें",
    
    // Tab 2: Identity & Info
    basicInfoDossier: "बुनियादी जानकारी दस्तावेज",
    citizenFullName: "नागरिक का पूरा नाम",
    genderText: "लिंग",
    dateOfBirthText: "जन्म तिथि",
    calculatedAgeText: "अनुमानित आयु",
    yearsText: "वर्ष",
    maritalStatusText: "वैवाहिक स्थिति",
    nationalityText: "राष्ट्रीयता",
    secureNationalCreds: "सुरक्षित राष्ट्रीय साख",
    secureDataIndicators: "सुरक्षित डेटा संकेतक",
    aadhaarCardLabel: "आधार कार्ड",
    voterIdCardLabel: "वोटर आईडी कार्ड",
    panNumberLabel: "पैन नंबर",
    passportNumberLabel: "पासपोर्ट नंबर",
    pendingAuditText: "सत्यापन लंबित",
    requestCorrectionBtn: "सुधार का अनुरोध करें",
    submitVerificationReq: "सत्यापन अनुरोध सबमिट करें",
    
    // Tab 3: Contacts
    commDetailsPrefs: "संचार विवरण और प्राथमिकताएं",
    primaryMobileLabel: "प्राथमिक मोबाइल",
    altMobileLabel: "वैकल्पिक मोबाइल",
    emailAddrLabel: "ईमेल पता",
    commPrefsChannels: "संचार प्राथमिकता चैनल",
    smsAlertsText: "एसएमएस अलर्ट",
    highPriorityAlerts: "उच्च प्राथमिकता वाले लेनदेन अलर्ट",
    emailAlertsText: "ईमेल अलर्ट",
    monthlyReportsText: "मासिक रिपोर्ट और प्रमाणपत्र अपडेट",
    pushAlertsText: "पुश सूचनाएं",
    realTimeTrackingText: "वास्तविक समय स्थिति ट्रैकिंग अपडेट",
    emergencyContactCards: "आपातकालीन संपर्क कार्ड",
    contactNameLabel: "संपर्क नाम",
    relationshipLabel: "संबंध",
    selectRelationText: "संबंध चुनें",
    spouseText: "पति/पत्नी",
    fatherText: "पिता",
    motherText: "माता",
    sonText: "पुत्र",
    daughterText: "पुत्री",
    brotherText: "भाई",
    saveSettingsBtn: "सेटिंग्स सुरक्षित करें",
    
    // Tab 4: Address
    currentAddressCoords: "वर्तमान पता और भौगोलिक निर्देशांक",
    lastVerifiedDate: "अंतिम सत्यापित: 12 जनवरी 2026",
    houseNumberLabel: "मकान संख्या",
    streetLaneLabel: "गली / मार्ग",
    localityVillageLabel: "इलाका / गाँव",
    districtLabel: "जिला",
    stateLabel: "राज्य",
    pinCodeLabel: "पिन कोड",
    gpsCoordsLabel: "जीपीएस निर्देशांक",
    locationMarkerLabel: "घरेलू स्थान मार्कर",
    gpsLiveConnection: "जीपीएस लाइव कनेक्शन",
    uploadProofBtn: "पता प्रमाण अपलोड करें",
    requestReverifBtn: "पुनः सत्यापन का अनुरोध करें",
    
    // Tab 5: Family
    householdSummaryTitle: "घरेलू और परिवार सारांश",
    declarationStatusLabel: "घोषणा स्थिति",
    censusConfirmedLabel: "जनगणना की पुष्टि",
    familyRegistryPreview: "परिवार के सदस्यों का रजिस्ट्री पूर्वावलोकन",
    addFamilyMemberBtn: "परिवार का सदस्य जोड़ें",
    editFamilyInfoBtn: "परिवार की जानकारी संपादित करें",
    openFamilyProfileBtn: "पारिवारिक प्रोफ़ाइल खोलें",
    
    // Tab 6: Security
    accSecurityShields: "खाता सुरक्षा शील्ड और बैज",
    mobileVerifLabel: "मोबाइल सत्यापन",
    verifiedMobileText: "सत्यापित मोबाइल",
    emailVerifLabel: "ईमेल सत्यापन",
    verifiedEmailText: "सत्यापित ईमेल",
    twoFaShieldStatus: "2FA शील्ड स्थिति",
    protectedAccountText: "सुरक्षित खाता",
    vulnerableAccountText: "असुरक्षित खाता",
    disable2FaBtn: "2FA अक्षम करें",
    enable2FaBtn: "2FA सक्षम करें",
    passwordMgmtTitle: "पासवर्ड प्रबंधन",
    currentPasswordLabel: "वर्तमान पासवर्ड",
    newPasswordLabel: "नया पासवर्ड",
    confirmPasswordLabel: "नए पासवर्ड की पुष्टि करें",
    changePasswordBtn: "पासवर्ड बदलें",
    activeDeviceSessions: "सक्रिय डिवाइस सत्र",
    logoutAllDevicesBtn: "सभी उपकरणों से लॉगआउट करें",
    terminateSessionBtn: "सत्र समाप्त करें",
    securityAlertsTitle: "सुरक्षा अलर्ट डैशबोर्ड",
    
    // Tab 7: Settings & Vault
    personalizationTheme: "पोर्टल वैयक्तिकरण और थीम",
    portalLanguageLabel: "पोर्टल भाषा",
    themeSelectorLabel: "थीम चयनकर्ता",
    lightModeBtn: "लाइट मोड",
    darkModeBtn: "डार्क मोड",
    accessibilityFontLabel: "अभिगम्यता फ़ॉन्ट सेटिंग्स",
    preferredNotificationPath: "पसंदीदा अधिसूचना मार्ग",
    digitalCredsVault: "डिजिटल कलेज क्रेडेंशियल वॉल्ट",
    syncVaultBtn: "सिंक वॉल्ट",
    uploadText: "अपलोड करें",
    downloadText: "डाउनलोड करें",
    registryAuditLogs: "रजिस्ट्री ऑडिट लॉग और गतिविधि इतिहास",
    
    // Help & Support
    helpdeskTitle: "जनगणना सहायता डेस्क और शिकायत टिकट",
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    submitTicketTitle: "रजिस्ट्री टिकट जमा करें",
    subjectLabel: "विषय",
    categoryLabel: "श्रेणी",
    descriptionLabel: "विवरण",
    raiseTicketBtn: "शिकायत टिकट दर्ज करें",
    aiAgentText: "एआई एजेंट",
    askChatInput: "विवरण, सुरक्षा, या पता प्रमाण के बारे में पूछें...",
    
    // Modals
    editPersonalTitle: "बुनियादी रजिस्ट्री डेटा संपादित करें",
    cancelText: "रद्द करें",
    saveChangesBtn: "बदलाव सुरक्षित करें",
    identityVerifCorrection: "पहचान सत्यापन सुधार",
    targetDocField: "लक्षित दस्तावेज़ / क्षेत्र",
    proposedCorrVal: "प्रस्तावित सुधार मूल्य",
    reasonRequest: "अनुरोध का कारण",
    proofAttachment: "प्रमाण संलग्नक (सिमुलेशन)",
    submitQueryBtn: "पूछताछ सबमिट करें",
    linkFamilyMember: "परिवार का सदस्य लिंक करें",
    verifyFamilyBiometrics: "सत्यापित आधार बायोमेट्रिक्स के माध्यम से सत्यापित करें",
    linkMemberBtn: "सदस्य लिंक करें"
  }
};

const ProfileManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Alert states
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Active Tab state
  const [activeTab, setActiveTab] = useState('overview');

  // Modal / Dialog toggles
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isRequestingCorrection, setIsRequestingCorrection] = useState(false);
  const [isAddingFamily, setIsAddingFamily] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Correction form state
  const [correctionField, setCorrectionField] = useState('name');
  const [correctionProposed, setCorrectionProposed] = useState('');
  const [correctionReason, setCorrectionReason] = useState('');
  const [correctionProofName, setCorrectionProofName] = useState('');

  // Profile avatar photo
  const [profilePhoto, setProfilePhoto] = useState(null);

  // Dynamic user data states
  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'Mohit Pratap Mehra',
    gender: 'Male',
    dob: '15 January 1995',
    age: 31,
    maritalStatus: 'Married',
    nationality: 'Indian'
  });

  const [identities, setIdentities] = useState({
    aadhaar: 'XXXX XXXX 4587',
    aadhaarFull: '1234 5678 4587',
    voterId: 'XXXXXX1234',
    voterIdFull: 'ABC1231234',
    pan: 'XXXXX9876F',
    panFull: 'ABCDE9876F',
    passport: 'XXXXXX789',
    passportFull: 'Z12345789'
  });

  const [maskIdentities, setMaskIdentities] = useState({
    aadhaar: true,
    voterId: true,
    pan: true,
    passport: true
  });

  const [contactInfo, setContactInfo] = useState({
    mobile: '+91 98765 45879',
    alternateMobile: '', // Missing initially
    email: 'mohit.mehra@gov-link.in',
    emergencyName: '', // Missing initially
    emergencyRelation: '',
    emergencyMobile: ''
  });

  const [addressInfo, setAddressInfo] = useState({
    houseNo: 'House No. 45',
    street: 'Sector 21',
    locality: 'Dwarka',
    city: 'New Delhi',
    district: 'South West Delhi',
    state: 'Delhi',
    pinCode: '110001',
    lastVerified: '12 January 2026',
    gps: '28.6139° N, 77.2090° E'
  });

  const [familyMembers, setFamilyMembers] = useState([
    { id: 1, name: 'Amit Mehra', relation: 'Son', verified: true, avatar: 'AM' },
    { id: 2, name: 'Riya Mehra', relation: 'Daughter', verified: true, avatar: 'RM' },
    { id: 3, name: 'Sunita Mehra', relation: 'Spouse', verified: true, avatar: 'SM' },
    { id: 4, name: 'Karan Mehra', relation: 'Brother', verified: true, avatar: 'KM' },
    { id: 5, name: 'Devendra Mehra', relation: 'Father', verified: true, avatar: 'DM' }
  ]);

  const [newFamilyMember, setNewFamilyMember] = useState({
    name: '',
    relation: 'Son',
    verified: true
  });

  const [documents, setDocuments] = useState([
    { id: 'DOC-1', name: 'Aadhaar Card', status: 'Verified', date: '04 Jun 2026', type: 'Identity Proof' },
    { id: 'DOC-2', name: 'Voter ID Card', status: 'Verified', date: '02 Jun 2026', type: 'Identity Proof' },
    { id: 'DOC-3', name: 'Address Proof (Electricity Bill)', status: 'Pending', date: 'Pending Upload', type: 'Address Proof' },
    { id: 'DOC-4', name: 'Passport Copy', status: 'Uploaded', date: '05 Jun 2026', type: 'Identity Proof' }
  ]);

  // Security password change states
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: ''
  });

  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  const [activeSessions, setActiveSessions] = useState([
    { id: 1, device: 'Chrome Browser (Current)', location: 'Delhi, India', time: 'Active Now', current: true },
    { id: 2, device: 'Vite Native App', location: 'Delhi, India', time: '15 June 2026 · 10:45 AM', current: false },
    { id: 3, device: 'Safari Browser - iPhone', location: 'Mumbai, India', time: '12 June 2026 · 09:12 PM', current: false }
  ]);

  const [securityLogs, setSecurityLogs] = useState([
    { id: 1, title: 'Profile Updated', detail: 'Address details updated successfully.', time: 'Today · 12:40 PM', type: 'info' },
    { id: 2, title: 'New Login Detected', detail: 'Successful credentials sign-in from Dwarka.', time: 'Yesterday · 10:45 AM', type: 'warning' },
    { id: 3, title: 'Password Changed', detail: 'Credential security renewal completed.', time: '15 May 2026', type: 'success' }
  ]);

  // Account preferences state
  const [preferences, setPreferences] = useState({
    language: localStorage.getItem('portal_language') || 'English',
    theme: localStorage.getItem('portal_theme') || 'Light',
    accessibility: localStorage.getItem('portal_accessibility') || 'Normal Font',
    preferredComm: 'SMS + Email',
    smsAlerts: true,
    emailAlerts: true,
    pushAlerts: false
  });

  // Activity History timeline
  const [activityHistory, setActivityHistory] = useState([
    { id: 1, title: 'Profile Created', desc: 'Citizen registration completed with AADHAAR verification.', date: '12 Jan 2024 · 09:30 AM', icon: 'UserCheck', color: 'bg-green-100 text-green-700' },
    { id: 2, title: 'Address Updated', desc: 'Dwarka residence mapped to national census grid.', date: '12 Jan 2026 · 11:20 AM', icon: 'MapPin', color: 'bg-blue-100 text-blue-700' },
    { id: 3, title: 'Password Changed', desc: 'Secure security credential rotation.', date: '15 May 2026 · 04:50 PM', icon: 'Lock', color: 'bg-amber-100 text-amber-700' },
    { id: 4, title: 'Family Member Added', desc: 'Amit Mehra (Son) linked to household registry.', date: '28 May 2026 · 02:15 PM', icon: 'Plus', color: 'bg-purple-100 text-purple-700' },
    { id: 5, title: 'Document Uploaded', desc: 'Official passport credential synced with vault.', date: '05 Jun 2026 · 10:30 AM', icon: 'FileText', color: 'bg-indigo-100 text-indigo-700' }
  ]);

  // Help desk support ticket state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('profile');
  const [ticketDescription, setTicketDescription] = useState('');

  // Live support chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: 'Namaste! I am the Bharat Census Assistant. How can I help you manage your profile, document vault, or security settings today?', sender: 'bot', time: 'Just now' }
  ]);
  const [chatTyping, setChatTyping] = useState(false);

  // FAQs accordions state
  const [faqOpen, setFaqOpen] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false
  });

  // Toggle FAQ Accordion
  const toggleFaq = (index) => {
    setFaqOpen(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Toggle identity mask
  const toggleMask = (key) => {
    setMaskIdentities(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Auto clear alerts
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Dynamic Profile Completion calculation
  const profileCompletion = useMemo(() => {
    let base = 85;
    let completedSections = 4;
    const missing = [];

    if (contactInfo.alternateMobile) {
      base += 5;
    } else {
      missing.push('Alternate Mobile');
    }

    if (contactInfo.emergencyName && contactInfo.emergencyMobile) {
      base += 10;
      completedSections += 1;
    } else {
      missing.push('Emergency Contact');
    }

    return {
      percentage: base,
      completedCount: completedSections,
      totalCount: 5,
      missingFields: missing
    };
  }, [contactInfo]);

  // Synchronize language selection to localStorage & fire custom event
  useEffect(() => {
    localStorage.setItem('portal_language', preferences.language);
    window.dispatchEvent(new Event('languageChange'));
  }, [preferences.language]);

  // Synchronize theme selection to localStorage, HTML class & fire custom event
  useEffect(() => {
    localStorage.setItem('portal_theme', preferences.theme);
    if (preferences.theme === 'Dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    window.dispatchEvent(new Event('themeChange'));
  }, [preferences.theme]);

  // Synchronize accessibility font settings to root DOM font-size & fire custom event
  useEffect(() => {
    const html = document.documentElement;
    if (preferences.accessibility === 'Medium Font') {
      html.style.fontSize = '17px';
    } else if (preferences.accessibility === 'Large Font') {
      html.style.fontSize = '19px';
    } else {
      html.style.fontSize = '15px'; // default
    }
    localStorage.setItem('portal_accessibility', preferences.accessibility);
    window.dispatchEvent(new Event('accessibilityChange'));
  }, [preferences.accessibility]);

  // Translation helper function
  const t = (key) => {
    const currentLang = preferences.language || 'English';
    if (translations[currentLang] && translations[currentLang][key]) {
      return translations[currentLang][key];
    }
    // Fallback to English dictionary or key name
    return (translations['English'] && translations['English'][key]) ? translations['English'][key] : key;
  };

  // Password strength meter logic
  const passwordStrength = useMemo(() => {
    const pass = passwords.newPass;
    if (!pass) return { score: 0, text: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, text: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score, text: 'Medium', color: 'bg-amber-500' };
    return { score, text: 'Strong', color: 'bg-[#138808]' };
  }, [passwords.newPass]);

  // Download Profile Summary Simulator
  const handleDownloadSummary = () => {
    const summaryText = `
========================================
    BHARAT NATIONAL CENSUS REGISTRY
       OFFICIAL CITIZEN DOSSIER
========================================
Generated on: ${new Date().toLocaleDateString()}
Citizen Verification ID: CEN-2026-458796
Family Reference ID: FAM-2026-987654
Aadhaar Link: Verified (XXXX XXXX 4587)
----------------------------------------

CITIZEN IDENTIFICATION SUMMARY:
-------------------------------
Full Name: ${personalInfo.fullName}
Gender: ${personalInfo.gender}
Date of Birth: ${personalInfo.dob}
Marital Status: ${personalInfo.maritalStatus}
Nationality: ${personalInfo.nationality}

CONTACT INFORMATION:
--------------------
Primary Mobile: ${contactInfo.mobile}
Alternate Mobile: ${contactInfo.alternateMobile || 'Not Provided'}
Email Address: ${contactInfo.email}

RESIDENCY ADDRESS LOGS:
-----------------------
House No/Details: ${addressInfo.houseNo}
Street / Lane: ${addressInfo.street}
Locality / Village: ${addressInfo.locality}
City / State / PIN: ${addressInfo.city}, ${addressInfo.state} - ${addressInfo.pinCode}
GPS Coordinates: ${addressInfo.gps}
Verification Status: VERIFIED

FAMILY UNIT OVERVIEW:
---------------------
Head of Household: ${personalInfo.fullName}
Total Members: ${familyMembers.length}
Verification Status: Verified Census Household

----------------------------------------
End of Dossier Summary
Ministry of Home Affairs, Government of India
========================================
`;
    const blob = new Blob([summaryText.trim()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Citizen_Profile_Summary_${personalInfo.fullName.replace(/\s+/g, '_')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setSuccess('Citizen Profile Summary text dossier generated & downloaded.');
  };

  // Submit Personal Info Edit
  const handleSavePersonalInfo = (e) => {
    e.preventDefault();
    setIsEditingPersonal(false);
    // Add to activity history
    setActivityHistory(prev => [
      {
        id: Date.now(),
        title: 'Profile Updated',
        desc: 'Personal basic records updated by citizen.',
        date: 'Today · Just now',
        icon: 'User',
        color: 'bg-blue-100 text-blue-700'
      },
      ...prev
    ]);
    setSuccess('Basic Identity fields updated successfully in portal memory.');
  };

  // Submit Correction Request
  const handleSaveCorrectionRequest = (e) => {
    e.preventDefault();
    if (!correctionProposed || !correctionReason) {
      setError('Please fill out all request parameters.');
      return;
    }
    setIsRequestingCorrection(false);
    setSuccess(`Verification correction query submitted. Ticket ID: #CORR-${Math.floor(10000 + Math.random() * 90000)} issued.`);
    setCorrectionProposed('');
    setCorrectionReason('');
    setCorrectionProofName('');
  };

  // Upload photo simulation
  const handlePhotoUploadSim = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(URL.createObjectURL(file));
      setSuccess('Profile Avatar photo updated successfully.');
      setIsUploadingPhoto(false);
      // Trigger activity audit
      setActivityHistory(prev => [
        {
          id: Date.now(),
          title: 'Avatar Image Updated',
          desc: 'Citizen uploaded new identity biometric snapshot.',
          date: 'Today · Just now',
          icon: 'User',
          color: 'bg-green-100 text-green-700'
        },
        ...prev
      ]);
    }
  };

  // Save Contact & Emergency Details
  const handleSaveContactDetails = (e) => {
    e.preventDefault();
    // Simulate updating
    setSuccess('Communication preferences & Emergency contacts recorded.');
  };

  // Save Address Details
  const handleSaveAddressDetails = (e) => {
    e.preventDefault();
    setSuccess('Address update request submitted. A field officer verification will be automatically scheduled.');
    setActivityHistory(prev => [
      {
        id: Date.now(),
        title: 'Address Sync Request',
        desc: 'New residential registration coordinates requested.',
        date: 'Today · Just now',
        icon: 'MapPin',
        color: 'bg-amber-100 text-amber-700'
      },
      ...prev
    ]);
  };

  // Mock Upload Address Proof Document
  const handleUploadDoc = (docId) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        return { ...doc, status: 'Uploaded', date: 'Today · Just now' };
      }
      return doc;
    }));
    setSuccess('Verification file uploaded to credential vault.');
  };

  // Change Password Submission
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setError('Please complete all security credential fields.');
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      setError('New password and confirmation fields do not match.');
      return;
    }
    if (passwordStrength.score < 3) {
      setError('Password strength must be Medium or Strong.');
      return;
    }
    setPasswords({ current: '', newPass: '', confirm: '' });
    setSecurityLogs(prev => [
      { id: Date.now(), title: 'Password Changed', detail: 'Citizen reset dashboard credentials.', time: 'Today · Just now', type: 'success' },
      ...prev
    ]);
    setActivityHistory(prev => [
      {
        id: Date.now(),
        title: 'Password Changed',
        desc: 'Security credentials renewed successfully.',
        date: 'Today · Just now',
        icon: 'Lock',
        color: 'bg-amber-100 text-amber-700'
      },
      ...prev
    ]);
    setSuccess('Security password updated successfully.');
  };

  // Toggle Two Factor Authentication
  const handleToggle2FA = () => {
    setIs2FAEnabled(prev => {
      const next = !prev;
      setSuccess(`Two-Factor Authentication (2FA) is now ${next ? 'ENABLED' : 'DISABLED'}.`);
      setSecurityLogs(logs => [
        { id: Date.now(), title: next ? '2FA Enabled' : '2FA Disabled', detail: `Two factor validation ${next ? 'activated' : 'deactivated'}.`, time: 'Today · Just now', type: next ? 'success' : 'warning' },
        ...logs
      ]);
      return next;
    });
  };

  // Terminate Single session
  const handleTerminateSession = (sessionId) => {
    setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
    setSuccess('Selected login session terminated.');
    setSecurityLogs(logs => [
      { id: Date.now(), title: 'Session Terminated', detail: 'Revoked access token for selected device.', time: 'Today · Just now', type: 'info' },
      ...logs
    ]);
  };

  // Terminate All sessions
  const handleLogoutAllDevices = () => {
    setActiveSessions(prev => prev.filter(s => s.current));
    setSuccess('All secondary device credentials terminated.');
    setSecurityLogs(logs => [
      { id: Date.now(), title: 'Multiple Sessions Revoked', detail: 'Cleared access sessions globally.', time: 'Today · Just now', type: 'warning' },
      ...logs
    ]);
  };

  // Add mock family member
  const handleAddFamilyMember = (e) => {
    e.preventDefault();
    const trimmedName = newFamilyMember.name.trim();
    if (!trimmedName) {
      setError('Please provide family member name.');
      return;
    }
    const newMember = {
      id: Date.now(),
      name: trimmedName,
      relation: newFamilyMember.relation,
      verified: newFamilyMember.verified,
      avatar: trimmedName.split(/\s+/).map(n => n[0]).join('').toUpperCase().slice(0, 2)
    };
    setFamilyMembers(prev => [...prev, newMember]);
    setNewFamilyMember({ name: '', relation: 'Son', verified: true });
    setIsAddingFamily(false);
    setActivityHistory(prev => [
      {
        id: Date.now(),
        title: 'Family Member Added',
        desc: `${newMember.name} (${newMember.relation}) connected to household portal.`,
        date: 'Today · Just now',
        icon: 'Plus',
        color: 'bg-purple-100 text-purple-700'
      },
      ...prev
    ]);
    setSuccess('Family member linked to household registry.');
  };

  // Submit Support Ticket
  const handleSupportTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDescription) {
      setError('Please complete all support query parameters.');
      return;
    }
    setSuccess(`Grievance support ticket #TIC-PRFL-${Math.floor(1000 + Math.random() * 9000)} registered successfully.`);
    setTicketSubject('');
    setTicketDescription('');
  };

  // Help Desk Live Chat Bot replies
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { id: Date.now(), text: chatInput, sender: 'user', time: 'Just now' };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatTyping(true);

    setTimeout(() => {
      setChatTyping(false);
      let replyText = "I'm sorry, I couldn't quite resolve that query. You can ask me to help explain profile completion, document vault statuses, or updating secure information.";
      const query = chatInput.toLowerCase();

      if (query.includes('verification') || query.includes('aadhaar') || query.includes('status')) {
        replyText = "Your Aadhaar Card and Voter ID are fully verified and linked to your citizen profile. If you need to fix a spelling mistake, click 'Request Correction' under the Identity panel.";
      } else if (query.includes('address') || query.includes('proof') || query.includes('upload')) {
        replyText = "To update your residential address details, go to the 'Address & Residency' tab. You will need to upload an official utility bill as proof. A supervisor will review and verify details.";
      } else if (query.includes('password') || query.includes('security') || query.includes('2fa')) {
        replyText = "Manage security settings by choosing the 'Security & Credentials' tab. There you can rotate your password, enable 2FA shielding, and terminate unauthorized logged-in devices.";
      } else if (query.includes('family') || query.includes('member') || query.includes('household')) {
        replyText = "Under 'Family & Household' tab you can view the linked status of all members in your unit (FAM-2026-987654). You can also click the 'Open Family Profile' shortcut to manage family declarations.";
      } else if (query.includes('completion') || query.includes('missing')) {
        replyText = "Your profile is currently at 85% completion. To bring it up to 100%, please save an Alternate Mobile number and set up Emergency Contact details under the 'Contact & Alerts' tab.";
      }

      setChatMessages(prev => [...prev, { id: Date.now() + 1, text: replyText, sender: 'bot', time: 'Just now' }]);
    }, 1000);
  };

  // Direct action shortcuts to tabs
  const handleQuickAction = (tabName) => {
    setActiveTab(tabName);
    const element = document.getElementById('tab-content-anchor');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex-grow w-full bg-[#f8faff] min-h-screen pb-16 relative transition-all duration-300 dark:bg-slate-950 dark:text-slate-100">
      
      {/* Success/Error Alerts */}
      {success && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#138808] text-white px-5 py-3.5 rounded-xl shadow-lg border border-[#138808]/20 flex items-center gap-3 animate-fade-in font-medium max-w-sm">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="text-xs">{success}</span>
        </div>
      )}
      {error && (
        <div className="fixed bottom-6 right-6 z-50 bg-red-600 text-white px-5 py-3.5 rounded-xl shadow-lg border border-red-500/20 flex items-center gap-3 animate-fade-in font-medium max-w-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span className="text-xs">{error}</span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          SECTION 1: PAGE HEADER
      ══════════════════════════════════════════════════ */}
      <div className="bg-[#0b2447] text-white py-10 px-6 sm:px-12 relative overflow-hidden shadow-lg border-b border-white/5 dark:bg-slate-900">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#ff9933]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 w-80 h-80 bg-[#138808]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-xs text-slate-350 hover:text-white mb-4 transition-colors cursor-pointer dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {t('backToDashboard')}
          </button>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            
            {/* Citizen Identity Profile */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              
              {/* Photo Avatar Panel */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-full border-4 border-white/20 bg-gradient-to-tr from-[#ff9933]/40 via-white/10 to-[#138808]/40 flex items-center justify-center text-white overflow-hidden shadow-md">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Citizen Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold font-sans tracking-wide">MM</span>
                  )}
                </div>
                <label 
                  htmlFor="photo-upload-input"
                  className="absolute bottom-0 right-0 bg-[#ff9933] hover:bg-amber-600 text-white p-1.5 rounded-full cursor-pointer shadow-md transition-colors"
                  title="Upload Photo"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                </label>
                <input 
                  id="photo-upload-input"
                  type="file" 
                  accept="image/*"
                  onChange={handlePhotoUploadSim}
                  className="hidden"
                />
              </div>

              {/* Citizen Details */}
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight dark:text-white">
                    {personalInfo.fullName}
                  </h1>
                  <span className="bg-[#138808]/20 border border-[#138808]/30 text-emerald-400 text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1 dark:text-[#138808]">
                    <Check className="w-3 h-3 text-[#138808]" /> {t('verifiedBadge')}
                  </span>
                  <span className="bg-[#ff9933]/20 border border-[#ff9933]/30 text-[#ff9933] text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full">
                    {t('activeRegistry')}
                  </span>
                </div>

                <div className="mt-2.5 space-y-1 text-slate-300 text-xs font-light dark:text-slate-400">
                  <p className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="font-semibold text-white">{t('citizenId')}:</span> 
                    <span className="font-mono bg-white/5 px-2 py-0.5 rounded dark:bg-slate-800">CEN-2026-458796</span>
                  </p>
                  <p className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="font-semibold text-white">{t('familyId')}:</span> 
                    <span className="font-mono bg-white/5 px-2 py-0.5 rounded dark:bg-slate-800">FAM-2026-987654</span>
                  </p>
                </div>
              </div>

            </div>

            {/* Quick Dossier Actions */}
            <div className="flex items-center gap-2.5 w-full lg:w-auto shrink-0 justify-center sm:justify-start lg:justify-end flex-wrap">
              <button 
                onClick={() => setIsEditingPersonal(true)}
                className="bg-white/10 hover:bg-white/15 border border-white/20 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-350"
              >
                <Edit className="w-3.5 h-3.5" /> {t('editProfile')}
              </button>
              <button
                onClick={handleDownloadSummary}
                className="bg-[#ff9933] hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-95"
              >
                <Download className="w-4 h-4" /> {t('downloadSummary')}
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ══════════════════════════════════════════════════
              LEFT SIDEBAR: PROGRESS & NAVIGATION TABS
          ══════════════════════════════════════════════════ */}
          <div className="lg:col-span-1 space-y-6">

            {/* SECTION 2: PROFILE COMPLETION STATUS */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden dark:bg-slate-900 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5 dark:text-slate-100">
                <Sliders className="w-4 h-4 text-[#ff9933]" /> {t('completionScore')}
              </h3>
              
              <div className="flex items-center justify-between mt-4 font-sans">
                {/* Circular SVG progress */}
                <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100 dark:text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#138808] transition-all duration-500 ease-out"
                      strokeWidth="3.5"
                      strokeDasharray={`${profileCompletion.percentage}, 100`}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-sm font-extrabold text-slate-800 dark:text-slate-100">
                    {profileCompletion.percentage}%
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{profileCompletion.completedCount} {t('of')} {profileCompletion.totalCount}</p>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase dark:text-slate-400">{t('profileCardsDone')}</p>
                </div>
              </div>

              {profileCompletion.missingFields.length > 0 ? (
                <div className="mt-4 pt-3 border-t border-slate-150 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">{t('incompleteItems')}</p>
                  <ul className="mt-1 space-y-1 text-xs text-slate-500 font-medium dark:text-slate-400">
                    {profileCompletion.missingFields.map((field, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        {field === 'Alternate Mobile' ? t('alternateMobile') : t('emergencyContact')}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="mt-4 pt-3 border-t border-slate-150 dark:border-slate-800 flex items-center gap-1.5 text-xs text-[#138808] font-bold">
                  <CheckCircle className="w-4 h-4 text-[#138808]" /> {t('profileCompleted')}
                </div>
              )}
            </div>

            {/* Dashboard Sidebar Navigation Links */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-3 space-y-1 dark:bg-slate-900 dark:border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-2 pb-1">
                {t('directoryTitle')}
              </p>
              
              {[
                { id: 'overview', label: t('overview'), icon: Sliders },
                { id: 'personal', label: t('personal'), icon: User },
                { id: 'contact', label: t('contact'), icon: Phone },
                { id: 'address', label: t('address'), icon: MapPin },
                { id: 'family', label: t('family'), icon: Heart },
                { id: 'security', label: t('security'), icon: Shield },
                { id: 'preferences', label: t('preferences'), icon: Settings }
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      isActive 
                        ? 'bg-[#0b2447] text-white shadow-sm dark:bg-[#ff9933] dark:text-slate-950' 
                        : 'text-slate-650 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-350 dark:hover:bg-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 font-sans">
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#ff9933] dark:text-slate-950' : 'text-slate-450 dark:text-slate-500'}`} />
                      {tab.label}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'translate-x-0.5' : 'text-slate-300 dark:text-slate-600'}`} />
                  </button>
                );
              })}
            </div>

            {/* Quick Actions Shortcuts Widget */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 dark:bg-slate-900 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider dark:text-slate-200">{t('quickActions')}</h4>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <button 
                  onClick={() => handleQuickAction('personal')}
                  className="p-3 bg-[#0b2447]/5 hover:bg-[#0b2447]/10 text-[#0b2447] rounded-xl font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 dark:bg-[#152342] dark:text-[#ff9933] dark:hover:bg-[#1a2d54]"
                >
                  <Edit className="w-4 h-4 text-[#ff9933]" />
                  <span>{t('editProfile')}</span>
                </button>
                <button 
                  onClick={() => handleQuickAction('address')}
                  className="p-3 bg-[#0b2447]/5 hover:bg-[#0b2447]/10 text-[#0b2447] rounded-xl font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 dark:bg-[#152342] dark:text-[#ff9933] dark:hover:bg-[#1a2d54]"
                >
                  <MapPin className="w-4 h-4 text-[#138808]" />
                  <span>{t('updateAddrBtn')}</span>
                </button>
                <button 
                  onClick={() => handleQuickAction('security')}
                  className="p-3 bg-[#0b2447]/5 hover:bg-[#0b2447]/10 text-[#0b2447] rounded-xl font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 dark:bg-[#152342] dark:text-[#ff9933] dark:hover:bg-[#1a2d54]"
                >
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span>{t('changePasswordBtn')}</span>
                </button>
                <button 
                  onClick={() => handleQuickAction('preferences')}
                  className="p-3 bg-[#0b2447]/5 hover:bg-[#0b2447]/10 text-[#0b2447] rounded-xl font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 dark:bg-[#152342] dark:text-[#ff9933] dark:hover:bg-[#1a2d54]"
                >
                  <UploadCloud className="w-4 h-4 text-blue-500" />
                  <span>Vault</span>
                </button>
              </div>
            </div>

          </div>

          {/* ══════════════════════════════════════════════════
              RIGHT MAIN AREA: DYNAMIC TAB CONTENTS
          ══════════════════════════════════════════════════ */}
          <div id="tab-content-anchor" className="lg:col-span-3 space-y-6">

            {/* TAB CONTENT: 1. OVERVIEW HUB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Visual Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-[#0b2447] to-[#1a3d6c] text-white p-5 rounded-2xl shadow-sm relative overflow-hidden dark:from-slate-900 dark:to-slate-800">
                    <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">{t('aadhaarLink')}</span>
                    <p className="text-xl font-extrabold mt-1">{t('verifiedLinked')}</p>
                    <p className="text-[11px] text-slate-300 font-light mt-1 dark:text-slate-400">{t('syncedUidai')}</p>
                    <UserCheck className="absolute right-4 bottom-4 w-10 h-10 text-white/10" />
                  </div>
                  
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider dark:text-slate-500">{t('censusHousehold')}</span>
                    <p className="text-xl font-extrabold text-slate-800 mt-1 dark:text-white">{familyMembers.length} {t('members')}</p>
                    <p className="text-[11px] text-[#138808] font-bold mt-1 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> {t('unitVerified')}
                    </p>
                    <Heart className="absolute right-4 bottom-4 w-10 h-10 text-[#138808]/10" />
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider dark:text-slate-500">{t('addressProofLabel')}</span>
                    <p className="text-xl font-extrabold text-slate-800 mt-1 dark:text-white">{t('lastSyncJan')}</p>
                    <p className="text-[11px] text-slate-500 font-light mt-1 dark:text-slate-450">{t('residencySweep')}</p>
                    <MapPin className="absolute right-4 bottom-4 w-10 h-10 text-[#ff9933]/10" />
                  </div>
                </div>

                {/* Grid summary preview cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Identity Summary Card */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between dark:bg-slate-900 dark:border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2.5 flex items-center gap-1.5 dark:text-slate-150 dark:border-slate-800">
                        <User className="w-4 h-4 text-blue-500" /> {t('identityInfoTitle')}
                      </h3>
                      <ul className="mt-3 space-y-2 text-xs">
                        <li className="flex justify-between">
                          <span className="text-slate-400 dark:text-slate-500">{t('fullNameLabel')}:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">{personalInfo.fullName}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-slate-400 dark:text-slate-500">{t('genderLabel')}:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">{personalInfo.gender}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-slate-400 dark:text-slate-500">{t('aadhaarMaskedLabel')}:</span>
                          <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">{identities.aadhaar}</span>
                        </li>
                      </ul>
                    </div>
                    <button
                      onClick={() => setActiveTab('personal')}
                      className="mt-4 w-full bg-[#0b2447]/5 hover:bg-[#0b2447]/10 text-[#0b2447] py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center dark:bg-[#152342] dark:text-[#ff9933]"
                    >
                      {t('viewDetailsBtn')}
                    </button>
                  </div>

                  {/* Contact Summary Card */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between dark:bg-slate-900 dark:border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2.5 flex items-center gap-1.5 dark:text-slate-150 dark:border-slate-800">
                        <Phone className="w-4 h-4 text-emerald-500" /> {t('primaryContactLabel')}
                      </h3>
                      <ul className="mt-3 space-y-2 text-xs">
                        <li className="flex justify-between">
                          <span className="text-slate-400 dark:text-slate-500">{t('mobileLabel')}:</span>
                          <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">{contactInfo.mobile}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-slate-400 dark:text-slate-500">{t('emailIdLabel')}:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">{contactInfo.email}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-slate-400 dark:text-slate-500">{t('emergencyContact')}:</span>
                          <span className={`font-semibold ${contactInfo.emergencyName ? 'text-slate-700 dark:text-slate-200' : 'text-amber-500 font-bold'}`}>
                            {contactInfo.emergencyName || 'Not Set'}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <button
                      onClick={() => setActiveTab('contact')}
                      className="mt-4 w-full bg-[#0b2447]/5 hover:bg-[#0b2447]/10 text-[#0b2447] py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center dark:bg-[#152342] dark:text-[#ff9933]"
                    >
                      {t('manageContactsBtn')}
                    </button>
                  </div>

                  {/* Address Summary Card */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between dark:bg-slate-900 dark:border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2.5 flex items-center gap-1.5 dark:text-slate-150 dark:border-slate-800">
                        <MapPin className="w-4 h-4 text-[#ff9933]" /> {t('resAddressLabel')}
                      </h3>
                      <p className="text-xs text-slate-650 mt-3 leading-relaxed dark:text-slate-300">
                        {addressInfo.houseNo}, {addressInfo.street}, {addressInfo.locality}, {addressInfo.city}, {addressInfo.state} - {addressInfo.pinCode}
                      </p>
                      <div className="mt-3 flex justify-between text-[11px]">
                        <span className="text-slate-400 dark:text-slate-500">{t('declarationStatusLabel')}:</span>
                        <span className="text-[#138808] font-bold">{t('verifiedBadgeText')}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('address')}
                      className="mt-4 w-full bg-[#0b2447]/5 hover:bg-[#0b2447]/10 text-[#0b2447] py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center dark:bg-[#152342] dark:text-[#ff9933]"
                    >
                      {t('updateAddrBtn')}
                    </button>
                  </div>

                  {/* Security Summary Card */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between dark:bg-slate-900 dark:border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2.5 flex items-center gap-1.5 dark:text-slate-150 dark:border-slate-800">
                        <Shield className="w-4 h-4 text-purple-500" /> {t('accountShieldTitle')}
                      </h3>
                      <ul className="mt-3 space-y-2 text-xs">
                        <li className="flex justify-between">
                          <span className="text-slate-400 dark:text-slate-500">{t('twoFactorLabel')}:</span>
                          <span className={`font-bold ${is2FAEnabled ? 'text-[#138808]' : 'text-red-500'}`}>
                            {is2FAEnabled ? t('enabledText') : t('disabledText')}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-slate-400 dark:text-slate-500">{t('activeDevicesLabel')}:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">{activeSessions.length} Devices</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-slate-400 dark:text-slate-500">{t('mobileAlertsLabel')}:</span>
                          <span className="text-[#138808] font-bold">{t('verifiedBadgeText')}</span>
                        </li>
                      </ul>
                    </div>
                    <button
                      onClick={() => setActiveTab('security')}
                      className="mt-4 w-full bg-[#0b2447]/5 hover:bg-[#0b2447]/10 text-[#0b2447] py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center dark:bg-[#152342] dark:text-[#ff9933]"
                    >
                      {t('manageSecurityBtn')}
                    </button>
                  </div>

                </div>

                {/* Section: Activity logs summary */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-1.5 dark:text-slate-150 dark:border-slate-800">
                    <Clock className="w-4.5 h-4.5 text-blue-500" /> {t('recentHistoryTitle')}
                  </h3>
                  <div className="relative border-l border-slate-150 pl-6 space-y-5 mt-4 dark:border-slate-800">
                    {activityHistory.slice(0, 3).map((item) => (
                      <div key={item.id} className="relative">
                        {/* Timeline bubble */}
                        <div className={`absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ring-4 ring-slate-100/50 dark:ring-slate-900/50 ${
                          item.title.includes('Create') ? 'bg-green-500' : 'bg-[#ff9933]'
                        }`} />
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.title}</p>
                            <p className="text-[11px] text-slate-500 font-light mt-0.5 dark:text-slate-400">{item.desc}</p>
                          </div>
                          <span className="text-[10px] text-slate-450 font-medium whitespace-nowrap dark:text-slate-550">{item.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: 2. PERSONAL & IDENTITY */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                
                {/* SECTION 3: PERSONAL INFORMATION */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3.5 dark:border-slate-800">
                    <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 dark:text-slate-100">
                      <User className="w-4.5 h-4.5 text-[#0b2447] dark:text-[#ff9933]" /> {t('basicInfoDossier')}
                    </h3>
                    <button
                      onClick={() => setIsEditingPersonal(true)}
                      className="text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer dark:text-[#ff9933]"
                    >
                      <Edit className="w-3.5 h-3.5" /> {t('editProfile')}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-3.5">
                      <div className="flex justify-between text-xs pb-1.5 border-b border-slate-50 dark:border-slate-800">
                        <span className="text-slate-400 font-medium dark:text-slate-500">{t('citizenFullName')}:</span>
                        <span className="font-bold text-slate-700 dark:text-slate-200">{personalInfo.fullName}</span>
                      </div>
                      <div className="flex justify-between text-xs pb-1.5 border-b border-slate-50 dark:border-slate-800">
                        <span className="text-slate-400 font-medium dark:text-slate-500">{t('genderText')}:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{personalInfo.gender}</span>
                      </div>
                      <div className="flex justify-between text-xs pb-1.5 border-b border-slate-50 dark:border-slate-800">
                        <span className="text-slate-400 font-medium dark:text-slate-500">{t('dateOfBirthText')}:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{personalInfo.dob}</span>
                      </div>
                    </div>
                    <div className="space-y-3.5">
                      <div className="flex justify-between text-xs pb-1.5 border-b border-slate-50 dark:border-slate-800">
                        <span className="text-slate-400 font-medium dark:text-slate-500">{t('calculatedAgeText')}:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{personalInfo.age} {t('yearsText')}</span>
                      </div>
                      <div className="flex justify-between text-xs pb-1.5 border-b border-slate-50 dark:border-slate-800">
                        <span className="text-slate-400 font-medium dark:text-slate-500">{t('maritalStatusText')}:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{personalInfo.maritalStatus}</span>
                      </div>
                      <div className="flex justify-between text-xs pb-1.5 border-b border-slate-50 dark:border-slate-800">
                        <span className="text-slate-400 font-medium dark:text-slate-500">{t('nationalityText')}:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{personalInfo.nationality}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Identity Information Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3.5 dark:border-slate-800">
                    <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 dark:text-slate-100">
                      <Shield className="w-4.5 h-4.5 text-[#138808]" /> {t('secureNationalCreds')}
                    </h3>
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200 px-3 py-0.5 rounded-full flex items-center gap-1.5 dark:bg-[#122247] dark:text-blue-400 dark:border-blue-800">
                      <Lock className="w-3 h-3" /> {t('secureDataIndicators')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    
                    {/* Aadhaar */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between dark:bg-slate-800/50 dark:border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('aadhaarCardLabel')}</span>
                          <span className="bg-[#138808]/10 text-[#138808] text-[9px] font-bold px-2 py-0.2 rounded-full border border-[#138808]/20">
                            {t('verifiedBadgeText')}
                          </span>
                        </div>
                        <p className="text-sm font-mono mt-1 text-slate-650 dark:text-slate-400">
                          {maskIdentities.aadhaar ? identities.aadhaar : identities.aadhaarFull}
                        </p>
                      </div>
                      <button 
                        onClick={() => toggleMask('aadhaar')}
                        className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-lg shadow-sm transition-colors border border-slate-200 cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-350 dark:hover:bg-slate-700"
                        title={maskIdentities.aadhaar ? "Unmask Aadhaar" : "Mask Aadhaar"}
                      >
                        {maskIdentities.aadhaar ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Voter ID */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between dark:bg-slate-800/50 dark:border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('voterIdCardLabel')}</span>
                          <span className="bg-[#138808]/10 text-[#138808] text-[9px] font-bold px-2 py-0.2 rounded-full border border-[#138808]/20">
                            {t('verifiedBadgeText')}
                          </span>
                        </div>
                        <p className="text-sm font-mono mt-1 text-slate-650 dark:text-slate-400">
                          {maskIdentities.voterId ? identities.voterId : identities.voterIdFull}
                        </p>
                      </div>
                      <button 
                        onClick={() => toggleMask('voterId')}
                        className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-lg shadow-sm transition-colors border border-slate-200 cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-350 dark:hover:bg-slate-700"
                      >
                        {maskIdentities.voterId ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* PAN */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between dark:bg-slate-800/50 dark:border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('panNumberLabel')}</span>
                          <span className="bg-[#138808]/10 text-[#138808] text-[9px] font-bold px-2 py-0.2 rounded-full border border-[#138808]/20">
                            {t('verifiedBadgeText')}
                          </span>
                        </div>
                        <p className="text-sm font-mono mt-1 text-slate-650 dark:text-slate-400">
                          {maskIdentities.pan ? identities.pan : identities.panFull}
                        </p>
                      </div>
                      <button 
                        onClick={() => toggleMask('pan')}
                        className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-lg shadow-sm transition-colors border border-slate-200 cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-350 dark:hover:bg-slate-700"
                      >
                        {maskIdentities.pan ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Passport */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between dark:bg-slate-800/50 dark:border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('passportNumberLabel')}</span>
                          <span className="bg-amber-50 text-amber-600 text-[9px] font-bold px-2 py-0.2 rounded-full border border-amber-250 dark:bg-amber-950/20 dark:text-amber-400">
                            {t('pendingAuditText')}
                          </span>
                        </div>
                        <p className="text-sm font-mono mt-1 text-slate-650 dark:text-slate-400">
                          {maskIdentities.passport ? identities.passport : identities.passportFull}
                        </p>
                      </div>
                      <button 
                        onClick={() => toggleMask('passport')}
                        className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-lg shadow-sm transition-colors border border-slate-200 cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-350 dark:hover:bg-slate-700"
                      >
                        {maskIdentities.passport ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>

                  </div>

                  <div className="flex justify-end gap-3 mt-6 border-t border-slate-100 pt-4 flex-wrap dark:border-slate-800">
                    <button
                      onClick={() => setIsRequestingCorrection(true)}
                      className="bg-[#ff9933]/15 hover:bg-[#ff9933]/25 text-[#ff9933] border border-[#ff9933]/20 px-4.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      {t('requestCorrectionBtn')}
                    </button>
                    <button
                      onClick={() => {
                        setSuccess('Identity verification sweep re-triggered.');
                      }}
                      className="bg-[#0b2447] hover:bg-[#1a3d6c] text-white px-4.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 dark:bg-[#ff9933] dark:text-slate-950 dark:hover:bg-amber-600"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> {t('submitVerificationReq')}
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: 3. CONTACT DETAILS */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                
                {/* SECTION 4: CONTACT INFORMATION */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                  <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-3.5 flex items-center gap-2 dark:text-slate-100 dark:border-slate-800">
                    <Mail className="w-4.5 h-4.5 text-blue-500" /> {t('commDetailsPrefs')}
                  </h3>

                  <form onSubmit={handleSaveContactDetails} className="space-y-5 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-650 uppercase tracking-wider mb-1.5 dark:text-slate-400">{t('primaryMobileLabel')}</label>
                        <input 
                          type="text" 
                          value={contactInfo.mobile} 
                          onChange={(e) => setContactInfo({...contactInfo, mobile: e.target.value})}
                          className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all dark:bg-slate-850 dark:border-slate-800 dark:text-slate-200 dark:focus:border-[#ff9933]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-650 uppercase tracking-wider mb-1.5 dark:text-slate-400">{t('altMobileLabel')}</label>
                        <input 
                          type="text" 
                          placeholder="e.g. +91 99999 99999"
                          value={contactInfo.alternateMobile} 
                          onChange={(e) => setContactInfo({...contactInfo, alternateMobile: e.target.value})}
                          className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all dark:bg-slate-850 dark:border-slate-800 dark:text-slate-200 dark:focus:border-[#ff9933]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-650 uppercase tracking-wider mb-1.5 dark:text-slate-400">{t('emailAddrLabel')}</label>
                        <input 
                          type="email" 
                          value={contactInfo.email} 
                          onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                          className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all dark:bg-slate-850 dark:border-slate-800 dark:text-slate-200 dark:focus:border-[#ff9933]"
                        />
                      </div>
                    </div>

                    {/* Communication preferences toggles */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-3.5 dark:bg-slate-800/40 dark:border-slate-800">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 dark:text-slate-300">
                        {t('commPrefsChannels')}
                      </h4>
                      
                      <div className="flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-slate-700 dark:text-slate-350">{t('smsAlertsText')}</p>
                          <p className="text-[10px] text-slate-500 font-light mt-0.5 dark:text-slate-450">{t('highPriorityAlerts')}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={preferences.smsAlerts}
                            onChange={(e) => setPreferences({...preferences, smsAlerts: e.target.checked})}
                            className="sr-only peer" 
                          />
                          <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#138808]" />
                        </label>
                      </div>

                      <div className="flex justify-between items-center text-xs pt-2.5 border-t border-slate-150 dark:border-slate-800">
                        <div>
                          <p className="font-bold text-slate-700 dark:text-slate-350">{t('emailAlertsText')}</p>
                          <p className="text-[10px] text-slate-500 font-light mt-0.5 dark:text-slate-450">{t('monthlyReportsText')}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={preferences.emailAlerts}
                            onChange={(e) => setPreferences({...preferences, emailAlerts: e.target.checked})}
                            className="sr-only peer" 
                          />
                          <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#138808]" />
                        </label>
                      </div>

                      <div className="flex justify-between items-center text-xs pt-2.5 border-t border-slate-150 dark:border-slate-800">
                        <div>
                          <p className="font-bold text-slate-700 dark:text-slate-350">{t('pushAlertsText')}</p>
                          <p className="text-[10px] text-slate-500 font-light mt-0.5 dark:text-slate-455 dark:text-slate-450">{t('realTimeTrackingText')}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={preferences.pushAlerts}
                            onChange={(e) => setPreferences({...preferences, pushAlerts: e.target.checked})}
                            className="sr-only peer" 
                          />
                          <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#138808]" />
                        </label>
                      </div>
                    </div>

                    {/* Emergency Contact card */}
                    <div className="p-4 border border-red-200/50 bg-red-50/20 rounded-xl space-y-3.5 dark:border-red-950/30 dark:bg-red-950/10">
                      <div className="flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-red-500" />
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider dark:text-slate-300">{t('emergencyContactCards')}</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1 dark:text-slate-400">{t('contactNameLabel')}</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Sunita Mehra"
                            value={contactInfo.emergencyName}
                            onChange={(e) => setContactInfo({...contactInfo, emergencyName: e.target.value})}
                            className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-red-500 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1 dark:text-slate-400">{t('relationshipLabel')}</label>
                          <select 
                            value={contactInfo.emergencyRelation}
                            onChange={(e) => setContactInfo({...contactInfo, emergencyRelation: e.target.value})}
                            className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-red-500 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                          >
                            <option value="">{t('selectRelationText')}</option>
                            <option value="Spouse">{t('spouseText')}</option>
                            <option value="Father">{t('fatherText')}</option>
                            <option value="Mother">{t('motherText')}</option>
                            <option value="Son">{t('sonText')}</option>
                            <option value="Daughter">{t('daughterText')}</option>
                            <option value="Brother">{t('brotherText')}</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1 dark:text-slate-400">{t('mobileLabel')}</label>
                          <input 
                            type="text" 
                            placeholder="e.g. +91 99999 88888"
                            value={contactInfo.emergencyMobile}
                            onChange={(e) => setContactInfo({...contactInfo, emergencyMobile: e.target.value})}
                            className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-red-500 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-3">
                      <button 
                        type="submit"
                        className="bg-[#0b2447] hover:bg-[#1a3d6c] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md dark:bg-[#ff9933] dark:text-slate-950 dark:hover:bg-amber-600"
                      >
                        {t('saveSettingsBtn')}
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            )}

            {/* TAB CONTENT: 4. ADDRESS & RESIDENCY */}
            {activeTab === 'address' && (
              <div className="space-y-6">
                
                {/* SECTION 5: ADDRESS INFORMATION */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3.5 flex-wrap gap-3 dark:border-slate-800">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 dark:text-slate-100">
                        <MapPin className="w-4.5 h-4.5 text-blue-500" /> {t('currentAddressCoords')}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5 dark:text-slate-500">{t('lastVerifiedDate')}</p>
                    </div>
                    <span className="bg-[#138808]/10 text-[#138808] border border-[#138808]/20 px-3.5 py-0.5 rounded-full text-xs font-bold dark:bg-[#138808]/20">
                      {t('verifiedBadgeText')}
                    </span>
                  </div>

                  <form onSubmit={handleSaveAddressDetails} className="space-y-5 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-650 uppercase mb-1 dark:text-slate-450">{t('houseNumberLabel')}</label>
                        <input 
                          type="text" 
                          value={addressInfo.houseNo}
                          onChange={(e) => setAddressInfo({...addressInfo, houseNo: e.target.value})}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary transition-all dark:bg-slate-850 dark:border-slate-800 dark:text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-650 uppercase mb-1 dark:text-slate-450">{t('streetLaneLabel')}</label>
                        <input 
                          type="text" 
                          value={addressInfo.street}
                          onChange={(e) => setAddressInfo({...addressInfo, street: e.target.value})}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary transition-all dark:bg-slate-850 dark:border-slate-800 dark:text-slate-200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-655 text-slate-650 uppercase mb-1 dark:text-slate-450">{t('localityVillageLabel')}</label>
                        <input 
                          type="text" 
                          value={addressInfo.locality}
                          onChange={(e) => setAddressInfo({...addressInfo, locality: e.target.value})}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary transition-all dark:bg-slate-850 dark:border-slate-800 dark:text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-650 uppercase mb-1 dark:text-slate-450">{t('districtLabel')}</label>
                        <input 
                          type="text" 
                          value={addressInfo.district}
                          onChange={(e) => setAddressInfo({...addressInfo, district: e.target.value})}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary transition-all dark:bg-slate-850 dark:border-slate-800 dark:text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-650 uppercase mb-1 dark:text-slate-450">{t('stateLabel')}</label>
                        <input 
                          type="text" 
                          value={addressInfo.state}
                          onChange={(e) => setAddressInfo({...addressInfo, state: e.target.value})}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary transition-all dark:bg-slate-850 dark:border-slate-800 dark:text-slate-200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-650 uppercase mb-1 dark:text-slate-450">{t('pinCodeLabel')}</label>
                        <input 
                          type="text" 
                          value={addressInfo.pinCode}
                          onChange={(e) => setAddressInfo({...addressInfo, pinCode: e.target.value})}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary transition-all font-mono dark:bg-slate-850 dark:border-slate-800 dark:text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-650 uppercase mb-1 dark:text-slate-450">{t('gpsCoordsLabel')}</label>
                        <input 
                          type="text" 
                          value={addressInfo.gps}
                          readOnly
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg outline-none text-slate-500 font-mono dark:bg-slate-800 dark:border-slate-800 dark:text-slate-400"
                        />
                      </div>
                    </div>

                    {/* Styled Mock Interactive Map */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm relative dark:border-slate-800">
                      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex justify-between items-center dark:bg-slate-850 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">{t('locationMarkerLabel')}</span>
                        <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full dark:bg-blue-950/20 dark:text-blue-400">{t('gpsLiveConnection')}</span>
                      </div>
                      
                      {/* Map Drawing Canvas mockup */}
                      <div className="bg-[#e4ece9] h-48 relative flex items-center justify-center overflow-hidden dark:bg-[#121c2e]">
                        
                        {/* Fake map drawing patterns */}
                        <div className="absolute inset-0 opacity-40">
                          <div className="absolute w-[2px] h-full bg-white left-1/3 dark:bg-slate-850" />
                          <div className="absolute w-[2px] h-full bg-white left-2/3 dark:bg-slate-850" />
                          <div className="absolute h-[2px] w-full bg-white top-1/4 dark:bg-slate-850" />
                          <div className="absolute h-[2px] w-full bg-white top-3/4 dark:bg-slate-850" />
                          <div className="absolute w-12 h-12 border-2 border-slate-300 rounded-full left-1/4 top-1/2 dark:border-slate-800" />
                          <div className="absolute w-24 h-10 bg-slate-300 transform -rotate-12 left-1/2 top-1/3 rounded dark:bg-slate-800" />
                        </div>

                        {/* Interactive Household coordinates pointer */}
                        <div className="relative z-10 flex flex-col items-center animate-bounce">
                          <div className="p-2 bg-[#ff9933] text-white rounded-full shadow-lg border-2 border-white">
                            <MapPin className="w-6 h-6" />
                          </div>
                          <div className="mt-1 bg-[#0b2447] text-white px-2.5 py-1 rounded-md text-[9px] font-extrabold whitespace-nowrap shadow-md dark:bg-slate-900">
                            M. Mehra Residence
                          </div>
                        </div>

                        {/* GPS Info panel overlay */}
                        <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-sm border border-slate-200/50 p-2.5 rounded-lg shadow-md max-w-xs text-[10px] dark:bg-slate-900/95 dark:border-slate-800">
                          <p className="font-bold text-slate-800 dark:text-white">Dwarka Sector 21</p>
                          <p className="text-slate-500 mt-0.5 dark:text-slate-400">Plot No 45, Sector 21, New Delhi, Delhi 110001</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 flex-wrap">
                      <label 
                        className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        <UploadCloud className="w-3.5 h-3.5" /> {t('uploadProofBtn')}
                        <input 
                          type="file" 
                          onChange={() => handleUploadDoc('DOC-3')}
                          className="hidden" 
                        />
                      </label>
                      <button 
                        type="button"
                        onClick={() => {
                          setSuccess('Geographical re-verification scheduled.');
                        }}
                        className="bg-[#ff9933]/15 hover:bg-[#ff9933]/25 text-[#ff9933] border border-[#ff9933]/20 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        {t('requestReverifBtn')}
                      </button>
                      <button 
                        type="submit"
                        className="bg-[#0b2447] hover:bg-[#1a3d6c] text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors dark:bg-[#ff9933] dark:text-slate-950 dark:hover:bg-amber-600"
                      >
                        {t('updateAddrBtn')}
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            )}

            {/* TAB CONTENT: 5. FAMILY & HOUSEHOLD */}
            {activeTab === 'family' && (
              <div className="space-y-6">
                
                {/* SECTION 6: FAMILY INFORMATION */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3.5 dark:border-slate-800">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 dark:text-slate-100">
                        <Heart className="w-4.5 h-4.5 text-purple-500" /> {t('householdSummaryTitle')}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5 dark:text-slate-500">{t('familyId')}: FAM-2026-987654</p>
                    </div>
                    <span className="bg-[#138808]/10 text-[#138808] border border-[#138808]/20 px-3.5 py-0.5 rounded-full text-xs font-bold dark:bg-[#138808]/20">
                      {t('verifiedBadgeText')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 dark:bg-slate-800/40 dark:border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">{t('citizenFullName')}</span>
                      <p className="text-sm font-extrabold text-slate-800 mt-1 dark:text-slate-200">{personalInfo.fullName}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 dark:bg-slate-800/40 dark:border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Linked Members</span>
                      <p className="text-sm font-extrabold text-slate-800 mt-1 dark:text-slate-200">{familyMembers.length} {t('members')}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 dark:bg-slate-800/40 dark:border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">{t('declarationStatusLabel')}</span>
                      <p className="text-sm font-extrabold text-[#138808] mt-1 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> {t('censusConfirmedLabel')}
                      </p>
                    </div>
                  </div>

                  {/* Family members preview lists */}
                  <div className="mt-6 space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider dark:text-slate-300">{t('familyRegistryPreview')}</h4>
                    <div className="divide-y divide-slate-100 bg-slate-50/50 rounded-xl border border-slate-200/60 overflow-hidden dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-850/10">
                      {familyMembers.map((member) => (
                        <div key={member.id} className="p-3.5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0b2447] to-[#1a3d6c] text-white flex items-center justify-center text-xs font-extrabold dark:from-slate-800 dark:to-slate-750">
                              {member.avatar}
                            </div>
                            <div>
                              <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{member.name}</p>
                              <p className="text-[10px] text-slate-500 font-medium dark:text-slate-400">{member.relation === 'Son' ? t('sonText') : member.relation === 'Daughter' ? t('daughterText') : member.relation === 'Spouse' ? t('spouseText') : member.relation === 'Brother' ? t('brotherText') : member.relation === 'Father' ? t('fatherText') : member.relation}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <span className="bg-[#138808]/10 text-[#138808] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#138808]/20 flex items-center gap-0.5 dark:bg-[#138808]/20">
                              <Check className="w-2.5 h-2.5" /> {t('verifiedBadgeText')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6 border-t border-slate-100 pt-4 flex-wrap dark:border-slate-800">
                    <button
                      onClick={() => setIsAddingFamily(true)}
                      className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      {t('addFamilyMemberBtn')}
                    </button>
                    <button
                      onClick={() => {
                        setSuccess('Requested family record corrections. Auditing in progress.');
                      }}
                      className="bg-[#ff9933]/15 hover:bg-[#ff9933]/25 text-[#ff9933] border border-[#ff9933]/20 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      {t('editFamilyInfoBtn')}
                    </button>
                    <button
                      onClick={() => navigate('/family')}
                      className="bg-[#0b2447] hover:bg-[#1a3d6c] text-white px-4.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 dark:bg-[#ff9933] dark:text-slate-950 dark:hover:bg-amber-600"
                    >
                      {t('openFamilyProfileBtn')} <ArrowUpRight className="w-4 h-4 text-[#ff9933] dark:text-slate-950" />
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: 6. SECURITY & ACCESS */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                
                {/* SECTION 7: SECURITY SETTINGS */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                  <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-3.5 flex items-center gap-2 dark:text-slate-100 dark:border-slate-800">
                    <Shield className="w-4.5 h-4.5 text-red-500" /> {t('accSecurityShields')}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 font-sans">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between dark:bg-slate-800/40 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">{t('mobileVerifLabel')}</span>
                        <p className="text-sm font-extrabold text-[#138808] mt-1 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> {t('verifiedMobileText')}
                        </p>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#138808]" />
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between dark:bg-slate-800/40 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">{t('emailVerifLabel')}</span>
                        <p className="text-sm font-extrabold text-[#138808] mt-1 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> {t('verifiedEmailText')}
                        </p>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#138808]" />
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between dark:bg-slate-800/40 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">{t('twoFaShieldStatus')}</span>
                        <p className="text-sm font-extrabold text-slate-800 mt-1 dark:text-slate-200">
                          {is2FAEnabled ? t('protectedAccountText') : t('vulnerableAccountText')}
                        </p>
                      </div>
                      <button 
                        onClick={handleToggle2FA}
                        className={`text-xs px-3 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                          is2FAEnabled 
                            ? 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900' 
                            : 'bg-green-50 hover:bg-green-100 text-[#138808] border-[#138808]/20 dark:bg-green-950/20 dark:text-green-400'
                        }`}
                      >
                        {is2FAEnabled ? t('disable2FaBtn') : t('enable2FaBtn')}
                      </button>
                    </div>
                  </div>

                  {/* Password Change Form */}
                  <form onSubmit={handleChangePassword} className="mt-6 pt-5 border-t border-slate-100 space-y-4 dark:border-slate-800">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider dark:text-slate-300">{t('passwordMgmtTitle')}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1 dark:text-slate-450">{t('currentPasswordLabel')}</label>
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          value={passwords.current}
                          onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary dark:bg-slate-850 dark:border-slate-800 dark:text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1 dark:text-slate-450">{t('newPasswordLabel')}</label>
                        <input 
                          type="password" 
                          placeholder="Enter strong password"
                          value={passwords.newPass}
                          onChange={(e) => setPasswords({...passwords, newPass: e.target.value})}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary dark:bg-slate-850 dark:border-slate-800 dark:text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1 dark:text-slate-450">{t('confirmPasswordLabel')}</label>
                        <input 
                          type="password" 
                          placeholder="Re-enter new password"
                          value={passwords.confirm}
                          onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary dark:bg-slate-850 dark:border-slate-800 dark:text-slate-200"
                        />
                      </div>
                    </div>

                    {/* Password Strength Indicator */}
                    {passwords.newPass && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500 font-medium">{t('passwordMgmtTitle')} Strength:</span>
                        <div className="flex gap-1 h-1.5 w-24 rounded-full overflow-hidden bg-slate-100 shrink-0 dark:bg-slate-800">
                          <div className={`h-full ${passwordStrength.color} ${passwordStrength.score >= 1 ? 'w-1/3' : 'w-0'}`} />
                          <div className={`h-full ${passwordStrength.color} ${passwordStrength.score >= 3 ? 'w-1/3' : 'w-0'}`} />
                          <div className={`h-full ${passwordStrength.color} ${passwordStrength.score >= 5 ? 'w-1/3' : 'w-0'}`} />
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-350">{passwordStrength.text}</span>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        className="bg-[#0b2447] hover:bg-[#1a3d6c] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors dark:bg-[#ff9933] dark:text-slate-950 dark:hover:bg-amber-600"
                      >
                        {t('changePasswordBtn')}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Login Activity & Sessions */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3 dark:border-slate-800">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider dark:text-slate-300">{t('activeDeviceSessions')}</h4>
                    <button 
                      onClick={handleLogoutAllDevices}
                      className="text-[10px] text-red-650 text-red-500 font-bold hover:underline cursor-pointer"
                    >
                      {t('logoutAllDevicesBtn')}
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {activeSessions.map((session) => (
                      <div key={session.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg text-slate-500 dark:bg-slate-850 dark:text-slate-400">
                            {session.device.includes('iPhone') ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{session.device}</p>
                            <p className="text-[10px] text-slate-500 font-light mt-0.5 dark:text-slate-450">{session.location} · {session.time}</p>
                          </div>
                        </div>
                        
                        {!session.current && (
                          <button
                            onClick={() => handleTerminateSession(session.id)}
                            className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer dark:bg-red-950/20 dark:text-red-400 dark:border-red-900"
                          >
                            {t('terminateSessionBtn')}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Alerts and Log Feeds */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-3 dark:text-slate-300 dark:border-slate-800">
                    {t('securityAlertsTitle')}
                  </h4>

                  <div className="space-y-3">
                    {securityLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-slate-50/70 border border-slate-200/50 rounded-xl flex items-center justify-between text-xs dark:bg-slate-850/20 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          {log.type === 'success' && <CheckCircle className="w-4 h-4 text-[#138808]" />}
                          {log.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                          {log.type === 'info' && <Info className="w-4 h-4 text-blue-500" />}
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">{log.title}</p>
                            <p className="text-[10px] text-slate-500 font-light mt-0.5 dark:text-slate-450">{log.detail}</p>
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-400 font-semibold dark:text-slate-600">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: 7. SETTINGS & VAULT */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                
                {/* SECTION 8: ACCOUNT PREFERENCES */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5 dark:bg-slate-900 dark:border-slate-800">
                  <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-3.5 flex items-center gap-2 dark:text-slate-100 dark:border-slate-800">
                    <Sliders className="w-4.5 h-4.5 text-[#ff9933]" /> {t('personalizationTheme')}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 dark:text-slate-400">{t('portalLanguageLabel')}</label>
                      <select 
                        value={preferences.language}
                        onChange={(e) => {
                          setPreferences({...preferences, language: e.target.value});
                          setSuccess(`Preferred interface language configured to ${e.target.value}`);
                        }}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary dark:bg-slate-850 dark:border-slate-800 dark:text-slate-200 dark:focus:border-[#ff9933]"
                      >
                        <option value="English">English (United Kingdom)</option>
                        <option value="Hindi">हिन्दी (Hindi)</option>
                        <option value="Tamil">தமிழ் (Tamil)</option>
                        <option value="Telugu">తెలుగు (Telugu)</option>
                        <option value="Bengali">বাংলা (Bengali)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-655 text-slate-605 text-slate-600 uppercase mb-1.5 font-sans dark:text-slate-400">{t('themeSelectorLabel')}</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setPreferences({...preferences, theme: 'Light'});
                            setSuccess('Light theme style loaded.');
                          }}
                          className={`py-2 px-4 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                            preferences.theme === 'Light' 
                              ? 'bg-[#0b2447] text-white border-transparent shadow-sm dark:bg-[#ff9933] dark:text-slate-950' 
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-350 dark:border-slate-700 dark:hover:bg-slate-700'
                          }`}
                        >
                          {t('lightModeBtn')}
                        </button>
                        <button
                          onClick={() => {
                            setPreferences({...preferences, theme: 'Dark'});
                            setSuccess('Dark theme style loaded.');
                          }}
                          className={`py-2 px-4 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                            preferences.theme === 'Dark' 
                              ? 'bg-[#0b2447] text-white border-transparent shadow-sm dark:bg-[#ff9933] dark:text-slate-950' 
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-350 dark:border-slate-700 dark:hover:bg-slate-700'
                          }`}
                        >
                          {t('darkModeBtn')}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 dark:text-slate-400">{t('accessibilityFontLabel')}</label>
                      <select 
                        value={preferences.accessibility}
                        onChange={(e) => {
                          setPreferences({...preferences, accessibility: e.target.value});
                          setSuccess(`Accessibility layout set to: ${e.target.value}`);
                        }}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary dark:bg-slate-850 dark:border-slate-800 dark:text-slate-200 dark:focus:border-[#ff9933]"
                      >
                        <option value="Normal Font">Normal Font Size (15px)</option>
                        <option value="Medium Font">Medium Font Scaling (17px)</option>
                        <option value="Large Font">Large Readable Text (19px)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 dark:text-slate-400">{t('preferredNotificationPath')}</label>
                      <select 
                        value={preferences.preferredComm}
                        onChange={(e) => {
                          setPreferences({...preferences, preferredComm: e.target.value});
                          setSuccess(`Alert route channel set to ${e.target.value}`);
                        }}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary dark:bg-slate-850 dark:border-slate-800 dark:text-slate-200 dark:focus:border-[#ff9933]"
                      >
                        <option value="SMS + Email">SMS + Email Alerts</option>
                        <option value="SMS Only">SMS Alerts Only</option>
                        <option value="Email Only">Email Digest Only</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 9: DOCUMENT SUMMARY */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3 flex-wrap gap-2 dark:border-slate-800">
                    <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 dark:text-slate-100">
                      <FileText className="w-4.5 h-4.5 text-blue-500" /> {t('digitalCredsVault')}
                    </h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setSuccess('Vault sync and verification triggered.');
                        }}
                        className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer dark:text-[#ff9933]"
                      >
                        {t('syncVaultBtn')}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="p-4 bg-slate-50/60 border border-slate-200/70 rounded-xl flex items-center justify-between text-xs dark:bg-slate-850/20 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-slate-450 shrink-0 dark:text-slate-550" />
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">{doc.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 dark:text-slate-500">{doc.type} · {doc.date}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <span className={`text-[9px] font-bold border px-2 py-0.2 rounded-full ${
                            doc.status === 'Verified' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-[#138808]/20'
                              : doc.status === 'Uploaded' 
                                ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400'
                                : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400'
                          }`}>
                            {doc.status}
                          </span>
                          
                          {doc.status === 'Pending' ? (
                            <label className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer dark:text-[#ff9933]">
                              {t('uploadText')}
                              <input 
                                type="file" 
                                onChange={() => handleUploadDoc(doc.id)} 
                                className="hidden" 
                              />
                            </label>
                          ) : (
                            <button
                              onClick={() => {
                                setSuccess(`Simulating download of verified ${doc.name}`);
                              }}
                              className="text-[10px] font-bold text-[#ff9933] hover:underline cursor-pointer"
                            >
                              {t('downloadText')}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION 10: ACTIVITY HISTORY TIMELINE */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                  <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-3 dark:text-slate-100 dark:border-slate-800">
                    {t('registryAuditLogs')}
                  </h3>

                  <div className="relative border-l border-slate-200 pl-6 space-y-6 dark:border-slate-800">
                    {activityHistory.map((item) => (
                      <div key={item.id} className="relative">
                        {/* Custom status icon map */}
                        <div className={`absolute -left-[35px] top-0.5 w-6 h-6 rounded-full border-2 border-white ring-4 ring-slate-100/50 flex items-center justify-center text-xs font-bold shadow-sm dark:border-slate-900 dark:ring-slate-950/50 ${item.color} dark:bg-slate-800`}>
                          {item.icon === 'UserCheck' && <UserCheck className="w-3 h-3" />}
                          {item.icon === 'MapPin' && <MapPin className="w-3 h-3 text-[#ff9933]" />}
                          {item.icon === 'Lock' && <Lock className="w-3 h-3 text-red-500" />}
                          {item.icon === 'Plus' && <Plus className="w-3 h-3" />}
                          {item.icon === 'FileText' && <FileText className="w-3 h-3 text-[#138808]" />}
                          {item.icon === 'User' && <User className="w-3 h-3 text-blue-500" />}
                        </div>
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.title}</p>
                            <p className="text-[11px] text-slate-500 font-light mt-0.5 dark:text-slate-450">{item.desc}</p>
                          </div>
                          <span className="text-[10px] text-slate-450 font-bold whitespace-nowrap dark:text-slate-500">{item.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ══════════════════════════════════════════════════
                SECTION 12: HELP & SUPPORT WIDGET
            ══════════════════════════════════════════════════ */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 dark:bg-slate-900 dark:border-slate-800">
              
              <div className="border-b border-slate-100 pb-3.5 dark:border-slate-800">
                <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 dark:text-slate-100">
                  <HelpCircle className="w-4.5 h-4.5 text-blue-500" /> {t('helpdeskTitle')}
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5 dark:text-slate-500">Direct link to support teams</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* FAQs Accordion */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider dark:text-slate-350">{t('faqTitle')}</h4>
                  <div className="space-y-2">
                    {[
                      { q: "How is my Census data secured?", a: "All citizen records are encrypted inside UIDAI-partnered vault environments with biometric key protections." },
                      { q: "Why is Alternate Mobile incomplete?", a: "Saving an alternate mobile provides account recovery channels and raises completion percentages." },
                      { q: "How to correct my name spelling?", a: "Under Identity tab, select 'Request Correction' and upload a gazetted identity card." },
                      { q: "Who updates address statuses?", a: "Once updated online, a field verification supervisor visits to approve physical credentials." }
                    ].map((faq, idx) => (
                      <div key={idx} className="border border-slate-150 rounded-xl overflow-hidden text-xs dark:border-slate-800" style={{fontFamily: 'sans-serif'}}>
                        <button
                          type="button"
                          onClick={() => toggleFaq(idx)}
                          className="w-full bg-slate-50/50 hover:bg-slate-150/40 p-3 text-left font-bold text-slate-700 flex justify-between items-center cursor-pointer dark:bg-slate-850 dark:hover:bg-slate-800 dark:text-slate-300"
                        >
                          <span>{faq.q}</span>
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform text-slate-400 dark:text-slate-650 ${faqOpen[idx] ? 'rotate-90' : ''}`} />
                        </button>
                        {faqOpen[idx] && (
                          <div className="p-3 bg-white text-slate-500 font-light border-t border-slate-150 leading-relaxed dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Support Ticket Submission */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider dark:text-slate-350">{t('submitTicketTitle')}</h4>
                  
                  <form onSubmit={handleSupportTicketSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 dark:text-slate-450">{t('subjectLabel')}</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Inaccurate verification timestamp"
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary dark:bg-slate-850 dark:border-slate-800 dark:text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 dark:text-slate-450">{t('categoryLabel')}</label>
                      <select 
                        value={ticketCategory}
                        onChange={(e) => setTicketCategory(e.target.value)}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary dark:bg-slate-850 dark:border-slate-800 dark:text-slate-200"
                      >
                        <option value="profile">Profile Inaccuracies</option>
                        <option value="address">Geographic Mapping</option>
                        <option value="documents">Vault Credentials</option>
                        <option value="other">General Registry Support</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 dark:text-slate-450">{t('descriptionLabel')}</label>
                      <textarea 
                        rows={3}
                        placeholder="Detail your request..."
                        value={ticketDescription}
                        onChange={(e) => setTicketDescription(e.target.value)}
                        className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary resize-none dark:bg-slate-850 dark:border-slate-800 dark:text-slate-200"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-[#0b2447] hover:bg-[#1a3d6c] text-white py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm dark:bg-[#ff9933] dark:text-slate-950 dark:hover:bg-amber-600"
                    >
                      {t('raiseTicketBtn')}
                    </button>
                  </form>
                </div>

              </div>

              {/* Support Assistant Live Chat */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm mt-6 dark:border-slate-800">
                <div className="bg-[#0b2447] text-white px-4 py-3 flex items-center justify-between dark:bg-slate-850">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold">{t('aiAgentText')}</span>
                  </div>
                  <span className="text-[10px] uppercase bg-white/10 px-2 py-0.5 rounded font-extrabold text-[#ff9933]">{t('aiAgentText')}</span>
                </div>

                {/* Message logs */}
                <div className="p-4 h-48 overflow-y-auto bg-[#fdfdfd] space-y-3 dark:bg-slate-950">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 rounded-xl max-w-xs text-xs shadow-sm leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-[#0b2447] text-white dark:bg-[#ff9933] dark:text-slate-950' 
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {chatTyping && (
                    <div className="flex justify-start">
                      <div className="p-3 bg-slate-100 text-slate-400 rounded-xl text-xs flex items-center gap-1.5 dark:bg-slate-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input action */}
                <form onSubmit={handleSendChatMessage} className="bg-slate-50 border-t border-slate-200 p-2 flex gap-2 dark:bg-slate-900 dark:border-slate-800">
                  <input 
                    type="text" 
                    placeholder={t('askChatInput')}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-grow px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#0b2447] dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                  <button 
                    type="submit"
                    className="p-1.5 bg-[#0b2447] text-white rounded-lg hover:bg-slate-900 cursor-pointer dark:bg-[#ff9933] dark:text-slate-950"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          DIALOG / MODAL POPUPS (Simulated Views)
      ══════════════════════════════════════════════════ */}
      
      {/* 1. EDIT PROFILE MODAL */}
      {isEditingPersonal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 dark:bg-black/70">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl max-w-md w-full overflow-hidden animate-fade-in dark:bg-slate-900 dark:border-slate-800">
            <div className="bg-[#0b2447] text-white p-4 flex justify-between items-center dark:bg-slate-850">
              <h3 className="font-bold text-sm">{t('editPersonalTitle')}</h3>
              <button onClick={() => setIsEditingPersonal(false)} className="text-white/80 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSavePersonalInfo} className="p-5 space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-500 uppercase mb-1 dark:text-slate-400">{t('fullNameLabel')}</label>
                <input 
                  type="text" 
                  value={personalInfo.fullName}
                  onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-lg focus:border-[#0b2447] outline-none dark:bg-slate-850 dark:border-slate-800 dark:text-slate-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 uppercase mb-1 dark:text-slate-400">{t('genderText')}</label>
                  <select 
                    value={personalInfo.gender}
                    onChange={(e) => setPersonalInfo({...personalInfo, gender: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-lg outline-none dark:bg-slate-850 dark:border-slate-800 dark:text-slate-100"
                  >
                    <option value="Male">{t('sonText') === 'पुत्र' ? 'पुरुष' : 'Male'}</option>
                    <option value="Female">{t('sonText') === 'पुत्र' ? 'महिला' : 'Female'}</option>
                    <option value="Other">{t('sonText') === 'पुत्र' ? 'अन्य' : 'Other'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 uppercase mb-1 dark:text-slate-400">{t('maritalStatusText')}</label>
                  <select 
                    value={personalInfo.maritalStatus}
                    onChange={(e) => setPersonalInfo({...personalInfo, maritalStatus: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-lg outline-none dark:bg-slate-850 dark:border-slate-800 dark:text-slate-100"
                  >
                    <option value="Single">{t('sonText') === 'पुत्र' ? 'अविवाहित' : 'Single'}</option>
                    <option value="Married">{t('sonText') === 'पुत्र' ? 'विवाहित' : 'Married'}</option>
                    <option value="Divorced">{t('sonText') === 'पुत्र' ? 'तलाकशुदा' : 'Divorced'}</option>
                    <option value="Widowed">{t('sonText') === 'पुत्र' ? 'विधवा' : 'Widowed'}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 uppercase mb-1 dark:text-slate-400">{t('dateOfBirthText')}</label>
                  <input 
                    type="text" 
                    value={personalInfo.dob}
                    onChange={(e) => setPersonalInfo({...personalInfo, dob: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-lg outline-none dark:bg-slate-850 dark:border-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 uppercase mb-1 dark:text-slate-400">{t('nationalityText')}</label>
                  <input 
                    type="text" 
                    value={personalInfo.nationality}
                    onChange={(e) => setPersonalInfo({...personalInfo, nationality: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-lg outline-none dark:bg-slate-850 dark:border-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setIsEditingPersonal(false)}
                  className="px-4 py-2 border border-slate-250 text-slate-700 rounded-xl hover:bg-slate-50 cursor-pointer dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-850"
                >
                  {t('cancelText')}
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#0b2447] text-white rounded-xl hover:bg-slate-900 cursor-pointer dark:bg-[#ff9933] dark:text-slate-950"
                >
                  {t('saveChangesBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. REQUEST IDENTITY CORRECTION MODAL */}
      {isRequestingCorrection && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 dark:bg-black/70">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl max-w-md w-full overflow-hidden animate-fade-in dark:bg-slate-900 dark:border-slate-800">
            <div className="bg-[#ff9933] text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-sm">{t('identityVerifCorrection')}</h3>
              <button onClick={() => setIsRequestingCorrection(false)} className="text-white hover:text-slate-100 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSaveCorrectionRequest} className="p-5 space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-500 uppercase mb-1 dark:text-slate-400">{t('targetDocField')}</label>
                <select 
                  value={correctionField}
                  onChange={(e) => setCorrectionField(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-lg outline-none dark:bg-slate-850 dark:border-slate-800 dark:text-slate-100"
                >
                  <option value="name">Full Name (Voter/Aadhaar Inconsistency)</option>
                  <option value="dob">Date of Birth (Format Mismatch)</option>
                  <option value="pan">PAN Card Number link error</option>
                  <option value="passport">Passport verification</option>
                </select>
              </div>
              
              <div>
                <label className="block text-slate-500 uppercase mb-1 dark:text-slate-400">{t('proposedCorrVal')}</label>
                <input 
                  type="text" 
                  placeholder="Enter exact name or parameter"
                  value={correctionProposed}
                  onChange={(e) => setCorrectionProposed(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-lg outline-none dark:bg-slate-850 dark:border-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase mb-1 dark:text-slate-400">{t('reasonRequest')}</label>
                <textarea 
                  rows={3}
                  placeholder="Explain why correction is needed..."
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-lg outline-none resize-none dark:bg-slate-850 dark:border-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase mb-1 dark:text-slate-400">{t('proofAttachment')}</label>
                <input 
                  type="text" 
                  placeholder="e.g. Birth_Certificate_MHA.pdf"
                  value={correctionProofName}
                  onChange={(e) => setCorrectionProofName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-lg outline-none dark:bg-slate-850 dark:border-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setIsRequestingCorrection(false)}
                  className="px-4 py-2 border border-slate-250 text-slate-700 rounded-xl hover:bg-slate-50 cursor-pointer dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-850"
                >
                  {t('cancelText')}
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#ff9933] text-white rounded-xl hover:bg-amber-600 cursor-pointer"
                >
                  {t('submitQueryBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. LINK FAMILY MEMBER DIALOG */}
      {isAddingFamily && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 dark:bg-black/70">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl max-w-sm w-full overflow-hidden animate-fade-in dark:bg-slate-900 dark:border-slate-800">
            <div className="bg-[#0b2447] text-white p-4 flex justify-between items-center dark:bg-slate-850">
              <h3 className="font-bold text-sm">{t('linkFamilyMember')}</h3>
              <button onClick={() => setIsAddingFamily(false)} className="text-white/80 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddFamilyMember} className="p-5 space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-500 uppercase mb-1 dark:text-slate-400">{t('fullNameLabel')}</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sandeep Mehra"
                  value={newFamilyMember.name}
                  onChange={(e) => setNewFamilyMember({...newFamilyMember, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-lg focus:border-[#0b2447] dark:bg-slate-850 dark:border-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase mb-1 dark:text-slate-400">{t('relationshipLabel')}</label>
                <select 
                  value={newFamilyMember.relation}
                  onChange={(e) => setNewFamilyMember({...newFamilyMember, relation: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-lg outline-none dark:bg-slate-850 dark:border-slate-800 dark:text-slate-100"
                >
                  <option value="Son">{t('sonText')}</option>
                  <option value="Daughter">{t('daughterText')}</option>
                  <option value="Spouse">{t('spouseText')}</option>
                  <option value="Brother">{t('brotherText')}</option>
                  <option value="Father">{t('fatherText')}</option>
                  <option value="Mother">{t('motherText')}</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="verify-family-check"
                  checked={newFamilyMember.verified}
                  onChange={(e) => setNewFamilyMember({...newFamilyMember, verified: e.target.checked})}
                  className="w-4 h-4 rounded text-[#0b2447] focus:ring-[#0b2447] cursor-pointer"
                />
                <label htmlFor="verify-family-check" className="text-slate-650 cursor-pointer dark:text-slate-350">{t('verifyFamilyBiometrics')}</label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setIsAddingFamily(false)}
                  className="px-4 py-2 border border-slate-250 text-slate-700 rounded-xl hover:bg-slate-50 cursor-pointer dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-850"
                >
                  {t('cancelText')}
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#0b2447] text-white rounded-xl hover:bg-slate-900 cursor-pointer dark:bg-[#ff9933] dark:text-slate-950"
                >
                  {t('linkMemberBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfileManagement;
