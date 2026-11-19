import React from 'react';
import { CheckCircle2, Clock, AlertCircle, ShieldCheck } from 'lucide-react';

export default function VerificationBadge({ status = 'unverified', documentText = '', size = 'md' }) {
  const isSmall = size === 'sm';
  
  if (status === 'verified') {
    return (
      <span 
        title={documentText || 'Verified by FarmBridge Governance'}
        className={`inline-flex items-center gap-1 font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full ${
          isSmall ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'
        }`}
      >
        <CheckCircle2 className={isSmall ? "w-3 h-3 text-emerald-600" : "w-3.5 h-3.5 text-emerald-600"} />
        <span>Verified</span>
      </span>
    );
  }

  if (status === 'pending') {
    return (
      <span 
        title={documentText || 'Verification documents submitted and under review'}
        className={`inline-flex items-center gap-1 font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-full ${
          isSmall ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'
        }`}
      >
        <Clock className={isSmall ? "w-3 h-3 text-amber-500 animate-pulse" : "w-3.5 h-3.5 text-amber-500 animate-pulse"} />
        <span>Pending KYC</span>
      </span>
    );
  }

  return (
    <span 
      title={documentText || 'Unverified account. KYC documents required.'}
      className={`inline-flex items-center gap-1 font-medium bg-slate-100 text-slate-600 border border-slate-200 rounded-full ${
        isSmall ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'
      }`}
    >
      <AlertCircle className={isSmall ? "w-3 h-3 text-slate-400" : "w-3.5 h-3.5 text-slate-400"} />
      <span>Unverified</span>
    </span>
  );
}
