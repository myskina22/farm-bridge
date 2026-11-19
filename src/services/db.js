// FarmBridge Central Data Store & Entity Management Service
// Full persistence layer managing:
// users, farms, crops, produce_listings, buyer_offers, negotiations, 
// orders, transport_requests, deliveries, price_observations, transport_pools

import {
  initialCrops,
  initialUsers,
  initialFarms,
  initialProduceListings,
  initialBuyerOffers,
  initialOrders,
  initialTransportPools,
  initialPriceObservations,
  safetyAndLimitationsNotice
} from '../data/initialData.js';

const STORAGE_KEYS = {
  USERS: 'farmbridge_users',
  FARMS: 'farmbridge_farms',
  CROPS: 'farmbridge_crops',
  LISTINGS: 'farmbridge_produce_listings',
  OFFERS: 'farmbridge_buyer_offers',
  ORDERS: 'farmbridge_orders',
  TRANSPORT_POOLS: 'farmbridge_transport_pools',
  PRICE_OBSERVATIONS: 'farmbridge_price_observations',
  ACTIVE_USER_ID: 'farmbridge_active_user_id'
};

class FarmBridgeDB {
  constructor() {
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FARMS)) {
      localStorage.setItem(STORAGE_KEYS.FARMS, JSON.stringify(initialFarms));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CROPS)) {
      localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(initialCrops));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LISTINGS)) {
      localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(initialProduceListings));
    }
    if (!localStorage.getItem(STORAGE_KEYS.OFFERS)) {
      localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(initialBuyerOffers));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSPORT_POOLS)) {
      localStorage.setItem(STORAGE_KEYS.TRANSPORT_POOLS, JSON.stringify(initialTransportPools));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRICE_OBSERVATIONS)) {
      localStorage.setItem(STORAGE_KEYS.PRICE_OBSERVATIONS, JSON.stringify(initialPriceObservations));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, 'usr_farmer_1'); // Default to Ramesh Patel (Farmer)
    }
  }

  resetToDefault() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    localStorage.setItem(STORAGE_KEYS.FARMS, JSON.stringify(initialFarms));
    localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(initialCrops));
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(initialProduceListings));
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(initialBuyerOffers));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders));
    localStorage.setItem(STORAGE_KEYS.TRANSPORT_POOLS, JSON.stringify(initialTransportPools));
    localStorage.setItem(STORAGE_KEYS.PRICE_OBSERVATIONS, JSON.stringify(initialPriceObservations));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, 'usr_farmer_1');
  }

  // --- Active Session & Users ---
  getActiveUserId() {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID) || 'usr_farmer_1';
  }

  setActiveUserId(id) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, id);
  }

  getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  }

  getUser(id) {
    const users = this.getUsers();
    return users.find(u => u.id === id) || users[0];
  }

  updateUserVerification(userId, status, notes = '') {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx].verificationStatus = status;
      if (notes) users[idx].verificationDoc = notes;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      return users[idx];
    }
    return null;
  }

  // --- Crops & Farms ---
  getCrops() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CROPS) || '[]');
  }

  getFarms() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FARMS) || '[]');
  }

  getFarmByUserId(userId) {
    const farms = this.getFarms();
    return farms.find(f => f.userId === userId);
  }

  // --- Produce Listings ---
  getListings(filters = {}) {
    let listings = JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTINGS) || '[]');

    if (filters.cropId && filters.cropId !== 'all') {
      listings = listings.filter(l => l.cropId === filters.cropId);
    }
    if (filters.farmerId) {
      listings = listings.filter(l => l.farmerId === filters.farmerId);
    }
    if (filters.status && filters.status !== 'all') {
      listings = listings.filter(l => l.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      listings = listings.filter(l => 
        l.cropName.toLowerCase().includes(q) ||
        l.farmLocation.toLowerCase().includes(q) ||
        l.grade.toLowerCase().includes(q)
      );
    }
    if (filters.minQty) {
      listings = listings.filter(l => l.quantity >= Number(filters.minQty));
    }
    if (filters.maxPrice) {
      listings = listings.filter(l => l.expectedPrice <= Number(filters.maxPrice));
    }

    return listings;
  }

  getListingById(id) {
    const listings = this.getListings();
    return listings.find(l => l.id === id);
  }

  createListing(listingData) {
    const listings = this.getListings();
    const newId = `list_${Date.now()}`;
    const newListing = {
      id: newId,
      status: 'active',
      createdAt: new Date().toISOString(),
      eligibleForPooling: true,
      ...listingData
    };
    listings.unshift(newListing);
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
    return newListing;
  }

  updateListing(id, updates) {
    const listings = this.getListings();
    const idx = listings.findIndex(l => l.id === id);
    if (idx !== -1) {
      listings[idx] = { ...listings[idx], ...updates };
      localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
      return listings[idx];
    }
    return null;
  }

  // --- Buyer Offers & Negotiations ---
  getOffers(listingId = null) {
    let offers = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFERS) || '[]');
    if (listingId) {
      offers = offers.filter(o => o.listingId === listingId);
    }
    return offers;
  }

  getOfferById(offerId) {
    const offers = this.getOffers();
    return offers.find(o => o.id === offerId);
  }

  getOffersForFarmer(farmerId) {
    const listings = this.getListings({ farmerId });
    const listingIds = new Set(listings.map(l => l.id));
    const allOffers = this.getOffers();
    return allOffers.filter(o => listingIds.has(o.listingId));
  }

  getOffersByBuyer(buyerId) {
    const allOffers = this.getOffers();
    return allOffers.filter(o => o.buyerId === buyerId);
  }

  createOffer(offerData) {
    const offers = this.getOffers();
    const newId = `off_${Date.now()}`;
    const newOffer = {
      id: newId,
      status: 'active',
      createdAt: new Date().toISOString(),
      history: [
        {
          sender: offerData.buyerName,
          role: 'buyer',
          type: 'initial_offer',
          price: offerData.offeredPrice,
          quantity: offerData.quantity,
          timestamp: new Date().toISOString(),
          message: offerData.notes || 'Submitted initial purchase offer.'
        }
      ],
      ...offerData
    };
    offers.unshift(newOffer);
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));

    // Update listing status if needed
    const listing = this.getListingById(offerData.listingId);
    if (listing && listing.status === 'active') {
      this.updateListing(listing.id, { status: 'under_negotiation' });
    }

    return newOffer;
  }

  addCounterOffer({ offerId, senderName, role, counterPrice, counterQuantity, message }) {
    const offers = this.getOffers();
    const idx = offers.findIndex(o => o.id === offerId);
    if (idx === -1) return null;

    const offer = offers[idx];
    offer.offeredPrice = Number(counterPrice);
    if (counterQuantity) offer.quantity = Number(counterQuantity);
    offer.status = 'countered';

    if (!offer.history) offer.history = [];
    offer.history.push({
      sender: senderName,
      role: role,
      type: 'counter_offer',
      price: Number(counterPrice),
      quantity: offer.quantity,
      timestamp: new Date().toISOString(),
      message: message || `Counter-offer proposed at ₹${counterPrice}/unit.`
    });

    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
    return offer;
  }

  acceptOffer(offerId, senderName, role) {
    const offers = this.getOffers();
    const idx = offers.findIndex(o => o.id === offerId);
    if (idx === -1) return null;

    const offer = offers[idx];
    offer.status = 'accepted';
    offer.history.push({
      sender: senderName,
      role: role,
      type: 'accepted',
      price: offer.offeredPrice,
      quantity: offer.quantity,
      timestamp: new Date().toISOString(),
      message: `Offer officially accepted by ${senderName}. Proceeding to Order generation.`
    });

    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));

    // Convert to Order automatically
    const listing = this.getListingById(offer.listingId);
    const order = this.convertOfferToOrder(offer, listing);

    return { offer, order };
  }

  rejectOffer(offerId, senderName, role, reason = '') {
    const offers = this.getOffers();
    const idx = offers.findIndex(o => o.id === offerId);
    if (idx === -1) return null;

    const offer = offers[idx];
    offer.status = 'rejected';
    offer.history.push({
      sender: senderName,
      role: role,
      type: 'rejected',
      price: offer.offeredPrice,
      quantity: offer.quantity,
      timestamp: new Date().toISOString(),
      message: reason || 'Offer declined.'
    });

    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
    return offer;
  }

  // --- Orders & Delivery Tracking ---
  getOrders(userId = null) {
    let orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    if (userId) {
      orders = orders.filter(o => o.farmerId === userId || o.buyerId === userId || o.transporterId === userId);
    }
    return orders;
  }

  getOrderById(id) {
    const orders = this.getOrders();
    return orders.find(o => o.id === id);
  }

  convertOfferToOrder(offer, listing) {
    const orders = this.getOrders();
    const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const grossAmount = Math.round(offer.offeredPrice * offer.quantity);
    const transportCost = offer.transportMode === 'pooled_transport' ? 6200 : 9500;
    const platformFee = Math.round(grossAmount * 0.01);
    const netFarmerPayout = grossAmount - transportCost - platformFee;

    const newOrder = {
      id: `ord_${Date.now()}`,
      orderNumber,
      listingId: offer.listingId,
      offerId: offer.id,
      cropName: listing ? listing.cropName : 'Agricultural Produce',
      grade: listing ? listing.grade : 'Grade A',
      farmerId: listing ? listing.farmerId : 'usr_farmer_1',
      farmerName: listing ? listing.farmerName : 'Farmer',
      buyerId: offer.buyerId,
      buyerName: offer.buyerName,
      transporterId: 'usr_transporter_1',
      transporterName: 'Kisan Logistics & Reefer Express',
      quantity: offer.quantity,
      unit: offer.unit || 'kg',
      unitPrice: offer.offeredPrice,
      grossAmount,
      transportCost,
      platformFee,
      netFarmerPayout,
      status: 'transport_assigned',
      orderDate: new Date().toISOString(),
      dispatchDate: new Date(Date.now() + 86400000).toISOString(),
      estimatedDeliveryDate: new Date(Date.now() + 172800000).toISOString(),
      deliveryAddress: 'Buyer Terminal Logistics Gate',
      pickupAddress: listing ? listing.farmLocation : 'Farm Gate',
      tracking: {
        trackingNumber: `TRK-MH-${Math.floor(10000 + Math.random() * 90000)}`,
        vehicleNumber: 'MH-15-EG-8492',
        vehicleType: '10-Ton Refrigerated Carrier',
        driverName: 'Sanjay Shinde',
        driverPhone: '+91 98221 44091',
        currentLocation: 'Assigned to Fleet Corridor',
        milestones: [
          { status: 'Offer Accepted & Order Placed', time: new Date().toLocaleString(), done: true },
          { status: 'Transport Assigned to Carrier Fleet', time: new Date().toLocaleString(), done: true },
          { status: 'Produce Packaged & Inspected at Farm', time: 'Scheduled', done: false },
          { status: 'Dispatched & In-Transit', time: 'Pending', done: false },
          { status: 'Delivered at Buyer Gate', time: 'Pending', done: false },
          { status: 'QC Passed & Final Settlement Disbursed', time: 'Pending', done: false }
        ]
      }
    };

    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    if (listing) {
      this.updateListing(listing.id, { status: 'ordered' });
    }

    return newOrder;
  }

  updateOrderStatus(orderId, newStatus, trackingUpdate = '') {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return null;

    const order = orders[idx];
    order.status = newStatus;

    if (trackingUpdate && order.tracking) {
      order.tracking.currentLocation = trackingUpdate;
    }

    // Update milestone
    if (order.tracking && order.tracking.milestones) {
      const milestoneMap = {
        'transport_assigned': 1,
        'packaged': 2,
        'in_transit': 3,
        'delivered': 4,
        'completed': 5
      };
      const activeIdx = milestoneMap[newStatus];
      if (activeIdx !== undefined) {
        for (let i = 0; i <= activeIdx; i++) {
          if (order.tracking.milestones[i]) {
            order.tracking.milestones[i].done = true;
          }
        }
      }
    }

    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return order;
  }

  // --- Transport Pooling ---
  getTransportPools() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSPORT_POOLS) || '[]');
  }

  joinTransportPool(poolId, { farmerName, farmLocation, crop, quantityKg, individualFreight }) {
    const pools = this.getTransportPools();
    const idx = pools.findIndex(p => p.id === poolId);
    if (idx === -1) return null;

    const pool = pools[idx];
    if (pool.currentBookedKg + quantityKg > pool.maxCapacityKg) {
      throw new Error(`Insufficient capacity in pool. Available: ${pool.availableCapacityKg} kg.`);
    }

    const pooledFreight = Math.round(individualFreight * (1 - (pool.estimatedSavingsPercent / 100)));
    const savings = individualFreight - pooledFreight;

    pool.participants.push({
      farmerName,
      farmLocation,
      crop,
      quantityKg,
      individualFreight,
      pooledFreight,
      savings
    });

    pool.currentBookedKg += quantityKg;
    pool.availableCapacityKg = pool.maxCapacityKg - pool.currentBookedKg;
    if (pool.availableCapacityKg <= 0) {
      pool.status = 'full';
    }

    localStorage.setItem(STORAGE_KEYS.TRANSPORT_POOLS, JSON.stringify(pools));
    return pool;
  }

  createTransportPool(poolData) {
    const pools = this.getTransportPools();
    const newPool = {
      id: `pool_${Date.now()}`,
      participants: [],
      currentBookedKg: 0,
      availableCapacityKg: poolData.maxCapacityKg,
      status: 'open_for_joining',
      estimatedSavingsPercent: 35,
      ...poolData
    };
    pools.unshift(newPool);
    localStorage.setItem(STORAGE_KEYS.TRANSPORT_POOLS, JSON.stringify(pools));
    return newPool;
  }

  // --- Market Price Observations (Agmarknet / APMC) ---
  getPriceObservations() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRICE_OBSERVATIONS) || '[]');
  }

  addPriceObservation(obsData) {
    const observations = this.getPriceObservations();
    const newObs = {
      id: `obs_${Date.now()}`,
      observationDate: new Date().toISOString().split('T')[0],
      trend: 'stable',
      trendPercent: 0,
      ...obsData
    };
    observations.unshift(newObs);
    localStorage.setItem(STORAGE_KEYS.PRICE_OBSERVATIONS, JSON.stringify(observations));
    return newObs;
  }
}

export const db = new FarmBridgeDB();
export { safetyAndLimitationsNotice };
