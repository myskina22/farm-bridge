import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  DollarSign,
  Package,
  ShieldCheck,
  User
} from 'lucide-react';
import { db } from '../../services/db.js';
import VerificationBadge from '../common/VerificationBadge.jsx';

export default function NegotiationDrawer({
  isOpen,
  onClose,
  offer,
  listing,
  currentUser,
  onNegotiationUpdated
}) {
  if (!isOpen || !offer || !listing) return null;

  const [counterPrice, setCounterPrice] = useState(offer.offeredPrice);
  const [counterQty, setCounterQty] = useState(offer.quantity);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const isFarmer = currentUser.role === 'farmer';
  const senderRole = currentUser.role;
  const senderName = currentUser.name;

  const handleCounterSubmit = (e) => {
    e.preventDefault();
    if (!counterPrice || counterPrice <= 0) {
      setError('Please provide a valid counter price.');
      return;
    }

    const updated = db.addCounterOffer({
      offerId: offer.id,
      senderName,
      role: senderRole,
      counterPrice: Number(counterPrice),
      counterQuantity: Number(counterQty),
      message: message || `Counter proposed: ₹${counterPrice}/${offer.unit || 'unit'}`
    });

    setMessage('');
    setError('');
    onNegotiationUpdated(updated);
  };

  const handleAccept = () => {
    const { offer: updatedOffer, order } = db.acceptOffer(offer.id, senderName, senderRole);
    onNegotiationUpdated(updatedOffer, order);
    onClose();
  };

  const handleReject = () => {
    const updatedOffer = db.rejectOffer(offer.id, senderName, senderRole, 'Terms could not be mutually aligned.');
    onNegotiationUpdated(updatedOffer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Offer & Counter-Offer Negotiation</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  offer.status === 'accepted'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : offer.status === 'rejected'
                    ? 'bg-rose-500/20 text-rose-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {offer.status}
                </span>
              </div>
              <p className="text-slate-400 text-xs">
                Negotiating for: {listing.cropName} ({offer.quantity} {offer.unit})
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Counterparty summary bar */}
        <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div>
            <span className="text-slate-500">Buyer:</span> <strong>{offer.buyerName}</strong> ({offer.buyerType})
          </div>
          <div className="flex items-center gap-3">
            <span>Current Offer: <strong className="text-emerald-700">₹{offer.offeredPrice}/{offer.unit}</strong></span>
            <span>Target: <strong>₹{listing.expectedPrice}/{offer.unit}</strong></span>
          </div>
        </div>

        {/* Body: Chronological History Timeline */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
            Negotiation Audit Trail & Thread
          </h4>

          <div className="space-y-3">
            {offer.history?.map((step, idx) => {
              const isMine = (isFarmer && step.role === 'farmer') || (!isFarmer && step.role === 'buyer');

              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-xs ${
                      isMine
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1 text-[11px] opacity-80">
                      <span className="font-bold flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {step.sender} ({step.role})
                      </span>
                      <span>{new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div className="font-semibold text-sm my-1">
                      Proposed: ₹{step.price}/{offer.unit} for {step.quantity} {offer.unit}
                    </div>

                    {step.message && (
                      <p className="text-[11px] leading-relaxed opacity-95 mt-1 border-t border-white/20 pt-1">
                        "{step.message}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form to submit a counter-offer */}
          {offer.status !== 'accepted' && offer.status !== 'rejected' && (
            <form onSubmit={handleCounterSubmit} className="mt-6 pt-4 border-t border-slate-200 space-y-3">
              <h5 className="font-bold text-xs text-slate-800">
                Submit a Revised Counter-Offer
              </h5>

              {error && (
                <div className="p-2 text-[11px] bg-rose-50 text-rose-700 rounded border border-rose-200">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Counter Unit Price (₹/{offer.unit})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={counterPrice}
                    onChange={(e) => setCounterPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Quantity ({offer.unit})
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={counterQty}
                    onChange={(e) => setCounterQty(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-xs">
                  Reason / Terms Justification Note
                </label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Can do ₹31.50 if pickup is scheduled by tomorrow 2 PM."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Transmit Counter-Offer
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Action Controls in Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          {offer.status !== 'accepted' && offer.status !== 'rejected' ? (
            <>
              <button
                onClick={handleReject}
                className="px-3 py-1.5 border border-rose-300 bg-white hover:bg-rose-50 text-rose-700 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                Decline Terms
              </button>

              <button
                onClick={handleAccept}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                Accept Offer & Lock Order
              </button>
            </>
          ) : (
            <div className="w-full flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-600">
                This negotiation has concluded with status: <strong>{offer.status.toUpperCase()}</strong>.
              </span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
