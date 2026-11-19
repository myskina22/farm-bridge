import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  TrendingUp,
  Plus,
  Scale,
  Sparkles,
  Search,
  Building,
  Sprout
} from 'lucide-react';
import VerificationBadge from '../common/VerificationBadge.jsx';
import { db } from '../../services/db.js';

export default function AdminDashboard({ users, priceObservations, crops, onRefreshData }) {
  const [activeTab, setActiveTab] = useState('verification'); // 'verification' | 'prices'
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // New Price Obs Form state
  const [newObsCropId, setNewObsCropId] = useState(crops[0]?.id || 'crop_tomato');
  const [newObsMarket, setNewObsMarket] = useState('Lasalgaon APMC Mandi');
  const [newObsDistrict, setNewObsDistrict] = useState('Nashik');
  const [newObsState, setNewObsState] = useState('Maharashtra');
  const [newObsMin, setNewObsMin] = useState(22);
  const [newObsModal, setNewObsModal] = useState(27.5);
  const [newObsMax, setNewObsMax] = useState(32);
  const [newObsSource, setNewObsSource] = useState('Agmarknet Daily Bulletin #MH-2026-1112');
  const [newObsUnit, setNewObsUnit] = useState('kg');
  const [showAddPriceModal, setShowAddPriceModal] = useState(false);

  const handleStatusChange = (userId, newStatus) => {
    db.updateUserVerification(userId, newStatus, `Admin verified on ${new Date().toLocaleDateString()}`);
    onRefreshData();
  };

  const handleAddPrice = (e) => {
    e.preventDefault();
    const crop = crops.find(c => c.id === newObsCropId);
    db.addPriceObservation({
      cropId: newObsCropId,
      cropName: crop?.name || 'Produce',
      variety: 'Commercial Hybrid',
      marketName: newObsMarket,
      district: newObsDistrict,
      state: newObsState,
      minPrice: Number(newObsMin),
      modalPrice: Number(newObsModal),
      maxPrice: Number(newObsMax),
      unit: newObsUnit,
      dataSource: newObsSource,
      arrivalsTons: 150
    });
    setShowAddPriceModal(false);
    onRefreshData();
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (userSearch) {
      const q = userSearch.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.location?.name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl text-white p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Platform Governance & Admin Console
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                KYC verification oversight, APMC price feed auditing, and ethical safety controls.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('verification')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'verification' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              KYC Verifications ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('prices')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'prices' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Mandi Price Feed
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: KYC Verification Management */}
      {activeTab === 'verification' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">User Identity & Profile Verification</h3>
              <p className="text-slate-500 text-xs">Approve or revoke verification status based on submitted documents.</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search name, email, location..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 font-medium text-slate-800 text-xs"
              />

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 font-medium text-slate-800 text-xs"
              >
                <option value="all">All Roles</option>
                <option value="farmer">Farmers</option>
                <option value="buyer">Buyers</option>
                <option value="transporter">Transporters</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="p-3">User & Organization</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Submitted Verification Proof</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-slate-500 text-[11px]">{u.email} • {u.location?.name}</div>
                    </td>
                    <td className="p-3 capitalize font-semibold text-slate-700">
                      {u.role}
                      {u.farmName && <div className="text-[10px] text-slate-500">{u.farmName}</div>}
                      {u.buyerType && <div className="text-[10px] text-slate-500">{u.buyerType}</div>}
                    </td>
                    <td className="p-3 text-slate-700 font-mono text-[11px] max-w-xs truncate">
                      {u.verificationDoc || 'No document on file'}
                    </td>
                    <td className="p-3">
                      <VerificationBadge status={u.verificationStatus} />
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      {u.verificationStatus !== 'verified' && (
                        <button
                          onClick={() => handleStatusChange(u.id, 'verified')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                        >
                          Approve KYC
                        </button>
                      )}
                      {u.verificationStatus !== 'pending' && (
                        <button
                          onClick={() => handleStatusChange(u.id, 'pending')}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                        >
                          Mark Pending
                        </button>
                      )}
                      {u.verificationStatus !== 'unverified' && (
                        <button
                          onClick={() => handleStatusChange(u.id, 'unverified')}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Price Feed Manager */}
      {activeTab === 'prices' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Official Price Observation Records</h3>
              <p className="text-slate-500 text-xs">Publish verified mandi prices strictly backed by APMC/Agmarknet citations.</p>
            </div>

            <button
              onClick={() => setShowAddPriceModal(true)}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record New Mandi Observation</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {priceObservations.map(obs => (
              <div key={obs.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900">{obs.marketName}</h4>
                    <p className="text-slate-500 text-[11px]">{obs.cropName} ({obs.variety}) • {obs.district}, {obs.state}</p>
                  </div>
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                    Modal: ₹{obs.modalPrice}/{obs.unit}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Range: ₹{obs.minPrice} - ₹{obs.maxPrice} • Observed: {obs.observationDate}
                </div>
                <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                  <strong>Source:</strong> {obs.dataSource}
                </div>
              </div>
            ))}
          </div>

          {/* Add Price Modal */}
          {showAddPriceModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-base text-slate-900">Record Official Mandi Price</h3>
                  <button onClick={() => setShowAddPriceModal(false)} className="text-slate-400 hover:text-slate-700">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddPrice} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Crop</label>
                    <select
                      value={newObsCropId}
                      onChange={(e) => setNewObsCropId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                    >
                      {crops.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Market Mandi Name</label>
                      <input
                        type="text"
                        value={newObsMarket}
                        onChange={(e) => setNewObsMarket(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">District, State</label>
                      <input
                        type="text"
                        value={newObsDistrict}
                        onChange={(e) => setNewObsDistrict(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Min Price</label>
                      <input
                        type="number"
                        value={newObsMin}
                        onChange={(e) => setNewObsMin(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Modal Price</label>
                      <input
                        type="number"
                        value={newObsModal}
                        onChange={(e) => setNewObsModal(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Max Price</label>
                      <input
                        type="number"
                        value={newObsMax}
                        onChange={(e) => setNewObsMax(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Verified Authority Source *</label>
                    <input
                      type="text"
                      value={newObsSource}
                      onChange={(e) => setNewObsSource(e.target.value)}
                      placeholder="e.g. Agmarknet Daily Bulletin #MH-2026-1112"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddPriceModal(false)}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg"
                    >
                      Publish Record
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
