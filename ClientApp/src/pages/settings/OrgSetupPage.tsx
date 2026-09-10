import React from 'react';
import { Building2, MapPin, Building, Award, Tags, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OrgSetupPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen text-slate-800 p-8 font-sans">
      <div className="max-w-[100%] mx-auto space-y-6">
        {/* Page Title */}
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Organization Setup Layout</h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* 1. Add New Company / Zone Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between h-40 hover:shadow-md transition-shadow">
            <div>
              <span className="text-xs font-bold text-purple-600">Add New</span>
              <p className="text-xs font-semibold text-purple-600">Company/Zone</p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => navigate('/contractor/registration')}
                className="w-full py-2 px-3 bg-[#007bff] hover:bg-blue-700 text-white font-bold text-xs rounded transition-colors shadow-sm"
              >
                Company / Zone
              </button>
            </div>
          </div>

          {/* 2. Branch / Zone (Location) Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between h-40 hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-wider">BRANCH/ZONE</h3>
                <MapPin className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-sm font-semibold text-purple-600 mt-1">Location</p>
            </div>
          </div>

          {/* 3. Department Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between h-40 hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-purple-600 uppercase tracking-wider">DEP</h3>
                <Building className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-sm font-semibold text-purple-600 mt-1">Department</p>
            </div>
          </div>

          {/* 4. Designation Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between h-40 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-purple-600">Designation</p>
              <div className="w-8 h-8 border border-slate-300 rounded flex items-center justify-center text-slate-700">
                <Edit3 className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* 5. Category Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between h-40 hover:shadow-md transition-shadow">
            <div>
              <p className="text-xs font-semibold text-purple-600 leading-tight">
                Multiple category officer,staff,worker etc
              </p>
              <p className="text-sm font-bold text-purple-600 mt-2">Category</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
