import React from "react";
import { motion } from "motion/react";

export function StatItem({ label, value, color, icon }: { label: string, value: string, color: string, icon: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-[100px]">
      <span className="text-[9px] font-black text-slate-400 tracking-[0.15em] uppercase">{label}</span>
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-slate-50/50">{icon}</div>
        <span className={`font-black text-base ${color} tabular-nums tracking-tighter`}>{value}</span>
      </div>
    </div>
  );
}

export function SectionCard({ title, children, icon, action }: { title: string, children: React.ReactNode, icon?: React.ReactNode, action?: React.ReactNode }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[24px] sm:rounded-[32px] border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.01)] overflow-hidden hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.03)] transition-all duration-700 h-full"
    >
      <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-white rounded-lg sm:rounded-xl shadow-sm border border-slate-100">{icon}</div>
          <h3 className="font-black text-slate-800 uppercase tracking-[0.15em] text-[9px] sm:text-[10px]">{title}</h3>
        </div>
        {action}
      </div>
      <div className={`${title === 'Аватар' ? 'p-5 sm:p-6' : 'p-6 sm:p-8 lg:p-10'}`}>
        {children}
      </div>
    </motion.div>
  );
}

export function InputField({ label, value, onChange, type = "text", placeholder }: { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, placeholder?: string }) {
  return (
    <div className="space-y-2.5 group">
      <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] group-focus-within:text-blue-600 transition-colors uppercase ml-1">
        {label}
      </label>
      <div className="relative">
        <input 
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-5 sm:px-6 py-3 sm:py-3.5 bg-slate-50/80 border border-slate-200 rounded-[14px] sm:rounded-[16px] text-slate-900 font-bold text-sm sm:text-base focus:ring-[6px] focus:ring-blue-50 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-300 placeholder:font-bold tracking-tight"
        />
      </div>
    </div>
  );
}

export function ReadOnlyField({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-1.5 p-4 bg-slate-50/80 rounded-[20px] border border-slate-100 group hover:border-slate-300 hover:bg-white hover:shadow-lg hover:shadow-slate-200/20 transition-all duration-500 cursor-default">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] transition-colors group-hover:text-slate-500">{label}</span>
      <span className="font-mono text-base text-slate-800 font-black group-hover:text-blue-600 transition-colors tracking-tight">{value}</span>
    </div>
  );
}

export function ActionButton({ icon, label, primary = false }: { icon: React.ReactNode, label: string, primary?: boolean }) {
  return (
    <button title={label} className={`
      p-3.5 rounded-[18px] shadow-xl flex items-center justify-center transition-all active:scale-90 hover:-translate-y-1
      ${primary 
        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200" 
        : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100 shadow-slate-200"}
    `}>
      {icon}
    </button>
  );
}
