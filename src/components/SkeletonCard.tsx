import React from 'react';

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-white/5 ${className}`}>
      <div className="h-48 bg-white/10 rounded-t-xl" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-1/2" />
        <div className="h-3 bg-white/10 rounded w-full" />
      </div>
    </div>
  );
}

export function SkeletonMemberCard() {
  return (
    <div className="animate-pulse rounded-xl bg-white/5 p-6 flex flex-col items-center gap-4">
      <div className="w-24 h-24 rounded-full bg-white/10" />
      <div className="h-4 bg-white/10 rounded w-32" />
      <div className="h-3 bg-white/10 rounded w-24" />
      <div className="h-3 bg-white/10 rounded w-full" />
      <div className="h-3 bg-white/10 rounded w-3/4" />
    </div>
  );
}

export function SkeletonGrid({ count = 6, type = 'card' }: { count?: number; type?: 'card' | 'member' }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) =>
        type === 'member'
          ? <SkeletonMemberCard key={i} />
          : <SkeletonCard key={i} />
      )}
    </div>
  );
}
