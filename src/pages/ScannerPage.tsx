import React, { useState } from "react";
import { Zap, ChevronRight, X, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { Signal, containerVariants, itemVariants } from "../types";

export function RouteStep({ icon, name, price, highlight = false }: { icon: string, name: string, price: string, highlight?: boolean }) {
  return (
    <div className="text-center shrink-0 min-w-[70px]">
      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center font-black mb-2 mx-auto ${highlight ? "bg-white border-rose-100 text-rose-500 shadow-sm" : "bg-white border-slate-100 text-emerald-500 shadow-sm"}`}>{icon}</div>
      <p className={`text-[10px] font-black tracking-tight leading-none ${highlight ? "text-rose-500" : "text-emerald-500"}`}>{name}</p>
      <p className="text-[9px] font-bold text-slate-400 mt-1 tabular-nums">{price}</p>
    </div>
  );
}

export function ActionStep({ number, title, desc, className = "" }: { number: number, title: string, desc: string, className?: string }) {
  return (
    <div className="flex gap-4 group">
       <div className="shrink-0 w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">{number}</div>
       <div className="py-1">
         <p className={`text-sm font-black tracking-tight leading-none mb-1.5 ${className || "text-slate-900"}`}>{title}</p>
         <p className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors tracking-tight">{desc}</p>
       </div>
    </div>
  );
}

export function ParamRow({ label, value, color = "text-slate-800" }: { label: string, value: string, color?: string }) {
  return (
    <div className="flex items-center justify-between py-0.5">
       <span className="text-[11px] font-bold text-slate-400">{label}</span>
       <span className={`text-[11px] font-black tracking-tight ${color}`}>{value}</span>
    </div>
  );
}

export function DrawerStat({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-center">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-sm font-black tabular-nums transition-colors ${color}`}>{value}</p>
    </div>
  );
}

export function SignalDrawer({ signal, onClose }: { signal: Signal, onClose: () => void }) {
  const [amount, setAmount] = useState("12.00");
  const [confirmed, setConfirmed] = useState(false);

  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl border-l border-slate-100 flex flex-col"
    >
      <div className="p-5 sm:p-6 border-b border-slate-50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100 uppercase font-black text-[10px]">
             {signal.pair.split('/')[0]}
           </div>
           <div>
             <div className="flex items-center gap-2">
               <h2 className="text-lg font-black text-slate-900 tracking-tight">{signal.pair}</h2>
               <div className="px-1.5 py-0.5 bg-emerald-100 text-emerald-600 rounded text-[8px] font-black uppercase tracking-widest">LIVE</div>
             </div>
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none">HTX → ETHW → MEXC</span>
           </div>
        </div>
        <button onClick={onClose} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
          <X size={18} className="text-slate-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
             <span className="text-[9px] font-black text-rose-500 border border-rose-100 px-1.5 py-0.5 rounded bg-rose-50/50 uppercase tracking-widest">НЕ ЗАПУСКАТЬ</span>
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 leading-tight">Сигнал не пройдет фильтры</h3>
            <p className="text-xs text-slate-500 font-bold mt-1">Отрицательный спред — профит уйдет на комиссии.</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <DrawerStat label="СПРЕД" value={signal.spread} color={signal.type === 'profit' ? "text-emerald-500" : "text-rose-500"} />
          <DrawerStat label="ПРОФИТ" value={signal.profit} color={signal.type === 'profit' ? "text-emerald-500" : "text-rose-500"} />
          <DrawerStat label="ROI" value="+1.04%" color="text-emerald-500" />
        </div>

        <div className="space-y-4">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">МАРШРУТ АРБИТРАЖА</p>
           <div className="flex items-center gap-4 p-6 bg-slate-50/50 rounded-[32px] border border-slate-100 overflow-x-auto">
              <RouteStep icon="HTX" name="0.3225" price="Покупка" />
              <div className="flex-1 h-px bg-slate-200 relative min-w-[20px]">
                <ChevronRight size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300" />
              </div>
              <RouteStep icon="ETHW" name="fee $0.0001" price="~30c" highlight />
              <div className="flex-1 h-px bg-slate-200 relative min-w-[20px]">
                <ChevronRight size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300" />
              </div>
              <RouteStep icon="MEXC" name="0.3179" price="Продажа" />
           </div>
        </div>

        <div className="space-y-4">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ЦЕНЫ ПЕРЕД ЗАПУСКОМ</p>
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400">Цена покупки</span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm font-black text-slate-700 tabular-nums">0.02826</div>
             </div>
             <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400">Цена продажи</span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm font-black text-slate-700 tabular-nums">0.02827</div>
             </div>
           </div>
        </div>

        <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">СУММА</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Баланс:</span>
                <span className="text-[10px] font-black text-slate-800 tracking-tight">11.72 USDT</span>
              </div>
            </div>
            <div className="relative group">
              <input 
                type="text" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] text-xl font-black text-slate-900 tabular-nums focus:bg-white focus:border-blue-500 transition-all outline-none"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 underline decoration-slate-200 underline-offset-4">USDT</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['25%', '50%', '75%', 'MAX'].map(p => (
                <button key={p} className="py-2.5 rounded-xl border border-slate-100 text-[10px] font-black text-slate-400 hover:bg-slate-50 hover:text-slate-800 transition-all uppercase tracking-widest">
                  {p}
                </button>
              ))}
            </div>
            <div className="flex justify-end">
               <span className="text-[10px] font-black text-rose-500 tracking-tight">- $0.20 USDT</span>
            </div>
        </div>

        <div className="space-y-6">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ЧТО ПРОИЗОЙДЕТ <span className="float-right lowercase font-bold text-[9px]">~70с</span></p>
           <div className="space-y-2">
             <ActionStep number={1} title={`Покупка на HTX`} desc="12.00 USDT → 424.63 ETHW · ~5с" />
             <ActionStep number={2} title={`Вывод по сети ETHW`} desc="fee $0.0001 · ~38с" />
             <ActionStep number={3} title={`Зачисление на MEXC`} desc="мин. 0.361 ETHW · ~38с" />
             <ActionStep number={4} title={`Продажа на MEXC`} desc="424.63 ETHW → +12.0042 USDT · ~5с" className="text-emerald-500" />
           </div>
           
           <div className="flex items-center justify-between pt-4 border-t border-slate-50">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Комиссии бирж (taker x 2)</span>
             <span className="text-[10px] font-black text-slate-800 tracking-tight">0.0120 USDT = 0.20%</span>
           </div>
        </div>

        <div className="space-y-4">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ПАРАМЕТРЫ</p>
           <div className="space-y-3 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
             <ParamRow label="Ликвидность" value="СРЕДНЯЯ" color="text-rose-500" />
             <ParamRow label="Signal ID" value="591b542e" />
             <ParamRow label="Сеть" value="ETHW" />
             <ParamRow label="Мин. вывод" value="5 ETHW" />
             <ParamRow label="Комиссия сети" value="$0.0001" color="text-rose-500" />
           </div>
           
           <button className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-[20px] text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2">
             Полный анализ <ExternalLink size={14} />
           </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 border-t border-slate-50 bg-white shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.05)]">
         <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col gap-4 mb-6">
           <div className="flex gap-4">
              <input 
                type="checkbox" 
                id="confirm-signal"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="w-5 h-5 mt-0.5 cursor-pointer rounded-lg border-slate-200 accent-emerald-500"
              />
              <label htmlFor="confirm-signal" className="text-xs font-bold text-slate-500 leading-relaxed cursor-pointer select-none">
                Я ознакомлен с условиями арбитражной сделки, понимаю риски и даю согласие на автоматическое выполнение всех шагов.
              </label>
           </div>
         </div>

         <button 
           disabled={!confirmed}
           className={`w-full py-5 rounded-[24px] font-black text-sm uppercase tracking-tight shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
             confirmed ? "bg-emerald-500 text-white shadow-emerald-100 hover:bg-emerald-600" : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
           }`}
         >
            <Zap size={20} />
            Запустить арбитраж
         </button>
      </div>
    </motion.div>
  );
}

export function ScannerPage({ onSelectSignal, isScannerRunning }: { onSelectSignal: (signal: Signal) => void, isScannerRunning: boolean, key?: React.Key }) {
  const [activeFilter, setActiveFilter] = useState("Все");
  const filters = ["Все", "Свежие", "К запуску", "Прибыльные", "Риск"];

  const mockSignals: Signal[] = [
    { id: 1, pair: "BER/USDT", network: "BERA", spread: "+0.44%", profit: "+$0.53", buyPrice: "0.02826", sellPrice: "0.02827", buyDex: "HTX", sellDex: "BITGET", status: "К запуску", type: "profit" },
    { id: 2, pair: "ETHW/USDT", network: "ETHW", spread: "-1.22%", profit: "-$0.20", buyPrice: "0.3225", sellPrice: "0.3179", buyDex: "HTX", sellDex: "MEXC", status: "Риск", type: "risk" }
  ];

  const filteredSignals = activeFilter === "Все" ? mockSignals : mockSignals.filter(s => s.status === activeFilter || s.type === (activeFilter === "Прибыльные" ? "profit" : "risk"));

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-5 sm:p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6 w-full"
    >
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-500 ${isScannerRunning ? "bg-emerald-500 shadow-emerald-100 scale-105" : "bg-slate-300 shadow-slate-100"}`}>
             <Zap size={22} className={isScannerRunning ? "animate-pulse" : ""} />
           </div>
           <div>
             <h1 className="text-xl font-black tracking-tight text-slate-900 leading-tight">Сканер Арбитража</h1>
             <div className="flex items-center gap-1.5 mt-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isScannerRunning ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isScannerRunning ? "Активен" : "Неактивен"}</span>
             </div>
           </div>
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/60 shadow-sm overflow-x-auto">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all whitespace-nowrap ${
                activeFilter === f ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-3">
        {filteredSignals.map(signal => (
          <motion.div 
            key={signal.id}
            variants={itemVariants}
            className="group bg-white p-4 sm:p-5 rounded-[24px] border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-blue-200/20 transition-all cursor-pointer flex flex-col xl:flex-row xl:items-center gap-5 xl:gap-0"
            onClick={() => onSelectSignal(signal)}
          >
            <div className="xl:w-[200px] min-w-0">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-900 font-black text-[10px] border border-slate-100 shadow-inner shrink-0">{signal.pair.split('/')[0]}</div>
                 <div className="min-w-0">
                   <h3 className="text-sm font-black text-slate-900 tracking-tight leading-none truncate">{signal.pair}</h3>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mt-1 truncate">{signal.network}</span>
                 </div>
               </div>
            </div>

            <div className="xl:w-[250px] px-0 xl:px-4">
               <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase">СПРЕД</span>
                    <span className={`text-[12px] font-black tabular-nums transition-colors ${signal.type === 'profit' ? "text-emerald-500" : "text-rose-500"}`}>{signal.spread}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "80%" }}
                      className={`h-full rounded-full ${signal.type === 'profit' ? "bg-emerald-500" : "bg-rose-500"}`} 
                    />
                  </div>
               </div>
            </div>

            <div className="xl:flex-1 flex flex-col items-center">
               <div className="flex items-center gap-5">
                  <div className="text-center">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">BUY</p>
                    <p className="text-[10px] font-black text-blue-600 tracking-tight">{signal.buyDex}</p>
                    <p className="text-[10px] font-bold text-slate-900 tabular-nums">{signal.buyPrice}</p>
                  </div>
                  <ChevronRight size={12} className="text-slate-300" />
                  <div className="text-center">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">SELL</p>
                    <p className="text-[10px] font-black text-blue-600 tracking-tight">{signal.sellDex}</p>
                    <p className="text-[10px] font-bold text-slate-900 tabular-nums">{signal.sellPrice}</p>
                  </div>
               </div>
            </div>

            <div className="xl:w-[150px] text-center xl:text-right px-4">
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">PROFIT</p>
               <p className={`text-base font-black tabular-nums leading-none ${signal.type === 'profit' ? "text-emerald-500" : "text-rose-500"}`}>{signal.profit}</p>
            </div>

            <div className="shrink-0">
               <button className="w-full xl:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-1.5">
                 ОТКРЫТЬ
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
