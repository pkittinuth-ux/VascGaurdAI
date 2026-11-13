import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import mqtt from 'mqtt';
import {
  Play, RotateCcw, Printer, Building2, ThermometerSun,
  Heart, Activity, Cpu, Shield, ShieldAlert, ShieldCheck,
  Fingerprint, Music, Sparkles, ChevronRight, Zap, Radio
} from 'lucide-react';
import PrintReportModal from './PrintReportModal';
import HospitalReferralModal from './HospitalReferralModal';

// ---------- Robot Face SVG Sub-Components ----------

function RobotFace({ mood, armsRaised }) {
  const eyeVariants = {
    idle: { leftY: 0, rightY: 0, blinkRate: 3000 },
    happy: { leftY: -2, rightY: -2, blinkRate: 0 },
    measuring: { leftY: 0, rightY: 0, blinkRate: 1500 },
    dancing: { leftY: -3, rightY: -3, blinkRate: 0 },
    processing: { leftY: 2, rightY: 2, blinkRate: 800 },
  };

  const variant = eyeVariants[mood] || eyeVariants.idle;

  return (
    <div className={`relative ${mood === 'dancing' ? 'robot-dance' : mood === 'idle' ? 'robot-bounce' : ''}`}>
      <svg viewBox="0 0 200 200" className="w-40 h-40 mx-auto drop-shadow-lg">
        {/* Antenna */}
        <line x1="100" y1="25" x2="100" y2="10" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
        <circle cx="100" cy="8" r="4" fill="#60a5fa" className={mood === 'idle' ? 'animate-pulse' : ''} />
        
        {/* Head */}
        <rect x="45" y="25" width="110" height="100" rx="25" ry="25"
          fill="url(#robotGrad)" stroke="#2563eb" strokeWidth="2.5" />
        
        {/* Screen face area */}
        <rect x="55" y="40" width="90" height="60" rx="12" ry="12"
          fill="#0f172a" opacity="0.9" />
        
        {/* Eyes */}
        {mood === 'happy' || mood === 'dancing' ? (
          <>
            {/* Happy arc eyes */}
            <path d="M 72 65 Q 80 55, 88 65" stroke="#60a5fa" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M 112 65 Q 120 55, 128 65" stroke="#60a5fa" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="80" cy={62 + variant.leftY} r="8" fill="#60a5fa">
              {variant.blinkRate > 0 && (
                <animate attributeName="ry" values="8;1;8" dur={`${variant.blinkRate}ms`} repeatCount="indefinite" />
              )}
            </circle>
            <circle cx="120" cy={62 + variant.rightY} r="8" fill="#60a5fa">
              {variant.blinkRate > 0 && (
                <animate attributeName="ry" values="8;1;8" dur={`${variant.blinkRate}ms`} repeatCount="indefinite" />
              )}
            </circle>
            {/* Pupils */}
            <circle cx="82" cy={62 + variant.leftY} r="3" fill="#1e3a5f" />
            <circle cx="122" cy={62 + variant.rightY} r="3" fill="#1e3a5f" />
          </>
        )}
        
        {/* Mouth */}
        {mood === 'happy' || mood === 'dancing' ? (
          <path d="M 82 82 Q 100 98, 118 82" stroke="#60a5fa" strokeWidth="3" fill="none" strokeLinecap="round" />
        ) : mood === 'processing' ? (
          <rect x="85" y="82" width="30" height="4" rx="2" fill="#60a5fa" opacity="0.7">
            <animate attributeName="width" values="30;15;30" dur="1s" repeatCount="indefinite" />
          </rect>
        ) : (
          <path d="M 85 85 Q 100 92, 115 85" stroke="#60a5fa" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}

        {/* Body */}
        <rect x="65" y="128" width="70" height="45" rx="12" ry="12"
          fill="url(#robotGrad)" stroke="#2563eb" strokeWidth="2" />
        
        {/* Body screen / heart */}
        <circle cx="100" cy="150" r="12" fill="#0f172a" opacity="0.6" />
        {/* Hand-drawn SVG heart icon (can't nest Lucide <svg> in <svg>) */}
        <path d="M100 158 C100 158 90 150 90 145 C90 141 93 139 96 139 C98 139 100 141 100 143 C100 141 102 139 104 139 C107 139 110 141 110 145 C110 150 100 158 100 158Z"
          fill="#f87171" stroke="#f87171" strokeWidth="0.5" opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.6;0.9" dur="1.2s" repeatCount="indefinite" />
        </path>

        {/* Arms */}
        <rect x={armsRaised ? "28" : "30"} y={armsRaised ? "110" : "135"} width="30" height="10" rx="5"
          fill="#3b82f6" stroke="#2563eb" strokeWidth="1.5"
          className={armsRaised ? 'arm-raise-left' : ''}
          style={{ transition: armsRaised ? undefined : 'all 0.5s ease' }}
        />
        <rect x={armsRaised ? "142" : "140"} y={armsRaised ? "110" : "135"} width="30" height="10" rx="5"
          fill="#3b82f6" stroke="#2563eb" strokeWidth="1.5"
          className={armsRaised ? 'arm-raise-right' : ''}
          style={{ transition: armsRaised ? undefined : 'all 0.5s ease' }}
        />

        {/* Sensor pads on hands */}
        {armsRaised && (
          <>
            <circle cx="28" cy="108" r="6" fill="#10b981" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1s" repeatCount="indefinite" />
            </circle>
            <circle cx="172" cy="108" r="6" fill="#10b981" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1s" repeatCount="indefinite" />
            </circle>
          </>
        )}

        {/* Gradient */}
        <defs>
          <linearGradient id="robotGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#dbeafe" />
            <stop offset="100%" stopColor="#bfdbfe" />
          </linearGradient>
        </defs>
      </svg>

      {/* Musical notes for dancing */}
      {mood === 'dancing' && (
        <div className="absolute top-0 right-4 pointer-events-none">
          <Music className="w-5 h-5 text-primary-400 float-note absolute -top-2 right-0" />
          <Music className="w-4 h-4 text-primary-300 float-note-delay absolute top-2 right-6" />
          <Sparkles className="w-4 h-4 text-yellow-400 float-note absolute top-4 -right-2" />
        </div>
      )}
    </div>
  );
}

// ---------- PPG Wave Component ----------

function PPGWave({ color = '#3b82f6', height = 60, animate = true }) {
  const points = [];
  const totalWidth = 400;
  for (let x = 0; x <= totalWidth; x += 2) {
    const phase = (x / totalWidth) * Math.PI * 6;
    const y = height / 2 +
      Math.sin(phase) * (height * 0.3) +
      Math.sin(phase * 2.5) * (height * 0.12) +
      (Math.sin(phase * 0.5) > 0.7 ? -height * 0.15 : 0);
    points.push(`${x},${y.toFixed(1)}`);
  }

  return (
    <div className="overflow-hidden rounded-lg bg-slate-900/80 p-2" style={{ height: height + 16 }}>
      <svg width="100%" height={height} viewBox={`0 0 200 ${height}`} preserveAspectRatio="none">
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map(f => (
          <line key={f} x1="0" y1={height * f} x2="200" y2={height * f}
            stroke="#334155" strokeWidth="0.5" strokeDasharray="2,4" />
        ))}
        <g className={animate ? 'ppg-animate' : ''}>
          <polyline
            points={points.join(' ')}
            fill="none"
            stroke={color}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          {/* Duplicate for seamless loop */}
          <polyline
            points={points.map(p => {
              const [x, y] = p.split(',');
              return `${parseFloat(x) + totalWidth},${y}`;
            }).join(' ')}
            fill="none"
            stroke={color}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
    </div>
  );
}

// ---------- Countdown Ring ----------

function CountdownRing({ seconds, total }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = ((total - seconds) / total) * circumference;

  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#1e293b" strokeWidth="6" />
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#3b82f6" strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{seconds}</span>
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">sec</span>
      </div>
    </div>
  );
}

// ---------- Stage Content Components ----------

function StageIdle({ t, onStart }) {
  return (
    <div className="text-center space-y-5 fade-in">
      <RobotFace mood="idle" armsRaised={false} />
      <div>
        <h3 className="text-xl font-bold text-white">{t('idleTitle')}</h3>
        <p className="text-primary-300 mt-1 text-sm">{t('idleSubtitle')}</p>
      </div>
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
        <Fingerprint className="w-4 h-4" />
        <span>{t('idleInstruction')}</span>
      </div>
      <button
        onClick={onStart}
        className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
      >
        <Play className="w-5 h-5" />
        {t('startButton')}
      </button>
    </div>
  );
}

function StageMeasuring({ t, seconds, hr, temp, pi }) {
  return (
    <div className="space-y-4 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">{t('measuringTitle')}</h3>
          <p className="text-primary-300 text-xs mt-0.5">{t('measuringSubtitle')}</p>
        </div>
        <CountdownRing seconds={seconds} total={30} />
      </div>

      <RobotFace mood="measuring" armsRaised={true} />

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 backdrop-blur rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 text-red-400 mb-1">
            <Heart className="w-4 h-4" />
            <span className="text-xs font-medium">{t('heartRate')}</span>
          </div>
          <div className="text-2xl font-bold text-white">{hr} <span className="text-sm text-slate-400">{t('bpm')}</span></div>
        </div>
        <div className="bg-white/5 backdrop-blur rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <ThermometerSun className="w-4 h-4" />
            <span className="text-xs font-medium">{t('fingerTemp')}</span>
          </div>
          <div className="text-2xl font-bold text-white">{temp} <span className="text-sm text-slate-400">{t('celsius')}</span></div>
        </div>
      </div>

      {/* PPG Waves */}
      <div className="space-y-2">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1"><Activity className="w-3 h-3 text-blue-400" /> {t('leftFinger')} — {t('ppgSignal')}</span>
            <span>PI: {pi.toFixed(2)}%</span>
          </div>
          <PPGWave color="#3b82f6" height={50} animate={true} />
        </div>
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1"><Activity className="w-3 h-3 text-cyan-400" /> {t('rightFinger')} — {t('ppgSignal')}</span>
            <span>PI: {(pi * 0.95).toFixed(2)}%</span>
          </div>
          <PPGWave color="#06b6d4" height={50} animate={true} />
        </div>
      </div>
    </div>
  );
}

function StageRelax({ t }) {
  return (
    <div className="text-center space-y-5 fade-in">
      <RobotFace mood="dancing" armsRaised={false} />
      <div>
        <h3 className="text-2xl font-bold text-white">{t('relaxTitle')}</h3>
        <p className="text-primary-300 mt-1">{t('relaxSubtitle')}</p>
      </div>
      <p className="text-slate-400 text-sm">{t('relaxMessage')}</p>
      <div className="flex justify-center gap-3 text-2xl">
        <span className="float-note">🎵</span>
        <span className="float-note-delay">🎶</span>
        <span className="float-note">💙</span>
      </div>
    </div>
  );
}

function StageProcessing({ t, progress }) {
  const steps = [
    t('processingStep1'),
    t('processingStep2'),
    t('processingStep3'),
    t('processingStep4'),
  ];

  return (
    <div className="text-center space-y-5 fade-in">
      <RobotFace mood="processing" armsRaised={false} />
      <div>
        <h3 className="text-xl font-bold text-white">{t('processingTitle')}</h3>
        <p className="text-primary-300 mt-1 text-sm">{t('processingSubtitle')}</p>
      </div>

      <div className="space-y-2 text-left max-w-xs mx-auto">
        {steps.map((step, i) => (
          <div key={i} className={`flex items-center gap-3 py-1.5 transition-all duration-300 ${
            progress > i ? 'opacity-100' : 'opacity-30'
          }`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
              progress > i ? 'bg-medical-green text-white' : 'bg-slate-700 text-slate-500'
            }`}>
              {progress > i ? '✓' : (i + 1)}
            </div>
            <span className="text-sm text-slate-300">{step}</span>
            {progress === i && (
              <div className="ml-auto w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-emerald-400">
        <Zap className="w-3.5 h-3.5" />
        <span>{t('processingOffline')}</span>
      </div>
    </div>
  );
}

function StageResult({ t, risk, onRestart, onPrint, onRefer }) {
  const riskConfigs = {
    normal: {
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      icon: <ShieldCheck className="w-8 h-8" />,
      label: t('riskNormal'),
      desc: t('riskNormalDesc'),
      rec: t('riskNormalRec'),
      emoji: '🟢',
      score: 0.96,
      hr: 72,
      temp: 32.4,
    },
    moderate: {
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
      icon: <Shield className="w-8 h-8" />,
      label: t('riskModerate'),
      desc: t('riskModerateDesc'),
      rec: t('riskModerateRec'),
      emoji: '🟡',
      score: 0.82,
      hr: 78,
      temp: 31.2,
    },
    high: {
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-400',
      icon: <ShieldAlert className="w-8 h-8" />,
      label: t('riskHigh'),
      desc: t('riskHighDesc'),
      rec: t('riskHighRec'),
      emoji: '🔴',
      score: 0.65,
      hr: 88,
      temp: 29.8,
    },
  };

  const cfg = riskConfigs[risk];

  return (
    <div className="space-y-4 fade-in">
      <h3 className="text-lg font-bold text-white text-center">{t('resultTitle')}</h3>
      
      <RobotFace mood="happy" armsRaised={false} />

      {/* Risk Banner */}
      <div className={`${cfg.bgColor} ${cfg.borderColor} border rounded-2xl p-5`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-xl bg-gradient-to-br ${cfg.color} text-white shadow-lg`}>
            {cfg.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">{cfg.emoji}</span>
              <h4 className={`text-xl font-bold ${cfg.textColor}`}>{cfg.label}</h4>
            </div>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">{cfg.desc}</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <div className="text-xs text-slate-400 mb-1">{t('symmetryScore')}</div>
          <div className={`text-xl font-bold ${cfg.textColor}`}>{cfg.score}</div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <div className="text-xs text-slate-400 mb-1">{t('heartRate')}</div>
          <div className="text-xl font-bold text-white">{cfg.hr} <span className="text-xs text-slate-400">{t('bpm')}</span></div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <div className="text-xs text-slate-400 mb-1">{t('fingerTemp')}</div>
          <div className="text-xl font-bold text-white">{cfg.temp}{t('celsius')}</div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="bg-primary-900/50 border border-primary-700/30 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <ChevronRight className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
          <p className="text-sm text-primary-200 leading-relaxed">{cfg.rec}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={onRestart}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-sm font-medium transition">
          <RotateCcw className="w-4 h-4" />
          {t('screenAgain')}
        </button>
        <button onClick={onPrint}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-sm font-medium transition">
          <Printer className="w-4 h-4" />
          {t('printResult')}
        </button>
        {risk === 'high' && (
          <button onClick={onRefer}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-red-500/20">
            <Building2 className="w-4 h-4" />
            {t('referHospital')}
          </button>
        )}
      </div>
    </div>
  );
}


// ========== MAIN ROBOT SIMULATION COMPONENT ==========

export default function RobotSimulation() {
  const { t } = useLanguage();
  const [stage, setStage] = useState(0); // 0=idle, 1=measuring, 2=relax, 3=processing, 4=result
  const [seconds, setSeconds] = useState(30);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [hr, setHr] = useState(72);
  const [temp, setTemp] = useState(32.4);
  const [pi, setPi] = useState(4.2);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [referralModalOpen, setReferralModalOpen] = useState(false);
  const [liveDevice, setLiveDevice] = useState(null);
  const timerRef = useRef(null);

  // Live XIAO ESP32-C6 Data: Direct HiveMQ Cloud WebSocket (Vercel-ready) + Local Bridge fallback
  useEffect(() => {
    let client = null;
    try {
      // Connect to HiveMQ Public WebSocket broker (supports WSS for HTTPS / Vercel!)
      const brokerUrl = 'wss://broker.hivemq.com:8884/mqtt';
      const clientId = 'vascguard-web-' + Math.random().toString(16).substring(2, 8);
      client = mqtt.connect(brokerUrl, {
        clientId,
        clean: true,
        reconnectPeriod: 4000,
        connectTimeout: 8000,
      });

      client.on('connect', () => {
        client.subscribe('tensai/max30102/+/telemetry', (err) => {
          if (!err) {
            console.log('[VascGuard Web] Subscribed directly to HiveMQ WSS topic: tensai/max30102/+/telemetry');
          }
        });
      });

      client.on('message', (topic, payloadBuffer) => {
        try {
          const raw = payloadBuffer.toString();
          const d = JSON.parse(raw);
          const parts = topic.split('/');
          const deviceId = parts[2] || 'XIAO-C6';

          setLiveDevice({ deviceId, data: d, receivedAt: new Date().toISOString() });

          if (d.heart_rate && d.heart_rate > 30) {
            setHr(d.heart_rate);
          }
          if (d.board_temp_c && parseFloat(d.board_temp_c) > 20) {
            setTemp(parseFloat(d.board_temp_c));
          }
        } catch (e) {
          console.error('[MQTT Parse Error]', e);
        }
      });
    } catch (err) {
      console.warn('[Direct MQTT WSS]', err);
    }

    // Secondary local poll if running on localhost
    const checkLocalFeed = async () => {
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        try {
          const res = await fetch('http://localhost:3001/api/telemetry/latest');
          if (res.status === 200) {
            const payload = await res.json();
            if (payload && payload.deviceId) {
              setLiveDevice(payload);
              const d = payload.data || {};
              if (d.heart_rate && d.heart_rate > 30) setHr(d.heart_rate);
              if (d.board_temp_c && parseFloat(d.board_temp_c) > 20) setTemp(parseFloat(d.board_temp_c));
            }
          }
        } catch (_) {}
      }
    };
    checkLocalFeed();
    const pollInterval = setInterval(checkLocalFeed, 4000);

    return () => {
      clearInterval(pollInterval);
      if (client) {
        try { client.end(true); } catch (_) {}
      }
    };
  }, []);

  // Randomize risk outcome
  const [riskOutcome, setRiskOutcome] = useState('normal');

  const stageLabels = [
    t('stageIdle'),
    t('stageMeasuring'),
    t('stageRelax'),
    t('stageProcessing'),
    t('stageResult'),
  ];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startMeasurement = useCallback(() => {
    setStage(1);
    setSeconds(30);

    // Randomize result
    const r = Math.random();
    setRiskOutcome(r < 0.5 ? 'normal' : r < 0.8 ? 'moderate' : 'high');

    // Countdown
    timerRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // Move to relax stage
          setStage(2);
          setTimeout(() => {
            setStage(3);
            // Processing steps
            let step = 0;
            const procTimer = setInterval(() => {
              step++;
              setProcessingProgress(step);
              if (step >= 4) {
                clearInterval(procTimer);
                setTimeout(() => setStage(4), 800);
              }
            }, 700);
          }, 2500);
          return 0;
        }
        // Simulate fluctuating metrics
        setHr(prev => Math.max(60, Math.min(100, prev + (Math.random() - 0.5) * 4)));
        setTemp(prev => Math.max(28, Math.min(34, prev + (Math.random() - 0.5) * 0.3)));
        setPi(prev => Math.max(1, Math.min(8, prev + (Math.random() - 0.5) * 0.5)));
        return prev - 1;
      });
    }, 1000);
  }, []);

  const restart = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStage(0);
    setSeconds(30);
    setProcessingProgress(0);
    setHr(72);
    setTemp(32.4);
    setPi(4.2);
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-primary-800/30">
      {/* Stage Progress Bar */}
      <div className="bg-black/20 px-4 py-2.5 flex items-center gap-2 overflow-x-auto">
        {stageLabels.map((label, i) => (
          <div key={i} className="flex items-center shrink-0">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              stage === i
                ? 'bg-primary-500/20 text-primary-300 ring-1 ring-primary-500/30'
                : stage > i
                  ? 'text-emerald-400'
                  : 'text-slate-600'
            }`}>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                stage > i ? 'bg-medical-green text-white' : stage === i ? 'bg-primary-500 text-white' : 'bg-slate-700 text-slate-500'
              }`}>
                {stage > i ? '✓' : i + 1}
              </div>
              <span className="hidden sm:inline">{label}</span>
            </div>
            {i < 4 && <ChevronRight className="w-3 h-3 text-slate-700 mx-1" />}
          </div>
        ))}
      </div>

      {/* Stage Content */}
      <div className="p-6 min-h-[520px] flex flex-col justify-center">
        {stage === 0 && <StageIdle t={t} onStart={startMeasurement} />}
        {stage === 1 && <StageMeasuring t={t} seconds={seconds} hr={Math.round(hr)} temp={temp.toFixed(1)} pi={pi} />}
        {stage === 2 && <StageRelax t={t} />}
        {stage === 3 && <StageProcessing t={t} progress={processingProgress} />}
        {stage === 4 && (
          <StageResult 
            t={t} 
            risk={riskOutcome} 
            onRestart={restart} 
            onPrint={() => setPrintModalOpen(true)}
            onRefer={() => setReferralModalOpen(true)}
          />
        )}
      </div>

      {/* Bottom XIAO ESP32-C6 status bar */}
      <div className="bg-black/30 px-4 py-2 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-primary-400" />
          <span>Seeed Studio XIAO ESP32-C6 • RISC-V @ 160MHz • Wi-Fi 6 / BLE 5 • TinyML</span>
          {liveDevice && (
            <span className="hidden md:inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-ring relative"></span>
              Live MCU: {liveDevice.deviceId}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-medical-green rounded-full pulse-ring relative" />
          <span>{t('liveStatus')}</span>
        </div>
      </div>

      {/* Modals */}
      <PrintReportModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        risk={riskOutcome}
        hr={Math.round(hr)}
        temp={temp.toFixed(1)}
        symmetryScore={riskOutcome === 'normal' ? '0.96' : riskOutcome === 'moderate' ? '0.82' : '0.65'}
      />

      <HospitalReferralModal
        isOpen={referralModalOpen}
        onClose={() => setReferralModalOpen(false)}
      />
    </div>
  );
}

