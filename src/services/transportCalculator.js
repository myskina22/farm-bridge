// FarmBridge Transport & Net Return Estimation Engine
// Accurately models freight costs based on distance, cargo weight, perishability,
// refrigeration requirements, and grouped/pooled transport discounts.

export const VEHICLE_TIERS = {
  PICKUP_1_5T: {
    id: 'PICKUP_1_5T',
    name: 'Small Pickup (Bolero / Tata Ace)',
    maxCapacityKg: 1500,
    baseFare: 800,
    perKmRate: 14.0, // INR per km
    handlingFee: 300,
    reeferSupported: false
  },
  CANTER_4T: {
    id: 'CANTER_4T',
    name: 'Medium Canter (Tata 407 / Eicher 4T)',
    maxCapacityKg: 4000,
    baseFare: 1600,
    perKmRate: 24.0,
    handlingFee: 600,
    reeferSupported: true
  },
  HEAVY_10T: {
    id: 'HEAVY_10T',
    name: 'Heavy Commercial (10-Ton Multi-Axle)',
    maxCapacityKg: 10000,
    baseFare: 3200,
    perKmRate: 42.0,
    handlingFee: 1200,
    reeferSupported: true
  },
  REEFER_10T: {
    id: 'REEFER_10T',
    name: 'Refrigerated Cold-Chain Carrier (10-Ton)',
    maxCapacityKg: 10000,
    baseFare: 4800,
    perKmRate: 54.0,
    handlingFee: 1500,
    reeferSupported: true
  }
};

/**
 * Calculates estimated transport cost and net farmer return
 * @param {Object} params
 * @param {number} params.distanceKm - Distance between farm and delivery destination
 * @param {number} params.quantity - Quantity of produce
 * @param {string} params.unit - 'kg', 'quintal', 'crate', 'box'
 * @param {number} params.offeredPrice - Price offered per unit
 * @param {boolean} params.isPerishable - Whether crop needs cold/fast transit
 * @param {string} params.transportMode - 'pooled_transport' | 'platform_organized' | 'farmer_arranged' | 'buyer_arranged'
 * @param {number} params.customSavingsPercent - Optional pooling discount override
 */
export function calculateNetReturn({
  distanceKm = 100,
  quantity = 1000,
  unit = 'kg',
  offeredPrice = 25,
  isPerishable = false,
  transportMode = 'platform_organized',
  customSavingsPercent = null
}) {
  // Convert quantity to weight in Kilograms
  let weightKg = quantity;
  if (unit === 'quintal') {
    weightKg = quantity * 100;
  } else if (unit === 'crate') {
    weightKg = quantity * 15; // standard 15kg fruit crate
  } else if (unit === 'box') {
    weightKg = quantity * 20; // standard 20kg apple box
  }

  // Determine optimal vehicle type
  let vehicle;
  if (isPerishable && distanceKm > 100) {
    vehicle = VEHICLE_TIERS.REEFER_10T;
  } else if (weightKg <= 1500) {
    vehicle = VEHICLE_TIERS.PICKUP_1_5T;
  } else if (weightKg <= 4000) {
    vehicle = VEHICLE_TIERS.CANTER_4T;
  } else {
    vehicle = VEHICLE_TIERS.HEAVY_10T;
  }

  // Base Freight calculation
  let transportCost = 0;
  let poolingSavings = 0;
  let buyerCoversTransport = false;

  if (transportMode === 'buyer_arranged') {
    // Buyer takes full delivery/pickup responsibility at farm gate
    buyerCoversTransport = true;
    transportCost = 0;
  } else {
    // Formula: Base fare + (Distance * perKmRate * loadRatioFactor) + handling
    const loadCapacity = vehicle.maxCapacityKg;
    const loadRatio = Math.min(1.2, Math.max(0.4, weightKg / loadCapacity));
    
    const distanceCost = distanceKm * vehicle.perKmRate * loadRatio;
    const handling = vehicle.handlingFee;
    const base = vehicle.baseFare;

    let rawCost = base + distanceCost + handling;

    // Apply Pooled Transport discount if grouped with nearby farmers
    if (transportMode === 'pooled_transport') {
      const discount = customSavingsPercent ? customSavingsPercent / 100 : 0.38; // 38% average savings
      poolingSavings = Math.round(rawCost * discount);
      transportCost = Math.round(rawCost - poolingSavings);
    } else {
      transportCost = Math.round(rawCost);
    }
  }

  // Financial Breakdown
  const grossRevenue = Math.round(offeredPrice * quantity);
  const platformFee = Math.round(grossRevenue * 0.01); // Transparent 1% platform facilitation fee
  const netFarmerReturn = Math.max(0, grossRevenue - transportCost - platformFee);
  const netReturnPerUnit = Number((netFarmerReturn / (quantity || 1)).toFixed(2));
  const transportCostPerUnit = Number((transportCost / (quantity || 1)).toFixed(2));
  const grossReturnPerUnit = offeredPrice;

  return {
    weightKg,
    distanceKm,
    vehicleType: vehicle.name,
    grossRevenue,
    transportCost,
    poolingSavings,
    buyerCoversTransport,
    platformFee,
    netFarmerReturn,
    netReturnPerUnit,
    transportCostPerUnit,
    grossReturnPerUnit,
    unit
  };
}
