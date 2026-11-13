import { useLanguage } from '../LanguageContext';
import { padStatistics, traditionalMethods } from '../mockData';
import {
  Heart, DollarSign, Leaf, Users, TrendingUp, CheckCircle2,
  XCircle, ArrowRight, Zap, Shield, Recycle, HandHeart,
  Banknote, TreeDeciduous
} from 'lucide-react';

export default function AnalyticsTab() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800">{t('analyticsTitle')}</h2>

      {/* PAD Statistics Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-slate-800">{t('padStatistics')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">{t('ageGroup')}</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">{t('estimatedPatients')}</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">{t('detectionRate')}</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">{t('prevalence')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {padStatistics.map((row, i) => {
                const rate = parseFloat(row.detectionRate);
                const barColor = rate > 20 ? 'bg-medical-red' : rate > 10 ? 'bg-medical-yellow' : 'bg-medical-green';
                return (
                  <tr key={i} className="hover:bg-primary-50/30 transition-colors">
                    <td className="px-5 py-3 font-medium text-slate-700">{t(row.ageGroup)}</td>
                    <td className="px-5 py-3 text-slate-600 font-semibold">{row.patients}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${barColor} transition-all`}
                            style={{ width: `${Math.min(rate * 3, 100)}%` }} />
                        </div>
                        <span className="text-xs font-medium text-slate-600">{row.detectionRate}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-xs">{row.prevalence}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Problem vs Solution */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-slate-800 text-lg">{t('problemVsSolution')}</h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Traditional Methods */}
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
            <div className="px-5 py-3 bg-red-50 border-b border-red-100">
              <h4 className="font-semibold text-red-800 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                {t('traditionalMethods')}
              </h4>
            </div>
            <div className="p-4 space-y-3">
              {traditionalMethods.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-100/50">
                  <div>
                    <p className="font-medium text-slate-700 text-sm">{t(m.method)}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{m.time} • {t(m.access)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-700 text-sm">{m.cost} ฿</p>
                    <p className="text-xs text-red-500">{t(m.pain)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VascGuard Solution */}
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
            <div className="px-5 py-3 bg-emerald-50 border-b border-emerald-100">
              <h4 className="font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {t('vascguardSolution')}
              </h4>
            </div>
            <div className="p-4 space-y-3">
              {[
                { label: t('time'), value: t('thirtySeconds'), icon: <Zap className="w-4 h-4 text-amber-500" /> },
                { label: t('painLevel'), value: t('zeroPain'), icon: <Heart className="w-4 h-4 text-emerald-500" /> },
                { label: t('cost'), value: '0 ฿ / screening', icon: <DollarSign className="w-4 h-4 text-emerald-500" /> },
                { label: t('accessibility'), value: t('portable'), icon: <Users className="w-4 h-4 text-primary-500" /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                  <div className="p-2 bg-white rounded-lg shadow-sm">{item.icon}</div>
                  <div>
                    <p className="text-xs text-slate-500">{item.label}</p>
                    <p className="font-semibold text-emerald-700">{item.value}</p>
                  </div>
                </div>
              ))}
              <div className="mt-2 p-3 bg-gradient-to-r from-primary-50 to-emerald-50 rounded-xl border border-primary-100">
                <p className="text-xs text-primary-700 font-medium">
                  💡 Device cost: 3,000–5,000 THB • USB/Power Bank powered • 100% non-invasive
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sustainability & Impact */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Recycle className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-slate-800 text-lg">{t('sustainabilityTitle')}</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: <HandHeart className="w-6 h-6" />,
              title: t('socialImpact'),
              desc: t('socialDesc'),
              color: 'from-rose-500 to-pink-500',
              bgColor: 'bg-rose-50',
              borderColor: 'border-rose-100',
            },
            {
              icon: <Banknote className="w-6 h-6" />,
              title: t('economicImpact'),
              desc: t('economicDesc'),
              color: 'from-amber-500 to-orange-500',
              bgColor: 'bg-amber-50',
              borderColor: 'border-amber-100',
            },
            {
              icon: <TreeDeciduous className="w-6 h-6" />,
              title: t('environmentalImpact'),
              desc: t('environmentalDesc'),
              color: 'from-emerald-500 to-green-500',
              bgColor: 'bg-emerald-50',
              borderColor: 'border-emerald-100',
            },
          ].map((card, i) => (
            <div key={i} className={`${card.bgColor} ${card.borderColor} border rounded-2xl p-5 hover:shadow-md transition-shadow`}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center mb-3 shadow-lg`}>
                {card.icon}
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">{card.title}</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

