import React, { useState } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  DollarSign,
  Package,
  Layers,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import VerificationBadge from '../common/VerificationBadge.jsx';
import SubmitOfferModal from './SubmitOfferModal.jsx';

export default function ProduceMarketplace({
  listings,
  crops,
  currentUser,
  onRefreshData,
  onOpenBenchmark
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [maxDistanceRadius, setMaxDistanceRadius] = useState(300); // km
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [minQuantity, setMinQuantity] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('freshness'); // 'freshness', 'price_asc', 'distance', 'quantity'
  const [submittingListing, setSubmittingListing] = useState(null);

  // Filter listings
  let filtered = listings.filter((l) => {
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        l.cropName.toLowerCase().includes(q) ||
        l.farmLocation.toLowerCase().includes(q) ||
        l.farmerName.toLowerCase().includes(q) ||
        l.grade.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Crop filter
    if (selectedCrop !== 'all' && l.cropId !== selectedCrop) return false;

    // Grade filter
    if (selectedGrade !== 'all' && !l.grade.includes(selectedGrade)) return false;

    // Min quantity
    if (minQuantity && l.quantity < Number(minQuantity)) return false;

    // Max expected price
    if (maxPrice && l.expectedPrice > Number(maxPrice)) return false;

    return true;
  });

  // Sort listings
  filtered.sort((a, b) => {
    if (sortBy === 'price_asc') return a.expectedPrice - b.expectedPrice;
    if (sortBy === 'price_desc') return b.expectedPrice - a.expectedPrice;
    if (sortBy === 'quantity') return b.quantity - a.quantity;
    if (sortBy === 'shelf_life') return b.shelfLifeDays - a.shelfLifeDays;
    // Default freshness: latest harvest date first
    return new Date(b.harvestDate) - new Date(a.harvestDate);
  });

  return (
    <div className="space-y-6">
      
      {/* Marketplace Header Banner */}
      <div className="bg-slate-900 rounded-2xl text-white p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">Direct Farm Marketplace</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Verified Farmers & FPOs
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Procure farm-fresh wholesale lots with guaranteed transport pooling and transparent quality grading.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenBenchmark}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Offer Engine Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Advanced Filters Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4 text-xs">
        
        {/* Top Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by crop name (Tomato, Onion, Rice), grade, farmer name, or farm location..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        {/* Multi-attribute Filter Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* Crop Selector */}
          <div>
            <label className="block font-bold text-slate-600 mb-1 text-[11px]">Crop Type</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-800"
            >
              <option value="all">All Crops</option>
              {crops.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Quality Grade */}
          <div>
            <label className="block font-bold text-slate-600 mb-1 text-[11px]">Quality Grade</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-800"
            >
              <option value="all">All Grades</option>
              <option value="Grade A">Grade A Premium</option>
              <option value="Organic">Organic Certified</option>
              <option value="Grade B">Grade B Standard</option>
            </select>
          </div>

          {/* Max Distance Radius */}
          <div>
            <label className="block font-bold text-slate-600 mb-1 text-[11px]">
              Max Radius ({maxDistanceRadius} km)
            </label>
            <input
              type="range"
              min="50"
              max="1500"
              step="50"
              value={maxDistanceRadius}
              onChange={(e) => setMaxDistanceRadius(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          {/* Min Quantity */}
          <div>
            <label className="block font-bold text-slate-600 mb-1 text-[11px]">Min Quantity</label>
            <input
              type="number"
              value={minQuantity}
              onChange={(e) => setMinQuantity(e.target.value)}
              placeholder="e.g. 1000"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-800"
            />
          </div>

          {/* Max Target Price */}
          <div>
            <label className="block font-bold text-slate-600 mb-1 text-[11px]">Max Price (₹/unit)</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="e.g. 35"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-800"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="block font-bold text-slate-600 mb-1 text-[11px]">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-800"
            >
              <option value="freshness">Newest Harvest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="quantity">Largest Volume</option>
              <option value="shelf_life">Longest Shelf Life</option>
            </select>
          </div>

        </div>

        {/* Active Filters Summary */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
          <span>Found <strong>{filtered.length}</strong> matching produce lots available for immediate offer</span>
          {(searchQuery || selectedCrop !== 'all' || selectedGrade !== 'all' || minQuantity || maxPrice) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCrop('all');
                setSelectedGrade('all');
                setMinQuantity('');
                setMaxPrice('');
              }}
              className="text-rose-600 hover:underline font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

      </div>

      {/* Listings Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200">
          <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 text-sm">No produce listings match your criteria</h3>
          <p className="text-xs text-slate-400 mt-1">Try widening your distance radius or clearing price filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((listing) => (
            <div
              key={listing.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image Header with Badges */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={listing.image}
                    alt={listing.cropName}
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-slate-900 shadow-xs">
                      {listing.grade}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-md text-[10px] font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>Shelf Life: {listing.shelfLifeDays}d</span>
                  </div>

                  {listing.eligibleForPooling && (
                    <div className="absolute bottom-2.5 left-2.5 bg-emerald-600/90 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-bold">
                      Transport Pool Eligible (-36% Freight)
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-2.5 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-tight">{listing.cropName}</h3>
                      <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {listing.farmLocation}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Expected Price</span>
                      <span className="font-black text-emerald-700 text-base">
                        ₹{listing.expectedPrice}/{listing.unit}
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Packaging Specs */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Available Volume</span>
                      <span className="font-bold text-slate-800">{listing.quantity} {listing.unit}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Packaging</span>
                      <span className="font-medium text-slate-700 truncate block">{listing.packaging}</span>
                    </div>
                  </div>

                  {/* Harvest Timing & Mandi Benchmark */}
                  <div className="text-[11px] text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Harvested Date:</span>
                      <span className="font-semibold text-slate-800">{listing.harvestDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>APMC Benchmark Modal:</span>
                      <span className="font-bold text-slate-700">₹{listing.benchmarkModalPrice}/{listing.unit}</span>
                    </div>
                  </div>

                  {/* Farmer Credential */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Listed by: <strong>{listing.farmerName}</strong></span>
                    <VerificationBadge status="verified" size="sm" />
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => setSubmittingListing(listing)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Submit Purchase Offer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Offer Submission Modal */}
      {submittingListing && (
        <SubmitOfferModal
          isOpen={!!submittingListing}
          onClose={() => setSubmittingListing(null)}
          listing={submittingListing}
          buyer={currentUser}
          onOfferSubmitted={() => {
            onRefreshData();
            setSubmittingListing(null);
          }}
        />
      )}

    </div>
  );
}
