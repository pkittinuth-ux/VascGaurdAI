import { useLanguage } from '../LanguageContext';
import { Printer, X, HeartPulse, CheckCircle2, QrCode, FileText, User } from 'lucide-react';

export default function PrintReportModal({ isOpen, onClose, risk, hr, temp, symmetryScore }) {
  const { t, lang } = useLanguage();
  if (!isOpen) return null;

  const now = new Date().toLocaleString(lang === 'th' ? 'th-TH' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const riskLabel = risk === 'normal' 
    ? t('riskNormal') 
    : risk === 'moderate' 
      ? t('riskModerate') 
      : t('riskHigh');

  const riskColor = risk === 'normal'
    ? 'text-emerald-700 bg-emerald-50 border-emerald-300'
    : risk === 'moderate'
      ? 'text-amber-700 bg-amber-50 border-amber-300'
      : 'text-red-700 bg-red-50 border-red-300';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-primary-200" />
            <div>
              <h3 className="font-bold text-lg leading-tight">{t('printReportTitle')}</h3>
              <p className="text-xs text-primary-200">{t('screeningSlipSub')}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Printable slip body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto" id="printable-slip">
          {/* Slip meta */}
          <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-200 text-xs text-slate-500">
            <div>
              <p><span className="font-semibold text-slate-700">Device:</span> VascGuard AI (XIAO ESP32-C6)</p>
              <p><span className="font-semibold text-slate-700">Patient ID:</span> VG-2026-9041</p>
            </div>
            <div className="text-right">
              <p><span className="font-semibold text-slate-700">{t('screeningTimestamp')}:</span></p>
              <p>{now}</p>
            </div>
          </div>

          {/* Result card */}
          <div className={`p-4 rounded-2xl border ${riskColor} text-center`}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1">{t('riskLevel')}</p>
            <h4 className="text-2xl font-black">{riskLabel}</h4>
            <p className="text-xs mt-1 opacity-90">
              {risk === 'normal' ? t('riskNormalDesc') : risk === 'moderate' ? t('riskModerateDesc') : t('riskHighDesc')}
            </p>
          </div>

          {/* Vitals Grid */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[11px] text-slate-500">{t('symmetryScore')}</p>
              <p className="text-lg font-bold text-slate-800">{symmetryScore || '0.94'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[11px] text-slate-500">{t('heartRate')}</p>
              <p className="text-lg font-bold text-slate-800">{hr || '74'} <span className="text-xs font-normal">bpm</span></p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[11px] text-slate-500">{t('fingerTemp')}</p>
              <p className="text-lg font-bold text-slate-800">{temp || '32.4'}°C</p>
            </div>
          </div>

          {/* Recommendation */}
          <div className="p-3 bg-primary-50 rounded-xl text-xs text-primary-900 border border-primary-100">
            <p className="font-semibold mb-1">Clinical Recommendation:</p>
            <p>{risk === 'normal' ? t('riskNormalRec') : risk === 'moderate' ? t('riskModerateRec') : t('riskHighRec')}</p>
          </div>

          {/* Attending signature and QR Code */}
          <div className="pt-2 flex items-center justify-between border-t border-dashed border-slate-200">
            <div className="space-y-1">
              <p className="text-[11px] text-slate-500">{t('physicianSign')}</p>
              <div className="w-36 h-8 border-b-2 border-slate-300"></div>
              <p className="text-[10px] text-slate-400">RN. / Community Health Worker</p>
            </div>
            <div className="text-center">
              <div className="p-1.5 bg-slate-100 rounded-lg inline-block border border-slate-200">
                <QrCode className="w-10 h-10 text-slate-700" />
              </div>
              <p className="text-[9px] text-slate-400 mt-0.5">E-Health Verify</p>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 leading-tight italic text-center">
            {t('disclaimerSlip')}
          </p>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-200 transition"
          >
            {t('closeBtn')}
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-200 transition"
          >
            <Printer className="w-4 h-4" />
            {t('printNow')}
          </button>
        </div>
      </div>
    </div>
  );
}

