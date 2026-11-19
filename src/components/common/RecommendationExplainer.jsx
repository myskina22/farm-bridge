import React from 'react';
import { Award, TrendingUp, MapPin, PackageCheck, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function RecommendationExplainer({ evaluation }) {
  if (!evaluation) return null;

  const { compositeScore, factorBreakdown, calc, badges, shelfLifeRisk } = evaluation;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {compositeScore}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              Multi-Factor Match Score
              <span className="text-emerald-700 font-semibold text-xs">/ 100</span>
            </h4>
            <p className="text-slate-500 text-[11px]">Ranked using Net Return, Shelf Life, Proximity & Volume Fit</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {badges?.map((b, i) => (
            <span
              key={i}
              className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                b.type === 'danger'
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : b.type === 'warning'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : b.type === 'success'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}
            >
              {b.label}
            </span>
          ))}
        </div>
      </div>

      {/* 5-Factor Progress Breakdown */}
      <div className="space-y-2.5">
        {/* Net Return Factor */}
        <div>
          <div className="flex justify-between items-center mb-1 text-slate-700">
            <span className="font-semibold flex items-center gap-1 text-[11px]">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              1. Estimated Net Return (Weight: 40%)
            </span>
            <span className="font-bold text-slate-900">
              ₹{factorBreakdown.netReturn.netReturnPerUnit}/unit (Score: {factorBreakdown.netReturn.score}/100)
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full" 
              style={{ width: `${Math.min(100, factorBreakdown.netReturn.score)}%` }}
            />
          </div>
        </div>

        {/* Distance & Logistics Factor */}
        <div>
          <div className="flex justify-between items-center mb-1 text-slate-700">
            <span className="font-semibold flex items-center gap-1 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              2. Distance & Transit Friction (Weight: 20%)
            </span>
            <span className="font-bold text-slate-900">
              {factorBreakdown.distance.distanceKm} km (Score: {factorBreakdown.distance.score}/100)
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-blue-500 h-1.5 rounded-full" 
              style={{ width: `${Math.min(100, factorBreakdown.distance.score)}%` }}
            />
          </div>
        </div>

        {/* Quantity Fit Factor */}
        <div>
          <div className="flex justify-between items-center mb-1 text-slate-700">
            <span className="font-semibold flex items-center gap-1 text-[11px]">
              <PackageCheck className="w-3.5 h-3.5 text-purple-600" />
              3. Volume Fit & Lot Coverage (Weight: 15%)
            </span>
            <span className="font-bold text-slate-900">
              {factorBreakdown.quantityFit.coveragePercent}% of Lot (Score: {factorBreakdown.quantityFit.score}/100)
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-purple-500 h-1.5 rounded-full" 
              style={{ width: `${Math.min(100, factorBreakdown.quantityFit.score)}%` }}
            />
          </div>
        </div>

        {/* Delivery Window & Shelf Life Factor */}
        <div>
          <div className="flex justify-between items-center mb-1 text-slate-700">
            <span className="font-semibold flex items-center gap-1 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              4. Shelf Life & Transit Window (Weight: 15%)
            </span>
            <span className="font-bold text-slate-900">
              {factorBreakdown.shelfLife.transitDays}d transit vs {factorBreakdown.shelfLife.shelfDaysRemaining}d shelf life ({factorBreakdown.shelfLife.score}/100)
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-1.5 rounded-full ${
                shelfLifeRisk === 'CRITICAL_SPOILAGE_RISK' ? 'bg-rose-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, factorBreakdown.shelfLife.score)}%` }}
            />
          </div>
        </div>

        {/* Buyer Trust & Verification */}
        <div>
          <div className="flex justify-between items-center mb-1 text-slate-700">
            <span className="font-semibold flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              5. Buyer Trust & KYC Badge (Weight: 10%)
            </span>
            <span className="font-bold text-slate-900">
              {factorBreakdown.trust.verified ? 'Verified Business' : 'Unverified'} ({factorBreakdown.trust.score}/100)
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-teal-500 h-1.5 rounded-full" 
              style={{ width: `${Math.min(100, factorBreakdown.trust.score)}%` }}
            />
          </div>
        </div>
      </div>

      {shelfLifeRisk === 'CRITICAL_SPOILAGE_RISK' && (
        <div className="mt-3 p-2 bg-rose-50 border border-rose-200 rounded text-rose-800 text-[11px] flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span><strong>Spoilage Warning:</strong> Transit duration exceeds crop shelf life. High risk of reject at receiving dock!</span>
        </div>
      )}
    </div>
  );
}
