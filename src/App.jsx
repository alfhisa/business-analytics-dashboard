import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  LayoutDashboard, Users, ShoppingBag, DollarSign, TrendingDown,
  HelpCircle, Lightbulb, ChevronRight, Filter, Calendar
} from 'lucide-react';
import { generateData } from './data';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const data = generateData();
const branches = [...new Set(data.map(d => d.branch))];
const platforms = [...new Set(data.map(d => d.platform))];

const KPICard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="text-2xl font-bold mt-1 text-slate-900">{value}</h3>
      {trend && (
        <p className={cn("text-xs mt-2 flex items-center", trend > 0 ? "text-emerald-600" : "text-rose-600")}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last period
        </p>
      )}
    </div>
    <div className={cn("p-3 rounded-xl", color)}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </div>
);

const ChartContainer = ({ title, children, description }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[400px]">
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {description && <p className="text-sm text-slate-500">{description}</p>}
    </div>
    <div className="flex-1 w-full">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);

export default function App() {
  const [filterBranch, setFilterBranch] = useState('All');
  const [filterPlatform, setFilterPlatform] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '2026-01-01', end: '2026-04-30' });
  const [showInsights, setShowInsights] = useState(false);

  const filteredData = useMemo(() => {
    return data.filter(d => {
      const dateMatch = isWithinInterval(parseISO(d.date), {
        start: parseISO(dateRange.start),
        end: parseISO(dateRange.end)
      });
      const branchMatch = filterBranch === 'All' || d.branch === filterBranch;
      const platformMatch = filterPlatform === 'All' || d.platform === filterPlatform;
      return dateMatch && branchMatch && platformMatch;
    });
  }, [filterBranch, filterPlatform, dateRange]);

  const stats = useMemo(() => {
    const totalDAU = filteredData.reduce((acc, curr) => acc + curr.dau, 0);
    const totalRevenue = filteredData.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalOrders = filteredData.reduce((acc, curr) => acc + curr.orders, 0);
    const avgMargin = filteredData.reduce((acc, curr) => acc + curr.margin, 0) / filteredData.length;

    return {
      dau: totalDAU.toLocaleString(),
      revenue: `$${(totalRevenue / 1000).toFixed(1)}k`,
      orders: totalOrders.toLocaleString(),
      margin: `${avgMargin.toFixed(1)}%`
    };
  }, [filteredData]);

  const dailyTrend = useMemo(() => {
    const grouped = filteredData.reduce((acc, curr) => {
      if (!acc[curr.date]) {
        acc[curr.date] = { date: curr.date, dau: 0, revenue: 0, profit: 0, discount: 0, margin: 0, count: 0, convRate: 0 };
      }
      acc[curr.date].dau += curr.dau;
      acc[curr.date].revenue += curr.revenue;
      acc[curr.date].profit += curr.profit;
      acc[curr.date].discount += curr.discountAmount;
      acc[curr.date].margin += curr.margin;
      acc[curr.date].convRate += curr.conversionRate;
      acc[curr.date].count += 1;
      return acc;
    }, {});

    return Object.values(grouped).map(d => ({
      ...d,
      displayDate: format(parseISO(d.date), 'MMM dd'),
      avgMargin: d.margin / d.count,
      avgConvRate: (d.convRate / d.count) * 100
    })).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredData]);

  const platformData = useMemo(() => {
    const grouped = filteredData.reduce((acc, curr) => {
      if (!acc[curr.platform]) acc[curr.platform] = 0;
      acc[curr.platform] += curr.dau;
      return acc;
    }, {});
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const branchData = useMemo(() => {
    const grouped = filteredData.reduce((acc, curr) => {
      if (!acc[curr.branch]) acc[curr.branch] = 0;
      acc[curr.branch] += curr.profit;
      return acc;
    }, {});
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredData]);

  const COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-600 p-2 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">BeanStream <span className="text-slate-400 font-normal">Analytics</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
              <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-white shadow-sm">Dashboard</button>
              <button className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900">Reports</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Filters */}
        <section className="mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">Filters</span>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Branch</label>
            <select
              className="bg-slate-50 border-none text-sm rounded-lg focus:ring-2 focus:ring-orange-500 py-1 pl-2 pr-8"
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
            >
              <option value="All">All Branches</option>
              {branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Platform</label>
            <select
              className="bg-slate-50 border-none text-sm rounded-lg focus:ring-2 focus:ring-orange-500 py-1 pl-2 pr-8"
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
            >
              <option value="All">All Platforms</option>
              {platforms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Date Range</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="bg-slate-50 border-none text-sm rounded-lg focus:ring-2 focus:ring-orange-500 py-1 px-2"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
              <span className="text-slate-300">to</span>
              <input
                type="date"
                className="bg-slate-50 border-none text-sm rounded-lg focus:ring-2 focus:ring-orange-500 py-1 px-2"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
          </div>
        </section>

        {/* KPIs */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard title="Total DAU" value={stats.dau} icon={Users} color="bg-indigo-500" trend={12.5} />
          <KPICard title="Total Revenue" value={stats.revenue} icon={DollarSign} color="bg-emerald-500" trend={8.2} />
          <KPICard title="Total Orders" value={stats.orders} icon={ShoppingBag} color="bg-orange-500" trend={10.1} />
          <KPICard title="Avg. Margin" value={stats.margin} icon={TrendingDown} color="bg-rose-500" trend={-4.3} />
        </section>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartContainer title="DAU Trend" description="Active users over time">
            <AreaChart data={dailyTrend}>
              <defs>
                <linearGradient id="colorDau" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} minTickGap={30} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="dau" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorDau)" />
            </AreaChart>
          </ChartContainer>

          <ChartContainer title="Revenue vs Profit" description="Growth comparison">
            <LineChart data={dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} minTickGap={30} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="profit" stroke="#f43f5e" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <ChartContainer title="Discount vs Margin" description="Impact of promotions">
            <LineChart data={dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} minTickGap={30} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="discount" stroke="#f59e0b" strokeWidth={2} dot={false} name="Discount ($)" />
              <Line type="monotone" dataKey="avgMargin" stroke="#6366f1" strokeWidth={2} dot={false} name="Margin (%)" />
            </LineChart>
          </ChartContainer>

          <ChartContainer title="Conversion Rate" description="User to customer %">
            <AreaChart data={dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} minTickGap={30} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} unit="%" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="avgConvRate" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={2} name="Conv Rate %" />
            </AreaChart>
          </ChartContainer>

          <ChartContainer title="Platform Breakdown" description="Users by OS">
            <PieChart>
              <Pie
                data={platformData}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {platformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ChartContainer>
        </div>

        {/* Charts Row 3 */}
        <div className="grid grid-cols-1 gap-8 mb-12">
          <ChartContainer title="Branch Performance" description="Profit ranking by branch">
            <BarChart data={branchData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={100} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} name="Total Profit ($)" />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Student Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-xl">
                <HelpCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Student Activity Questions</h2>
            </div>
            <ul className="space-y-4">
              {[
                "What happened to DAU, revenue, and margin?",
                "When did the margin start to decline?",
                "Which platform performs better overall?",
                "Which branch is currently at risk based on the data?",
                "What might happen if the current trend continues for another 60 days?",
                "What action would you recommend to the management team?"
              ].map((q, i) => (
                <li key={i} className="flex gap-4 group">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs flex items-center justify-center font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {i + 1}
                  </span>
                  <p className="text-slate-600 leading-relaxed">{q}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-slate-900 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-500 p-2 rounded-xl">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold">Teaching Insights</h2>
              </div>

              {!showInsights ? (
                <div className="py-12 flex flex-col items-center text-center">
                  <p className="text-slate-400 mb-6 max-w-xs">Analysis results are hidden. Click below to reveal the teaching points.</p>
                  <button
                    onClick={() => setShowInsights(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-orange-900/20 flex items-center gap-2 group"
                  >
                    Reveal Teaching Insights
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { title: "Health Check", text: "DAU and revenue are relatively healthy, showing consistent growth." },
                      { title: "The Turning Point", text: "Margin starts declining significantly after Day 60." },
                      { title: "The Root Cause", text: "Heavy discounting and rising operational costs are driving the margin decline." },
                      { title: "Risk Profile", text: "Branches like Kemang are at risk of becoming low-profit or loss-making." },
                      { title: "Recommendation", text: "Reduce aggressive discounts, optimize operational costs, and review branch performance." }
                    ].map((insight, i) => (
                      <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <h4 className="text-orange-400 font-bold text-sm uppercase tracking-wider mb-1">{insight.title}</h4>
                        <p className="text-slate-300 text-sm leading-relaxed">{insight.text}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowInsights(false)}
                    className="text-slate-500 hover:text-white text-xs underline"
                  >
                    Hide insights
                  </button>
                </div>
              )}
            </div>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
          </section>
        </div>
      </main>

      <footer className="mt-20 border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">© 2026 BeanStream Analytics Dashboard • Crafted by Alfhi</p>
        </div>
      </footer>
    </div>
  );
}
