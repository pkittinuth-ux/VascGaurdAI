import { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { patientRecords } from '../mockData';
import {
  Search, Download, FileText, ExternalLink, ChevronUp, ChevronDown,
  Stethoscope, Phone
} from 'lucide-react';

const riskBadge = (risk, t) => {
  const cfg = {
    normal: { label: t('riskNormal'), emoji: '🟢', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    moderate: { label: t('riskModerate'), emoji: '🟡', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    high: { label: t('riskHigh'), emoji: '🔴', cls: 'bg-red-50 text-red-700 border-red-200' },
  };
  const c = cfg[risk];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.cls}`}>
      {c.emoji} {c.label}
    </span>
  );
};

const actionBadge = (action, t) => {
  const cfg = {
    referred: { label: t('referred'), cls: 'bg-red-100 text-red-700', icon: <ExternalLink className="w-3 h-3" /> },
    monitoring: { label: t('monitoring'), cls: 'bg-amber-100 text-amber-700', icon: <Stethoscope className="w-3 h-3" /> },
    cleared: { label: t('cleared'), cls: 'bg-emerald-100 text-emerald-700', icon: <FileText className="w-3 h-3" /> },
  };
  const c = cfg[action];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${c.cls}`}>
      {c.icon} {c.label}
    </span>
  );
};

export default function PatientRecordsTab() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = patientRecords
    .filter(p =>
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (typeof va === 'string') {
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return sortAsc ? va - vb : vb - va;
    });

  const toggleSort = (field) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };

  const SortIcon = ({ field }) => (
    sortField === field
      ? (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)
      : <ChevronDown className="w-3 h-3 opacity-30" />
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{t('patientRecordsTitle')}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Phone className="w-3.5 h-3.5 text-primary-500" />
            <span className="text-xs text-primary-600 font-medium">{t('telehealthNote')}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full sm:w-72 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
            />
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-xl text-sm font-medium transition shrink-0">
            <Download className="w-4 h-4" />
            {t('exportCSV')}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {[
                  { field: 'date', label: t('dateTime') },
                  { field: 'id', label: t('patientId') },
                  { field: 'name', label: t('patientName') },
                  { field: 'symmetry', label: t('fingerSymmetry') },
                  { field: 'hr', label: t('hr') },
                  { field: 'temp', label: t('temp') },
                  { field: 'risk', label: t('riskLevel') },
                  { field: 'action', label: t('actionStatus') },
                ].map(col => (
                  <th key={col.field}
                    className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-primary-600 transition select-none"
                    onClick={() => toggleSort(col.field)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <SortIcon field={col.field} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((p, i) => (
                <tr key={p.id} className="hover:bg-primary-50/30 transition-colors group">
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{p.date}</td>
                  <td className="px-4 py-3 font-mono text-xs text-primary-700 font-medium">{p.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            p.symmetry >= 0.9 ? 'bg-medical-green' : p.symmetry >= 0.8 ? 'bg-medical-yellow' : 'bg-medical-red'
                          }`}
                          style={{ width: `${p.symmetry * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-600">{p.symmetry.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.hr}</td>
                  <td className="px-4 py-3 text-slate-600">{p.temp}</td>
                  <td className="px-4 py-3">{riskBadge(p.risk, t)}</td>
                  <td className="px-4 py-3">{actionBadge(p.action, t)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No results found</p>
          </div>
        )}
      </div>
    </div>
  );
}

