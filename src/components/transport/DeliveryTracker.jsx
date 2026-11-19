import React, { useState } from 'react';
import {
  Layers,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  FileText,
  DollarSign,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { db } from '../../services/db.js';

export default function DeliveryTracker({ orders, currentUser, onRefreshData }) {
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id || null);
  const selectedOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  const handleUpdateStatus = (orderId, newStatus, locationNote) => {
    db.updateOrderStatus(orderId, newStatus, locationNote);
    onRefreshData();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl text-white p-6 shadow-md border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Orders, Dispatch & Delivery Tracking
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              Live milestone lifecycle from harvest packaging to gate weighbridge and escrow disbursement.
            </p>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200">
          <Truck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 text-sm">No Active Orders Yet</h3>
          <p className="text-xs text-slate-400 mt-1">Orders are automatically created when a farmer accepts a buyer offer.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left Column: Orders Roster */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Active Orders ({orders.length})
            </h3>

            <div className="space-y-2.5">
              {orders.map((order) => {
                const isSelected = order.id === selectedOrderId;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-emerald-50/50 border-emerald-500 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-slate-900">{order.orderNumber}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        order.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'in_transit'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="font-semibold text-slate-800 text-sm">{order.cropName}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      {order.farmerName} <ArrowRight className="inline w-3 h-3 text-slate-400" /> {order.buyerName}
                    </p>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between text-[11px]">
                      <span>Volume: <strong>{order.quantity} {order.unit}</strong></span>
                      <span className="font-bold text-emerald-700">₹{order.grossAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Order Tracking & Dispatch Card */}
          {selectedOrder && (
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6 text-xs">
              
              {/* Order Header Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Consignment Manifest #{selectedOrder.orderNumber}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-0.5">{selectedOrder.cropName}</h2>
                  <p className="text-slate-500 text-xs">
                    Quality: {selectedOrder.grade} • Ordered Date: {new Date(selectedOrder.orderDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Net Farmer Payout</span>
                  <span className="text-lg font-black text-emerald-700">
                    ₹{selectedOrder.netFarmerPayout?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Stakeholder Routing Map */}
              <div className="grid sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Farm Gate Origin</span>
                  <p className="font-bold text-slate-800 text-xs mt-0.5">{selectedOrder.farmerName}</p>
                  <p className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                    {selectedOrder.pickupAddress}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Buyer Terminal Destination</span>
                  <p className="font-bold text-slate-800 text-xs mt-0.5">{selectedOrder.buyerName}</p>
                  <p className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                    {selectedOrder.deliveryAddress}
                  </p>
                </div>
              </div>

              {/* Carrier & Vehicle Telematics */}
              {selectedOrder.tracking && (
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-emerald-700" />
                      Assigned Freight Carrier: {selectedOrder.transporterName}
                    </span>
                    <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-900 text-[11px]">
                      {selectedOrder.tracking.trackingNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Vehicle</span>
                      <span className="font-semibold text-slate-800">{selectedOrder.tracking.vehicleNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Carrier Fleet</span>
                      <span className="font-semibold text-slate-800">{selectedOrder.tracking.vehicleType}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Driver Contact</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        {selectedOrder.tracking.driverName} ({selectedOrder.tracking.driverPhone})
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-emerald-200/80 text-[11px] text-emerald-900 font-medium">
                    Current Dispatch Status: <strong>{selectedOrder.tracking.currentLocation}</strong>
                  </div>
                </div>
              )}

              {/* Milestone Tracking Stepper */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Consignment Milestones & Audit Trail
                </h4>

                <div className="relative pl-6 space-y-4 border-l-2 border-emerald-200 ml-3">
                  {selectedOrder.tracking?.milestones?.map((m, idx) => (
                    <div key={idx} className="relative">
                      <span className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] ${
                        m.done ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}>
                        {m.done ? '✓' : ''}
                      </span>
                      <div className="text-xs">
                        <p className={`font-bold ${m.done ? 'text-slate-900' : 'text-slate-400'}`}>
                          {m.status}
                        </p>
                        <p className="text-slate-500 text-[10px] mt-0.5">{m.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transporter / Operator Control Panel */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="font-bold text-xs text-slate-800 mb-2">Simulate Logistics Status Update:</h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'in_transit', 'Departed Farm Gate - Highway NH-160')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg cursor-pointer"
                  >
                    Mark Dispatched / In-Transit
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered', 'Arrived at Buyer Terminal Gate - Weighment Done')}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg cursor-pointer"
                  >
                    Mark Delivered at Hub
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'completed', 'Produce Inspected, 100% Escrow Released to Farmer')}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg cursor-pointer"
                  >
                    QC Accepted & Release Payout
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
