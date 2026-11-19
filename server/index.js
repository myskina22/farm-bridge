// FarmBridge Backend Express Server
// Serves RESTful API conforming to the suggested PostgreSQL schema:
// users, farms, produce_listings, crops, buyer_offers, negotiations, orders,
// transport_requests, deliveries, and price_observations.

import express from 'express';
import cors from 'cors';
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
} from '../src/data/initialData.js';
import { rankOffersForListing, scoreBuyerOffer } from '../src/services/recommendationEngine.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory state for the API server initialized from seed
let users = [...initialUsers];
let farms = [...initialFarms];
let crops = [...initialCrops];
let listings = [...initialProduceListings];
let offers = [...initialBuyerOffers];
let orders = [...initialOrders];
let pools = [...initialTransportPools];
let prices = [...initialPriceObservations];

// --- Health ---
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'FarmBridge - Team 3',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// --- Users & Verification ---
app.get('/api/users', (req, res) => {
  const { role } = req.query;
  if (role) return res.json(users.filter(u => u.role === role));
  res.json(users);
});

app.patch('/api/users/:id/verification', (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.verificationStatus = status;
  if (notes) user.verificationDoc = notes;
  res.json(user);
});

// --- Crops & Farms ---
app.get('/api/crops', (req, res) => res.json(crops));
app.get('/api/farms', (req, res) => res.json(farms));

// --- Produce Listings ---
app.get('/api/listings', (req, res) => {
  const { cropId, farmerId, search } = req.query;
  let result = [...listings];
  if (cropId && cropId !== 'all') result = result.filter(l => l.cropId === cropId);
  if (farmerId) result = result.filter(l => l.farmerId === farmerId);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(l => 
      l.cropName.toLowerCase().includes(q) || 
      l.farmLocation.toLowerCase().includes(q)
    );
  }
  res.json(result);
});

app.post('/api/listings', (req, res) => {
  const newListing = {
    id: `list_${Date.now()}`,
    status: 'active',
    createdAt: new Date().toISOString(),
    eligibleForPooling: true,
    ...req.body
  };
  listings.unshift(newListing);
  res.status(201).json(newListing);
});

app.get('/api/listings/:id', (req, res) => {
  const item = listings.find(l => l.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Listing not found' });
  res.json(item);
});

// --- Buyer Offers & Negotiations ---
app.get('/api/offers', (req, res) => {
  const { listingId, buyerId } = req.query;
  let result = [...offers];
  if (listingId) result = result.filter(o => o.listingId === listingId);
  if (buyerId) result = result.filter(o => o.buyerId === buyerId);
  res.json(result);
});

app.post('/api/offers', (req, res) => {
  const newOffer = {
    id: `off_${Date.now()}`,
    status: 'active',
    createdAt: new Date().toISOString(),
    history: [
      {
        sender: req.body.buyerName,
        role: 'buyer',
        type: 'initial_offer',
        price: req.body.offeredPrice,
        quantity: req.body.quantity,
        timestamp: new Date().toISOString(),
        message: req.body.notes || 'Submitted initial purchase offer.'
      }
    ],
    ...req.body
  };
  offers.unshift(newOffer);
  res.status(201).json(newOffer);
});

app.post('/api/offers/:id/counter', (req, res) => {
  const offer = offers.find(o => o.id === req.params.id);
  if (!offer) return res.status(404).json({ error: 'Offer not found' });
  
  const { senderName, role, counterPrice, counterQuantity, message } = req.body;
  offer.offeredPrice = Number(counterPrice);
  if (counterQuantity) offer.quantity = Number(counterQuantity);
  offer.status = 'countered';

  offer.history.push({
    sender: senderName,
    role,
    type: 'counter_offer',
    price: Number(counterPrice),
    quantity: offer.quantity,
    timestamp: new Date().toISOString(),
    message: message || `Counter-offer at ₹${counterPrice}/unit.`
  });

  res.json(offer);
});

app.post('/api/offers/:id/accept', (req, res) => {
  const offer = offers.find(o => o.id === req.params.id);
  if (!offer) return res.status(404).json({ error: 'Offer not found' });

  offer.status = 'accepted';
  const listing = listings.find(l => l.id === offer.listingId);
  if (listing) listing.status = 'ordered';

  const newOrder = {
    id: `ord_${Date.now()}`,
    orderNumber: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    listingId: offer.listingId,
    offerId: offer.id,
    cropName: listing ? listing.cropName : 'Agricultural Produce',
    farmerId: listing ? listing.farmerId : 'usr_farmer_1',
    farmerName: listing ? listing.farmerName : 'Farmer',
    buyerId: offer.buyerId,
    buyerName: offer.buyerName,
    unitPrice: offer.offeredPrice,
    quantity: offer.quantity,
    grossAmount: Math.round(offer.offeredPrice * offer.quantity),
    status: 'transport_assigned',
    orderDate: new Date().toISOString()
  };
  orders.unshift(newOrder);

  res.json({ offer, order: newOrder });
});

// --- Advanced Recommendation Engine ---
app.get('/api/recommendations/:listingId', (req, res) => {
  const listing = listings.find(l => l.id === req.params.listingId);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });

  const listingOffers = offers.filter(o => o.listingId === listing.id);
  const evaluation = rankOffersForListing(listingOffers, listing);
  res.json(evaluation);
});

// --- Validation Benchmark Lab Endpoint ---
app.get('/api/benchmark/:listingId', (req, res) => {
  const listing = listings.find(l => l.id === req.params.listingId);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });

  const listingOffers = offers.filter(o => o.listingId === listing.id);
  const { benchmark, topRecommended, highestPriceOffer } = rankOffersForListing(listingOffers, listing);
  res.json({ listing, benchmark, topRecommended, highestPriceOffer });
});

// --- Orders & Tracking ---
app.get('/api/orders', (req, res) => res.json(orders));
app.patch('/api/orders/:id/status', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.status = req.body.status;
  res.json(order);
});

// --- Transport Pools ---
app.get('/api/transport/pools', (req, res) => res.json(pools));

// --- Price Intelligence (Agmarknet / APMC) ---
app.get('/api/prices', (req, res) => res.json(prices));
app.get('/api/disclaimers', (req, res) => res.json(safetyAndLimitationsNotice));

app.listen(PORT, () => {
  console.log(`[FarmBridge API] Running on port ${PORT}`);
});
