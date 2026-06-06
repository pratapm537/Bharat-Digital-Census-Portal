import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, Map, MapPin, Navigation, Compass, Layers, ZoomIn, ZoomOut, Maximize, 
  Plus, Check, X, Search, ChevronRight, ChevronDown, Users, ShieldAlert, 
  Activity, ArrowLeftRight, FileSpreadsheet, Download, Printer, FileText, 
  HelpCircle, Send, CheckCircle2, AlertTriangle, AlertCircle, BarChart2, 
  Award, RefreshCw, Layers3, CheckSquare, Trash2, Edit3, UserCheck, Grid
} from 'lucide-react';

// ==========================================
// STATIC/INITIAL DEMO DATA
// ==========================================

const INITIAL_STATES = [
  { id: 'ST-01', name: 'Delhi', code: 'DL', capital: 'New Delhi', population: '32M', category: 'Union Territory', districtsCount: 11, officersCount: 384, coverage: 78, verification: 72, admin: 'Chief Commissioner K. Vijay' },
  { id: 'ST-02', name: 'Maharashtra', code: 'MH', capital: 'Mumbai', population: '126M', category: 'General State', districtsCount: 36, officersCount: 1420, coverage: 85, verification: 81, admin: 'Director General S. K. Patil' },
  { id: 'ST-03', name: 'Karnataka', code: 'KA', capital: 'Bengaluru', population: '68M', category: 'General State', districtsCount: 31, officersCount: 890, coverage: 82, verification: 77, admin: 'Special Secretary R. Gowda' },
  { id: 'ST-04', name: 'Tamil Nadu', code: 'TN', capital: 'Chennai', population: '76M', category: 'General State', districtsCount: 38, officersCount: 920, coverage: 89, verification: 85, admin: 'Adviser M. K. Anbarasan' },
  { id: 'ST-05', name: 'Uttar Pradesh', code: 'UP', capital: 'Lucknow', population: '241M', category: 'General State', districtsCount: 75, officersCount: 2850, coverage: 65, verification: 59, admin: 'Principal Secy A. K. Dwivedi' },
  { id: 'ST-06', name: 'Rajasthan', code: 'RJ', capital: 'Jaipur', population: '81M', category: 'General State', districtsCount: 50, officersCount: 750, coverage: 58, verification: 51, admin: 'Director R. K. Shekhawat' }
];

const INITIAL_DISTRICTS = [
  { id: 'DST-101', name: 'Central Delhi', code: 'DL-CD', stateId: 'ST-01', stateName: 'Delhi', population: '600k', coverage: 88, verification: 82, officer: 'Rahul Sharma', status: 'Optimal' },
  { id: 'DST-102', name: 'South Delhi', code: 'DL-SD', stateId: 'ST-01', stateName: 'Delhi', population: '2.1M', coverage: 84, verification: 79, officer: 'Amit Kumar', status: 'Optimal' },
  { id: 'DST-103', name: 'Mumbai City', code: 'MH-MC', stateId: 'ST-02', stateName: 'Maharashtra', population: '3.1M', coverage: 92, verification: 89, officer: 'Anjali Desai', status: 'Optimal' },
  { id: 'DST-104', name: 'Pune', code: 'MH-PN', stateId: 'ST-02', stateName: 'Maharashtra', population: '9.4M', coverage: 79, verification: 74, officer: 'None', status: 'Under-Staffed' },
  { id: 'DST-105', name: 'Bengaluru Urban', code: 'KA-BU', stateId: 'ST-03', stateName: 'Karnataka', population: '11.3M', coverage: 82, verification: 77, officer: 'Priyanka Sen', status: 'Optimal' },
  { id: 'DST-106', name: 'Chennai', code: 'TN-CH', stateId: 'ST-04', stateName: 'Tamil Nadu', population: '4.6M', coverage: 90, verification: 86, officer: 'Rohit Verma', status: 'Optimal' },
  { id: 'DST-107', name: 'Lucknow', code: 'UP-LK', stateId: 'ST-05', stateName: 'Uttar Pradesh', population: '3.8M', coverage: 71, verification: 64, officer: 'Vinay Shukla', status: 'Needs Attention' },
  { id: 'DST-108', name: 'Jaipur', code: 'RJ-JP', stateId: 'ST-06', stateName: 'Rajasthan', population: '6.6M', coverage: 58, verification: 51, officer: 'Vikram Singh', status: 'Needs Attention' }
];

const INITIAL_OFFICERS = [
  { id: 1, name: 'Rahul Sharma', empId: 'OFF-2026-4587', designation: 'District Census Officer', state: 'Delhi', district: 'Central Delhi', status: 'Available', accuracy: 98 },
  { id: 2, name: 'Anjali Desai', empId: 'OFF-2026-8912', designation: 'Senior Census Supervisor', state: 'Maharashtra', district: 'Mumbai City', status: 'Available', accuracy: 99 },
  { id: 3, name: 'Amit Kumar', empId: 'OFF-2026-1142', designation: 'Field Verification Officer', state: 'Delhi', district: 'South Delhi', status: 'Available', accuracy: 95 },
  { id: 4, name: 'Vikram Singh', empId: 'OFF-2026-0951', designation: 'District Audit Officer', state: 'Rajasthan', district: 'Jaipur', status: 'On Field', accuracy: 88 },
  { id: 5, name: 'Priyanka Sen', empId: 'OFF-2026-3021', designation: 'Senior Regional Enumerator', state: 'Karnataka', district: 'Bengaluru Urban', status: 'Available', accuracy: 97 },
  { id: 6, name: 'Rohan Mehta', empId: 'OFF-2026-5591', designation: 'Field Enumerator Officer', state: 'Gujarat', district: 'Ahmedabad', status: 'Available', accuracy: 100 },
  { id: 7, name: 'Rohit Verma', empId: 'OFF-2026-7789', designation: 'Assistant Registrar', state: 'Tamil Nadu', district: 'Chennai', status: 'Available', accuracy: 96 },
  { id: 8, name: 'Vinay Shukla', empId: 'OFF-2026-6132', designation: 'Zonal Inspector', state: 'Uttar Pradesh', district: 'Lucknow', status: 'On Field', accuracy: 91 }
];

const INITIAL_VILLAGES = [
  { id: 'VIL-01', name: 'Rampur', district: 'Central Delhi', population: 4500, officer: 'Amit Kumar', coverage: 65, status: 'In Progress' },
  { id: 'VIL-02', name: 'Shahpur', district: 'Central Delhi', population: 3200, officer: 'Rahul Sharma', coverage: 90, status: 'Completed' },
  { id: 'VIL-03', name: 'Bilaspur', district: 'Lucknow', population: 8900, officer: 'Vinay Shukla', coverage: 45, status: 'Pending' },
  { id: 'VIL-04', name: 'Dhamtari', district: 'Jaipur', population: 12000, officer: 'Vikram Singh', coverage: 35, status: 'In Progress' },
  { id: 'VIL-05', name: 'Devikulam', district: 'Pune', population: 6100, officer: 'Unassigned', coverage: 0, status: 'Unassigned' }
];

const INITIAL_CITIES = [
  { id: 'CIT-01', name: 'New Delhi', population: '15M', officerCount: 120, coveragePercentage: 82 },
  { id: 'CIT-02', name: 'Mumbai Coast', population: '12M', officerCount: 210, coveragePercentage: 91 },
  { id: 'CIT-03', name: 'Pune East', population: '5M', officerCount: 85, coveragePercentage: 74 },
  { id: 'CIT-04', name: 'Bengaluru Tech Corridor', population: '8M', officerCount: 140, coveragePercentage: 83 },
  { id: 'CIT-05', name: 'Chennai Central', population: '4M', officerCount: 95, coveragePercentage: 88 }
];

const INITIAL_WARDS = [
  { wardNo: 'Ward 21', name: 'Dwarka Block C', assignedOfficer: 'Rohit Verma', coverageStatus: 90 },
  { wardNo: 'Ward 12', name: 'Pahar Ganj Market', assignedOfficer: 'Rahul Sharma', coverageStatus: 78 },
  { wardNo: 'Ward 08', name: 'Colaba Point', assignedOfficer: 'Anjali Desai', coverageStatus: 96 },
  { wardNo: 'Ward 45', name: 'Saket Metro Sector', assignedOfficer: 'Amit Kumar', coverageStatus: 82 },
  { wardNo: 'Ward 03', name: 'Hawa Mahal Enclave', assignedOfficer: 'Vikram Singh', coverageStatus: 58 }
];

const INITIAL_BLOCKS = [
  { blockId: 'BLK-2026-4587', population: 1200, assignedOfficer: 'Rahul Sharma', completion: 85 },
  { blockId: 'BLK-2026-8912', population: 950, assignedOfficer: 'Anjali Desai', completion: 98 },
  { blockId: 'BLK-2026-1142', population: 1400, assignedOfficer: 'Amit Kumar', completion: 80 },
  { blockId: 'BLK-2026-9021', population: 1800, assignedOfficer: 'Rohit Verma', completion: 92 },
  { blockId: 'BLK-2026-0951', population: 1100, assignedOfficer: 'Vikram Singh', completion: 52 }
];

const INITIAL_TIMELINE = [
  { id: 1, type: 'State Created', desc: 'New state territory "Rajasthan Zone" initialized by Headquarters', time: '10 Mins Ago', icon: Compass, color: 'text-primary' },
  { id: 2, type: 'Officer Assigned', desc: 'Rahul Sharma allocated to Central Delhi District operations', time: '1 Hour Ago', icon: UserCheck, color: 'text-success' },
  { id: 3, type: 'District Created', desc: 'District "Jaipur Rural" registered under Rajasthan Zone', time: 'Yesterday', icon: Grid, color: 'text-amber-500' },
  { id: 4, type: 'Coverage Updated', desc: 'Bengaluru Urban District coverage goal marked as 85% Completed', time: '2 Days Ago', icon: Activity, color: 'text-sky-500' },
  { id: 5, type: 'Verification Completed', desc: 'Biometric verification census completed in Dwarka Ward 21', time: '3 Days Ago', icon: CheckCircle2, color: 'text-emerald-500' }
];

const FAQS = [
  { q: 'How is a Territory ID generated?', a: 'State and District Territory IDs are generated using national standard prefixes (e.g. ST-01 for states, DST-101 for districts) automatically to match the Census Registrar database.' },
  { q: 'What is the Census Block resolution?', a: 'A Census Block is the smallest administrative unit, mapping ~150 to 300 households (~1,000-1,500 population) to a single field enumerator.' },
  { q: 'How do I transfer ownership of a state zone?', a: 'Use the Edit State Zone panel, select "Transfer Ownership", search for the accredited State Administrator and click Save to reassign the territory.' },
  { q: 'How does live GPS coordination sync work?', a: 'The GIS command center hooks into the field officer census app via mobile GPS pings, refreshed every 10 seconds to construct the visual live maps.' }
];

// ==========================================
// HIGH FIDELITY MOCK COORDINATE GEOMETRIES FOR MAPPING
// (To draw interactive GIS maps of regions)
// ==========================================
const MAP_HOTSPOTS = [
  { id: 'ST-01', name: 'Delhi', code: 'DL', cx: 310, cy: 150, r: 15, coverage: 78, pop: '32 Million', districts: 11 },
  { id: 'ST-02', name: 'Maharashtra', code: 'MH', cx: 280, cy: 320, r: 35, coverage: 85, pop: '126 Million', districts: 36 },
  { id: 'ST-03', name: 'Karnataka', code: 'KA', cx: 290, cy: 410, r: 28, coverage: 82, pop: '68 Million', districts: 31 },
  { id: 'ST-04', name: 'Tamil Nadu', code: 'TN', cx: 330, cy: 460, r: 25, coverage: 89, pop: '76 Million', districts: 38 },
  { id: 'ST-05', name: 'Uttar Pradesh', code: 'UP', cx: 390, cy: 160, r: 40, coverage: 65, pop: '241 Million', districts: 75 },
  { id: 'ST-06', name: 'Rajasthan', code: 'RJ', cx: 220, cy: 160, r: 38, coverage: 58, pop: '81 Million', districts: 50 }
];

const TerritoryManagement = () => {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState('gis'); // 'gis', 'hierarchy', 'states', 'districts', 'assignments', 'reports'
  
  // Data States
  const [states, setStates] = useState(INITIAL_STATES);
  const [districts, setDistricts] = useState(INITIAL_DISTRICTS);
  const [villages, setVillages] = useState(INITIAL_VILLAGES);
  const [cities, setCities] = useState(INITIAL_CITIES);
  const [wards, setWards] = useState(INITIAL_WARDS);
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS);
  const [officers] = useState(INITIAL_OFFICERS);
  const [activities, setActivities] = useState(INITIAL_TIMELINE);
  
  // State Creation Form
  const [stateForm, setStateForm] = useState({
    name: '',
    code: '',
    capital: '',
    population: '',
    category: 'General State',
    admin: ''
  });
  
  // District Creation Form
  const [districtForm, setDistrictForm] = useState({
    name: '',
    code: '',
    stateId: '',
    population: '',
    officer: ''
  });

  // Edit State Form
  const [editStateId, setEditStateId] = useState(null);
  const [editStateForm, setEditStateForm] = useState({
    name: '',
    population: '',
    admin: '',
    status: 'Active',
    goal: 85
  });

  // Search/Filters
  const [selectedStateFilter, setSelectedStateFilter] = useState('');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState('');
  const [officerSearch, setOfficerSearch] = useState('');
  const [coverageFilter, setCoverageFilter] = useState('All'); // 'All', 'High', 'Medium', 'Needs Attention'

  // Map settings
  const [mapScale, setMapScale] = useState(1);
  const [mapTranslate, setMapTranslate] = useState({ x: 0, y: 0 });
  const [selectedMapRegion, setSelectedMapRegion] = useState(null);
  const [mapLayers, setMapLayers] = useState({
    states: true,
    districts: true,
    wards: false,
    villages: true,
    blocks: false,
    officers: true
  });
  const [mapMode, setMapMode] = useState('standard'); // 'standard', 'heatmap', 'satellite', 'terrain'
  const [heatmapType, setHeatmapType] = useState('coverage'); // 'coverage', 'population', 'verification'
  const [cursorCoords, setCursorCoords] = useState({ lat: '20.5937° N', lng: '78.9629° E' });
  const mapContainerRef = useRef(null);

  // Assignment Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignmentTarget, setAssignmentTarget] = useState({ type: '', id: '', name: '', currentOfficer: '' });
  const [assignOfficerSearch, setAssignOfficerSearch] = useState('');

  // Expandable Hierarchy Tree state
  const [treeExpanded, setTreeExpanded] = useState({
    india: true,
    'ST-01': false,
    'ST-02': false,
    'ST-03': false,
    'ST-04': false,
    'ST-05': false,
    'ST-06': false,
  });

  // Report Generator Cues
  const [reportType, setReportType] = useState('State Coverage Report');
  const [reportStateFilter, setReportStateFilter] = useState('');
  const [reportFormat, setReportFormat] = useState('PDF');
  const [reportQueue, setReportQueue] = useState(null);

  // Live support chat simulator
  const [chatMessages, setChatMessages] = useState([
    { sender: 'AI Assistant', text: 'Hello Administrator. Welcome to the GIS Territory Support console. Ask me anything about assigning boundaries or importing GIS shapefiles.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // State details side panel helper
  const [activeStateDetailsId, setActiveStateDetailsId] = useState('ST-01');

  // Trigger feedback messages
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Clear feedback after 4 seconds
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Handle Map Dragging/Panning
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapTranslate.x, y: e.clientY - mapTranslate.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setMapTranslate({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }

    // Simulate cursor coordinates update
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Map arbitrary pixel bounds to India Lat/Lng
      const lat = (35.5 - (y / rect.height) * 29).toFixed(4);
      const lng = (68.1 + (x / rect.width) * 29).toFixed(4);
      setCursorCoords({ lat: `${lat}° N`, lng: `${lng}° E` });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const zoomIn = () => setMapScale(prev => Math.min(prev + 0.2, 3));
  const zoomOut = () => setMapScale(prev => Math.max(prev - 0.2, 0.6));
  const resetZoom = () => {
    setMapScale(1);
    setMapTranslate({ x: 0, y: 0 });
    setSelectedMapRegion(null);
  };

  // State Management CRUD actions
  const handleCreateState = (e) => {
    e.preventDefault();
    if (!stateForm.name || !stateForm.code || !stateForm.capital || !stateForm.population) {
      setFeedback({ type: 'error', message: 'All state information fields are required!' });
      return;
    }

    const stateId = `ST-0${states.length + 1}`;
    const newState = {
      id: stateId,
      name: stateForm.name,
      code: stateForm.code.toUpperCase(),
      capital: stateForm.capital,
      population: stateForm.population,
      category: stateForm.category,
      districtsCount: 0,
      officersCount: stateForm.admin ? 1 : 0,
      coverage: 0,
      verification: 0,
      admin: stateForm.admin || 'Unassigned'
    };

    setStates([...states, newState]);
    
    // Add timeline action
    const newAction = {
      id: activities.length + 1,
      type: 'State Created',
      desc: `State Zone "${newState.name}" registered under national administration code ${newState.code}`,
      time: 'Just Now',
      icon: Compass,
      color: 'text-primary'
    };
    setActivities([newAction, ...activities]);

    setFeedback({ type: 'success', message: `State Zone ${newState.name} created successfully with ID ${stateId}!` });
    setStateForm({ name: '', code: '', capital: '', population: '', category: 'General State', admin: '' });
  };

  const handleEditStateSubmit = (e) => {
    e.preventDefault();
    const updatedStates = states.map(s => {
      if (s.id === editStateId) {
        return {
          ...s,
          name: editStateForm.name,
          population: editStateForm.population,
          admin: editStateForm.admin,
          coverage: editStateForm.goal // simulate goal update
        };
      }
      return s;
    });

    setStates(updatedStates);
    setFeedback({ type: 'success', message: 'State Zone details successfully updated.' });
    setEditStateId(null);
  };

  const handleArchiveState = (stateId, stateName) => {
    const updatedStates = states.filter(s => s.id !== stateId);
    setStates(updatedStates);
    setFeedback({ type: 'warning', message: `State Zone "${stateName}" archived. Historic logs maintained.` });
    
    const newAction = {
      id: activities.length + 1,
      type: 'State Archived',
      desc: `State Zone "${stateName}" was archived by Admin. All assignments suspended.`,
      time: 'Just Now',
      icon: AlertTriangle,
      color: 'text-red-500'
    };
    setActivities([newAction, ...activities]);
    if (activeStateDetailsId === stateId) {
      setActiveStateDetailsId(states[0]?.id || null);
    }
  };

  // District CRUD actions
  const handleCreateDistrict = (e) => {
    e.preventDefault();
    if (!districtForm.name || !districtForm.code || !districtForm.stateId || !districtForm.population) {
      setFeedback({ type: 'error', message: 'All district fields are required!' });
      return;
    }

    const stateObj = states.find(s => s.id === districtForm.stateId);
    const newDistrictId = `DST-${100 + districts.length + 1}`;
    
    const newDst = {
      id: newDistrictId,
      name: districtForm.name,
      code: districtForm.code.toUpperCase(),
      stateId: districtForm.stateId,
      stateName: stateObj?.name || 'Unknown',
      population: districtForm.population,
      coverage: 0,
      verification: 0,
      officer: districtForm.officer || 'None',
      status: districtForm.officer ? 'Optimal' : 'Under-Staffed'
    };

    setDistricts([...districts, newDst]);

    // Update state district count
    if (stateObj) {
      const updatedStates = states.map(s => {
        if (s.id === stateObj.id) {
          return { ...s, districtsCount: s.districtsCount + 1 };
        }
        return s;
      });
      setStates(updatedStates);
    }

    // Add timeline action
    const newAction = {
      id: activities.length + 1,
      type: 'District Created',
      desc: `District "${newDst.name}" initialized under parent State "${stateObj?.name}"`,
      time: 'Just Now',
      icon: Grid,
      color: 'text-amber-500'
    };
    setActivities([newAction, ...activities]);

    setFeedback({ type: 'success', message: `District "${newDst.name}" linked and registered!` });
    setDistrictForm({ name: '', code: '', stateId: '', population: '', officer: '' });
  };

  // Officer Assignment Logic
  const handleOpenAssignModal = (type, id, name, currentOfficer) => {
    setAssignmentTarget({ type, id, name, currentOfficer });
    setIsAssignModalOpen(true);
  };

  const handleConfirmAssignment = (officerName) => {
    if (assignmentTarget.type === 'district') {
      const updatedDistricts = districts.map(d => {
        if (d.id === assignmentTarget.id) {
          return { ...d, officer: officerName, status: officerName === 'None' ? 'Under-Staffed' : 'Optimal' };
        }
        return d;
      });
      setDistricts(updatedDistricts);
    } else if (assignmentTarget.type === 'village') {
      const updatedVillages = villages.map(v => {
        if (v.id === assignmentTarget.id) {
          return { ...v, officer: officerName, status: officerName === 'Unassigned' ? 'Unassigned' : 'In Progress' };
        }
        return v;
      });
      setVillages(updatedVillages);
    } else if (assignmentTarget.type === 'ward') {
      const updatedWards = wards.map(w => {
        if (w.wardNo === assignmentTarget.id) {
          return { ...w, assignedOfficer: officerName };
        }
        return w;
      });
      setWards(updatedWards);
    } else if (assignmentTarget.type === 'block') {
      const updatedBlocks = blocks.map(b => {
        if (b.blockId === assignmentTarget.id) {
          return { ...b, assignedOfficer: officerName };
        }
        return b;
      });
      setBlocks(updatedBlocks);
    }

    // Add activity record
    const actionText = officerName === 'None' || officerName === 'Unassigned' 
      ? `Revoked administrative allocation from "${assignmentTarget.name}"`
      : `Assigned Officer "${officerName}" to manage operations in "${assignmentTarget.name}"`;

    const newAction = {
      id: activities.length + 1,
      type: 'Officer Assigned',
      desc: actionText,
      time: 'Just Now',
      icon: UserCheck,
      color: 'text-success'
    };
    setActivities([newAction, ...activities]);

    setFeedback({ type: 'success', message: 'Allocation profile updated successfully.' });
    setIsAssignModalOpen(false);
  };

  // Report generation queue simulator
  const handleGenerateReport = (e) => {
    e.preventDefault();
    setReportQueue('generating');
    setTimeout(() => {
      setReportQueue('completed');
      setTimeout(() => setReportQueue(null), 3000);
    }, 2000);
  };

  // Chat Support bot submit
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'You (Admin)', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);

    const inputLower = chatInput.toLowerCase();
    let replyText = "I'm routing this ticket to the GIS Technical Division. They will assist you shortly.";
    if (inputLower.includes('shapefile') || inputLower.includes('geojson') || inputLower.includes('import')) {
      replyText = 'Shapefile formats must conform to EPSG:4326 Coordinate System (WGS 84). Click "Import Territory Data" above, browse for your .zip folder containin .shp, .dbf, and .shx, then hit Import.';
    } else if (inputLower.includes('block') || inputLower.includes('smallest')) {
      replyText = 'Census Blocks represent the smallest unit containing 1,000-1,500 people. You can create/assign blocks under Section 5 (Area Assignment).';
    } else if (inputLower.includes('export')) {
      replyText = 'You can export all territory databases via the Section 1 Header actions or Section 11 Reports tab. Supports PDF, CSV (Excel), and Print layout.';
    }

    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'AI Assistant', text: replyText }]);
    }, 800);

    setChatInput('');
  };

  // Filter lists based on selection
  const filteredDistrictsList = districts.filter(d => {
    const matchesState = !selectedStateFilter || d.stateId === selectedStateFilter;
    const matchesOfficer = !officerSearch || d.officer.toLowerCase().includes(officerSearch.toLowerCase());
    
    let matchesCoverage = true;
    if (coverageFilter === 'High') matchesCoverage = d.coverage >= 80;
    else if (coverageFilter === 'Medium') matchesCoverage = d.coverage >= 60 && d.coverage < 80;
    else if (coverageFilter === 'Needs Attention') matchesCoverage = d.coverage < 60;

    return matchesState && matchesOfficer && matchesCoverage;
  });

  const handleSelectMapState = (h) => {
    setSelectedMapRegion(h);
    setActiveStateDetailsId(h.id);
    const stateObj = states.find(s => s.id === h.id);
    if (stateObj) {
      setEditStateForm({
        name: stateObj.name,
        population: stateObj.population,
        admin: stateObj.admin,
        status: 'Active',
        goal: stateObj.coverage
      });
    }
  };

  // Hierarchy Navigation clicks
  const handleToggleTreeNode = (key) => {
    setTreeExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Helper calculation for leaderboard
  const sortedDistricts = [...districts].sort((a, b) => b.coverage - a.coverage);
  const sortedStates = [...states].sort((a, b) => b.coverage - a.coverage);

  // Statistics summaries
  const totalDistrictsCount = states.reduce((acc, curr) => acc + curr.districtsCount, 0);
  const totalWorkforceCount = states.reduce((acc, curr) => acc + curr.officersCount, 0);
  const avgCoveragePercentage = Math.round(states.reduce((acc, curr) => acc + curr.coverage, 0) / states.length);

  return (
    <div className="flex-grow w-full max-w-containerMax mx-auto px-6 py-8 flex flex-col gap-8 text-onSurface bg-background">
      <style>{`
        .dark .flex-grow .bg-surface,
        .dark .flex-grow .bg-surface-low,
        .dark .flex-grow .bg-surface-container,
        .dark .flex-grow .bg-surface-high,
        .dark .flex-grow .bg-surface-highest,
        .dark .flex-grow .bg-white,
        .dark .flex-grow .premium-card {
          background-color: #000000 !important;
        }
      `}</style>
      
      {/* FEEDBACK SYSTEM */}
      {feedback.message && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-lg shadow-xl flex items-center gap-3 border text-xs max-w-sm animate-fade-in ${
          feedback.type === 'success' ? 'bg-green-50 text-green-800 border-green-200 dark:bg-green-950/80 dark:text-green-300 dark:border-green-800' :
          feedback.type === 'warning' ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800' :
          'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800'
        }`}>
          {feedback.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0" />}
          {feedback.type === 'warning' && <AlertTriangle className="w-5 h-5 shrink-0" />}
          {feedback.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* SECTION 1: PAGE HEADER */}
      <section className="relative overflow-hidden rounded-xl border border-outlineVariant/50 bg-primary p-6 text-white shadow-ambient flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        <div className="flex flex-col gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#ff9933]/20 border border-[#ff9933]/30 text-[#ff9933] font-bold uppercase text-[9px] px-2.5 py-0.5 rounded-full tracking-wider">
              GIS Command Console
            </span>
            <span className="text-[10px] text-white/70 font-semibold">• Ministry of Home Affairs</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Territory Management</h2>
          <p className="text-xs text-white/80 max-w-xl leading-relaxed">
            Manage states, districts, villages, cities, wards, census blocks, and officer assignments. Oversee GIS coordinates, borders, and national coverage targets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          <button 
            onClick={() => {
              setActiveTab('states');
              const formEl = document.getElementById('create-state-form-section');
              if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-secondary text-primary-dark font-bold text-xs px-4 py-2.5 rounded-full hover:bg-secondary/90 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Create State
          </button>
          <button 
            onClick={() => handleOpenAssignModal('district', 'DST-104', 'Pune District', 'None')}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" /> Assign Officer
          </button>
          <button 
            onClick={() => setFeedback({ type: 'success', message: 'Import Wizard active: Validating NIC shapefiles, wards polygons, and demographic mappings.' })}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Import GIS Data
          </button>
          <button 
            onClick={() => setFeedback({ type: 'success', message: 'Compilation successful: Downloading national boundary tables in CSV format.' })}
            className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Export Data
          </button>
        </div>
      </section>

      {/* SECTION 2: TERRITORY OVERVIEW */}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-surface p-4 rounded-xl border border-outlineVariant/50 shadow-sm flex flex-col gap-1.5 hover:border-primary/50 transition-colors">
          <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-wider">Total States</span>
          <div className="text-2xl font-bold text-primary flex items-end justify-between">
            <span>{states.length}</span>
            <Compass className="w-5 h-5 text-primary/30" />
          </div>
          <p className="text-[10px] text-onSurfaceVariant">36 India Zones Registered</p>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-outlineVariant/50 shadow-sm flex flex-col gap-1.5 hover:border-primary/50 transition-colors">
          <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-wider">Total Districts</span>
          <div className="text-2xl font-bold text-primary flex items-end justify-between">
            <span>{totalDistrictsCount}</span>
            <Grid className="w-5 h-5 text-primary/30" />
          </div>
          <p className="text-[10px] text-onSurfaceVariant">780 Core Jurisdictions</p>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-outlineVariant/50 shadow-sm flex flex-col gap-1.5 hover:border-primary/50 transition-colors">
          <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-wider">Total Cities</span>
          <div className="text-2xl font-bold text-primary flex items-end justify-between">
            <span>4,000+</span>
            <Globe className="w-5 h-5 text-primary/30" />
          </div>
          <p className="text-[10px] text-onSurfaceVariant">Metro & Urban Centres</p>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-outlineVariant/50 shadow-sm flex flex-col gap-1.5 hover:border-primary/50 transition-colors">
          <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-wider">Total Villages</span>
          <div className="text-2xl font-bold text-primary flex items-end justify-between">
            <span>650,000+</span>
            <MapPin className="w-5 h-5 text-primary/30" />
          </div>
          <p className="text-[10px] text-onSurfaceVariant">Gram Panchayats & Blocks</p>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-outlineVariant/50 shadow-sm flex flex-col gap-1.5 hover:border-primary/50 transition-colors">
          <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-wider">Census Blocks</span>
          <div className="text-2xl font-bold text-primary flex items-end justify-between">
            <span>1,200,000+</span>
            <Layers className="w-5 h-5 text-primary/30" />
          </div>
          <p className="text-[10px] text-onSurfaceVariant">Smallest Enumeration Units</p>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-outlineVariant/50 shadow-sm flex flex-col gap-1.5 hover:border-primary/50 transition-colors">
          <span className="text-[10px] font-bold text-onSurfaceVariant uppercase tracking-wider">Avg National Coverage</span>
          <div className="text-2xl font-bold text-success flex items-end justify-between">
            <span>{avgCoveragePercentage}%</span>
            <Activity className="w-5 h-5 text-success/30" />
          </div>
          <div className="h-1 w-full bg-outlineVariant/20 rounded-full overflow-hidden mt-1">
            <div className="bg-success h-full" style={{ width: `${avgCoveragePercentage}%` }} />
          </div>
        </div>
      </section>

      {/* VIEW SELECTOR TABS */}
      <section className="flex flex-wrap items-center gap-1 border-b border-outlineVariant/50 pb-2">
        {[
          { id: 'gis', label: 'GIS Mapping Center', icon: Map },
          { id: 'hierarchy', label: 'Territory Hierarchy', icon: Layers },
          { id: 'states', label: 'State Management', icon: Compass },
          { id: 'districts', label: 'District Management', icon: Grid },
          { id: 'assignments', label: 'Area Assignments', icon: UserCheck },
          { id: 'reports', label: 'Reports & Audit logs', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
                activeTab === tab.id 
                  ? 'border-primary text-primary bg-primary-container/20 dark:bg-primary-container/10' 
                  : 'border-transparent text-onSurfaceVariant hover:text-primary'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </section>

      {/* MAIN SCREEN SECTIONS */}
      {activeTab === 'gis' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* MAP VIEWER COLUMN */}
          <div className="lg:col-span-3 bg-surface border border-outlineVariant/50 rounded-xl overflow-hidden shadow-sm flex flex-col">
            
            {/* Map Header Panel */}
            <div className="px-5 py-4 border-b border-outlineVariant/30 flex flex-wrap items-center justify-between gap-4 bg-surface-low">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-success animate-ping" />
                <h3 className="font-bold text-sm text-primary uppercase tracking-wide">Interactive National GIS Canvas</h3>
              </div>
              
              {/* Map controls */}
              <div className="flex items-center gap-2">
                <div className="bg-surface border border-outlineVariant/50 rounded-lg p-0.5 flex items-center">
                  <button 
                    onClick={() => setMapMode('standard')} 
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${mapMode === 'standard' ? 'bg-primary text-white' : 'text-onSurfaceVariant hover:text-primary'}`}
                  >
                    Vector GIS
                  </button>
                  <button 
                    onClick={() => setMapMode('heatmap')} 
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${mapMode === 'heatmap' ? 'bg-primary text-white' : 'text-onSurfaceVariant hover:text-primary'}`}
                  >
                    Heatmap
                  </button>
                  <button 
                    onClick={() => setMapMode('satellite')} 
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${mapMode === 'satellite' ? 'bg-primary text-white' : 'text-onSurfaceVariant hover:text-primary'}`}
                  >
                    Satellite
                  </button>
                  <button 
                    onClick={() => setMapMode('terrain')} 
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${mapMode === 'terrain' ? 'bg-primary text-white' : 'text-onSurfaceVariant hover:text-primary'}`}
                  >
                    Terrain
                  </button>
                </div>

                <div className="flex items-center bg-surface border border-outlineVariant/50 rounded-lg p-0.5">
                  <button onClick={zoomIn} className="p-1 text-onSurfaceVariant hover:text-primary hover:bg-surface-low rounded" title="Zoom In"><ZoomIn className="w-4 h-4" /></button>
                  <button onClick={zoomOut} className="p-1 text-onSurfaceVariant hover:text-primary hover:bg-surface-low rounded" title="Zoom Out"><ZoomOut className="w-4 h-4" /></button>
                  <button onClick={resetZoom} className="p-1 text-onSurfaceVariant hover:text-primary hover:bg-surface-low rounded" title="Reset Frame"><Maximize className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            {/* Simulated Interactive GIS Board */}
            <div 
              ref={mapContainerRef}
              className={`relative h-[480px] select-none cursor-grab active:cursor-grabbing overflow-hidden border-b border-outlineVariant/30 ${
                mapMode === 'satellite' ? 'bg-[#0f172a]' : 
                mapMode === 'terrain' ? 'bg-[#1e293b]' : 
                'bg-slate-50 dark:bg-[#071324]'
              }`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              
              {/* Coordinates Tracker Overlay */}
              <div className="absolute top-4 left-4 z-20 bg-surface/80 backdrop-blur border border-outlineVariant/50 rounded-lg p-2.5 shadow-sm text-[10px] font-mono flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-primary font-bold">
                  <Navigation className="w-3.5 h-3.5 text-[#ff9933] animate-pulse" />
                  <span>GPS POSITION SCANNER</span>
                </div>
                <div>Lat: <span className="font-bold">{cursorCoords.lat}</span></div>
                <div>Lng: <span className="font-bold">{cursorCoords.lng}</span></div>
                <div className="text-[9px] text-onSurfaceVariant border-t border-outlineVariant/20 mt-1 pt-1">NIC Projection WGS84</div>
              </div>

              {/* Layer Panel Checklist Overlay */}
              <div className="absolute top-4 right-4 z-20 bg-surface/80 backdrop-blur border border-outlineVariant/50 rounded-lg p-3 shadow-sm text-xs flex flex-col gap-2">
                <span className="font-bold text-primary flex items-center gap-1.5 border-b border-outlineVariant/20 pb-1.5 uppercase tracking-wide text-[10px]">
                  <Layers3 className="w-3.5 h-3.5" /> GIS Layers
                </span>
                {Object.keys(mapLayers).map((layer) => (
                  <label key={layer} className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors text-[11px] font-semibold capitalize">
                    <input 
                      type="checkbox" 
                      checked={mapLayers[layer]} 
                      onChange={() => setMapLayers(prev => ({ ...prev, [layer]: !prev[layer] }))}
                      className="rounded text-primary focus:ring-primary/20 w-3.5 h-3.5"
                    />
                    {layer} Boundaries
                  </label>
                ))}
              </div>

              {/* Heatmap Filters panel */}
              {mapMode === 'heatmap' && (
                <div className="absolute bottom-4 left-4 z-20 bg-surface/85 backdrop-blur border border-outlineVariant/50 rounded-lg p-3 shadow-sm text-xs flex flex-col gap-2">
                  <span className="font-bold text-primary text-[10px] uppercase">Heatmap Density Metric</span>
                  <div className="flex flex-col gap-1.5">
                    {['coverage', 'population', 'verification'].map(type => (
                      <label key={type} className="flex items-center gap-2 text-[11px] font-medium capitalize cursor-pointer">
                        <input 
                          type="radio" 
                          name="heatmapType"
                          checked={heatmapType === type}
                          onChange={() => setHeatmapType(type)}
                          className="text-primary w-3.5 h-3.5 focus:ring-0"
                        />
                        {type} Density
                      </label>
                    ))}
                  </div>
                  <div className="mt-1 pt-1.5 border-t border-outlineVariant/20 flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="text-[9px] text-onSurfaceVariant">Low (Needs Staff)</span>
                    <span className="w-3 h-3 bg-green-500 rounded-full ml-1" />
                    <span className="text-[9px] text-onSurfaceVariant">High (Completed)</span>
                  </div>
                </div>
              )}

              {/* Main Map SVG Canvas */}
              <div 
                className="w-full h-full flex items-center justify-center transition-transform"
                style={{
                  transform: `translate(${mapTranslate.x}px, ${mapTranslate.y}px) scale(${mapScale})`,
                  transformOrigin: 'center center'
                }}
              >
                <svg viewBox="0 0 600 550" className="w-full h-[450px]">
                  
                  {/* Mock India Boundaries Map */}
                  {mapLayers.states && (
                    <g id="states-group">
                      {/* Maharashtra */}
                      <path 
                        d="M 180,320 L 260,260 L 320,310 L 290,360 L 220,360 Z" 
                        fill={mapMode === 'satellite' ? '#1e293b' : mapMode === 'terrain' ? '#334155' : selectedMapRegion?.id === 'ST-02' ? 'rgba(255,153,51,0.2)' : '#f8fafc'} 
                        stroke={selectedMapRegion?.id === 'ST-02' ? '#ff9933' : '#cbd5e1'} 
                        strokeWidth={2}
                        onClick={() => handleSelectMapState(MAP_HOTSPOTS[1])}
                        className="cursor-pointer hover:fill-slate-100 transition-colors"
                      />
                      {/* Rajasthan */}
                      <path 
                        d="M 160,120 L 260,110 L 290,190 L 190,210 Z" 
                        fill={mapMode === 'satellite' ? '#1e293b' : mapMode === 'terrain' ? '#334155' : selectedMapRegion?.id === 'ST-06' ? 'rgba(255,153,51,0.2)' : '#f8fafc'} 
                        stroke={selectedMapRegion?.id === 'ST-06' ? '#ff9933' : '#cbd5e1'} 
                        strokeWidth={2}
                        onClick={() => handleSelectMapState(MAP_HOTSPOTS[5])}
                        className="cursor-pointer hover:fill-slate-100 transition-colors"
                      />
                      {/* Karnataka */}
                      <path 
                        d="M 230,365 L 290,365 L 320,440 L 260,470 Z" 
                        fill={mapMode === 'satellite' ? '#1e293b' : mapMode === 'terrain' ? '#334155' : selectedMapRegion?.id === 'ST-03' ? 'rgba(255,153,51,0.2)' : '#f8fafc'} 
                        stroke={selectedMapRegion?.id === 'ST-03' ? '#ff9933' : '#cbd5e1'} 
                        strokeWidth={2}
                        onClick={() => handleSelectMapState(MAP_HOTSPOTS[2])}
                        className="cursor-pointer hover:fill-slate-100 transition-colors"
                      />
                      {/* Tamil Nadu */}
                      <path 
                        d="M 290,445 L 340,445 L 340,510 L 285,500 Z" 
                        fill={mapMode === 'satellite' ? '#1e293b' : mapMode === 'terrain' ? '#334155' : selectedMapRegion?.id === 'ST-04' ? 'rgba(255,153,51,0.2)' : '#f8fafc'} 
                        stroke={selectedMapRegion?.id === 'ST-04' ? '#ff9933' : '#cbd5e1'} 
                        strokeWidth={2}
                        onClick={() => handleSelectMapState(MAP_HOTSPOTS[3])}
                        className="cursor-pointer hover:fill-slate-100 transition-colors"
                      />
                      {/* Uttar Pradesh */}
                      <path 
                        d="M 295,120 L 410,120 L 410,210 L 330,210 Z" 
                        fill={mapMode === 'satellite' ? '#1e293b' : mapMode === 'terrain' ? '#334155' : selectedMapRegion?.id === 'ST-05' ? 'rgba(255,153,51,0.2)' : '#f8fafc'} 
                        stroke={selectedMapRegion?.id === 'ST-05' ? '#ff9933' : '#cbd5e1'} 
                        strokeWidth={2}
                        onClick={() => handleSelectMapState(MAP_HOTSPOTS[4])}
                        className="cursor-pointer hover:fill-slate-100 transition-colors"
                      />
                      {/* Delhi */}
                      <circle 
                        cx="300" cy="150" r="10" 
                        fill={selectedMapRegion?.id === 'ST-01' ? '#ff9933' : '#138808'} 
                        stroke="#ffffff" 
                        strokeWidth={1.5}
                        onClick={() => handleSelectMapState(MAP_HOTSPOTS[0])}
                        className="cursor-pointer animate-pulse"
                      />
                    </g>
                  )}

                  {/* Heatmap overlay dots */}
                  {mapMode === 'heatmap' && (
                    <g id="heatmap-group">
                      {MAP_HOTSPOTS.map(h => {
                        let dotColor = 'rgba(16, 185, 129, 0.45)'; // high coverage Green
                        if (heatmapType === 'coverage') {
                          if (h.coverage < 60) dotColor = 'rgba(239, 68, 68, 0.5)';
                          else if (h.coverage < 80) dotColor = 'rgba(245, 158, 11, 0.5)';
                        } else if (heatmapType === 'population') {
                          if (h.name === 'Uttar Pradesh' || h.name === 'Maharashtra') dotColor = 'rgba(239, 68, 68, 0.5)';
                          else dotColor = 'rgba(59, 130, 246, 0.4)';
                        } else {
                          // Verification
                          dotColor = 'rgba(139, 92, 246, 0.45)';
                        }
                        return (
                          <circle 
                            key={h.id} 
                            cx={h.cx} 
                            cy={h.cy} 
                            r={h.r * 1.3} 
                            fill={dotColor} 
                            filter="blur(4px)" 
                          />
                        );
                      })}
                    </g>
                  )}

                  {/* District lines / icons */}
                  {mapLayers.districts && (
                    <g id="district-nodes">
                      {/* South Delhi */}
                      <line x1="290" y1="150" x2="315" y2="170" stroke="#ff9933" strokeDasharray="3,3" strokeWidth={1} />
                      <circle cx="315" cy="170" r="5" fill="#0b2447" stroke="#ffffff" strokeWidth={1} />
                      
                      {/* Pune district */}
                      <circle cx="310" cy="340" r="5" fill="#0b2447" stroke="#ffffff" strokeWidth={1} />
                      
                      {/* Lucknow */}
                      <circle cx="370" cy="180" r="5" fill="#0b2447" stroke="#ffffff" strokeWidth={1} />
                    </g>
                  )}

                  {/* Active Officers Pins */}
                  {mapLayers.officers && (
                    <g id="officer-pins">
                      {/* Amit Kumar - Delhi Saket */}
                      <g transform="translate(310,165)">
                        <circle cx="0" cy="0" r="3.5" fill="#ef4444" />
                        <path d="M 0,0 L -2,-6 L 2,-6 Z" fill="#ef4444" />
                      </g>
                      {/* Anjali Desai - Colaba */}
                      <g transform="translate(265,310)">
                        <circle cx="0" cy="0" r="3.5" fill="#10b981" />
                        <path d="M 0,0 L -2,-6 L 2,-6 Z" fill="#10b981" />
                      </g>
                      {/* Vinay Shukla - Lucknow */}
                      <g transform="translate(365,175)">
                        <circle cx="0" cy="0" r="3.5" fill="#f59e0b" />
                        <path d="M 0,0 L -2,-6 L 2,-6 Z" fill="#f59e0b" />
                      </g>
                    </g>
                  )}
                </svg>
              </div>

              {/* Floating state region quick info Card */}
              {selectedMapRegion && (
                <div className="absolute bottom-4 right-4 z-20 bg-surface border border-outlineVariant/50 rounded-xl p-4 shadow-xl text-xs max-w-[240px] animate-fade-in flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-outlineVariant/20 pb-2">
                    <span className="font-bold text-primary text-sm">{selectedMapRegion.name} ({selectedMapRegion.code})</span>
                    <button onClick={() => setSelectedMapRegion(null)} className="text-onSurfaceVariant hover:text-primary font-bold text-xs"><X className="w-3.5 h-3.5" /></button>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-onSurfaceVariant">Population:</span>
                      <span className="font-semibold text-primary">{selectedMapRegion.pop}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-onSurfaceVariant">Districts Count:</span>
                      <span className="font-semibold text-primary">{selectedMapRegion.districts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-onSurfaceVariant">Census Coverage:</span>
                      <span className="font-bold text-success">{selectedMapRegion.coverage}%</span>
                    </div>
                  </div>

                  <div className="h-1.5 w-full bg-outlineVariant/30 rounded-full overflow-hidden">
                    <div className="bg-success h-full" style={{ width: `${selectedMapRegion.coverage}%` }} />
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setActiveTab('states');
                        setActiveStateDetailsId(selectedMapRegion.id);
                      }}
                      className="flex-1 text-center py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded font-bold text-[10px] transition-all"
                    >
                      Audit Details
                    </button>
                    <button 
                      onClick={() => handleOpenAssignModal('district', 'DST-104', `${selectedMapRegion.name} Zones`, 'None')}
                      className="flex-1 text-center py-1.5 bg-success text-white hover:bg-success-dark rounded font-bold text-[10px] transition-all"
                    >
                      Assign Officer
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Floating Filters Toolbar */}
            <div className="px-5 py-3.5 bg-surface-low flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-primary uppercase">State Jurisdiction</label>
                  <select 
                    value={selectedStateFilter}
                    onChange={(e) => setSelectedStateFilter(e.target.value)}
                    className="px-2 py-1 bg-surface border border-outlineVariant/50 rounded text-xs focus:ring-1 outline-none"
                  >
                    <option value="">All States</option>
                    {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-primary uppercase">Coverage Target</label>
                  <select 
                    value={coverageFilter}
                    onChange={(e) => setCoverageFilter(e.target.value)}
                    className="px-2 py-1 bg-surface border border-outlineVariant/50 rounded text-xs focus:ring-1 outline-none"
                  >
                    <option value="All">All Coverage</option>
                    <option value="High">High (&gt;80%)</option>
                    <option value="Medium">Medium (60%-80%)</option>
                    <option value="Needs Attention">Needs Attention (&lt;60%)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-primary uppercase">Search Officer Name</label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-outline absolute left-2.5 top-1.5" />
                    <input 
                      type="text"
                      placeholder="Search..."
                      value={officerSearch}
                      onChange={(e) => setOfficerSearch(e.target.value)}
                      className="pl-8 pr-2.5 py-1 bg-surface border border-outlineVariant/50 rounded text-xs focus:ring-1 outline-none w-36"
                    />
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-onSurfaceVariant font-mono bg-surface border border-outlineVariant/50 px-3 py-1 rounded">
                Displaying <span className="font-bold text-primary">{filteredDistrictsList.length}</span> Districts matching active filter
              </div>
            </div>

          </div>

          {/* SIDEBAR ANALYTICS / KPI PANELS */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* GIS SCORECARD STATUS */}
            <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
              <h4 className="font-bold text-xs text-primary uppercase tracking-wide border-b border-outlineVariant/20 pb-2">Coverage Distribution</h4>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-semibold text-primary">Delhi Central</span>
                    <span className="text-success font-bold">88%</span>
                  </div>
                  <div className="h-1.5 w-full bg-outlineVariant/20 rounded-full overflow-hidden">
                    <div className="bg-success h-full w-[88%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-semibold text-primary">Mumbai City</span>
                    <span className="text-success font-bold">92%</span>
                  </div>
                  <div className="h-1.5 w-full bg-outlineVariant/20 rounded-full overflow-hidden">
                    <div className="bg-success h-full w-[92%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-semibold text-primary">Lucknow Zone</span>
                    <span className="text-amber-500 font-bold">71%</span>
                  </div>
                  <div className="h-1.5 w-full bg-outlineVariant/20 rounded-full overflow-hidden">
                    <div className="bg-amber-50 h-full w-[71%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-semibold text-primary">Jaipur Zonal</span>
                    <span className="text-red-500 font-bold">58%</span>
                  </div>
                  <div className="h-1.5 w-full bg-outlineVariant/20 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full w-[58%]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-outlineVariant/20 text-center">
                <div className="bg-surface-low border border-outlineVariant/30 p-2 rounded">
                  <div className="text-xs font-bold text-success">4 optimal</div>
                  <div className="text-[9px] text-onSurfaceVariant">Working Forces</div>
                </div>
                <div className="bg-surface-low border border-outlineVariant/30 p-2 rounded">
                  <div className="text-xs font-bold text-red-500">2 critical</div>
                  <div className="text-[9px] text-onSurfaceVariant">Staff Attention</div>
                </div>
              </div>
            </div>

            {/* PERFORMANCE LEADERBOARD */}
            <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
              <h4 className="font-bold text-xs text-primary uppercase tracking-wide border-b border-outlineVariant/20 pb-2">Territory Leaderboard</h4>
              
              <div className="space-y-3">
                <div className="text-[10px] font-bold text-onSurfaceVariant uppercase">Top Performing States</div>
                <div className="space-y-2">
                  {sortedStates.slice(0, 3).map((st, i) => (
                    <div key={st.id} className="flex items-center justify-between text-xs p-1.5 bg-surface-low rounded border border-outlineVariant/10">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center">#{i+1}</span>
                        <span className="font-semibold text-primary">{st.name}</span>
                      </div>
                      <span className="font-bold text-success">{st.coverage}%</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-[10px] font-bold text-onSurfaceVariant uppercase pt-2">Top Performing Districts</div>
                <div className="space-y-2">
                  {sortedDistricts.slice(0, 3).map((dst, i) => (
                    <div key={dst.id} className="flex items-center justify-between text-xs p-1.5 bg-surface-low rounded border border-outlineVariant/10">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center">#{i+1}</span>
                        <span className="font-semibold text-primary">{dst.name}</span>
                      </div>
                      <span className="font-bold text-success">{dst.coverage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS BUTTONS */}
            <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-3">
              <h4 className="font-bold text-xs text-primary uppercase tracking-wide border-b border-outlineVariant/20 pb-1.5">Quick Actions</h4>
              <button 
                onClick={() => {
                  setActiveTab('states');
                  setTimeout(() => {
                    const el = document.getElementById('create-state-form-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="w-full text-left py-2 px-3 bg-surface-low hover:bg-primary-container/20 text-xs font-semibold text-primary rounded border border-outlineVariant/30 flex items-center justify-between"
              >
                <span>Add State Zone</span>
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => {
                  setActiveTab('districts');
                  setTimeout(() => {
                    const el = document.getElementById('create-district-form-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="w-full text-left py-2 px-3 bg-surface-low hover:bg-primary-container/20 text-xs font-semibold text-primary rounded border border-outlineVariant/30 flex items-center justify-between"
              >
                <span>Add District Unit</span>
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => {
                  setActiveTab('assignments');
                }}
                className="w-full text-left py-2 px-3 bg-surface-low hover:bg-primary-container/20 text-xs font-semibold text-primary rounded border border-outlineVariant/30 flex items-center justify-between"
              >
                <span>Assign Field Officers</span>
                <UserCheck className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => {
                  setActiveTab('reports');
                }}
                className="w-full text-left py-2 px-3 bg-surface-low hover:bg-primary-container/20 text-xs font-semibold text-primary rounded border border-outlineVariant/30 flex items-center justify-between"
              >
                <span>Generate Coverage Report</span>
                <FileText className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* SECTION 6: TERRITORY HIERARCHY Explorer */}
      {activeTab === 'hierarchy' && (
        <div className="bg-surface border border-outlineVariant/50 rounded-xl p-6 shadow-sm flex flex-col gap-6">
          <div className="border-b border-outlineVariant/20 pb-4">
            <h3 className="font-bold text-lg text-primary">Territory Hierarchy Explorer</h3>
            <p className="text-xs text-onSurfaceVariant mt-1">Visualize and navigate the administrative tree-structure of census blocks down to ground level units.</p>
          </div>

          <div className="bg-surface-low border border-outlineVariant/30 rounded-xl p-4 font-mono text-xs">
            {/* Tree root */}
            <div className="space-y-1">
              <div 
                className="flex items-center gap-2 cursor-pointer hover:bg-primary-container/10 p-1.5 rounded transition-all"
                onClick={() => handleToggleTreeNode('india')}
              >
                {treeExpanded.india ? <ChevronDown className="w-4 h-4 text-[#ff9933]" /> : <ChevronRight className="w-4 h-4 text-[#ff9933]" />}
                <Globe className="w-4 h-4 text-[#0b2447]" />
                <span className="font-bold text-primary">India (National Registry)</span>
                <span className="bg-primary-container/30 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ml-2">Root Node</span>
              </div>

              {/* State Level */}
              {treeExpanded.india && (
                <div className="pl-6 border-l border-outlineVariant/30 ml-3.5 space-y-2 mt-1">
                  {states.map(state => (
                    <div key={state.id} className="space-y-1">
                      <div 
                        className="flex items-center gap-2 cursor-pointer hover:bg-primary-container/10 p-1.5 rounded transition-all"
                        onClick={() => handleToggleTreeNode(state.id)}
                      >
                        {treeExpanded[state.id] ? <ChevronDown className="w-4 h-4 text-outline" /> : <ChevronRight className="w-4 h-4 text-outline" />}
                        <Compass className="w-4 h-4 text-primary" />
                        <span className="font-bold text-primary">{state.name} ({state.code})</span>
                        <span className="text-onSurfaceVariant text-[10px]">District Count: {state.districtsCount} | Coverage: {state.coverage}%</span>
                      </div>

                      {/* District Level */}
                      {treeExpanded[state.id] && (
                        <div className="pl-6 border-l border-outlineVariant/30 ml-3.5 space-y-2 mt-1">
                          {districts.filter(d => d.stateId === state.id).map(dst => (
                            <div key={dst.id} className="space-y-1">
                              <div className="flex items-center justify-between p-1.5 bg-surface rounded hover:bg-slate-100 dark:hover:bg-[#0d1e36] border border-outlineVariant/20 transition-all">
                                <div className="flex items-center gap-2">
                                  <Grid className="w-3.5 h-3.5 text-amber-500" />
                                  <span className="font-semibold text-primary">{dst.name}</span>
                                  <span className="text-[10px] text-onSurfaceVariant">({dst.code}) - Officer: {dst.officer}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] font-bold text-success bg-green-50 px-2 py-0.5 rounded-full dark:bg-green-950/20">{dst.coverage}% Coverage</span>
                                  <button 
                                    onClick={() => handleOpenAssignModal('district', dst.id, dst.name, dst.officer)}
                                    className="px-2 py-0.5 bg-primary/5 hover:bg-primary hover:text-white rounded text-[10px] font-bold transition-all"
                                  >
                                    Reassign
                                  </button>
                                </div>
                              </div>

                              {/* Ward, Cities & Blocks representation */}
                              <div className="pl-6 border-l border-outlineVariant/30 ml-3 mt-1 space-y-1 bg-surface/30 p-2 rounded">
                                <div className="text-[10px] uppercase font-bold text-onSurfaceVariant tracking-wider">Ground Census Blocks</div>
                                {blocks.map(b => (
                                  <div key={b.blockId} className="flex items-center justify-between py-1 text-[11px] text-primary">
                                    <span className="flex items-center gap-1.5">
                                      <Layers className="w-3 h-3 text-sky-500" />
                                      {b.blockId} (Pop: {b.population})
                                    </span>
                                    <span className="text-onSurfaceVariant">Officer: {b.assignedOfficer} | Progress: {b.completion}%</span>
                                  </div>
                                ))}
                              </div>

                            </div>
                          ))}
                          {districts.filter(d => d.stateId === state.id).length === 0 && (
                            <div className="text-[11px] text-outline italic pl-4">No districts created under this state zone yet.</div>
                          )}
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: STATE ZONE MANAGEMENT */}
      {activeTab === 'states' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* STATE ZONE LIST */}
          <div className="lg:col-span-2 bg-surface border border-outlineVariant/50 rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <div className="border-b border-outlineVariant/20 pb-4">
              <h3 className="font-bold text-lg text-primary">State Zones Registry</h3>
              <p className="text-xs text-onSurfaceVariant mt-1">Manage and audit state-level census territories. States are the highest administrative division.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {states.map(state => (
                <div 
                  key={state.id} 
                  onClick={() => handleSelectMapState(state)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-3 ${
                    activeStateDetailsId === state.id 
                      ? 'border-primary bg-primary-container/10 shadow-sm' 
                      : 'border-outlineVariant/50 bg-surface hover:border-primary/45'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-outlineVariant/20 pb-2">
                    <div>
                      <h4 className="font-bold text-primary text-base">{state.name}</h4>
                      <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">{state.category} ({state.code})</span>
                    </div>
                    <span className="text-xs text-onSurfaceVariant font-bold">{state.capital}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-onSurfaceVariant block text-[10px] uppercase">Population</span>
                      <strong className="text-primary">{state.population}</strong>
                    </div>
                    <div>
                      <span className="text-onSurfaceVariant block text-[10px] uppercase">Districts</span>
                      <strong className="text-primary">{state.districtsCount}</strong>
                    </div>
                    <div>
                      <span className="text-onSurfaceVariant block text-[10px] uppercase">Workforce</span>
                      <strong className="text-primary">{state.officersCount} Officers</strong>
                    </div>
                    <div>
                      <span className="text-onSurfaceVariant block text-[10px] uppercase">Completed Goal</span>
                      <strong className="text-success">{state.coverage}%</strong>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span>Census Audit Progress</span>
                      <span className="font-bold text-primary">{state.coverage}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-outlineVariant/30 rounded-full overflow-hidden">
                      <div className="bg-success h-full" style={{ width: `${state.coverage}%` }} />
                    </div>
                  </div>

                  <div className="border-t border-outlineVariant/20 pt-2.5 flex items-center justify-between text-[11px] text-onSurfaceVariant">
                    <span>Admin: <strong className="text-primary">{state.admin}</strong></span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchiveState(state.id, state.name);
                      }}
                      className="text-red-500 hover:text-red-700 font-bold hover:underline"
                    >
                      Archive Zone
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STATE ZONE FORMS & EDIT PANEL */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* EDIT STATE ZONE DETAILS */}
            {editStateId && (
              <div className="bg-surface border border-primary/40 rounded-xl p-5 shadow-sm flex flex-col gap-4 animate-fade-in">
                <div className="border-b border-outlineVariant/20 pb-2 flex justify-between items-center">
                  <h4 className="font-bold text-xs text-primary uppercase tracking-wide">Edit State Zone</h4>
                  <button onClick={() => setEditStateId(null)} className="text-onSurfaceVariant hover:text-primary font-bold text-xs"><X className="w-4 h-4" /></button>
                </div>

                <form onSubmit={handleEditStateSubmit} className="space-y-3.5 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[9px]">State Name</label>
                    <input 
                      type="text" 
                      value={editStateForm.name} 
                      onChange={(e) => setEditStateForm({ ...editStateForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[9px]">Population Estimate</label>
                    <input 
                      type="text" 
                      value={editStateForm.population} 
                      onChange={(e) => setEditStateForm({ ...editStateForm, population: e.target.value })}
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[9px]">Assigned Administrator</label>
                    <input 
                      type="text" 
                      value={editStateForm.admin} 
                      onChange={(e) => setEditStateForm({ ...editStateForm, admin: e.target.value })}
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-primary uppercase text-[9px]">Coverage Goal</label>
                      <input 
                        type="number" 
                        value={editStateForm.goal} 
                        onChange={(e) => setEditStateForm({ ...editStateForm, goal: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-primary uppercase text-[9px]">Status</label>
                      <select 
                        value={editStateForm.status} 
                        onChange={(e) => setEditStateForm({ ...editStateForm, status: e.target.value })}
                        className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                      >
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="flex-1 py-2 bg-primary text-white hover:bg-primary-light rounded font-bold transition-all cursor-pointer">Save Changes</button>
                    <button type="button" onClick={() => setEditStateId(null)} className="flex-1 py-2 bg-surface-low hover:bg-slate-100 border border-outlineVariant/50 rounded font-bold transition-all">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* CREATE STATE ZONE */}
            <div id="create-state-form-section" className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
              <h4 className="font-bold text-xs text-primary uppercase tracking-wide border-b border-outlineVariant/20 pb-2 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#ff9933]" /> Create State Zone
              </h4>

              <form onSubmit={handleCreateState} className="space-y-3.5 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase text-[9px]">State Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Haryana" 
                    value={stateForm.name}
                    onChange={(e) => setStateForm({ ...stateForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[9px]">State Code</label>
                    <input 
                      type="text" 
                      placeholder="e.g. HR" 
                      maxLength={2}
                      value={stateForm.code}
                      onChange={(e) => setStateForm({ ...stateForm, code: e.target.value })}
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[9px]">State Capital</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Chandigarh" 
                      value={stateForm.capital}
                      onChange={(e) => setStateForm({ ...stateForm, capital: e.target.value })}
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[9px]">Population Est.</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 28 Million" 
                      value={stateForm.population}
                      onChange={(e) => setStateForm({ ...stateForm, population: e.target.value })}
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[9px]">Region Category</label>
                    <select 
                      value={stateForm.category}
                      onChange={(e) => setStateForm({ ...stateForm, category: e.target.value })}
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                    >
                      <option value="General State">General State</option>
                      <option value="Union Territory">Union Territory</option>
                      <option value="Special Autonomous">Special Autonomous</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase text-[9px]">Assign State Administrator</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Commissioner Rajesh" 
                    value={stateForm.admin}
                    onChange={(e) => setStateForm({ ...stateForm, admin: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2 bg-primary text-white hover:bg-primary-light rounded font-bold transition-all shadow active:scale-95 cursor-pointer text-xs"
                >
                  Create State Zone
                </button>
              </form>
            </div>

          </div>

        </div>
      )}

      {/* SECTION 4: DISTRICT MANAGEMENT */}
      {activeTab === 'districts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* DISTRICTS DATATABLE LIST */}
          <div className="lg:col-span-2 bg-surface border border-outlineVariant/50 rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outlineVariant/20 pb-4">
              <div>
                <h3 className="font-bold text-lg text-primary">District Jurisdictions</h3>
                <p className="text-xs text-onSurfaceVariant mt-0.5">Manage districts under states and allocate supervising Census Officers.</p>
              </div>

              {/* District specific filters */}
              <div className="flex items-center gap-2">
                <select 
                  value={selectedStateFilter}
                  onChange={(e) => setSelectedStateFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-surface border border-outlineVariant/50 rounded text-xs outline-none"
                >
                  <option value="">All States</option>
                  {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-low border-b border-outlineVariant/30 text-onSurfaceVariant font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">District</th>
                    <th className="py-3 px-4">Parent State</th>
                    <th className="py-3 px-4">Supervising Officer</th>
                    <th className="py-3 px-4">Target Coverage</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outlineVariant/20">
                  {filteredDistrictsList.map(dst => (
                    <tr key={dst.id} className="hover:bg-primary-container/5 transition-colors">
                      <td className="py-3 px-4 font-semibold text-primary">
                        <div>{dst.name}</div>
                        <span className="text-[10px] text-onSurfaceVariant font-mono">ID: {dst.id} ({dst.code})</span>
                      </td>
                      <td className="py-3 px-4 font-medium text-primary">{dst.stateName}</td>
                      <td className="py-3 px-4 font-semibold text-primary">
                        <span className={dst.officer === 'None' ? 'text-red-500 italic' : ''}>{dst.officer}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${dst.coverage >= 80 ? 'text-success' : dst.coverage >= 60 ? 'text-amber-500' : 'text-red-500'}`}>{dst.coverage}%</span>
                          <div className="h-1.5 w-16 bg-outlineVariant/20 rounded-full overflow-hidden hidden sm:block">
                            <div className={`h-full ${dst.coverage >= 80 ? 'bg-success' : dst.coverage >= 60 ? 'bg-amber-50' : 'bg-red-500'}`} style={{ width: `${dst.coverage}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex gap-1 justify-center">
                          <button 
                            onClick={() => handleOpenAssignModal('district', dst.id, dst.name, dst.officer)}
                            className="bg-primary/5 hover:bg-primary hover:text-white px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer"
                          >
                            Assign Officer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredDistrictsList.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-onSurfaceVariant italic">No districts matching criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* CREATE DISTRICT FORM */}
          <div className="lg:col-span-1">
            <div id="create-district-form-section" className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
              <h4 className="font-bold text-xs text-primary uppercase tracking-wide border-b border-outlineVariant/20 pb-2 flex items-center gap-1.5">
                <Grid className="w-4 h-4 text-[#ff9933]" /> Create District Unit
              </h4>

              <form onSubmit={handleCreateDistrict} className="space-y-3.5 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase text-[9px]">District Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Central Pune" 
                    value={districtForm.name}
                    onChange={(e) => setDistrictForm({ ...districtForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[9px]">District Code</label>
                    <input 
                      type="text" 
                      placeholder="e.g. MH-PN2" 
                      value={districtForm.code}
                      onChange={(e) => setDistrictForm({ ...districtForm, code: e.target.value })}
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-primary uppercase text-[9px]">Parent State</label>
                    <select 
                      value={districtForm.stateId}
                      onChange={(e) => setDistrictForm({ ...districtForm, stateId: e.target.value })}
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                    >
                      <option value="">Select State...</option>
                      {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase text-[9px]">Population Estimate</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 800k" 
                    value={districtForm.population}
                    onChange={(e) => setDistrictForm({ ...districtForm, population: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-primary uppercase text-[9px]">Assign Zonal Officer</label>
                  <select 
                    value={districtForm.officer}
                    onChange={(e) => setDistrictForm({ ...districtForm, officer: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                  >
                    <option value="">Choose Officer...</option>
                    {officers.map(o => <option key={o.id} value={o.name}>{o.name} ({o.designation})</option>)}
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2 bg-primary text-white hover:bg-primary-light rounded font-bold transition-all shadow active:scale-95 cursor-pointer text-xs"
                >
                  Create District Unit
                </button>
              </form>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 5: AREA ASSIGNMENTS (Ground levels) */}
      {activeTab === 'assignments' && (
        <div className="flex flex-col gap-8">
          
          {/* GRASSROOTS SUBSECTION ASSIGNMENT CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* VILLAGES CARD MANAGEMENT */}
            <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
              <div className="border-b border-outlineVariant/20 pb-2">
                <span className="font-bold text-xs text-primary uppercase tracking-wide">Assign Villages</span>
                <p className="text-[10px] text-onSurfaceVariant mt-0.5">Grassroots Gram Panchayat allocations</p>
              </div>

              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {villages.map(vil => (
                  <div key={vil.id} className="p-3 bg-surface-low border border-outlineVariant/30 rounded-lg flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-primary text-xs">{vil.name} Village</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        vil.status === 'Completed' ? 'bg-green-50 text-green-700' :
                        vil.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-500'
                      }`}>
                        {vil.status} ({vil.coverage}%)
                      </span>
                    </div>
                    <div className="text-[10px] text-onSurfaceVariant flex justify-between">
                      <span>Officer: <strong className="text-primary">{vil.officer}</strong></span>
                      <span>Pop: {vil.population}</span>
                    </div>
                    <div className="flex gap-2.5 pt-1.5 border-t border-outlineVariant/20 mt-1">
                      <button 
                        onClick={() => handleOpenAssignModal('village', vil.id, vil.name, vil.officer)}
                        className="flex-1 py-1 bg-primary/5 hover:bg-primary hover:text-white rounded text-[10px] font-bold transition-all text-center"
                      >
                        Reassign
                      </button>
                      {vil.officer !== 'Unassigned' && (
                        <button 
                          onClick={() => {
                            setAssignmentTarget({ type: 'village', id: vil.id, name: vil.name, currentOfficer: vil.officer });
                            handleConfirmAssignment('Unassigned');
                          }}
                          className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-500 rounded text-[10px] font-bold transition-all"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CITIES CARD MANAGEMENT */}
            <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
              <div className="border-b border-outlineVariant/20 pb-2">
                <span className="font-bold text-xs text-primary uppercase tracking-wide">Assign Cities</span>
                <p className="text-[10px] text-onSurfaceVariant mt-0.5">Municipal & urban territorial census blocks</p>
              </div>

              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {cities.map(cit => (
                  <div key={cit.id} className="p-3 bg-surface-low border border-outlineVariant/30 rounded-lg flex flex-col gap-2">
                    <div className="flex justify-between items-center border-b border-outlineVariant/10 pb-1.5">
                      <span className="font-bold text-primary text-xs">{cit.name}</span>
                      <span className="font-bold text-success text-[10px]">{cit.coveragePercentage}%</span>
                    </div>
                    <div className="text-[10px] text-onSurfaceVariant space-y-1">
                      <div className="flex justify-between"><span>Active Officers:</span> <strong className="text-primary">{cit.officerCount}</strong></div>
                      <div className="flex justify-between"><span>Metropolis Pop:</span> <strong className="text-primary">{cit.population}</strong></div>
                    </div>
                    <button 
                      onClick={() => setFeedback({ type: 'success', message: `Redirection to Municipal ward division mapping for ${cit.name}.` })}
                      className="w-full py-1 bg-primary/5 hover:bg-primary hover:text-white rounded text-[10px] font-bold transition-all text-center mt-1"
                    >
                      Audit Municipal Blocks
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* WARD TABLE LIST */}
            <div className="bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4 lg:col-span-2">
              <div className="border-b border-outlineVariant/20 pb-2 flex justify-between items-center">
                <div>
                  <span className="font-bold text-xs text-primary uppercase tracking-wide">Assign Wards</span>
                  <p className="text-[10px] text-onSurfaceVariant mt-0.5">Ward-level administrative operations</p>
                </div>
              </div>

              <div className="overflow-x-auto max-h-[300px] overflow-y-auto pr-1">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-surface-low border-b border-outlineVariant/20 text-onSurfaceVariant font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2 px-3">Ward No</th>
                      <th className="py-2 px-3">Ward Name</th>
                      <th className="py-2 px-3">Supervisor Officer</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outlineVariant/10">
                    {wards.map(w => (
                      <tr key={w.wardNo} className="hover:bg-slate-50 dark:hover:bg-[#0d1e36]">
                        <td className="py-2.5 px-3 font-semibold text-primary">{w.wardNo}</td>
                        <td className="py-2.5 px-3 text-primary">{w.name}</td>
                        <td className="py-2.5 px-3 font-semibold text-primary">{w.assignedOfficer}</td>
                        <td className="py-2.5 px-3">
                          <span className={`font-bold ${w.coverageStatus >= 80 ? 'text-success' : 'text-amber-500'}`}>{w.coverageStatus}%</span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button 
                            onClick={() => handleOpenAssignModal('ward', w.wardNo, w.name, w.assignedOfficer)}
                            className="bg-primary/5 hover:bg-primary hover:text-white px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer"
                          >
                            Reassign
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* CENSUS BLOCKS MANAGEMENT (SMALLEST UNIT) */}
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-6 shadow-sm flex flex-col gap-4">
            <div className="border-b border-outlineVariant/20 pb-3">
              <h3 className="font-bold text-base text-primary">Assign Census Blocks</h3>
              <p className="text-xs text-onSurfaceVariant mt-0.5">Allocate operational boundaries for the smallest census unit (~1,000 residents per block ID).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {blocks.map(b => (
                <div key={b.blockId} className="bg-surface-low border border-outlineVariant/30 p-4 rounded-xl flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-primary">{b.blockId}</span>
                    <span className={`text-[10px] font-bold ${b.completion >= 80 ? 'text-success' : 'text-amber-500'}`}>{b.completion}% Done</span>
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-onSurfaceVariant">Population:</span>
                      <strong className="text-primary">{b.population}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-onSurfaceVariant">Officer:</span>
                      <strong className="text-primary">{b.assignedOfficer}</strong>
                    </div>
                  </div>

                  <div className="h-1 w-full bg-outlineVariant/20 rounded-full overflow-hidden">
                    <div className={`h-full ${b.completion >= 80 ? 'bg-success' : 'bg-amber-500'}`} style={{ width: `${b.completion}%` }} />
                  </div>

                  <button 
                    onClick={() => handleOpenAssignModal('block', b.blockId, `Census Block ${b.blockId}`, b.assignedOfficer)}
                    className="w-full py-1 bg-primary/5 hover:bg-primary hover:text-white rounded text-[10px] font-bold transition-all text-center mt-1"
                  >
                    Change Assignment
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SECTION 10 & 11: TIMELINES & REPORTS */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* REPORTS TRIGGER PANEL */}
          <div className="lg:col-span-2 bg-surface border border-outlineVariant/50 rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <div className="border-b border-outlineVariant/20 pb-4">
              <h3 className="font-bold text-lg text-primary">Territory Reports Generator</h3>
              <p className="text-xs text-onSurfaceVariant mt-1">Compile comprehensive census status files, supervisor workforce metrics, and geographic coverage sheets.</p>
            </div>

            <form onSubmit={handleGenerateReport} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase text-[9px]">Available Report Type</label>
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                >
                  <option value="State Coverage Report">State Coverage Report</option>
                  <option value="District Coverage Report">District Coverage Report</option>
                  <option value="Officer Assignment Report">Officer Assignment Report</option>
                  <option value="Population Density Report">Population Density Report</option>
                  <option value="Verification Compliance Audit">Verification Compliance Audit</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase text-[9px]">State Filter (Optional)</label>
                <select 
                  value={reportStateFilter}
                  onChange={(e) => setReportStateFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded outline-none focus:border-primary"
                >
                  <option value="">All Regions</option>
                  {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-primary uppercase text-[9px]">Export File Format</label>
                <div className="flex items-center gap-4 py-2">
                  <label className="flex items-center gap-1.5 font-semibold text-primary cursor-pointer">
                    <input type="radio" checked={reportFormat === 'PDF'} onChange={() => setReportFormat('PDF')} className="text-primary focus:ring-0" /> PDF Format
                  </label>
                  <label className="flex items-center gap-1.5 font-semibold text-primary cursor-pointer">
                    <input type="radio" checked={reportFormat === 'CSV'} onChange={() => setReportFormat('CSV')} className="text-primary focus:ring-0" /> Excel/CSV Table
                  </label>
                  <label className="flex items-center gap-1.5 font-semibold text-primary cursor-pointer">
                    <input type="radio" checked={reportFormat === 'PRINT'} onChange={() => setReportFormat('PRINT')} className="text-primary focus:ring-0" /> Local Print
                  </label>
                </div>
              </div>

              <div className="md:col-span-2 flex pt-2 gap-2">
                <button 
                  type="submit" 
                  disabled={!!reportQueue}
                  className="flex-1 py-2.5 bg-primary text-white hover:bg-primary-light disabled:bg-primary/50 font-bold rounded-lg transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  {reportQueue === 'generating' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Generating File Structure...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Compile & Download Report
                    </>
                  )}
                </button>
              </div>
            </form>

            {reportQueue === 'completed' && (
              <div className="bg-green-50 text-green-800 border border-green-200 dark:bg-green-950/20 dark:text-green-300 dark:border-green-800 p-4 rounded-lg text-xs flex items-center gap-3 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                <div>
                  <h5 className="font-bold">File Compiled Successfully</h5>
                  <p className="mt-0.5 text-[11px] text-green-700/80 dark:text-green-300/80">Simulating download for <strong>{reportType}.{reportFormat.toLowerCase()}</strong>. Saved to local storage logs.</p>
                </div>
              </div>
            )}

            {/* STATIC REPORT PREVIEWS TABLE */}
            <div className="space-y-3 mt-4">
              <h4 className="font-bold text-xs text-primary uppercase tracking-wide border-b border-outlineVariant/20 pb-1.5">Previous Generated Logs</h4>
              <div className="space-y-2">
                {[
                  { name: 'National_Coverage_Summary_Q2', format: 'PDF', date: '04 Jun 2026', size: '2.4 MB' },
                  { name: 'Delhi_Central_Census_Verification_Report', format: 'CSV', date: '01 Jun 2026', size: '15.1 MB' },
                  { name: 'Field_Supervisor_Target_Compliance', format: 'PDF', date: '28 May 2026', size: '1.8 MB' }
                ].map((log, i) => (
                  <div key={i} className="flex justify-between items-center p-2.5 bg-surface-low border border-outlineVariant/20 rounded-lg text-xs">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-outline" />
                      <div>
                        <span className="font-semibold text-primary">{log.name}.{log.format.toLowerCase()}</span>
                        <div className="text-[10px] text-onSurfaceVariant">Compiled: {log.date} | Size: {log.size}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setFeedback({ type: 'success', message: `Triggering download for compiled history file ${log.name}` })}
                      className="bg-surface hover:bg-slate-100 border border-outlineVariant/50 text-[10px] font-bold uppercase px-3 py-1 rounded"
                    >
                      Retrieve
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AUDIT ACTIVITY TIMELINE */}
          <div className="lg:col-span-1 bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h4 className="font-bold text-xs text-primary uppercase tracking-wide border-b border-outlineVariant/20 pb-2">Activity Audit Timeline</h4>
            
            <div className="space-y-4">
              {activities.map(act => {
                const Icon = act.icon;
                return (
                  <div key={act.id} className="flex gap-3 text-xs leading-relaxed items-start relative">
                    <div className="w-8 h-8 rounded-full bg-primary-container/20 border border-outlineVariant/30 flex items-center justify-center shrink-0">
                      <Icon className={`w-4 h-4 ${act.color}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <strong className="text-primary font-bold text-[11px]">{act.type}</strong>
                        <span className="text-[9px] text-onSurfaceVariant font-semibold">{act.time}</span>
                      </div>
                      <p className="text-[11px] text-onSurfaceVariant mt-0.5">{act.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* SECTION 9: GEOGRAPHIC ANALYTICS TRENDS */}
      <section className="bg-surface border border-outlineVariant/50 rounded-xl p-6 shadow-sm flex flex-col gap-6">
        <div className="border-b border-outlineVariant/20 pb-3 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-primary uppercase tracking-wide">Geographic Intelligence Analytics</h3>
            <p className="text-xs text-onSurfaceVariant">State population distributions and monthly registration completion curves.</p>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-success bg-green-50 px-3 py-1 rounded-full dark:bg-green-950/20">
            <Activity className="w-3.5 h-3.5" /> Live Trend Tracker
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Custom SVG Bar Chart: Population Distribution */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-primary uppercase tracking-wider text-[10px]">Population Density by Zone (in Millions)</span>
            <div className="bg-surface-low border border-outlineVariant/20 p-4 rounded-xl flex flex-col justify-between h-[200px]">
              <svg viewBox="0 0 400 160" className="w-full h-full">
                {/* Y-axis gridlines */}
                <line x1="40" y1="20" x2="380" y2="20" stroke="#cbd5e1" strokeWidth={0.5} strokeDasharray="2,2" />
                <line x1="40" y1="60" x2="380" y2="60" stroke="#cbd5e1" strokeWidth={0.5} strokeDasharray="2,2" />
                <line x1="40" y1="100" x2="380" y2="100" stroke="#cbd5e1" strokeWidth={0.5} strokeDasharray="2,2" />
                <line x1="40" y1="140" x2="380" y2="140" stroke="#94a3b8" strokeWidth={1} />
                
                {/* Bars */}
                {/* UP - 241M */}
                <rect x="65" y="25" width="25" height="115" fill="#ff9933" rx={2} className="hover:opacity-80 transition-opacity cursor-pointer" />
                {/* Maha - 126M */}
                <rect x="125" y="65" width="25" height="75" fill="#138808" rx={2} className="hover:opacity-80 transition-opacity cursor-pointer" />
                {/* Raj - 81M */}
                <rect x="185" y="85" width="25" height="55" fill="#0b2447" rx={2} className="hover:opacity-80 transition-opacity cursor-pointer" />
                {/* TN - 76M */}
                <rect x="245" y="90" width="25" height="50" fill="#3b82f6" rx={2} className="hover:opacity-80 transition-opacity cursor-pointer" />
                {/* Kar - 68M */}
                <rect x="305" y="95" width="25" height="45" fill="#a855f7" rx={2} className="hover:opacity-80 transition-opacity cursor-pointer" />

                {/* X-axis labels */}
                <text x="77" y="152" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">UP</text>
                <text x="137" y="152" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">MH</text>
                <text x="197" y="152" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">RJ</text>
                <text x="257" y="152" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">TN</text>
                <text x="317" y="152" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">KA</text>

                {/* Y-axis labels */}
                <text x="32" y="23" textAnchor="end" fontSize="8" fill="#64748b">250M</text>
                <text x="32" y="63" textAnchor="end" fontSize="8" fill="#64748b">150M</text>
                <text x="32" y="103" textAnchor="end" fontSize="8" fill="#64748b">80M</text>
                <text x="32" y="143" textAnchor="end" fontSize="8" fill="#64748b">0</text>
              </svg>
            </div>
          </div>

          {/* Custom SVG Line Chart: Coverage Trends */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-primary uppercase tracking-wider text-[10px]">Monthly National Census Coverage Goal Curve (%)</span>
            <div className="bg-surface-low border border-outlineVariant/20 p-4 rounded-xl flex flex-col justify-between h-[200px]">
              <svg viewBox="0 0 400 160" className="w-full h-full">
                {/* Gridlines */}
                <line x1="40" y1="20" x2="380" y2="20" stroke="#cbd5e1" strokeWidth={0.5} strokeDasharray="2,2" />
                <line x1="40" y1="60" x2="380" y2="60" stroke="#cbd5e1" strokeWidth={0.5} strokeDasharray="2,2" />
                <line x1="40" y1="100" x2="380" y2="100" stroke="#cbd5e1" strokeWidth={0.5} strokeDasharray="2,2" />
                <line x1="40" y1="140" x2="380" y2="140" stroke="#94a3b8" strokeWidth={1} />
                
                {/* Trend line */}
                <path 
                  d="M 65,130 L 125,110 L 185,90 L 245,60 L 305,40" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth={2.5} 
                />
                
                {/* Dot Markers */}
                <circle cx="65" cy="130" r="3.5" fill="#10b981" stroke="#ffffff" strokeWidth={1} />
                <circle cx="125" cy="110" r="3.5" fill="#10b981" stroke="#ffffff" strokeWidth={1} />
                <circle cx="185" cy="90" r="3.5" fill="#10b981" stroke="#ffffff" strokeWidth={1} />
                <circle cx="245" cy="60" r="3.5" fill="#10b981" stroke="#ffffff" strokeWidth={1} />
                <circle cx="305" cy="40" r="3.5" fill="#10b981" stroke="#ffffff" strokeWidth={1} />

                {/* X-axis labels */}
                <text x="65" y="152" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">Feb</text>
                <text x="125" y="152" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">Mar</text>
                <text x="185" y="152" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">Apr</text>
                <text x="245" y="152" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">May</text>
                <text x="305" y="152" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">Jun</text>

                {/* Y-axis labels */}
                <text x="32" y="23" textAnchor="end" fontSize="8" fill="#64748b">100%</text>
                <text x="32" y="63" textAnchor="end" fontSize="8" fill="#64748b">60%</text>
                <text x="32" y="103" textAnchor="end" fontSize="8" fill="#64748b">30%</text>
                <text x="32" y="143" textAnchor="end" fontSize="8" fill="#64748b">0%</text>
              </svg>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 13: HELP DESK / FAQS / SUPPORT BOT */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* FAQS & DOCUMENTATION LIST */}
        <div className="lg:col-span-2 bg-surface border border-outlineVariant/50 rounded-xl p-6 shadow-sm flex flex-col gap-5">
          <div className="border-b border-outlineVariant/20 pb-3">
            <h3 className="font-bold text-base text-primary uppercase tracking-wide">GIS Knowledge Base & Guides</h3>
            <p className="text-xs text-onSurfaceVariant">Standard operational guides for territory configuration and boundary assignments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Frequently Asked Questions</span>
              <div className="space-y-3">
                {FAQS.map((faq, i) => (
                  <div key={i} className="text-xs space-y-1.5 p-3 bg-surface-low border border-outlineVariant/20 rounded-lg">
                    <strong className="text-primary font-bold flex items-start gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" /> {faq.q}
                    </strong>
                    <p className="text-onSurfaceVariant leading-relaxed pl-4.5">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Territory Documentation links</span>
              <div className="space-y-2">
                {[
                  { title: 'Standard Zonal Shapefile Specifications (V4.2)', author: 'National Informatics Centre' },
                  { title: 'Ground Census Block Allocation Rules', author: 'Registrar General Office' },
                  { title: 'Staff Relocation & Ownership Transfer Protocols', author: 'Workforce Planning Division' }
                ].map((doc, i) => (
                  <div key={i} className="p-3 bg-surface-low border border-outlineVariant/20 hover:border-primary/40 rounded-lg flex justify-between items-start gap-2.5 transition-all text-xs">
                    <div className="space-y-1">
                      <strong className="font-bold text-primary block leading-snug">{doc.title}</strong>
                      <span className="text-[9px] text-onSurfaceVariant uppercase font-bold">{doc.author}</span>
                    </div>
                    <button 
                      onClick={() => setFeedback({ type: 'success', message: `Accessing guide: ${doc.title}` })}
                      className="text-primary hover:underline font-semibold shrink-0 text-[11px]"
                    >
                      Open Document
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* LIVE SUPPORT CHAT BOT */}
        <div className="lg:col-span-1 bg-surface border border-outlineVariant/50 rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <div className="border-b border-outlineVariant/20 pb-2">
            <h4 className="font-bold text-xs text-primary uppercase tracking-wide">GIS Live Support Bot</h4>
            <p className="text-[10px] text-onSurfaceVariant">Immediate queries solver for administration portals.</p>
          </div>

          <div className="bg-surface-low border border-outlineVariant/20 rounded-xl p-3 h-[200px] overflow-y-auto flex flex-col gap-2.5">
            {chatMessages.map((m, i) => (
              <div key={i} className={`p-2.5 rounded-lg text-xs leading-relaxed max-w-[85%] ${
                m.sender.startsWith('You') 
                  ? 'bg-primary text-white ml-auto' 
                  : 'bg-surface border border-outlineVariant/20 mr-auto text-primary'
              }`}>
                <div className="text-[8px] opacity-70 uppercase font-bold mb-0.5">{m.sender}</div>
                <div>{m.text}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChatMessage} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Ask about GIS import, block IDs..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-surface border border-outlineVariant/50 rounded-lg text-xs outline-none focus:border-primary"
            />
            <button type="submit" className="bg-primary text-white hover:bg-primary-light px-3.5 py-1.5 rounded-lg flex items-center justify-center cursor-pointer">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </section>

      {/* OFFICER ASSIGNMENT MODAL */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-outlineVariant/50 rounded-xl p-6 shadow-2xl max-w-md w-full flex flex-col gap-4 animate-fade-in text-xs">
            <div className="flex justify-between items-center border-b border-outlineVariant/20 pb-3">
              <h4 className="font-bold text-sm text-primary uppercase tracking-wide">Assign responsible officer</h4>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-onSurfaceVariant hover:text-primary font-bold"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-1.5">
              <p className="text-onSurfaceVariant font-medium">Configure administrative allocation for:</p>
              <div className="p-3 bg-surface-low border border-outlineVariant/30 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-bold text-primary capitalize">{assignmentTarget.type}:</span>
                  <strong className="text-primary">{assignmentTarget.name}</strong>
                </div>
                <div className="flex justify-between mt-1 text-[11px]">
                  <span className="text-onSurfaceVariant">Current Assignment:</span>
                  <span className="font-semibold text-primary">{assignmentTarget.currentOfficer}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-primary uppercase text-[9px]">Select Officer from workforce</label>
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-outline absolute left-2.5 top-2" />
                <input 
                  type="text"
                  placeholder="Filter officers by name/district..."
                  value={assignOfficerSearch}
                  onChange={(e) => setAssignOfficerSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 w-full bg-surface border border-outlineVariant/50 rounded outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                {/* None Option */}
                <div 
                  onClick={() => handleConfirmAssignment(assignmentTarget.type === 'village' ? 'Unassigned' : 'None')}
                  className="p-2 border border-outlineVariant/20 hover:border-red-400 bg-red-50/10 rounded cursor-pointer transition-colors flex justify-between items-center font-bold text-red-500"
                >
                  <span>Revoke / Leave Unassigned</span>
                  <X className="w-3.5 h-3.5" />
                </div>
                
                {/* Officer Options */}
                {officers.filter(o => 
                  o.name.toLowerCase().includes(assignOfficerSearch.toLowerCase()) ||
                  o.district.toLowerCase().includes(assignOfficerSearch.toLowerCase())
                ).map(o => (
                  <div 
                    key={o.id}
                    onClick={() => handleConfirmAssignment(o.name)}
                    className="p-2 border border-outlineVariant/20 hover:border-primary bg-surface hover:bg-slate-50 dark:hover:bg-[#0d1e36] rounded cursor-pointer transition-colors flex justify-between items-center"
                  >
                    <div>
                      <strong className="text-primary font-bold block">{o.name}</strong>
                      <span className="text-[10px] text-onSurfaceVariant">{o.designation} • {o.district}</span>
                    </div>
                    <span className="text-[10px] font-bold text-success bg-green-50 px-2 py-0.5 rounded-full dark:bg-green-950/20">{o.accuracy}% Acc</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-outlineVariant/20 pt-3 flex gap-2 justify-end">
              <button 
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 bg-surface hover:bg-slate-100 border border-outlineVariant/50 rounded-lg font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TerritoryManagement;
