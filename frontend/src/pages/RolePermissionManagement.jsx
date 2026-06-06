import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, ShieldAlert, Key, Users, UserCheck, Settings, Lock, 
  FileText, ChevronDown, Check, X, Shield, Plus, Edit2, Compass, 
  Landmark, Activity, HelpCircle, Download, FileSpreadsheet, RefreshCw, 
  BarChart2, TrendingUp, AlertTriangle, AlertCircle, Trash, Copy, 
  UserPlus, Eye, Filter, ArrowRight, Share2, Clipboard, Printer, 
  Server, Smartphone, Globe, Terminal, CheckCircle2, Sliders, Info
} from 'lucide-react';

// ==========================================
// INITIAL MOCK DATASETS
// ==========================================

const INITIAL_ROLES = [
  { id: 'R-01', name: 'Super Admin', desc: 'Highest authority. Full platform control and security administration.', users: 3, permissions: 49, level: 'Level 1 (Global)', status: 'Active', scope: 'Entire Platform' },
  { id: 'R-02', name: 'National Admin', desc: 'Manages national census progress and coordinates states. View analytics.', users: 15, permissions: 38, level: 'Level 2 (National)', status: 'Active', scope: 'All States' },
  { id: 'R-03', name: 'State Admin', desc: 'Administers census teams and districts inside assigned state.', users: 78, permissions: 28, level: 'Level 3 (State)', status: 'Active', scope: 'Assigned State' },
  { id: 'R-04', name: 'District Admin', desc: 'Coordinates field activities and local verification officers.', users: 720, permissions: 20, level: 'Level 4 (District)', status: 'Active', scope: 'Assigned District' },
  { id: 'R-05', name: 'Census Officer', desc: 'Registers citizens, updates household data, conducts surveys.', users: 18000, permissions: 12, level: 'Level 5 (Field)', status: 'Active', scope: 'Assigned Territories' },
  { id: 'R-06', name: 'Verification Officer', desc: 'Validates documents, field audits, and exception clears.', users: 5000, permissions: 15, level: 'Level 5 (Audit)', status: 'Active', scope: 'Assigned Territories' },
  { id: 'R-07', name: 'Data Analyst', desc: 'Read-only access to compiled statistics. Runs report scripts.', users: 184, permissions: 8, level: 'Level 4 (BI)', status: 'Active', scope: 'National / States Reports' }
];

const INITIAL_MATRIX = {
  'Super Admin': {
    Citizens: { view: true, create: true, edit: true, delete: true, approve: true, export: true, manage: true },
    Reports: { view: true, create: true, edit: true, delete: true, approve: true, export: true, manage: true },
    Officers: { view: true, create: true, edit: true, delete: true, approve: true, export: true, manage: true },
    Fraud: { view: true, create: true, edit: true, delete: true, approve: true, export: true, manage: true },
    Communication: { view: true, create: true, edit: true, delete: true, approve: true, export: true, manage: true },
    AuditLogs: { view: true, create: true, edit: true, delete: true, approve: true, export: true, manage: true },
    SystemSettings: { view: true, create: true, edit: true, delete: true, approve: true, export: true, manage: true }
  },
  'National Admin': {
    Citizens: { view: true, create: true, edit: true, delete: false, approve: true, export: true, manage: true },
    Reports: { view: true, create: true, edit: true, delete: false, approve: true, export: true, manage: true },
    Officers: { view: true, create: true, edit: true, delete: false, approve: false, export: true, manage: true },
    Fraud: { view: true, create: false, edit: false, delete: false, approve: true, export: true, manage: true },
    Communication: { view: true, create: true, edit: true, delete: false, approve: true, export: true, manage: true },
    AuditLogs: { view: true, create: false, edit: false, delete: false, approve: false, export: true, manage: false },
    SystemSettings: { view: true, create: false, edit: false, delete: false, approve: false, export: false, manage: false }
  },
  'State Admin': {
    Citizens: { view: true, create: true, edit: true, delete: false, approve: true, export: true, manage: false },
    Reports: { view: true, create: true, edit: false, delete: false, approve: true, export: true, manage: false },
    Officers: { view: true, create: true, edit: true, delete: false, approve: false, export: true, manage: false },
    Fraud: { view: true, create: false, edit: false, delete: false, approve: false, export: false, manage: false },
    Communication: { view: true, create: true, edit: false, delete: false, approve: false, export: true, manage: false },
    AuditLogs: { view: false, create: false, edit: false, delete: false, approve: false, export: false, manage: false },
    SystemSettings: { view: false, create: false, edit: false, delete: false, approve: false, export: false, manage: false }
  },
  'District Admin': {
    Citizens: { view: true, create: true, edit: true, delete: false, approve: false, export: true, manage: false },
    Reports: { view: true, create: true, edit: false, delete: false, approve: false, export: true, manage: false },
    Officers: { view: true, create: false, edit: true, delete: false, approve: false, export: false, manage: false },
    Fraud: { view: false, create: false, edit: false, delete: false, approve: false, export: false, manage: false },
    Communication: { view: true, create: false, edit: false, delete: false, approve: false, export: false, manage: false },
    AuditLogs: { view: false, create: false, edit: false, delete: false, approve: false, export: false, manage: false },
    SystemSettings: { view: false, create: false, edit: false, delete: false, approve: false, export: false, manage: false }
  },
  'Census Officer': {
    Citizens: { view: true, create: true, edit: true, delete: false, approve: false, export: false, manage: false },
    Reports: { view: true, create: false, edit: false, delete: false, approve: false, export: false, manage: false },
    Officers: { view: false, create: false, edit: false, delete: false, approve: false, export: false, manage: false },
    Fraud: { view: false, create: false, edit: false, delete: false, approve: false, export: false, manage: false },
    Communication: { view: false, create: false, edit: false, delete: false, approve: false, export: false, manage: false },
    AuditLogs: { view: false, create: false, edit: false, delete: false, approve: false, export: false, manage: false },
    SystemSettings: { view: false, create: false, edit: false, delete: false, approve: false, export: false, manage: false }
  },
  'Verification Officer': {
    Citizens: { view: true, create: false, edit: false, delete: false, approve: true, export: false, manage: false },
    Reports: { view: true, create: false, edit: false, delete: false, approve: false, export: false, manage: false },
    Officers: { view: false, create: false, edit: false, delete: false, approve: false, export: false, manage: false },
    Fraud: { view: true, create: false, edit: false, delete: false, approve: false, export: false, manage: false },
    Communication: { view: false, create: false, edit: false, delete: false, approve: false, export: false, manage: false },
    AuditLogs: { view: false, create: false, edit: false, delete: false, approve: false, export: false, manage: false },
    SystemSettings: { view: false, create: false, edit: false, delete: false, approve: false, export: false, manage: false }
  },
  'Data Analyst': {
    Citizens: { view: true, create: false, edit: false, delete: false, approve: false, export: true, manage: false },
    Reports: { view: true, create: true, edit: false, delete: false, approve: false, export: true, manage: false },
    Officers: { view: false, create: false, edit: false, delete: false, approve: false, export: false, manage: false },
    Fraud: { view: false, create: false, edit: false, delete: false, approve: false, export: false, manage: false },
    Communication: { view: false, create: false, edit: false, delete: false, approve: false, export: false, manage: false },
    AuditLogs: { view: false, create: false, edit: false, delete: false, approve: false, export: false, manage: false },
    SystemSettings: { view: false, create: false, edit: false, delete: false, approve: false, export: false, manage: false }
  }
};

const INITIAL_USERS = [
  { id: 'USR-201', name: 'Rahul Sharma', role: 'Verification Officer', territory: 'Delhi Ward 12', status: 'Active' },
  { id: 'USR-202', name: 'Sunita Sharma', role: 'Census Officer', territory: 'Mumbai West Zone 4', status: 'Active' },
  { id: 'USR-203', name: 'Anjali Desai', role: 'State Admin', territory: 'Maharashtra State HQ', status: 'Active' },
  { id: 'USR-204', name: 'Vikram Singh', role: 'District Admin', territory: 'Patna North Ward 2', status: 'Active' },
  { id: 'USR-205', name: 'Kunal Sen', role: 'Data Analyst', territory: 'National Analytics Wing', status: 'Active' },
  { id: 'USR-206', name: 'Mohit Pratap Mehra', role: 'Super Admin', territory: 'MHA Headquarters', status: 'Active' }
];

const INITIAL_ACCESS_REQUESTS = [
  { requestId: 'REQ-901', requester: 'Rahul Sharma', role: 'Verification Officer', requestedPermission: 'Export reports capability', reason: 'Need to compile localized Ward audit lists for District supervisor review.', status: 'Pending', date: '2026-06-06' },
  { requestId: 'REQ-902', requester: 'Vikram Singh', role: 'District Admin', requestedPermission: 'State Reports view permission', reason: 'Analyzing border migration ratios across adjacent sectors.', status: 'Approved', date: '2026-06-05' },
  { requestId: 'REQ-903', requester: 'Kunal Sen', role: 'Data Analyst', requestedPermission: 'Fraud center access', reason: 'Verifying coordinate anomalies database anomalies.', status: 'Rejected', date: '2026-06-04' }
];

const INITIAL_VIOLATIONS = [
  { id: 'VIO-801', user: 'Unknown IP (103.45.12.89)', type: 'Privilege Escalation Attempt', severity: 'Critical', details: 'Attempted command injection on system variables config.', time: '10 mins ago' },
  { id: 'VIO-802', user: 'Vikram Singh (District Admin)', type: 'Unauthorized Resource Access', severity: 'High', details: 'Tried opening Super Admin security logs directory.', time: '1 hour ago' },
  { id: 'VIO-803', user: 'Anjali Desai (State Admin)', type: 'Location Restriction Bypass', severity: 'Medium', details: 'Session detected outside registered Delhi Subnet.', time: '3 hours ago' }
];

const INITIAL_AUDITS = [
  { date: '2026-06-06 11:15 AM', action: 'Permission Assigned', details: 'Added export reports permission to State Admin.', author: 'Super Admin' },
  { date: '2026-06-05 02:40 PM', action: 'User Reassigned', details: 'Role of user Rahul Sharma updated to Verification Officer.', author: 'National Admin' },
  { date: '2026-06-04 09:30 AM', action: 'Access Policy Update', details: 'Enforced MFA requirement policy system-wide.', author: 'Super Admin' },
  { date: '2026-06-03 04:20 PM', action: 'Role Created', details: 'New custom role "Regional Auditor" added.', author: 'Super Admin' }
];

const MODULE_OPTIONS = ['Citizens', 'Reports', 'Officers', 'Fraud', 'Communication', 'AuditLogs', 'SystemSettings'];
const ACTION_OPTIONS = ['view', 'create', 'edit', 'delete', 'approve', 'export', 'manage'];

const RolePermissionManagement = () => {
  const navigate = useNavigate();

  // -------------------------------------------------------------
  // STATE DEFINITIONS
  // -------------------------------------------------------------
  const [rolesList, setRolesList] = useState(INITIAL_ROLES);
  const [permissionMatrix, setPermissionMatrix] = useState(INITIAL_MATRIX);
  const [usersList, setUsersList] = useState(INITIAL_USERS);
  const [accessRequests, setAccessRequests] = useState(INITIAL_ACCESS_REQUESTS);
  const [violationAlerts, setViolationAlerts] = useState(INITIAL_VIOLATIONS);
  const [auditTimeline, setAuditTimeline] = useState(INITIAL_AUDITS);

  // Focus Role Details & Hierarchy selector
  const [selectedRoleName, setSelectedRoleName] = useState('Super Admin');

  // Multi-step Wizard state (Create Role)
  const [wizardStep, setWizardStep] = useState(1);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleScope, setNewRoleScope] = useState('Global');
  const [newRoleParent, setNewRoleParent] = useState('Super Admin');
  const [newRolePermissions, setNewRolePermissions] = useState({
    Citizens: { view: true, create: false, edit: false, delete: false, approve: false, export: false, manage: false },
    Reports: { view: true, create: false, edit: false, delete: false, approve: false, export: false, manage: false }
  });
  const [showCreateWizard, setShowCreateWizard] = useState(false);

  // User-Role assignment state
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [selectedAssignUser, setSelectedAssignUser] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [modalNewRole, setModalNewRole] = useState('Census Officer');

  // Security configuration parameters
  const [minPasswordLength, setMinPasswordLength] = useState(12);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [isMfaRequired, setIsMfaRequired] = useState(true);
  const [ipRestrictions, setIpRestrictions] = useState('192.168.1.0/24, 10.0.0.0/8');

  // Comparison Center selectors
  const [compareRoleA, setCompareRoleA] = useState('State Admin');
  const [compareRoleB, setCompareRoleB] = useState('District Admin');

  // Report center selector
  const [activeReportSelection, setActiveReportSelection] = useState('Role Report');
  const [isCompilingReport, setIsCompilingReport] = useState(false);

  // Restriction Rules settings
  const [selectedRestrictedResource, setSelectedRestrictedResource] = useState('Fraud Detection Center');
  const [conditionalAccessEnabled, setConditionalAccessEnabled] = useState(true);

  // Toast feedback
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => setToast({ type: '', message: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // -------------------------------------------------------------
  // HANDLERS & OPERATIONS
  // -------------------------------------------------------------

  // Toggle single permission checkbox in the matrix
  const handleMatrixCheckboxChange = (role, module, action) => {
    setPermissionMatrix(prev => {
      const updatedRole = { ...prev[role] };
      const updatedModule = { ...updatedRole[module] };
      updatedModule[action] = !updatedModule[action];
      updatedRole[module] = updatedModule;
      
      setToast({ 
        type: 'success', 
        message: `Updated "${action.toUpperCase()}" permission for module "${module}" in role "${role}".` 
      });

      // Append log
      const log = {
        date: new Date().toLocaleString(),
        action: 'Permission Modified',
        details: `Toggled ${action.toUpperCase()} for ${module} in ${role}.`,
        author: 'Super Admin'
      };
      setAuditTimeline(prevLogs => [log, ...prevLogs]);

      return {
        ...prev,
        [role]: updatedRole
      };
    });
  };

  // Bulk check or uncheck all permissions for a specific role
  const handleBulkToggleRole = (role, state) => {
    setPermissionMatrix(prev => {
      const updatedRole = { ...prev[role] };
      MODULE_OPTIONS.forEach(mod => {
        const updatedModule = { ...updatedRole[mod] };
        ACTION_OPTIONS.forEach(act => {
          updatedModule[act] = state;
        });
        updatedRole[mod] = updatedModule;
      });

      setToast({ 
        type: 'warning', 
        message: `Bulk ${state ? 'enabled' : 'disabled'} all permissions for role "${role}".` 
      });

      return {
        ...prev,
        [role]: updatedRole
      };
    });
  };

  // Create Role Wizard submission
  const handleCreateRoleSubmit = (e) => {
    e.preventDefault();
    if (!newRoleName) {
      setToast({ type: 'error', message: 'Please enter a valid role name.' });
      return;
    }

    // Append to Directory list
    const newRoleObj = {
      id: `R-0${rolesList.length + 1}`,
      name: newRoleName,
      desc: newRoleDesc || 'Custom admin role.',
      users: 0,
      permissions: 10,
      level: `Level 5 (${newRoleScope})`,
      status: 'Active',
      scope: newRoleScope
    };

    setRolesList([...rolesList, newRoleObj]);

    // Initial permissions in matrix for this new role
    const fullRoleMatrix = {};
    MODULE_OPTIONS.forEach(mod => {
      fullRoleMatrix[mod] = {
        view: true, create: false, edit: false, delete: false, approve: false, export: false, manage: false
      };
    });

    setPermissionMatrix(prev => ({
      ...prev,
      [newRoleName]: fullRoleMatrix
    }));

    // Log the event
    const log = {
      date: new Date().toLocaleString(),
      action: 'Role Created',
      details: `Created new custom role "${newRoleName}" inheriting from "${newRoleParent}".`,
      author: 'Super Admin'
    };
    setAuditTimeline(prev => [log, ...prev]);

    setToast({ type: 'success', message: `Role "${newRoleName}" created and added to directory successfully.` });
    setShowCreateWizard(false);
    setSelectedRoleName(newRoleName);
    
    // Reset wizard fields
    setWizardStep(1);
    setNewRoleName('');
    setNewRoleDesc('');
  };

  // User Role reassignment modal controls
  const handleUserRoleChangeSubmit = (e) => {
    e.preventDefault();
    if (!selectedAssignUser) return;

    const updated = usersList.map(user => {
      if (user.id === selectedAssignUser.id) {
        return { ...user, role: modalNewRole };
      }
      return user;
    });

    setUsersList(updated);

    // Increment user count on roles directory
    setRolesList(prev => prev.map(r => {
      if (r.name === modalNewRole) return { ...r, users: r.users + 1 };
      if (r.name === selectedAssignUser.role) return { ...r, users: Math.max(0, r.users - 1) };
      return r;
    }));

    // Log the event
    const log = {
      date: new Date().toLocaleString(),
      action: 'User Role Reassigned',
      details: `Updated role of ${selectedAssignUser.name} from "${selectedAssignUser.role}" to "${modalNewRole}".`,
      author: 'Super Admin'
    };
    setAuditTimeline(prev => [log, ...prev]);

    setToast({ 
      type: 'success', 
      message: `Successfully reassigned user "${selectedAssignUser.name}" to role "${modalNewRole}".` 
    });
    setShowAssignModal(false);
    setSelectedAssignUser(null);
  };

  // Remove role from user
  const handleRemoveUserRole = (userId) => {
    const user = usersList.find(u => u.id === userId);
    if (!user) return;

    setUsersList(prev => prev.map(u => {
      if (u.id === userId) return { ...u, role: 'Unassigned', status: 'Suspended' };
      return u;
    }));

    setRolesList(prev => prev.map(r => {
      if (r.name === user.role) return { ...r, users: Math.max(0, r.users - 1) };
      return r;
    }));

    // Log event
    const log = {
      date: new Date().toLocaleString(),
      action: 'Access Revoked',
      details: `Revoked security clearances and roles for ${user.name}.`,
      author: 'Super Admin'
    };
    setAuditTimeline(prev => [log, ...prev]);

    setToast({ type: 'warning', message: `Revoked clearances for user "${user.name}". Access status set to Suspended.` });
  };

  // Approve / Reject Access Requests
  const handleResolveAccessRequest = (reqId, decision) => {
    const req = accessRequests.find(r => r.requestId === reqId);
    if (!req) return;

    setAccessRequests(prev => prev.map(r => {
      if (r.requestId === reqId) return { ...r, status: decision, approver: 'Super Admin' };
      return r;
    }));

    // If approved, dynamically update permission matrix or add a log
    if (decision === 'Approved') {
      // Simulate assigning the permission - e.g. adding report export permission to Verification Officer
      setPermissionMatrix(prev => {
        if (prev[req.role]) {
          const mod = prev[req.role];
          const updatedMod = { ...mod.Reports, export: true };
          return {
            ...prev,
            [req.role]: { ...mod, Reports: updatedMod }
          };
        }
        return prev;
      });
    }

    // Log event
    const log = {
      date: new Date().toLocaleString(),
      action: `Request ${decision}`,
      details: `IAM request ${reqId} for ${req.requestedPermission} by ${req.requester} was ${decision.toLowerCase()}.`,
      author: 'Super Admin'
    };
    setAuditTimeline(prev => [log, ...prev]);

    setToast({ 
      type: decision === 'Approved' ? 'success' : 'warning', 
      message: `Access Request ${reqId} was ${decision.toLowerCase()}.` 
    });
  };

  // Export access reports compiler simulation
  const handleCompileAccessReport = (reportName) => {
    setIsCompilingReport(true);
    setTimeout(() => {
      setIsCompilingReport(false);
      setToast({ 
        type: 'success', 
        message: `Export Successful! Access report "${reportName}" downloaded (PDF format).` 
      });
    }, 2000);
  };

  // -------------------------------------------------------------
  // FILTERING LOGICS
  // -------------------------------------------------------------
  const filteredUsers = usersList.filter(user => {
    return user.name.toLowerCase().includes(searchUserQuery.toLowerCase()) || 
           user.role.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
           user.id.toLowerCase().includes(searchUserQuery.toLowerCase());
  });

  // Role comparison differences calculator
  const getComparisonDiffCount = () => {
    const matrixA = permissionMatrix[compareRoleA];
    const matrixB = permissionMatrix[compareRoleB];
    if (!matrixA || !matrixB) return 0;

    let diffs = 0;
    MODULE_OPTIONS.forEach(mod => {
      ACTION_OPTIONS.forEach(act => {
        if (matrixA[mod]?.[act] !== matrixB[mod]?.[act]) {
          diffs++;
        }
      });
    });
    return diffs;
  };

  return (
    <div className="flex-grow w-full max-w-containerMax mx-auto px-6 py-8 flex flex-col gap-8 text-onSurface bg-background">
      
      {/* CSS Dark Mode Overrides */}
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
      {toast.message && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-lg shadow-xl flex items-center gap-3 border text-xs max-w-sm animate-fade-in ${
          toast.type === 'success' ? 'bg-green-50 text-green-800 border-green-200 dark:bg-green-950/80 dark:text-green-300 dark:border-green-800' :
          toast.type === 'warning' ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800' :
          'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800'
        }`}>
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0 text-success" />}
          {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* SECTION 1: PAGE HEADER */}
      <section className="relative overflow-hidden rounded-xl border border-outlineVariant/50 bg-primary p-6 text-white shadow-ambient flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#ff9933]/20 border border-[#ff9933]/30 text-[#ff9933] font-bold uppercase text-[9px] px-2.5 py-0.5 rounded-full tracking-wider animate-pulse">
              Identity & Access Management (IAM)
            </span>
            <span className="text-[10px] text-white/70 font-semibold">â€¢ Ministry of Home Affairs</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-7 h-7" /> Role & Permission Management
          </h2>
          <p className="text-xs text-white/80 max-w-xl leading-relaxed">
            Manage administrative user roles, customize hierarchical permission matrices, audit access policies, and enforce security controls across the census ecosystem.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          <button 
            onClick={() => setShowCreateWizard(true)}
            className="bg-secondary text-primary-dark font-bold text-xs px-4 py-2.5 rounded-full hover:bg-secondary/90 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Create Custom Role
          </button>
          <button 
            onClick={() => { window.scrollTo({ top: 900, behavior: 'smooth' }); }}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" /> Assign Permissions Matrix
          </button>
          <button 
            onClick={() => { window.scrollTo({ top: 1800, behavior: 'smooth' }); }}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" /> Manage Access Policies
          </button>
          <button 
            onClick={() => handleCompileAccessReport(activeReportSelection)}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export Access Report
          </button>
        </div>
      </section>

      {/* SECTION 2: ACCESS CONTROL OVERVIEW */}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Roles', count: rolesList.length, desc: 'Configured role profiles', icon: Shield, color: 'text-primary' },
          { label: 'Active Users', count: '25,000', desc: 'Registered personnel sessions', icon: Users, color: 'text-primary' },
          { label: 'Permission Groups', count: '85', desc: 'Security access layers', icon: Key, color: 'text-success' },
          { label: 'Restricted Resources', count: '320 Units', desc: 'Data subnets isolated', icon: Lock, color: 'text-amber-500' },
          { label: 'Access Requests', count: accessRequests.filter(r => r.status === 'Pending').length, desc: 'Pending approvals', icon: HelpCircle, color: 'text-primary' },
          { label: 'Security Violations', count: violationAlerts.length, desc: 'Investigate access flags', icon: ShieldAlert, color: 'text-red-500 animate-pulse' }
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-surface p-4 rounded-xl border border-outlineVariant/50 shadow-sm flex flex-col gap-1.5 hover:border-primary/50 transition-colors">
              <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-wider">{stat.label}</span>
              <div className="text-lg font-bold text-primary flex items-end justify-between">
                <span>{stat.count}</span>
                <Icon className="w-4 h-4 opacity-80" />
              </div>
              <p className="text-[9px] text-onSurfaceVariant">{stat.desc}</p>
            </div>
          );
        })}
      </section>

      {/* DYNAMIC TWO-COLUMN ACCESS CONTROL CONTROL PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ROLE DIRECTORY, HIERARCHY, PERMISSION MATRIX (7 COLS) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* SECTION 3: ROLE DIRECTORY */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-outlineVariant/15 pb-2.5">
              <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-primary" /> System Roles Directory
              </h3>
              <span className="text-[9px] text-onSurfaceVariant font-bold">Select role below to audit details & permissions</span>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outlineVariant/30 text-onSurfaceVariant font-bold">
                    <th className="py-2 px-2">Role Name</th>
                    <th className="py-2 px-2">Access level</th>
                    <th className="py-2 px-2">Scope</th>
                    <th className="py-2 px-2">Users</th>
                    <th className="py-2 px-2">Permissions</th>
                    <th className="py-2 px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outlineVariant/15">
                  {rolesList.map(role => (
                    <tr 
                      key={role.id} 
                      onClick={() => setSelectedRoleName(role.name)}
                      className={`hover:bg-surface-low/65 transition-colors cursor-pointer ${
                        selectedRoleName === role.name ? 'bg-primary/5 font-semibold text-primary' : ''
                      }`}
                    >
                      <td className="py-3 px-2 font-bold flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          selectedRoleName === role.name ? 'bg-primary animate-pulse' : 'bg-transparent'
                        }`} />
                        {role.name}
                      </td>
                      <td className="py-3 px-2 text-onSurfaceVariant font-semibold">{role.level}</td>
                      <td className="py-3 px-2 text-onSurfaceVariant">{role.scope}</td>
                      <td className="py-3 px-2 text-onSurfaceVariant font-mono">{role.users.toLocaleString()}</td>
                      <td className="py-3 px-2 text-primary font-bold font-mono">{role.permissions}</td>
                      <td className="py-3 px-2 text-right">
                        <span className="bg-green-100 dark:bg-green-950/80 text-green-700 dark:text-green-300 font-extrabold text-[8px] uppercase px-1.5 py-0.5 rounded">
                          {role.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 4: ROLE HIERARCHY STRUCTURE */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-primary" /> Access Level hierarchy Structure & Inheritance
            </h3>
            
            <p className="text-[10px] text-onSurfaceVariant leading-relaxed">
              Permissions cascade downwards in the structure. Super Administrators inherit all controls of child entities, while lower nodes carry localized functional restrictions.
            </p>

            <div className="flex flex-col items-center gap-1.5 bg-surface-low p-4 rounded-xl border border-outlineVariant/20 mt-2">
              <div className="bg-primary text-white font-bold text-[10px] px-3.5 py-1 rounded-full border border-white/20 shadow-sm flex items-center gap-1">
                <Globe className="w-3 h-3 text-secondary animate-spin" /> India Census System
              </div>
              <div className="text-outlineVariant/60 text-xs">â†“</div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 w-full text-center text-[9px] font-bold">
                {[
                  { name: 'Super Admin', color: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300' },
                  { name: 'National Admin', color: 'border-primary/30 bg-primary/10 text-primary' },
                  { name: 'State Admin', color: 'border-success/30 bg-success/10 text-success' },
                  { name: 'District Admin', color: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300' }
                ].map(node => (
                  <div 
                    key={node.name}
                    onClick={() => setSelectedRoleName(node.name)}
                    className={`p-2 border rounded-lg cursor-pointer hover:scale-105 transition-all ${node.color} ${
                      selectedRoleName === node.name ? 'ring-2 ring-primary border-primary' : ''
                    }`}
                  >
                    {node.name}
                  </div>
                ))}
              </div>

              <div className="text-outlineVariant/60 text-xs">â†“</div>

              <div className="grid grid-cols-3 gap-2.5 w-full text-center text-[9px] font-bold">
                {[
                  { name: 'Census Officer', color: 'border-outline/30 bg-surface-highest text-onSurface' },
                  { name: 'Verification Officer', color: 'border-outline/30 bg-surface-highest text-onSurface' },
                  { name: 'Data Analyst', color: 'border-outline/30 bg-surface-highest text-onSurface' }
                ].map(node => (
                  <div 
                    key={node.name}
                    onClick={() => setSelectedRoleName(node.name)}
                    className={`p-2 border rounded-lg cursor-pointer hover:scale-105 transition-all ${node.color} ${
                      selectedRoleName === node.name ? 'ring-2 ring-primary border-primary' : ''
                    }`}
                  >
                    {node.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 13: ASSIGN PERMISSIONS MATRIX */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outlineVariant/15 pb-3">
              <div>
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-primary" /> Core Permissions matrix mapping
                </h3>
                <span className="text-[9px] text-onSurfaceVariant block mt-0.5">Editing Matrix values updates system authorization protocols.</span>
              </div>
              <div className="flex gap-2 text-[10px]">
                <button 
                  onClick={() => handleBulkToggleRole(selectedRoleName, true)}
                  className="bg-primary text-white font-bold px-2.5 py-1 rounded cursor-pointer"
                >
                  Grant All
                </button>
                <button 
                  onClick={() => handleBulkToggleRole(selectedRoleName, false)}
                  className="border border-outlineVariant text-onSurface font-bold px-2.5 py-1 rounded cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="overflow-x-auto text-[10px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outlineVariant/30 text-onSurfaceVariant font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-2">Platform Module</th>
                    {ACTION_OPTIONS.map(action => (
                      <th key={action} className="py-2.5 px-2 text-center capitalize">{action}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outlineVariant/15">
                  {MODULE_OPTIONS.map(module => {
                    const rowPermissions = permissionMatrix[selectedRoleName]?.[module] || {};
                    return (
                      <tr key={module} className="hover:bg-surface-low/50 transition-colors">
                        <td className="py-3 px-2 font-bold text-primary">{module}</td>
                        {ACTION_OPTIONS.map(action => {
                          const isChecked = !!rowPermissions[action];
                          return (
                            <td key={action} className="py-3 px-2 text-center">
                              <input 
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleMatrixCheckboxChange(selectedRoleName, module, action)}
                                className="w-3.5 h-3.5 accent-primary cursor-pointer"
                              />
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 15: USER ROLE ASSIGNMENT TABLE */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outlineVariant/15 pb-2">
              <div>
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-primary" /> Staff & Officer Access Assignment
                </h3>
                <span className="text-[9px] text-onSurfaceVariant block">Bind active personnel profiles to platform clearance levels.</span>
              </div>
              <div className="w-48 shrink-0">
                <input 
                  type="text" 
                  value={searchUserQuery}
                  onChange={e => setSearchUserQuery(e.target.value)}
                  placeholder="Search staff ID or name..."
                  className="w-full px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface"
                />
              </div>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outlineVariant/30 text-onSurfaceVariant font-bold">
                    <th className="py-2 px-2">User details</th>
                    <th className="py-2 px-2">Clearance Role</th>
                    <th className="py-2 px-2">Territory Scope</th>
                    <th className="py-2 px-2">Status</th>
                    <th className="py-2 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outlineVariant/15">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-surface-low/50 transition-colors">
                      <td className="py-3 px-2">
                        <strong className="text-primary block">{user.name}</strong>
                        <span className="text-[10px] text-onSurfaceVariant font-mono">{user.id}</span>
                      </td>
                      <td className="py-3 px-2 font-semibold text-primary">{user.role}</td>
                      <td className="py-3 px-2 text-onSurfaceVariant">{user.territory}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                          user.status === 'Active' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right space-x-2">
                        <button 
                          onClick={() => { setSelectedAssignUser(user); setModalNewRole(user.role); setShowAssignModal(true); }}
                          className="bg-primary hover:bg-primary-light text-white font-bold text-[9px] px-2.5 py-1 rounded cursor-pointer"
                        >
                          Change Role
                        </button>
                        <button 
                          onClick={() => handleRemoveUserRole(user.id)}
                          className="border border-outlineVariant hover:bg-red-500/10 text-red-600 font-bold text-[9px] px-2.5 py-1 rounded cursor-pointer"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: DETAIL CARDS, COMPARISON, ALERTS, POLICIES (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* SECTIONS 5 - 11: DYNAMIC ROLE DETAILS DRAWER */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-4 h-4 text-primary" /> Dynamic Role Profile Inspector
            </h3>

            {rolesList.filter(r => r.name === selectedRoleName).map(role => {
              return (
                <div key={role.id} className="space-y-4 text-xs">
                  <div className="flex justify-between items-center bg-surface-low border border-outlineVariant/15 p-3 rounded-lg">
                    <div>
                      <strong className="text-sm font-bold text-primary block">{role.name}</strong>
                      <span className="text-[10px] text-onSurfaceVariant font-mono font-semibold">{role.level}</span>
                    </div>
                    <span className="bg-[#ff9933]/15 text-[#ff9933] border border-[#ff9933]/20 font-bold px-2 py-0.5 rounded text-[8px] uppercase tracking-wider">
                      {role.scope}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-primary text-[9px] uppercase">Functional Description</span>
                    <p className="text-[11px] text-onSurfaceVariant leading-normal font-medium">{role.desc}</p>
                  </div>

                  {/* CUSTOM SCOPE VISUALIZERS (SECTIONS 5 - 11 SPECIFICS) */}
                  {role.name === 'Super Admin' && (
                    <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg space-y-1">
                      <strong className="text-red-700 dark:text-red-300 text-[10px] uppercase font-bold flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" /> Platinum Platform Owner Clearance
                      </strong>
                      <p className="text-[9px] text-onSurfaceVariant">
                        Authorized to modify global database instances, enforce disaster recovery schedules, download raw compliance databases, and authorize state rollbacks.
                      </p>
                    </div>
                  )}

                  {role.name === 'National Admin' && (
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg space-y-2">
                      <strong className="text-primary text-[10px] uppercase font-bold flex items-center gap-1">
                        <Landmark className="w-3.5 h-3.5" /> India National Operations Map Indicator
                      </strong>
                      <div className="flex items-center gap-4">
                        {/* Mock SVG India Map */}
                        <svg viewBox="0 0 100 100" className="w-10 h-10 shrink-0">
                          <path d="M 50 10 L 65 30 L 80 40 L 70 65 L 55 90 L 40 85 L 20 60 L 35 30 Z" fill="#ff9933" opacity="0.8" />
                          <circle cx="50" cy="50" r="4" fill="#ffffff" stroke="#138808" strokeWidth="1" />
                        </svg>
                        <p className="text-[9px] text-onSurfaceVariant">
                          National boundary authorization: Encompasses all 28 states and 8 Union Territories. Restricted from changing Super Admin configs.
                        </p>
                      </div>
                    </div>
                  )}

                  {role.name === 'State Admin' && (
                    <div className="p-3 bg-green-500/5 border border-green-500/20 rounded-lg space-y-1">
                      <strong className="text-green-700 dark:text-green-300 text-[10px] uppercase font-bold flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5" /> Zonal Territory Restrictions
                      </strong>
                      <p className="text-[9px] text-onSurfaceVariant">
                        Access Scope limits all operations to: <strong className="text-primary font-bold">Delhi State NCT</strong>. Attempts to load other state records trigger instant security logs.
                      </p>
                    </div>
                  )}

                  {role.name === 'District Admin' && (
                    <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg space-y-1">
                      <strong className="text-amber-700 dark:text-amber-300 text-[10px] uppercase font-bold flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5" /> Regional Bounds
                      </strong>
                      <p className="text-[9px] text-onSurfaceVariant">
                        District boundary authorization: <strong className="text-primary">Dwarka sub-district 4</strong>. Assigns surveyors, monitors local verifications, and generates district census files.
                      </p>
                    </div>
                  )}

                  {role.name === 'Census Officer' && (
                    <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg space-y-1">
                      <strong className="text-primary text-[10px] uppercase font-bold flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5" /> Field Survey clearance
                      </strong>
                      <p className="text-[9px] text-onSurfaceVariant">
                        Permissions limited to: citizen profile registration, household verification forms, and photo uploads. Read/Write local records only.
                      </p>
                    </div>
                  )}

                  {role.name === 'Verification Officer' && (
                    <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg space-y-1">
                      <strong className="text-primary text-[10px] uppercase font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verification Workflow Clearance
                      </strong>
                      <p className="text-[9px] text-onSurfaceVariant">
                        Permissions limited to: Aadhaar validation, OCR corrections, biometric verification matches, and audit sign-off.
                      </p>
                    </div>
                  )}

                  {role.name === 'Data Analyst' && (
                    <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg space-y-1">
                      <strong className="text-primary text-[10px] uppercase font-bold flex items-center gap-1">
                        <BarChart2 className="w-3.5 h-3.5" /> Read-Only Analytics Bounds
                      </strong>
                      <p className="text-[9px] text-onSurfaceVariant">
                        Access profile: Read-only. Runs Python aggregation reports, compiles dashboards. Blocked from modifying citizen data.
                      </p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="font-bold text-primary text-[9px] uppercase">Direct Permissions Overview</span>
                    <div className="flex flex-wrap gap-1 bg-surface-low p-2.5 rounded border border-outlineVariant/10">
                      {MODULE_OPTIONS.map(mod => {
                        const actObj = permissionMatrix[role.name]?.[mod] || {};
                        const grantedActions = Object.keys(actObj).filter(a => actObj[a]);
                        if (grantedActions.length === 0) return null;
                        return (
                          <div key={mod} className="bg-surface px-2 py-0.5 rounded border border-outlineVariant/15 text-[8px] font-semibold text-onSurfaceVariant">
                            <strong>{mod}</strong>: {grantedActions.join(', ')}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* SECTION 17: ROLE COMPARISON CENTER */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-primary" /> IAM Role Comparison Center
            </h3>

            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-primary uppercase text-[8px]">Compare Role A</label>
                <select 
                  value={compareRoleA}
                  onChange={e => setCompareRoleA(e.target.value)}
                  className="px-2 py-1 bg-surface border border-outlineVariant rounded outline-none text-[11px] focus:border-primary text-onSurface"
                >
                  {rolesList.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-primary uppercase text-[8px]">Compare Role B</label>
                <select 
                  value={compareRoleB}
                  onChange={e => setCompareRoleB(e.target.value)}
                  className="px-2 py-1 bg-surface border border-outlineVariant rounded outline-none text-[11px] focus:border-primary text-onSurface"
                >
                  {rolesList.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                </select>
              </div>
            </div>

            <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg text-[10px] space-y-1.5 text-onSurfaceVariant">
              <div className="flex justify-between font-bold">
                <span>Calculated Differences:</span>
                <span className="text-amber-600 font-mono">{getComparisonDiffCount()} parameters mismatch</span>
              </div>
              <div className="divide-y divide-outlineVariant/10 text-[9px] max-h-40 overflow-y-auto pr-1">
                {MODULE_OPTIONS.map(mod => {
                  return ACTION_OPTIONS.map(act => {
                    const valA = !!permissionMatrix[compareRoleA]?.[mod]?.[act];
                    const valB = !!permissionMatrix[compareRoleB]?.[mod]?.[act];
                    if (valA === valB) return null;
                    return (
                      <div key={`${mod}-${act}`} className="py-1.5 flex justify-between gap-4 font-mono">
                        <span>{mod}.{act}</span>
                        <div className="flex items-center gap-2">
                          <span className={`px-1 rounded ${valA ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                            {compareRoleA}: {valA ? 'Yes' : 'No'}
                          </span>
                          <span>vs</span>
                          <span className={`px-1 rounded ${valB ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                            {compareRoleB}: {valB ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    );
                  });
                })}
              </div>
            </div>
          </div>

          {/* SECTION 18: ACCESS REQUEST WORKFLOW */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-primary" /> Active Permissions Request Workflows
            </h3>

            <div className="space-y-3.5 text-xs">
              {accessRequests.map(req => (
                <div key={req.requestId} className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <strong className="text-primary font-bold">{req.requester}</strong>
                      <span className="text-[10px] text-onSurfaceVariant block">{req.role}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                      req.status === 'Pending' ? 'bg-amber-500 text-white animate-pulse' :
                      req.status === 'Approved' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <div className="text-[10px] text-onSurfaceVariant bg-surface p-2 rounded border border-outlineVariant/10 font-mono">
                    <div>Requested: <strong className="text-primary">"{req.requestedPermission}"</strong></div>
                    <div className="mt-1">Reason: <em>"{req.reason}"</em></div>
                  </div>

                  {req.status === 'Pending' && (
                    <div className="flex justify-end gap-2 pt-1 border-t border-outlineVariant/10">
                      <button 
                        onClick={() => handleResolveAccessRequest(req.requestId, 'Rejected')}
                        className="border border-outlineVariant hover:bg-red-500/10 text-red-600 font-bold text-[9px] px-2.5 py-1 rounded cursor-pointer"
                      >
                        Reject Request
                      </button>
                      <button 
                        onClick={() => handleResolveAccessRequest(req.requestId, 'Approved')}
                        className="bg-primary hover:bg-primary-light text-white font-bold text-[9px] px-2.5 py-1 rounded cursor-pointer"
                      >
                        Approve Request
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 19: SECURITY & COMPLIANCE MONITORING ALARMS */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" /> Security Violations Compliance Alarm
            </h3>

            <div className="space-y-3.5 text-xs">
              {violationAlerts.map(alert => (
                <div key={alert.id} className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <strong className="text-red-700 dark:text-red-300 font-bold">{alert.type}</strong>
                    <span className="bg-red-600 text-white font-extrabold px-1.5 py-0.5 rounded text-[8px] uppercase">
                      {alert.severity} Risk
                    </span>
                  </div>
                  <p className="text-[10px] text-onSurfaceVariant leading-normal">{alert.details}</p>
                  <div className="flex justify-between text-[8px] font-bold text-onSurfaceVariant mt-1">
                    <span>Identity: <strong className="text-primary">{alert.user}</strong></span>
                    <span>{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 14: RESTRICT ACCESS CONTROL POLICY */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-primary" /> Resource Specific Restriction Policies
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase text-[8px]">Select Target Core Module</label>
                <select 
                  value={selectedRestrictedResource} 
                  onChange={e => setSelectedRestrictedResource(e.target.value)}
                  className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface"
                >
                  <option value="Fraud Detection Center">Fraud Detection Center</option>
                  <option value="Audit Logs Database">Audit Logs Database</option>
                  <option value="System Configurations Subnet">System Configurations Subnet</option>
                  <option value="Zonal Territory Borders Setup">Zonal Territory Borders Setup</option>
                </select>
              </div>

              <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg space-y-2 text-[10px] text-onSurfaceVariant">
                <div className="flex justify-between items-center">
                  <span>Conditional Access Control Policy:</span>
                  <button 
                    onClick={() => {
                      setConditionalAccessEnabled(!conditionalAccessEnabled);
                      setToast({ type: 'warning', message: `Conditional access policy toggled for ${selectedRestrictedResource}.` });
                    }}
                    className={`font-bold px-2 py-0.5 rounded text-[8px] uppercase ${
                      conditionalAccessEnabled ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}
                  >
                    {conditionalAccessEnabled ? 'Enforced' : 'Disabled'}
                  </button>
                </div>
                <div className="space-y-1 font-mono text-[9px]">
                  <div>Allowed: <strong className="text-green-600">Super Admin, National Admin</strong></div>
                  <div>Denied: <strong className="text-red-600">Census Officer, Verification Officer, Data Analyst</strong></div>
                  <div>MFA Requirement: <strong className="text-primary">Enforced</strong></div>
                  <div>Location restriction: <strong className="text-primary">National Gateway Subnet Only</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 16: GLOBAL ACCESS POLICY CONFIGURATIONS */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-primary" /> IAM System-Wide Access Policies
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between font-bold text-[9px] text-onSurfaceVariant uppercase">
                  <span>Minimum Password Length</span>
                  <span className="text-primary font-bold">{minPasswordLength} chars</span>
                </div>
                <input 
                  type="number"
                  min="8"
                  max="32"
                  value={minPasswordLength}
                  onChange={e => {
                    setMinPasswordLength(Number(e.target.value));
                    setToast({ type: 'success', message: `Password length policy updated to ${e.target.value} characters.` });
                  }}
                  className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between font-bold text-[9px] text-onSurfaceVariant uppercase">
                  <span>Session Idle Timeout Duration</span>
                  <span className="text-primary font-bold">{sessionTimeout} Minutes</span>
                </div>
                <input 
                  type="range"
                  min="5"
                  max="120"
                  value={sessionTimeout}
                  onChange={e => {
                    setSessionTimeout(Number(e.target.value));
                    setToast({ type: 'warning', message: `Session idle timeout limit modified to ${e.target.value} minutes.` });
                  }}
                  className="w-full accent-primary bg-outlineVariant/30 rounded-lg cursor-pointer h-1.5"
                />
              </div>

              <div className="flex justify-between items-center p-3 bg-surface-low border border-outlineVariant/20 rounded-lg text-[10px]">
                <div className="flex flex-col">
                  <strong className="text-primary">Enforce Multi-Factor Authentication (MFA)</strong>
                  <span className="text-onSurfaceVariant text-[9px]">Require biometric or OTP token upon officer login.</span>
                </div>
                <input 
                  type="checkbox"
                  checked={isMfaRequired}
                  onChange={e => {
                    setIsMfaRequired(e.target.checked);
                    setToast({ type: 'warning', message: `MFA enforcement state updated to: ${e.target.checked ? 'ENABLED' : 'DISABLED'}.` });
                  }}
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-primary uppercase text-[8px]">Restricted IP Subnets (Whitelist)</label>
                <input 
                  type="text" 
                  value={ipRestrictions}
                  onChange={e => setIpRestrictions(e.target.value)}
                  className="px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none font-mono text-xs focus:border-primary text-onSurface"
                />
              </div>
            </div>
          </div>

          {/* SECTION 21: ROLE DISTRIBUTION ANALYTICS (SVG) */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Access Analytics Observatory</h3>
            
            <div className="flex flex-col items-center gap-2">
              <span className="text-[8px] font-bold text-primary uppercase">Staff Volume Distribution by Security Clearance</span>
              {/* Custom SVG chart mapping role distributions */}
              <svg viewBox="0 0 160 80" className="w-full h-20">
                <rect x="10" y="70" width="15" height="5" fill="#e06666" />
                <text x="10" y="65" fontSize="6" fill="#e06666" fontWeight="bold">SAdmin</text>
                
                <rect x="35" y="60" width="15" height="15" fill="#3c78d8" />
                <text x="35" y="55" fontSize="6" fill="#3c78d8" fontWeight="bold">NAdmin</text>
                
                <rect x="60" y="50" width="15" height="25" fill="#6aa84f" />
                <text x="60" y="45" fontSize="6" fill="#6aa84f" fontWeight="bold">SAdmin</text>

                <rect x="85" y="35" width="15" height="40" fill="#f1c232" />
                <text x="85" y="30" fontSize="6" fill="#f1c232" fontWeight="bold">DAdmin</text>

                <rect x="110" y="10" width="15" height="65" fill="#783f04" />
                <text x="110" y="5" fontSize="6" fill="#783f04" fontWeight="bold">Officers</text>
                
                <line x1="0" y1="75" x2="160" y2="75" stroke="#eceef0" strokeWidth="1" />
              </svg>
              <span className="text-[7.5px] text-onSurfaceVariant font-bold mt-1">Census Officers make up 92% of active portal logins.</span>
            </div>
          </div>

          {/* SECTION 20: ROLE AUDIT LOG TIMELINE */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Security Audits Change History</h3>
            
            <div className="relative border-l-2 border-primary/20 pl-4 ml-2.5 space-y-4 text-xs">
              {auditTimeline.map((audit, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[23px] top-0.5 w-3 h-3 rounded-full bg-primary border-2 border-surface" />
                  <div className="font-bold text-primary text-[10px]">{audit.action}</div>
                  <div className="text-[8px] text-onSurfaceVariant font-mono font-semibold">{audit.date}</div>
                  <p className="text-[10px] text-onSurfaceVariant leading-normal mt-0.5">{audit.details}</p>
                  <span className="text-[8px] text-onSurfaceVariant font-bold">Modified by: <strong className="text-primary">{audit.author}</strong></span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 22: REPORTS CENTER */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Access Reports Center</h3>
            <div className="flex flex-col md:flex-row gap-3">
              <select 
                value={activeReportSelection}
                onChange={e => setActiveReportSelection(e.target.value)}
                className="flex-grow px-2.5 py-1.5 bg-surface border border-outlineVariant rounded outline-none text-xs focus:border-primary text-onSurface"
              >
                <option value="Role Report">Role Report</option>
                <option value="Permission Report">Permission Report</option>
                <option value="Access Violation Report">Access Violation Report</option>
                <option value="User Access Report">User Access Report</option>
                <option value="Security Audit Report">Security Audit Report</option>
                <option value="Compliance Report">Compliance Report</option>
              </select>
              <button 
                onClick={() => handleCompileAccessReport(activeReportSelection)}
                disabled={isCompilingReport}
                className="bg-primary hover:bg-primary-light text-white font-bold text-xs px-4 py-2 rounded transition-colors shrink-0 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isCompilingReport ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Compiling...
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" /> Compile PDF
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SECTION 23: QUICK ACTION SHORTCUTS */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-3.5">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Quick Action Shortcuts</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={() => { setShowCreateWizard(true); setWizardStep(1); }}
                className="p-2 border border-outlineVariant hover:bg-surface-low rounded text-left font-bold text-onSurface"
              >
                Create Role
              </button>
              <button 
                onClick={() => { window.scrollTo({ top: 900, behavior: 'smooth' }); }}
                className="p-2 border border-outlineVariant hover:bg-surface-low rounded text-left font-bold text-onSurface"
              >
                Assign Permission
              </button>
              <button 
                onClick={() => { window.scrollTo({ top: 1300, behavior: 'smooth' }); }}
                className="p-2 border border-outlineVariant hover:bg-surface-low rounded text-left font-bold text-onSurface"
              >
                Assign User
              </button>
              <button 
                onClick={() => { window.scrollTo({ top: 1800, behavior: 'smooth' }); }}
                className="p-2 border border-outlineVariant hover:bg-surface-low rounded text-left font-bold text-onSurface"
              >
                View Access Policies
              </button>
            </div>
          </div>

          {/* SECTION 24: HELP & COMPLIANCE SUPPORT DOCUMENTATION */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-primary" /> IAM Documentation & Best Practices
            </h3>
            
            <div className="space-y-3 text-xs text-onSurfaceVariant">
              <div className="pb-2.5 border-b border-outlineVariant/15">
                <span className="font-bold text-primary block">Least Privilege Principle</span>
                <p className="text-[10px] leading-relaxed mt-0.5">
                  Ensure staff are assigned roles with minimum clearance necessary to execute their duties. Double-check before granting broad DELETE capabilities.
                </p>
              </div>

              <div>
                <span className="font-bold text-primary block">Security Best Practices FAQs</span>
                <p className="text-[10px] leading-relaxed mt-0.5">
                  District coordinators and local verifiers must utilize MFA tokens. Clear old session listings periodically to prevent token overlaps.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* CREATE NEW CUSTOM ROLE MODAL (WIZARD - SECTION 12) */}
      {showCreateWizard && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface border border-outlineVariant rounded-xl max-w-md w-full p-6 shadow-premium relative animate-scale-in">
            <button 
              onClick={() => setShowCreateWizard(false)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-surface-low text-onSurfaceVariant cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="font-bold text-base text-primary uppercase tracking-wide mb-1">Create Custom Role Profile</h3>
            <span className="text-[10px] text-onSurfaceVariant block mb-4">Step {wizardStep} of 2</span>
            
            <form onSubmit={handleCreateRoleSubmit} className="space-y-4 text-xs">
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[8px]">Role Name *</label>
                    <input 
                      type="text" 
                      value={newRoleName}
                      onChange={e => setNewRoleName(e.target.value)}
                      placeholder="e.g. Regional Auditor"
                      className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[8px]">Description</label>
                    <textarea 
                      value={newRoleDesc}
                      onChange={e => setNewRoleDesc(e.target.value)}
                      placeholder="Enter access scope and administrative duties..."
                      className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface h-16 resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 border-t border-outlineVariant/10 pt-4 mt-2">
                    <button 
                      type="button"
                      onClick={() => setShowCreateWizard(false)}
                      className="border border-outlineVariant hover:bg-surface-low px-4 py-2 rounded-full font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="bg-primary hover:bg-primary-light text-white font-bold px-5 py-2 rounded-full cursor-pointer shadow-sm"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[8px]">Access Scope</label>
                    <select 
                      value={newRoleScope}
                      onChange={e => setNewRoleScope(e.target.value)}
                      className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                    >
                      <option value="Global">Global (All Modules)</option>
                      <option value="National">National Level</option>
                      <option value="State">State Level Only</option>
                      <option value="District">District Level Only</option>
                      <option value="Read-Only">Read-Only Analytics</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[8px]">Parent Role (Inheritance Source)</label>
                    <select 
                      value={newRoleParent}
                      onChange={e => setNewRoleParent(e.target.value)}
                      className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                    >
                      {rolesList.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                    </select>
                  </div>

                  <div className="flex justify-between gap-2 border-t border-outlineVariant/10 pt-4 mt-2">
                    <button 
                      type="button"
                      onClick={() => setWizardStep(1)}
                      className="border border-outlineVariant hover:bg-surface-low px-4 py-2 rounded-full font-bold cursor-pointer"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      className="bg-primary hover:bg-primary-light text-white font-bold px-5 py-2 rounded-full cursor-pointer shadow-sm"
                    >
                      Create Role
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* USER ROLE REASSIGNMENT MODAL */}
      {showAssignModal && selectedAssignUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface border border-outlineVariant rounded-xl max-w-md w-full p-6 shadow-premium relative animate-scale-in">
            <button 
              onClick={() => setShowAssignModal(false)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-surface-low text-onSurfaceVariant cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="font-bold text-base text-primary uppercase tracking-wide mb-1">Reassign User Clearance</h3>
            <span className="text-[10px] text-onSurfaceVariant font-mono font-bold block mb-4">User ID: {selectedAssignUser.id}</span>
            
            <form onSubmit={handleUserRoleChangeSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-surface-low border border-outlineVariant/20 rounded-lg space-y-1 font-mono text-[10px] text-onSurfaceVariant">
                <div>User Name: <strong>{selectedAssignUser.name}</strong></div>
                <div>Current Role: <strong className="text-red-600">{selectedAssignUser.role}</strong></div>
                <div>Territory Scope: <strong>{selectedAssignUser.territory}</strong></div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase text-[8px]">Select New Clearance Role</label>
                <select 
                  value={modalNewRole}
                  onChange={e => setModalNewRole(e.target.value)}
                  className="px-2.5 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary text-onSurface"
                >
                  {rolesList.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                  <option value="Unassigned">Unassigned (Revoked)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 border-t border-outlineVariant/10 pt-4 mt-2">
                <button 
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="border border-outlineVariant hover:bg-surface-low px-4 py-2 rounded-full font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-primary hover:bg-primary-light text-white font-bold px-5 py-2 rounded-full cursor-pointer shadow-sm"
                >
                  Confirm Reassignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default RolePermissionManagement;








