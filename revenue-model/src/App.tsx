// @ts-nocheck
import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Cell, Legend, PieChart, Pie } from "recharts";

const monthlyData = [
  { month: "M1", phase: "Build", newCust: 0, totalCust: 0, smallSites: 0, medSites: 0, lgSites: 0, totalSites: 0, carers: 0, mrr: 0, cumRev: 0, arr: 0 },
  { month: "M2", phase: "Build", newCust: 0, totalCust: 0, smallSites: 0, medSites: 0, lgSites: 0, totalSites: 0, carers: 0, mrr: 0, cumRev: 0, arr: 0 },
  { month: "M3", phase: "Build", newCust: 0, totalCust: 0, smallSites: 0, medSites: 0, lgSites: 0, totalSites: 0, carers: 0, mrr: 0, cumRev: 0, arr: 0 },
  { month: "M4", phase: "Launch", newCust: 1, totalCust: 1, smallSites: 3, medSites: 0, lgSites: 0, totalSites: 3, carers: 45, mrr: 225, cumRev: 225, arr: 2700 },
  { month: "M5", phase: "Launch", newCust: 1, totalCust: 2, smallSites: 8, medSites: 0, lgSites: 0, totalSites: 8, carers: 150, mrr: 750, cumRev: 975, arr: 9000 },
  { month: "M6", phase: "Grow", newCust: 2, totalCust: 4, smallSites: 13, medSites: 4, lgSites: 0, totalSites: 17, carers: 335, mrr: 1675, cumRev: 2650, arr: 20100 },
  { month: "M7", phase: "Grow", newCust: 2, totalCust: 6, smallSites: 15, medSites: 14, lgSites: 0, totalSites: 29, carers: 605, mrr: 3025, cumRev: 5675, arr: 36300 },
  { month: "M8", phase: "Grow", newCust: 1, totalCust: 7, smallSites: 15, medSites: 25, lgSites: 0, totalSites: 40, carers: 890, mrr: 4450, cumRev: 10125, arr: 53400 },
  { month: "M9", phase: "Grow", newCust: 2, totalCust: 9, smallSites: 15, medSites: 30, lgSites: 9, totalSites: 54, carers: 1210, mrr: 6050, cumRev: 16175, arr: 72600 },
  { month: "M10", phase: "Scale", newCust: 2, totalCust: 11, smallSites: 20, medSites: 39, lgSites: 13, totalSites: 72, carers: 1620, mrr: 8100, cumRev: 24275, arr: 97200 },
  { month: "M11", phase: "Scale", newCust: 2, totalCust: 13, smallSites: 20, medSites: 49, lgSites: 23, totalSites: 92, carers: 2100, mrr: 10500, cumRev: 34775, arr: 126000 },
  { month: "M12", phase: "Scale", newCust: 2, totalCust: 15, smallSites: 20, medSites: 57, lgSites: 36, totalSites: 113, carers: 2615, mrr: 13075, cumRev: 47850, arr: 156900 },
];

const phaseColors = { Build: "#94a3b8", Launch: "#f59e0b", Grow: "#22c55e", Scale: "#3b82f6" };

const formatCurrency = (v) => {
  if (v >= 1000) return `£${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k`;
  return `£${v}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#e2e8f0", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
      <p style={{ fontWeight: 700, marginBottom: 6, color: "#fff", fontSize: 13 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: "3px 0", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />
          <span style={{ color: "#94a3b8" }}>{p.name}:</span>
          <span style={{ fontWeight: 600 }}>
            {typeof p.value === "number" && p.name.toLowerCase().includes("rev") || p.name.toLowerCase().includes("mrr") || p.name.toLowerCase().includes("arr")
              ? `£${p.value.toLocaleString()}`
              : p.value.toLocaleString()}
          </span>
        </p>
      ))}
    </div>
  );
};

const StatCard = ({ label, value, sub, accent }) => (
  <div style={{
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    border: `1px solid ${accent}33`,
    borderRadius: 12,
    padding: "18px 20px",
    flex: 1,
    minWidth: 140
  }}>
    <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6, fontWeight: 600 }}>{label}</div>
    <div style={{ fontSize: 26, fontWeight: 800, color: accent, lineHeight: 1.1 }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{sub}</div>}
  </div>
);

const Milestone = ({ month, text, active }) => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
    opacity: active ? 1 : 0.35, transition: "opacity 0.3s"
  }}>
    <div style={{
      width: 10, height: 10, borderRadius: "50%",
      background: active ? "#22c55e" : "#334155",
      border: active ? "2px solid #4ade80" : "2px solid #475569",
      boxShadow: active ? "0 0 12px rgba(34,197,94,0.4)" : "none"
    }} />
    <span style={{ fontSize: 10, color: active ? "#e2e8f0" : "#64748b", textAlign: "center", maxWidth: 70 }}>{month}</span>
    {text && <span style={{ fontSize: 9, color: "#94a3b8", textAlign: "center", maxWidth: 80 }}>{text}</span>}
  </div>
);

export default function Dashboard() {
  const [hoveredMonth, setHoveredMonth] = useState(null);

  const m12 = monthlyData[11];
  const siteBreakdown = [
    { name: "Small (5)", value: 20, color: "#22c55e" },
    { name: "Medium (10)", value: 57, color: "#3b82f6" },
    { name: "Large (18)", value: 36, color: "#f59e0b" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #0f0f23 0%, #1a1a2e 40%, #16213e 100%)",
      color: "#e2e8f0",
      fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      padding: "32px 24px"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ maxWidth: 1100, margin: "0 auto 32px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, background: "linear-gradient(135deg, #22c55e, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          12-Month Revenue Forecast
        </h1>
        <p style={{ color: "#64748b", fontSize: 13, margin: "6px 0 0" }}>
          Realistic model with franchise rollout curves · £5/active carer/month
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ maxWidth: 1100, margin: "0 auto 28px", display: "flex", gap: 12, flexWrap: "wrap" }}>
        <StatCard label="Month 12 MRR" value={`£${m12.mrr.toLocaleString()}`} sub="Monthly recurring revenue" accent="#22c55e" />
        <StatCard label="ARR Run-Rate" value={`£${(m12.arr / 1000).toFixed(0)}k`} sub="Annualised" accent="#3b82f6" />
        <StatCard label="Customers" value={m12.totalCust} sub="Active groups" accent="#f59e0b" />
        <StatCard label="Live Sites" value={m12.totalSites} sub="Across all groups" accent="#a78bfa" />
        <StatCard label="Active Carers" value={m12.carers.toLocaleString()} sub="Paying users" accent="#f472b6" />
        <StatCard label="Total Revenue" value={`£${(m12.cumRev / 1000).toFixed(0)}k`} sub="Cumulative 12mo" accent="#38bdf8" />
      </div>

      {/* Milestone Timeline */}
      <div style={{
        maxWidth: 1100, margin: "0 auto 32px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 12, padding: "16px 20px"
      }}>
        <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12, fontWeight: 600 }}>Milestones</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
          <div style={{ position: "absolute", top: 5, left: 20, right: 20, height: 1, background: "linear-gradient(90deg, #334155, #22c55e, #3b82f6)", opacity: 0.4 }} />
          <Milestone month="M1-3" text="Build Phase 1" active />
          <Milestone month="M4" text="First customer" active />
          <Milestone month="M6" text="Seed talks" active />
          <Milestone month="M8" text="Seed close" active />
          <Milestone month="M10" text="£8k MRR" active />
          <Milestone month="M12" text="£13k MRR" active />
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* MRR + Cumulative Revenue */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 12, padding: "20px 20px 12px", marginBottom: 20
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Monthly Revenue & Cumulative</div>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Area yAxisId="left" type="monotone" dataKey="mrr" name="MRR" fill="url(#mrrGrad)" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 3, fill: "#22c55e", stroke: "#0f0f23", strokeWidth: 2 }} />
              <Line yAxisId="right" type="monotone" dataKey="cumRev" name="Cumulative Rev" stroke="#3b82f6" strokeWidth={2} strokeDasharray="6 3" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          {/* ARR Run-Rate */}
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "20px 20px 12px"
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>ARR Run-Rate</div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="arrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="arr" name="ARR" fill="url(#arrGrad)" stroke="#a78bfa" strokeWidth={2} dot={{ r: 2.5, fill: "#a78bfa", stroke: "#0f0f23", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Customers & Sites */}
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "20px 20px 12px"
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Customers & Live Sites</div>
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar yAxisId="right" dataKey="totalSites" name="Live Sites" fill="#3b82f6" opacity={0.3} radius={[3, 3, 0, 0]} />
                <Line yAxisId="left" type="monotone" dataKey="totalCust" name="Customers" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3, fill: "#f59e0b", stroke: "#0f0f23", strokeWidth: 2 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          {/* Site Rollout by Type (Stacked) */}
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "20px 20px 12px"
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Site Rollout by Group Type</div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="lgSites" name="Large Groups" stackId="1" fill="#f59e0b" stroke="#f59e0b" fillOpacity={0.4} />
                <Area type="monotone" dataKey="medSites" name="Medium Groups" stackId="1" fill="#3b82f6" stroke="#3b82f6" fillOpacity={0.4} />
                <Area type="monotone" dataKey="smallSites" name="Small Groups" stackId="1" fill="#22c55e" stroke="#22c55e" fillOpacity={0.4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Active Carers */}
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "20px 20px 12px"
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Active Carers</div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="carerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f472b6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#f472b6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="carers" name="Active Carers" fill="url(#carerGrad)" stroke="#f472b6" strokeWidth={2} dot={{ r: 2.5, fill: "#f472b6", stroke: "#0f0f23", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Month 12 Site Mix */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 12, padding: "20px", marginBottom: 20,
          display: "grid", gridTemplateColumns: "200px 1fr", gap: 24, alignItems: "center"
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Month 12 Site Mix</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {siteBreakdown.map(s => (
                <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
                  <span style={{ fontSize: 12, color: "#94a3b8", flex: 1 }}>{s.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{s.value}</span>
                  <span style={{ fontSize: 11, color: "#64748b" }}>({Math.round(s.value/113*100)}%)</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600, flex: 1, marginLeft: 18 }}>Total</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>113</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={siteBreakdown} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} strokeWidth={0}>
                {siteBreakdown.map((s, i) => <Cell key={i} fill={s.color} opacity={0.8} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Assumptions footer */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 12, padding: "16px 20px", fontSize: 11, color: "#64748b", lineHeight: 1.6
        }}>
          <span style={{ fontWeight: 700, color: "#94a3b8" }}>Key assumptions: </span>
          £5/active carer/month · 25 carers/site avg · Small groups: 2-month rollout · Medium groups: 4-month rollout · Large groups: 6-month rollout (5% non-adoption) · 60% carer ramp on new sites · 2% monthly churn (negligible at this scale) · Phase 2 payroll upsell not included
        </div>
      </div>
    </div>
  );
}
