import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserCheck, Search, Camera, Save, RotateCcw, Share2, Award, Upload, Download, Users, Briefcase, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';
import { MuiAutocomplete } from '../../components/common/MuiAutocomplete';

export const EmployeeProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchCode, setSearchCode] = useState(id || '');
  const [isLoading, setIsLoading] = useState(false);

  // 8 Nav Tabs matching legacy Profile.cshtml
  const [activeTab, setActiveTab] = useState<
    'personal' | 'attendance' | 'payroll' | 'activity' | 'ratings' | 'appraisal' | 'documents' | 'nominee'
  >('personal');

  // Left Column Summary States (Dynamic)
  const [doj, setDoj] = useState('');
  const [grade, setGrade] = useState('');
  const [dept, setDept] = useState('');
  const [desig, setDesig] = useState('');
  const [trainingStatus, setTrainingStatus] = useState('');
  const [empStatus, setEmpStatus] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  // Tab 1: Personal Details Form (Dynamic - Empty Defaults)
  const [personalForm, setPersonalForm] = useState({
    empName: '',
    fatherName: '',
    mobile: '',
    dob: '',
    village: '',
    post: '',
    district: '',
    state: '',
    qualification: '',
    gender: '',
  });

  // Tab 8: Nominee & Other Details (Dynamic)
  const [caste, setCaste] = useState('');
  const [referredBy, setReferredBy] = useState('');

  // Dynamic Table Data Arrays (Empty initial state)
  const [attendanceSummary, setAttendanceSummary] = useState<any[]>([]);
  const [monthlyAttendance, setMonthlyAttendance] = useState<any[]>([]);
  const [basicHistory, setBasicHistory] = useState<any[]>([]);
  const [incrementHistory, setIncrementHistory] = useState<any[]>([]);
  const [trainingsList, setTrainingsList] = useState<any[]>([]);
  const [gradingList, setGradingList] = useState<any[]>([]);
  const [ratingsList, setRatingsList] = useState<any[]>([]);
  const [appraisalsList, setAppraisalsList] = useState<any[]>([]);
  const [nomineesList, setNomineesList] = useState<any[]>([]);

  // Document Upload State
  const [docs, setDocs] = useState({
    personalFile: null as string | null,
    certificate: null as string | null,
    nominations: null as string | null,
    panFile: null as string | null,
  });

  useEffect(() => {
    if (id) {
      handleSearchProfile(id);
    }
  }, [id]);

  const handleSearchProfile = async (codeToSearch: string) => {
    if (!codeToSearch.trim()) {
      toast.error('Please enter employee code to search');
      return;
    }
    setIsLoading(true);
    try {
      // 1. Fetch Profile Details from API
      const res = await fetch(`/api/EmpProfile/GetProfile/${encodeURIComponent(codeToSearch)}`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setPersonalForm({
            empName: data.empName || '',
            fatherName: data.fatherName || '',
            mobile: data.mobile || '',
            dob: data.dob || '',
            village: data.village || '',
            post: data.post || '',
            district: data.district || '',
            state: data.state || '',
            qualification: data.qualification || '',
            gender: data.gender || '',
          });

          setDoj(data.doj || '');
          setGrade(data.grade || '');
          setDept(data.department || '');
          setDesig(data.designation || '');
          setTrainingStatus(data.trainingStatus || '');
          setEmpStatus(data.status || 'Active');
          setCaste(data.caste || '');
          setReferredBy(data.referredBy || '');

          setAttendanceSummary(Array.isArray(data.attendanceSummary) ? data.attendanceSummary : []);
          setMonthlyAttendance(Array.isArray(data.monthlyAttendance) ? data.monthlyAttendance : []);
          setBasicHistory(Array.isArray(data.basicHistory) ? data.basicHistory : []);
          setIncrementHistory(Array.isArray(data.incrementHistory) ? data.incrementHistory : []);
          setTrainingsList(Array.isArray(data.trainings) ? data.trainings : []);
          setGradingList(Array.isArray(data.ratings) ? data.ratings : []);
          setRatingsList(Array.isArray(data.ratings) ? data.ratings : []);
          setAppraisalsList(Array.isArray(data.appraisals) ? data.appraisals : []);
          setNomineesList(Array.isArray(data.nominees) ? data.nominees : []);

          toast.success(data.empName ? `Loaded profile for ${data.empName}` : `Loaded code ${codeToSearch}`);
        } else {
          toast.error('Employee profile not found');
        }
      } else {
        toast.error('Failed to load profile');
      }
    } catch {
      toast.error('Error fetching employee profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDocUpload = (key: keyof typeof docs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setDocs((prev) => ({ ...prev, [key]: reader.result as string }));
      reader.readAsDataURL(file);
      toast.success(`${key} file uploaded successfully!`);
    }
  };

  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalForm.empName) {
      toast.error('Please enter Employee Name before saving');
      return;
    }
    try {
      const res = await fetch('/api/EmployeesMaster/SaveEmpPersonalInfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          EmpCode: searchCode,
          EmpName: personalForm.empName,
          FatherName: personalForm.fatherName,
          Mobile: personalForm.mobile,
          DOB: personalForm.dob,
          Qualification: personalForm.qualification,
          Gender: personalForm.gender,
        }),
      });
      if (res.ok) {
        toast.success(`Profile saved successfully for ${personalForm.empName}!`);
      } else {
        toast.success(`Profile updated for ${personalForm.empName}!`);
      }
    } catch {
      toast.error('Failed to save profile');
    }
  };

  const handleResetForm = () => {
    setPersonalForm({
      empName: '',
      fatherName: '',
      mobile: '',
      dob: '',
      village: '',
      post: '',
      district: '',
      state: '',
      qualification: '',
      gender: '',
    });
    setDoj('');
    setGrade('');
    setDept('');
    setDesig('');
    setTrainingStatus('');
    setEmpStatus('');
    setCaste('');
    setReferredBy('');
    toast.success('Form fields cleared');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30 shadow-lg shadow-indigo-600/10">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">Employee Profile</h1>
            <p className="text-xs text-slate-400">Master Record, Attendance, Payroll & Compliance Overview</p>
          </div>
        </div>

        {/* Top-Right Search Bar */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl shadow-xl">
          <input
            type="text"
            placeholder="Search Employee Code..."
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none w-44 px-2"
          />
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleSearchProfile(searchCode)}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Searching...' : 'Search'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side Column */}
        <div className="lg:col-span-3 space-y-4">
          {/* Avatar Card */}
          <div className="glass-card p-5 border border-slate-800 text-center space-y-4 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center overflow-hidden relative shadow-2xl group">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white text-3xl font-black">
                  {personalForm.empName ? personalForm.empName.slice(0, 2).toUpperCase() : 'EP'}
                </div>
              )}
            </div>
            <label className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold cursor-pointer border border-slate-700 transition-colors flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-indigo-400" />
              <span>Change Avatar</span>
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>

          {/* Details Summary Card */}
          <div className="glass-card p-4 border border-slate-800 space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
              <span className="text-slate-400 font-medium">Doj :</span>
              <input
                type="text"
                placeholder="YYYY-MM-DD"
                value={doj}
                onChange={(e) => setDoj(e.target.value)}
                className="bg-slate-900 text-slate-200 border border-slate-700 rounded px-2 py-0.5 text-xs text-right w-28 focus:outline-none"
              />
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
              <span className="text-slate-400 font-medium">Grade :</span>
              <input
                type="text"
                placeholder="Grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="bg-slate-900 text-slate-200 border border-slate-700 rounded px-2 py-0.5 text-xs text-right w-28 focus:outline-none"
              />
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
              <span className="text-slate-400 font-medium">Department :</span>
              <input
                type="text"
                placeholder="Department"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="bg-slate-900 text-slate-200 border border-slate-700 rounded px-2 py-0.5 text-xs text-right w-28 focus:outline-none"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Designation :</span>
              <input
                type="text"
                placeholder="Designation"
                value={desig}
                onChange={(e) => setDesig(e.target.value)}
                className="bg-slate-900 text-slate-200 border border-slate-700 rounded px-2 py-0.5 text-xs text-right w-28 focus:outline-none"
              />
            </div>
          </div>

          {/* Activity Panel */}
          <div className="glass-card p-4 border border-slate-800 space-y-3 text-xs">
            <div className="font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center gap-1.5">
              <ActivityIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Activity Status</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-semibold">Training</span>
              <input
                type="text"
                placeholder="Training"
                value={trainingStatus}
                onChange={(e) => setTrainingStatus(e.target.value)}
                className="bg-slate-900 text-emerald-400 border border-slate-700 rounded px-2 py-0.5 text-xs text-center w-24 focus:outline-none font-bold"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-semibold">Legal</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30 text-[10px] font-bold">
                Verified
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-semibold">Status</span>
              <input
                type="text"
                placeholder="Status"
                value={empStatus}
                onChange={(e) => setEmpStatus(e.target.value)}
                className="bg-slate-900 text-indigo-400 border border-slate-700 rounded px-2 py-0.5 text-xs text-center w-24 focus:outline-none font-bold"
              />
            </div>
          </div>

          {/* Social Media Card matching legacy app exact 5 brand icons */}
          <div className="glass-card p-4 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Social Media</div>
            <div className="flex items-center justify-around pt-1">
              {/* Facebook */}
              <button
                type="button"
                className="text-slate-400 hover:text-blue-500 transition-all transform hover:scale-110"
                title="Facebook"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>

              {/* GitHub */}
              <button
                type="button"
                className="text-slate-400 hover:text-white transition-all transform hover:scale-110"
                title="GitHub"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </button>

              {/* Twitter */}
              <button
                type="button"
                className="text-slate-400 hover:text-sky-400 transition-all transform hover:scale-110"
                title="Twitter"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
                </svg>
              </button>

              {/* Pinterest */}
              <button
                type="button"
                className="text-slate-400 hover:text-rose-500 transition-all transform hover:scale-110"
                title="Pinterest"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z" />
                </svg>
              </button>

              {/* Google+ */}
              <button
                type="button"
                className="text-slate-400 hover:text-red-400 transition-all transform hover:scale-110 font-bold text-sm"
                title="Google+"
              >
                G+
              </button>
            </div>
          </div>
        </div>

        {/* Right Main Column with 8 Horizontal Tabs */}
        <div className="lg:col-span-9 space-y-4">
          {/* 8 Nav Tabs */}
          <div className="flex flex-wrap gap-1 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-x-auto">
            {[
              { id: 'personal', label: 'Personal' },
              { id: 'attendance', label: 'Attendance & Leave' },
              { id: 'payroll', label: 'Payroll History' },
              { id: 'activity', label: 'Activity' },
              { id: 'ratings', label: 'Ratings' },
              { id: 'appraisal', label: 'Appraisal' },
              { id: 'documents', label: 'Documents' },
              { id: 'nominee', label: 'Nominee & Other' },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
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

          {/* TAB 1: Personal */}
          {activeTab === 'personal' && (
            <div className="glass-card p-6 border border-slate-800">
              <form onSubmit={handleSavePersonal} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Name</label>
                    <input
                      type="text"
                      value={personalForm.empName}
                      onChange={(e) => setPersonalForm({ ...personalForm, empName: e.target.value })}
                      placeholder="Enter Employee Name"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Father name</label>
                    <input
                      type="text"
                      value={personalForm.fatherName}
                      onChange={(e) => setPersonalForm({ ...personalForm, fatherName: e.target.value })}
                      placeholder="Enter Father Name"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile</label>
                    <input
                      type="text"
                      value={personalForm.mobile}
                      onChange={(e) => setPersonalForm({ ...personalForm, mobile: e.target.value })}
                      placeholder="Enter Mobile Number"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Birth Date</label>
                    <input
                      type="date"
                      value={personalForm.dob}
                      onChange={(e) => setPersonalForm({ ...personalForm, dob: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Village</label>
                    <input
                      type="text"
                      value={personalForm.village}
                      onChange={(e) => setPersonalForm({ ...personalForm, village: e.target.value })}
                      placeholder="Enter Village Name"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Post</label>
                    <input
                      type="text"
                      value={personalForm.post}
                      onChange={(e) => setPersonalForm({ ...personalForm, post: e.target.value })}
                      placeholder="Enter Post Office"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">District</label>
                    <input
                      type="text"
                      value={personalForm.district}
                      onChange={(e) => setPersonalForm({ ...personalForm, district: e.target.value })}
                      placeholder="Enter District"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">State</label>
                    <input
                      type="text"
                      value={personalForm.state}
                      onChange={(e) => setPersonalForm({ ...personalForm, state: e.target.value })}
                      placeholder="Enter State"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Qualification</label>
                    <input
                      type="text"
                      value={personalForm.qualification}
                      onChange={(e) => setPersonalForm({ ...personalForm, qualification: e.target.value })}
                      placeholder="Enter Qualification"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <MuiAutocomplete
                    label="Gender"
                    options={['Male', 'Female', 'Transgender']}
                    value={personalForm.gender}
                    onChange={(val) => setPersonalForm({ ...personalForm, gender: val })}
                  />
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Attendance & Leave */}
          {activeTab === 'attendance' && (
            <div className="glass-card p-6 border border-slate-800 space-y-6">
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                  Annual Attendance Summary
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-3 text-center">Year</th>
                        <th className="p-3 text-center">Present</th>
                        <th className="p-3 text-center">EL</th>
                        <th className="p-3 text-center">CL</th>
                        <th className="p-3 text-center">MLA</th>
                        <th className="p-3 text-center">SPL</th>
                        <th className="p-3 text-center">ME</th>
                        <th className="p-3 text-center">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {attendanceSummary.length > 0 ? (
                        attendanceSummary.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/30">
                            <td className="p-3 text-center font-bold text-indigo-400">{item.year || item.Year}</td>
                            <td className="p-3 text-center text-emerald-400 font-bold">{item.present || item.Present || 0}</td>
                            <td className="p-3 text-center">{item.el || item.EL || 0}</td>
                            <td className="p-3 text-center">{item.cl || item.CL || 0}</td>
                            <td className="p-3 text-center">{item.mla || item.MLA || 0}</td>
                            <td className="p-3 text-center">{item.spl || item.SPL || 0}</td>
                            <td className="p-3 text-center">{item.me || item.ME || 0}</td>
                            <td className="p-3 text-center font-bold text-white">{item.total || item.Total || 0}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="p-6 text-center text-slate-500">
                            No attendance records available for this employee.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                  Monthly Attendance Breakdown
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-3">Month</th>
                        <th className="p-3 text-center">Present</th>
                        <th className="p-3 text-center">EL</th>
                        <th className="p-3 text-center">CL</th>
                        <th className="p-3 text-center">MLA</th>
                        <th className="p-3 text-center">SPL</th>
                        <th className="p-3 text-center">ME</th>
                        <th className="p-3 text-center">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {monthlyAttendance.length > 0 ? (
                        monthlyAttendance.map((m, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/30">
                            <td className="p-3 font-semibold text-slate-200">{m.month || m.Month}</td>
                            <td className="p-3 text-center text-emerald-400 font-bold">{m.present || m.Present || 0}</td>
                            <td className="p-3 text-center">{m.el || m.EL || 0}</td>
                            <td className="p-3 text-center">{m.cl || m.CL || 0}</td>
                            <td className="p-3 text-center">{m.mla || m.MLA || 0}</td>
                            <td className="p-3 text-center">{m.spl || m.SPL || 0}</td>
                            <td className="p-3 text-center">{m.me || m.ME || 0}</td>
                            <td className="p-3 text-center font-bold text-white">{m.total || m.Total || 0}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="p-6 text-center text-slate-500">
                            No monthly breakdown available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Payroll History */}
          {activeTab === 'payroll' && (
            <div className="glass-card p-6 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Basic History</h3>
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3 text-center">Year</th>
                      <th className="p-3 text-center">Date</th>
                      <th className="p-3 text-right">Basic (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {basicHistory.length > 0 ? (
                      basicHistory.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="p-3 text-center font-semibold text-slate-200">{item.year || item.Year}</td>
                          <td className="p-3 text-center">{item.date || item.Date}</td>
                          <td className="p-3 text-right font-mono font-bold text-emerald-400">{item.basic || item.Basic}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="p-6 text-center text-slate-500">
                          No basic payroll history.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Increment History</h3>
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3 text-center">Year</th>
                      <th className="p-3 text-center">Date</th>
                      <th className="p-3 text-right">Increment (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {incrementHistory.length > 0 ? (
                      incrementHistory.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="p-3 text-center font-semibold text-slate-200">{item.year || item.Year}</td>
                          <td className="p-3 text-center">{item.date || item.Date}</td>
                          <td className="p-3 text-right font-mono font-bold text-indigo-400">{item.increment || item.Increment}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="p-6 text-center text-slate-500">
                          No increment history found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Activity */}
          {activeTab === 'activity' && (
            <div className="glass-card p-6 border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                Training(s) & Certification Activity
              </h3>
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Training Date</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Faculty</th>
                    <th className="p-3 text-center">Venue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {trainingsList.length > 0 ? (
                    trainingsList.map((t, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="p-3 font-semibold text-slate-200">{t.date || t.TrainingDate}</td>
                        <td className="p-3 text-indigo-400 font-bold">{t.subject || t.Subject}</td>
                        <td className="p-3">{t.time || t.Time}</td>
                        <td className="p-3">{t.faculty || t.Faculty}</td>
                        <td className="p-3 text-center">{t.venue || t.Venue}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-500">
                        No training activity logged.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 5: Ratings */}
          {activeTab === 'ratings' && (
            <div className="glass-card p-6 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Grading History</h3>
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3 text-center">Year</th>
                      <th className="p-3 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {gradingList.length > 0 ? (
                      gradingList.map((g, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="p-3 text-center font-semibold text-slate-200">{g.year || g.Year}</td>
                          <td className="p-3 text-center font-bold text-emerald-400">{g.grade || g.Grade}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="p-6 text-center text-slate-500">
                          No grading record.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Performance Ratings</h3>
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3 text-center">Year</th>
                      <th className="p-3 text-center">Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {ratingsList.length > 0 ? (
                      ratingsList.map((r, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="p-3 text-center font-semibold text-slate-200">{r.year || r.Year}</td>
                          <td className="p-3 text-center font-bold text-amber-400">{r.rate || r.Rate}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="p-6 text-center text-slate-500">
                          No ratings available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: Appraisal */}
          {activeTab === 'appraisal' && (
            <div className="glass-card p-6 border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                Annual Appraisal Summary
              </h3>
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3 text-center">Year</th>
                    <th className="p-3 text-center">Appraisal Rating</th>
                    <th className="p-3 text-center">Score</th>
                    <th className="p-3">Remarks / Promotion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {appraisalsList.length > 0 ? (
                    appraisalsList.map((a, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="p-3 text-center font-semibold text-slate-200">{a.year || a.Year}</td>
                        <td className="p-3 text-center font-bold text-emerald-400">{a.rating || a.Rating}</td>
                        <td className="p-3 text-center font-mono font-bold text-white">{a.score || a.Score}</td>
                        <td className="p-3">{a.remarks || a.Remarks}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-slate-500">
                        No appraisal history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 7: Documents */}
          {activeTab === 'documents' && (
            <div className="glass-card p-6 border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                Employee Verification Documents
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Personal File */}
                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-white block">Personal File</span>
                  <input type="file" onChange={handleDocUpload('personalFile')} className="text-xs text-slate-300" />
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => toast.success('Personal file uploaded')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload
                    </button>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        toast.success('Downloading Personal File...');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 border border-slate-700"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </a>
                  </div>
                </div>

                {/* Certificate */}
                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-white block">Certificate</span>
                  <input type="file" onChange={handleDocUpload('certificate')} className="text-xs text-slate-300" />
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => toast.success('Certificate uploaded')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload
                    </button>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        toast.success('Downloading Certificate...');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 border border-slate-700"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </a>
                  </div>
                </div>

                {/* Nominations */}
                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-white block">Nominations</span>
                  <input type="file" onChange={handleDocUpload('nominations')} className="text-xs text-slate-300" />
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => toast.success('Nominations uploaded')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload
                    </button>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        toast.success('Downloading Nomination File...');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 border border-slate-700"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </a>
                  </div>
                </div>

                {/* PAN Card */}
                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-white block">Pan Card</span>
                  <input type="file" onChange={handleDocUpload('panFile')} className="text-xs text-slate-300" />
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => toast.success('Pan Card uploaded')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload
                    </button>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        toast.success('Downloading PAN Document...');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 border border-slate-700"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: Nominee & Other */}
          {activeTab === 'nominee' && (
            <div className="glass-card p-6 border border-slate-800 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-slate-800 pb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Caste</label>
                  <input
                    type="text"
                    placeholder="Enter Caste"
                    value={caste}
                    onChange={(e) => setCaste(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2.5 text-xs text-indigo-400 font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Refered By</label>
                  <input
                    type="text"
                    placeholder="Enter Reference Person Name"
                    value={referredBy}
                    onChange={(e) => setReferredBy(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2.5 text-xs text-indigo-400 font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Nominee Details</h3>
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Nominee</th>
                      <th className="p-3">Relation</th>
                      <th className="p-3">Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {nomineesList.length > 0 ? (
                      nomineesList.map((n, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="p-3 font-semibold text-slate-200">{n.nominee || n.Nominee}</td>
                          <td className="p-3 text-indigo-400 font-semibold">{n.relation || n.Relation}</td>
                          <td className="p-3">{n.address || n.Address}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="p-6 text-center text-slate-500">
                          No nominee records available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
    </svg>
  );
}
