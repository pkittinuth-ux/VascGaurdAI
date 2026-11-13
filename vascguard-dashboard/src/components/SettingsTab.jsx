import { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import {
  Settings, Cpu, Wifi, Battery, Volume2, Sun,
  Gauge, Save, RotateCcw, Info, CheckCircle
} from 'lucide-react';

function SliderSetting({ icon, label, value, onChange, min = 0, max = 100, unit = '%' }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          {icon}
          {label}
        </div>
        <span className="text-sm font-semibold text-primary-700">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min} max={max} value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary-600"
      />
    </div>
  );
}

export default function SettingsTab() {
  const { t } = useLanguage();
  const [servo, setServo] = useState(75);
  const [sensitivity, setSensitivity] = useState(85);
  const [brightness, setBrightness] = useState(70);
  const [volume, setVolume] = useState(60);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-xl font-bold text-slate-800">{t('settingsTitle')}</h2>

      {/* Device Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-slate-800">{t('deviceConfig')}</h3>
        </div>
        <div className="p-5 grid sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <Cpu className="w-5 h-5 text-slate-500" />
            <div>
              <p className="text-xs text-slate-500">{t('firmwareVersion')}</p>
              <p className="font-semibold text-slate-700">v2.4.1 (XIAO ESP32-C6 RISC-V)</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <Battery className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="text-xs text-slate-500">{t('batteryLevel')}</p>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-medical-green rounded-full" style={{ width: '87%' }} />
                </div>
                <span className="font-semibold text-slate-700 text-sm">87%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <Wifi className="w-5 h-5 text-primary-500" />
            <div>
              <p className="text-xs text-slate-500">{t('wifiConfig')}</p>
              <p className="font-semibold text-slate-700">VascGuard_AP (Connected)</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <Info className="w-5 h-5 text-slate-500" />
            <div>
              <p className="text-xs text-slate-500">Hardware Core</p>
              <p className="font-semibold text-slate-700">Seeed Studio XIAO ESP32-C6</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-5">
        <SliderSetting
          icon={<Gauge className="w-4 h-4 text-primary-500" />}
          label={t('servoCalibration')}
          value={servo} onChange={setServo}
          unit="°"
        />
        <SliderSetting
          icon={<Settings className="w-4 h-4 text-amber-500" />}
          label={t('sensorSensitivity')}
          value={sensitivity} onChange={setSensitivity}
        />
        <SliderSetting
          icon={<Sun className="w-4 h-4 text-yellow-500" />}
          label={t('screenBrightness')}
          value={brightness} onChange={setBrightness}
        />
        <SliderSetting
          icon={<Volume2 className="w-4 h-4 text-cyan-500" />}
          label={t('volume')}
          value={volume} onChange={setVolume}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all shadow-lg ${
            saved
              ? 'bg-medical-green shadow-emerald-200'
              : 'bg-gradient-to-r from-primary-600 to-primary-700 shadow-primary-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {saved ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          {saved ? 'Saved!' : t('saveSettings')}
        </button>
        <button
          onClick={() => { setServo(75); setSensitivity(85); setBrightness(70); setVolume(60); }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  );
}

