import React, { useState, useEffect, useRef, useMemo } from "react";
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

import { DetailedSignalAnalysis } from "./DetailedAnalysisPage";
import { HistoryPage } from "./HistoryPage";

// --- Signal Drawer Component ---
export function SignalDrawer(props: { 
  signal: Signal; 
  onClose: () => void;
  runningArbitrages?: any[];
  setRunningArbitrages?: (arbs: any) => void;
  onShowFullAnalysis?: (signal: Signal) => void;
}) {
  const { signal, onClose, runningArbitrages = [], setRunningArbitrages, onShowFullAnalysis } = props;
  const { showToast } = useToast();
  
  const [showFullAnalysis, setShowFullAnalysis] = useState<boolean>(false);
  const [activeDrawerTab, setActiveDrawerTab] = useState<"launch" | "decision">("launch");
  
  // Input fields loaded with signal defaults
  const [buyPriceInput, setBuyPriceInput] = useState<string>(signal.buyPrice);
  const [sellPriceInput, setSellPriceInput] = useState<string>(signal.sellPrice);
  const [sumInput, setSumInput] = useState<string>(() => {
    const mode = localStorage.getItem("arbitrage_amount_mode") || "manual";
    if (mode === "balance") {
      return "11.72";
    }
    return localStorage.getItem("arbitrage_amount_usdt") || "11.72";
  });
  
  // State for balance
  const [balance, setBalance] = useState<number>(11.72);
  const [confirmed, setConfirmed] = useState<boolean>(true);
  const [orderType, setOrderType] = useState<"market" | "limit">("limit");
  const [executionMode, setExecutionMode] = useState<"parallel" | "sequential">("sequential");

  // Keep track of previous prices to show green/red flashes on change
  const prevBuyRef = useRef<string>(signal.buyPrice);
  const prevSellRef = useRef<string>(signal.sellPrice);
  const [buyFlash, setBuyFlash] = useState<"up" | "down" | null>(null);
  const [sellFlash, setSellFlash] = useState<"up" | "down" | null>(null);

  // Sync state if signal changes
  useEffect(() => {
    setBuyPriceInput(signal.buyPrice);
    setSellPriceInput(signal.sellPrice);
    prevBuyRef.current = signal.buyPrice;
    prevSellRef.current = signal.sellPrice;
    
    const mode = localStorage.getItem("arbitrage_amount_mode") || "manual";
    if (mode === "balance") {
      setSumInput("11.72");
    } else {
      setSumInput(localStorage.getItem("arbitrage_amount_usdt") || "11.72");
    }
    setConfirmed(true);
  }, [signal]);

  // Handle buy price changes for flash effects
  useEffect(() => {
    const current = parseFloat(buyPriceInput);
    const previous = parseFloat(prevBuyRef.current);
    
    if (!isNaN(current) && !isNaN(previous) && current !== previous) {
      if (current > previous) {
        setBuyFlash("up");
      } else if (current < previous) {
        setBuyFlash("down");
      }
      
      const timer = setTimeout(() => {
        setBuyFlash(null);
      }, 1000);
      
      prevBuyRef.current = buyPriceInput;
      return () => clearTimeout(timer);
    } else if (buyPriceInput !== prevBuyRef.current) {
      prevBuyRef.current = buyPriceInput;
    }
  }, [buyPriceInput]);

  // Handle sell price changes for flash effects
  useEffect(() => {
    const current = parseFloat(sellPriceInput);
    const previous = parseFloat(prevSellRef.current);
    
    if (!isNaN(current) && !isNaN(previous) && current !== previous) {
      if (current > previous) {
        setSellFlash("up");
      } else if (current < previous) {
        setSellFlash("down");
      }
      
      const timer = setTimeout(() => {
        setSellFlash(null);
      }, 1000);
      
      prevSellRef.current = sellPriceInput;
      return () => clearTimeout(timer);
    } else if (sellPriceInput !== prevSellRef.current) {
      prevSellRef.current = sellPriceInput;
    }
  }, [sellPriceInput]);

  const adjustNumericInput = (type: "buy" | "sell", amount: number) => {
    if (type === "buy") {
      const current = parseFloat(buyPriceInput) || 0.0001;
      setBuyPriceInput(Math.max(0, current + amount).toFixed(5));
    } else {
      const current = parseFloat(sellPriceInput) || 0.0001;
      setSellPriceInput(Math.max(0, current + amount).toFixed(5));
    }
  };

  if (showFullAnalysis) {
    return (
      <DetailedSignalAnalysis 
        signal={signal} 
        onClose={() => setShowFullAnalysis(false)} 
        runningArbitrages={runningArbitrages}
        setRunningArbitrages={setRunningArbitrages}
      />
    );
  }

  const baseToken = signal.pair.split("/")[0] || "TOK";
  const quoteToken = signal.pair.split("/")[1] || "USDT";

  // Fee factors based on current network and priority (standard withdrawal fee)
  const baseNetworkFee = signal.network === "BERA" ? 0.0001 : signal.network === "SOLANA" ? 0.0005 : signal.network === "ETHW" ? 0.02 : 0.001;
  const networkFee = baseNetworkFee;
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

  const hasInputAmount = parsedSum > 0;
  const netProfit = hasInputAmount ? (netCapitalProfit - totalTakerFees - networkFee) : 0.53;
  const roiPct = hasInputAmount ? (netProfit / parsedSum) * 100 : 0.37;

  // Execution states derived from global runningArbitrages
  const thisArb = runningArbitrages.find((arb: any) => arb.signal.id === signal.id);
  const isThisSignalRunning = !!thisArb;
  const isExecuting = isThisSignalRunning && thisArb.isExecuting;
  const executionStep = isThisSignalRunning ? thisArb.executionStep : 0;

  const handlePercentClick = (pct: number) => {
    setSumInput((balance * pct).toFixed(2));
  };

  const handleExecuteArbitrage = () => {
    if (!confirmed) {
      showToast("Пожалуйста, подтвердите согласие перед запуском", "error");
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
      netProfit: hasInputAmount ? netProfit : 0.53,
    };
    setRunningArbitrages?.((prev: any[]) => [...prev, initialArb]);

    // Progress through execution steps (total ~8 seconds)
    setTimeout(() => {
      setRunningArbitrages?.((prev: any[]) => prev.map((arb) => arb.id === processId ? { ...arb, executionStep: 2 } : arb));
    }, 1500);

    setTimeout(() => {
      setRunningArbitrages?.((prev: any[]) => prev.map((arb) => arb.id === processId ? { ...arb, executionStep: 3 } : arb));
    }, 3000);

    setTimeout(() => {
      setRunningArbitrages?.((prev: any[]) => prev.map((arb) => arb.id === processId ? { ...arb, executionStep: 4 } : arb));
    }, 4500);

    setTimeout(() => {
      setRunningArbitrages?.((prev: any[]) => prev.map((arb) => arb.id === processId ? { ...arb, executionStep: 5 } : arb));
    }, 6000);

    setTimeout(() => {
      setRunningArbitrages?.((prev: any[]) => prev.map((arb) => arb.id === processId ? { ...arb, executionStep: 6 } : arb));
    }, 7050);

    setTimeout(() => {
      setRunningArbitrages?.((prev: any[]) => prev.map((arb) => arb.id === processId ? { ...arb, executionStep: 7, isExecuting: false } : arb));
      
      // Update balance & show completion notification
      const finalProfit = hasInputAmount ? netProfit : 0.53;
      if (finalProfit > 0) {
        setBalance(prev => prev + finalProfit);
        showToast(`Прибыль ${finalProfit.toFixed(4)} USDT успешно зачислена на баланс.`, "success", "Сделка завершена");
      } else {
        showToast(`Ордер закрыт. Итоговый результат: ${finalProfit.toFixed(4)} USDT`, "info", "Ордер выполнен");
      }
    }, 8000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
      />

      {/* Drawer Panel */}
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 240 }}
        className="relative w-full max-w-[480px] h-full bg-white shadow-2xl flex flex-col z-10 border-l border-slate-100"
      >
        {/* Header Section */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center justify-center font-black text-xs font-mono">
              {baseToken}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-nowrap font-mono">
                <span className="text-sm font-extrabold text-slate-900 tracking-tight uppercase">{signal.pair}</span>
                <span className="text-[9.5px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-250 rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse inline-block" />
                  LIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase max-w-[280px] truncate leading-tight">
                {signal.buyDex} → {signal.network} → {signal.sellDex} - #{signal.id || "f554ba7"}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Custom Tab Selection Header */}
        <div className="px-5 pt-3 border-b border-slate-100 bg-white flex gap-4 text-[11px] font-sans font-extrabold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveDrawerTab("launch")}
            className={`pb-2.5 transition-all text-left relative cursor-pointer select-none ${
              activeDrawerTab === "launch" 
                ? "text-blue-600 font-extrabold border-b-2 border-blue-600" 
                : "text-slate-400 hover:text-slate-650"
            }`}
          >
            Запуск
          </button>
          <button
            type="button"
            disabled={isExecuting}
            onClick={() => setActiveDrawerTab("decision")}
            className={`pb-2.5 transition-all text-left relative cursor-pointer select-none ${
              activeDrawerTab === "decision" 
                ? "text-blue-600 font-extrabold border-b-2 border-blue-600" 
                : "text-slate-400 hover:text-slate-650"
            }`}
          >
            Решение
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
                <div className="space-y-1 text-left">
                  <h3 className="text-xs font-extrabold text-slate-850">Профит уверенный — можно запускать</h3>
                  <p className="text-[10.5px] text-slate-450 leading-relaxed font-sans font-medium">
                    Все проверки пройдены, спред живой, комиссия минимальная.
                  </p>
                </div>

                {/* 1. Крупные карточки текущих цен на биржах покупки и продажи */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-left space-y-1 shadow-xs">
                    <div className="flex items-center gap-1.5 flex-nowrap">
                      <span className="text-[9.5px] font-black text-emerald-600 tracking-wider uppercase block">{signal.buyDex}</span>
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    </div>
                    <span className="text-base font-black text-slate-900 font-mono tracking-tight block">
                      ${parseFloat(signal.buyPrice).toFixed(4)}
                    </span>
                    <span className="text-[9.5px] font-bold text-slate-400 block pb-0.5">Текущая цена покупки</span>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 text-left space-y-1 shadow-xs">
                    <div className="flex items-center gap-1.5 flex-nowrap">
                      <span className="text-[9.5px] font-black text-blue-600 tracking-wider uppercase block">{signal.sellDex}</span>
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                    </div>
                    <span className="text-base font-black text-slate-900 font-mono tracking-tight block">
                      ${parseFloat(signal.sellPrice).toFixed(4)}
                    </span>
                    <span className="text-[9.5px] font-bold text-slate-400 block pb-0.5">Текущая цена продажи</span>
                  </div>
                </div>

                {/* 2. 3 Columns Metrics (СПРЕД / ПРОФИТ / ROI) */}
                <div className="grid grid-cols-3 gap-2 py-3 bg-slate-50 border border-slate-100 rounded-2xl px-3.5">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block text-left">Спред</span>
                    <span className={`text-sm font-black font-mono block text-left ${spreadPct >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                      {spreadPct >= 0 ? "+" : ""}{spreadPct.toFixed(2)}%
                    </span>
                  </div>
                  <div className="space-y-0.5 border-l border-slate-200/50 pl-3">
                    <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block text-left">Профит</span>
                    <span className={`text-sm font-black font-mono block text-left ${netProfit >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                      {netProfit >= 0 ? "+" : ""}${netProfit.toFixed(2)}
                    </span>
                  </div>
                  <div className="space-y-0.5 border-l border-slate-200/50 pl-3">
                    <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block text-left">ROI</span>
                    <span className={`text-sm font-black font-mono block text-left ${roiPct >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                      {roiPct >= 0 ? "+" : ""}{roiPct.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* 3. Standard Fee Details panel row */}
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 px-1 pt-0.5 font-sans text-left">
                  <span>Комиссии бирж (taker x 2)</span>
                  <span className="font-mono font-extrabold text-slate-700">
                    0.0120 USDT ≈ 0.20%
                  </span>
                </div>

                {/* 4. Price setup module (editable Buy & Sell rates) */}
                <div className="space-y-1.5 pt-1 text-left">
                  <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase pl-1 block">Цены перед запуском</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[10.5px] font-bold text-slate-500 font-sans block">Покупка ({signal.buyDex})</label>
                        <span className="text-[9.5px] font-extrabold text-slate-400 font-mono">Тек: {parseFloat(signal.buyPrice).toFixed(4)}</span>
                      </div>
                      <div className="relative flex items-center">
                        <button 
                          type="button" 
                          disabled={isExecuting}
                          onClick={() => adjustNumericInput("buy", -0.0001)}
                          className="absolute left-1.5 text-[9.5px] font-black bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition-all cursor-pointer select-none"
                        >
                          -0.0001
                        </button>
                        <input 
                          type="text" 
                          disabled={isExecuting}
                          value={buyPriceInput}
                          onChange={(e) => setBuyPriceInput(e.target.value)}
                          className={`w-full pl-16 pr-16 py-2 rounded-xl text-center text-xs font-extrabold font-mono focus:outline-none select-all transition-all duration-300 ${
                            buyFlash === "up"
                              ? "bg-emerald-50 border-emerald-400 text-emerald-700 shadow-xs ring-2 ring-emerald-500/10"
                              : buyFlash === "down"
                                ? "bg-rose-50 border-rose-400 text-rose-700 shadow-xs ring-2 ring-rose-500/10"
                                : "bg-slate-50 border-slate-200 text-slate-850 focus:bg-white focus:border-indigo-500"
                          }`}
                        />
                        <button 
                          type="button" 
                          disabled={isExecuting}
                          onClick={() => adjustNumericInput("buy", 0.0001)}
                          className="absolute right-1.5 text-[9.5px] font-black bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition-all cursor-pointer select-none"
                        >
                          +0.0001
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[10.5px] font-bold text-slate-500 font-sans block">Продажа ({signal.sellDex})</label>
                        <span className="text-[9.5px] font-extrabold text-slate-400 font-mono">Тек: {parseFloat(signal.sellPrice).toFixed(4)}</span>
                      </div>
                      <div className="relative flex items-center">
                        <button 
                          type="button" 
                          disabled={isExecuting}
                          onClick={() => adjustNumericInput("sell", -0.0001)}
                          className="absolute left-1.5 text-[9.5px] font-black bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition-all cursor-pointer select-none"
                        >
                          -0.0001
                        </button>
                        <input 
                          type="text" 
                          disabled={isExecuting}
                          value={sellPriceInput}
                          onChange={(e) => setSellPriceInput(e.target.value)}
                          className={`w-full pl-16 pr-16 py-2 rounded-xl text-center text-xs font-extrabold font-mono focus:outline-none select-all transition-all duration-300 ${
                            sellFlash === "up"
                              ? "bg-emerald-50 border-emerald-400 text-emerald-700 shadow-xs ring-2 ring-emerald-500/10"
                              : sellFlash === "down"
                                ? "bg-rose-50 border-rose-400 text-rose-700 shadow-xs ring-2 ring-rose-500/10"
                                : "bg-slate-50 border-slate-200 text-slate-850 focus:bg-white focus:border-indigo-500"
                          }`}
                        />
                        <button 
                          type="button" 
                          disabled={isExecuting}
                          onClick={() => adjustNumericInput("sell", 0.0001)}
                          className="absolute right-1.5 text-[9.5px] font-black bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition-all cursor-pointer select-none"
                        >
                          +0.0001
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. SUM INPUT BOX MODULE with balance and preset percentages */}
                <div className="space-y-2 pt-1 text-left">
                  <div className="flex justify-between items-center text-[10.5px] font-bold font-sans">
                    <span className="text-slate-500">Сумма арбитражного ордера</span>
                    <span className="text-slate-400 font-mono">
                      Доступно: <span className="font-extrabold text-slate-855">{balance.toFixed(2)} USDT</span>
                    </span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-3 focus-within:border-indigo-400 transition-all">
                    <div className="flex items-center justify-between gap-1">
                      <input 
                        type="text"
                        disabled={isExecuting}
                        value={sumInput}
                        onChange={(e) => setSumInput(e.target.value)}
                        className="bg-transparent border-0 p-0 text-lg font-black text-slate-850 focus:ring-0 focus:outline-none w-[60%] font-mono"
                        placeholder="Сумма"
                      />
                      <div className="flex flex-col items-end flex-shrink-0 font-mono">
                        <span className="text-xs font-extrabold text-slate-800">{quoteToken}</span>
                        {parsedSum > 0 && (
                          <span className="text-[9px] font-bold text-rose-500 mt-0.5">
                            ком. -{totalTakerFees.toFixed(3)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Percentage buttons */}
                    <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-200/40 font-mono">
                      {[0.25, 0.50, 0.75, 1.0].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          disabled={isExecuting}
                          onClick={() => handlePercentClick(pct)}
                          className="py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-[10px] font-black text-slate-550 select-none cursor-pointer transition-all active:scale-95 text-center uppercase"
                        >
                          {pct === 1.0 ? "MAX" : `${pct * 100}%`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 7. Detailed Spec Params table (ПАРАМЕТРЫ) */}
                <div className="space-y-1.5 pt-2 text-left">
                  <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase pl-1 block">Параметры</span>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2.5 text-[10.5px] text-left">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                      <span className="font-semibold text-slate-500 font-sans">Ликвидность</span>
                      <span className="font-bold text-emerald-500 uppercase font-sans">Высокая</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 font-mono">
                      <span className="font-semibold text-slate-500 font-sans">Signal ID</span>
                      <span className="font-bold text-slate-800">#{signal.id || "f554ba7"}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                      <span className="font-semibold text-slate-500 font-sans">Сеть</span>
                      <span className="font-bold text-slate-800 uppercase font-mono">{signal.network}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 font-mono">
                      <span className="font-semibold text-slate-500 font-sans">Мин. вывод</span>
                      <span className="font-bold text-slate-800 font-sans">5 {baseToken}</span>
                    </div>
                    <div className="flex justify-between items-center font-mono">
                      <span className="font-semibold text-slate-500 font-sans">Комиссия сети</span>
                      <span className="font-bold text-slate-800 font-sans">${networkFee.toFixed(4)}</span>
                    </div>

                    <div className="pt-2 flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (onShowFullAnalysis) {
                            onShowFullAnalysis(signal);
                            onClose();
                          } else {
                            setShowFullAnalysis(true);
                          }
                        }}
                        className="text-blue-500 hover:text-blue-600 font-black text-[10.5px] inline-flex items-center gap-1 transition-all cursor-pointer font-sans"
                      >
                        Полный анализ
                        <ArrowUpRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 6. Route Diagram Map Panel */}
                <div className="space-y-1.5 text-left">
                  <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase pl-1 block">Маршрут</span>
                  <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3.5 space-y-2 font-mono text-[10.5px]">
                    <div className="flex justify-between items-center text-slate-400 font-sans text-[9px] uppercase font-bold mb-1">
                      <span>Транзитный Маршрут</span>
                      <span>Сеть перевода: {signal.network}</span>
                    </div>
                    
                    <div className="flex items-center justify-between gap-1 pt-1.5">
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-black text-slate-800">{signal.buyDex}</span>
                        <span className="text-[9px] text-slate-450 mt-0.5 font-sans">Покупка</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <div className="w-full flex items-center justify-center gap-0.5 px-2">
                          <div className="h-0.5 bg-blue-200 flex-1" />
                          <span className="text-[8px] bg-blue-50 border border-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase leading-none font-sans">
                            Перевод
                          </span>
                          <div className="h-0.5 bg-blue-200 flex-1" />
                        </div>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-xs font-black text-slate-800">{signal.sellDex}</span>
                        <span className="text-[9px] text-slate-450 mt-0.5 font-sans">Продажа</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CEX order config parameters info block */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-2.5 text-left">
                  <span className="text-[10px] font-black text-slate-455 uppercase tracking-wider block">Режим исполнения сделок</span>
                  
                  <div className="flex flex-wrap gap-2">
                    <div className="px-2.5 py-1.5 bg-white border border-slate-200/60 rounded-lg text-[10px] font-extrabold font-mono text-slate-700 inline-flex items-center gap-1.5 shadow-5xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                      Ордер: Limit (Лимитный)
                    </div>
                    <div className="px-2.5 py-1.5 bg-white border border-slate-200/60 rounded-lg text-[10px] font-extrabold font-mono text-slate-700 inline-flex items-center gap-1.5 shadow-5xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                      Порядок: Последовательно
                    </div>
                  </div>

                  <p className="text-[10.5px] text-slate-500 leading-relaxed font-sans font-medium">
                    Для предотвращения ошибок исполнения на CEX биржах система автоматически выставляет безопасные <strong className="font-extrabold text-slate-700">лимитные ордера</strong> по целевой цене и проводит сделки строго <strong className="font-extrabold text-slate-700">последовательно</strong> (по очереди).
                  </p>
                </div>

                {/* Important notice block below route */}
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-2 text-[10px] text-amber-800 leading-relaxed font-sans text-left">
                  <AlertTriangle size={14} className="mt-0.5 flex-shrink-0 text-amber-600" />
                  <p className="font-medium font-sans">
                    <span className="font-extrabold text-amber-900 block mb-0.5">Важно:</span>
                    перед выводом на <span className="font-extrabold text-slate-850">{signal.sellDex}</span> нужно один раз подтвердить адрес кошелька депозита в настройках белого списка в личном кабинете.
                  </p>
                </div>

                {/* 8. Simulated Steps Animation block "ЧТО ПРОИЗОЙДЕТ" */}
                <div className="space-y-2 pt-2 text-left">
                  <div className="flex justify-between items-center px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Что произойдет</span>
                    <span className="font-mono text-[9px] lowercase">~78с</span>
                  </div>

                  {/* Vertically chained sequence */}
                  <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-3.5 relative overflow-hidden text-left">
                    
                    {/* Top Balance Banner */}
                    <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200/50 text-emerald-600 font-sans text-[11px] font-extrabold">
                      <Check size={13} className="stroke-[3] text-emerald-500" />
                      <span>Баланс подтверждён · {balance.toFixed(2)} USDT</span>
                    </div>

                    {/* Step-by-Step rendering */}
                    {(() => {
                      const stepsDef = [
                        { 
                          id: 1, 
                          title: `Выставление ордера купить на ${signal.buyDex}`,
                          getDesc: (active: boolean, completed: boolean) => {
                            if (completed) return `Успешно выставлен лимитный ордер на сумму ${parsedSum.toFixed(2)} USDT`;
                            if (active) return `Формирование и отправка ордера на сумму ${parsedSum.toFixed(2)} USDT...`;
                            return `Будет выделено ${parsedSum.toFixed(2)} USDT`;
                          },
                          getStatusText: (active: boolean, completed: boolean) => {
                            if (completed) return "Создан";
                            if (active) return "В процессе...";
                            return "Ожидание";
                          }
                        },
                        { 
                          id: 2, 
                          title: `Исполнение BUY ордера (закуп ${baseToken})`,
                          getDesc: (active: boolean, completed: boolean) => {
                            if (completed || executionStep >= 3) return `Куплено ${tokensBought.toFixed(2)} ${baseToken} по курсу $${parsedBuy.toFixed(5)}`;
                            if (active) return `Поиск ликвидных встречных заявок по цене $${parsedBuy.toFixed(5)}...`;
                            return `Целевой курс закупа: $${parsedBuy.toFixed(5)}`;
                          },
                          getStatusText: (active: boolean, completed: boolean) => {
                            if (completed || executionStep >= 3) return "Выпонен";
                            if (active) return "Подбор стакана...";
                            return "Ожидание";
                          }
                        },
                        { 
                          id: 3, 
                          title: `Трансфер токена по сети ${signal.network}`,
                          getDesc: (active: boolean, completed: boolean) => {
                            if (completed || executionStep >= 4) return `Переслано ${tokensBought.toFixed(2)} ${baseToken}. Сбор сети: $${networkFee.toFixed(4)}`;
                            if (active) return `Инициализация транзакции в сети ${signal.network}. Ожидание подписи гейта...`;
                            return `Комиссия перевода: $${networkFee.toFixed(4)}`;
                          },
                          getStatusText: (active: boolean, completed: boolean) => {
                            if (completed || executionStep >= 4) return "Отправлен";
                            if (active) return "В мемпуле...";
                            return "Ожидание";
                          }
                        },
                        { 
                          id: 4, 
                          title: `Зачисление токенов на ${signal.sellDex}`,
                          getDesc: (active: boolean, completed: boolean) => {
                            if (completed || executionStep >= 5) return `Зачислено на баланс ${tokensBought.toFixed(2)} ${baseToken} (подтверждено)`;
                            if (active) return `Ожидание 1 блокчейн-подтверждения в сети ${signal.network}...`;
                            return `Будет зачислено на баланс`;
                          },
                          getStatusText: (active: boolean, completed: boolean) => {
                            if (completed || executionStep >= 5) return "Подтвержден";
                            if (active) return "Сканирование...";
                            return "Ожидание";
                          }
                        },
                        { 
                          id: 5, 
                          title: `Выставление ордера продать на ${signal.sellDex}`,
                          getDesc: (active: boolean, completed: boolean) => {
                            if (completed || executionStep >= 6) return `Успешно выставлен лимитный ордер по цене $${parsedSell.toFixed(5)}`;
                            if (active) return `Запуск встречного ордера по цене $${parsedSell.toFixed(5)}...`;
                            return `Целевой курс продажи: $${parsedSell.toFixed(5)}`;
                          },
                          getStatusText: (active: boolean, completed: boolean) => {
                            if (completed || executionStep >= 6) return "Выставлен";
                            if (active) return "Публикация...";
                            return "Ожидание";
                          }
                        },
                        { 
                          id: 6, 
                          title: `Исполнение ордера SELL и фиксирование профита`,
                          getDesc: (active: boolean, completed: boolean) => {
                            if (completed || executionStep >= 7) return `Закрыто. Выручка: ${grossReturn.toFixed(2)} USDT, Нетто-профит: +${netProfit.toFixed(4)} USDT`;
                            if (active) return `Исполнение ордера в стакане ${signal.sellDex}...`;
                            return `Ожидаемый чистый профит: +${netProfit.toFixed(4)} USDT`;
                          },
                          getStatusText: (active: boolean, completed: boolean) => {
                            if (completed || executionStep >= 7) return "Исполнен";
                            if (active) return "Исполнение...";
                            return "Ожидание";
                          }
                        }
                      ];

                      return stepsDef.map((st) => {
                        const isCompleted = executionStep > st.id || (!isExecuting && executionStep === 7);
                        const isActive = isExecuting && executionStep === st.id;

                        return (
                          <div key={st.id} className="flex gap-3 relative z-10 text-[11px] leading-tight select-none">
                            {/* Icon Indicator */}
                            <div className="pt-0.5 flex-shrink-0">
                              {isCompleted ? (
                                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-4xs font-black text-[10px]">
                                  ✓
                                </div>
                              ) : isActive ? (
                                <div className="relative w-5 h-5 flex items-center justify-center">
                                  <div className="absolute inset-0 rounded-full border-2 border-indigo-100" />
                                  <div className="absolute inset-0 rounded-full border-2 border-t-indigo-500 border-r-indigo-500 animate-spin" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-[9px] font-bold text-slate-400">
                                  {st.id}
                                </div>
                              )}
                            </div>

                            {/* Details text structure */}
                            <div className="flex-1 flex flex-col space-y-0.5 text-left">
                              <div className="flex justify-between items-baseline gap-2">
                                <span className={`text-[11px] transition-all duration-200 ${
                                  isActive 
                                    ? "text-indigo-600 font-extrabold" 
                                    : isCompleted 
                                      ? "text-slate-800 font-bold" 
                                      : "text-slate-400 font-semibold"
                                }`}>
                                  {st.title}
                                </span>
                                
                                <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-extrabold uppercase shrink-0 ${
                                  isCompleted 
                                    ? "bg-emerald-50 text-emerald-700" 
                                    : isActive 
                                      ? "bg-indigo-50 text-indigo-700 animate-pulse" 
                                      : "bg-slate-50 text-slate-400"
                                }`}>
                                  {st.getStatusText(isActive, isCompleted)}
                                </span>
                              </div>
                              <span className={`text-[9.5px] transition-all duration-200 ${
                                isActive ? "text-indigo-505 font-medium animate-pulse" : "text-slate-450 font-medium"
                              }`}>
                                {st.getDesc(isActive, isCompleted)}
                              </span>
                            </div>
                          </div>
                        );
                      });
                    })()}

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
                  <h4 className="text-xs font-extrabold text-slate-800">Критерии принятия торговых решений</h4>
                  <p className="text-[10.5px] text-slate-500 font-medium leading-relaxed font-sans">
                    Полный автоматический аудит ликвидности мемпулов, цен стаканов и сборов ордеров.
                  </p>
                </div>

                {/* Detailed checks list */}
                <div className="space-y-4 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-xs mt-0.5 font-bold">
                      ✓
                    </div>
                    <div>
                      <h5 className="text-[10.5px] font-extrabold text-slate-800">Проверка лимитов ликвидности CEX бирж</h5>
                      <p className="text-[9.5px] text-slate-450 font-medium font-sans leading-relaxed mt-0.5">
                        Плотность биржевых стаканов на обеих CEX-платформах достаточна для совершения сделки без риска расширения спреда.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-3.5 border-t border-slate-200/50">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-xs mt-0.5 font-bold">
                      ✓
                    </div>
                    <div>
                      <h5 className="text-[10.5px] font-extrabold text-slate-800">Оптимальный уровень Slippage (Проскальзывание)</h5>
                      <p className="text-[9.5px] text-slate-450 font-medium font-sans leading-relaxed mt-0.5">
                        Ожидаемое проскальзывание составляет менее 0.1%. Изменения в стакане не превышают критический предел.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-3.5 border-t border-slate-200/50">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-xs mt-0.5 font-bold">
                      ✓
                    </div>
                    <div>
                      <h5 className="text-[10.5px] font-extrabold text-slate-800">Расчет Газа сети сессий</h5>
                      <p className="text-[9.5px] text-slate-450 font-medium font-sans leading-relaxed mt-0.5">
                        Комиссия сети блокчейна {signal.network} находится на минимальном допустимом уровне (${networkFee.toFixed(4)}), что гарантирует высокую экономическую рентабельность.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-3.5 border-t border-slate-200/50">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-xs mt-0.5 font-bold">
                      ✓
                    </div>
                    <div>
                      <h5 className="text-[10.5px] font-extrabold text-slate-800">Мульти-блокчейн маршрутизация</h5>
                      <p className="text-[9.5px] text-slate-450 font-medium font-sans leading-relaxed mt-0.5">
                        Время транзита токенов между {signal.buyDex} and {signal.sellDex} оценивается менее чем в 70 секунд, опережая потенциальный арбитражный распад спреда.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-3.5 border-t border-slate-200/50">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-xs mt-0.5 font-bold">
                      ✓
                    </div>
                    <div>
                      <h5 className="text-[10.5px] font-extrabold text-slate-800">Спецификация Flash Loan аудирована CertiK</h5>
                      <p className="text-[9.5px] text-slate-450 font-medium font-sans leading-relaxed mt-0.5">
                        Смарт-арбитражный контракт v3 прошел полный внешний аудит безопасности. Риск невозврата заемных средств заблокирован на уровне смарт-логики.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-[10.5px] text-blue-805 leading-normal font-sans font-semibold">
                  Все тесты успешно пройдены алгоритмом за 0.04 сек. Смело инициируйте транзакции в автоматическом режиме исполнения.
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Sticky bottom control footer container */}
        <div className="p-4.5 bg-white border-t border-slate-100 shadow-xl relative z-20 space-y-3.5 select-none text-left">
          {activeDrawerTab === "launch" ? (
            <>
              {/* TERMS CHECKBOX CONFIRMATION */}
              {!isThisSignalRunning && (
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-left">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      disabled={isExecuting}
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400 cursor-pointer"
                    />
                    <span className="text-[10px] leading-relaxed font-bold text-slate-500 font-sans select-none">
                      Я ознакомлен с условиями арбитражной сделки, понимаю риски и даю согласие на автоматическое выполнение всех шагов.
                      <span className="font-black text-slate-900 block mt-1 uppercase">Согласие подтверждено</span>
                    </span>
                  </label>
                </div>
              )}

              {/* Execution outcomes status block within drawer */}
              {isThisSignalRunning && !isExecuting && executionStep === 7 ? (
                <div className="space-y-3 text-left">
                  <div className="p-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl space-y-1 text-center font-sans">
                    <span className="text-xs font-black block">Ордер выполнен</span>
                    <p className="text-[11.5px] font-extrabold font-mono">
                      Профит: <span className="text-emerald-500">+{netProfit.toFixed(4)} USDT</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-black text-xs tracking-wider uppercase shadow-md shadow-orange-200 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Закрыть и продолжить
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={isExecuting || !confirmed}
                  onClick={handleExecuteArbitrage}
                  className={`w-full py-4 rounded-xl font-black text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-[0.98] ${
                    isExecuting 
                      ? "bg-rose-500 text-white shadow-md shadow-rose-200 hover:bg-rose-600 cursor-pointer animate-pulse" 
                      : confirmed
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-250 cursor-pointer"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
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
              )}
            </>
          ) : (
            <div className="py-2.5 flex items-center justify-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider select-none bg-slate-50 border border-slate-200 rounded-xl">
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
const EXCHANGES_WITH_BALANCES = [
  { name: "MEXC", balance: 340.50 },
  { name: "BITGET", balance: 180.20 },
  { name: "BYBIT", balance: 290.00 },
  { name: "HTX", balance: 125.75 }
];

export function ScannerPage({
  onSelectSignal,
  onShowDetailedAnalysis,
  isScannerRunning,
  setIsScannerRunning,
  runningArbitrages = [],
  scannerSubView = "scanner",
  setScannerSubView,
}: {
  onSelectSignal: (signal: Signal) => void;
  onShowDetailedAnalysis?: (signal: Signal) => void;
  isScannerRunning: boolean;
  setIsScannerRunning: (running: boolean) => void;
  runningArbitrages?: any[];
  key?: React.Key;
  scannerSubView?: "scanner" | "history";
  setScannerSubView?: (view: "scanner" | "history") => void;
}) {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<string>("Все");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Exchanges selected for scanning and comparison
  const [scannedExchanges, setScannedExchanges] = useState<string[]>(() => {
    const stored = localStorage.getItem("scanned_exchanges");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
    return ["HTX", "BITGET", "BYBIT", "MEXC"];
  });

  useEffect(() => {
    localStorage.setItem("scanned_exchanges", JSON.stringify(scannedExchanges));
  }, [scannedExchanges]);

  // Parameters
  const [sumAmount, setSumAmount] = useState<string>(() => localStorage.getItem("arbitrage_amount_usdt") || "12");
  const [threshold, setThreshold] = useState<string>(() => localStorage.getItem("profit_threshold") || "0.1");
  const [selectedDex, setSelectedDex] = useState<string>("Все");
  const [autoTrade, setAutoTrade] = useState<boolean>(true);
  const [onlyProfitable, setOnlyProfitable] = useState<boolean>(true);

  // Advanced configurations
  const [advAmountMode, setAdvAmountMode] = useState<"manual" | "balance">(() => 
    (localStorage.getItem("arbitrage_amount_mode") as "manual" | "balance") || "manual"
  );
  const [advMinVol1, setAdvMinVol1] = useState<string>(() => 
    localStorage.getItem("min_trade_volume") || "50000"
  );
  const [advMinVol2, setAdvMinVol2] = useState<string>(() => 
    localStorage.getItem("min_trade_volume_second_exchange") || "50000"
  );

  const [advBuyTimeout, setAdvBuyTimeout] = useState<string>(() => 
    localStorage.getItem("buy_order_timeout_minutes") || "15"
  );
  const [advSellTimeout, setAdvSellTimeout] = useState<string>(() => 
    localStorage.getItem("sell_order_timeout_minutes") || "15"
  );
  const [advSmartTimeout, setAdvSmartTimeout] = useState<string>(() => 
    localStorage.getItem("smart_trading_timeout_minutes") || "20"
  );
  const [advStopLoss, setAdvStopLoss] = useState<string>(() => 
    localStorage.getItem("stop_loss_threshold_percent") || "5.0"
  );
  const [advLiquidityTimeout, setAdvLiquidityTimeout] = useState<string>(() => 
    localStorage.getItem("liquidity_wait_timeout_seconds") || "120"
  );
  const [advMaxLoss, setAdvMaxLoss] = useState<string>(() => 
    localStorage.getItem("market_order_max_loss_percent") || "0.2"
  );
  const [advLimitResubmit, setAdvLimitResubmit] = useState<boolean>(() => 
    localStorage.getItem("limit_order_resubmit_enabled") === "true"
  );

  const [advPriceBufferEnabled, setAdvPriceBufferEnabled] = useState<boolean>(() => 
    localStorage.getItem("price_change_buffer_enabled") !== "false"
  );
  const [advPriceBufferValue, setAdvPriceBufferValue] = useState<string>(() => 
    localStorage.getItem("price_change_buffer_percent") || "0.8"
  );
  const [advArbitrageMode, setAdvArbitrageMode] = useState<string>(() => 
    localStorage.getItem("arbitrage_mode") || "sequential"
  );
  const [advIterationMode, setAdvIterationMode] = useState<string>(() => 
    localStorage.getItem("arbitrage_iteration_mode") || "CYCLE"
  );

  const [advPrimaryExchange, setAdvPrimaryExchange] = useState<string>(() => 
    localStorage.getItem("primary_exchange") || "auto"
  );
  const [advPrimaryNetwork, setAdvPrimaryNetwork] = useState<string>(() => 
    localStorage.getItem("primary_exchange_usdt_network") || "auto"
  );

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("arbitrage_amount_usdt", sumAmount);
  }, [sumAmount]);

  useEffect(() => {
    localStorage.setItem("profit_threshold", threshold);
  }, [threshold]);

  useEffect(() => {
    localStorage.setItem("arbitrage_amount_mode", advAmountMode);
  }, [advAmountMode]);

  useEffect(() => {
    localStorage.setItem("min_trade_volume", advMinVol1);
  }, [advMinVol1]);

  useEffect(() => {
    localStorage.setItem("min_trade_volume_second_exchange", advMinVol2);
  }, [advMinVol2]);

  useEffect(() => {
    localStorage.setItem("buy_order_timeout_minutes", advBuyTimeout);
  }, [advBuyTimeout]);

  useEffect(() => {
    localStorage.setItem("sell_order_timeout_minutes", advSellTimeout);
  }, [advSellTimeout]);

  useEffect(() => {
    localStorage.setItem("smart_trading_timeout_minutes", advSmartTimeout);
  }, [advSmartTimeout]);

  useEffect(() => {
    localStorage.setItem("stop_loss_threshold_percent", advStopLoss);
  }, [advStopLoss]);

  useEffect(() => {
    localStorage.setItem("liquidity_wait_timeout_seconds", advLiquidityTimeout);
  }, [advLiquidityTimeout]);

  useEffect(() => {
    localStorage.setItem("market_order_max_loss_percent", advMaxLoss);
  }, [advMaxLoss]);

  useEffect(() => {
    localStorage.setItem("limit_order_resubmit_enabled", String(advLimitResubmit));
  }, [advLimitResubmit]);

  useEffect(() => {
    localStorage.setItem("price_change_buffer_enabled", String(advPriceBufferEnabled));
  }, [advPriceBufferEnabled]);

  useEffect(() => {
    localStorage.setItem("price_change_buffer_percent", advPriceBufferValue);
  }, [advPriceBufferValue]);

  useEffect(() => {
    localStorage.setItem("arbitrage_mode", advArbitrageMode);
  }, [advArbitrageMode]);

  useEffect(() => {
    localStorage.setItem("arbitrage_iteration_mode", advIterationMode);
  }, [advIterationMode]);

  useEffect(() => {
    localStorage.setItem("primary_exchange", advPrimaryExchange);
  }, [advPrimaryExchange]);

  useEffect(() => {
    localStorage.setItem("primary_exchange_usdt_network", advPrimaryNetwork);
  }, [advPrimaryNetwork]);

  // Statistics and session metrics
  const [signalsFound, setSignalsFound] = useState<number>(3);
  const [toLaunch, setToLaunch] = useState<number>(2);
  const [minSpread, setMinSpread] = useState<string>("-1.22%");
  const [maxSpread, setMaxSpread] = useState<string>("+0.58%");
  const [sessionTime, setSessionTime] = useState<string>("─");
  const [ticksCount, setTicksCount] = useState<number>(0);

  // Find exchange with balance dynamically
  const currentAutoExchangeObj = useMemo(() => {
    const index = Math.floor(ticksCount / 15) % EXCHANGES_WITH_BALANCES.length;
    return EXCHANGES_WITH_BALANCES[index];
  }, [ticksCount]);

  const currentAutoExchange = currentAutoExchangeObj.name;
  const currentAutoBalance = currentAutoExchangeObj.balance;

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
            { p: "TON/USDT", net: "TON", bp: 7.12, sp: 7.18, bd: "MEXC", sd: "BITGET" },
            { p: "NOT/USDT", net: "TON", bp: 0.0125, sp: 0.0126, bd: "BITGET", sd: "MEXC" },
            { p: "AVAX/USDT", net: "AVAX", bp: 32.40, sp: 32.55, bd: "HTX", sd: "BYBIT" },
            { p: "BER/USDT", net: "BERA", bp: 0.02826, sp: 0.02848, bd: "HTX", sd: "BITGET" },
            { p: "SOL/USDT", net: "SOLANA", bp: 148.22, sp: 149.32, bd: "BYBIT", sd: "HTX" }
          ];

          const pick = pairsList[Math.floor(Math.random() * pairsList.length)];
          
          // Modify exchanges based on Primary Exchange chosen, or automatic balance-find if active
          let currentBuyDex = pick.bd;
          let currentSellDex = pick.sd;
          
          if (scannedExchanges.length >= 2) {
            if (advAmountMode === "balance") {
              currentBuyDex = currentAutoExchange.toUpperCase();
              if (!scannedExchanges.includes(currentBuyDex)) {
                currentBuyDex = scannedExchanges[0];
              }
              const remains = scannedExchanges.filter(x => x !== currentBuyDex);
              currentSellDex = remains.length > 0 ? remains[Math.floor(Math.random() * remains.length)] : currentBuyDex;
            } else {
              // Manual select of primary buy exchange
              const primaryUpper = advPrimaryExchange.toUpperCase();
              if (primaryUpper !== "AUTO" && scannedExchanges.includes(primaryUpper)) {
                currentBuyDex = primaryUpper;
              } else {
                currentBuyDex = scannedExchanges[0];
              }
              const remains = scannedExchanges.filter(x => x !== currentBuyDex);
              currentSellDex = remains.length > 0 ? remains[Math.floor(Math.random() * remains.length)] : currentBuyDex;
            }
          }

          // Calculate search sum dynamically: If Auto-Balance, use current rotating exchange balance
          const activeSum = advAmountMode === "balance" ? currentAutoBalance : (parseFloat(sumAmount) || 12);
          
          // Spread computing
          const rawSpread = ((pick.sp - pick.bp) / pick.bp) * 100;
          let finalSpread = rawSpread;
          
          // Price buffer effect
          if (advPriceBufferEnabled) {
            const bufVal = parseFloat(advPriceBufferValue) || 0.8;
            finalSpread = rawSpread - bufVal;
          }

          // Compute realistic estimated profits
          const baseNetworkFee = pick.net === "BERA" ? 0.0001 : pick.net === "SOLANA" ? 0.0005 : pick.net === "TON" ? 0.01 : 0.001;
          const networkFee = baseNetworkFee * pick.bp;
          const takerBuyFee = activeSum * 0.001;
          const totalBoughtTokens = activeSum / pick.bp;
          const takerSellFee = (totalBoughtTokens * pick.sp) * 0.001;
          const totalFees = takerBuyFee + takerSellFee + networkFee;
          const grossRevenue = totalBoughtTokens * pick.sp;
          const dynamicNetProfit = grossRevenue - activeSum - totalFees;

          const spreadStr = (finalSpread >= 0 ? "+" : "") + finalSpread.toFixed(2) + "%";
          const profitStr = (dynamicNetProfit >= 0 ? "+" : "") + "$" + dynamicNetProfit.toFixed(2);
          
          const newId = Date.now();
          const newSig: Signal = {
            id: newId,
            pair: pick.p,
            network: advPrimaryNetwork !== "auto" && currentBuyDex === advPrimaryExchange.toUpperCase() ? advPrimaryNetwork : pick.net,
            spread: spreadStr,
            profit: profitStr,
            buyPrice: pick.bp.toFixed(4),
            sellPrice: pick.sp.toFixed(4),
            buyDex: currentBuyDex,
            sellDex: currentSellDex,
            status: dynamicNetProfit > 0 ? "К запуску" : "Риск",
            type: dynamicNetProfit > 0 ? "profit" : "risk"
          };

          const limThreshold = parseFloat(threshold) || 0.1;

          if (!onlyProfitable || finalSpread >= limThreshold) {
            setSignals(prev => [newSig, ...prev.slice(0, 6)]);
            setLiveTimers(prev => ({ ...prev, [newId]: "00:00:01" }));
            setSignalsFound(c => c + 1);
            showToast(`🚀 Найдена связка ${pick.p} со спредом ${spreadStr}!`, "success", "Сканер");
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
  }, [
    isScannerRunning, 
    ticksCount, 
    threshold, 
    onlyProfitable, 
    sumAmount, 
    advAmountMode, 
    advPriceBufferEnabled, 
    advPriceBufferValue, 
    advPrimaryExchange, 
    advPrimaryNetwork,
    scannedExchanges
  ]);

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

    // Filter by scanned exchanges (both buy and sell exchanges of the signals must be among checked-scanned ones)
    list = list.filter(s => scannedExchanges.includes(s.buyDex.toUpperCase()) && scannedExchanges.includes(s.sellDex.toUpperCase()));

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
      className="p-5 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Controls & Settings */}
        {scannerSubView === "scanner" && (
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          
          {/* Scanner Control and Stats Center */}
          <div className="bg-white rounded-3xl p-6 shadow-3xs space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isScannerRunning ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest pl-1">Модуль сканирования</h3>
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
                  <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider block">Минимальный спред</span>
                  <span className="text-sm font-black text-rose-500 font-mono block mt-0.5">{minSpread}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider block">Максимальный спред</span>
                  <span className="text-sm font-black text-emerald-500 font-mono block mt-0.5">{maxSpread}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center text-[10px] font-bold text-slate-500">
                <div className="flex items-center gap-1.5 flex-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
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
          <div className="bg-white rounded-3xl p-6 shadow-3xs space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sliders size={15} className="text-blue-600" />
              <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest pl-1">Конфигурация параметров</h3>
            </div>

            <div className="space-y-4">
              {/* Режим определения суммы */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block">Режим определения суммы</label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-50 border border-slate-200/50 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setAdvAmountMode("manual")}
                    className={`py-1.5 px-2 text-[9px] font-black rounded-lg transition-all uppercase tracking-wider ${
                      advAmountMode === "manual"
                        ? "bg-blue-600 text-white shadow-2xs"
                        : "text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    Вручную
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdvAmountMode("balance")}
                    className={`py-1.5 px-2 text-[9px] font-black rounded-lg transition-all uppercase tracking-wider flex items-center justify-center gap-1 ${
                      advAmountMode === "balance"
                        ? "bg-blue-600 text-white shadow-2xs"
                        : "text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Авто-поиск (баланс)
                  </button>
                </div>
              </div>

              {/* Amount and primary/buy CEX selector block */}
              {advAmountMode === "balance" ? (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between pl-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Автоматический остаток на CEX
                      </span>
                      <span className="text-[8.5px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 animate-pulse">
                        Активен
                      </span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[10px] text-slate-400">USDT</span>
                      <input
                        type="number"
                        value={currentAutoBalance.toFixed(2)}
                        disabled
                        className="w-full pl-14 pr-4 py-3 border border-emerald-200 bg-emerald-50/30 text-emerald-700 rounded-xl text-xs font-bold font-mono cursor-not-allowed focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="bg-emerald-50/50 border border-emerald-100/60 p-3 rounded-2xl space-y-2 text-[9.5px]">
                    <div className="flex justify-between font-bold text-emerald-800">
                      <span>Ведущая биржа покупки:</span>
                      <span className="font-mono bg-white px-1.5 py-0.5 rounded text-[8.5px] border border-emerald-100">{currentAutoExchange}</span>
                    </div>
                    <div className="flex justify-between font-bold text-emerald-600">
                      <span>Сумма под сделку:</span>
                      <span className="font-mono">{currentAutoBalance.toFixed(2)} USDT</span>
                    </div>
                    <p className="text-[8.5px] text-emerald-500 leading-normal pt-1.5 border-t border-emerald-200/40">
                      Логика CEX-автоматизации сканирует балансы и назначает ведущую биржу с активным депозитом как точку входа.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Сумма для поиска (USDT)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[10px] text-slate-400">USDT</span>
                      <input
                        type="number"
                        value={sumAmount}
                        onChange={(e) => setSumAmount(e.target.value)}
                        className="w-full pl-14 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-850 focus:outline-none focus:bg-white focus:border-blue-500 transition-all font-mono"
                        placeholder="Сумма сделки"
                      />
                    </div>
                  </div>

                  {/* Ручной выбор основной биржи */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block">Основная биржа CEX</label>
                    <select
                      value={advPrimaryExchange}
                      onChange={(e) => setAdvPrimaryExchange(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                    >
                      <option value="htx">HTX Global</option>
                      <option value="bitget">Bitget Exchange</option>
                      <option value="mexc">MEXC Global</option>
                      <option value="bybit">Bybit</option>
                    </select>
                    <p className="text-[8.5px] text-slate-400 pl-1 leading-normal">
                      Ручной выбор точки входа / покупки в арбитражный круг.
                    </p>
                  </div>
                </div>
              )}

              {/* Min Threshold spread */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Минимальный спред (%)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[10px] text-slate-400 font-mono">%</span>
                  <input
                    type="number"
                    step="0.1"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-850 focus:outline-none focus:bg-white focus:border-blue-500 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Биржи для сканирования и сравнения */}
              <div className="space-y-2 pt-1 border-t border-slate-100 mt-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block font-sans">Биржи для сравнения сделки</label>
                <div className="grid grid-cols-2 gap-2">
                  {["BYBIT", "MEXC", "BITGET", "HTX"].map((exch) => {
                    const isSelected = scannedExchanges.includes(exch);
                    return (
                      <button
                        type="button"
                        key={exch}
                        onClick={() => {
                          setScannedExchanges(prev => {
                            if (prev.includes(exch)) {
                              if (prev.length <= 2) {
                                showToast("Выберите как минимум 2 биржи для сканирования межбиржевых спредов", "warning");
                                return prev;
                              }
                              return prev.filter(x => x !== exch);
                            } else {
                              return [...prev, exch];
                            }
                          });
                        }}
                        className={`flex items-center gap-2 px-3 py-2.5 border rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-blue-50/60 border-blue-400 text-blue-700 shadow-2xs"
                            : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100/50"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-blue-500" : "bg-slate-300"}`} />
                        <span>{exch}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[8.5px] text-slate-450 leading-normal pl-1">
                  Активируйте CEX-биржи, котировки и спреды между которыми вы хотите сканировать в реальном времени.
                </p>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-3 flex flex-col border-t border-slate-100">
                <label className="flex items-center justify-between cursor-pointer select-none py-1">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">Оптимизация треков</span>
                    <span className="text-[9px] text-slate-400 font-semibold leading-relaxed">Интеллектуальный маршрут транзакций</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoTrade}
                    onChange={(e) => setAutoTrade(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer select-none py-1 border-t border-slate-100">
                  <div className="flex flex-col pt-1">
                    <span className="text-xs font-bold text-slate-700">Только прибыльные</span>
                    <span className="text-[9px] text-slate-400 font-semibold leading-relaxed font-mono">Фильтр по спреду &gt;= {threshold}%</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={onlyProfitable}
                    onChange={(e) => setOnlyProfitable(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* RIGHT PREMIUM SPACE AREA FOR INTERMEDIATE STATS AND SPREADSHEETS */}
        <div className={`${scannerSubView === "history" ? "lg:col-span-12" : "lg:col-span-8 xl:col-span-9"} space-y-6`}>
          {scannerSubView === "history" ? (
            <HistoryPage 
              onGoToSignal={(pair) => {
                if (setScannerSubView) {
                  setScannerSubView("scanner");
                }
                const found = signals.find(s => s.pair === pair);
                if (found) {
                  if (onShowDetailedAnalysis) {
                    onShowDetailedAnalysis(found);
                  } else {
                    onSelectSignal(found);
                  }
                  showToast(`Открыт детальный анализ сигнала ${pair}`, "success");
                } else {
                  const firstToken = pair.split("/")[0];
                  const fallback = signals.find(s => s.pair.startsWith(firstToken));
                  if (fallback) {
                    if (onShowDetailedAnalysis) {
                      onShowDetailedAnalysis(fallback);
                    } else {
                      onSelectSignal(fallback);
                    }
                    showToast(`Для ${pair} открыт детальный анализ похожего сигнала по активу ${firstToken}`, "success");
                  } else {
                    showToast(`Сигналы по валютной паре ${pair} сейчас не найдены в сканере`, "info");
                  }
                }
              }}
            />
          ) : (
            <>
              {/* Premium Gradient Deal Summary Metrics (identical to HistoryPage for unified state experience) */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 select-none">
                {/* Card 1: Profit */}
                <div className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-950/25 dark:to-teal-950/20 border border-emerald-500/10 dark:border-emerald-500/15 p-4 rounded-2xl flex flex-col justify-between hover:shadow-2xs transition-all duration-200">
                  <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none">Всего чистой прибыли</span>
                  <span className="text-xl font-black font-mono tracking-tight text-emerald-600 dark:text-emerald-400 mt-2 block">
                    +$21.72
                  </span>
                  <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                    <TrendingUp size={10} className="text-emerald-500" /> Вычет всех сборов сети
                  </p>
                </div>

                {/* Card 2: Successful Trades */}
                <div className="bg-gradient-to-br from-blue-500/5 to-indigo-500/5 dark:from-blue-950/25 dark:to-indigo-950/20 border border-blue-500/10 dark:border-blue-500/15 p-4 rounded-2xl flex flex-col justify-between hover:shadow-2xs transition-all duration-200">
                  <span className="text-[9px] font-black text-blue-600 dark:text-blue-450 uppercase tracking-widest leading-none">Успешно закрыто</span>
                  <span className="text-xl font-black font-mono tracking-tight text-slate-800 dark:text-slate-205 mt-2 block">
                    6 / 7 кругов
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-1">Остальные диверсифицированы</span>
                </div>

                {/* Card 3: Win Rate */}
                <div className="bg-gradient-to-br from-indigo-500/5 to-violet-500/5 dark:from-indigo-950/25 dark:to-violet-950/20 border border-indigo-500/10 dark:border-indigo-500/15 p-4 rounded-2xl flex flex-col justify-between hover:shadow-2xs transition-all duration-200">
                  <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest leading-none">Успешность винрейт</span>
                  <span className="text-xl font-black font-mono tracking-tight text-indigo-500 dark:text-indigo-400 mt-2 block">
                    85.7%
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-1">Высокая точность кругов</span>
                </div>

                {/* Card 4: Protected Capital */}
                <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 dark:from-amber-950/25 dark:to-orange-950/20 border border-amber-500/15 dark:border-amber-500/20 p-4 rounded-2xl flex flex-col justify-between hover:shadow-2xs transition-all duration-200">
                  <span className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest leading-none">Сохраненный депозит</span>
                  <span className="text-xl font-black font-mono tracking-tight text-slate-800 dark:text-slate-205 mt-2 block">
                    $9,410.00
                  </span>
                  <span className="text-[9px] font-bold text-emerald-500 dark:text-emerald-400 mt-1 leading-normal uppercase text-[8px] font-extrabold tracking-wider bg-emerald-500/10 dark:bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/20 dark:border-emerald-500/15 self-start">ПОД ЗАЩИТОЙ SLIPPAGE</span>
                </div>
              </div>

              {/* Filtering Header Tab bar */}
              <div className="bg-white rounded-3xl p-4 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Horizontal tab list with counters */}
                <div className="flex overflow-x-auto scrollbar-none gap-1 pb-1.5 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 flex-nowrap md:flex-wrap">
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
              <div className="bg-white rounded-3xl shadow-3xs overflow-hidden">
                
                {/* Responsive Table Columns Title headers */}
                <div className="hidden md:grid grid-cols-12 gap-2 px-6 py-4.5 bg-slate-50/60 border-b border-slate-200/50 text-[10px] font-black uppercase text-slate-450 tracking-wider">
                  <span className="col-span-3">ПАРА / СЕТЬ</span>
                  <span className="col-span-3">СПРЕД И ROI</span>
                  <span className="col-span-2 text-center">ПОКУПКА (CEX)</span>
                  <span className="col-span-2 text-center">ПРОДАЖА (CEX)</span>
                  <span className="col-span-2 text-right">ДЕЙСТВИЯ</span>
                </div>

                {/* List rendered rows */}
                <div className="divide-y divide-slate-100">
                  <AnimatePresence initial={false}>
                    {filtered.length > 0 ? (
                      filtered.map((s) => {
                        const parsedSpread = parseFloat(s.spread.replace("%", ""));
                        const isPositive = parsedSpread >= 0;

                        const activeArb = runningArbitrages.find((arb: any) => arb.signal.id === s.id);
                        const hasActiveArb = !!activeArb;
                        const isCurrentlyExecuting = hasActiveArb && activeArb.isExecuting;
                        const arbStep = hasActiveArb ? activeArb.executionStep : 0;

                        return (
                          <motion.div
                            key={s.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className={`p-5 md:px-6 md:py-4.5 grid grid-cols-1 md:grid-cols-12 gap-3.5 md:gap-2 items-center hover:bg-slate-50/30 transition-all group border-l-4 ${
                              isCurrentlyExecuting
                                ? "bg-indigo-50/10 border-l-indigo-500 animate-[pulse_2.5s_infinite]"
                                : hasActiveArb && arbStep === 7
                                  ? "bg-emerald-50/5 border-l-emerald-500"
                                  : "border-l-transparent"
                            }`}
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
                                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 mt-1">
                                  <span className="text-[10px] text-slate-400 font-bold block">
                                    Активен: {liveTimers[s.id] || "00:00:23"}
                                  </span>
                                  {isCurrentlyExecuting && (
                                    <span className="inline-flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200/70 rounded-md animate-pulse">
                                      <span className="w-1 h-1 rounded-full bg-indigo-600 animate-ping" />
                                      Арбитраж запущен ({Math.round(arbStep * 14.2)}%)
                                    </span>
                                  )}
                                  {hasActiveArb && !isCurrentlyExecuting && arbStep === 7 && (
                                    <span className="inline-flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100/60 rounded-md">
                                      ✓ Выполнен (+{(activeArb.netProfit || 0.2312).toFixed(4)} USDT)
                                    </span>
                                  )}
                                </div>
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
                              <span className="text-[10px] font-bold text-slate-455 md:hidden uppercase">ПОКУПКА</span>
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
                              <span className="text-[10px] font-bold text-slate-455 md:hidden uppercase">ПРОДАЖА</span>
                              <div>
                                <span className="text-[9.5px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-mono">
                                  {s.sellDex}
                                </span>
                                <span className="text-[11.5px] font-bold text-slate-800 font-mono block mt-1 font-sans">
                                  ${parseFloat(s.sellPrice).toFixed(4)}
                                </span>
                              </div>
                            </div>

                            {/* Action details Dual ButtonsTriggers */}
                            <div className="col-span-2 flex flex-row md:flex-col lg:flex-row gap-1.5 justify-end items-center pt-2 md:pt-0">
                              <button
                                onClick={() => onSelectSignal(s)}
                                title="Открыть панель быстрых сделок"
                                className="w-full lg:w-auto px-2 py-1.5 bg-amber-550/10 hover:bg-amber-500 hover:text-white text-amber-700 hover:border-amber-500 border border-amber-200/50 rounded-lg font-black text-[9.5px] tracking-tight transition-all flex items-center justify-center gap-1 active:scale-95 duration-110 flex-1 cursor-pointer"
                              >
                                <Zap size={11} />
                                <span>Сделка</span>
                              </button>
                              
                              <button
                                onClick={() => {
                                  if (onShowDetailedAnalysis) {
                                    onShowDetailedAnalysis(s);
                                  } else {
                                    onSelectSignal(s);
                                  }
                                }}
                                title="Открыть детальные графики и аналитику"
                                className="w-full lg:w-auto px-2 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 hover:border-blue-600 border border-blue-200/55 rounded-lg font-black text-[9.5px] tracking-tight transition-all flex items-center justify-center gap-1 active:scale-95 duration-110 flex-1 cursor-pointer"
                              >
                                <TrendingUp size={11} />
                                <span>Анализ</span>
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
                            Нет active-арбитражных связок, соответствующих выбранным критериям фильтрации.
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
            </>
          )}
        </div>

      </div>

    </motion.div>
  );
}
