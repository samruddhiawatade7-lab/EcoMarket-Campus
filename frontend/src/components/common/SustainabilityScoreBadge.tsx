import React, { useState } from 'react';
import { Leaf, Info, CheckCircle2 } from 'lucide-react';
import { ProductCondition } from '../../types';

interface SustainabilityScoreBadgeProps {
  score?: number;
  condition?: ProductCondition;
  material?: string;
  showExplanation?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const SustainabilityScoreBadge: React.FC<SustainabilityScoreBadgeProps> = ({
  score = 75,
  condition,
  material,
  showExplanation = false,
  size = 'md'
}) => {
  const [showModal, setShowModal] = useState(false);

  const getScoreColor = (val: number) => {
    if (val >= 80) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (val >= 60) return 'bg-green-100 text-green-800 border-green-300';
    if (val >= 40) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-orange-100 text-orange-800 border-orange-300';
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold',
    md: 'px-2.5 py-1 text-xs font-bold',
    lg: 'px-3 py-1.5 text-sm font-extrabold'
  };

  return (
    <>
      <div className="inline-flex items-center gap-1.5">
        <span
          onClick={() => showExplanation && setShowModal(true)}
          className={`inline-flex items-center gap-1 rounded-full border ${getScoreColor(score)} ${sizeClasses[size]} ${
            showExplanation ? 'cursor-pointer hover:shadow-sm transition-all' : ''
          }`}
          title="EcoMarket Sustainability Score (0-100)"
        >
          <Leaf className="w-3.5 h-3.5 fill-current" />
          <span>Eco Score: {score}/100</span>
          {showExplanation && <Info className="w-3 h-3 ml-0.5 opacity-70" />}
        </span>
      </div>

      {/* Transparent Score Breakdown Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold text-lg">
                  {score}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Sustainability Score</h3>
                  <p className="text-xs text-slate-500">Transparent Scoring Algorithm</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                &times;
              </button>
            </div>

            <p className="text-sm text-slate-600">
              Every EcoMarket product is assigned a deterministic sustainability score from 0 to 100 based on circular economy principles.
            </p>

            <div className="space-y-2.5 text-sm bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
              <h4 className="font-bold text-emerald-900 text-xs uppercase tracking-wider">Why this score?</h4>
              
              <div className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Condition ({condition || 'reused/refurbished'}):</strong> Reduces raw material extraction & manufacturing footprint.
                </span>
              </div>

              {material && (
                <div className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Material ({material}):</strong> Contains recyclable or low-impact eco materials.
                  </span>
                </div>
              )}

              <div className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Minimal Packaging:</strong> Shipped using recyclable paper/cardboard without single-use plastics.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
