import { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Building2, X, PhoneCall, Copy, Check, AlertTriangle, MapPin, ExternalLink, ShieldAlert } from 'lucide-react';

export default function HospitalReferralModal({ isOpen, onClose }) {
  const { t, lang } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const referralCode = "REF-VG2026-TH9823";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hospitals = [
    { name: lang === 'th' ? "โรงพยาบาลศิริราช (Siriraj Hospital)" : "Siriraj Hospital (Bangkok)", type: "Super Tertiary Center / Vascular Hub", tel: "02-419-7000" },
    { name: lang === 'th' ? "โรงพยาบาลจุฬาลงกรณ์ สภากาชาดไทย" : "King Chulalongkorn Memorial Hospital", type: "Vascular & Endovascular Surgery Center", tel: "02-256-4000" },
    { name: lang === 'th' ? "โรงพยาบาลมหาราชนครเชียงใหม่" : "Maharaj Nakorn Chiang Mai Hospital", type: "Northern Regional Vascular Center", tel: "053-936-150" },
    { name: lang === 'th' ? "โรงพยาบาลสงขลานครินทร์ (มอ.)" : "Songklanagarind Hospital (PSU)", type: "Southern Regional Vascular Center", tel: "074-455-000" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-red-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-red-200" />
            <div>
              <h3 className="font-bold text-lg leading-tight">{t('referralTitle')}</h3>
              <span className="inline-block px-2 py-0.5 mt-0.5 text-[10px] bg-red-800/80 rounded-full font-semibold">
                {t('urgentReferralBadge')}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Alert summary */}
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs flex gap-3">
            <ShieldAlert className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <p className="font-semibold">{t('urgentReferralBadge')}</p>
              <p className="text-slate-600 mt-1">{t('referralDesc')}</p>
            </div>
          </div>

          {/* E-Referral ID Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-500 font-medium">{t('digitalReferralId')}</p>
              <p className="text-lg font-mono font-bold text-slate-800">{referralCode}</p>
            </div>
            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                copied 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? t('referralCodeCopied') : t('copyReferralCode')}
            </button>
          </div>

          {/* Hospitals list */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary-600" />
              {t('recommendedHospitals')}
            </h4>
            <div className="space-y-2">
              {hospitals.map((h, i) => (
                <div key={i} className="p-3 rounded-xl border border-slate-100 bg-white hover:border-primary-200 hover:shadow-sm transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-800 text-xs">{h.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{h.type}</p>
                    </div>
                    <a 
                      href={`tel:${h.tel}`} 
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-50 text-primary-700 text-xs font-semibold hover:bg-primary-100 transition shrink-0"
                    >
                      <PhoneCall className="w-3 h-3" />
                      {h.tel}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency button */}
          <div className="pt-2">
            <a
              href="tel:1669"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-200 hover:from-red-700 hover:to-rose-700 transition"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              {t('contactTelehealth')}
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
          >
            {t('closeBtn')}
          </button>
        </div>
      </div>
    </div>
  );
}

