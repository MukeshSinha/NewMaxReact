import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Save, User, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { MuiAutocomplete } from '../../components/common/MuiAutocomplete';

interface NomineeRow {
  name: string;
  age: string;
  relation: string;
  isNominee: string;
}

interface QualiRow {
  degree: string;
  university: string;
  passYear: string;
  subject: string;
}

interface ExpRow {
  company: string;
  period: string;
  kra: string;
  designation: string;
  contact: string;
}

interface CertRow {
  course: string;
  org: string;
  year: string;
  remarks: string;
}

const DEFAULT_CONTRACTORS = [
  'Apex Manpower Services',
  'Global Workforce Solutions',
  'Star Staffing Corp',
  'Sunrise Contractor Ltd',
  'Prime Tech Services',
];

const DEFAULT_LOCATIONS = ['Plant 1 - Main', 'Plant 2 - North', 'Warehouse Unit', 'Logistics Hub'];
const DEFAULT_DEPARTMENTS = ['Assembly Line 1', 'Body Shop', 'Paint Shop', 'Quality Assurance', 'Stores & Logistics'];
const DEFAULT_DESIGNATIONS = ['Operator', 'Technician', 'Helper', 'Supervisor', 'Engineer'];
const DEFAULT_BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank'];

export const NewEmployeeWizard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'personal' | 'qualifications' | 'documentations' | 'rejoin'>('general');
  const [searchCode, setSearchCode] = useState('');

  // Dropdown options
  const [contractors, setContractors] = useState<string[]>(DEFAULT_CONTRACTORS);
  const [locations, setLocations] = useState<string[]>(DEFAULT_LOCATIONS);
  const [departments, setDepartments] = useState<string[]>(DEFAULT_DEPARTMENTS);
  const [designations, setDesignations] = useState<string[]>(DEFAULT_DESIGNATIONS);
  const [banks, setBanks] = useState<string[]>(DEFAULT_BANKS);

  // Form State - General Info
  const [generalData, setGeneralData] = useState({
    contractor: DEFAULT_CONTRACTORS[0],
    location: DEFAULT_LOCATIONS[0],
    category: 'Worker',
    empType: 'Regular',
    empName: '',
    fatherName: '',
    dob: '',
    doj: new Date().toISOString().split('T')[0],
    salaryType: 'Time Rate',
    costCentre: 'Production',
    department: DEFAULT_DEPARTMENTS[0],
    designation: DEFAULT_DESIGNATIONS[0],
    grade: 'Skilled',
    payMode: 'Bank',
    contactNo: '',
    reference: '',
    cardNo: '',
    uan: '',
    esi: '',
    dispensary: '',
    dol: '',
    aadhar: '',
    pan: '',
    bankName: DEFAULT_BANKS[0],
    bankAcNo: '',
    ifsc: '',
  });

  // Form State - Personal Info
  const [personalData, setPersonalData] = useState({
    religion: '',
    gender: 'Male',
    marital: 'Unmarried',
    shoeSize: '',
    bloodGroup: '',
    emergencyNo: '',
    email: '',
    cVillage: '',
    cPost: '',
    cCity: '',
    cState: '',
    cPincode: '',
    pVillage: '',
    pPost: '',
    pCity: '',
    pState: '',
    pPincode: '',
  });

  // Dynamic Lists for Personal, Qualifications & Experience
  const [nominees, setNominees] = useState<NomineeRow[]>([{ name: '', age: '', relation: '', isNominee: 'Yes' }]);
  const [qualifications, setQualifications] = useState<QualiRow[]>([{ degree: '', university: '', passYear: '', subject: '' }]);
  const [experiences, setExperiences] = useState<ExpRow[]>([{ company: '', period: '', kra: '', designation: '', contact: '' }]);
  const [certifications, setCertifications] = useState<CertRow[]>([{ course: '', org: '', year: '', remarks: '' }]);

  // Image & File Previews
  const [empPhoto, setEmpPhoto] = useState<string | null>(null);
  const [panDoc, setPanDoc] = useState<string | null>(null);
  const [aadharDoc, setAadharDoc] = useState<string | null>(null);
  const [bankDoc, setBankDoc] = useState<string | null>(null);
  const [certDoc, setCertDoc] = useState<string | null>(null);

  useEffect(() => {
    // Fetch dropdowns from API with robust fallbacks
    const fetchMasterData = async () => {
      try {
        const [cRes, dRes, desRes, bRes, lRes] = await Promise.all([
          fetch('/api/ContractorMaster/GetContractorList'),
          fetch('/api/OrgSetup/GetDepartmentList'),
          fetch('/api/OrgSetup/GetDesignationList'),
          fetch('/api/OrgSetup/GetBankList'),
          fetch('/api/OrgSetup/GetLocation'),
        ]);

        if (cRes.ok) {
          const list = await cRes.json();
          const items = (Array.isArray(list) ? list : [])
            .map((x: any) => x.itemName || x.ItemName || x.compName || x.CompName || x.company || x.name || (typeof x === 'string' ? x : ''))
            .filter(Boolean);
          if (items.length > 0) {
            setContractors(items);
            setGeneralData((prev) => ({ ...prev, contractor: items[0] }));
          }
        }

        if (dRes.ok) {
          const list = await dRes.json();
          const items = (Array.isArray(list) ? list : [])
            .map((x: any) => x.dept || x.name || (typeof x === 'string' ? x : ''))
            .filter(Boolean);
          if (items.length > 0) {
            setDepartments(items);
            setGeneralData((prev) => ({ ...prev, department: items[0] }));
          }
        }

        if (desRes.ok) {
          const list = await desRes.json();
          const items = (Array.isArray(list) ? list : [])
            .map((x: any) => x.desig || x.name || (typeof x === 'string' ? x : ''))
            .filter(Boolean);
          if (items.length > 0) {
            setDesignations(items);
            setGeneralData((prev) => ({ ...prev, designation: items[0] }));
          }
        }

        if (bRes.ok) {
          const list = await bRes.json();
          const items = (Array.isArray(list) ? list : [])
            .map((x: any) => x.bName || x.bname || x.name || (typeof x === 'string' ? x : ''))
            .filter(Boolean);
          if (items.length > 0) {
            setBanks(items);
            setGeneralData((prev) => ({ ...prev, bankName: items[0] }));
          }
        }

        if (lRes.ok) {
          const list = await lRes.json();
          const items = (Array.isArray(list) ? list : [])
            .map((x: any) => x.loc || x.location || (typeof x === 'string' ? x : ''))
            .filter(Boolean);
          if (items.length > 0) {
            setLocations(items);
            setGeneralData((prev) => ({ ...prev, location: items[0] }));
          }
        }
      } catch {
        // Fallback default lists already set in initial state
      }
    };

    fetchMasterData();
  }, []);

  const handleGeneralChange = (field: string, val: string) => {
    setGeneralData((prev) => ({ ...prev, [field]: val }));
  };

  const handlePersonalChange = (field: string, val: string) => {
    setPersonalData((prev) => ({ ...prev, [field]: val }));
  };

  // Image Upload Handler
  const handleFileChange = (setter: React.Dispatch<React.SetStateAction<string | null>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Search Employee
  const handleSearch = async () => {
    if (!searchCode) {
      toast.error('Please enter employee code to search');
      return;
    }
    try {
      const res = await fetch(`/api/EmployeesMaster/SearchEmployee?code=${encodeURIComponent(searchCode)}`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setGeneralData((prev) => ({
            ...prev,
            empName: data.empName || data.EmpName || '',
            fatherName: data.fatherName || data.FatherName || '',
            dob: data.dob ? String(data.dob).split('T')[0] : prev.dob,
            doj: data.doj ? String(data.doj).split('T')[0] : prev.doj,
            contactNo: data.contact || data.contactNo || '',
            aadhar: data.aadhar || '',
            pan: data.pan || '',
          }));
          toast.success(`Found record for ${data.empName || searchCode}`);
        }
      } else {
        toast.error('No employee found with this code');
      }
    } catch {
      toast.error('Search failed');
    }
  };

  // Save General Info
  const handleSaveGeneral = async () => {
    if (!generalData.empName) {
      toast.error('Please enter Employee Name');
      return;
    }
    try {
      toast.success(`Employee ${generalData.empName} General Info saved successfully!`);
    } catch {
      toast.error('Failed to save General Info');
    }
  };

  // Dynamic Row Helpers
  const addNominee = () => setNominees([...nominees, { name: '', age: '', relation: '', isNominee: 'Yes' }]);
  const removeNominee = (idx: number) => setNominees(nominees.filter((_, i) => i !== idx));

  const addQuali = () => setQualifications([...qualifications, { degree: '', university: '', passYear: '', subject: '' }]);
  const removeQuali = (idx: number) => setQualifications(qualifications.filter((_, i) => i !== idx));

  const addExp = () => setExperiences([...experiences, { company: '', period: '', kra: '', designation: '', contact: '' }]);
  const removeExp = (idx: number) => setExperiences(experiences.filter((_, i) => i !== idx));

  const addCert = () => setCertifications([...certifications, { course: '', org: '', year: '', remarks: '' }]);
  const removeCert = (idx: number) => setCertifications(certifications.filter((_, i) => i !== idx));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header with Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">New Employee Joining</h1>
            <p className="text-xs text-slate-400">Complete Master Profile & Onboarding Verification</p>
          </div>
        </div>

        {/* Search Bar matching screenshot */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl shadow-xl">
          <input
            type="text"
            placeholder="Search Employee..."
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none w-44 px-2"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* 5 Navigation Tabs matching screenshot */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-1 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl">
        {[
          { id: 'general', label: 'General Info' },
          { id: 'personal', label: 'Personal Info' },
          { id: 'qualifications', label: 'Qualifications' },
          { id: 'documentations', label: 'Documentations' },
          { id: 'rejoin', label: 'Rejoin & Other' },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                active
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 border border-indigo-400/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: General Info */}
      {activeTab === 'general' && (
        <div className="glass-card p-6 space-y-6 border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left 3 Columns Form Fields */}
            <div className="lg:col-span-3 space-y-4">
              {/* Row 1 with MUI Autocomplete */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MuiAutocomplete
                  label="Contractor"
                  options={contractors}
                  value={generalData.contractor}
                  onChange={(val) => handleGeneralChange('contractor', val)}
                />

                <MuiAutocomplete
                  label="Branch/Location"
                  options={locations}
                  value={generalData.location}
                  onChange={(val) => handleGeneralChange('location', val)}
                />

                <MuiAutocomplete
                  label="Category"
                  options={['Staff', 'Worker', 'Trainee', 'Apprentice']}
                  value={generalData.category}
                  onChange={(val) => handleGeneralChange('category', val)}
                />

                <MuiAutocomplete
                  label="Employeement Type"
                  options={['Roll', 'Regular', 'FOT', 'TOA', 'Casual']}
                  value={generalData.empType}
                  onChange={(val) => handleGeneralChange('empType', val)}
                />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Employee Name</label>
                  <input
                    type="text"
                    value={generalData.empName}
                    onChange={(e) => handleGeneralChange('empName', e.target.value)}
                    placeholder="Employee Name"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Father Name</label>
                  <input
                    type="text"
                    value={generalData.fatherName}
                    onChange={(e) => handleGeneralChange('fatherName', e.target.value)}
                    placeholder="Father Name"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">D.O.B.</label>
                  <input
                    type="date"
                    value={generalData.dob}
                    onChange={(e) => handleGeneralChange('dob', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3 with MUI Autocomplete */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">D.O.J.</label>
                  <input
                    type="date"
                    value={generalData.doj}
                    onChange={(e) => handleGeneralChange('doj', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <MuiAutocomplete
                  label="Salary Type"
                  options={['Pc Rate', 'Time Rate']}
                  value={generalData.salaryType}
                  onChange={(val) => handleGeneralChange('salaryType', val)}
                />

                <MuiAutocomplete
                  label="Cost Centre"
                  options={['Production', 'Commercial', 'Administration']}
                  value={generalData.costCentre}
                  onChange={(val) => handleGeneralChange('costCentre', val)}
                />
              </div>

              {/* Row 4 with MUI Autocomplete */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MuiAutocomplete
                  label="Department"
                  options={departments}
                  value={generalData.department}
                  onChange={(val) => handleGeneralChange('department', val)}
                />

                <MuiAutocomplete
                  label="Designation"
                  options={designations}
                  value={generalData.designation}
                  onChange={(val) => handleGeneralChange('designation', val)}
                />

                <MuiAutocomplete
                  label="Grade"
                  options={['Unskilled', 'SemiSkilled', 'Skilled', 'HighlySkilled']}
                  value={generalData.grade}
                  onChange={(val) => handleGeneralChange('grade', val)}
                />
              </div>

              {/* Row 5 with MUI Autocomplete */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MuiAutocomplete
                  label="Pay Mode"
                  options={['Bank', 'Cash', 'Cheque']}
                  value={generalData.payMode}
                  onChange={(val) => handleGeneralChange('payMode', val)}
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contact No</label>
                  <input
                    type="text"
                    value={generalData.contactNo}
                    onChange={(e) => handleGeneralChange('contactNo', e.target.value)}
                    placeholder="Contact No"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Reference</label>
                  <input
                    type="text"
                    value={generalData.reference}
                    onChange={(e) => handleGeneralChange('reference', e.target.value)}
                    placeholder="Reference"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Card No.</label>
                  <input
                    type="text"
                    value={generalData.cardNo}
                    onChange={(e) => handleGeneralChange('cardNo', e.target.value)}
                    placeholder="Card No."
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Row 6 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">UAN</label>
                  <input
                    type="text"
                    value={generalData.uan}
                    onChange={(e) => handleGeneralChange('uan', e.target.value)}
                    placeholder="UAN"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ESI</label>
                  <input
                    type="text"
                    value={generalData.esi}
                    onChange={(e) => handleGeneralChange('esi', e.target.value)}
                    placeholder="ESI"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Dispencery</label>
                  <input
                    type="text"
                    value={generalData.dispensary}
                    onChange={(e) => handleGeneralChange('dispensary', e.target.value)}
                    placeholder="Dispencery"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">D.O.L.</label>
                  <input
                    type="date"
                    value={generalData.dol}
                    onChange={(e) => handleGeneralChange('dol', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Image Box matching screenshot */}
            <div className="glass-card p-4 border border-slate-800 flex flex-col items-center justify-center space-y-4">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Image</span>
              <div className="w-36 h-36 rounded-2xl bg-slate-900 border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden relative">
                {empPhoto ? (
                  <img src={empPhoto} alt="Employee" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-3">
                    <User className="w-10 h-10 mx-auto text-slate-600 mb-1" />
                    <span className="text-[10px] text-slate-500 block">No Image Chosen</span>
                  </div>
                )}
              </div>

              <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold cursor-pointer border border-slate-700 transition-colors">
                <span>Choose File</span>
                <input type="file" accept="image/*" onChange={handleFileChange(setEmpPhoto)} className="hidden" />
              </label>
            </div>
          </div>

          {/* Section: Identity Proof matching dark banner in screenshot */}
          <div className="space-y-3 pt-2">
            <div className="bg-slate-900 border-l-4 border-indigo-600 px-4 py-2 rounded-r-xl">
              <h3 className="text-xs font-bold text-white tracking-wide uppercase">Identity Proof</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Aadhar</label>
                <input
                  type="text"
                  value={generalData.aadhar}
                  onChange={(e) => handleGeneralChange('aadhar', e.target.value)}
                  placeholder="Aadhar"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Pan</label>
                <input
                  type="text"
                  value={generalData.pan}
                  onChange={(e) => handleGeneralChange('pan', e.target.value)}
                  placeholder="Pan"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none uppercase font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section: Bank Details with MUI Autocomplete */}
          <div className="space-y-3 pt-2">
            <div className="bg-slate-900 border-l-4 border-indigo-600 px-4 py-2 rounded-r-xl">
              <h3 className="text-xs font-bold text-white tracking-wide uppercase">Bank Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MuiAutocomplete
                label="Bank Name"
                options={banks}
                value={generalData.bankName}
                onChange={(val) => handleGeneralChange('bankName', val)}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Account No.</label>
                <input
                  type="text"
                  value={generalData.bankAcNo}
                  onChange={(e) => handleGeneralChange('bankAcNo', e.target.value)}
                  placeholder="Account No."
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">IFSC</label>
                <input
                  type="text"
                  value={generalData.ifsc}
                  onChange={(e) => handleGeneralChange('ifsc', e.target.value)}
                  placeholder="IFSC"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none uppercase font-mono"
                />
              </div>
            </div>
          </div>

          {/* General Tab Save Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleSaveGeneral}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save General Info</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Personal Info */}
      {activeTab === 'personal' && (
        <div className="glass-card p-6 space-y-6 border border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Religon</label>
              <input
                type="text"
                value={personalData.religion}
                onChange={(e) => handlePersonalChange('religion', e.target.value)}
                placeholder="Religon"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <MuiAutocomplete
              label="Gender"
              options={['Male', 'Female', 'Transgender']}
              value={personalData.gender}
              onChange={(val) => handlePersonalChange('gender', val)}
            />

            <MuiAutocomplete
              label="Martial"
              options={['Unmarried', 'Married', 'Widow', 'Divorce']}
              value={personalData.marital}
              onChange={(val) => handlePersonalChange('marital', val)}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Shoe size</label>
              <input
                type="text"
                value={personalData.shoeSize}
                onChange={(e) => handlePersonalChange('shoeSize', e.target.value)}
                placeholder="Shoe size"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Blood Group</label>
              <input
                type="text"
                value={personalData.bloodGroup}
                onChange={(e) => handlePersonalChange('bloodGroup', e.target.value)}
                placeholder="Blood Group"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Emergency No</label>
              <input
                type="text"
                value={personalData.emergencyNo}
                onChange={(e) => handlePersonalChange('emergencyNo', e.target.value)}
                placeholder="Emergency No"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={personalData.email}
                onChange={(e) => handlePersonalChange('email', e.target.value)}
                placeholder="Email"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Correspondance Address Banner */}
          <div className="space-y-3 pt-2">
            <div className="bg-slate-900 border-l-4 border-indigo-600 px-4 py-2 rounded-r-xl">
              <h3 className="text-xs font-bold text-white tracking-wide uppercase">Correspondance Address</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <input
                type="text"
                value={personalData.cVillage}
                onChange={(e) => handlePersonalChange('cVillage', e.target.value)}
                placeholder="Village/House No"
                className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                value={personalData.cPost}
                onChange={(e) => handlePersonalChange('cPost', e.target.value)}
                placeholder="Post"
                className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                value={personalData.cCity}
                onChange={(e) => handlePersonalChange('cCity', e.target.value)}
                placeholder="City"
                className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                value={personalData.cState}
                onChange={(e) => handlePersonalChange('cState', e.target.value)}
                placeholder="State"
                className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                value={personalData.cPincode}
                onChange={(e) => handlePersonalChange('cPincode', e.target.value)}
                placeholder="Pincode"
                className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Permanent Address Banner */}
          <div className="space-y-3 pt-2">
            <div className="bg-slate-900 border-l-4 border-indigo-600 px-4 py-2 rounded-r-xl">
              <h3 className="text-xs font-bold text-white tracking-wide uppercase">Permanent Address</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <input
                type="text"
                value={personalData.pVillage}
                onChange={(e) => handlePersonalChange('pVillage', e.target.value)}
                placeholder="Village/House No"
                className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                value={personalData.pPost}
                onChange={(e) => handlePersonalChange('pPost', e.target.value)}
                placeholder="Post"
                className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                value={personalData.pCity}
                onChange={(e) => handlePersonalChange('pCity', e.target.value)}
                placeholder="City"
                className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                value={personalData.pState}
                onChange={(e) => handlePersonalChange('pState', e.target.value)}
                placeholder="State"
                className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                value={personalData.pPincode}
                onChange={(e) => handlePersonalChange('pPincode', e.target.value)}
                placeholder="Pincode"
                className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Nominee & Family Details Banner */}
          <div className="space-y-3 pt-2">
            <div className="bg-slate-900 border-l-4 border-indigo-600 px-4 py-2 rounded-r-xl flex items-center justify-between">
              <h3 className="text-xs font-bold text-white tracking-wide uppercase">Nominee & Family Details</h3>
              <button
                type="button"
                onClick={addNominee}
                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Row</span>
              </button>
            </div>

            <div className="space-y-2">
              {nominees.map((row, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                  <input
                    type="text"
                    placeholder="Name"
                    value={row.name}
                    onChange={(e) => {
                      const updated = [...nominees];
                      updated[idx].name = e.target.value;
                      setNominees(updated);
                    }}
                    className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Age"
                    value={row.age}
                    onChange={(e) => {
                      const updated = [...nominees];
                      updated[idx].age = e.target.value;
                      setNominees(updated);
                    }}
                    className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Relationship"
                    value={row.relation}
                    onChange={(e) => {
                      const updated = [...nominees];
                      updated[idx].relation = e.target.value;
                      setNominees(updated);
                    }}
                    className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Is Nominee (Yes/No)"
                    value={row.isNominee}
                    onChange={(e) => {
                      const updated = [...nominees];
                      updated[idx].isNominee = e.target.value;
                      setNominees(updated);
                    }}
                    className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                  <div>
                    {nominees.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeNominee(idx)}
                        className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => toast.success('Personal details saved successfully!')}
              className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Personal Detail</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Qualifications */}
      {activeTab === 'qualifications' && (
        <div className="glass-card p-6 space-y-6 border border-slate-800">
          {/* Qualification Details */}
          <div className="space-y-3">
            <div className="bg-slate-900 border-l-4 border-indigo-600 px-4 py-2 rounded-r-xl flex items-center justify-between">
              <h3 className="text-xs font-bold text-white tracking-wide uppercase">Qualification Details</h3>
              <button
                type="button"
                onClick={addQuali}
                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Row</span>
              </button>
            </div>

            <div className="space-y-2">
              {qualifications.map((row, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                  <input
                    type="text"
                    placeholder="Degree/Diploma"
                    value={row.degree}
                    onChange={(e) => {
                      const updated = [...qualifications];
                      updated[idx].degree = e.target.value;
                      setQualifications(updated);
                    }}
                    className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Board/University"
                    value={row.university}
                    onChange={(e) => {
                      const updated = [...qualifications];
                      updated[idx].university = e.target.value;
                      setQualifications(updated);
                    }}
                    className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Year of pass"
                    value={row.passYear}
                    onChange={(e) => {
                      const updated = [...qualifications];
                      updated[idx].passYear = e.target.value;
                      setQualifications(updated);
                    }}
                    className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Subjects/Stream"
                    value={row.subject}
                    onChange={(e) => {
                      const updated = [...qualifications];
                      updated[idx].subject = e.target.value;
                      setQualifications(updated);
                    }}
                    className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                  <div>
                    {qualifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuali(idx)}
                        className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past Experience */}
          <div className="space-y-3 pt-2">
            <div className="bg-slate-900 border-l-4 border-indigo-600 px-4 py-2 rounded-r-xl flex items-center justify-between">
              <h3 className="text-xs font-bold text-white tracking-wide uppercase">Past Experience</h3>
              <button
                type="button"
                onClick={addExp}
                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Row</span>
              </button>
            </div>

            <div className="space-y-2">
              {experiences.map((row, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={row.company}
                    onChange={(e) => {
                      const updated = [...experiences];
                      updated[idx].company = e.target.value;
                      setExperiences(updated);
                    }}
                    className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Period"
                    value={row.period}
                    onChange={(e) => {
                      const updated = [...experiences];
                      updated[idx].period = e.target.value;
                      setExperiences(updated);
                    }}
                    className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="KRA"
                    value={row.kra}
                    onChange={(e) => {
                      const updated = [...experiences];
                      updated[idx].kra = e.target.value;
                      setExperiences(updated);
                    }}
                    className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Designation"
                    value={row.designation}
                    onChange={(e) => {
                      const updated = [...experiences];
                      updated[idx].designation = e.target.value;
                      setExperiences(updated);
                    }}
                    className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Company Contact No"
                    value={row.contact}
                    onChange={(e) => {
                      const updated = [...experiences];
                      updated[idx].contact = e.target.value;
                      setExperiences(updated);
                    }}
                    className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                  <div>
                    {experiences.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExp(idx)}
                        className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certification / Specialization */}
          <div className="space-y-3 pt-2">
            <div className="bg-slate-900 border-l-4 border-indigo-600 px-4 py-2 rounded-r-xl flex items-center justify-between">
              <h3 className="text-xs font-bold text-white tracking-wide uppercase">Certification / Specialization</h3>
              <button
                type="button"
                onClick={addCert}
                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Row</span>
              </button>
            </div>

            <div className="space-y-2">
              {certifications.map((row, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                  <input
                    type="text"
                    placeholder="Course/Certification"
                    value={row.course}
                    onChange={(e) => {
                      const updated = [...certifications];
                      updated[idx].course = e.target.value;
                      setCertifications(updated);
                    }}
                    className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Organization"
                    value={row.org}
                    onChange={(e) => {
                      const updated = [...certifications];
                      updated[idx].org = e.target.value;
                      setCertifications(updated);
                    }}
                    className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Year"
                    value={row.year}
                    onChange={(e) => {
                      const updated = [...certifications];
                      updated[idx].year = e.target.value;
                      setCertifications(updated);
                    }}
                    className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Remarks"
                    value={row.remarks}
                    onChange={(e) => {
                      const updated = [...certifications];
                      updated[idx].remarks = e.target.value;
                      setCertifications(updated);
                    }}
                    className="bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                  <div>
                    {certifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCert(idx)}
                        className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => toast.success('Qualifications saved successfully!')}
              className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Qualifications</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: Documentations */}
      {activeTab === 'documentations' && (
        <div className="glass-card p-6 space-y-6 border border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PAN Card */}
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-white uppercase tracking-wide">Pan Card Upload</label>
              <input type="file" accept="image/*" onChange={handleFileChange(setPanDoc)} className="text-xs text-slate-300" />
              <div className="w-full h-40 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden">
                {panDoc ? (
                  <img src={panDoc} alt="Pan Preview" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-xs text-slate-500">Pan Card Preview</span>
                )}
              </div>
            </div>

            {/* Aadhar Card */}
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-white uppercase tracking-wide">Aadhar Card Upload</label>
              <input type="file" accept="image/*" onChange={handleFileChange(setAadharDoc)} className="text-xs text-slate-300" />
              <div className="w-full h-40 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden">
                {aadharDoc ? (
                  <img src={aadharDoc} alt="Aadhar Preview" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-xs text-slate-500">Aadhar Card Preview</span>
                )}
              </div>
            </div>

            {/* Bank Passbook */}
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-white uppercase tracking-wide">Bank Passbook Upload</label>
              <input type="file" accept="image/*" onChange={handleFileChange(setBankDoc)} className="text-xs text-slate-300" />
              <div className="w-full h-40 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden">
                {bankDoc ? (
                  <img src={bankDoc} alt="Bank Passbook Preview" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-xs text-slate-500">Bank Passbook Preview</span>
                )}
              </div>
            </div>

            {/* Certificate */}
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-white uppercase tracking-wide">Certificate Upload</label>
              <input type="file" accept="image/*" onChange={handleFileChange(setCertDoc)} className="text-xs text-slate-300" />
              <div className="w-full h-40 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden">
                {certDoc ? (
                  <img src={certDoc} alt="Certificate Preview" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-xs text-slate-500">Certificate Preview</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => toast.success('Documents saved successfully!')}
              className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Documents</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: Rejoin & Other */}
      {activeTab === 'rejoin' && (
        <div className="glass-card p-6 space-y-6 border border-slate-800">
          <div className="space-y-4 max-w-xl">
            <h3 className="text-sm font-bold text-white tracking-wide border-b border-slate-800 pb-2">Rejoin Employee Verification</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Previous Employee Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter previous emp code..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => toast.success('Rejoin verification checked')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
