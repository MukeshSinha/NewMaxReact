import React, { useEffect, useState } from 'react';
import { Award, GraduationCap, CheckCircle2 } from 'lucide-react';
import { SummaryCard } from '../../components/common/SummaryCard';
import { DataTable } from '../../components/common/DataTable';
import axios from 'axios';

export const DojoDashboard: React.FC = () => {
  const [trainees, setTrainees] = useState<any[]>([]);

  useEffect(() => {
    const fetchDojo = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const res = await axios.get(`/api/TempJoin/getDojoResultList`, { params: { Doj: today } });
        if (Array.isArray(res.data)) setTrainees(res.data);
      } catch {
        setTrainees([]);
      }
    };
    fetchDojo();
  }, []);

  const passedCount = trainees.filter((t) => t.status === 'Passed' || t.status === 'PASS').length;
  const pendingCount = trainees.length - passedCount;
  const passRate = trainees.length > 0 ? `${Math.round((passedCount / trainees.length) * 100)}%` : '0%';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-wide">Dojo Training Dashboard</h1>
        <p className="text-xs text-slate-400">Worker Skill Center, Certification & Test Pass Rate</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <SummaryCard title="Enrolled Trainees" value={trainees.length} icon={GraduationCap} gradient="bg-indigo-500" />
        <SummaryCard title="Passed & Certified" value={passedCount} icon={CheckCircle2} gradient="bg-emerald-500" />
        <SummaryCard title="Pending Skill Test" value={pendingCount} icon={Award} gradient="bg-amber-500" />
        <SummaryCard title="Pass Rate" value={passRate} icon={CheckCircle2} gradient="bg-purple-500" />
      </div>

      <DataTable
        title="Dojo Trainee Skill & Evaluation Status"
        data={trainees}
        exportFileName="Dojo_Trainee_Results"
        columns={[
          { header: 'Trainee ID', accessor: 'code', className: 'font-semibold text-indigo-400' },
          { header: 'Trainee Name', accessor: 'name', className: 'font-bold text-white' },
          { header: 'Assigned Dept', accessor: 'dept' },
          { header: 'Score', accessor: 'score', className: 'font-mono text-emerald-400' },
          {
            header: 'Status',
            accessor: (r) => (
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${r.status === 'Passed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                {r.status}
              </span>
            ),
          },
          { header: 'Certificate No', accessor: 'certNo', className: 'font-mono text-slate-300' },
        ]}
      />
    </div>
  );
};
