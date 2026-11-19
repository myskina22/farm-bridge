import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Calendar,
  Building,
  ShieldCheck,
  Info,
  Scale,
  Sparkles,
  Search,
  CheckCircle2
} from 'lucide-react';
import { safetyAndLimitationsNotice } from '../../services/db.js';

export default function MarketPriceDashboard({ priceObservations, crops }) {
  const [selectedCropId, setSelectedCropId] = useState('all');
  const [searchMandi, setSearchMandi] = useState('');

  let filtered = priceObservations.filter((p) => {
    if (selectedCropId !== 'all' && p.cropId !== selectedCropId) return false;
    if (searchMandi) {
      const q = searchMandi.toLowerCase();
      const match =
        p.marketName.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.cropName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl text-white p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Official Mandi Price Intelligence
              </h1>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Transparent wholesale commodity price observations aggregated strictly from verified APMC market boards and Agmarknet bulletins with date and location stamps.
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-3 border border-white/20 text-xs text-slate-300">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Governance Policy</span>
            <span className="font-semibold text-emerald-400">Zero Fabricated Spot Prices</span>
          </div>
        </div>
      </div>

      {/* Safety & Ethics Disclaimer Box */}
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-900 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
          <Scale className="w-4 h-4 text-amber-700" />
          Regulatory Notice & Transparency Commitment
        </div>
        <p className="leading-relaxed text-[11px]">
          In compliance with agricultural safety and ethics guidelines, FarmBridge <strong>does not generate synthetic or speculative live market prices</strong>. All market-price information reflects actual recorded trades from the stated APMC/Agmarknet source on the recorded date. Modal prices serve as regional reference benchmarks; transport costs, grading variances, and buyer negotiations determine final farm-gate returns.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchMandi}
            onChange={(e) => setSearchMandi(e.target.value)}
            placeholder="Filter by market yard (Lasalgaon, Vashi, Azadpur), district, or state..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="font-bold text-slate-600">Filter Crop:</label>
          <select
            value={selectedCropId}
            onChange={(e) => setSelectedCropId(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 font-medium text-slate-800"
          >
            <option value="all">All Commodities</option>
            {crops.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Price Observations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((obs) => {
          const spreadWidth = Math.max(0, obs.maxPrice - obs.minPrice);

          return (
            <div
              key={obs.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between text-xs space-y-4"
            >
              <div>
                {/* Header: Market & Crop */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {obs.district}, {obs.state}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-0.5">{obs.marketName}</h3>
                    <p className="text-slate-600 text-xs font-semibold">{obs.cropName} ({obs.variety})</p>
                  </div>

                  {/* Trend Indicator */}
                  <div className="text-right">
                    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      obs.trend === 'up'
                        ? 'bg-emerald-100 text-emerald-800'
                        : obs.trend === 'down'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {obs.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                      {obs.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                      {obs.trend === 'stable' && <Minus className="w-3 h-3" />}
                      <span>{obs.trendPercent > 0 ? `+${obs.trendPercent}%` : `${obs.trendPercent}%`}</span>
                    </span>
                  </div>
                </div>

                {/* Price Matrix */}
                <div className="grid grid-cols-3 gap-2 my-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Min</span>
                    <span className="font-bold text-slate-700 text-sm">₹{obs.minPrice}</span>
                  </div>
                  <div className="bg-emerald-100/70 p-1 rounded-lg border border-emerald-300">
                    <span className="text-[10px] text-emerald-800 uppercase block font-bold">Modal (Avg)</span>
                    <span className="font-black text-emerald-950 text-base">₹{obs.modalPrice}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Max</span>
                    <span className="font-bold text-slate-700 text-sm">₹{obs.maxPrice}</span>
                  </div>
                </div>

                {/* Visual Spread Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Range Spread: ₹{obs.minPrice} to ₹{obs.maxPrice}/{obs.unit}</span>
                    <span>Daily Volume: {obs.arrivalsTons} MT</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-500 h-full w-full rounded-full" />
                  </div>
                </div>
              </div>

              {/* Verified Source & Date Stamp (Mandatory for Safety & Ethics) */}
              <div className="pt-3 border-t border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <Calendar className="w-3 h-3 text-emerald-600" />
                    Observed: {obs.observationDate}
                  </span>
                  <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    Official Record
                  </span>
                </div>

                <p className="text-[10px] text-slate-500 leading-tight">
                  <strong>Source:</strong> {obs.dataSource}
                </p>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
