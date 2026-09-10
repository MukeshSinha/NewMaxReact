import React from 'react';
import { DataTable } from '../../components/common/DataTable';

export const DojoTraineeList: React.FC = () => {
  const trainees = [
    { code: 'TRN101', name: 'Rohan Sharma', contractor: 'Apex Manpower', dept: 'Assembly Line 1', status: 'Enrolled' },
    { code: 'TRN102', name: 'Manish Verma', contractor: 'Global Workforce', dept: 'Body Shop', status: 'In Training' },
    { code: 'TRN103', name: 'Kiran Patel', contractor: 'Star Staffing', dept: 'Paint Shop', status: 'Evaluation Due' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-wide">Dojo Trainee Enrollment List</h1>
        <p className="text-xs text-slate-400">Workers Assigned to Dojo Training Facilities</p>
      </div>

      <DataTable
        title="Active Dojo Trainees"
        data={trainees}
        exportFileName="Dojo_Trainees_List"
        columns={[
          { header: 'Trainee Code', accessor: 'code', className: 'font-semibold text-indigo-400 font-mono' },
          { header: 'Name', accessor: 'name', className: 'font-bold text-white' },
          { header: 'Contractor', accessor: 'contractor' },
          { header: 'Target Dept', accessor: 'dept' },
          {
            header: 'Training Status',
            accessor: (r) => (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                {r.status}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
};
