import React, { useState } from 'react';
import { X, Send, DollarSign, Truck, MapPin, Calendar, Clock, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { db } from '../../services/db.js';
import { calculateNetReturn } from '../../services/transportCalculator.js';
import VerificationBadge from '../common/VerificationBadge.jsx';

export default function SubmitOfferModal({ isOpen, onClose, listing, buyer, onOfferSubmitted }) {
  if (!isOpen || !listing) return null;

  const [offeredPrice, setOfferedPrice] = useState(listing.expectedPrice);
  const [quantity, setQuantity] = useState(listing.quantity);
  const [transportMode, setTransportMode] = useState('platform_organized');
  const [deliveryDate, setDeliveryDate] = useState(listing.availableUntil);
  const [pickupWindow, setPickupWindow] = useState('Within 48 hours of acceptance');
  const [paymentTerms, setPaymentTerms] = useState('25% Advance on Loading, 75% on Hub Acceptance');
  const [notes, setNotes] = useState('');
  const [distanceKm, setDistanceKm] = useState(150);
  const [error, setError] = useState('');

  // Live calculation of farmer's net return
  const isPerishable = listing.cropId?.includes('tomato') || listing.cropId?.includes('mango') || listing.cropId?.includes('chili');
  const previewCalc = calculateNetReturn({
    distanceKm: Number(distanceKm),
    quantity: Number(quantity),
    unit: listing.unit,
    offeredPrice: Number(offeredPrice),
    isPerishable,
    transportMode
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!offeredPrice || offeredPrice <= 0) {
      setError('Please provide a valid offered price.');
      return;
    }
    if (!quantity || quantity <= 0) {
      setError('Please provide a valid quantity.');
      return;
    }

    const newOffer = db.createOffer({
      listingId: listing.id,
      buyerId: buyer.id,
      buyerName: buyer.name,
      buyerType: buyer.buyerType || 'Wholesale Buyer',
      buyerVerified: buyer.verificationStatus === 'verified',
      offeredPrice: Number(offeredPrice),
      quantity: Number(quantity),
      unit: listing.unit,
      deliveryDate,
      transportMode,
      distanceKm: Number(distanceKm),
      pickupWindow,
      paymentTerms,
      notes: notes || `Direct purchase offer from ${buyer.name} for ${quantity} ${listing.unit}.`
    });

    onOfferSubmitted(newOffer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="font-bold text-base text-white">Submit Buyer Offer</h3>
            <p className="text-slate-400 text-xs">
              Direct procurement proposal for: <strong>{listing.cropName}</strong>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Listing Context Bar */}
        <div className="bg-emerald-50/80 px-6 py-3 border-b border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-900">
          <div>
            <span>Farmer Target Price: <strong>₹{listing.expectedPrice}/{listing.unit}</strong></span>
            <span> • Lot Size: <strong>{listing.quantity} {listing.unit}</strong></span>
          </div>
          <div>
            <span>Location: <strong>{listing.farmLocation}</strong></span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Pricing & Quantity */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700">Your Offered Price (₹/{listing.unit}) *</label>
                <span className="text-[10px] text-slate-500">Mandi Modal: ₹{listing.benchmarkModalPrice}</span>
              </div>
              <input
                type="number"
                step="0.5"
                min="1"
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700">Quantity Needed ({listing.unit}) *</label>
                <button
                  type="button"
                  onClick={() => setQuantity(listing.quantity)}
                  className="text-[10px] text-emerald-700 hover:underline font-semibold cursor-pointer"
                >
                  Buy Entire Lot ({listing.quantity})
                </button>
              </div>
              <input
                type="number"
                min="1"
                max={listing.quantity}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Transport Mode & Distance */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Transport Coordination *</label>
              <select
                value={transportMode}
                onChange={(e) => setTransportMode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
              >
                <option value="platform_organized">Platform Freight (Standard Dispatch)</option>
                <option value="pooled_transport">Coordinated Pooled Freight (36% Group Discount)</option>
                <option value="buyer_arranged">Buyer-Arranged Pickup (Farm Gate)</option>
                <option value="farmer_arranged">Farmer-Arranged Direct Freight</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Distance to Your Receiving Hub (km)</label>
              <input
                type="number"
                min="10"
                max="2500"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Delivery Window & Payment Terms */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Requested Delivery Date</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Payment Settlement Terms</label>
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="25% Advance on Loading, 75% on Hub Acceptance">25% Advance on Loading, 75% on Hub Acceptance</option>
                <option value="100% Platform Escrow Transfer on Gate Weighment">100% Platform Escrow Transfer on Gate Weighment</option>
                <option value="15 Days Corporate Credit (Verified Buyers Only)">15 Days Corporate Credit (Verified Buyers Only)</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Notes / Packaging Instructions</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Palletized crates preferred. Dock open 7 AM to 11 PM."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Live Net-Return Preview Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Farmer Impact & Net Return Preview
              </span>
              <span className="text-[10px] text-slate-500">Live Logistics Simulation</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Gross Offer</span>
                <span className="font-bold text-slate-800">₹{(offeredPrice * quantity).toLocaleString()}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Est. Freight</span>
                <span className="font-bold text-rose-600">
                  {previewCalc.buyerCoversTransport ? '₹0 (Free)' : `₹${previewCalc.transportCost.toLocaleString()}`}
                </span>
              </div>
              <div className="bg-emerald-100/70 p-2 rounded-lg border border-emerald-300">
                <span className="text-[10px] text-emerald-900 block font-bold">Farmer Net Take-Home</span>
                <span className="font-black text-emerald-950">₹{previewCalc.netReturnPerUnit}/{listing.unit}</span>
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 hover:bg-black text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              Transmit Offer to Farmer
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
