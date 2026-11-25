import React, { useState } from 'react';
import axios from 'axios';
import {
    GraduationCap,
    Calendar,
    Search,
    Save,
    Users,
    CheckCircle,
    Loader2,
    RefreshCcw,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface TempEmployee {
    tempCode: string;
    empName: string;
    fatherName: string;
    doj: string;
    ezn: string;
    marks: string;
    result: 'None' | 'Pass' | 'Fail';
}

interface PromotionEmployee {
    EmpCode: string;
    Result: string;
    Marks: string;
}

interface PromotionResponse {
    Model: PromotionEmployee[];
    Passdt: string;
}

export const PromoteEmployeePage: React.FC = () => {
    const [joinDate, setJoinDate] = useState('');
    const [passDate, setPassDate] = useState('');

    const [employees, setEmployees] = useState<TempEmployee[]>([]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searched, setSearched] = useState(false);

    // Format Date
    const formatDate = (date: string) => {
        if (!date) return '-';

        const d = new Date(date);

        if (isNaN(d.getTime())) return date;

        return d.toLocaleDateString('en-GB');
    };

    // Load Temporary Employees
    const handleShow = async () => {
        if (!joinDate) {
            toast.error('Please select Date of Joining');
            return;
        }

        setLoading(true);
        setSearched(true);

        try {
            const response = await axios.get(
                '/api/TempJoin/ListToPromoteTempEmployee',
                {
                    params: {
                        Doj: joinDate,
                    },
                }
            );

            const data = Array.isArray(response.data)
                ? response.data
                : [];
            console.log('API Employee Data:', response.data);

            console.log(
                'First Employee DOJ:',
                response.data?.[0]?.doj
            );
            const formattedData: TempEmployee[] = data.map((item: any) => ({
                tempCode: item.tempCode || '',
                empName: item.empName || '',
                fatherName: item.fatherName || '',
                doj: item.doj || '',
                ezn: item.ezn || '',
                marks: '',
                result: 'None',
            }));
            
            setEmployees(formattedData);

            if (formattedData.length === 0) {
                toast('No temporary employees found');
            } else {
                toast.success(`${formattedData.length} employees loaded`);
            }
        } catch (error) {
            console.error('Employee loading error:', error);
            toast.error('Failed to load temporary employees');
            setEmployees([]);
        } finally {
            setLoading(false);
        }
    };

    // Update Marks
    const handleMarksChange = (index: number, value: string) => {
        setEmployees((prev) =>
            prev.map((emp, i) =>
                i === index ? { ...emp, marks: value } : emp
            )
        );
    };

    // Update Result
    const handleResultChange = (
        index: number,
        value: 'None' | 'Pass' | 'Fail'
    ) => {
        setEmployees((prev) =>
            prev.map((emp, i) =>
                i === index ? { ...emp, result: value } : emp
            )
        );
    };

    // Save Promotion Result
    const handleSave = async () => {
        if (!employees.length) {
            toast.error('No employees available');
            return;
        }

        if (!passDate) {
            toast.error('Please select Passing Date');
            return;
        }

        const selectedEmployees: PromotionEmployee[] = employees
            .filter((emp) => emp.result !== 'None')
            .map((emp) => ({
                EmpCode: emp.tempCode,
                Result: emp.result,
                Marks: emp.marks,
            }));

        if (selectedEmployees.length === 0) {
            toast.error('No record selected');
            return;
        }

        const payload: PromotionResponse = {
            Model: selectedEmployees,
            Passdt: passDate,
        };

        console.log('Promotion Request:', payload);

        setSaving(true);

        try {
            const response = await axios.post(
                '/api/TempJoin/SavePromotionResult',
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            toast.success(
                typeof response.data === 'string'
                    ? response.data
                    : response.data?.message || 'Promotion result saved successfully'
            );

            // Reset after successful save
            setEmployees([]);
            setSearched(false);
        } catch (error: any) {
            console.error('Save Promotion Error:', error);
            console.error('API Response:', error?.response?.data);

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                'Error while saving promotion result'
            );
        } finally {
            setSaving(false);
        }
    };

    // Reset Page
    const handleReset = () => {
        setJoinDate('');
        setPassDate('');
        setEmployees([]);
        setSearched(false);
    };

    const selectedCount = employees.filter(
        (emp) => emp.result !== 'None'
    ).length;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">

                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
                        <GraduationCap className="w-6 h-6" />
                    </div>

                    <div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                            Dojo Promote
                        </h1>

                        <p className="text-xs text-slate-500">
                            Evaluate temporary employees and update promotion results
                        </p>
                    </div>
                </div>

                <div className="text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 font-mono">
                    Employee / Dojo Promote
                </div>
            </div>

            {/* Date Selection */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">

                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <h2 className="text-sm font-semibold text-slate-800">
                        Promotion Criteria
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">

                    {/* Joining Date */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                            Date of Joining
                        </label>

                        <input
                            type="date"
                            value={joinDate}
                            onChange={(e) => setJoinDate(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
                        />
                    </div>

                    {/* Passing Date */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                            Passing Date
                        </label>

                        <input
                            type="date"
                            value={passDate}
                            onChange={(e) => setPassDate(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
                        />
                    </div>

                    {/* Show Button */}
                    <div>
                        <button
                            type="button"
                            onClick={handleShow}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 disabled:opacity-60"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Search className="w-4 h-4" />
                            )}

                            {loading ? 'Loading...' : 'Show Employees'}
                        </button>
                    </div>

                    {/* Reset */}
                    <div>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm border border-slate-200"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            Reset
                        </button>
                    </div>

                </div>
            </div>

            {/* Employee Records */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">

                {/* Table Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">

                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-600" />

                        <h2 className="text-sm font-semibold text-slate-800">
                            Temporary Employee List
                        </h2>

                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-mono border border-indigo-200">
                            {employees.length} Records
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        {selectedCount} Selected for Promotion
                    </div>

                </div>

                {/* Responsive Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200">

                    <table className="w-full text-xs text-left min-w-[950px]">

                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">

                                <th className="py-3 px-3 font-semibold">Emp Code</th>

                                <th className="py-3 px-3 font-semibold">Name</th>

                                <th className="py-3 px-3 font-semibold">Father Name</th>

                                <th className="py-3 px-3 font-semibold text-center">
                                    Date of Join
                                </th>

                                <th className="py-3 px-3 font-semibold">Contractor Name</th>

                                <th className="py-3 px-3 font-semibold text-center">
                                    % of Marks
                                </th>

                                <th className="py-3 px-3 font-semibold text-center">
                                    Result
                                </th>

                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">

                            {employees.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan={7}
                                        className="text-center py-12 text-slate-400"
                                    >
                                        {loading
                                            ? 'Loading employees...'
                                            : searched
                                                ? 'No temporary employees found'
                                                : 'Select Date of Joining and click Show Employees'}
                                    </td>
                                </tr>

                            ) : (

                                employees.map((emp, index) => (

                                    <tr
                                        key={`${emp.tempCode}-${index}`}
                                        className="hover:bg-slate-50/80 transition-colors"
                                    >

                                        <td className="py-3 px-3 text-indigo-600 font-semibold font-mono">
                                            {emp.tempCode}
                                        </td>

                                        <td className="py-3 px-3 text-slate-800 font-medium">
                                            {emp.empName}
                                        </td>

                                        <td className="py-3 px-3 text-slate-600">
                                            {emp.fatherName}
                                        </td>

                                        <td className="py-3 px-3 text-center text-slate-600">
                                            {formatDate(emp.doj)}
                                        </td>

                                        <td className="py-3 px-3 text-slate-600">
                                            {emp.ezn}
                                        </td>

                                        {/* Marks */}
                                        <td className="py-3 px-3 text-center">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="any"
                                                value={emp.marks}
                                                onChange={(e) =>
                                                    handleMarksChange(index, e.target.value)
                                                }
                                                placeholder="Marks"
                                                className="w-24 text-center bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
                                            />
                                        </td>

                                        {/* Result */}
                                        <td className="py-3 px-3 text-center">
                                            <select
                                                value={emp.result}
                                                onChange={(e) =>
                                                    handleResultChange(
                                                        index,
                                                        e.target.value as 'None' | 'Pass' | 'Fail'
                                                    )
                                                }
                                                className={`w-24 border rounded-lg px-2 py-1.5 text-xs font-semibold focus:outline-none ${emp.result === 'Pass'
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                        : emp.result === 'Fail'
                                                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                                                            : 'bg-white text-slate-600 border-slate-300'
                                                    }`}
                                            >
                                                <option value="None">None</option>
                                                <option value="Pass">Pass</option>
                                                <option value="Fail">Fail</option>
                                            </select>
                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>
                </div>

                {/* Save Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">

                    <p className="text-xs text-slate-500">
                        Only employees with Pass or Fail result will be submitted.
                    </p>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving || employees.length === 0}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}

                        {saving ? 'Saving...' : 'Save Promotion Result'}
                    </button>

                </div>

            </div>

        </div>
    );
};
