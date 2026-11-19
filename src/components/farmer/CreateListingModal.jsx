import React, { useState } from 'react';
import { X, Sprout, Plus, Calendar, DollarSign, Package, MapPin, AlertCircle, Info } from 'lucide-react';
import { db } from '../../services/db.js';

export default function CreateListingModal({ isOpen, onClose, farmer, onListingCreated }) {
  if (!isOpen) return null;

  const crops = db.getCrops();
  const [cropId, setCropId] = useState(crops[0]?.id || 'crop_tomato');
  const [grade, setGrade] = useState('Grade A (Table/Retail Premium)');
  const [quantity, setQuantity] = useState(3000);
  const [unit, setUnit] = useState('kg');
  const [expectedPrice, setExpectedPrice] = useState(28);
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableFrom, setAvailableFrom] = useState(new Date().toISOString().split('T')[0]);
  const [availableUntil, setAvailableUntil] = useState(new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]);
  const [shelfLifeDays, setShelfLifeDays] = useState(5);
  const [packaging, setPackaging] = useState('15kg ventilated plastic crates');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const selectedCrop = crops.find(c => c.id === cropId);

  // Sync default shelf life and unit when crop changes
  const handleCropChange = (e) => {
    const selected = crops.find(c => c.id === e.target.value);
    setCropId(e.target.value);
    if (selected) {
      setUnit(selected.unit);
      setShelfLifeDays(selected.shelfLifeDays);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quantity || quantity <= 0) {
      setError('Please provide a valid quantity.');
      return;
    }
    if (!expectedPrice || expectedPrice <= 0) {
      setError('Please provide a valid expected price.');
      return;
    }

    const newListing = db.createListing({
      farmerId: farmer.id,
      farmerName: farmer.name,
      farmName: farmer.farmName || 'Godavari Agri Greens',
      farmLocation: farmer.location?.name || 'Nashik Agri Hub, Maharashtra',
      cropId,
      cropName: selectedCrop?.name || 'Agricultural Produce',
      grade,
      quantity: Number(quantity),
      unit,
      expectedPrice: Number(expectedPrice),
      harvestDate,
      availableFrom,
      availableUntil,
      shelfLifeDays: Number(shelfLifeDays),
      packaging,
      description: description || `Freshly harvested ${selectedCrop?.name}, sorted and graded to ${grade} specifications.`,
      image: selectedCrop?.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      benchmarkModalPrice: Number(expectedPrice) * 0.95,
      coordinates: farmer.location ? { lat: farmer.location.lat, lng: farmer.location.lng } : { lat: 20.1738, lng: 73.9856 }
    });

    onListingCreated(newListing);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h3 className="font-bold text-base">Create New Produce Listing</h3>
              <p className="text-emerald-100 text-xs">List harvest for buyer discovery and automated offer ranking</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-800/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Crop Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Crop Produce *</label>
            <select
              value={cropId}
              onChange={handleCropChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
            >
              {crops.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.category} • Shelf Life ~{c.shelfLifeDays} days)
                </option>
              ))}
            </select>
          </div>

          {/* Grade & Quality */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Quality Grade *</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Grade A (Table/Retail Premium)">Grade A (Table/Retail Premium)</option>
                <option value="Certified Organic Grade A">Certified Organic Grade A</option>
                <option value="Grade B (Standard Wholesale)">Grade B (Standard Wholesale)</option>
                <option value="Grade C (Processing/Canning)">Grade C (Processing/Canning)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Packaging Type</label>
              <input
                type="text"
                value={packaging}
                onChange={(e) => setPackaging(e.target.value)}
                placeholder="e.g. 15kg plastic crates, 50kg gunny bags"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Quantity & Expected Price */}
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Available Quantity *</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-bold focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="quintal">Quintal (100 kg)</option>
                <option value="crate">Crate (15 kg)</option>
                <option value="box">Box (20 kg)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Expected Price (₹/{unit}) *</label>
              <input
                type="number"
                step="0.5"
                min="1"
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-bold focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Harvest Date & Availability Window */}
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Harvest Date</label>
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Available From</label>
              <input
                type="date"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Available Until</label>
              <input
                type="date"
                value={availableUntil}
                onChange={(e) => setAvailableUntil(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Shelf Life & Location Notice */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Produce Shelf Life (Days Remaining)
              </label>
              <input
                type="number"
                min="1"
                value={shelfLifeDays}
                onChange={(e) => setShelfLifeDays(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Algorithm uses shelf life to penalize slow or distant offers that risk spoilage.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Farm Dispatch Location</label>
              <div className="bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 text-xs flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{farmer.location?.name || 'Nashik Agri Hub'}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Pre-linked from your verified farmer profile.
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Produce Description & Special Notes</label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Uniform red ripeness, harvested with drip irrigation, sorted into 15kg crates, ready for immediate loading."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Submit Action */}
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
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Publish Produce Listing
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
