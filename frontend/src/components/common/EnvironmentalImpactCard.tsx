import React from 'react';
import { Wind, Droplets, Recycle } from 'lucide-react';

interface EnvironmentalImpactCardProps {
  co2Saved: number;
  waterSaved: number;
  wasteReduced: number;
  title?: string;
  className?: string;
}

export const EnvironmentalImpactCard: React.FC<EnvironmentalImpactCardProps> = ({
  co2Saved,
  waterSaved,
  wasteReduced,
  title = "Estimated Environmental Impact",
  className = ""
}) => {
  return (
    <div className={`bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
          <span className="text-base">🌱</span> {title}
        </h4>
        <span className="text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-medium">
          Estimated
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white/90 p-3 rounded-xl border border-emerald-100 shadow-sm flex flex-col items-center justify-center">
          <Wind className="w-5 h-5 text-emerald-600 mb-1" />
          <span className="text-base sm:text-lg font-black text-slate-900">{co2Saved} kg</span>
          <span className="text-[11px] text-slate-500 font-medium">CO₂ Avoided</span>
        </div>

        <div className="bg-white/90 p-3 rounded-xl border border-emerald-100 shadow-sm flex flex-col items-center justify-center">
          <Droplets className="w-5 h-5 text-sky-600 mb-1" />
          <span className="text-base sm:text-lg font-black text-slate-900">{waterSaved} L</span>
          <span className="text-[11px] text-slate-500 font-medium">Water Saved</span>
        </div>

        <div className="bg-white/90 p-3 rounded-xl border border-emerald-100 shadow-sm flex flex-col items-center justify-center">
          <Recycle className="w-5 h-5 text-amber-600 mb-1" />
          <span className="text-base sm:text-lg font-black text-slate-900">{wasteReduced} kg</span>
          <span className="text-[11px] text-slate-500 font-medium">Waste Reduced</span>
        </div>
      </div>
      
      <p className="mt-3 text-[11px] text-emerald-800/80 text-center italic">
        Calculated based on product condition, materials, and circular reuse metrics.
      </p>
    </div>
  );
};
