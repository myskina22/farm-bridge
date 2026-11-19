import React, { useState } from 'react';
import {
  X,
  Scale,
  Sparkles,
  TrendingUp,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle,
  XCircle,
  MessageSquare,
  Truck,
  AlertTriangle,
  ChevronRight,
  Info
} from 'lucide-react';
import { rankOffersForListing } from '../../services/recommendationEngine.js';
import VerificationBadge from '../common/VerificationBadge.jsx';
import RecommendationExplainer from '../common/RecommendationExplainer.jsx';

export default function OfferComparisonModal({
  isOpen,
  onClose,
  listing,
  offers,
  onAcceptOffer,
  onCounterOffer,
  onRejectOffer
}) {
  if (!isOpen || !listing) return null;

  const [expandedOfferId, setExpandedOfferId] = useState(null);
  const { rankedOffers, topRecommended, highestPriceOffer, benchmark } = rankOffersForListing(offers, listing);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[94vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Compare Buyer Offers & Net Returns</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                  {offers.length} Offers Received
                </span>
              </div>
              <p className="text-slate-400 text-xs">
                {listing.cropName} • {listing.quantity} {listing.unit} • Expected Target: ₹{listing.expectedPrice}/{listing.unit}
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

        {/* Info Banner: Transparent Formula */}
        <div className="bg-emerald-50/80 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-900 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Net Return Formula:</strong> (Offered Price × Quantity) − Estimated Freight Logistics − Platform Fee.
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800">
            Produce Shelf Life Remaining: <strong>{listing.shelfLifeDays} Days</strong>
          </span>
        </div>

        {/* Main Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Comparison Cards Grid */}
          <div className="grid lg:grid-cols-2 gap-4">
            {rankedOffers.map((item, index) => {
              const { offer, calc, compositeScore, factorBreakdown, badges, shelfLifeRisk } = item;
              const isTop = index === 0;
              const isExpanded = expandedOfferId === offer.id;

              return (
                <div
                  key={offer.id}
                  className={`rounded-2xl border-2 transition-all p-5 flex flex-col justify-between ${
                    isTop
                      ? 'border-emerald-500 bg-emerald-50/30 shadow-md shadow-emerald-500/5 ring-2 ring-emerald-500/10'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Card Top: Rank & Buyer Profile */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            isTop ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            Rank #{index + 1}
                          </span>
                          {isTop && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                              <Sparkles className="w-3.5 h-3.5" />
                              Platform Recommended
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-base text-slate-900 mt-1">{offer.buyerName}</h4>
                        <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                          <span>{offer.buyerType}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {offer.distanceKm} km away
                          </span>
                          <VerificationBadge status={offer.buyerVerified ? 'verified' : 'unverified'} size="sm" />
                        </div>
                      </div>

                      {/* Score Badge */}
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Match Score</span>
                        <div className={`text-xl font-black ${isTop ? 'text-emerald-700' : 'text-slate-700'}`}>
                          {compositeScore}<span className="text-xs font-normal text-slate-400">/100</span>
                        </div>
                      </div>
                    </div>

                    {/* Financial Breakdown Matrix */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Gross Bid</span>
                        <span className="font-bold text-slate-800 text-sm">
                          ₹{offer.offeredPrice}/{offer.unit}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 block">Quantity</span>
                        <span className="font-bold text-slate-800 text-sm">
                          {offer.quantity} {offer.unit}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 block">Est. Freight</span>
                        <span className="font-bold text-rose-600 text-sm">
                          {calc.buyerCoversTransport ? 'Free (Buyer)' : `-₹${calc.transportCost.toLocaleString()}`}
                        </span>
                        {calc.poolingSavings > 0 && (
                          <span className="text-[9px] text-emerald-600 block font-bold">Saved ₹{calc.poolingSavings}</span>
                        )}
                      </div>

                      <div className="bg-emerald-100/60 p-1.5 rounded-lg border border-emerald-300">
                        <span className="text-[10px] font-bold text-emerald-800 block">Net Payout / Unit</span>
                        <span className="font-black text-emerald-950 text-sm">
                          ₹{calc.netReturnPerUnit}/{offer.unit}
                        </span>
                      </div>
                    </div>

                    {/* Logistics & Timing Specs */}
                    <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-slate-400" />
                          Transport Mode:
                        </span>
                        <span className="font-semibold text-slate-800 capitalize">
                          {offer.transportMode.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Pickup Window:
                        </span>
                        <span className="font-semibold text-slate-800">{offer.pickupWindow}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Total Farmer Net Proceeds:</span>
                        <span className="font-bold text-emerald-700 text-sm">
                          ₹{calc.netFarmerReturn.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Shelf Life Risk Callout if any */}
                    {shelfLifeRisk === 'CRITICAL_SPOILAGE_RISK' && (
                      <div className="mb-3 p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-[11px] flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span><strong>Rot Risk:</strong> 1,200+ km transit time exceeds tomato 4-day shelf life.</span>
                      </div>
                    )}

                    {/* Explainer Toggle */}
                    <button
                      onClick={() => setExpandedOfferId(isExpanded ? null : offer.id)}
                      className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 underline mb-3 cursor-pointer"
                    >
                      {isExpanded ? 'Hide Algorithm Scoring Breakdown' : 'View 5-Factor Score Breakdown'}
                    </button>

                    {isExpanded && (
                      <div className="mb-3">
                        <RecommendationExplainer evaluation={item} />
                      </div>
                    )}

                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onRejectOffer(offer.id)}
                      className="px-3 py-1.5 border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Decline
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onCounterOffer(offer)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Counter-Offer
                      </button>

                      <button
                        onClick={() => onAcceptOffer(offer.id)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs cursor-pointer flex items-center gap-1.5 ${
                          isTop
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : 'bg-slate-800 hover:bg-slate-900'
                        }`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Accept & Lock Order
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Validation Benchmark Teaser */}
          {benchmark && (
            <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
              <div>
                <h5 className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-amber-700" />
                  Engineering Benchmark: Platform Recommendation vs Naive Highest-Price
                </h5>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  The highest paper bid is ₹{highestPriceOffer?.offer.offeredPrice}/unit, but after long-haul transport it yields net ₹{highestPriceOffer?.calc.netReturnPerUnit}/unit. The smart recommended offer yields ₹{topRecommended?.calc.netReturnPerUnit}/unit net!
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg text-xs cursor-pointer"
          >
            Close Comparison
          </button>
        </div>

      </div>
    </div>
  );
}
