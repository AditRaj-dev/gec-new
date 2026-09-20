'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/api-client';
import { LiveImpactRibbon } from '../../../components/layout/LiveImpactRibbon';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  ArrowUpRight,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { formatIndianNumber } from '../../../lib/utils';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    apiClient.getAnalyticsOverview().then(setData);
  }, []);

  if (!data) {
    return <div className="py-20 text-center font-mono text-xs text-[#6E655F]">Loading Telemetry & Analytics...</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#222222] tracking-tight font-sans">
            Website Analytics & Performance
          </h1>
          <p className="text-xs text-[#6E655F]">
            Telemetry, traffic distribution across 5 public routes, initiative funnels, and recruitment demand.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            Live CDN Telemetry Active
          </span>
        </div>
      </div>

      <LiveImpactRibbon
        targetSection="Public Edge Performance & Conversion Funnel Telemetry"
        description="Measures visitor interest, application submission completion, and student recruitment demand."
      />

      {/* Top 4 Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[#FFFDF8] border border-[#A3040F]/15 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-mono text-[#6E655F] uppercase font-bold">Total Pageviews</span>
          <p className="text-2xl font-black text-[#222222] mt-1">
            {formatIndianNumber(data.traffic.totalPageviews)}
          </p>
          <p className="text-[10px] font-mono text-[#16A34A] font-bold mt-1 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +14.2% vs last month
          </p>
        </div>

        <div className="bg-[#FFFDF8] border border-[#A3040F]/15 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-mono text-[#6E655F] uppercase font-bold">Unique Visitors</span>
          <p className="text-2xl font-black text-[#222222] mt-1">
            {formatIndianNumber(data.traffic.uniqueVisitors)}
          </p>
          <p className="text-[10px] font-mono text-[#16A34A] font-bold mt-1 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +18.6% collegiate reach
          </p>
        </div>

        <div className="bg-[#FFFDF8] border border-[#A3040F]/15 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-mono text-[#6E655F] uppercase font-bold">Avg Session Duration</span>
          <p className="text-2xl font-black text-[#222222] mt-1">
            3m 04s
          </p>
          <p className="text-[10px] font-mono text-[#6E655F] mt-1">High editorial engagement</p>
        </div>

        <div className="bg-[#FFFDF8] border border-[#A3040F]/15 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-mono text-[#6E655F] uppercase font-bold">Bounce Rate</span>
          <p className="text-2xl font-black text-[#222222] mt-1">
            {data.traffic.bounceRatePct}%
          </p>
          <p className="text-[10px] font-mono text-[#16A34A] font-bold mt-1">Optimal user retention</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Traffic Distribution */}
        <div className="bg-[#FFFDF8] border border-[#A3040F]/15 rounded-2xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#222222]">
              Public Website Page Traffic Distribution
            </h3>
            <p className="text-xs text-[#6E655F] mt-0.5">
              Breakdown of pageviews across the 5 public website routes.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {data.pageDistribution.map((item: any) => (
              <div key={item.page} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-[#222222]">
                  <span>{item.page}</span>
                  <span className="font-mono text-[#6E655F]">
                    {formatIndianNumber(item.views)} views ({item.pct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#FCF8ED] border border-[#CBD5E1] overflow-hidden">
                  <div
                    className="h-full bg-[#A3040F] rounded-full transition-all duration-500"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Recruitment Demand */}
        <div className="bg-[#FFFDF8] border border-[#A3040F]/15 rounded-2xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#222222]">
              Student Recruitment Demand (Applications per Team)
            </h3>
            <p className="text-xs text-[#6E655F] mt-0.5">
              Incoming candidate volume for the 7 functional sub-teams.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {data.teamRecruitmentDemand.map((item: any) => (
              <div key={item.team} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-[#222222]">
                  <span>{item.team}</span>
                  <span className="font-mono text-[#A3040F] font-bold">
                    {item.apps} Candidates
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#FCF8ED] border border-[#CBD5E1] overflow-hidden">
                  <div
                    className="h-full bg-[#FBCA05] rounded-full transition-all duration-500"
                    style={{ width: `${(item.apps / 50) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
