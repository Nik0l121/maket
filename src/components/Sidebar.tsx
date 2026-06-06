import React from "react";
import { LogOut, ChevronRight, ChevronLeft, Activity, ShieldCheck, Key, CreditCard, Radio, Settings, X, Check, History } from "lucide-react";
import { motion } from "motion/react";
import { NavItem, NotificationItem } from "../types";

export function SessionStat({ label, value, color = "text-slate-900" }: { label: string, value: string, color?: string }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
      <span className="text-[11px] font-bold text-slate-400">{label}</span>
      <span className={`text-[11px] font-black ${color} tabular-nums`}>{value}</span>
    </div>
  );
}

interface SidebarProps {
  isSidebarOpen: boolean;
  navItems: NavItem[];
  activeTab: string;
  setActiveTab: (name: string) => void;
  setIsSidebarOpen: (open: boolean) => void;
  isScannerTab?: boolean;
  isScannerRunning?: boolean;
  setIsScannerRunning?: (running: boolean) => void;
  
  // Scanner subviews
  scannerSubView?: "scanner" | "history";
  setScannerSubView?: (view: "scanner" | "history") => void;
  
  // Notification States
  notifications: NotificationItem[];
  activeGroupFilter: string;
  setActiveGroupFilter: (group: string) => void;
  isSettingsMode: boolean;
  setIsSettingsMode: (mode: boolean) => void;

  // Balance States
  selectedExchangeFilter?: string;
  setSelectedExchangeFilter?: (filter: string) => void;
  balanceSubView?: string;
  setBalanceSubView?: (view: string) => void;

  // Arbitrage states
  runningArbitrages?: any[];
  setRunningArbitrages?: (arbs: any[]) => void;
  onSelectRunningArbitrage?: (arb: any) => void;
}

export function Sidebar({
  isSidebarOpen,
  navItems,
  activeTab,
  setActiveTab,
  setIsSidebarOpen,
  isScannerTab,
  isScannerRunning,
  setIsScannerRunning,
  scannerSubView = "scanner",
  setScannerSubView,
  notifications,
  activeGroupFilter,
  setActiveGroupFilter,
  isSettingsMode,
  setIsSettingsMode,
  selectedExchangeFilter,
  setSelectedExchangeFilter,
  balanceSubView,
  setBalanceSubView,
  runningArbitrages,
  setRunningArbitrages,
  onSelectRunningArbitrage
}: SidebarProps) {
  const [activeArbIndex, setActiveArbIndex] = React.useState(0);

  return (
    <motion.aside 
      id="sidebar"
      initial={false}
      animate={{ 
        x: isSidebarOpen ? 0 : -300,
        width: isSidebarOpen ? 240 : 0
      }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={`
        fixed lg:relative z-40 h-[calc(100vh-56px)] flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800/80 overflow-hidden flex flex-col shadow-xl lg:shadow-none
        ${isSidebarOpen ? "w-[240px]" : "w-0"}
      `}
    >


      {/* Navigation */}
      <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">


        {activeTab === "Баланс" ? (
          <>
            {/* БАЛАНС МЕТРИКИ */}
            <div className="space-y-3 px-3 pt-2">
              <p className="text-[9px] font-black text-slate-400/80 uppercase tracking-widest leading-none">Баланс аккаунта</p>
              <div className="grid grid-cols-2 gap-2 bg-slate-50/50 dark:bg-slate-800/20 p-3 rounded-2xl border border-slate-100/60 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                <div className="col-span-2 flex flex-col p-2 bg-white dark:bg-slate-900 border border-slate-100/40 dark:border-slate-800/40 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase leading-none">Всего</span>
                  <span className="text-sm font-black text-slate-800 dark:text-slate-200 font-mono tracking-tight mt-0.5">$124,892</span>
                </div>
                <div className="flex flex-col p-2 bg-white dark:bg-slate-900 border border-slate-100/40 dark:border-slate-800/40 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase leading-none">Биржи</span>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 tracking-tight mt-0.5">5</span>
                </div>
                <div className="flex flex-col p-2 bg-white dark:bg-slate-900 border border-slate-100/40 dark:border-slate-800/40 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase leading-none">Токены</span>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 tracking-tight mt-0.5">18</span>
                </div>
                <div className="col-span-2 flex items-center justify-between p-2 bg-white dark:bg-slate-900 border border-slate-100/40 dark:border-slate-800/40 rounded-xl text-[10px]">
                  <span className="font-bold text-slate-400 dark:text-slate-550">Обновлено</span>
                  <span className="font-black text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-700 text-[9px]">2 мин</span>
                </div>
              </div>
            </div>

            {/* СЕГМЕНТИРОВАННЫЙ КОНТРОЛЬ */}
            <div className="px-3 pt-4 border-t border-slate-200/50">
              <p className="text-[9px] font-black text-slate-400/80 uppercase tracking-widest mb-2.5 leading-none">Режим просмотра</p>
              <div className="flex bg-slate-100 dark:bg-slate-800/70 p-1 rounded-xl border border-slate-200/50 dark:border-slate-750">
                <button
                  onClick={() => setBalanceSubView?.("Отчет по активам")}
                  className={`flex-1 py-1.5 text-[10.5px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    balanceSubView === "Отчет по активам"
                      ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-3xs"
                      : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                  }`}
                >
                  Отчет
                </button>
                <button
                  onClick={() => setBalanceSubView?.("Сводка")}
                  className={`flex-1 py-1.5 text-[10.5px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    balanceSubView === "Сводка"
                      ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-3xs"
                      : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                  }`}
                >
                  Сводка
                </button>
              </div>
            </div>

            {/* СПИСОК БИРЖ */}
            <div className="space-y-1.5 px-3 pt-4 border-t border-slate-200/50">
              <p className="text-[9px] font-black text-slate-400/80 uppercase tracking-widest mb-2 px-1 leading-none">БИРЖИ</p>
              <div className="space-y-1 max-h-[190px] overflow-y-auto pr-1">
                {[
                  { name: "Все", color: "bg-blue-500" },
                  { name: "Binance", color: "bg-amber-500" },
                  { name: "OKX", color: "bg-slate-900 border border-slate-800" },
                  { name: "Bybit", color: "bg-yellow-500" },
                  { name: "Gate", color: "bg-blue-600" },
                  { name: "KuCoin", color: "bg-emerald-500" }
                ].map((exch) => {
                  const isSelt = selectedExchangeFilter === exch.name;
                  return (
                    <button
                      key={exch.name}
                      onClick={() => setSelectedExchangeFilter?.(exch.name)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer text-left ${
                        isSelt
                          ? "bg-blue-600 text-white font-extrabold shadow-sm"
                          : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/70 dark:hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${exch.color}`} />
                        <span className="text-[11.5px] font-bold leading-none">{exch.name}</span>
                      </div>
                      {isSelt && <ChevronRight size={12} className="text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : activeTab === "Уведомления" ? (
          <>
            {/* ГРУППА СОБЫТИЙ */}
            <div className="space-y-0.5 pt-2">
              <p className="px-3 text-[9px] font-black text-slate-400/80 uppercase tracking-widest mb-3 leading-none">ГРУППА СОБЫТИЙ</p>
              <div className="space-y-1">
                {[
                  { name: "Все", count: notifications?.length || 0 },
                  { name: "Сигналы", count: notifications?.filter(n => n.group === "Сигналы").length || 0 },
                  { name: "Арбитраж", count: notifications?.filter(n => n.group === "Арбитраж").length || 0 },
                  { name: "События исполнения", count: notifications?.filter(n => n.group === "События исполнения").length || 0 },
                  { name: "Система", count: notifications?.filter(n => n.group === "Система").length || 0 },
                ].map((g) => {
                  const isActive = activeGroupFilter === g.name && !isSettingsMode;
                  return (
                    <button
                      key={g.name}
                      onClick={() => {
                        setActiveGroupFilter?.(g.name);
                        setIsSettingsMode?.(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-300 group cursor-pointer text-left text-xs font-bold leading-none ${
                        isActive 
                          ? "bg-blue-600 text-white font-extrabold shadow-md shadow-blue-500/20 animate-none" 
                          : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:text-slate-700 dark:hover:text-slate-200"
                      }`}
                    >
                      <span className="truncate">{g.name}</span>
                      <span className={`px-2 py-0.5 text-[9px] font-black rounded-md ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-850 text-slate-500 dark:text-slate-405"
                      }`}>
                        {g.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* УПРАВЛЕНИЕ */}
            <div className="space-y-2 pt-4 border-t border-slate-100/60">
              <p className="px-3 text-[9px] font-black text-slate-400/80 uppercase tracking-widest mb-3 leading-none">УПРАВЛЕНИЕ</p>
              <button
                onClick={() => {
                  setIsSettingsMode?.(true);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-300 group cursor-pointer text-left border ${
                  isSettingsMode 
                    ? "bg-slate-900 dark:bg-slate-800 border-slate-950 dark:border-slate-750 text-white font-extrabold shadow-sm shadow-slate-950/25" 
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <div className={`p-0.5 rounded transition-colors ${isSettingsMode ? "text-white" : "text-slate-400"}`}>
                  <Settings size={15} className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-45" />
                </div>
                <span className="font-bold text-[13px]">Настройки</span>
              </button>
            </div>

            {/* СТАТИСТИКА СОБЫТИЙ */}
            <div className="space-y-3 px-3 pt-4 border-t border-[#f1f5f9]">
              <p className="text-[9px] font-black text-slate-400/80 uppercase tracking-widest leading-none">СТАТИСТИКА СОБЫТИЙ</p>
              <div className="grid grid-cols-1 gap-2 bg-slate-50/50 dark:bg-slate-800/20 p-3 rounded-2xl border border-slate-100/60 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500">Всего</span>
                  <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded-md tabular-nums">
                    {notifications?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
                    <span className="text-[11px] font-bold text-slate-500">Новые</span>
                  </div>
                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded-md tabular-nums">
                    {notifications?.filter((n: any) => n.status === "новое").length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500">Важные</span>
                  <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded-md tabular-nums">
                    {notifications?.filter((n: any) => n.group === "Арбитраж" || n.group === "Сигналы").length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500">Группы</span>
                  <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded-md tabular-nums">
                    {new Set(notifications?.map((n: any) => n.group) || []).size}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500">Проверить</span>
                  <span className="text-[10px] font-black text-[#0098ea] dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-1.5 py-0.5 rounded-md tabular-nums">
                    {notifications?.filter((n: any) => n.status === "новое" && (n.group === "Сигналы" || n.group === "Арбитраж")).length || 0}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : activeTab === "Сканер" ? (
          <>
            {/* РЕЖИМ РАБОТЫ */}
            <div className="space-y-0.5 pt-2">
              <p className="px-3 text-[9px] font-black text-slate-400/80 uppercase tracking-widest mb-3 leading-none">Режим работы</p>
              
              {/* Button 1: Сигналы */}
              <button
                onClick={() => setScannerSubView?.("scanner")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-300 group cursor-pointer text-left text-xs font-bold leading-none ${
                  scannerSubView === "scanner"
                    ? "bg-blue-600 text-white font-extrabold shadow-md shadow-blue-500/20"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:text-slate-700 dark:hover:text-slate-250"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-0.5 rounded transition-colors ${scannerSubView === "scanner" ? "text-white" : "text-slate-400"}`}>
                    <Radio size={15} className="transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <span className="text-[13px]">Сигналы</span>
                </div>
                {scannerSubView === "scanner" && <ChevronRight size={14} />}
              </button>

              {/* Button 2: История сделок */}
              <button
                onClick={() => setScannerSubView?.("history")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-300 group cursor-pointer text-left text-xs font-bold leading-none mt-1 ${
                  scannerSubView === "history"
                    ? "bg-blue-600 text-white font-extrabold shadow-md shadow-blue-500/20"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-0.5 rounded transition-colors ${scannerSubView === "history" ? "text-white" : "text-slate-400"}`}>
                    <History size={15} className="transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <span className="text-[13px]">История</span>
                </div>
                {scannerSubView === "history" && <ChevronRight size={14} />}
              </button>
            </div>

            {/* Always visible trading summary metrics - styled beautiful & premium */}
            <div className="space-y-3 px-3 pt-4 border-t border-slate-100 dark:border-slate-850">
              <p className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Сводка по сделкам</p>
              
              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/[0.04] via-white dark:via-[#0c1424]/40 to-blue-500/[0.04] dark:from-emerald-500/[0.06] dark:to-blue-500/[0.05] border border-slate-200/50 dark:border-slate-800/60 p-3 rounded-2xl shadow-3xs hover:shadow-2xs transition-all duration-300">
                {/* Profit row with spark */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2.5">
                  <div className="flex flex-col">
                    <span className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Прибыль</span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight mt-0.5">
                      +$284.14
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Винрейт</span>
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 px-1.5 py-0.5 rounded-md text-[9px] mt-0.5 font-mono">
                      97.2%
                    </span>
                  </div>
                </div>

                {/* Counter metrics grid */}
                <div className="grid grid-cols-2 gap-2 pt-2.5">
                  <div className="flex flex-col p-2 bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100/50 dark:border-slate-850/40 rounded-xl">
                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">Успешно</span>
                    <span className="text-[12px] font-black text-slate-800 dark:text-slate-200 font-mono tracking-tight mt-1 leading-none">138</span>
                  </div>
                  <div className="flex flex-col p-2 bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100/50 dark:border-slate-850/40 rounded-xl">
                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider leading-none">Всего</span>
                    <span className="text-[12px] font-black text-slate-850 dark:text-slate-200 font-mono tracking-tight mt-1 leading-none">142</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-0.5 pt-2">
              <p className="px-3 text-[9px] font-black text-slate-400/80 uppercase tracking-widest mb-3 leading-none">Разделы</p>
              {navItems.filter(item => item.name !== "Сигналы").map((item) => (
                <button
                  id={`nav-item-${item.name.toLowerCase()}`}
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-300 group cursor-pointer ${
                    activeTab === item.name 
                       ? "bg-blue-600 text-white shadow-md shadow-blue-105/20" 
                       : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:text-slate-700 dark:hover:text-slate-250"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-0.5 rounded transition-colors ${activeTab === item.name ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`}>
                      {React.cloneElement(item.icon as React.ReactElement, { 
                        size: 16,
                        className: "transition-transform duration-300 group-hover:scale-110"
                      })}
                    </div>
                    <span className="font-bold text-[13px]">{item.name}</span>
                  </div>
                  {activeTab === item.name && (
                    <motion.div layoutId="active-indicator">
                      <ChevronRight size={14} />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Active Processes Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/40">
        {runningArbitrages && runningArbitrages.length > 0 ? (() => {
          const currentIndex = Math.min(activeArbIndex, runningArbitrages.length - 1);
          const normalizedIndex = Math.max(0, currentIndex);
          const arb = runningArbitrages[normalizedIndex];

          return (
            <div 
              onClick={() => onSelectRunningArbitrage?.(arb)}
              className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 rounded-2xl space-y-2 text-left relative overflow-hidden group select-none transition-all duration-200 cursor-pointer shadow-xs"
            >
              {/* Top Indicator & Navigation */}
              <div className="flex items-center justify-between gap-1">
                <span className={`text-[8px] font-black uppercase tracking-widest leading-none ${arb.isExecuting ? "text-indigo-600" : "text-emerald-600"}`}>
                  {arb.isExecuting ? "АРБИТРАЖ В ПРОЦЕССЕ" : "СДЕЛКА ИСПОЛНЕНА"}
                </span>
                
                <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  {/* Pager if multiple */}
                  {runningArbitrages.length > 1 && (
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/60 rounded-lg px-2 py-0.5 text-[9px] font-bold text-slate-500">
                      <button
                        onClick={() => {
                          setActiveArbIndex((prev) => (prev - 1 + runningArbitrages.length) % runningArbitrages.length);
                        }}
                        className="p-0.5 text-slate-400 hover:text-slate-800 transition-colors rounded hover:bg-slate-100 cursor-pointer flex items-center justify-center"
                        title="Назад"
                      >
                        <ChevronLeft size={10} className="stroke-[3.5]" />
                      </button>
                      <span className="text-[8.5px] font-extrabold whitespace-nowrap min-w-[24px] text-center select-none leading-none pt-[1px]">
                        {normalizedIndex + 1}/{runningArbitrages.length}
                      </span>
                      <button
                        onClick={() => {
                          setActiveArbIndex((prev) => (prev + 1) % runningArbitrages.length);
                        }}
                        className="p-0.5 text-slate-400 hover:text-slate-800 transition-colors rounded hover:bg-slate-100 cursor-pointer flex items-center justify-center"
                        title="Вперед"
                      >
                        <ChevronRight size={10} className="stroke-[3.5]" />
                      </button>
                    </div>
                  )}

                  {/* Clear button if completed */}
                  {!arb.isExecuting ? (
                    <button
                      onClick={() => {
                        const nextList = runningArbitrages.filter((a) => a.id !== arb.id);
                        setRunningArbitrages?.(nextList);
                        if (normalizedIndex >= nextList.length) {
                          setActiveArbIndex(Math.max(0, nextList.length - 1));
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Закрыть"
                    >
                      <X size={10} className="stroke-[3.5]" />
                    </button>
                  ) : (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                  )}
                </div>
              </div>

              {/* Signal Details */}
              <div className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11.5px] font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                    {arb.signal.pair}
                  </span>
                  <span className={`text-[9.5px] font-bold font-mono ${parseFloat(arb.signal.spread) >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                    {arb.signal.spread}
                  </span>
                </div>
                <p className="text-[9px] text-slate-400 font-bold uppercase truncate leading-none">
                  {arb.signal.buyDex} → {arb.signal.sellDex}
                </p>
              </div>

              {/* Current step desc */}
              <div className="pt-0.5">
                <p className="text-[10px] font-semibold text-slate-600 truncate leading-tight">
                  {(() => {
                    const step = arb.executionStep;
                    if (step === 0) return "Ожидание запуска...";
                    if (step === 1) return "1/6: Выставление ордера на покупку";
                    if (step === 2) return "2/6: Исполнение ордера на покупку";
                    if (step === 3) return "3/6: Перевод токена по сети";
                    if (step === 4) return "4/6: Зачисление токенов";
                    if (step === 5) return "5/6: Выставление ордера на продажу";
                    if (step === 6) return "6/6: Исполнение ордера на продажу";
                    return "Сделка успешно завершена!";
                  })()}
                </p>
              </div>

              {/* Step mini representation with 6 segments */}
              <div className="flex gap-1 pt-1.5">
                {[1, 2, 3, 4, 5, 6].map((st) => {
                  const isCompleted = arb.executionStep > st || (!arb.isExecuting && arb.executionStep === 7);
                  const isActive = arb.isExecuting && arb.executionStep === st;
                  return (
                    <div 
                      key={st}
                      className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                        isCompleted 
                          ? "bg-emerald-500" 
                          : isActive 
                            ? "bg-indigo-500 animate-pulse" 
                            : "bg-slate-100"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })() : (
          <div className="p-3 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Процессы</span>
              <div className="flex gap-0.5">
                <div className="w-0.5 h-2 rounded-full bg-slate-200" />
                <div className="w-0.5 h-2 rounded-full bg-slate-300 animate-pulse" />
                <div className="w-0.5 h-2 rounded-full bg-slate-200" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-500 leading-tight truncate">Нет активных сделок</p>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
