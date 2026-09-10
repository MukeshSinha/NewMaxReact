import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { MuiAutocomplete } from '../../components/common/MuiAutocomplete';

export const ContractorRegistrationPage: React.FC = () => {
  // Form State
  const [contractorId, setContractorId] = useState('');
  const [contractorName, setContractorName] = useState('');
  const [address, setAddress] = useState('');
  const [telephone, setTelephone] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [emergencyNumber, setEmergencyNumber] = useState('');
  const [gstn, setGstn] = useState('');
  const [serviceNo, setServiceNo] = useState('');
  const [pfNumber, setPfNumber] = useState('');
  const [esiNumber, setEsiNumber] = useState('');
  const [dateOfRegistration, setDateOfRegistration] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [enrollmentDate, setEnrollmentDate] = useState('');
  const [isActive, setIsActive] = useState(false);

  // Search State
  const [contractorsList, setContractorsList] = useState<string[]>([]);
  const [selectedSearchContractor, setSelectedSearchContractor] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchContractorList();
  }, []);

  const fetchContractorList = async () => {
    try {
      const res = await fetch('/api/ContractorMaster/GetContractorList');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const names = data
            .map((c: any) => (typeof c === 'string' ? c : c.itemName || c.compName || c.name || ''))
            .filter(Boolean);
          setContractorsList(Array.from(new Set(names)));
        }
      }
    } catch {
      // Ignore
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractorName) {
      toast.error('Please enter Contractor Name');
      return;
    }
    toast.success('Contractor registered successfully!');
  };

  const handleSearch = () => {
    if (!selectedSearchContractor) {
      toast.error('Please select a contractor to search');
      return;
    }
    toast.success(`Loaded details for ${selectedSearchContractor}`);
  };

  const handleUpdate = () => {
    if (!selectedSearchContractor) {
      toast.error('Please select a contractor to update');
      return;
    }
    toast.success(`Contractor ${selectedSearchContractor} updated successfully!`);
  };

  const handleDelete = () => {
    if (!selectedSearchContractor) {
      toast.error('Please select a contractor to delete');
      return;
    }
    toast.success(`Contractor ${selectedSearchContractor} deleted successfully!`);
  };

  return (
    <div className="w-full bg-[#f4f4f4] min-h-screen text-slate-800 p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow border border-slate-200 space-y-8">
        {/* Title: Contractor Registration */}
        <h2 className="text-2xl font-bold text-center text-slate-800 tracking-tight">Contractor Registration</h2>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contractor ID</label>
              <input
                type="text"
                value={contractorId}
                onChange={(e) => setContractorId(e.target.value)}
                placeholder="Enter Contractor ID"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contractor Name</label>
              <input
                type="text"
                value={contractorName}
                onChange={(e) => setContractorName(e.target.value)}
                placeholder="Enter Contractor Name"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Address"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Telephone Number</label>
              <input
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="Enter Telephone Number"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person Name</label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Enter Contact Person Name"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Number</label>
              <input
                type="tel"
                value={emergencyNumber}
                onChange={(e) => setEmergencyNumber(e.target.value)}
                placeholder="Enter Emergency Number"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">GSTN</label>
              <input
                type="text"
                value={gstn}
                onChange={(e) => setGstn(e.target.value)}
                placeholder="Enter GSTN"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Service No.</label>
              <input
                type="text"
                value={serviceNo}
                onChange={(e) => setServiceNo(e.target.value)}
                placeholder="Enter Service No."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">PF Number</label>
              <input
                type="text"
                value={pfNumber}
                onChange={(e) => setPfNumber(e.target.value)}
                placeholder="Enter PF Number"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ESI Number</label>
              <input
                type="text"
                value={esiNumber}
                onChange={(e) => setEsiNumber(e.target.value)}
                placeholder="Enter ESI Number"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 6 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Registration</label>
              <input
                type="date"
                value={dateOfRegistration}
                onChange={(e) => setDateOfRegistration(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Registration Number</label>
              <input
                type="text"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="Enter Registration Number"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 7 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Enrollment Date</label>
              <input
                type="date"
                value={enrollmentDate}
                onChange={(e) => setEnrollmentDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Is Active?</label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Yes
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-[#007bff] hover:bg-blue-700 text-white font-bold text-xs rounded shadow transition-colors"
            >
              Submit
            </button>
          </div>
        </form>

        {/* Section 2: Search Contractor */}
        <div className="pt-6 border-t border-slate-200 space-y-6">
          <h2 className="text-2xl font-bold text-center text-slate-800 tracking-tight">Search Contractor</h2>

          <div className="space-y-4">
            <div className="flex items-end gap-4 flex-wrap">
              <div className="flex-1 min-w-[280px]">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Contractor</label>
                <MuiAutocomplete
                  options={contractorsList}
                  value={selectedSearchContractor}
                  onChange={(val) => setSelectedSearchContractor(val)}
                  placeholder="Select Contractor"
                  themeMode="light"
                  minWidth="100%"
                />
              </div>
              <button
                type="button"
                onClick={handleSearch}
                className="px-6 py-2 bg-[#007bff] hover:bg-blue-700 text-white font-bold text-xs rounded shadow transition-colors"
              >
                Search
              </button>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleUpdate}
                className="px-6 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded shadow-sm transition-colors"
              >
                Update
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-2 bg-[#dc3545] hover:bg-red-700 text-white font-bold text-xs rounded shadow transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
