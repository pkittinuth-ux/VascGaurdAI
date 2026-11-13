import { useState } from 'react';
import { LanguageProvider, useLanguage } from './LanguageContext';
import Navbar from './components/Navbar';
import DashboardTab from './components/DashboardTab';
import PatientRecordsTab from './components/PatientRecordsTab';
import AnalyticsTab from './components/AnalyticsTab';
import SettingsTab from './components/SettingsTab';
import { HeartPulse, Shield } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t } = useLanguage();

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab />;
      case 'patients': return <PatientRecordsTab />;
      case 'analytics': return <AnalyticsTab />;
      case 'settings': return <SettingsTab />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {renderTab()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <HeartPulse className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">{t('footerText')}</p>
                <p className="text-xs text-primary-500">{t('footerMission')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-3.5 h-3.5" />
              <span>{t('footerDisclaimer')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
