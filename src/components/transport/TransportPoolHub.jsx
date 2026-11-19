import React, { useState } from 'react';
import {
  Truck,
  Users,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  Plus,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Percent,
  Sparkles
} from 'lucide-react';
import { db } from '../../services/db.js';

export default function TransportPoolHub({ pools, currentUser, listings, onRefreshData }) {
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState(null);
  const [selectedListingId, setSelectedListingId] = useState('');
  const [quantityKg, setQuantityKg] = useState(2000);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleJoin = (e) => {
    e.preventDefault();
    if (!selectedPool) return;

    try {
      db.joinTransportPool(selectedPool.id, {
        farmerName: currentUser.name,
        farmLocation: currentUser.location?.name || 'Nashik Farm Cluster',
        crop: 'Tomatoes & Green Vegetables',
        quantityKg: Number(quantityKg),
        individualFreight: Math.round(Number(quantityKg) * 2.1)
      });
      setSuccess(`Successfully joined pooled shipment! Transport savings locked.`);
      setError('');
      setTimeout(() => {
        setJoinModalOpen(false);
        setSuccess('');
        onRefreshData();
      }, 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 rounded-2xl text-white p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-amber-300" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">Coordinated Transport Pooling</h1>
            </div>
            <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-2xl">
              Consolidate smallholder harvests heading along the same highway corridors. Cut freight costs by 30% to 45% using full-truckload (FTL) capacity.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 text-center text-xs">
            <span className="text-amber-200 block text-[10px] uppercase font-bold">Average Smallholder Savings</span>
            <span className="text-2xl font-black text-amber-300">36.5%</span>
            <span className="text-[10px] text-amber-100 block">Less freight cost per quintal</span>
          </div>
        </div>
      </div>

      {/* Pools Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {pools.map((pool) => {
          const percentFull = Math.min(100, Math.round((pool.currentBookedKg / pool.maxCapacityKg) * 100));

          return (
            <div
              key={pool.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between text-xs space-y-4"
            >
              <div>
                {/* Pool Title & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                      Corridor Pool
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-1">{pool.title}</h3>
                    <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {pool.originCluster} <ArrowRight className="w-3 h-3 text-slate-400" /> {pool.destinationHub}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Savings</span>
                    <span className="text-emerald-700 font-black text-base flex items-center gap-0.5">
                      <TrendingDown className="w-4 h-4" />
                      {pool.estimatedSavingsPercent}%
                    </span>
                  </div>
                </div>

                {/* Truck Capacity Progress Bar */}
                <div className="my-3 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-slate-500" />
                      Vehicle: <strong>{pool.vehicleType}</strong>
                    </span>
                    <span className="font-bold text-slate-900">
                      {pool.currentBookedKg.toLocaleString()} / {pool.maxCapacityKg.toLocaleString()} kg ({percentFull}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        percentFull >= 90 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percentFull}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Available Capacity: <strong>{pool.availableCapacityKg.toLocaleString()} kg</strong></span>
                    <span>Departure: <strong>{pool.departureDate} at {pool.departureTime}</strong></span>
                  </div>
                </div>

                {/* Participating Farmers Roster */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-700 text-[11px] flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    Consolidated Farmers ({pool.participants?.length || 0})
                  </h4>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {pool.participants?.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-slate-50 rounded-lg border border-slate-200/60 flex items-center justify-between text-[11px]"
                      >
                        <div>
                          <span className="font-bold text-slate-800">{p.farmerName}</span>
                          <span className="text-slate-500 text-[10px] block">{p.farmLocation} • {p.crop}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-900">{p.quantityKg.toLocaleString()} kg</span>
                          <span className="text-[10px] text-emerald-700 block font-semibold">
                            Saved ₹{p.savings.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Route Waypoints */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <h4 className="font-bold text-slate-700 text-[11px] mb-1">Coordinated Route Stops:</h4>
                  <ul className="text-[11px] text-slate-600 space-y-0.5">
                    {pool.routeWaypoints?.map((wp, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span>{wp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">
                  Carrier: <strong>{pool.carrier}</strong>
                </span>

                <button
                  disabled={pool.availableCapacityKg <= 0}
                  onClick={() => {
                    setSelectedPool(pool);
                    setJoinModalOpen(true);
                  }}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer ${
                    pool.availableCapacityKg <= 0
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Join this Pool</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Join Pool Modal */}
      {joinModalOpen && selectedPool && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Join Transport Corridor Pool</h3>
              <button onClick={() => setJoinModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-2.5 bg-rose-50 text-rose-700 rounded-lg text-xs">
                {error}
              </div>
            )}
            {success && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold">
                {success}
              </div>
            )}

            <form onSubmit={handleJoin} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Selected Corridor</label>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-semibold text-slate-800">
                  {selectedPool.title}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quantity to Pool (kg) *</label>
                <input
                  type="number"
                  min="100"
                  max={selectedPool.availableCapacityKg}
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-bold text-slate-900"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Available in this truck: {selectedPool.availableCapacityKg.toLocaleString()} kg
                </span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Standard Freight:</span>
                  <span className="line-through text-slate-400">₹{(quantityKg * 2.1).toFixed(0)}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-800 text-sm">
                  <span>Pooled Freight ({selectedPool.estimatedSavingsPercent}% OFF):</span>
                  <span>₹{Math.round(quantityKg * 2.1 * 0.64).toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setJoinModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg font-semibold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  Confirm Group Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
