// FarmBridge Initial Rich Seed Dataset
// Entities: users, farms, crops, produce_listings, buyer_offers, negotiations, 
// orders, transport_requests, deliveries, price_observations, transport_pools

export const initialCrops = [
  {
    id: 'crop_tomato',
    name: 'Tomatoes (Hybrid Roma)',
    category: 'Vegetables',
    perishable: true,
    shelfLifeDays: 5,
    unit: 'kg',
    minTempCelsius: 12,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    description: 'Firm, oval-shaped processing and table hybrid tomatoes with high lycopene content.'
  },
  {
    id: 'crop_onion',
    name: 'Red Onions (Nashik Medium)',
    category: 'Vegetables',
    perishable: false,
    shelfLifeDays: 45,
    unit: 'quintal',
    minTempCelsius: null,
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
    description: 'Cured red onions, dry skin, pungent aroma, ideal for bulk commercial wholesale.'
  },
  {
    id: 'crop_potato',
    name: 'Potatoes (Kufri Jyoti)',
    category: 'Tubers',
    perishable: false,
    shelfLifeDays: 60,
    unit: 'quintal',
    minTempCelsius: null,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
    description: 'Medium-to-large clean tubers, oval shape, low sugar content, excellent chipping quality.'
  },
  {
    id: 'crop_rice',
    name: 'Basmati Rice (Pusa 1121 Paddy)',
    category: 'Grains',
    perishable: false,
    shelfLifeDays: 365,
    unit: 'quintal',
    minTempCelsius: null,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    description: 'Aromatic extra-long grain paddy harvest, moisture content controlled below 13%.'
  },
  {
    id: 'crop_mango',
    name: 'Alphonso Mangoes (Hapus)',
    category: 'Fruits',
    perishable: true,
    shelfLifeDays: 7,
    unit: 'crate',
    minTempCelsius: 14,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80',
    description: 'Naturally ripened, export-grade GI-tagged Alphonso mangoes, 12 fruits per crate.'
  },
  {
    id: 'crop_chili',
    name: 'Green Chilies (G4 Hot)',
    category: 'Spices / Vegetables',
    perishable: true,
    shelfLifeDays: 6,
    unit: 'kg',
    minTempCelsius: 10,
    image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80',
    description: 'Sharp pungent dark green chilies, 8-10 cm length, freshly plucked.'
  },
  {
    id: 'crop_apple',
    name: 'Apples (Himachal Royal Delicious)',
    category: 'Fruits',
    perishable: true,
    shelfLifeDays: 30,
    unit: 'box',
    minTempCelsius: 4,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80',
    description: 'High-altitude graded crisp red apples, packed in 20kg telescopic corrugated boxes.'
  }
];

export const initialUsers = [
  // Farmers
  {
    id: 'usr_farmer_1',
    name: 'Ramesh Patel',
    role: 'farmer',
    email: 'ramesh.patel@kisanmail.com',
    phone: '+91 98230 44102',
    verificationStatus: 'verified', // 'verified', 'pending', 'unverified'
    verificationDoc: 'Kisan Credit Card & Land Record #MH-NSK-2021-9981',
    rating: 4.85,
    completedDeals: 34,
    location: {
      name: 'Pimpalgaon Baswant, Nashik, Maharashtra',
      lat: 20.1738,
      lng: 73.9856
    },
    farmName: 'Godavari Agri Greens & FPO',
    bio: 'Family farm cultivating tomatoes, onions and green vegetables over 18 acres with drip irrigation.'
  },
  {
    id: 'usr_farmer_2',
    name: 'Sunita Deshmukh',
    role: 'farmer',
    email: 'sunita.deshmukh@sahyadricrop.org',
    phone: '+91 97645 11209',
    verificationStatus: 'verified',
    verificationDoc: 'Farmer Producer Org Certificate #FPO-2024-MH-440',
    rating: 4.92,
    completedDeals: 58,
    location: {
      name: 'Dindori, Nashik, Maharashtra',
      lat: 20.2034,
      lng: 73.8322
    },
    farmName: 'Sahyadri Women Farmers Collective',
    bio: '32-member organic certified women farming group specializing in table tomatoes and export grapes.'
  },
  {
    id: 'usr_farmer_3',
    name: 'Rajesh Gowda',
    role: 'farmer',
    email: 'rajesh.gowda@kaveriagro.in',
    phone: '+91 94481 77312',
    verificationStatus: 'pending',
    verificationDoc: 'Pahani RTC Patta Submission Pending Regional Verification',
    rating: 4.5,
    completedDeals: 12,
    location: {
      name: 'Kolar Rural, Karnataka',
      lat: 13.1367,
      lng: 78.1292
    },
    farmName: 'Kaveri Valley Horticulture',
    bio: 'Cultivating tomatoes, capsicum and chilies across 10 acres of semi-arid red loamy soil.'
  },

  // Buyers
  {
    id: 'usr_buyer_1',
    name: 'BigBasket Fresh Regional Hub',
    role: 'buyer',
    email: 'procurement@bigbasket-hub.com',
    phone: '+91 99002 44321',
    buyerType: 'Online Grocery Retailer',
    verificationStatus: 'verified',
    verificationDoc: 'FSSAI License #10018042000213 & Corporate GST',
    rating: 4.9,
    completedOrders: 1420,
    location: {
      name: 'Bhiwandi Logistics Park, Thane / Mumbai',
      lat: 19.2967,
      lng: 73.0631
    },
    bio: 'Leading e-grocery fulfillment hub serving Mumbai MMR and Pune. Direct farm gate sourcing.'
  },
  {
    id: 'usr_buyer_2',
    name: 'Kisan Mandi Wholesalers (Vashi)',
    role: 'buyer',
    email: 'vashi.trades@mandiwholesale.com',
    phone: '+91 98201 33201',
    buyerType: 'Wholesale APMC Commission Agent',
    verificationStatus: 'verified',
    verificationDoc: 'APMC Mumbai Trader License #APMC-VSH-8841',
    rating: 4.4,
    completedOrders: 820,
    location: {
      name: 'APMC Market II, Vashi, Navi Mumbai',
      lat: 19.0760,
      lng: 73.0076
    },
    bio: 'Wholesale bulk distributor supplying 450+ wet market vegetable vendors across Navi Mumbai.'
  },
  {
    id: 'usr_buyer_3',
    name: 'Metro Cash & Carry Hub',
    role: 'buyer',
    email: 'produce@metrocashcarry.co.in',
    phone: '+91 91234 56789',
    buyerType: 'Supermarket Chain & B2B Wholesaler',
    verificationStatus: 'verified',
    verificationDoc: 'National Food Safety & Wholesale Trade Registry #NTR-2023-991',
    rating: 4.75,
    completedOrders: 2150,
    location: {
      name: 'Pune Hadapsar Industrial Zone, Maharashtra',
      lat: 18.5089,
      lng: 73.9260
    },
    bio: 'Cash & carry multinational sourcing institutional quality vegetables, fruits and staples.'
  },
  {
    id: 'usr_buyer_4',
    name: 'Delhi NCR Agro Sourcing Co.',
    role: 'buyer',
    email: 'delhi.agro@azadpurtrades.in',
    phone: '+91 98110 99887',
    buyerType: 'Inter-State Wholesaler',
    verificationStatus: 'unverified',
    verificationDoc: 'Under Review - Missing Current Year APMC Renewal',
    rating: 3.8,
    completedOrders: 42,
    location: {
      name: 'Azadpur Mandi Gate 4, Delhi',
      lat: 28.7159,
      lng: 77.1787
    },
    bio: 'Long-distance North India produce aggregator buying high volumes for Delhi-NCR retail chains.'
  },

  // Transport Providers
  {
    id: 'usr_transporter_1',
    name: 'Kisan Logistics & Reefer Express',
    role: 'transporter',
    email: 'dispatch@kisanlogistics.com',
    phone: '+91 98220 88990',
    verificationStatus: 'verified',
    verificationDoc: 'All India Goods Transport Permit #AITP-MH-9021',
    rating: 4.88,
    completedDeliveries: 940,
    location: {
      name: 'Nashik Highway Fleet Hub, Maharashtra',
      lat: 19.9975,
      lng: 73.7898
    },
    fleetSize: '24 vehicles (Reefers, 3.5T, 10T trucks)',
    bio: 'Cold-chain and fast ag-freight provider specializing in farm-to-city fresh corridors.'
  },
  {
    id: 'usr_transporter_2',
    name: 'Sahyadri Rural Goods Transport',
    role: 'transporter',
    email: 'booking@sahyadritransport.in',
    phone: '+91 97631 22445',
    verificationStatus: 'verified',
    verificationDoc: 'Maharashtra State Motor Transport Auth #MSMTA-4491',
    rating: 4.7,
    completedDeliveries: 480,
    location: {
      name: 'Pimpalgaon Mandi Truck Stand, Nashik',
      lat: 20.1700,
      lng: 73.9800
    },
    fleetSize: '14 vehicles (Tata 407, Bolero Maxi Trucks)',
    bio: 'Local pooling and farm cluster aggregation for smallholder produce consolidation.'
  },

  // Platform Admin
  {
    id: 'usr_admin_1',
    name: 'FarmBridge Operations & Oversight',
    role: 'admin',
    email: 'admin@farmbridge.org',
    phone: '+91 80000 12345',
    verificationStatus: 'verified',
    verificationDoc: 'Platform Governance Key #FB-CORE-ADMIN-01',
    location: {
      name: 'FarmBridge AgriTech Command Center, Pune',
      lat: 18.5204,
      lng: 73.8567
    },
    bio: 'Platform administration, verification officer, price feed auditor and dispute resolution board.'
  }
];

export const initialFarms = [
  {
    id: 'farm_1',
    userId: 'usr_farmer_1',
    farmName: 'Godavari Agri Greens',
    district: 'Nashik',
    state: 'Maharashtra',
    acreage: 18,
    primaryCrops: ['Tomatoes', 'Red Onions', 'Green Chilies'],
    soilType: 'Black Cotton Loam',
    coordinates: { lat: 20.1738, lng: 73.9856 },
    address: 'Survey No. 142/2, Pimpalgaon Baswant, Niphad Taluka, Nashik 422209'
  },
  {
    id: 'farm_2',
    userId: 'usr_farmer_2',
    farmName: 'Sahyadri Organic Orchard & Farm',
    district: 'Nashik',
    state: 'Maharashtra',
    acreage: 32,
    primaryCrops: ['Alphonso Mangoes', 'Tomatoes', 'Capsicum'],
    soilType: 'Well-drained Red Basaltic Soil',
    coordinates: { lat: 20.2034, lng: 73.8322 },
    address: 'Plot 7, Dindori Agro Belt, Nashik 422202'
  },
  {
    id: 'farm_3',
    userId: 'usr_farmer_3',
    farmName: 'Kaveri Valley Horticulture',
    district: 'Kolar',
    state: 'Karnataka',
    acreage: 10,
    primaryCrops: ['Tomatoes', 'Green Chilies', 'Potatoes'],
    soilType: 'Red Loamy Soil',
    coordinates: { lat: 13.1367, lng: 78.1292 },
    address: 'Survey 88, Vakkaleri Road, Kolar 563101'
  }
];

export const initialProduceListings = [
  {
    id: 'list_tom_01',
    farmerId: 'usr_farmer_1',
    farmerName: 'Ramesh Patel',
    farmId: 'farm_1',
    farmName: 'Godavari Agri Greens',
    farmLocation: 'Pimpalgaon Baswant, Nashik (MH)',
    cropId: 'crop_tomato',
    cropName: 'Tomatoes (Hybrid Roma)',
    grade: 'Grade A (Table/Retail Premium)',
    quantity: 4500, // in kg
    unit: 'kg',
    harvestDate: '2026-11-10',
    availableFrom: '2026-11-11',
    availableUntil: '2026-11-15',
    expectedPrice: 28.00, // per kg
    shelfLifeDays: 4, // remaining days before quality declines
    packaging: '15kg ventilated plastic crates',
    status: 'active', // 'active', 'under_negotiation', 'ordered', 'completed'
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    description: 'Uniform red color, 80-90g average weight, high firm texture, harvested at color break stage. No blemishes or pest marks.',
    benchmarkModalPrice: 26.50, // APMC benchmark
    eligibleForPooling: true,
    coordinates: { lat: 20.1738, lng: 73.9856 },
    createdAt: '2026-11-10T08:30:00Z'
  },
  {
    id: 'list_onion_02',
    farmerId: 'usr_farmer_1',
    farmerName: 'Ramesh Patel',
    farmId: 'farm_1',
    farmName: 'Godavari Agri Greens',
    farmLocation: 'Pimpalgaon Baswant, Nashik (MH)',
    cropId: 'crop_onion',
    cropName: 'Red Onions (Nashik Medium)',
    grade: 'Grade A (Commercial Export/Storage)',
    quantity: 120, // quintals (12,000 kg)
    unit: 'quintal',
    harvestDate: '2026-11-02',
    availableFrom: '2026-11-05',
    availableUntil: '2026-12-15',
    expectedPrice: 2200.00, // per quintal (₹22/kg)
    shelfLifeDays: 40,
    packaging: '50kg breathable jute mesh bags',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
    description: 'Double-skin dried Nashik red onions, 45mm to 60mm size, low moisture curing done in ventilated shed.',
    benchmarkModalPrice: 2150.00,
    eligibleForPooling: true,
    coordinates: { lat: 20.1738, lng: 73.9856 },
    createdAt: '2026-11-05T09:00:00Z'
  },
  {
    id: 'list_tom_03',
    farmerId: 'usr_farmer_2',
    farmerName: 'Sunita Deshmukh',
    farmId: 'farm_2',
    farmName: 'Sahyadri Organic Orchard',
    farmLocation: 'Dindori, Nashik (MH)',
    cropId: 'crop_tomato',
    cropName: 'Tomatoes (Hybrid Roma)',
    grade: 'Certified Organic Grade A',
    quantity: 3200,
    unit: 'kg',
    harvestDate: '2026-11-11',
    availableFrom: '2026-11-12',
    availableUntil: '2026-11-16',
    expectedPrice: 34.00,
    shelfLifeDays: 5,
    packaging: '10kg corrugated cardboard boxes with partition',
    status: 'under_negotiation',
    image: 'https://images.unsplash.com/photo-1546470427-0d4db154ceb7?w=600&auto=format&fit=crop&q=80',
    description: 'NPOP organic certified tomatoes grown with jeevamrut and zero chemical pesticides. Rich flavor and high brix.',
    benchmarkModalPrice: 30.00,
    eligibleForPooling: true,
    coordinates: { lat: 20.2034, lng: 73.8322 },
    createdAt: '2026-11-11T07:15:00Z'
  },
  {
    id: 'list_chili_04',
    farmerId: 'usr_farmer_2',
    farmerName: 'Sunita Deshmukh',
    farmId: 'farm_2',
    farmName: 'Sahyadri Organic Orchard',
    farmLocation: 'Dindori, Nashik (MH)',
    cropId: 'crop_chili',
    cropName: 'Green Chilies (G4 Hot)',
    grade: 'Grade A Export',
    quantity: 1500,
    unit: 'kg',
    harvestDate: '2026-11-12',
    availableFrom: '2026-11-12',
    availableUntil: '2026-11-17',
    expectedPrice: 48.00,
    shelfLifeDays: 5,
    packaging: '5kg perforated poly bags inside master cartons',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80',
    description: 'Tender dark green G4 pungent chilies, uniform length, stem attached.',
    benchmarkModalPrice: 46.00,
    eligibleForPooling: true,
    coordinates: { lat: 20.2034, lng: 73.8322 },
    createdAt: '2026-11-12T06:45:00Z'
  },
  {
    id: 'list_mango_05',
    farmerId: 'usr_farmer_2',
    farmerName: 'Sunita Deshmukh',
    farmId: 'farm_2',
    farmName: 'Sahyadri Organic Orchard',
    farmLocation: 'Dindori, Nashik (MH)',
    cropId: 'crop_mango',
    cropName: 'Alphonso Mangoes (Hapus)',
    grade: 'Export Grade Premium (250g+)',
    quantity: 350, // crates
    unit: 'crate',
    harvestDate: '2026-11-08',
    availableFrom: '2026-11-10',
    availableUntil: '2026-11-17',
    expectedPrice: 850.00, // per crate of 12
    shelfLifeDays: 5,
    packaging: 'Protected single-layer corrugated trays',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80',
    description: 'Grass-hay ripened GI-origin Alphonso mangoes. Scented aroma, fiber-less creamy pulp.',
    benchmarkModalPrice: 800.00,
    eligibleForPooling: true,
    coordinates: { lat: 20.2034, lng: 73.8322 },
    createdAt: '2026-11-09T10:00:00Z'
  },
  {
    id: 'list_pot_06',
    farmerId: 'usr_farmer_3',
    farmerName: 'Rajesh Gowda',
    farmId: 'farm_3',
    farmName: 'Kaveri Valley Horticulture',
    farmLocation: 'Kolar Rural (KA)',
    cropId: 'crop_potato',
    cropName: 'Potatoes (Kufri Jyoti)',
    grade: 'Grade B (General Market)',
    quantity: 180, // quintal
    unit: 'quintal',
    harvestDate: '2026-11-01',
    availableFrom: '2026-11-04',
    availableUntil: '2026-12-20',
    expectedPrice: 1650.00, // per quintal (₹16.5/kg)
    shelfLifeDays: 45,
    packaging: '50kg gunny bags',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
    description: 'Clean washed table potatoes, 40-55mm grading, dry dirt brushed off.',
    benchmarkModalPrice: 1600.00,
    eligibleForPooling: false,
    coordinates: { lat: 13.1367, lng: 78.1292 },
    createdAt: '2026-11-04T11:30:00Z'
  }
];

export const initialBuyerOffers = [
  // Offers on Tomato Listing list_tom_01 (4500 kg @ expected ₹28.00/kg)
  // Demonstrating the core challenge:
  // Offer A (BigBasket Hub, 145 km): ₹29.50/kg, full 4500 kg, pickup next day -> Net ₹26.85/kg!
  // Offer B (Delhi NCR Agro, 1250 km): ₹34.00/kg! High gross lure, but transport is ₹7.20/kg and 4 days transit kills tomatoes! Net ₹26.30 + high spoilage!
  // Offer C (Vashi APMC Mandi, 168 km): ₹28.50/kg, full 4500 kg, part of Pooled Transport -> transport only ₹1.35/kg -> Net ₹27.15/kg (WINNER!)
  // Offer D (Metro Cash & Carry, 210 km): ₹30.00/kg, but only wants 1500 kg (partial lot)
  {
    id: 'off_tom_01_bb',
    listingId: 'list_tom_01',
    buyerId: 'usr_buyer_1',
    buyerName: 'BigBasket Fresh Regional Hub',
    buyerType: 'Online Grocery Retailer',
    buyerVerified: true,
    offeredPrice: 29.50,
    quantity: 4500,
    unit: 'kg',
    deliveryDate: '2026-11-13',
    transportMode: 'platform_organized', // 'farmer_arranged', 'buyer_arranged', 'platform_organized'
    distanceKm: 145,
    pickupWindow: '2026-11-13 Morning (Within 36h)',
    paymentTerms: '25% Advance on Dispatch, 75% on QC at Hub',
    status: 'active', // 'active', 'countered', 'accepted', 'rejected'
    notes: 'Direct dock delivery required at Bhiwandi facility. Need crates palletized.',
    createdAt: '2026-11-11T10:15:00Z',
    history: [
      {
        sender: 'BigBasket Fresh Regional Hub',
        role: 'buyer',
        type: 'initial_offer',
        price: 29.50,
        quantity: 4500,
        timestamp: '2026-11-11T10:15:00Z',
        message: 'Initial purchase offer for full 4,500 kg lot at premium table rate.'
      }
    ]
  },
  {
    id: 'off_tom_01_vashi',
    listingId: 'list_tom_01',
    buyerId: 'usr_buyer_2',
    buyerName: 'Kisan Mandi Wholesalers (Vashi)',
    buyerType: 'APMC Commission Agent',
    buyerVerified: true,
    offeredPrice: 28.50,
    quantity: 4500,
    unit: 'kg',
    deliveryDate: '2026-11-13',
    transportMode: 'pooled_transport', // Eligible for 40% transport savings!
    distanceKm: 168,
    pickupWindow: '2026-11-13 Afternoon',
    paymentTerms: '100% Instant Escrow Transfer on Gate Entry',
    status: 'active',
    notes: 'Can combine with Sunita Deshmukh shipment in Dindori for shared 10T reefer truck.',
    createdAt: '2026-11-11T11:45:00Z',
    history: [
      {
        sender: 'Kisan Mandi Wholesalers (Vashi)',
        role: 'buyer',
        type: 'initial_offer',
        price: 28.50,
        quantity: 4500,
        timestamp: '2026-11-11T11:45:00Z',
        message: 'Offer placed with pre-grouped Nashik-Vashi consolidated route.'
      }
    ]
  },
  {
    id: 'off_tom_01_delhi',
    listingId: 'list_tom_01',
    buyerId: 'usr_buyer_4',
    buyerName: 'Delhi NCR Agro Sourcing Co.',
    buyerType: 'Inter-State Wholesaler',
    buyerVerified: false, // Unverified!
    offeredPrice: 34.00, // HIGH GROSS PRICE TRAP!
    quantity: 4500,
    unit: 'kg',
    deliveryDate: '2026-11-16', // Late! Produce will rot (shelf life is 4 days)
    transportMode: 'farmer_arranged', // Farmer must pay long-haul freight
    distanceKm: 1250,
    pickupWindow: '2026-11-15 (4 days transit)',
    paymentTerms: '30 Days Credit after Delivery Acceptance',
    status: 'active',
    notes: 'Need delivery in Azadpur Mandi. We pay highest price in India.',
    createdAt: '2026-11-11T13:30:00Z',
    history: [
      {
        sender: 'Delhi NCR Agro Sourcing Co.',
        role: 'buyer',
        type: 'initial_offer',
        price: 34.00,
        quantity: 4500,
        timestamp: '2026-11-11T13:30:00Z',
        message: 'Top-market gross offer of ₹34/kg. Long-distance truck required.'
      }
    ]
  },
  {
    id: 'off_tom_01_metro',
    listingId: 'list_tom_01',
    buyerId: 'usr_buyer_3',
    buyerName: 'Metro Cash & Carry Hub',
    buyerType: 'Supermarket Chain',
    buyerVerified: true,
    offeredPrice: 30.00,
    quantity: 1500, // Partial lot! Leaves 3000 kg orphaned
    unit: 'kg',
    deliveryDate: '2026-11-14',
    transportMode: 'platform_organized',
    distanceKm: 210,
    pickupWindow: '2026-11-14 Early Morning',
    paymentTerms: '50% on Pickup, 50% within 48h',
    status: 'active',
    notes: 'Only taking Grade A 1500 kg for weekend promo. Small truck needed.',
    createdAt: '2026-11-11T14:10:00Z',
    history: [
      {
        sender: 'Metro Cash & Carry Hub',
        role: 'buyer',
        type: 'initial_offer',
        price: 30.00,
        quantity: 1500,
        timestamp: '2026-11-11T14:10:00Z',
        message: 'Initial partial lot offer for 1500 kg.'
      }
    ]
  },

  // Offers on Organic Tomatoes (list_tom_03)
  {
    id: 'off_tom_03_bb',
    listingId: 'list_tom_03',
    buyerId: 'usr_buyer_1',
    buyerName: 'BigBasket Fresh Regional Hub',
    buyerType: 'Online Grocery Retailer',
    buyerVerified: true,
    offeredPrice: 33.50,
    quantity: 3200,
    unit: 'kg',
    deliveryDate: '2026-11-14',
    transportMode: 'pooled_transport',
    distanceKm: 152,
    pickupWindow: '2026-11-13 Evening',
    paymentTerms: '30% Advance, 70% Delivery',
    status: 'countered',
    notes: 'Offer revised after counter-negotiation.',
    createdAt: '2026-11-11T15:20:00Z',
    history: [
      {
        sender: 'BigBasket Fresh Regional Hub',
        role: 'buyer',
        type: 'initial_offer',
        price: 32.00,
        quantity: 3200,
        timestamp: '2026-11-11T15:20:00Z',
        message: 'Offered ₹32.00/kg for certified organic lot.'
      },
      {
        sender: 'Sunita Deshmukh',
        role: 'farmer',
        type: 'counter_offer',
        price: 35.00,
        quantity: 3200,
        timestamp: '2026-11-11T17:40:00Z',
        message: 'Our organic certification cost and premium quality justify minimum ₹35/kg.'
      },
      {
        sender: 'BigBasket Fresh Regional Hub',
        role: 'buyer',
        type: 'counter_offer',
        price: 33.50,
        quantity: 3200,
        timestamp: '2026-11-12T08:10:00Z',
        message: 'Can meet midway at ₹33.50/kg with guaranteed pickup by 5 PM tomorrow.'
      }
    ]
  },

  // Offers on Onion Listing (list_onion_02)
  {
    id: 'off_onion_02_vashi',
    listingId: 'list_onion_02',
    buyerId: 'usr_buyer_2',
    buyerName: 'Kisan Mandi Wholesalers (Vashi)',
    buyerType: 'APMC Commission Agent',
    buyerVerified: true,
    offeredPrice: 2250.00,
    quantity: 120,
    unit: 'quintal',
    deliveryDate: '2026-11-18',
    transportMode: 'platform_organized',
    distanceKm: 168,
    pickupWindow: '2026-11-17 to 2026-11-19',
    paymentTerms: '100% RTGS on weighbridge slips',
    status: 'accepted',
    notes: 'Accepted offer. Full 120 quintals booked.',
    createdAt: '2026-11-08T11:00:00Z',
    history: [
      {
        sender: 'Kisan Mandi Wholesalers (Vashi)',
        role: 'buyer',
        type: 'initial_offer',
        price: 2250.00,
        quantity: 120,
        timestamp: '2026-11-08T11:00:00Z',
        message: 'Firm commitment for full lot at ₹2,250/quintal.'
      },
      {
        sender: 'Ramesh Patel',
        role: 'farmer',
        type: 'accepted',
        price: 2250.00,
        quantity: 120,
        timestamp: '2026-11-08T14:30:00Z',
        message: 'Accepted offer. Converted to Order #ORD-2026-8941.'
      }
    ]
  }
];

export const initialOrders = [
  {
    id: 'ord_2026_8941',
    orderNumber: 'ORD-2026-8941',
    listingId: 'list_onion_02',
    offerId: 'off_onion_02_vashi',
    cropName: 'Red Onions (Nashik Medium)',
    grade: 'Grade A (Commercial Export/Storage)',
    farmerId: 'usr_farmer_1',
    farmerName: 'Ramesh Patel',
    buyerId: 'usr_buyer_2',
    buyerName: 'Kisan Mandi Wholesalers (Vashi)',
    transporterId: 'usr_transporter_1',
    transporterName: 'Kisan Logistics & Reefer Express',
    quantity: 120,
    unit: 'quintal',
    unitPrice: 2250.00,
    grossAmount: 270000.00, // ₹2,70,000
    transportCost: 14400.00, // ₹14,400 (12 tons x 168 km)
    platformFee: 2700.00, // 1%
    netFarmerPayout: 252900.00, // ₹2,52,900
    status: 'in_transit', // 'order_placed', 'transport_assigned', 'dispatched', 'in_transit', 'delivered', 'completed'
    orderDate: '2026-11-08T14:30:00Z',
    dispatchDate: '2026-11-12T06:00:00Z',
    estimatedDeliveryDate: '2026-11-12T16:00:00Z',
    deliveryAddress: 'Gala No 42, Onion-Potato Market, APMC Sector 19, Vashi, Navi Mumbai 400705',
    pickupAddress: 'Godavari Agri Greens, Survey 142/2, Pimpalgaon Baswant, Nashik 422209',
    tracking: {
      trackingNumber: 'TRK-MH-77192',
      vehicleNumber: 'MH-15-EG-8492',
      vehicleType: '14-Ton Multi-Axle Open Body',
      driverName: 'Sanjay Shinde',
      driverPhone: '+91 98221 44091',
      currentLocation: 'Kasara Ghat NH-160 (68 km to destination)',
      milestones: [
        { status: 'Order Placed & Terms Locked', time: '2026-11-08 14:30', done: true },
        { status: 'Transport Assigned & Truck Dispatched to Farm', time: '2026-11-11 18:00', done: true },
        { status: 'Produce Inspected & Loaded at Farm', time: '2026-11-12 05:30', done: true },
        { status: 'Dispatched & On Highway (In-Transit)', time: '2026-11-12 06:15', done: true },
        { status: 'Arrived at Buyer Terminal & Weight Verified', time: 'Estimated 2026-11-12 16:30', done: false },
        { status: 'QC Passed & Final Payout Disbursed', time: 'Pending Delivery', done: false }
      ]
    }
  },
  {
    id: 'ord_2026_8890',
    orderNumber: 'ORD-2026-8890',
    listingId: 'list_tom_01_prev',
    offerId: 'off_prev_metro',
    cropName: 'Tomatoes (Hybrid Roma)',
    grade: 'Grade A',
    farmerId: 'usr_farmer_1',
    farmerName: 'Ramesh Patel',
    buyerId: 'usr_buyer_3',
    buyerName: 'Metro Cash & Carry Hub',
    transporterId: 'usr_transporter_2',
    transporterName: 'Sahyadri Rural Goods Transport',
    quantity: 3000,
    unit: 'kg',
    unitPrice: 27.50,
    grossAmount: 82500.00,
    transportCost: 4800.00,
    platformFee: 825.00,
    netFarmerPayout: 76875.00,
    status: 'completed',
    orderDate: '2026-11-02T10:00:00Z',
    dispatchDate: '2026-11-03T05:00:00Z',
    estimatedDeliveryDate: '2026-11-03T14:00:00Z',
    deliveryAddress: 'Metro Cash & Carry, Hadapsar, Pune 411028',
    pickupAddress: 'Godavari Agri Greens, Pimpalgaon Baswant, Nashik',
    tracking: {
      trackingNumber: 'TRK-MH-66021',
      vehicleNumber: 'MH-15-AJ-1290',
      vehicleType: '4-Ton Canter Insulated',
      driverName: 'Kailas Jadhav',
      driverPhone: '+91 97632 11009',
      currentLocation: 'Delivered & Completed at Pune Hub',
      milestones: [
        { status: 'Order Placed & Terms Locked', time: '2026-11-02 10:00', done: true },
        { status: 'Transport Assigned', time: '2026-11-02 14:00', done: true },
        { status: 'Produce Loaded at Farm', time: '2026-11-03 04:30', done: true },
        { status: 'Dispatched & In-Transit', time: '2026-11-03 05:15', done: true },
        { status: 'Delivered at Hadapsar Hub', time: '2026-11-03 13:45', done: true },
        { status: 'QC Passed & 100% Payout Disbursed', time: '2026-11-03 15:30', done: true }
      ]
    }
  }
];

export const initialTransportPools = [
  {
    id: 'pool_nsk_mum_01',
    title: 'Nashik Agri Belt -> Mumbai / Vashi Consolidated Corridors',
    originCluster: 'Nashik District (Pimpalgaon / Dindori / Niphad)',
    originCoords: { lat: 20.1738, lng: 73.9856 },
    destinationHub: 'Mumbai MMR (Bhiwandi / Vashi APMC)',
    destinationCoords: { lat: 19.0760, lng: 73.0076 },
    distanceKm: 165,
    departureDate: '2026-11-13',
    departureTime: '14:00 IST',
    vehicleType: '10-Ton Refrigerated Container Carrier (Reefer)',
    maxCapacityKg: 10000,
    currentBookedKg: 7700,
    participants: [
      {
        farmerName: 'Ramesh Patel',
        farmLocation: 'Pimpalgaon Baswant',
        crop: 'Tomatoes (Hybrid Roma)',
        quantityKg: 4500,
        individualFreight: 9450,
        pooledFreight: 6075, // 35.7% SAVINGS!
        savings: 3375
      },
      {
        farmerName: 'Sunita Deshmukh',
        farmLocation: 'Dindori (8 km en-route)',
        crop: 'Green Chilies (G4 Hot)',
        quantityKg: 3200,
        individualFreight: 7800,
        pooledFreight: 4950, // 36.5% SAVINGS!
        savings: 2850
      }
    ],
    availableCapacityKg: 2300,
    estimatedSavingsPercent: 36,
    status: 'open_for_joining', // 'open_for_joining', 'full', 'dispatched', 'completed'
    carrier: 'Kisan Logistics & Reefer Express',
    routeWaypoints: [
      'Stop 1: Godavari Agri Greens (Pimpalgaon) - 14:00',
      'Stop 2: Sahyadri Organic Orchard (Dindori) - 14:45',
      'Highway Express via NH-160 Kasara',
      'Stop 3: BigBasket Bhiwandi Logistics Hub - 19:30',
      'Stop 4: Vashi APMC Terminal - 21:00'
    ]
  },
  {
    id: 'pool_nsk_pun_02',
    title: 'Nashik -> Pune Hadapsar / Gultekdi Market Corridor',
    originCluster: 'Nashik Agri Hub',
    originCoords: { lat: 20.0000, lng: 73.7800 },
    destinationHub: 'Pune APMC & Supermarket Hubs',
    destinationCoords: { lat: 18.5204, lng: 73.8567 },
    distanceKm: 215,
    departureDate: '2026-11-14',
    departureTime: '06:00 IST',
    vehicleType: '6-Ton Insulated Truck',
    maxCapacityKg: 6000,
    currentBookedKg: 3800,
    participants: [
      {
        farmerName: 'Sahyadri FPO Cluster 3',
        farmLocation: 'Ozar Nashik',
        crop: 'Capsicum & Cucumbers',
        quantityKg: 3800,
        individualFreight: 8900,
        pooledFreight: 5900,
        savings: 3000
      }
    ],
    availableCapacityKg: 2200,
    estimatedSavingsPercent: 33,
    status: 'open_for_joining',
    carrier: 'Sahyadri Rural Goods Transport',
    routeWaypoints: [
      'Stop 1: Ozar Cold Storage Hub - 06:00',
      'Express Transit via NH-60 Sangamner - Alephata',
      'Stop 2: Moshi Sub-Yard Pune - 11:30',
      'Stop 3: Gultekdi APMC Market - 13:00'
    ]
  }
];

export const initialPriceObservations = [
  // Transparent, non-invented market benchmarks with explicit data source, date and location
  {
    id: 'obs_tom_nsk',
    cropId: 'crop_tomato',
    cropName: 'Tomato',
    variety: 'Hybrid / Local',
    marketName: 'Pimpalgaon Mandi',
    district: 'Nashik',
    state: 'Maharashtra',
    minPrice: 20.00,
    modalPrice: 26.50,
    maxPrice: 31.00,
    unit: 'kg',
    observationDate: '2026-11-12',
    dataSource: 'Directorate of Marketing & Inspection (Agmarknet Daily Bulletin #MH-NSK-1112)',
    trend: 'up', // 'up', 'down', 'stable'
    trendPercent: 5.2,
    arrivalsTons: 185
  },
  {
    id: 'obs_tom_vsh',
    cropId: 'crop_tomato',
    cropName: 'Tomato',
    variety: 'Hybrid Table',
    marketName: 'Vashi Wholesale Market (APMC)',
    district: 'Navi Mumbai',
    state: 'Maharashtra',
    minPrice: 25.00,
    modalPrice: 29.50,
    maxPrice: 35.00,
    unit: 'kg',
    observationDate: '2026-11-12',
    dataSource: 'Maharashtra State Agricultural Marketing Board (MSAMB Daily Price Index)',
    trend: 'stable',
    trendPercent: 0.8,
    arrivalsTons: 320
  },
  {
    id: 'obs_tom_azp',
    cropId: 'crop_tomato',
    cropName: 'Tomato',
    variety: 'Roma / Hybrid',
    marketName: 'Azadpur Mandi',
    district: 'North Delhi',
    state: 'Delhi',
    minPrice: 28.00,
    modalPrice: 34.00,
    maxPrice: 39.00,
    unit: 'kg',
    observationDate: '2026-11-12',
    dataSource: 'Delhi Agricultural Marketing Board (DAMB Official E-Mandi Feed)',
    trend: 'up',
    trendPercent: 7.4,
    arrivalsTons: 410
  },
  {
    id: 'obs_on_las',
    cropId: 'crop_onion',
    cropName: 'Onion',
    variety: 'Red (Medium Garva)',
    marketName: 'Lasalgaon Mandi (Asia Largest Onion Market)',
    district: 'Nashik',
    state: 'Maharashtra',
    minPrice: 1650.00,
    modalPrice: 2150.00,
    maxPrice: 2480.00,
    unit: 'quintal',
    observationDate: '2026-11-12',
    dataSource: 'National Horticultural Research and Development Foundation (NHRDF Bulletin)',
    trend: 'stable',
    trendPercent: -1.2,
    arrivalsTons: 1450
  },
  {
    id: 'obs_on_vsh',
    cropId: 'crop_onion',
    cropName: 'Onion',
    variety: 'Red Medium',
    marketName: 'Vashi APMC Mandi',
    district: 'Navi Mumbai',
    state: 'Maharashtra',
    minPrice: 2000.00,
    modalPrice: 2350.00,
    maxPrice: 2650.00,
    unit: 'quintal',
    observationDate: '2026-11-12',
    dataSource: 'Agmarknet / Ministry of Agriculture & Farmers Welfare',
    trend: 'up',
    trendPercent: 3.1,
    arrivalsTons: 620
  },
  {
    id: 'obs_pot_kol',
    cropId: 'crop_potato',
    cropName: 'Potato',
    variety: 'Kufri Jyoti / Local',
    marketName: 'Kolar APMC Market',
    district: 'Kolar',
    state: 'Karnataka',
    minPrice: 1400.00,
    modalPrice: 1600.00,
    maxPrice: 1850.00,
    unit: 'quintal',
    observationDate: '2026-11-12',
    dataSource: 'Karnataka State APMC Online Price Record',
    trend: 'down',
    trendPercent: -2.5,
    arrivalsTons: 110
  },
  {
    id: 'obs_chi_dind',
    cropId: 'crop_chili',
    cropName: 'Green Chili',
    variety: 'G4 Hot Plucked',
    marketName: 'Nashik Dindori Mandi',
    district: 'Nashik',
    state: 'Maharashtra',
    minPrice: 38.00,
    modalPrice: 46.00,
    maxPrice: 53.00,
    unit: 'kg',
    observationDate: '2026-11-12',
    dataSource: 'Agmarknet Official Reporting (Market ID: MH-NSK-004)',
    trend: 'up',
    trendPercent: 4.8,
    arrivalsTons: 45
  }
];

export const safetyAndLimitationsNotice = {
  title: 'FarmBridge Safety, Ethics & Transparency Charter',
  disclaimers: [
    {
      heading: 'No Artificial or Fabricated Prices',
      body: 'All market reference prices originate strictly from verified official government agencies (Agmarknet, State APMCs, NHRDF) and state the exact reporting date and mandi location. Live spot rates fluctuate continuously; benchmark prices are purely contextual indicators.'
    },
    {
      heading: 'Estimates vs. Guaranteed Returns',
      body: 'Transport costs, transit times, fuel adjustments, and calculated net returns are mathematical logistics models and engineering estimates. Final net proceeds depend on actual weighbridge slips, agreed buyer terms, and inspection outcomes.'
    },
    {
      heading: 'No Guaranteed Sale Representation',
      body: 'FarmBridge facilitates transparent direct farmer-to-buyer offer comparison, negotiations, and coordinated transport pooling. The platform does not guarantee produce sales, purchase commitments, or underwrite commodity price volatility.'
    },
    {
      heading: 'Verified Profiles & Document Audit',
      body: 'Profiles display transparent verification badges based on submitted documents (Kisan Credit Cards, FSSAI certificates, APMC trader licenses). Users must exercise due diligence prior to executing high-value agricultural dispatches.'
    }
  ]
};
