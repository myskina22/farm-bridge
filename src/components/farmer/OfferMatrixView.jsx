import React, { useState } from 'react';
import {
  Scale,
  Sparkles,
  TrendingUp,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle,
  Truck,
  AlertTriangle,
  ArrowRight,
  Info
} from 'lucide-react';
import { rankOffersForListing } from '../../services/recommendationEngine.js';
import VerificationBadge from '../common/VerificationBadge.jsx';
import RecommendationExplainer from '../common/RecommendationExplainer.jsx';

export default function OfferMatrixView({
  listings,
  offers,
  currentUser,
  onAcceptOffer,
  onRejectOffer,
  onOpenBenchmark
}) {
  const [selectedListingId, setSelectedListingId] = useState(listings[0]?.id || '');
  const [expandedOfferId, setExpandedOfferId] = useState(null);

  const selectedListing = listings.find(l => l.id === selectedListingId) || listings[0];
  const listingOffers = offers.filter(o => o.listingId === selectedListing?.id);

  const { rankedOffers, topRecommended, highestPriceOffer, benchmark } = rankOffersForListing(
    listingOffers,
    selectedListing
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl text-white p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Multi-Attribute Offer Comparison Matrix
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                Evaluate competing buyer bids by true net return, distance friction, quantity fit, and produce shelf life.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenBenchmark}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Benchmark Lab</span>
          </button>
        </div>
      </div>

      {/* Produce Selector Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <label className="font-bold text-slate-700">Select Produce Listing to Analyze:</label>
          <select
            value={selectedListingId}
            onChange={(e) => setSelectedListingId(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 flex-1 max-w-md"
          >
            {listings.map(l => (
              <option key={l.id} value={l.id}>
                {l.cropName} • {l.quantity} {l.unit} ({l.farmLocation})
              </option>
            ))}
          </select>
        </div>

        {selectedListing && (
          <div className="flex items-center gap-4 text-slate-600">
            <div>
              <span className="text-[10px] text-slate-400 block">Expected Reserve</span>
              <span className="font-bold text-emerald-700">₹{selectedListing.expectedPrice}/{selectedListing.unit}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Remaining Shelf Life</span>
              <span className="font-bold text-slate-800">{selectedListing.shelfLifeDays} Days</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Offers Received</span>
              <span className="font-bold text-slate-800">{listingOffers.length} Bids</span>
            </div>
          </div>
        )}
      </div>

      {/* Offers Matrix Table / Cards */}
      {rankedOffers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200">
          <Scale className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 text-sm">No Offers Submitted for this Listing Yet</h3>
          <p className="text-xs text-slate-400 mt-1">
            Switch to a Buyer persona to submit competitive bids, or select another produce lot above.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-4">
            {rankedOffers.map((item, index) => {
              const { offer, calc, compositeScore, badges, shelfLifeRisk } = item;
              const isTop = index === 0;
              const isExpanded = expandedOfferId === offer.id;

              return (
                <div
                  key={offer.id}
                  className={`rounded-2xl border-2 p-5 transition-all text-xs flex flex-col justify-between ${
                    isTop
                      ? 'border-emerald-500 bg-emerald-50/20 shadow-md ring-2 ring-emerald-500/10'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            isTop ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            Rank #{index + 1}
                          </span>
                          {isTop && (
                            <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" />
                              Platform Recommended
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-base text-slate-900 mt-1">{offer.buyerName}</h3>
                        <p className="text-slate-500 text-xs">
                          {offer.buyerType} • {offer.distanceKm} km transit • Mode: {offer.transportMode.replace('_', ' ')}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Algorithm Score</span>
                        <span className={`text-2xl font-black ${isTop ? 'text-emerald-700' : 'text-slate-700'}`}>
                          {compositeScore}<span className="text-xs font-normal text-slate-400">/100</span>
                        </span>
                      </div>
                    </div>

                    {/* Financial Matrix Box */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-center my-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">Gross Bid</span>
                        <span className="font-bold text-slate-800 text-sm">₹{offer.offeredPrice}/{offer.unit}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">Quantity</span>
                        <span className="font-bold text-slate-800 text-sm">{offer.quantity} {offer.unit}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">Freight Cost</span>
                        <span className="font-bold text-rose-600 text-sm">
                          {calc.buyerCoversTransport ? 'Free' : `₹${calc.transportCost.toLocaleString()}`}
                        </span>
                      </div>
                      <div className="bg-emerald-100/60 p-1 rounded-lg border border-emerald-300">
                        <span className="text-[10px] text-emerald-800 block font-bold">Net Return / Unit</span>
                        <span className="font-black text-emerald-950 text-sm">₹{calc.netReturnPerUnit}/{offer.unit}</span>
                      </div>
                    </div>

                    {/* Timing & Total Return */}
                    <div className="space-y-1 text-slate-600 text-[11px] mb-3">
                      <div className="flex justify-between">
                        <span>Pickup Timing:</span>
                        <span className="font-semibold text-slate-800">{offer.pickupWindow}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Farmer Net Payout:</span>
                        <span className="font-bold text-emerald-700 text-xs">₹{calc.netFarmerReturn.toLocaleString()}</span>
                      </div>
                    </div>

                    {shelfLifeRisk === 'CRITICAL_SPOILAGE_RISK' && (
                      <div className="p-2 mb-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-[11px] flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span><strong>Severe Transit Risk:</strong> Long distance exceeds crop shelf life. High spoilage chance!</span>
                      </div>
                    )}

                    {/* Explainer Accordion */}
                    <button
                      onClick={() => setExpandedOfferId(isExpanded ? null : offer.id)}
                      className="text-[11px] font-semibold text-emerald-700 hover:underline mb-2 cursor-pointer"
                    >
                      {isExpanded ? 'Hide Score Breakdown' : 'Show 5-Factor Score Breakdown'}
                    </button>

                    {isExpanded && (
                      <div className="mb-3">
                        <RecommendationExplainer evaluation={item} />
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => onRejectOffer(offer.id)}
                      className="text-slate-500 hover:text-rose-600 font-semibold cursor-pointer"
                    >
                      Decline Offer
                    </button>

                    <button
                      onClick={() => onAcceptOffer(offer.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs cursor-pointer flex items-center gap-1.5 ${
                        isTop ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-900 hover:bg-black'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Accept & Generate Order</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
