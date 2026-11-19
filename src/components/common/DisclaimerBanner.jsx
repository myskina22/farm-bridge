import React, { useState } from 'react';
import { ShieldAlert, Info, ChevronDown, ChevronUp, CheckCircle, Scale } from 'lucide-react';
import { safetyAndLimitationsNotice } from '../../services/db.js';

export default function DisclaimerBanner() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-xs">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <Scale className="w-4 h-4 text-amber-700 shrink-0" />
            <p className="truncate font-medium">
              <span className="font-bold uppercase tracking-wider text-amber-800">Safety & Ethics Notice:</span> Official APMC & Agmarknet market data displayed with date & source. Platform provides logistical estimates, not guaranteed sales.
            </p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 font-semibold text-amber-800 hover:text-amber-950 underline shrink-0 cursor-pointer"
          >
            <span>{expanded ? 'Hide Details' : 'Read Charter & Sources'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-amber-200/80 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-2 animate-fadeIn">
            {safetyAndLimitationsNotice.disclaimers.map((item, idx) => (
              <div key={idx} className="bg-white/70 p-3 rounded-lg border border-amber-200 shadow-xs">
                <h4 className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                  {item.heading}
                </h4>
                <p className="text-amber-800 leading-relaxed text-[11px]">{item.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
