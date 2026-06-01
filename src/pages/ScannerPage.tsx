import React, { useState, useEffect } from "react";
import { 
  Play, 
  Square, 
  Sliders, 
  Info, 
  Activity,
  Search,
  Zap,
  ChevronRight,
  RefreshCw,
  X,
  Lock,
  ArrowUpRight,
  Clock,
  Coins,
  ArrowRightLeft,
  Settings,
  TrendingUp,
  Award,
  Check,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Signal, containerVariants } from "../types";
import { useToast } from "../components/Toast";

// --- Signal Drawer Component ---
export function SignalDrawer({ 
  signal, 
  onClose,
  runningArbitrages = [],
  setRunningArbitrages
}: { 
  signal: Signal; 
  onClose: () => void;
  runningArbitrages?: any[];
  setRunningArbitrages?: (arbs: any) => void;
}) {
  const { showToast } = useToast();
  const [activeDrawerTab, setActiveDrawerTab] = useState<"launch" | "decision">("launch");
  
  // Input fields loaded with signal defaults
  const [buyPriceInput, setBuyPriceInput] = useState<string>(signal.buyPrice);
  const [sellPriceInput, setSellPriceInput] = useState<string>(signal.sellPrice);
  const [sumInput, setSumInput] = useState<string>("12.00");
  
  // State for balance
  const [balance, setBalance] = useState<number>(11.72);
  
  // Execution states derived from global runningArbitrages
  const thisArb = runningArbitrages.find((arb: any) => arb.signal.id === signal.id);
  const isThisSignalRunning = !!thisArb;
  const isExecuting = isThisSignalRunning && thisArb.isExecuting;
  const executionStep = isThisSignalRunning ? thisArb.executionStep : 0;
  
  const [confirmed, setConfirmed] = useState<boolean>(false);

  // Sync state if signal changes
  useEffect(() => {
    setBuyPriceInput(signal.buyPrice);
    setSellPriceInput(signal.sellPrice);
    setSumInput("12.00");
    setConfirmed(false);
  }, [signal]);

  const baseToken = signal.pair.split("/")[0] || "TOK";
  const quoteToken = signal.pair.split("/")[1] || "USDT";

  // Fee factors based on current network
  const networkFee = signal.network === "BERA" ? 0.0001 : signal.network === "SOLANA" ? 0.0005 : signal.network === "ETHW" ? 0.02 : 0.001;
  const parsedBuy = parseFloat(buyPriceInput) || 0.0001;
  const parsedSell = parseFloat(sellPriceInput) || 0.0001;
  const parsedSum = parseFloat(sumInput) || 0;

  // Real-time calculations
  const takerBuy = parsedSum * 0.001;
  const tokensBought = parsedSum > 0 ? parsedSum / parsedBuy : 0;
  const takerSell = tokensBought * parsedSell * 0.001;
  const totalTakerFees = takerBuy + takerSell;
  
  const spreadPct = parsedBuy > 0 ? ((parsedSell - parsedBuy) / parsedBuy) * 100 : 0.44;
  const grossReturn = tokensBought * parsedSell;
  const netCapitalProfit = grossReturn - parsedSum;
  const netProfit = parsedSum > 0 ? netCapitalProfit - totalTakerFees - networkFee : 0.53;
  const roiPct = parsedSum > 0 ? (netProfit / parsedSum) * 100 : 0.37;

  // Format functions
  const isPositive = netProfit >= 0;

  const handlePercentClick = (pct: number) => {
    setSumInput((balance * pct).toFixed(2));
  };

  const handleExecuteArbitrage = () => {
    if (!confirmed) {
      showToast("Пожалуйста, подтвердите согласие с рисками перед запуском", "error");
      return;
    }

    if (runningArbitrages.some((arb: any) => arb.signal.id === signal.id && arb.isExecuting)) {
      showToast(`Уже запущен арбитражный процесс по ${signal.pair}`, "error", "Ошибка запуска");
      return;
    }

    const processId = `${signal.id}-${Date.now()}`;

    // Initialize globally running arbitrage
    const initialArb = {
      id: processId,
      signal,
      executionStep: 1,
      isExecuting: true,
      sumInput,
      netProfit,
    };
    setRunningArbitrages?.((prev: any[]) => [...prev, initialArb]);

    // Progress through 6 steps (total ~7.5 seconds)
    setTimeout(() => {
      setRunningArbitrages?.((prev: any[]) => prev.map((arb) => arb.id === processId ? { ...arb, executionStep: 2 } : arb));
    }, 1250);

    setTimeout(() => {
      setRunningArbitrages?.((prev: any[]) => prev.map((arb) => arb.id === processId ? { ...arb, executionStep: 3 } : arb));
    }, 2500);

    setTimeout(() => {
      setRunningArbitrages?.((prev: any[]) => prev.map((arb) => arb.id === processId ? { ...arb, executionStep: 4 } : arb));
    }, 3750);

    setTimeout(() => {
      setRunningArbitrages?.((prev: any[]) => prev.map((arb) => arb.id === processId ? { ...arb, executionStep: 5 } : arb));
    }, 5000);

    setTimeout(() => {
      setRunningArbitrages?.((prev: any[]) => prev.map((arb) => arb.id === processId ? { ...arb, executionStep: 6 } : arb));
    }, 6250);

    setTimeout(() => {
      setRunningArbitrages?.((prev: any[]) => prev.map((arb) => arb.id === processId ? { ...arb, executionStep: 7, isExecuting: false } : arb));
      
      // Update balance & show completion notification
      if (netProfit > 0) {
        setBalance(prev => prev + netProfit);
        showToast(`Прибыль ${netProfit.toFixed(4)} USDT успешно зачислена на баланс.`, "success", "Сделка завершена");
      } else {
        showToast(`Ордер закрыт. Итоговый результат: ${netProfit.toFixed(4)} USDT`, "info", "Ордер выполнен");
      }
    }, 7500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/35 backdrop-blur-xs"
      />

      {/* Drawer Panel */}
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 240 }}
        className="relative w-full max-w-[480px] h-full bg-white shadow-2xl flex flex-col z-10 border-l border-slate-100/85"
      >
        {/* Header Section */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center justify-center font-black text-xs font-mono">
              {baseToken}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-nowrap">
                <span className="text-base font-black text-slate-900 tracking-tight">{signal.pair}</span>
                <span className="text-[9.5px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200/50 rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse inline-block" />
                  LIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase max-w-[280px] truncate leading-tight">
                {signal.buyDex} → {signal.network} → {signal.sellDex} - #{signal.id}sh49aa
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Custom Tab Selection Header */}
        <div className="px-5 pt-3 border-b border-slate-100 bg-white flex gap-4 text-xs font-bold font-sans">
          <button
            type="button"
            onClick={() => setActiveDrawerTab("launch")}
            className={`pb-2.5 transition-all text-left relative ${
              activeDrawerTab === "launch" 
                ? "text-blue-600 font-extrabold border-b-2 border-blue-600" 
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            К ЗАПУСКУ
          </button>
          <button
            type="button"
            disabled={isExecuting}
            onClick={() => setActiveDrawerTab("decision")}
            className={`pb-2.5 transition-all text-left relative ${
              activeDrawerTab === "decision" 
                ? "text-blue-600 font-extrabold border-b-2 border-blue-600" 
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            РЕШЕНИЕ
          </button>
        </div>

        {/* Scrollable Drawer Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          <AnimatePresence mode="wait">
            {activeDrawerTab === "launch" ? (
              <motion.div
                key="launch_panel"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                {/* Intro status alert card heading */}
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-850">Профит уверенный — можно запускать</h3>
                  <p className="text-[11px] text-slate-400 font-bold leading-normal">
                    Все проверки пройдены, спред живой, комиссия минимальная.
                  </p>
                </div>

                {/* 3 Columns Metrics (СПРЕД / ПРОФИТ / ROI) */}
                <div className="grid grid-cols-3 gap-2 py-3 bg-slate-50/60 border border-slate-100 rounded-2xl px-3.5">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block text-left">Спред</span>
                    <span className={`text-base font-black font-mono block text-left ${spreadPct >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                      {spreadPct >= 0 ? "+" : ""}{spreadPct.toFixed(2)}%
                    </span>
                  </div>
                  <div className="space-y-0.5 border-l border-slate-200/50 pl-3">
                    <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block text-left">Профит</span>
                    <span className={`text-base font-black font-mono block text-left ${netProfit >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                      {netProfit >= 0 ? "+" : ""}${netProfit.toFixed(2)}
                    </span>
                  </div>
                  <div className="space-y-0.5 border-l border-slate-200/50 pl-3">
                    <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block text-left">ROI</span>
                    <span className={`text-base font-black font-mono block text-left ${roiPct >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                      {roiPct >= 0 ? "+" : ""}{roiPct.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Route Diagram Map Panel */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase pl-1 block">Маршрут</span>
                  <div className="grid grid-cols-11 gap-1 items-center bg-white border border-slate-200 rounded-2xl p-3.5">
                    
                    {/* Source DEX */}
                    <div className="col-span-3 flex flex-col justify-center items-center text-center space-y-0.5">
                      <span className="text-[10px] font-black text-emerald-500 font-mono uppercase bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-md">
                        {signal.buyDex}
                      </span>
                      <span className="font-mono font-bold text-[10px] text-slate-800 pt-1">
                        {buyPriceInput}
                      </span>
                      <span className="text-[8.5px] font-bold text-slate-400 block uppercase">Покупка</span>
                    </div>

                    {/* Bridge Arrow */}
                    <div className="col-span-1 flex justify-center text-slate-350">
                      →
                    </div>

                    {/* Network details */}
                    <div className="col-span-3 flex flex-col justify-center items-center text-center space-y-0.5">
                      <span className="text-[9.5px] font-black text-slate-800 font-sans tracking-wide">
                        {signal.network}
                      </span>
                      <span className="text-[8.5px] font-mono font-bold text-slate-400">
                        fee ${networkFee.toFixed(4)}
                      </span>
                      <span className="text-[8.5px] font-bold text-slate-400 block uppercase">~30c</span>
                    </div>

                    {/* Bridge Arrow */}
                    <div className="col-span-1 flex justify-center text-slate-350">
                      →
                    </div>

                    {/* Destination DEX */}
                    <div className="col-span-3 flex flex-col justify-center items-center text-center space-y-0.5">
                      <span className="text-[10px] font-black text-blue-600 font-mono uppercase bg-blue-50 border border-blue-100/50 px-2 py-0.5 rounded-md">
                        {signal.sellDex}
                      </span>
                      <span className="font-mono font-bold text-[10px] text-slate-800 pt-1">
                        {sellPriceInput}
                      </span>
                      <span className="text-[8.5px] font-bold text-slate-400 block uppercase">Продажа</span>
                    </div>

                  </div>
                </div>

                {/* Important notice block below route */}
                <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-2xl flex items-start gap-2.5 text-[10.5px] text-amber-800 leading-relaxed font-sans">
                  <AlertTriangle size={15} className="mt-0.5 flex-shrink-0 text-amber-600" />
                  <p className="font-semibold text-left">
                    <span className="font-black text-amber-900 block mb-0.5">Важно:</span>
                    перед выводом на <span className="font-black text-slate-800">{signal.sellDex}</span> нужно один раз подтвердить адрес кошелька депозита в настройках белого списка в личном кабинете.
                  </p>
                </div>

                {/* Price setup module (editable Buy & Sell rates) */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase pl-1 block">Цены перед запуском</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block">Цена покупки ({signal.buyDex})</label>
                      <input 
                        type="text" 
                        disabled={isExecuting}
                        value={buyPriceInput}
                        onChange={(e) => setBuyPriceInput(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-800 font-mono focus:outline-none focus:bg-white focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 block">Цена продажи ({signal.sellDex})</label>
                      <input 
                        type="text" 
                        disabled={isExecuting}
                        value={sellPriceInput}
                        onChange={(e) => setSellPriceInput(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-800 font-mono focus:outline-none focus:bg-white focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* SUM INPUT BOX MODULE with balance and preset percentages */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center px-1 text-[10.5px] font-bold">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Сумма ордера</span>
                    <span className="text-slate-500">
                      Баланс: <span className="font-black text-slate-805">{balance.toFixed(2)} USDT</span>
                    </span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between gap-1">
                      <input 
                        type="text"
                        disabled={isExecuting}
                        value={sumInput}
                        onChange={(e) => setSumInput(e.target.value)}
                        className="bg-transparent border-0 p-0 text-xl font-black text-slate-800 focus:ring-0 focus:outline-none w-[60%] font-mono"
                        placeholder="12.00"
                      />
                      <div className="flex flex-col items-end flex-shrink-0">
                        <span className="text-sm font-black text-slate-500 font-mono">{quoteToken}</span>
                        {parsedSum > 0 && (
                          <span className="text-[10.5px] font-black text-rose-500 font-mono mt-0.5">
                            → -{totalTakerFees.toFixed(3)} USDT
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Percentage buttons */}
                    <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-200/40">
                      {[0.25, 0.50, 0.75, 1.0].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          disabled={isExecuting}
                          onClick={() => handlePercentClick(pct)}
                          className="py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-[10px] font-black text-slate-500 hover:text-slate-800 active:scale-95 transition-all text-center uppercase"
                        >
                          {pct === 1.0 ? "MAX" : `${pct * 100}%`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Simulated Steps Animation block "ЧТО ПРОИЗОЙДЕТ" */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Что произойдет</span>
                    <span className="font-mono text-[9px] lowercase">~70c</span>
                  </div>

                  {/* Vertically chained sequence */}
                  <div className="border border-slate-200 rounded-2xl p-4 bg-white/50 space-y-3.5 relative overflow-hidden text-left">
                    
                    {/* Top Balance Banner */}
                    <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200/50 text-emerald-600 font-sans text-[11px] font-extrabold">
                      <Check size={13} className="stroke-[3] text-emerald-500" />
                      <span>Баланс подтверждён · {balance.toFixed(2)} USDT</span>
                    </div>

                    {/* Step-by-Step rendering */}
                    {(() => {
                      const steps = [
                        { id: 1, text: `Выставление ордера на покупку (${signal.buyDex})` },
                        { id: 2, text: `Исполнение ордера на покупку (${signal.buyDex})` },
                        { id: 3, text: `Перевод токена по сети ${signal.network}` },
                        { id: 4, text: `Зачисление токенов на ${signal.sellDex}` },
                        { id: 5, text: `Выставление ордера на продажу (${signal.sellDex})` },
                        { id: 6, text: `Исполнение ордера на продажу (${signal.sellDex})` }
                      ];

                      return steps.map((st) => {
                        const isCompleted = executionStep > st.id || (!isExecuting && executionStep === 7);
                        const isActive = isExecuting && executionStep === st.id;
                        const isPending = !isCompleted && !isActive;

                        return (
                          <div key={st.id} className="flex items-center gap-3 relative z-10">
                            {/* Icon Indicator */}
                            {isCompleted ? (
                              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-4xs">
                                <Check size={11} className="stroke-[3]" />
                              </div>
                            ) : isActive ? (
                              <div className="relative w-5 h-5 flex items-center justify-center flex-shrink-0">
                                <div className="absolute inset-0 rounded-full border-2 border-indigo-100" />
                                <div className="absolute inset-0 rounded-full border-2 border-t-indigo-500 border-r-indigo-500 animate-spin" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-slate-100 bg-slate-50/60 flex-shrink-0" />
                            )}

                            {/* Text label */}
                            <span className={`text-[11px] transition-all duration-200 ${
                              isActive 
                                ? "text-slate-900 font-extrabold" 
                                : isCompleted 
                                  ? "text-slate-800 font-medium" 
                                  : "text-slate-350 font-semibold"
                            }`}>
                              {st.text}
                            </span>
                          </div>
                        );
                      });
                    })()}

                  </div>
                </div>

                {/* Standard Fee Details panel row */}
                <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-450 px-1 pt-1 font-sans">
                  <span>Комиссии бирж (taker x 2)</span>
                  <span className="font-mono font-black text-slate-705">
                    0.0120 USDT ≈ 0.20%
                  </span>
                </div>

                {/* Detailed Spec Params table (ПАРАМЕТРЫ) */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase pl-1 block">Параметры</span>
                  <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4 space-y-2.5 text-xs text-left">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                      <span className="font-bold text-slate-400">Ликвидность</span>
                      <span className="font-black text-emerald-500 uppercase">Высокая</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 font-mono">
                      <span className="font-bold text-slate-400 font-sans">Signal ID</span>
                      <span className="font-black text-slate-800">#{signal.id}sh49aa</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                      <span className="font-bold text-slate-400">Сеть</span>
                      <span className="font-black text-slate-800 uppercase font-mono">{signal.network}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 font-mono">
                      <span className="font-bold text-slate-400 font-sans">Мин. вывод</span>
                      <span className="font-black text-slate-800">5 {baseToken}</span>
                    </div>
                    <div className="flex justify-between items-center font-mono">
                      <span className="font-bold text-slate-400 font-sans">Комиссия сети</span>
                      <span className="font-bold text-slate-800">${networkFee.toFixed(4)}</span>
                    </div>

                    <div className="pt-2 flex justify-center">
                      <button
                        type="button"
                        onClick={() => showToast("Полный хеш-анализ пула доступен только премиум подписчикам", "info")}
                        className="text-blue-500 hover:text-blue-600 font-black text-[10.5px] inline-flex items-center gap-1 transition-all"
                      >
                        Полный анализ
                        <ArrowUpRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>



              </motion.div>
            ) : (
              <motion.div
                key="decision_panel"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="space-y-4 text-left"
              >
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-850">Критерии принятия торговых решений</h3>
                  <p className="text-[11px] text-slate-450 font-bold leading-normal">
                    Полный автоматический аудит ликвидности мемпулов, цен стаканов и сборов ордеров.
                  </p>
                </div>

                {/* Detailed checks list */}
                <div className="space-y-4 bg-slate-50 border border-slate-100/50 rounded-2xl p-4.5">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-55 font-sans text-emerald-600 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-[11.5px] font-black text-slate-800">Проверка лимитов ликвидности DEX/CEX</h4>
                      <p className="text-[10px] text-slate-450 font-semibold leading-normal mt-0.5">
                        Ликвидность децентрализованного и централизованного пулов достаточна для совершения сделки без проскальзывания цены.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-3.5 border-t border-slate-200/50">
                    <div className="w-5 h-5 rounded-full bg-emerald-55 font-sans text-emerald-600 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-[11.5px] font-black text-slate-800">Оптимальный уровень Slippage (Проскальзывание)</h4>
                      <p className="text-[10px] text-slate-450 font-semibold leading-normal mt-0.5">
                        Ожидаемое проскальзывание составляет менее 0.1%. Изменения в стакане не превышают критический предел.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-3.5 border-t border-slate-200/50">
                    <div className="w-5 h-5 rounded-full bg-emerald-55 font-sans text-emerald-600 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-[11.5px] font-black text-slate-800">Расчет Газа сети сессий</h4>
                      <p className="text-[10px] text-slate-450 font-semibold leading-normal mt-0.5">
                        Комиссия сети блокчейна {signal.network} находится на минимальном допустимом уровне (${networkFee.toFixed(4)}), что гарантирует высокую экономическую рентабельность.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-3.5 border-t border-slate-200/50">
                    <div className="w-5 h-5 rounded-full bg-emerald-55 font-sans text-emerald-600 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-[11.5px] font-black text-slate-800">Мульти-блокчейн маршрутизация</h4>
                      <p className="text-[10px] text-slate-450 font-semibold leading-normal mt-0.5">
                        Время транзита токенов между {signal.buyDex} и {signal.sellDex} оценивается менее чем в 70 секунд, опережая потенциальный арбитражный распад спреда.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-3.5 border-t border-slate-200/50">
                    <div className="w-5 h-5 rounded-full bg-emerald-55 font-sans text-emerald-600 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-[11.5px] font-black text-slate-800">Спецификация Flash Loan аудирована CertiK</h4>
                      <p className="text-[10px] text-slate-450 font-semibold leading-normal mt-0.5">
                        Смарт-арбитражный контракт v3 прошел полный внешний аудит безопасности. Риск невозврата заемных средств заблокирован на уровне смарт-логики.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl text-[10.5px] text-blue-800 leading-normal font-sans font-semibold">
                  Все тесты успешно пройдены алгоритмом за 0.04 сек. Смело инициируйте транзакции в автоматическом режиме исполнения.
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Sticky bottom control footer container */}
        <div className="p-4.5 bg-white border-t border-slate-100 shadow-2xl relative z-20 space-y-3.5 select-none">
          {activeDrawerTab === "launch" ? (
            <>
              {/* TERMS CHECKBOX CONFIRMATION */}
              <div className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-2xl text-left">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    disabled={isExecuting}
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-1 h-4.5 w-4.5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400 cursor-pointer"
                  />
                  <p className="text-[10.5px] leading-relaxed font-bold text-slate-500 font-sans">
                    Я ознакомлен с условиями арбитражной сделки, понимаю риски и даю согласие на автоматическое выполнение всех шагов.{" "}
                    <span className="font-black text-slate-800 block mt-1.5 uppercase">Подтверждаю</span>
                  </p>
                </label>
              </div>

              {/* Execute Button */}
              <button
                type="button"
                disabled={isExecuting || !confirmed}
                onClick={handleExecuteArbitrage}
                className={`w-full py-4 rounded-xl font-black text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-[0.98] ${
                  isExecuting 
                    ? "bg-rose-500 text-white shadow-md shadow-rose-200 hover:bg-rose-600 cursor-pointer" 
                    : confirmed
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-200 cursor-pointer"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/60"
                }`}
              >
                {isExecuting ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    Исполнение связки...
                  </>
                ) : (
                  <>
                    <Play size={9} className="fill-white font-black" />
                    Запустить арбитраж
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="py-2.5 flex items-center justify-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider select-none bg-slate-50 border border-slate-200/50 rounded-xl">
              <Lock size={12} className="text-slate-400" />
              Спецификация контракта полностью аудирована CertiK
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// --- Main Scanner Page ---
export function ScannerPage({
  onSelectSignal,
  isScannerRunning,
  setIsScannerRunning,
}: {
  onSelectSignal: (signal: Signal) => void;
  isScannerRunning: boolean;
  setIsScannerRunning: (running: boolean) => void;
  key?: React.Key;
}) {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<string>("Все");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Parameters
  const [sumAmount, setSumAmount] = useState<string>("12");
  const [threshold, setThreshold] = useState<string>("0.1");
  const [selectedDex, setSelectedDex] = useState<string>("Все");
  const [autoTrade, setAutoTrade] = useState<boolean>(true);
  const [onlyProfitable, setOnlyProfitable] = useState<boolean>(true);

  // Statistics and session metrics
  const [signalsFound, setSignalsFound] = useState<number>(3);
  const [toLaunch, setToLaunch] = useState<number>(2);
  const [minSpread, setMinSpread] = useState<string>("-1.22%");
  const [maxSpread, setMaxSpread] = useState<string>("+0.58%");
  const [sessionTime, setSessionTime] = useState<string>("─");
  const [ticksCount, setTicksCount] = useState<number>(0);

  const [signals, setSignals] = useState<Signal[]>([
    { id: 1, pair: "BER/USDT", network: "BERA", spread: "+0.44%", profit: "+$0.53", buyPrice: "0.02826", sellPrice: "0.02827", buyDex: "HTX", sellDex: "BITGET", status: "К запуску", type: "profit" },
    { id: 2, pair: "ETHW/USDT", network: "ETHW", spread: "-1.22%", profit: "-$0.20", buyPrice: "0.3225", sellPrice: "0.3179", buyDex: "HTX", sellDex: "MEXC", status: "Риск", type: "risk" },
    { id: 3, pair: "SOL/USDT", network: "SOLANA", spread: "+0.58%", profit: "+$1.12", buyPrice: "148.22", sellPrice: "148.97", buyDex: "BYBIT", sellDex: "HTX", status: "К запуску", type: "profit" }
  ]);

  const [liveTimers, setLiveTimers] = useState<{ [key: number]: string }>({
    1: "00:03:21",
    2: "06:24:35",
    3: "00:01:12"
  });

  // Oscillate prices and periodically generate new arbitrage opportunities
  useEffect(() => {
    let interval: any = null;
    if (isScannerRunning) {
      interval = setInterval(() => {
        setTicksCount(prev => prev + 1);

        // Tick live timers
        setLiveTimers(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(id => {
            const keyId = Number(id);
            const timeParts = updated[keyId].split(":").map(Number);
            let [h, m, s] = timeParts;
            s += 1;
            if (s >= 60) {
              s = 0;
              m += 1;
            }
            if (m >= 60) {
              m = 0;
              h += 1;
            }
            const pad = (n: number) => n.toString().padStart(2, "0");
            updated[keyId] = `${pad(h)}:${pad(m)}:${pad(s)}`;
          });
          return updated;
        });

        // Tick session duration
        setSessionTime(() => {
          const m = Math.floor(ticksCount / 60);
          const s = ticksCount % 60;
          return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
        });

        // Micro simulation - add new signal (10% chance)
        if (Math.random() < 0.10) {
          const pairsList = [
            { p: "TON/USDT", net: "TON", bp: "7.12", sp: "7.18", spr: "+0.84%", pr: "+$1.68", bd: "MEXC", sd: "BITGET" },
            { p: "NOT/USDT", net: "TON", bp: "0.0125", sp: "0.0126", spr: "+0.80%", pr: "+$0.24", bd: "BITGET", sd: "MEXC" },
            { p: "AVAX/USDT", net: "AVAX", bp: "32.40", sp: "32.41", spr: "+0.03%", pr: "+$0.08", bd: "HTX", sd: "BYBIT" }
          ];

          const pick = pairsList[Math.floor(Math.random() * pairsList.length)];
          const newId = Date.now();
          const newSig: Signal = {
            id: newId,
            pair: pick.p,
            network: pick.net,
            spread: pick.spr,
            profit: pick.pr,
            buyPrice: pick.bp,
            sellPrice: pick.sp,
            buyDex: pick.bd,
            sellDex: pick.sd,
            status: "К запуску",
            type: "profit"
          };

          const sprVal = parseFloat(pick.spr.replace("%", ""));
          const limThreshold = parseFloat(threshold) || 0.1;

          if (!onlyProfitable || sprVal >= limThreshold) {
            setSignals(prev => [newSig, ...prev.slice(0, 6)]);
            setLiveTimers(prev => ({ ...prev, [newId]: "00:00:01" }));
            setSignalsFound(c => c + 1);
            showToast(`🚀 Найдена связка ${pick.p} со спредом ${pick.spr}!`, "success", "Сканер");
          }
        }

        // Slight live price changes
        setSignals(prev => {
          return prev.map(s => {
            if (Math.random() > 0.7) {
              const basePrice = parseFloat(s.buyPrice);
              const change = (Math.random() - 0.5) * 0.0004 * basePrice;
              const newBuy = (basePrice + change).toFixed(4);
              return { ...s, buyPrice: newBuy };
            }
            return s;
          });
        });

      }, 1000);
    } else {
      setSessionTime("─");
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isScannerRunning, ticksCount, threshold, onlyProfitable]);

  const handleToggleScanner = () => {
    const nextState = !isScannerRunning;
    setIsScannerRunning(nextState);
    if (nextState) {
      showToast("Мониторинг запущен", "success");
      setTicksCount(0);
    } else {
      showToast("Мониторинг деактивирован", "info");
    }
  };

  const getFilteredSignals = () => {
    let list = [...signals];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(s => s.pair.toLowerCase().includes(q) || s.network.toLowerCase().includes(q));
    }

    if (activeTab === "Свежие") {
      list = list.filter(s => {
        const timerVal = liveTimers[s.id] || "01:00:00";
        const minsValue = parseInt(timerVal.split(":")[1]) || 0;
        return minsValue < 2;
      });
    } else if (activeTab === "К запуску") {
      list = list.filter(s => s.status === "К запуску");
    } else if (activeTab === "Прибыльные") {
      list = list.filter(s => {
        const sprValue = parseFloat(s.spread.replace("%", "")) || 0;
        return sprValue > 0;
      });
    } else if (activeTab === "Риск") {
      list = list.filter(s => {
        const sprValue = parseFloat(s.spread.replace("%", "")) || 0;
        return sprValue < 0 || s.status === "Риск";
      });
    }

    if (selectedDex !== "Все") {
      list = list.filter(s => s.buyDex === selectedDex || s.sellDex === selectedDex);
    }

    const limitThresh = parseFloat(threshold) || 0.0;
    list = list.filter(s => {
      const sprVal = parseFloat(s.spread.replace("%", "")) || 0;
      return Math.abs(sprVal) >= limitThresh;
    });

    return list;
  };

  const filtered = getFilteredSignals();

  const categories = [
    { label: "Все", id: "Все", count: signals.length },
    { label: "Свежие", id: "Свежие", count: signals.filter(s => {
        const t = liveTimers[s.id] || "01:00:00";
        return (parseInt(t.split(":")[1]) || 0) < 2;
      }).length },
    { label: "К запуску", id: "К запуску", count: signals.filter(s => s.status === "К запуску").length },
    { label: "Прибыльные", id: "Прибыльные", count: signals.filter(s => {
        const sprValue = parseFloat(s.spread.replace("%", "")) || 0;
        return sprValue > 0;
      }).length },
    { label: "Риск", id: "Риск", count: signals.filter(s => {
        const sprValue = parseFloat(s.spread.replace("%", "")) || 0;
        return sprValue < 0 || s.status === "Риск";
      }).length }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Controls & Settings */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Scanner Control and Stats Center */}
          <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-3xs space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isScannerRunning ? "bg-emerald-500 animate-pulse" : "bg-slate-350"}`} />
                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest animate-none">Модуль сканирования</h3>
              </div>
              <span className={`text-[9.5px] font-black px-2.5 py-0.5 rounded-full ${
                isScannerRunning 
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100 animate-none" 
                  : "bg-slate-50 text-slate-600 border border-slate-200"
              }`}>
                {isScannerRunning ? "Сканер активен" : "На паузе"}
              </span>
            </div>

            {/* Real-time Monitoring Stats */}
            <div className="bg-slate-50/60 border border-slate-100/50 rounded-2xl p-4.5 space-y-3.5">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Найдено</span>
                  <span className="text-sm font-black text-slate-800 font-mono block mt-0.5">{signalsFound} связки</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">В очереди</span>
                  <span className="text-sm font-black text-slate-800 font-mono block mt-0.5">{toLaunch}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-rose-450 uppercase tracking-wider block">Минимальный спред</span>
                  <span className="text-sm font-black text-rose-500 font-mono block mt-0.5">{minSpread}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider block">Максимальный спред</span>
                  <span className="text-sm font-black text-emerald-500 font-mono block mt-0.5">{maxSpread}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center text-[10px] font-bold text-slate-500">
                <div className="flex items-center gap-1.5 flex-nowrap">
                  <span className={`w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse`} />
                  <span>Время онлайн-сессии</span>
                </div>
                <span className="font-mono text-xs font-black text-slate-700">{sessionTime}</span>
              </div>
            </div>

            {/* Micro helper copy */}
            <p className="text-[11px] text-slate-400 leading-normal">
              {isScannerRunning 
                ? "Прослушивание мемпулов и стаканов цен децентрализованных сетей рендерится в реальном времени ниже."
                : "Контроллер находится в режиме ожидания. Нажмите кнопку запуска для автоанализа межбиржевого спреда."}
            </p>

            <button
              onClick={handleToggleScanner}
              className={`w-full py-4 rounded-2xl font-black text-xs tracking-wider transition-all duration-300 relative z-10 flex items-center justify-center gap-2 active:scale-[0.98] ${
                isScannerRunning 
                   ? "bg-rose-500 text-white shadow-md shadow-rose-200 hover:bg-rose-600" 
                   : "bg-emerald-500 text-white shadow-md shadow-emerald-200 hover:bg-emerald-600"
              }`}
            >
              {isScannerRunning ? (
                <>
                  <Square size={13} className="fill-white" />
                  ОСТАНОВИТЬ МОНИТОРИНГ
                </>
              ) : (
                <>
                  <Play size={13} className="fill-white" />
                  ЗАПУСТИТЬ СКАНИРОВАНИЕ
                </>
              )}
            </button>
          </div>

          {/* Configuration Settings Engine (styled professionally) */}
          <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-3xs space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sliders size={15} className="text-blue-600" />
              <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest pl-1">Конфигурация параметров</h3>
            </div>

            <div className="space-y-4">
              {/* Order Sum */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Объем для ордера (USDT)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[10px] text-slate-400">USDT</span>
                  <input
                    type="number"
                    value={sumAmount}
                    onChange={(e) => setSumAmount(e.target.value)}
                    className="w-full pl-14 pr-4 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Min Threshold spread */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Минимальный спред (%)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[10px] text-slate-400">%</span>
                  <input
                    type="number"
                    step="0.1"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Specific DX filter */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Биржа сравнения</label>
                <select
                  value={selectedDex}
                  onChange={(e) => setSelectedDex(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                >
                  <option value="Все">Все подключенные DEX/CEX</option>
                  <option value="HTX">HTX Global</option>
                  <option value="BITGET">Bitget Exchange</option>
                  <option value="MEXC">MEXC Global</option>
                  <option value="BYBIT">Bybit</option>
                </select>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-3 border-t border-slate-100 flex flex-col">
                <label className="flex items-center justify-between cursor-pointer select-none py-1">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">Оптимизация треков</span>
                    <span className="text-[9px] font-semibold text-slate-400">Автоматически вычитать комиссию Газа</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={autoTrade}
                    onChange={(e) => setAutoTrade(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4 transition-all"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer select-none py-1">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">Только положительный спред</span>
                    <span className="text-[9px] font-semibold text-slate-400">Скрыть потенциальные риски</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={onlyProfitable}
                    onChange={(e) => setOnlyProfitable(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4 transition-all"
                  />
                </label>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT PREMIUM SPACE AREA FOR INTERMEDIATE STATS AND SPREADSHEETS */}
        <div className="lg:col-span-8 space-y-6">

          {/* Filtering Header Tab bar */}
          <div className="bg-white border border-slate-200/50 rounded-3xl p-4 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Horizontal tab list with counters */}
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                    activeTab === cat.id 
                      ? "bg-slate-900 text-white shadow-xs" 
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  {cat.label}
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-black ${
                    activeTab === cat.id ? "bg-white/10 text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Live Search Search Bar */}
            <div className="relative min-w-[200px]">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Фильтр по паре..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/50 rounded-xl text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all font-sans"
              />
            </div>
          </div>

          {/* HIGH-PICTURE SPREADSHEET CARD LIST (Clean tabular view) */}
          <div className="bg-white border border-slate-200/50 rounded-3xl shadow-3xs overflow-hidden">
            
            {/* Responsive Table Columns Title headers */}
            <div className="hidden md:grid grid-cols-12 gap-2 px-6 py-4.5 bg-slate-50/60 border-b border-slate-200/50 text-[10px] font-black uppercase text-slate-450 tracking-wider">
              <span className="col-span-3">ПАРА / СЕТЬ</span>
              <span className="col-span-3">СПРЕД И ROI</span>
              <span className="col-span-2 text-center">ПОКУПКА CEX/DEX</span>
              <span className="col-span-2 text-center">ПРОДАЖА CEX/DEX</span>
              <span className="col-span-2 text-right">АНАЛИТИКА</span>
            </div>

            {/* List rendered rows */}
            <div className="divide-y divide-slate-100">
              <AnimatePresence initial={false}>
                {filtered.length > 0 ? (
                  filtered.map((s) => {
                    const parsedSpread = parseFloat(s.spread.replace("%", ""));
                    const isPositive = parsedSpread >= 0;

                    return (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="p-5 md:px-6 md:py-4.5 grid grid-cols-1 md:grid-cols-12 gap-3.5 md:gap-2 items-center hover:bg-slate-50/30 transition-all group"
                      >
                        {/* Token label descriptor */}
                        <div className="col-span-3 flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-[11px] ${
                            isPositive
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : "bg-rose-50 text-rose-600 border border-rose-100"
                          }`}>
                            {s.pair.split("/")[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                                {s.pair}
                              </span>
                              <span className="text-[8px] font-black px-1.5 py-0.5 bg-slate-100 text-slate-500 border border-slate-200/40 rounded-md font-mono">
                                {s.network}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold block mt-1">
                              Активен: {liveTimers[s.id] || "00:00:23"}
                            </span>
                          </div>
                        </div>

                        {/* Spread status and ROI */}
                        <div className="col-span-3 flex flex-col justify-center space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md font-mono border ${
                              isPositive 
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200/70" 
                                : "bg-rose-50 text-rose-500 border-rose-200/70"
                            }`}>
                              {s.spread}
                            </span>
                            <span className={`text-[11px] font-black font-mono ${
                              isPositive ? "text-emerald-600" : "text-rose-600"
                            }`}>
                              {s.profit}
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">
                            Чистая доходность
                          </span>
                        </div>

                        {/* Buying Dex pricing */}
                        <div className="col-span-2 text-center flex md:flex-col justify-between md:justify-center items-center gap-1 bg-slate-50 md:bg-transparent px-3 py-1.5 md:p-0 rounded-xl border border-slate-100 md:border-transparent">
                          <span className="text-[10px] font-bold text-slate-450 md:hidden uppercase">ПОКУПКА</span>
                          <div>
                            <span className="text-[9.5px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              {s.buyDex}
                            </span>
                            <span className="text-[11.5px] font-bold text-slate-800 font-mono block mt-1">
                              ${parseFloat(s.buyPrice).toFixed(4)}
                            </span>
                          </div>
                        </div>

                        {/* Selling Dex Pricing */}
                        <div className="col-span-2 text-center flex md:flex-col justify-between md:justify-center items-center gap-1 bg-slate-50 md:bg-transparent px-3 py-1.5 md:p-0 rounded-xl border border-slate-100 md:border-transparent">
                          <span className="text-[10px] font-bold text-slate-450 md:hidden uppercase">ПРОДАЖА</span>
                          <div>
                            <span className="text-[9.5px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-mono">
                              {s.sellDex}
                            </span>
                            <span className="text-[11.5px] font-bold text-slate-800 font-mono block mt-1 font-sans">
                              ${parseFloat(s.sellPrice).toFixed(4)}
                            </span>
                          </div>
                        </div>

                        {/* Action details Drawer Trigger */}
                        <div className="col-span-2 text-right pt-2 md:pt-0">
                          <button
                            onClick={() => onSelectSignal(s)}
                            className="w-full md:w-auto px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-900 hover:text-white rounded-xl font-black text-[10px] transition-all flex items-center justify-center gap-1 active:scale-95 duration-150"
                          >
                            Подробнее
                            <ChevronRight size={13} />
                          </button>
                        </div>

                      </motion.div>
                    );
                  })
                ) : (
                  <div className="p-12 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mx-auto">
                      <Info size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Цепочки отсутствуют</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto mt-0.5">
                        Нет активных арбитражных связок, соответствующих выбранным критериям фильтрации.
                      </p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Table history footer badge */}
          <div className="flex items-center justify-between text-slate-450 border border-slate-200/50 rounded-2xl px-5 py-3.5 text-[10px] font-bold tracking-tight bg-slate-50">
            <span>Показаны сигналы за последние 60 минут текущей сессии</span>
            <button 
              type="button" 
              onClick={() => showToast("Перенаправление в архив сохраненных сигналов...", "info")}
              className="text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-all"
            >
              Вся история
              <ArrowUpRight size={12} />
            </button>
          </div>

        </div>

      </div>

    </motion.div>
  );
}
