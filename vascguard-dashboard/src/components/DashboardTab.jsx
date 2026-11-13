import { useLanguage } from '../LanguageContext';
import { dashboardStats } from '../mockData';
import {
  Activity, Users, AlertTriangle, TrendingUp, Search as SearchIcon,
  BarChart3, Clock
} from 'lucide-react';
import RobotSimulation from './RobotSimulation';

function StatCard({ icon, label, value, change, color }) {
  const colorMap = {
    blue: 'from-primary-500 to-primary-600 shadow-primary-200',
    green: 'from-emerald-500 to-emerald-600 shadow-emerald-200',
    amber: 'from-amber-500 to-amber-600 shadow-amber-200',
    red: 'from-red-500 to-red-600 shadow-red-200',
    cyan: 'from-cyan-500 to-cyan-600 shadow-cyan-200',
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${colorMap[color]} text-white shadow-lg group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        {change && (
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> {change}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function DashboardTab() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label={t('screeningsToday')}
          value={dashboardStats.screeningsToday}
          change="+12%"
          color="blue"
        />
        <StatCard
          icon={<BarChart3 className="w-5 h-5" />}
          label={t('totalScreenings')}
          value={dashboardStats.totalScreenings.toLocaleString()}
          change="+8%"
          color="cyan"
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5" />}
          label={t('patientsReferred')}
          value={dashboardStats.patientsReferred}
          color="red"
        />
        <StatCard
          icon={<Activity className="w-5 h-5" />}
          label={t('avgRiskScore')}
          value={dashboardStats.avgRiskScore.toFixed(2)}
          color="amber"
        />
        <StatCard
          icon={<SearchIcon className="w-5 h-5" />}
          label={t('earlyDetections')}
          value={dashboardStats.earlyDetections}
          change="+23%"
          color="green"
        />
      </div>

      {/* Robot Simulation */}
      <div>
        <RobotSimulation />
      </div>
    </div>
  );
}

