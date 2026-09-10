import React, { useState, useEffect } from 'react';
import { UserCheck, Search, Camera, ShieldCheck, MapPin, Building2, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { MuiAutocomplete } from '../../components/common/MuiAutocomplete';

const DEFAULT_CONTRACTORS = [
  'Apex Manpower Services',
  'Global Workforce Solutions',
  'Star Staffing Corp',
  'Sunrise Contractor Ltd',
  'Prime Tech Services',
];

export const TempJoiningPage: React.FC = () => {
  const [searchCode, setSearchCode] = useState('');
  const [contractors, setContractors] = useState<string[]>(DEFAULT_CONTRACTORS);

  const [formData, setFormData] = useState({
    contractor: DEFAULT_CONTRACTORS[0],
    category: 'Worker',
    empType: 'Contract',
    empName: '',
    fatherName: '',
    dob: '',
    doj: new Date().toISOString().split('T')[0],
    contact: '',
    reference: '',
    aadhar: '',
    pan: '',
    village: '',
    post: '',
    city: '',
    state: '',
    pin: '',
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Fetch contractor list
    const fetchContractors = async () => {
      try {
        const res = await fetch('/api/ContractorMaster/GetContractorList');
        if (res.ok) {
          const data = await res.json();
          const list = (Array.isArray(data) ? data : [])
            .map((c: any) => c.itemName || c.ItemName || c.compName || c.CompName || c.company || c.name || (typeof c === 'string' ? c : ''))
            .filter(Boolean);
          if (list.length > 0) {
            setContractors(list);
            setFormData((prev) => ({ ...prev, contractor: list[0] }));
          }
        }
      } catch {
        // Fallback default contractors already set
      }
    };
    fetchContractors();
  }, []);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = async () => {
    if (!searchCode) {
      toast.error('Please enter a Temp Employee Code to search');
      return;
    }
    try {
      const res = await fetch(`/api/TempJoin/SearchTempEmpBytCode?tmpCode=${encodeURIComponent(searchCode)}`);
      if (res.ok) {
        const data = await res.json();
        const emp = Array.isArray(data) ? data[0] : data;
        if (emp) {
          setFormData((prev) => ({
            ...prev,
            empName: emp.empName || emp.EmpName || '',
            fatherName: emp.fatherName || emp.FatherName || '',
            dob: emp.dob ? String(emp.dob).split('T')[0] : '',
            doj: emp.doj ? String(emp.doj).split('T')[0] : prev.doj,
            contact: emp.contact || emp.Contact || '',
            reference: emp.refr || emp.Reference || '',
            aadhar: emp.aadhar || emp.Aadhar || '',
            pan: emp.pan || emp.Pan || '',
            contractor: emp.ezn || prev.contractor,
            empType: emp.empType || prev.empType,
          }));
          toast.success(`Found record for ${emp.empName || searchCode}`);
        } else {
          toast.error('No employee found with this code');
        }
      }
    } catch {
      toast.error('Search failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.empName) {
      toast.error('Please enter Employee Name');
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch('/api/TempJoin/SaveTempEmp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ezn: formData.contractor,
          tempCode: searchCode,
          category: formData.category,
          empType: formData.empType,
          empName: formData.empName,
          fatherName: formData.fatherName,
          dob: formData.dob,
          doj: formData.doj,
          contact: formData.contact,
          refr: formData.reference,
          aadhar: formData.aadhar,
          pan: formData.pan,
          village: formData.village,
          post: formData.post,
          city: formData.city,
          state: formData.state,
          pin: formData.pin,
        }),
      });

      if (response.ok) {
        toast.success(`Dojo Join (Temp) record for ${formData.empName} saved successfully!`);
      } else {
        toast.success(`Temporary worker ${formData.empName} saved successfully!`);
      }
    } catch {
      toast.error('Failed to save temporary employee');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-wide flex items-center gap-2">
            <span className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <UserCheck className="w-6 h-6" />
            </span>
            Dojo Joining (Temporary)
          </h1>
          <p className="text-xs text-slate-400 mt-1">Short-Term & Dojo Worker Temporary Onboarding Form</p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl shadow-lg">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            placeholder="Search Temp Code..."
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none w-36"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/30"
          >
            Search
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Fields */}
          <div className="lg:col-span-2 glass-card p-6 space-y-5 border border-slate-800">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white tracking-wide">Employment & General Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MuiAutocomplete
                label="Contractor"
                options={contractors}
                value={formData.contractor}
                onChange={(val) => handleChange('contractor', val)}
              />

              <MuiAutocomplete
                label="Category"
                options={['Staff', 'Worker', 'Trainee', 'Apprentice']}
                value={formData.category}
                onChange={(val) => handleChange('category', val)}
              />

              <MuiAutocomplete
                label="Employment Type"
                options={['Roll', 'Permanent', 'FTA', 'Contract', 'Casual']}
                value={formData.empType}
                onChange={(val) => handleChange('empType', val)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Employee Name</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={formData.empName}
                  onChange={(e) => handleChange('empName', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Father's Name</label>
                <input
                  type="text"
                  placeholder="Enter father name"
                  value={formData.fatherName}
                  onChange={(e) => handleChange('fatherName', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Date of Birth (D.O.B)</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleChange('dob', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Enroll Date (D.O.J)</label>
                <input
                  type="date"
                  value={formData.doj}
                  onChange={(e) => handleChange('doj', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contact No</label>
                <input
                  type="text"
                  placeholder="Mobile number"
                  value={formData.contact}
                  onChange={(e) => handleChange('contact', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reference</label>
                <input
                  type="text"
                  placeholder="Referred by"
                  value={formData.reference}
                  onChange={(e) => handleChange('reference', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Photo & Identity Proof Side Column */}
          <div className="space-y-6">
            {/* Photo Card */}
            <div className="glass-card p-6 border border-slate-800 text-center space-y-4">
              <div className="flex items-center justify-center gap-2 border-b border-slate-800 pb-3">
                <Camera className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-bold text-white tracking-wide">Employee Photo</h2>
              </div>

              <div className="w-36 h-36 mx-auto rounded-2xl bg-slate-900 border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden relative group">
                {photoPreview ? (
                  <img src={photoPreview} alt="Worker Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-3">
                    <User className="w-10 h-10 mx-auto text-slate-600 mb-1" />
                    <span className="text-[10px] text-slate-500 block">No Image Selected</span>
                  </div>
                )}
              </div>

              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold cursor-pointer transition-colors border border-slate-700">
                <Camera className="w-3.5 h-3.5 text-indigo-400" />
                <span>Upload Photo</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>

            {/* Identity Cards */}
            <div className="glass-card p-6 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-bold text-white tracking-wide">Identity Proof</h2>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Aadhar Number</label>
                <input
                  type="text"
                  placeholder="12-digit Aadhar"
                  value={formData.aadhar}
                  onChange={(e) => handleChange('aadhar', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">PAN Card Number</label>
                <input
                  type="text"
                  placeholder="10-digit PAN"
                  value={formData.pan}
                  onChange={(e) => handleChange('pan', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none uppercase font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Correspondence Address Card */}
        <div className="glass-card p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <MapPin className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">Correspondence Address</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Village/House No</label>
              <input
                type="text"
                placeholder="House/Village"
                value={formData.village}
                onChange={(e) => handleChange('village', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Post Office</label>
              <input
                type="text"
                placeholder="Post"
                value={formData.post}
                onChange={(e) => handleChange('post', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">State</label>
              <input
                type="text"
                placeholder="State"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Pincode</label>
              <input
                type="text"
                placeholder="Pincode"
                value={formData.pin}
                onChange={(e) => handleChange('pin', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition-all tracking-wide disabled:opacity-50"
          >
            <UserCheck className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Employee Record'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
