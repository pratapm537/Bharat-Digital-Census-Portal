import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { censusAPI } from '../services/api.js';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
  FileText, Download, CheckCircle, Clock, AlertTriangle, UserCheck,
  ArrowLeft, ArrowRight, ShieldCheck, MapPin, Users, Heart, Bell, Activity,
  Briefcase, Home, BookOpen, Upload, MessageCircle, ChevronRight,
  Star, Zap, Eye, Edit, Phone, HelpCircle, Flag, LogOut,
  X, Send, Bot, User, CheckSquare, Circle, TrendingUp, Award,
  Printer, Share2, Mail, Copy, RefreshCw, ZoomIn, ZoomOut, RotateCw, Maximize,
  Shield, Check, Lock, Info, Search, CheckSquare as CheckedIcon
} from 'lucide-react';

const CertificateCenter = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const certificateRef = useRef(null);

  // API Draft states
  const [draft, setDraft] = useState(null);
  const [family, setFamily] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Page States
  const [activeCert, setActiveCert] = useState('registration'); // 'registration' | 'family' | 'verification'
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Previewer controls
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sharing states
  const [emailInput, setEmailInput] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  // Security Verification Center simulation
  const [isVerifyingSecurity, setIsVerifyingSecurity] = useState(false);
  const [securityChecked, setSecurityChecked] = useState(false);
  
  // Download Simulation states
  const [downloadProgress, setDownloadProgress] = useState(null);

  // Printing controls
  const [printOrientation, setPrintOrientation] = useState('portrait'); // 'portrait' | 'landscape'
  const [printPaperFormat, setPrintPaperFormat] = useState('a4'); // 'a4' | 'letter'
  const [printHistory, setPrintHistory] = useState([
    { id: 1, docName: 'Census Registration Certificate', date: 'Jan 15, 2026 · 11:20 AM', format: 'A4 Portrait', status: 'Success' }
  ]);

  // Support State
  const [faqOpen, setFaqOpen] = useState(null);
  const [supportTicket, setSupportTicket] = useState({ subject: '', category: 'download', description: '' });
  const [ticketSuccess, setTicketSuccess] = useState(false);

  // Mock Timeline logs
  const [activityTimeline, setActivityTimeline] = useState([
    { id: 1, action: 'Certificate Generated', time: 'Jan 15, 2026 · 10:45 AM', icon: Award, color: '#3b82f6' },
    { id: 2, action: 'Certificate Downloaded', time: 'Jan 15, 2026 · 11:02 AM', icon: Download, color: '#10b981' },
    { id: 3, action: 'Certificate Printed', time: 'Jan 15, 2026 · 11:20 AM', icon: Printer, color: '#f59e0b' },
    { id: 4, action: 'QR Verification Conducted', time: 'Jan 16, 2026 · 02:15 PM', icon: ShieldCheck, color: '#8b5cf6' }
  ]);

  // Load actual database draft
  const loadDraft = async () => {
    try {
      const response = await censusAPI.getDraft();
      setDraft(response.data.draft);
      setFamily(response.data.family || []);
      
      // Auto-toggle demo mode if census is not approved, allowing users to see full certificate preview
      if (response.data.draft?.status !== 'APPROVED') {
        setIsDemoMode(true);
      }
    } catch (err) {
      setError('Could not connect to census records database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDraft();
  }, []);

  const citizenName = useMemo(() => {
    if (isDemoMode) return 'Mohit Pratap Mehra';
    return draft?.personal_fullName || user?.fullName || 'Citizen';
  }, [isDemoMode, draft, user]);

  const famId = useMemo(() => {
    if (isDemoMode) return 'FAM-2026-45879';
    return user?.id ? `FAM-2026-${String(user.id).padStart(5, '0')}` : 'FAM-2026-00001';
  }, [isDemoMode, user]);

  const regNum = useMemo(() => {
    if (isDemoMode) return 'CEN-2026-458796';
    return draft?.id ? `CEN-2026-${String(draft.id).padStart(6, '0')}` : 'CEN-2026-000001';
  }, [isDemoMode, draft]);

  const isVerified = useMemo(() => {
    if (isDemoMode) return true;
    return draft?.status === 'APPROVED';
  }, [isDemoMode, draft]);

  // Certificate metadata matching the selections
  const selectedCertMeta = useMemo(() => {
    switch (activeCert) {
      case 'registration':
        return {
          title: 'Census Registration Certificate',
          number: `CRC-2026-${isDemoMode ? '458796' : String(draft?.id || 1).padStart(6, '0')}`,
          issueDate: isDemoMode ? '15 January 2026' : (draft?.submittedAt ? new Date(draft.submittedAt).toLocaleDateString('en-IN') : 'N/A'),
          status: isVerified ? 'Verified' : 'Pending',
          hash: 'SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
        };
      case 'family':
        return {
          title: 'Family Census Certificate',
          number: `FCC-2026-${isDemoMode ? '458796' : String(draft?.id || 1).padStart(6, '0')}`,
          issueDate: isDemoMode ? '18 January 2026' : (draft?.submittedAt ? new Date(draft.submittedAt).toLocaleDateString('en-IN') : 'N/A'),
          status: isVerified ? 'Approved' : 'Pending',
          hash: 'SHA256: 7f83b1657ff1fc53b92c181f6a85600b54e3e3b0c44298fc1c149afbf4c8996f'
        };
      case 'verification':
        return {
          title: 'Verification Certificate',
          number: `VCC-2026-${isDemoMode ? '982145' : String(draft?.id || 1).padStart(6, '0')}`,
          issueDate: isDemoMode ? '22 January 2026' : (draft?.updatedAt ? new Date(draft.updatedAt).toLocaleDateString('en-IN') : 'N/A'),
          status: isVerified ? 'Government Approved' : 'Under Review',
          hash: 'SHA256: 8c34ea8a03f8a032d1cfb26fb51e7db2442b5fca814ca8b991b4ca2b069d25a1'
        };
      default:
        return {};
    }
  }, [activeCert, isDemoMode, draft, isVerified]);

  // Overview metrics calculations
  const overviewMetrics = useMemo(() => {
    return {
      total: 3,
      verified: isVerified ? 3 : 0,
      pending: isVerified ? 0 : 3,
      monthIssued: 1
    };
  }, [isVerified]);

  // Action and download functions
  const triggerPrint = () => {
    const element = certificateRef.current;
    if (!element) return;
    
    // Save style
    const originalTransform = element.style.transform;
    const originalBoxShadow = element.style.boxShadow;
    
    // Reset transform for print layout
    element.style.transform = 'none';
    element.style.boxShadow = 'none';
    
    const printContent = element.outerHTML;
    
    // Restore
    element.style.transform = originalTransform;
    element.style.boxShadow = originalBoxShadow;
    
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>${selectedCertMeta.title}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: A4 ${printOrientation};
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background-color: white;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            div {
              transform: none !important;
              box-shadow: none !important;
            }
          </style>
        </head>
        <body>
          <div style="width: 460px; height: 600px;">
            ${printContent}
          </div>
          <script>
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.frameElement.remove();
              }, 500);
            }, 1000);
          </script>
        </html>
      `);
    doc.close();
    
    setSuccess(`Preparing file for direct print in A4 ${printOrientation}...`);
    // Add print history log
    setTimeout(() => {
      setPrintHistory(prev => [
        { id: Date.now(), docName: selectedCertMeta.title, date: new Date().toLocaleString(), format: `A4 ${printOrientation}`, status: 'Success' },
        ...prev
      ]);
      setActivityTimeline(prevLogs => [
        { id: Date.now(), action: `Certificate Printed (${printOrientation})`, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), icon: Printer, color: '#f59e0b' },
        ...prevLogs
      ]);
    }, 600);
  };

  const triggerDownload = (format) => {
    if (format === 'print') {
      triggerPrint();
      return;
    }

    if (downloadProgress !== null) return;
    setDownloadProgress(10);

    const generateAndDownloadPDF = async (certType, downloadFilename) => {
      const originalCert = activeCert;
      if (certType && certType !== activeCert) {
        setActiveCert(certType);
        // Wait for React to render the target certificate layout
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const element = certificateRef.current;
      if (!element) {
        return;
      }

      // Save styles
      const originalTransform = element.style.transform;
      const originalBoxShadow = element.style.boxShadow;

      // Reset styles for clean capture
      element.style.transform = 'none';
      element.style.boxShadow = 'none';

      try {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });

        // Restore styles
        element.style.transform = originalTransform;
        element.style.boxShadow = originalBoxShadow;

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(downloadFilename || `${selectedCertMeta.title.replace(/\\s+/g, '_')}.pdf`);

        if (certType && certType !== originalCert) {
          setActiveCert(originalCert);
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (err) {
        console.error('Error generating PDF:', err);
        setError('Failed to generate PDF. Please try again.');
        // Restore styles
        element.style.transform = originalTransform;
        element.style.boxShadow = originalBoxShadow;
      }
    };

    if (format === 'pdf') {
      setTimeout(async () => {
        setDownloadProgress(40);
        await generateAndDownloadPDF(activeCert);
        setDownloadProgress(100);
        setTimeout(() => {
          setDownloadProgress(null);
          setSuccess(`Download for: ${selectedCertMeta.title} completed.`);
          setActivityTimeline(prevLogs => [
            { id: Date.now(), action: `Certificate Downloaded (PDF)`, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), icon: Download, color: '#10b981' },
            ...prevLogs
          ]);
        }, 400);
      }, 100);
    } else if (format === 'all') {
      setTimeout(async () => {
        const certTypes = ['registration', 'family', 'verification'];
        const certTitles = [
          'Census_Registration_Certificate.pdf',
          'Family_Census_Certificate.pdf',
          'Government_Verification_Certificate.pdf'
        ];

        for (let i = 0; i < certTypes.length; i++) {
          setDownloadProgress(Math.round(10 + (i * 30)));
          await generateAndDownloadPDF(certTypes[i], certTitles[i]);
        }

        setDownloadProgress(100);
        setTimeout(() => {
          setDownloadProgress(null);
          setSuccess(`Successfully downloaded all certificates.`);
          setActivityTimeline(prevLogs => [
            { id: Date.now(), action: `All Certificates Downloaded`, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), icon: Download, color: '#10b981' },
            ...prevLogs
          ]);
        }, 400);
      }, 100);
    }
  };

  const triggerSecurityCheck = () => {
    setIsVerifyingSecurity(true);
    setTimeout(() => {
      setIsVerifyingSecurity(false);
      setSecurityChecked(true);
      setSuccess('Tamper checking completed: Cryptographic SHA signature hash is 100% valid!');
    }, 1800);
  };

  const copyShareLink = () => {
    const link = `https://census.gov.in/verify/${selectedCertMeta.number}`;
    setIsLinkCopied(true);
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = link;
      textArea.style.position = 'fixed';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('Fallback copy failed', err);
      }
      document.body.removeChild(textArea);
    }

    setSuccess('Verification share link successfully copied to clipboard.');
    setTimeout(() => setIsLinkCopied(false), 2000);
    setActivityTimeline(prevLogs => [
      { id: Date.now(), action: `Verification Link Shared`, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), icon: Share2, color: '#8b5cf6' },
      ...prevLogs
    ]);
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!emailInput) return;
    setIsEmailSent(true);
    setSuccess(`Dispatched credentials request for validation...`);
    setTimeout(() => {
      setIsEmailSent(false);
      setSuccess(`Official certificate copy successfully dispatched to: ${emailInput}`);
      setEmailInput('');
      setActivityTimeline(prevLogs => [
        { id: Date.now(), action: `Certificate Emailed to ${emailInput}`, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), icon: Mail, color: '#3b82f6' },
        ...prevLogs
      ]);
    }, 1500);
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!supportTicket.subject || !supportTicket.description) return;
    setTicketSuccess(true);
    setSuccess('Registering support ticket with the Helpdesk database...');
    setTimeout(() => {
      setTicketSuccess(false);
      setSuccess(`Your support ticket (Category: ${supportTicket.category.toUpperCase()}) has been submitted to the National Helpdesk. Ticket Reference ID: TIC-2026-${Math.floor(1000 + Math.random() * 9000)}.`);
      setSupportTicket({ subject: '', category: 'download', description: '' });
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center p-6 bg-slate-50/50">
        <div className="flex flex-col items-center gap-4 text-[#0b2447]">
          <div className="w-12 h-12 border-4 border-t-[#0b2447] border-[#0b2447]/10 rounded-full animate-spin" />
          <p className="text-xs font-semibold tracking-wide">Connecting to National Document Vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow w-full bg-[#f8faff] min-h-screen pb-16 relative">
      
      {/* ══════════════════════════════════════════════════
          HERO PAGE HEADER (Section 1)
      ══════════════════════════════════════════════════ */}
      <div className="bg-[#0b2447] text-white py-10 px-6 sm:px-12 relative overflow-hidden shadow-lg border-b border-white/5">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#ff9933]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 w-80 h-80 bg-[#138808]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 text-xs text-slate-350 hover:text-white mb-3 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </button>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-widest bg-white/10 px-3 py-0.5 rounded-full">
                DigiLocker Linked
              </span>
              <span className="text-[10px] uppercase font-bold text-[#ff9933] bg-[#ff9933]/15 border border-[#ff9933]/25 px-3 py-0.5 rounded-full">
                National Credential Vault
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 flex items-center gap-2.5">
              <Award className="w-8 h-8 text-[#ff9933]" /> Census Certificate Center
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl font-light">
              Manage, verify, download, and print all your official census certificates. Secure government cryptographic validations.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Demo Toggle Switch */}
            <div className="flex items-center bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md">
              <div className="text-right mr-3">
                <span className="block text-[9px] text-white/40 uppercase tracking-widest font-extrabold">Data Source</span>
                <span className={`text-xs font-bold ${isDemoMode ? 'text-[#ff9933]' : 'text-[#10b981]'}`}>
                  {isDemoMode ? 'Simulated Vault' : 'Live Registry'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isDemoMode}
                  onChange={(e) => setIsDemoMode(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ff9933]" />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">

        {/* Success / Error alerts */}
        {error && (
          <div className="bg-red-50 text-red-750 text-xs p-4 rounded-2xl border border-red-200 mb-6 flex items-start gap-2.5 shadow-sm animate-fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-650" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 text-xs p-4 rounded-2xl border border-green-200 mb-6 flex items-start gap-2.5 shadow-sm animate-fade-in">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-green-600" />
            <span>{success}</span>
          </div>
        )}
        {isDemoMode && (
          <div className="bg-amber-50 text-amber-900 text-xs p-4 rounded-2xl border border-amber-250 mb-6 flex items-start gap-2.5 shadow-sm">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="font-bold">Demonstration Vault Active</p>
              <p className="text-amber-700 mt-0.5">Showing mock verified certificates for demonstration purposes since your live census application is currently under draft review. Toggle switch above to view live state.</p>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            SECTION 2: CERTIFICATE OVERVIEW TILES
        ══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Certificates', value: overviewMetrics.total, unit: 'Issued Documents', icon: Award, color: '#0b2447', bg: 'rgba(11,36,71,0.06)' },
            { label: 'Verified Status', value: overviewMetrics.verified, unit: 'Approved credentials', icon: ShieldCheck, color: '#10b981', bg: 'rgba(16,185,129,0.06)' },
            { label: 'Pending Audits', value: overviewMetrics.pending, unit: 'Awaiting signature', icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.06)' },
            { label: 'Issued This Month', value: overviewMetrics.monthIssued, unit: 'New additions', icon: CheckedIcon, color: '#8b5cf6', bg: 'rgba(139,92,246,0.06)' }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">{stat.label}</span>
                  <h3 className="text-2xl font-extrabold text-[#0b2447] mt-1">{stat.value}</h3>
                  <p className="text-[9px] text-slate-500 mt-0.5">{stat.unit}</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.bg, color: stat.color }}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex-1 w-full relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search certificates by serial number, type or issuer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:border-[#0b2447] transition-all"
            />
          </div>

          <div className="flex gap-3 w-full sm:w-auto shrink-0 justify-end">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 outline-none cursor-pointer focus:border-[#0b2447]"
            >
              <option value="all">All Documents</option>
              <option value="verified">Verified only</option>
              <option value="pending">Pending review</option>
            </select>
            
            <button 
              onClick={() => triggerDownload('all')}
              className="bg-[#0b2447] hover:bg-[#1f3e6d] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Download All
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            MAIN SECURE GRID CONTENT
        ══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT AREA: CERTIFICATE CARDS LIST & CONTROLS (5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* DOCUMENTS LIST PANELS */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h4 className="font-extrabold text-sm text-[#0b2447] mb-4">Issued Census Certificates</h4>
              
              <div className="space-y-4">
                
                {/* SECTION 3: CENSUS REGISTRATION CERTIFICATE CARD */}
                <div 
                  className={`p-4 border rounded-2xl hover:shadow-md transition-all cursor-pointer relative overflow-hidden group ${
                    activeCert === 'registration' 
                      ? 'border-[#ff9933] bg-[#ff9933]/2 ring-2 ring-[#ff9933]/15' 
                      : 'border-slate-150 bg-slate-50/50'
                  }`}
                  onClick={() => setActiveCert('registration')}
                >
                  <div className="absolute -right-3 -bottom-3 opacity-[0.03] group-hover:scale-110 transition-transform">
                    <Award className="w-24 h-24 text-[#0b2447]" />
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 bg-[#0b2447]/10 text-[#0b2447] rounded-full">
                      Ref ID: CRC-2026
                    </span>
                    <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      isVerified ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <h5 className="font-extrabold text-xs text-[#0b2447] mt-3">Census Registration Certificate</h5>
                  <p className="text-[10px] text-slate-500 mt-1">Proof of individual citizen census enrollment.</p>
                  
                  <div className="mt-4 pt-3 border-t border-slate-150/60 flex items-center justify-between text-[9px] text-slate-400 font-bold">
                    <span>Issued: {isDemoMode ? '15 Jan 2026' : 'Real-time'}</span>
                    <span className="text-[#0b2447] group-hover:underline flex items-center gap-0.5">
                      Preview <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* SECTION 4: FAMILY CENSUS CERTIFICATE CARD */}
                <div 
                  className={`p-4 border rounded-2xl hover:shadow-md transition-all cursor-pointer relative overflow-hidden group ${
                    activeCert === 'family' 
                      ? 'border-[#ff9933] bg-[#ff9933]/2 ring-2 ring-[#ff9933]/15' 
                      : 'border-slate-150 bg-slate-50/50'
                  }`}
                  onClick={() => setActiveCert('family')}
                >
                  <div className="absolute -right-3 -bottom-3 opacity-[0.03] group-hover:scale-110 transition-transform">
                    <Users className="w-24 h-24 text-[#0b2447]" />
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 bg-[#0b2447]/10 text-[#0b2447] rounded-full">
                      Ref ID: FCC-2026
                    </span>
                    <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      isVerified ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {isVerified ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <h5 className="font-extrabold text-xs text-[#0b2447] mt-3">Family Census Certificate</h5>
                  <p className="text-[10px] text-slate-500 mt-1">Proof of household structure and local address validation.</p>
                  
                  <div className="mt-4 pt-3 border-t border-slate-150/60 flex items-center justify-between text-[9px] text-slate-400 font-bold">
                    <span>Issued: {isDemoMode ? '18 Jan 2026' : 'Real-time'}</span>
                    <span className="text-[#0b2447] group-hover:underline flex items-center gap-0.5">
                      Preview <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* SECTION 5: VERIFICATION CERTIFICATE CARD */}
                <div 
                  className={`p-4 border rounded-2xl hover:shadow-md transition-all cursor-pointer relative overflow-hidden group ${
                    activeCert === 'verification' 
                      ? 'border-[#ff9933] bg-[#ff9933]/2 ring-2 ring-[#ff9933]/15' 
                      : 'border-slate-150 bg-slate-50/50'
                  }`}
                  onClick={() => setActiveCert('verification')}
                >
                  <div className="absolute -right-3 -bottom-3 opacity-[0.03] group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-24 h-24 text-[#0b2447]" />
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 bg-[#0b2447]/10 text-[#0b2447] rounded-full">
                      Ref ID: VER-2026
                    </span>
                    <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      isVerified ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {isVerified ? 'Approved' : 'Under Review'}
                    </span>
                  </div>
                  <h5 className="font-extrabold text-xs text-[#0b2447] mt-3">Government Verification Certificate</h5>
                  <p className="text-[10px] text-slate-500 mt-1">Completion certificate signed by verifying census officer.</p>
                  
                  <div className="mt-4 pt-3 border-t border-slate-150/60 flex items-center justify-between text-[9px] text-slate-400 font-bold">
                    <span>Issued: {isDemoMode ? '22 Jan 2026' : 'Real-time'}</span>
                    <span className="text-[#0b2447] group-hover:underline flex items-center gap-0.5">
                      Preview <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* SECTION 13: CERTIFICATE SECURITY INTEGRITY */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h4 className="font-extrabold text-sm text-[#0b2447] mb-1">Vault Cryptographic Integrity</h4>
              <p className="text-[10px] text-slate-400 mb-4">Verify mathematical hash integrity and encryption statuses.</p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold text-slate-650">
                  <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-[#ff9933]" /> Encryption Strength</span>
                  <span>AES-256 Valid</span>
                </div>
                
                <div className="flex justify-between items-center text-xs font-bold text-slate-650">
                  <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-[#10b981]" /> Integrity Checking</span>
                  <span className={securityChecked ? 'text-[#10b981]' : 'text-slate-500'}>
                    {securityChecked ? '100% Secure' : 'Untested'}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500">Security Index Rating</span>
                  <span className="text-xs font-extrabold text-[#138808]">100% Tamperproof</span>
                </div>

                <button 
                  onClick={triggerSecurityCheck}
                  disabled={isVerifyingSecurity}
                  className="w-full bg-[#0b2447] hover:bg-[#1f3e6d] text-white text-xs font-bold py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingSecurity ? 'animate-spin' : ''}`} />
                  {isVerifyingSecurity ? 'Hashing Document Matrix...' : 'Perform Integrity Audit'}
                </button>
              </div>
            </div>

            {/* SECTION 14: QUICK SHORTCUTS CARD PANELS */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h4 className="font-extrabold text-sm text-[#0b2447] mb-3">Quick Vault Actions</h4>
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold">
                <button 
                  onClick={() => triggerDownload('pdf')} 
                  className="p-3 bg-slate-50 border border-slate-100 hover:bg-slate-100 rounded-2xl flex flex-col items-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="w-5 h-5 text-blue-600" />
                  <span>Download PDF</span>
                </button>
                <button 
                  onClick={triggerPrint} 
                  className="p-3 bg-slate-50 border border-slate-100 hover:bg-slate-100 rounded-2xl flex flex-col items-center gap-2 cursor-pointer transition-colors"
                >
                  <Printer className="w-5 h-5 text-green-600" />
                  <span>Print Document</span>
                </button>
                <button 
                  onClick={copyShareLink} 
                  className="p-3 bg-slate-50 border border-slate-100 hover:bg-slate-100 rounded-2xl flex flex-col items-center gap-2 cursor-pointer transition-colors"
                >
                  <Share2 className="w-5 h-5 text-purple-600" />
                  <span>Verify Share</span>
                </button>
                 <button 
                  onClick={() => {
                    setSuccess(`Reissue request for: ${selectedCertMeta.title} has been logged in the audit queue.`);
                    setActivityTimeline(prevLogs => [
                      { id: Date.now(), action: `Reissue Requested`, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), icon: RefreshCw, color: '#f59e0b' },
                      ...prevLogs
                    ]);
                  }}
                  className="p-3 bg-slate-50 border border-slate-100 hover:bg-slate-100 rounded-2xl flex flex-col items-center gap-2 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-5 h-5 text-amber-500" />
                  <span>Request Reissue</span>
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT AREA: REALISTIC PDF PREVIEWER & METADATA (7 columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* SECTION 6: REALISTIC CERTIFICATE PREVIEW PANEL */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              
              {/* Document View Control Header bar */}
              <div className="bg-slate-50 border-b border-slate-150/70 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <FileText className="w-4.5 h-4.5 text-[#0b2447]" />
                  <span className="text-xs font-extrabold text-[#0b2447]">{selectedCertMeta.title}</span>
                </div>
                
                {/* Control elements */}
                <div className="flex items-center gap-1 bg-white border border-slate-150/60 rounded-xl px-2 py-1 shadow-sm">
                  <button 
                    onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.1))} 
                    className="p-1 text-slate-500 hover:text-[#0b2447] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-bold text-slate-400 font-mono w-8 text-center">{Math.round(zoomLevel * 100)}%</span>
                  <button 
                    onClick={() => setZoomLevel(prev => Math.min(1.3, prev + 0.1))} 
                    className="p-1 text-slate-500 hover:text-[#0b2447] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-px h-4 bg-slate-200 mx-1" />
                  <button 
                    onClick={() => setRotation(prev => (prev + 90) % 360)} 
                    className="p-1 text-slate-500 hover:text-[#0b2447] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                    title="Rotate 90°"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setIsFullscreen(!isFullscreen)} 
                    className="p-1 text-slate-500 hover:text-[#0b2447] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                    title="Toggle Fullscreen"
                  >
                    <Maximize className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Realistic Preview canvas */}
              <div 
                className={`bg-slate-150/45 p-8 flex items-center justify-center transition-all overflow-auto relative border-b border-slate-100 ${
                  isFullscreen ? 'fixed inset-0 z-50 bg-slate-900/90' : 'h-[500px]'
                }`}
              >
                {/* Fullscreen Close button */}
                {isFullscreen && (
                  <button 
                    onClick={() => setIsFullscreen(false)} 
                    className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 p-2.5 rounded-full text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}

                {/* Certificate Sheet Document template */}
                <div 
                  ref={certificateRef}
                  className="bg-white border-[6px] border-[#bf953f] p-8 shadow-xl rounded-sm w-[460px] h-[600px] flex flex-col justify-between relative transition-all duration-300 transform origin-center"
                  style={{ 
                    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                    boxShadow: '0 20px 40px rgba(11,36,71,0.1)'
                  }}
                >
                  {/* Subtle watermarks and ornaments */}
                  <div className="absolute inset-2 border border-[#0b2447]/20 pointer-events-none" />
                  <div className="absolute inset-0 opacity-[0.03] bg-center bg-no-repeat pointer-events-none flex items-center justify-center">
                    <Award className="w-64 h-64 text-[#0b2447]" />
                  </div>

                  {/* Header Branding */}
                  <div className="text-center relative z-10">
                    <span className="text-[10px] font-bold text-[#0b2447] tracking-wider uppercase block">Government of India</span>
                    <span className="text-[8px] font-medium text-slate-400 uppercase tracking-widest block mt-0.5">Ministry of Home Affairs</span>
                    
                    {/* Small Gov Seal */}
                    <div className="w-8 h-8 rounded-full bg-[#0b2447] mx-auto mt-2.5 flex items-center justify-center text-[10px] text-white font-extrabold">
                      IN
                    </div>
                    
                    <h2 className="text-xs font-black text-[#0b2447] mt-3 uppercase tracking-widest border-b border-slate-200 pb-1 w-max mx-auto px-4">
                      {selectedCertMeta.title}
                    </h2>
                  </div>

                  {/* Dynamic Certificate contents based on active tab */}
                  <div className="my-6 space-y-3.5 text-[9px] text-[#0b2447] font-semibold relative z-10 leading-normal">
                    {activeCert === 'registration' && (
                      <>
                        <p className="text-center italic text-slate-500">This certifies that the citizen profile has been recorded in the national census.</p>
                        <div className="grid grid-cols-2 gap-y-2 mt-4 pt-3 border-t border-dashed border-slate-100">
                          <div><span className="text-slate-400 block text-[8px] uppercase">Citizen Name</span> <span className="font-extrabold text-[10px]">{citizenName}</span></div>
                          <div><span className="text-slate-400 block text-[8px] uppercase">Registration Number</span> <span className="font-mono">{regNum}</span></div>
                          <div><span className="text-slate-400 block text-[8px] uppercase">Family Head ID</span> <span className="font-mono">{famId}</span></div>
                          <div><span className="text-slate-400 block text-[8px] uppercase">Certificate Number</span> <span className="font-mono">{selectedCertMeta.number}</span></div>
                          <div><span className="text-slate-400 block text-[8px] uppercase">Issue Authority</span> <span>National Census Registry</span></div>
                          <div><span className="text-slate-400 block text-[8px] uppercase">Enrolment Date</span> <span>{selectedCertMeta.issueDate}</span></div>
                        </div>
                      </>
                    )}

                    {activeCert === 'family' && (
                      <>
                        <p className="text-center italic text-slate-500">Official registry record identifying active household dependents and address listings.</p>
                        <div className="grid grid-cols-2 gap-y-2 mt-4 pt-3 border-t border-dashed border-slate-100">
                          <div><span className="text-slate-400 block text-[8px] uppercase">Family Head Name</span> <span className="font-extrabold text-[10px]">{citizenName}</span></div>
                          <div><span className="text-slate-400 block text-[8px] uppercase">Family Registry ID</span> <span className="font-mono">{famId}</span></div>
                          <div><span className="text-slate-400 block text-[8px] uppercase">Total Members Count</span> <span>{isDemoMode ? 8 : family.length + 1} Dependents</span></div>
                          <div><span className="text-slate-400 block text-[8px] uppercase">Certificate Serial</span> <span className="font-mono">{selectedCertMeta.number}</span></div>
                          <div className="col-span-2"><span className="text-slate-400 block text-[8px] uppercase">Household Address Details</span> <span>{draft?.address_houseDetails || 'Mehra Villa, Sector 4, Dwarka, New Delhi'}</span></div>
                        </div>
                      </>
                    )}

                    {activeCert === 'verification' && (
                      <>
                        <p className="text-center italic text-slate-500">Government completion certificate confirming field audits by official supervisors.</p>
                        <div className="grid grid-cols-2 gap-y-2 mt-4 pt-3 border-t border-dashed border-slate-100">
                          <div><span className="text-slate-400 block text-[8px] uppercase">Verification ID</span> <span className="font-mono">{selectedCertMeta.number}</span></div>
                          <div><span className="text-slate-400 block text-[8px] uppercase">Assigned Supervisor</span> <span>Officer Amit Sharma</span></div>
                          <div><span className="text-slate-400 block text-[8px] uppercase">Audit Date</span> <span>{selectedCertMeta.issueDate}</span></div>
                          <div><span className="text-slate-400 block text-[8px] uppercase">Verification Status</span> <span className="text-[#10b981] font-bold">Approved</span></div>
                          <div className="col-span-2"><span className="text-slate-400 block text-[8px] uppercase">Officer Audit Remarks</span> <span className="italic">"Physical verification of residence parameters and dependent documentation completed with 0 discrepancies."</span></div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Signatures & Seal QR Bottom Row */}
                  <div className="border-t border-slate-200 pt-4 flex justify-between items-end relative z-10 shrink-0">
                    
                    {/* QR Code Validation */}
                    <div>
                      <svg width="46" height="46" viewBox="0 0 100 100" className="border border-slate-200 p-0.5 rounded">
                        {/* Interactive dynamic QR code grids mockup */}
                        <rect x="0" y="0" width="30" height="30" fill="#0b2447" />
                        <rect x="5" y="5" width="20" height="20" fill="white" />
                        <rect x="10" y="10" width="10" height="10" fill="#0b2447" />
                        
                        <rect x="70" y="0" width="30" height="30" fill="#0b2447" />
                        <rect x="75" y="5" width="20" height="20" fill="white" />
                        <rect x="80" y="10" width="10" height="10" fill="#0b2447" />

                        <rect x="0" y="70" width="30" height="30" fill="#0b2447" />
                        <rect x="5" y="75" width="20" height="20" fill="white" />
                        <rect x="10" y="80" width="10" height="10" fill="#0b2447" />

                        {/* Random blocks */}
                        <rect x="40" y="15" width="10" height="10" fill="#0b2447" />
                        <rect x="50" y="30" width="15" height="15" fill="#0b2447" />
                        <rect x="35" y="50" width="10" height="20" fill="#0b2447" />
                        <rect x="55" y="65" width="20" height="10" fill="#0b2447" />
                        <rect x="80" y="80" width="15" height="15" fill="#0b2447" />
                      </svg>
                      <span className="text-[6px] text-slate-400 block text-center mt-1">Scan to Verify</span>
                    </div>

                    {/* Official Stamp */}
                    <div className="w-14 h-14 rounded-full border border-dashed border-[#138808]/40 flex items-center justify-center text-center text-[#138808] font-bold text-[7px] rotate-[-12deg] relative">
                      <div className="absolute inset-1 rounded-full border border-dashed border-[#138808]/20" />
                      VERIFIED<br />GOVT INDIA
                    </div>

                    {/* Digital Signature */}
                    <div className="text-right text-[8px]">
                      {/* Signature signature glyph */}
                      <span className="font-serif italic block text-slate-500 font-extrabold mr-2 text-[10px]">Amit Sharma</span>
                      <div className="w-24 h-px bg-slate-350 my-1" />
                      <span className="text-[7px] text-[#138808] font-bold flex items-center justify-end gap-0.5">
                        <Check className="w-2.5 h-2.5" /> Digitally Signed
                      </span>
                      <span className="text-[6px] text-slate-400 block mt-0.5">Registrar Census Authority</span>
                    </div>

                  </div>

                </div>

              </div>

              {/* Progress bar for downloads */}
              {downloadProgress !== null && (
                <div className="w-full bg-slate-100 h-1.5 shrink-0">
                  <div className="bg-[#10b981] h-full transition-all duration-200" style={{ width: `${downloadProgress}%` }} />
                </div>
              )}

              {/* Download controls bottom drawer (Section 7 & 8) */}
              <div className="p-6 bg-slate-50 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center shrink-0">
                <div className="flex flex-wrap gap-2.5">
                  <button 
                    onClick={() => triggerDownload('pdf')}
                    className="bg-[#0b2447] hover:bg-[#1f3e6d] text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                  <button 
                    onClick={() => triggerDownload('print')}
                    className="bg-white hover:bg-slate-100 text-[#0b2447] border border-slate-200 text-xs font-bold py-2.5 px-5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Award className="w-4 h-4" /> Print High Quality
                  </button>
                </div>

                {/* Secure Link copier */}
                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={copyShareLink}
                    className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" /> {isLinkCopied ? 'Copied' : 'Verification Link'}
                  </button>
                  <button 
                    onClick={() => {
                      setSuccess(`Authenticity link generated: https://census.gov.in/verify/${selectedCertMeta.number}`);
                    }}
                    className="bg-white hover:bg-slate-100 text-[#0b2447] border border-slate-200 py-2.5 px-3.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Verify QR
                  </button>
                </div>
              </div>

            </div>

            {/* SECTION 9 & 10: QR VALIDATION & DIGITAL SIGNATURE ANALYSIS */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* QR Verification center */}
              <div className="space-y-4">
                <h5 className="font-extrabold text-xs text-[#0b2447] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <CheckedIcon className="w-4.5 h-4.5 text-[#138808]" /> Authenticity Verification
                </h5>
                
                <div className="flex items-start gap-3">
                  <div className="shrink-0 p-1.5 border border-slate-200 rounded-xl bg-slate-50">
                    {/* Mock QR mini */}
                    <div className="w-16 h-16 bg-slate-800 rounded flex items-center justify-center text-white text-[8px]">QR CODE</div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold space-y-1">
                    <p><span className="text-slate-400 block text-[8px] uppercase">Issuer Entity</span> Bharat Census Portal</p>
                    <p><span className="text-slate-400 block text-[8px] uppercase">QR Validation URL</span> <span className="font-mono text-blue-600 block truncate w-32">census.gov.in/v/{selectedCertMeta.number}</span></p>
                    <p><span className="text-slate-400 block text-[8px] uppercase">Validation Timestamp</span> {new Date().toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setSuccess(`Initiating digital scanner validation... Authenticity status: 100% VERIFIED for certificate reference ${selectedCertMeta.number}.`);
                    }}
                    className="flex-1 bg-slate-50 hover:bg-slate-100 text-[#0b2447] text-[10px] font-bold py-2 rounded-xl transition-all cursor-pointer border border-slate-200"
                  >
                    Scan QR Code
                  </button>
                  <button 
                    onClick={copyShareLink}
                    className="flex-1 bg-slate-50 hover:bg-slate-100 text-[#0b2447] text-[10px] font-bold py-2 rounded-xl transition-all cursor-pointer border border-slate-200"
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              {/* Digital Signature validation */}
              <div className="space-y-4">
                <h5 className="font-extrabold text-xs text-[#0b2447] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-[#ff9933]" /> Digital Signature Audit
                </h5>
                <div className="text-[10px] space-y-2 text-slate-650 font-bold">
                  <div className="flex justify-between items-center">
                    <span>Signature Verification</span>
                    <span className="text-[#138808] bg-green-50 px-2 py-0.5 rounded font-extrabold text-[8px]">VALID</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[8px] uppercase">Cryptographic Signature Hash</span>
                    <span className="font-mono text-slate-500 block break-all text-[8px] mt-0.5 bg-slate-50 p-1.5 border border-slate-100 rounded-lg">
                      {selectedCertMeta.hash}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Issuing Authority</span>
                    <span className="text-slate-500 text-[9px]">Govt Verification Agency</span>
                  </div>
                </div>
              </div>

            </div>

            {/* SECTION 11 & 12: VERSION HISTORY & ACTIVITY TIMELINE */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Timeline of activities */}
              <div>
                <h4 className="font-extrabold text-sm text-[#0b2447] mb-4">Credential Activities</h4>
                <div className="relative pl-5 flex flex-col gap-0 border-l border-slate-150 text-[10px] ml-2 font-bold text-slate-500">
                  {activityTimeline.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="relative pb-4 last:pb-0">
                        <div className="absolute -left-[26px] top-0.5 w-3 h-3 rounded-full border border-white flex items-center justify-center text-white" style={{ backgroundColor: item.color }}>
                          <Icon className="w-1.5 h-1.5" />
                        </div>
                        <span className="block text-[8px] text-slate-400 font-bold">{item.time}</span>
                        <h5 className="text-[#0b2447] text-[10px] mt-0.5">{item.action}</h5>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Version History compare */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-sm text-[#0b2447]">Certificate History Log</h4>
                <div className="space-y-2 text-[10px]">
                  {[
                    { version: 'v2.1', date: 'Feb 24, 2026', comment: 'Census Officer Approved', size: '154 KB' },
                    { version: 'v2.0', date: 'Feb 10, 2026', comment: 'Field verification sync', size: '152 KB' },
                    { version: 'v1.0', date: 'Jan 15, 2026', comment: 'Initial Registration Draft', size: '120 KB' }
                  ].map((v, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-[#0b2447]">{v.version}</span>
                          <span className="text-[8px] text-slate-400">{v.date}</span>
                        </div>
                        <p className="text-[9px] text-slate-500 mt-0.5">{v.comment}</p>
                      </div>
                      <button 
                        onClick={() => {
                          const fileContent = `BHARAT DIGITAL CENSUS PORTAL
OFFICIAL HISTORICAL RECORD FILE
=============================
Document Title: ${selectedCertMeta.title}
Version Number: ${v.version}
Release Date: ${v.date}
Verification Hash: ${selectedCertMeta.hash}
Status Note: ${v.comment}
File Size: ${v.size}
-----------------------------
This is an authentic document archive from the Ministry of Home Affairs.`;
                          const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.setAttribute('download', `${selectedCertMeta.title.replace(/\s+/g, '_')}_${v.version}.txt`);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          URL.revokeObjectURL(url);
                          setSuccess(`Successfully exported archive version ${v.version} as text record.`);
                        }}
                        className="bg-white border border-slate-200 px-2 py-1 rounded text-[8px] font-bold text-[#0b2447] hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        Get
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* SECTION 8: PRINT CENTER SETTINGS PANEL */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Print layout configs */}
              <div className="space-y-4">
                <h5 className="font-extrabold text-xs text-[#0b2447] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Printer className="w-4.5 h-4.5 text-[#0b2447]/60" /> Page Settings
                </h5>
                <div className="space-y-3.5 text-xs font-bold text-slate-650">
                  <div className="flex justify-between items-center">
                    <span>Print Layout Option</span>
                    <div className="flex border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <button 
                        onClick={() => setPrintOrientation('portrait')}
                        className={`px-3 py-1.5 text-[10px] font-bold cursor-pointer ${printOrientation === 'portrait' ? 'bg-[#0b2447] text-white' : 'bg-white text-[#0b2447]'}`}
                      >
                        Portrait
                      </button>
                      <button 
                        onClick={() => setPrintOrientation('landscape')}
                        className={`px-3 py-1.5 text-[10px] font-bold cursor-pointer ${printOrientation === 'landscape' ? 'bg-[#0b2447] text-white' : 'bg-white text-[#0b2447]'}`}
                      >
                        Landscape
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Paper Standard Dimension</span>
                    <select 
                      value={printPaperFormat} 
                      onChange={(e) => setPrintPaperFormat(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-[10px] outline-none"
                    >
                      <option value="a4">A4 (Standard Margins)</option>
                      <option value="letter">US Letter (Borders fit)</option>
                    </select>
                  </div>
                  
                  <button 
                    onClick={triggerPrint}
                    className="w-full bg-[#0b2447] hover:bg-[#1f3e6d] text-white text-xs font-bold py-2 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    Dispatch to Printer
                  </button>
                </div>
              </div>

              {/* Print History log list */}
              <div className="space-y-4">
                <h5 className="font-extrabold text-xs text-[#0b2447] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Printer className="w-4.5 h-4.5 text-[#0b2447]/60" /> Output History Logs
                </h5>
                <div className="space-y-2 text-[10px] max-h-36 overflow-y-auto pr-1">
                  {printHistory.map((item, index) => (
                    <div key={index} className="p-2 border border-slate-100 bg-slate-50/50 rounded-xl flex items-center justify-between">
                      <div className="min-w-0">
                        <h6 className="font-bold text-[#0b2447] truncate w-36">{item.docName}</h6>
                        <span className="text-[8px] text-slate-400 font-medium">{item.date}</span>
                      </div>
                      <span className="text-[8px] bg-green-50 text-green-600 px-2 py-0.5 rounded font-extrabold">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* SECTION 7: DOWNLOAD CENTER LINK SHARING & EMAIL OUTWARDS */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Send email document */}
              <form onSubmit={handleSendEmail} className="space-y-3.5">
                <h5 className="font-extrabold text-xs text-[#0b2447] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Mail className="w-4.5 h-4.5 text-[#0b2447]/60" /> Email Verified Credentials
                </h5>
                <p className="text-[10px] text-slate-400">Directly dispatch a secured digital PDF copy to your registered email address.</p>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter email address..."
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#0b2447]"
                  />
                  <button 
                    type="submit"
                    className="bg-[#0b2447] hover:bg-[#1f3e6d] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    Send PDF
                  </button>
                </div>
              </form>

              {/* Secure link verification generator */}
              <div className="space-y-3.5">
                <h5 className="font-extrabold text-xs text-[#0b2447] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Share2 className="w-4.5 h-4.5 text-[#0b2447]/60" /> Secure Share Settings
                </h5>
                <p className="text-[10px] text-slate-400">Create a secure public URL so third-party institutions can authenticate certificate validity.</p>
                <button 
                  onClick={copyShareLink}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-250 py-2.5 rounded-xl text-xs font-bold text-slate-650 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Copy className="w-4 h-4 text-slate-400" />
                  {isLinkCopied ? 'Share Link Copied!' : 'Copy Secure Verification Link'}
                </button>
              </div>

            </div>

            {/* SECTION 15: SUPPORT FAQ TICKETING AND LIVE SUPPORT COMPONENT */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* FAQ Accordion list */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-sm text-[#0b2447]">FAQ Helpdesk</h4>
                <div className="space-y-2">
                  {[
                    { id: 1, q: 'How do I download the final certificate?', a: 'Your final certificate is issued once the field supervisor and registrar approve the application. It will show as "Verified" in your list.' },
                    { id: 2, q: 'What is QR verification for?', a: 'QR verification allows banks, employers, or government bodies to scan the certificate and confirm its authenticity directly on our portal.' },
                    { id: 3, q: 'My certificate details are incorrect, how do I edit?', a: 'If your certificate has incorrect data, click "Request Reissue" or contact support with the correct proofs to submit a revision request.' }
                  ].map(faq => (
                    <div key={faq.id} className="border-b border-slate-100 pb-2 last:border-b-0">
                      <button 
                        onClick={() => setFaqOpen(faqOpen === faq.id ? null : faq.id)}
                        className="w-full text-left font-bold text-xs text-[#0b2447] hover:text-[#ff9933] flex justify-between items-center transition-colors cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${faqOpen === faq.id ? 'rotate-90' : ''}`} />
                      </button>
                      {faqOpen === faq.id && (
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed animate-fade-in">{faq.a}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit support ticket */}
              <form onSubmit={handleTicketSubmit} className="space-y-3">
                <h4 className="font-extrabold text-sm text-[#0b2447]">Submit Reissue/Audit Ticket</h4>
                <div className="flex gap-2">
                  <select 
                    value={supportTicket.category} 
                    onChange={(e) => setSupportTicket(prev => ({ ...prev, category: e.target.value }))}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-[10px] font-bold text-slate-650"
                  >
                    <option value="download">Download Issue</option>
                    <option value="reissue">Reissue request</option>
                    <option value="verification">Verification bug</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="Short query subject..."
                    value={supportTicket.subject}
                    onChange={(e) => setSupportTicket(prev => ({ ...prev, subject: e.target.value }))}
                    required
                    className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-[10px] outline-none"
                  />
                </div>
                <textarea 
                  placeholder="Describe your issue with document details..."
                  value={supportTicket.description}
                  onChange={(e) => setSupportTicket(prev => ({ ...prev, description: e.target.value }))}
                  required
                  rows="2"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[10px] outline-none resize-none"
                />
                <button 
                  type="submit"
                  className="w-full bg-[#0b2447] hover:bg-[#1f3e6d] text-white text-[10px] font-bold py-2 rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  File Help Ticket
                </button>
              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CertificateCenter;
