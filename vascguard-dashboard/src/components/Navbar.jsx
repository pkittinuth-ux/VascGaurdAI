import { useLanguage } from '../LanguageContext';
import {
  HeartPulse, Activity, Wifi, WifiOff, Menu, X
} from 'lucide-react';
import { useState } from 'react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { lang, setLang, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [connected] = useState(true);

  const tabs = [
    { key: 'dashboard', label: t('navDashboard') },
    { key: 'patients', label: t('navPatients') },
    { key: 'analytics', label: t('navAnalytics') },
    { key: 'settings', label: t('navSettings') },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-primary-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-medical-green rounded-full border-2 border-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary-900 leading-tight tracking-tight">
                {t('brand')}
              </h1>
              <p className="text-[10px] text-primary-500 font-medium leading-none hidden sm:block">
                {t('brandTagline')}
              </p>
            </div>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden lg:flex items-center gap-1">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-slate-500 hover:text-primary-600 hover:bg-primary-50/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Connection Status */}
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              connected
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <div className="relative">
                {connected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                {connected && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full pulse-ring" />
                )}
              </div>
              <span>{connected ? t('esp32') : t('offlineStatus')}</span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 rounded-full p-0.5">
              <button
                onClick={() => setLang('en')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  lang === 'en'
                    ? 'bg-white shadow-sm text-slate-800'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                title="English"
              >
                <span className="text-base leading-none">🇺🇸</span>
                <span className="hidden sm:inline text-xs">EN</span>
              </button>
              <button
                onClick={() => setLang('th')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  lang === 'th'
                    ? 'bg-white shadow-sm text-slate-800'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                title="ภาษาไทย"
              >
                <span className="text-base leading-none">🇹🇭</span>
                <span className="hidden sm:inline text-xs">TH</span>
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="lg:hidden pb-3 border-t border-slate-100 mt-1 pt-2 fade-in">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setMobileOpen(false); }}
                className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  activeTab === tab.key
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <div className="flex items-center gap-2 px-4 py-2 mt-1">
              {connected ? <Wifi className="w-4 h-4 text-emerald-500" /> : <WifiOff className="w-4 h-4 text-red-500" />}
              <span className="text-xs text-slate-500">{connected ? t('esp32') : t('offlineStatus')}</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

