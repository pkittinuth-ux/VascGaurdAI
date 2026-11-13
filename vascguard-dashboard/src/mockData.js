export const patientRecords = [
  { id: "VG-2026-0847", name: "Somchai K.", date: "2026-11-06 14:32", symmetry: 0.96, hr: 72, temp: 32.4, risk: "normal", action: "cleared" },
  { id: "VG-2026-0846", name: "Wilai P.", date: "2026-11-06 13:15", symmetry: 0.78, hr: 84, temp: 30.1, risk: "high", action: "referred" },
  { id: "VG-2026-0845", name: "Prasert T.", date: "2026-11-06 11:48", symmetry: 0.88, hr: 68, temp: 31.8, risk: "moderate", action: "monitoring" },
  { id: "VG-2026-0844", name: "Somporn L.", date: "2026-11-06 10:22", symmetry: 0.94, hr: 76, temp: 32.6, risk: "normal", action: "cleared" },
  { id: "VG-2026-0843", name: "Anan W.", date: "2026-11-06 09:05", symmetry: 0.82, hr: 91, temp: 29.8, risk: "high", action: "referred" },
  { id: "VG-2026-0842", name: "Malee S.", date: "2026-11-05 16:40", symmetry: 0.91, hr: 70, temp: 32.0, risk: "normal", action: "cleared" },
  { id: "VG-2026-0841", name: "Kanya R.", date: "2026-11-05 15:18", symmetry: 0.85, hr: 78, temp: 31.2, risk: "moderate", action: "monitoring" },
  { id: "VG-2026-0840", name: "Boonchu D.", date: "2026-11-05 14:01", symmetry: 0.93, hr: 65, temp: 32.8, risk: "normal", action: "cleared" },
  { id: "VG-2026-0839", name: "Supaporn N.", date: "2026-11-05 11:33", symmetry: 0.76, hr: 88, temp: 29.5, risk: "high", action: "referred" },
  { id: "VG-2026-0838", name: "Thaweesak M.", date: "2026-11-05 09:47", symmetry: 0.90, hr: 74, temp: 31.9, risk: "moderate", action: "monitoring" },
  { id: "VG-2026-0837", name: "Duangjai C.", date: "2026-11-04 15:55", symmetry: 0.97, hr: 69, temp: 32.5, risk: "normal", action: "cleared" },
  { id: "VG-2026-0836", name: "Wichai B.", date: "2026-11-04 14:22", symmetry: 0.80, hr: 86, temp: 30.3, risk: "high", action: "referred" },
];

export const padStatistics = [
  { ageGroup: "under50", patients: "~120,000", detectionRate: "3.2%", prevalence: "2-5%" },
  { ageGroup: "fiftyTo59", patients: "~340,000", detectionRate: "8.5%", prevalence: "5-10%" },
  { ageGroup: "sixtyTo69", patients: "~580,000", detectionRate: "14.2%", prevalence: "10-18%" },
  { ageGroup: "seventyTo79", patients: "~720,000", detectionRate: "21.7%", prevalence: "18-25%" },
  { ageGroup: "eightyPlus", patients: "~450,000", detectionRate: "28.3%", prevalence: "25-35%" },
];

export const traditionalMethods = [
  { method: "abi", cost: "300–1,500", pain: "moderate", time: "15–30 min", access: "hospital" },
  { method: "doppler", cost: "2,000–5,000", pain: "moderate", time: "30–60 min", access: "hospital" },
  { method: "cta", cost: "15,000–30,000", pain: "painful", time: "1–2 hrs", access: "hospital" },
  { method: "dsa", cost: "50,000–80,000+", pain: "painful", time: "2–4 hrs", access: "hospital" },
];

export const dashboardStats = {
  screeningsToday: 23,
  totalScreenings: 1847,
  patientsReferred: 142,
  avgRiskScore: 0.34,
  earlyDetections: 89,
};

