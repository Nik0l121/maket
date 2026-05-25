import React from "react";
import { LogOut, ChevronRight, Activity, ShieldCheck, Key, CreditCard, Radio } from "lucide-react";
import { motion } from "motion/react";
import { NavItem } from "../types";

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
}

export function Sidebar({
  isSidebarOpen,
  navItems,
  activeTab,
  setActiveTab,
  setIsSidebarOpen,
  isScannerTab,
  isScannerRunning,
  setIsScannerRunning
}: SidebarProps) {
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
        fixed lg:relative z-40 h-[calc(100vh-64px)] flex-shrink-0 bg-white border-r border-slate-200/60 overflow-hidden flex flex-col shadow-xl lg:shadow-none
        ${isSidebarOpen ? "w-[240px]" : "w-0"}
      `}
    >
      {/* Search/Scanner Status */}
      {isScannerTab && (
        <div className="p-5 border-b border-slate-50 space-y-4">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className={`absolute inset-0 bg-blue-50/50 rounded-full animate-ping opacity-20 ${isScannerRunning ? "block" : "hidden"}`} />
              <div className={`absolute inset-1.5 border border-dashed border-blue-200 rounded-full animate-[spin_10s_linear_infinite] ${isScannerRunning ? "block" : "hidden"}`} />
              <div className="absolute inset-4 border border-blue-100 rounded-full" />
              <div className="relative flex flex-col items-center gap-0.5">
                <span className={`text-[8px] font-black uppercase tracking-widest ${isScannerRunning ? "text-emerald-500" : "text-slate-400"}`}>
                  {isScannerRunning ? "Active" : "Standby"}
                </span>
                <Activity size={18} className={isScannerRunning ? "text-emerald-500 animate-pulse" : "text-slate-300"} />
              </div>
            </div>
            <button 
              onClick={() => setIsScannerRunning?.(!isScannerRunning)}
              className={`mt-3 w-full py-3 rounded-xl font-black text-xs tracking-tight transition-all active:scale-95 shadow-lg ${
                isScannerRunning 
                   ? "bg-rose-500 text-white shadow-rose-100 hover:bg-rose-600" 
                   : "bg-emerald-500 text-white shadow-emerald-100 hover:bg-emerald-600"
              }`}
            >
              {isScannerRunning ? "ОСТАНОВИТЬ" : "ЗАПУСТИТЬ"}
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {isScannerTab && (
          <div className="space-y-3 px-3 pb-2">
             <p className="text-[9px] font-black text-slate-400/80 uppercase tracking-widest leading-none">Сессия</p>
             <div className="grid grid-cols-1 gap-1.5">
               <SessionStat label="Найдено" value="12" />
               <SessionStat label="Очередь" value="1" color="text-blue-600" />
               <SessionStat label="Мин. спред" value="-1.22%" />
               <SessionStat label="Макс. спред" value="+0.44%" color="text-emerald-500" />
             </div>
          </div>
        )}

        <div className="space-y-0.5 pt-2">
          <p className="px-3 text-[9px] font-black text-slate-400/80 uppercase tracking-widest mb-3 leading-none">Разделы</p>
          {navItems.map((item) => (
            <button
              id={`nav-item-${item.name.toLowerCase()}`}
              key={item.name}
              onClick={() => {
                setActiveTab(item.name);
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-300 group ${
                activeTab === item.name 
                   ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                   : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-0.5 rounded transition-colors ${activeTab === item.name ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`}>
                  {React.cloneElement(item.icon as React.ReactElement, { size: 16 })}
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

        {/* Account metrics block inside public sidebar */}
        <div className="space-y-3 px-3 pt-4 border-t border-slate-100/60">
          <p className="text-[9px] font-black text-slate-400/80 uppercase tracking-widest leading-none">Аккаунт</p>
          <div className="grid grid-cols-1 gap-2 bg-slate-50/50 p-3 rounded-2xl border border-slate-100/60 transition-all hover:bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                <span className="text-[11px] font-bold text-slate-500">Защита</span>
              </div>
              <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md tabular-nums">94/100</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key size={14} className="text-blue-500 shrink-0" />
                <span className="text-[11px] font-bold text-slate-500">API-ключи</span>
              </div>
              <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md tabular-nums">4 активных</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard size={14} className="text-emerald-500 shrink-0" />
                <span className="text-[11px] font-bold text-slate-500">Подписка</span>
              </div>
              <span className="text-[11px] font-black text-slate-800 tabular-nums">PRO до 24.06</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio size={14} className="text-blue-500 shrink-0" />
                <span className="text-[11px] font-bold text-slate-500">Сессии</span>
              </div>
              <span className="text-[11px] font-black text-slate-800 tabular-nums">3 онлайн</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Processes Footer */}
      <div className="p-4 border-t border-slate-50 bg-slate-50/20">
        <div className="p-3 bg-white rounded-2xl border border-slate-100 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Процессы</span>
            <div className="flex gap-0.5">
              <div className="w-0.5 h-2 rounded-full bg-slate-200" />
              <div className="w-0.5 h-2 rounded-full bg-slate-300 animate-pulse" />
              <div className="w-0.5 h-2 rounded-full bg-slate-200" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-500 leading-tight truncate">Нет активных лимитов</p>
        </div>
        
        <button id="logout-button" className="w-full mt-3 py-2 flex items-center justify-center gap-2 text-slate-400 hover:text-rose-500 transition-colors font-bold text-[10px] group">
          <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
          Выйти из системы
        </button>
      </div>
    </motion.aside>
  );
}
