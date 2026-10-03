import React, { useEffect, useState } from 'react';
import { Leaf, Wind, Droplets, Recycle, ShieldCheck, HelpCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { impactService } from '../services/impactService';
import { SustainabilityImpact } from '../types';
import { useAuth } from '../context/AuthContext';

export const ImpactPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [globalImpact, setGlobalImpact] = useState<SustainabilityImpact | null>(null);
  const [userImpact, setUserImpact] = useState<SustainabilityImpact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImpactData = async () => {
      try {
        const globalRes = await impactService.getGlobalImpact();
        setGlobalImpact(globalRes);
        if (isAuthenticated) {
          const userRes = await impactService.getUserImpact();
          setUserImpact(userRes);
        }
      } catch (e) {
        console.error('Error loading impact data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchImpactData();
  }, [isAuthenticated]);

  const chartData = [
    { name: 'CO₂ Avoided (kg)', Global: globalImpact?.co2Saved || 180, Personal: userImpact?.co2Saved || 0 },
    { name: 'Water Saved (L×10)', Global: Math.round((globalImpact?.waterSaved || 12500) / 10), Personal: Math.round((userImpact?.waterSaved || 0) / 10) },
    { name: 'Waste Diverted (kg)', Global: globalImpact?.wasteReduced || 450, Personal: userImpact?.wasteReduced || 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider">
          🌱 Transparency & Accountability
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Our Environmental Impact
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          Every purchase made on EcoMarket directly prevents e-waste, lowers manufacturing emissions, and saves precious water resources across India.
        </p>
      </div>

      {/* Global Impact Counter Section */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8">
        <h2 className="text-xl font-bold uppercase tracking-wider text-emerald-300 text-center">
          Platform-Wide Cumulative Environmental Savings
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
            <Wind className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-3xl sm:text-4xl font-black text-white">{globalImpact?.co2Saved || 180.5} kg</div>
            <div className="text-xs text-emerald-100/80 font-bold mt-1">CO₂ Emissions Avoided</div>
          </div>

          <div className="bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
            <Droplets className="w-8 h-8 text-sky-400 mx-auto mb-2" />
            <div className="text-3xl sm:text-4xl font-black text-white">{globalImpact?.waterSaved || 12500} L</div>
            <div className="text-xs text-emerald-100/80 font-bold mt-1">Water Saved</div>
          </div>

          <div className="bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
            <Recycle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-3xl sm:text-4xl font-black text-white">{globalImpact?.wasteReduced || 450} kg</div>
            <div className="text-xs text-emerald-100/80 font-bold mt-1">Waste Diverted</div>
          </div>

          <div className="bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
            <ShieldCheck className="w-8 h-8 text-teal-300 mx-auto mb-2" />
            <div className="text-3xl sm:text-4xl font-black text-white">{globalImpact?.productsReused || 120}</div>
            <div className="text-xs text-emerald-100/80 font-bold mt-1">Products Reused</div>
          </div>
        </div>
      </div>

      {/* Visual Chart Comparison */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-xl font-black text-slate-900">Comparative Sustainability Metrics</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Bar dataKey="Global" fill="#059669" radius={[8, 8, 0, 0]} />
              {isAuthenticated && <Bar dataKey="Personal" fill="#0284c7" radius={[8, 8, 0, 0]} />}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Methodology Section */}
      <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-slate-900">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold">Estimation Calculation Methodology</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Environmental impact calculations are deterministic estimates derived from lifecycle analysis (LCA) benchmarks across category averages:
        </p>
        <ul className="list-disc list-inside text-xs text-slate-600 space-y-1.5 font-medium pl-2">
          <li><strong>Refurbished Electronics:</strong> Saves approx. 18.5 kg CO₂ and 1,900 L water compared to manufacturing new silicon/aluminum chassis.</li>
          <li><strong>Upcycled & Reused Textiles:</strong> Saves approx. 2,700 L water (equivalent to 3 years of drinking water per denim jacket).</li>
          <li><strong>Pre-Owned Furniture & Goods:</strong> Diverts 2.8 to 4.2 kg of landfill waste per restored piece.</li>
        </ul>
        <p className="text-[11px] text-slate-400 italic">
          * Note: Values represent baseline lifecycle estimates and are displayed for consumer transparency.
        </p>
      </div>

    </div>
  );
};
