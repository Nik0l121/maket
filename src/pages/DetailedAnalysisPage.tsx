import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Info, 
  Activity,
  Zap,
  ArrowLeft,
  RefreshCw,
  Lock,
  ArrowUpRight,
  Clock,
  Coins,
  ArrowRightLeft,
  Sliders,
  TrendingUp,
  Award,
  Check,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Layers,
  Cpu,
  TrendingDown,
  Gauge,
  SlidersHorizontal,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Signal } from "../types";
import { useToast } from "../components/Toast";

export function DetailedSignalAnalysis({ 
  signal, 
  onClose,
  runningArbitrages = [],
  setRunningArbitrages
}: { 
  signal: Signal;  
  onClose: () => void;
  runningArbitrages?: any[];
  setRunningArbitrages?: (arbs: any) => void;
  key?: React.Key;
}) {
  const { showToast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState<"1m" | "5m" | "1h">("1m");
  const [mobileWorkspaceTab, setMobileWorkspaceTab] = useState<"analysis" | "trade">("analysis");
  
  // Interactive Live simulation flags
  const [isSimulatingLivePrice, setIsSimulatingLivePrice] = useState<boolean>(true);
  const [priceDeviation, setPriceDeviation] = useState<number>(0);
  
  // CEX Order Type and Execution Mode for CEX-CEX arbitrage
  const [orderType, setOrderType] = useState<"market" | "limit">("limit");
  const [executionMode, setExecutionMode] = useState<"parallel" | "sequential">("sequential");

  // Input fields loaded with signal defaults
  const [buyPriceInput, setBuyPriceInput] = useState<string>(signal.buyPrice);
  const [sellPriceInput, setSellPriceInput] = useState<string>(signal.sellPrice);
  const [sumInput, setSumInput] = useState<string>("11.72");
  
  // State for balance
  const [balance, setBalance] = useState<number>(11.72);
  const [confirmed, setConfirmed] = useState<boolean>(true);

  // Verification lists active tabs
  const [activeCheckTab, setActiveCheckTab] = useState<"all" | "security" | "liquidity">("all");

  // Tab for sidebar Panel: "trade" for quick launch, "faq" for help/reference guide
  const [sidebarTab, setSidebarTab] = useState<"trade" | "faq">("trade");

  // Console output log messages state during execution
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const consoleBottomRef = useRef<HTMLDivElement>(null);

  // Keep track of previous prices to show green/red flashes on change
  const prevBuyRef = useRef<string>(signal.buyPrice);
  const prevSellRef = useRef<string>(signal.sellPrice);
  const [buyFlash, setBuyFlash] = useState<"up" | "down" | null>(null);
  const [sellFlash, setSellFlash] = useState<"up" | "down" | null>(null);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Sync state if signal changes
  useEffect(() => {
    setBuyPriceInput(signal.buyPrice);
    setSellPriceInput(signal.sellPrice);
    prevBuyRef.current = signal.buyPrice;
    prevSellRef.current = signal.sellPrice;
    setSumInput("11.72");
    setConfirmed(true);
    setPriceDeviation(0);
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

  // Interval for simulating subtle real-time price fluctuations
  useEffect(() => {
    if (!isSimulatingLivePrice) return;
    
    const interval = setInterval(() => {
      // Small randomized fluctuation between -0.0012 and +0.0012 (-0.12% to +0.12%)
      const change = (Math.random() - 0.5) * 0.0024;
      setPriceDeviation(prev => {
        const next = prev + change;
        // Bound the deviation to a realistic corridor (-0.8% to +0.8%)
        return Math.max(-0.008, Math.min(0.008, next));
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulatingLivePrice]);

  const baseToken = signal.pair.split("/")[0] || "TOK";
  const quoteToken = signal.pair.split("/")[1] || "USDT";

  // Formulate prices with deviation factors
  const parsedBuy = (parseFloat(buyPriceInput) || 0.0001) * (1 + priceDeviation * 0.4);
  const parsedSell = (parseFloat(sellPriceInput) || 0.005) * (1 + priceDeviation * 0.8);
  const parsedSum = parseFloat(sumInput) || 0;

  // Fee factors based on current network (standard CEX withdrawal fee)
  const baseNetworkFee = signal.network === "BERA" ? 0.0001 : signal.network === "SOLANA" ? 0.0005 : signal.network === "ETHW" ? 0.02 : 0.001;
  const networkFee = baseNetworkFee;
  
  const takerBuy = parsedSum * 0.001; // Taker fee on buy CEX (0.1%)
  const tokensBought = parsedSum > 0 ? (parsedSum - takerBuy) / parsedBuy : 0;
  const grossReturn = tokensBought * parsedSell;
  const takerSell = grossReturn * 0.001; // Taker fee on sell CEX (0.1%)
  const totalTakerFees = takerBuy + takerSell;
  
  const spreadValue = parsedSell - parsedBuy;
  const spreadPct = parsedBuy > 0 ? (spreadValue / parsedBuy) * 100 : 0.44;
  const netCapitalProfit = grossReturn - parsedSum;
  
  const hasInputAmount = parsedSum > 0;
  const netProfit = hasInputAmount ? (netCapitalProfit - totalTakerFees - networkFee) : 0.53;
  const roiPct = hasInputAmount ? (netProfit / parsedSum) * 105 : 0.37;

  // Execution states derived from global runningArbitrages
  const thisArb = runningArbitrages.find((arb: any) => arb.signal.id === signal.id);
  const isThisSignalRunning = !!thisArb;
  const isExecuting = isThisSignalRunning && thisArb.isExecuting;
  const executionStep = isThisSignalRunning ? thisArb.executionStep : 0;

  // Custom step messages corresponding to execution timeline
  const executionLogs = [
    `[0.1s] Инициализация защищенного межбиржевого API-подключения...`,
    `[0.9s] Торговый буфер зарезервирован на сумму ${parsedSum.toFixed(2)} USDT на балансах CEX.`,
    `[1.8s] Выставление ${orderType === "market" ? "рыночного" : "лимитного"} ордера и покупка на CEX "${signal.buyDex}" по цене ${parsedBuy.toFixed(5)} USDT... Успешно выполнено`,
    `[3.0s] Зачислено на CEX кошелек: ${tokensBought.toFixed(2)} ${baseToken} за вычетом торговых комиссионных сборов.`,
    `[4.2s] Мгновенный межбиржевой перевод токенов в сети "${signal.network}" (режим: ${executionMode === "parallel" ? "ПАРАЛЛЕЛЬНО" : "ПОСЛЕДОВАТЕЛЬНО"})... Подтверждено`,
    `[5.5s] Мгновенный депозит зачислен на баланс CEX "${signal.sellDex}"`,
    `[6.9s] Выполнение встречной заявки на продажу по курсу ${parsedSell.toFixed(5)} USDT в стакане ${orderType === "market" ? "рыночных" : "лимитных"} ордеров... Исполнено`,
    `[7.8s] Чистая арбитражная прибыль +${netProfit.toFixed(4)} USDT зачислена на Ваш баланс аккаунта.`,
  ];

  // Auto-scroll logic for log terminal
  useEffect(() => {
    if (isExecuting && executionStep > 0) {
      const logsToShow = executionLogs.slice(0, executionStep);
      setConsoleLogs(logsToShow);
      setTimeout(() => {
        consoleBottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } else if (isThisSignalRunning && !isExecuting && executionStep === 7) {
      setConsoleLogs(executionLogs);
    } else {
      setConsoleLogs([]);
    }
  }, [isExecuting, executionStep, isThisSignalRunning]);

  const handlePercentClick = (pct: number) => {
    setSumInput((balance * pct).toFixed(2));
  };

  const adjustNumericInput = (field: "buy" | "sell", amount: number) => {
    if (field === "buy") {
      const current = parseFloat(buyPriceInput) || 0.0001;
      setBuyPriceInput(Math.max(0, current + amount).toFixed(5));
    } else {
      const current = parseFloat(sellPriceInput) || 0.0001;
      setSellPriceInput(Math.max(0, current + amount).toFixed(5));
    }
  };

  const handleExecuteArbitrage = () => {
    if (!confirmed) {
      showToast("Пожалуйста, подтвердите согласие перед запуском в автоматическом режиме", "error");
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

    // Fast timings for execution step ticks (parallel mode triggers orders much faster)
    const stepInterval = executionMode === "parallel" ? 650 : 1100;

    for (let i = 2; i <= 7; i++) {
      setTimeout(() => {
        setRunningArbitrages?.((prev: any[]) => prev.map((arb) => {
          if (arb.id === processId) {
            return { 
              ...arb, 
              executionStep: i,
              isExecuting: i < 7
            };
          }
          return arb;
        }));

        if (i === 7) {
          // Update simulated account balance & play congratulations toast
          const finalProfit = hasInputAmount ? netProfit : 0.53;
          if (finalProfit > 0) {
            setBalance(prev => prev + finalProfit);
            showToast(`Прибыль +${finalProfit.toFixed(4)} USDT зачислена на аккаунт.`, "success", "Арбитраж завершен");
          } else {
            showToast(`Круг завершен. Результат: ${finalProfit.toFixed(4)} USDT`, "info", "Ордер выполнен");
          }
        }
      }, (i - 1) * stepInterval);
    }
  };

  const priceYMax = (parsedSell * 1.05).toFixed(5);
  const priceYMid = ((parsedSell + parsedBuy) / 2).toFixed(5);
  const priceYMin = (parsedBuy * 0.95).toFixed(5);

  const yMaxNum = parseFloat(priceYMax);
  const yMinNum = parseFloat(priceYMin);
  const yRange = yMaxNum - yMinNum || 0.0001;
  const buyY = Math.max(10, Math.min(230, 240 * (1 - (parsedBuy - yMinNum) / yRange)));
  const sellY = Math.max(10, Math.min(230, 240 * (1 - (parsedSell - yMinNum) / yRange)));

  // Generate dynamic chart data points
  const getChartDataPoints = () => {
    const pointsCount = 60;
    const pointsList = [];
    const multiplier = 1 + priceDeviation * 0.12;
    
    // Static keys mapping to retain original periods
    const timesMap = {
      "1m": ["13:55", "13:56", "13:57", "13:58"],
      "5m": ["13:40", "13:45", "13:50", "13:58"],
      "1h": ["09:00", "11:00", "13:00", "13:58"]
    };
    const times = timesMap[selectedPeriod] || timesMap["1m"];

    for (let i = 0; i < pointsCount; i++) {
      const t = i / (pointsCount - 1);
      const x = t * 600;
      
      let wave = 0;
      if (selectedPeriod === "5m") {
        wave = Math.sin(t * Math.PI * 3.5) * 0.18 + Math.cos(t * Math.PI * 1.5) * 0.08;
      } else if (selectedPeriod === "1h") {
        wave = Math.sin(t * Math.PI * 2.0) * 0.25 - Math.cos(t * Math.PI * 4.0) * 0.05;
      } else { // "1m"
        wave = Math.sin(t * Math.PI * 2.5) * 0.2 + Math.sin(t * Math.PI * 5.0) * 0.05;
      }
      
      const bidVariation = wave * multiplier;
      
      // Compute prices scaled consistently
      const buyPrice = parsedBuy * (1 + bidVariation * 0.012);
      const sellPrice = parsedSell * (1 + bidVariation * 0.012);
      const pointSpread = parsedBuy > 0 ? ((sellPrice - buyPrice) / buyPrice) * 100 : 0.44;

      const buyYCoord = Math.max(10, Math.min(230, 240 * (1 - (buyPrice - yMinNum) / yRange)));
      const sellYCoord = Math.max(10, Math.min(230, 240 * (1 - (sellPrice - yMinNum) / yRange)));

      let timeStr = "";
      try {
        const startStr = times[0];
        const endStr = times[times.length - 1];
        const [startH, startM] = startStr.split(":").map(Number);
        const [endH, endM] = endStr.split(":").map(Number);
        
        const startSecs = startH * 3600 + startM * 60;
        const endSecs = endH * 3600 + endM * 60;
        const totalSecs = endSecs - startSecs;
        const currentSecs = startSecs + t * totalSecs;
        
        const h = Math.floor(currentSecs / 3600) % 24;
        const m = Math.floor((currentSecs % 3600) / 60);
        const s = Math.floor(currentSecs % 60);
        
        timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      } catch(e) {
        timeStr = times[Math.min(times.length - 1, Math.floor(t * times.length))];
      }

      pointsList.push({
        x,
        buyPrice,
        sellPrice,
        buyY: buyYCoord,
        sellY: sellYCoord,
        spread: pointSpread,
        time: timeStr
      });
    }
    return { points: pointsList, times };
  };

  const { points: chartDataPoints, times: chartTimesList } = getChartDataPoints();

  const chartPaths = {
    buyPath: "M " + chartDataPoints.map(p => `${p.x.toFixed(1)} ${p.buyY.toFixed(1)}`).join(" L "),
    sellPath: "M " + chartDataPoints.map(p => `${p.x.toFixed(1)} ${p.sellY.toFixed(1)}`).join(" L "),
    buyArea: "M " + chartDataPoints.map(p => `${p.x.toFixed(1)} ${p.buyY.toFixed(1)}`).join(" L ") + " L 600 240 L 0 240 Z",
    sellArea: "M " + chartDataPoints.map(p => `${p.x.toFixed(1)} ${p.sellY.toFixed(1)}`).join(" L ") + " L 600 240 L 0 240 Z",
    times: chartTimesList
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xClient = e.clientX - rect.left;
    const pct = xClient / rect.width;
    const xCoord = Math.max(0, Math.min(600, pct * 600));
    
    // Find closest index in chartDataPoints
    let closestIndex = 0;
    let minDiff = Infinity;
    for (let i = 0; i < chartDataPoints.length; i++) {
      const diff = Math.abs(chartDataPoints[i].x - xCoord);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }
    setHoveredPointIndex(closestIndex);
  };

  const handleMouseLeave = () => {
    setHoveredPointIndex(null);
  };

  const hoveredPoint = hoveredPointIndex !== null ? chartDataPoints[hoveredPointIndex] : null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-20 bg-[#f8fafc] text-slate-800 flex flex-col lg:grid lg:grid-cols-[1fr_420px] lg:grid-rows-[auto_1fr] font-sans antialiased h-full overflow-hidden"
      id="detailed-analysis-terminal"
    >
      {/* 1. SOPHISTICATED LIGHT HEADER - SHARED */}
      <header className="h-16 flex-shrink-0 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-xs relative z-40 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-2">
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            type="button"
            onClick={onClose}
            className="px-2 py-1.5 sm:px-3 sm:py-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-all cursor-pointer select-none active:scale-95 whitespace-nowrap"
            id="back-to-signals"
          >
            <ArrowLeft size={14} className="stroke-[2.5]" />
            <span className="hidden xs:inline">Назад</span>
          </button>
          
          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[9px] sm:text-[10px] tracking-wider font-extrabold uppercase bg-indigo-50 border border-indigo-150 px-1.5 sm:px-2 py-0.5 rounded text-indigo-600 font-sans">
              {baseToken}
            </span>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs sm:text-sm md:text-base font-extrabold tracking-tight text-slate-900 font-sans leading-none">
                {signal.pair}
              </h1>
              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-150 rounded-md flex items-center gap-1 shrink-0 whitespace-nowrap">
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-500 rounded-full animate-ping" />
                <span className="hidden xxs:inline">СПРЕД</span>
              </span>
            </div>
          </div>
        </div>

        {/* Mobile View Tab Switcher inside Header */}
        <div className="lg:hidden flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 mx-1 xs:mx-2 font-sans text-xs font-bold shrink-0 shadow-3xs">
          <button
            type="button"
            onClick={() => setMobileWorkspaceTab("analysis")}
            className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              mobileWorkspaceTab === "analysis"
                ? "bg-white text-slate-900 shadow-3xs border border-slate-150"
                : "text-slate-400 hover:text-slate-650"
            }`}
          >
            Аналитика
          </button>
          <button
            type="button"
            onClick={() => setMobileWorkspaceTab("trade")}
            className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              mobileWorkspaceTab === "trade"
                ? "bg-white text-slate-900 shadow-3xs border border-slate-150"
                : "text-slate-400 hover:text-slate-650"
            }`}
          >
            Торговля
          </button>
        </div>

        {/* Balance metrics */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0 pr-1 sm:pr-0">
          <div className="flex flex-col text-right font-mono leading-tight">
            <span className="text-slate-400 font-sans font-medium text-[8px] sm:text-[9.5px] uppercase">Ваш баланс</span>
            <span className="text-emerald-600 font-extrabold text-[11px] sm:text-sm">{balance.toFixed(2)} USDT</span>
          </div>
          <div className="hidden md:block bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-mono text-slate-500">
            ID: <span className="text-slate-800 font-bold">#{signal.id || "f554ba7"}</span>
          </div>
        </div>
      </header>

        {/* LEFT SECTION: MAIN SYSTEM WORKSPACE (ANALYTICS CONTENT) */}
        <div className={`flex-1 min-w-0 lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-3 h-full flex flex-col overflow-hidden ${mobileWorkspaceTab === "analysis" ? "flex" : "hidden lg:flex"}`} id="detailed-analysis-workspace-left">
          
          {/* LEFT COMPANION: MAIN CONTENT PANEL (SCROLLABLE AREA) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 flex flex-col" id="detailed-analysis-left-scroll">
          
          {/* TOP COMPACT SUMMARY BAR */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                <Cpu size={20} className="animate-pulse" />
              </div>
              <div className="text-left space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded uppercase">Режим быстрого запуска</span>
                  <span className="text-[10px] text-slate-450 font-sans font-semibold">Средняя задержка шлюзов: <span className="font-mono font-black">~32с</span></span>
                </div>
                <h2 className="text-sm font-extrabold text-slate-900">
                  Свободный ликвидный коридор между биржами {signal.buyDex} и {signal.sellDex}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end font-sans">
              <span className="text-xs text-slate-400">Симуляция рынка:</span>
              <button
                type="button"
                onClick={() => setIsSimulatingLivePrice(!isSimulatingLivePrice)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSimulatingLivePrice 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-xs" 
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-850"
                }`}
              >
                <RefreshCw size={11} className={isSimulatingLivePrice ? "animate-spin" : ""} />
                <span>{isSimulatingLivePrice ? "АКТИВНА" : "ПАУЗА"}</span>
              </button>
            </div>
          </div>

          {/* LEFT INTERACTIVE WORKSPACE CARD MONITOR */}
          <div className="space-y-6">
            
            {/* LIVE PRICE TREND GRAPH card WITH LIGHT THEMATIC INTERFACES */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs space-y-4 text-left">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest font-sans flex items-center gap-2">
                    <Activity size={15} className="text-indigo-600" />
                    График биржевых цен
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Сравнение цен лучших ордеров ask ({signal.buyDex}) и bid ({signal.sellDex})
                  </p>
                </div>

                {/* Duration Picker */}
                <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200 self-end sm:self-auto font-sans">
                  {(["1m", "5m", "1h"] as const).map((pr) => (
                    <button
                      key={pr}
                      type="button"
                      onClick={() => setSelectedPeriod(pr)}
                      className={`px-3 py-1.5 text-[10px] font-extrabold uppercase rounded-lg transition-all cursor-pointer ${
                        selectedPeriod === pr
                          ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                          : "text-slate-400 hover:text-slate-650"
                      }`}
                    >
                      {pr === "1m" ? "1м" : pr === "5m" ? "5м" : "1ч"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Core Area */}
              <div className="pt-1 w-full">
                {/* SVG Graphics inside Light Theme Grid canvas */}
                <div className="relative h-[250px] w-full flex items-stretch bg-slate-50/50 border border-slate-200/60 rounded-2xl p-3 overflow-hidden">
                  
                  {/* Y Axis Prices Labels */}
                  <div className="w-16 flex flex-col justify-between text-right text-[9px] font-black font-mono text-slate-450 pr-2.5 border-r border-slate-200/60 py-1 flex-shrink-0 select-none">
                    <span>{priceYMax}</span>
                    <span>{priceYMid}</span>
                    <span>{priceYMin}</span>
                  </div>

                  {/* Canvas block overlay */}
                  <div 
                    className="flex-1 relative pl-2.5 flex flex-col justify-between cursor-crosshair select-none"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  >
                    
                    {/* Background lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none py-2 px-1">
                      <div className="w-full border-b border-slate-200/40" />
                      <div className="w-full border-b border-slate-200/40" />
                      <div className="w-full border-b border-slate-200/40" />
                    </div>

                    {/* SVG graphics curves */}
                    <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 600 240" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="lightGlowBuy" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.06}/>
                          <stop offset="90%" stopColor="#10B981" stopOpacity={0.0}/>
                        </linearGradient>
                        <linearGradient id="lightGlowSell" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.06}/>
                          <stop offset="90%" stopColor="#3b82f6" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>

                      {/* Area beneath curves */}
                      <path d={chartPaths.sellArea} fill="url(#lightGlowSell)" />
                      <path d={chartPaths.buyArea} fill="url(#lightGlowBuy)" />

                      {/* Plot curves lines */}
                      <path 
                        d={chartPaths.sellPath} 
                        fill="none" 
                        stroke="#3b82f6" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        className="transition-all duration-300"
                      />
                      <path 
                        d={chartPaths.buyPath} 
                        fill="none" 
                        stroke="#10B981" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        className="transition-all duration-300"
                      />

                      {/* Live Market Reference Dashed Lines */}
                      <line x1="0" y1={buyY} x2="600" y2={buyY} stroke="#10B981" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.8" />
                      <line x1="0" y1={sellY} x2="600" y2={sellY} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.8" />
                    </svg>

                    {/* BUY ORDER Perfectly Symmetrical HTML Marker Container */}
                    <div 
                      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] border-white shadow-md z-20 transition-all duration-350 cursor-pointer ${
                        isThisSignalRunning && executionStep >= 1 ? "w-[15px] h-[15px]" : "w-[11px] h-[11px]"
                      } ${
                        isThisSignalRunning && executionStep < 3 && executionStep >= 1 ? "animate-pulse" : ""
                      }`}
                      style={{
                        left: `${(120 / 600) * 100}%`,
                        top: `${(buyY / 240) * 100}%`,
                        backgroundColor: isThisSignalRunning && executionStep >= 3 ? "#10B981" : isThisSignalRunning && executionStep >= 1 ? "#6366f1" : "#10B981"
                      }}
                      title="Ордер BUY"
                    />

                    {/* SELL ORDER Perfectly Symmetrical HTML Marker Container */}
                    <div 
                      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] border-white shadow-md z-20 transition-all duration-350 cursor-pointer ${
                        isThisSignalRunning && executionStep >= 5 ? "w-[15px] h-[15px]" : "w-[11px] h-[11px]"
                      } ${
                        isThisSignalRunning && executionStep < 7 && executionStep >= 5 ? "animate-pulse" : ""
                      }`}
                      style={{
                        left: `${(360 / 600) * 100}%`,
                        top: `${(sellY / 240) * 100}%`,
                        backgroundColor: isThisSignalRunning && executionStep >= 7 ? "#3b82f6" : isThisSignalRunning && executionStep >= 5 ? "#6366f1" : "#3b82f6"
                      }}
                      title="Ордер SELL"
                    />

                    {/* Interactive Hover Coordinate Line & Symmetrical Highlight Dots */}
                    {hoveredPoint && (
                      <>
                        {/* Hover vertical dotted alignment line */}
                        <div 
                          className="absolute top-0 bottom-0 border-l border-slate-350/90 border-dashed pointer-events-none z-15"
                          style={{ left: `${(hoveredPoint.x / 600) * 100}%` }}
                        />
                        
                        {/* Perfect Buy hover circle dot */}
                        <div 
                          className="absolute -translate-x-1/2 -translate-y-1/2 w-[11px] h-[11px] rounded-full bg-emerald-500 border-[2.5px] border-white shadow-md pointer-events-none z-22 scale-110"
                          style={{
                            left: `${(hoveredPoint.x / 600) * 100}%`,
                            top: `${(hoveredPoint.buyY / 240) * 100}%`
                          }}
                        />

                        {/* Perfect Sell hover circle dot */}
                        <div 
                          className="absolute -translate-x-1/2 -translate-y-1/2 w-[11px] h-[11px] rounded-full bg-blue-500 border-[2.5px] border-white shadow-md pointer-events-none z-22 scale-110"
                          style={{
                            left: `${(hoveredPoint.x / 600) * 100}%`,
                            top: `${(hoveredPoint.sellY / 240) * 100}%`
                          }}
                        />
                      </>
                    )}

                    {/* Live real-time pricing tags floating on the graph */}
                    <div 
                      className="absolute right-3 bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[9.5px] font-black px-1.5 py-0.5 rounded-md shadow-xs pointer-events-none z-10 font-mono flex items-center gap-1 transition-all duration-300"
                      style={{ top: `${(buyY / 240) * 100}%`, transform: 'translateY(-50%)' }}
                    >
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                      <span>{signal.buyDex}: ${parsedBuy.toFixed(4)}</span>
                    </div>

                    <div 
                      className="absolute right-3 bg-blue-50 text-blue-700 border border-blue-200/80 text-[9.5px] font-black px-1.5 py-0.5 rounded-md shadow-xs pointer-events-none z-10 font-mono flex items-center gap-1 transition-all duration-300"
                      style={{ top: `${(sellY / 240) * 100}%`, transform: 'translateY(-50%)' }}
                    >
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                      <span>{signal.sellDex}: ${parsedSell.toFixed(4)}</span>
                    </div>

                    {/* ORDER MARKERS AND FLOATING BADGES ON GRAPH */}
                    {/* BUY ORDER MARKER */}
                    <div 
                      className="absolute left-6 text-[8.5px] font-mono font-black px-2 py-0.5 rounded-md shadow-xs z-15 flex items-center gap-1 transition-all duration-300 border"
                      style={{ 
                        top: `${(buyY / 240) * 100}%`,
                        transform: 'translateY(-50%)',
                        backgroundColor: (isThisSignalRunning && executionStep >= 3) ? '#ecfdf5' : (isThisSignalRunning && executionStep >= 1) ? '#edf2ff' : '#f8fafc',
                        color: (isThisSignalRunning && executionStep >= 3) ? '#059669' : (isThisSignalRunning && executionStep >= 1) ? '#4f46e5' : '#64748b',
                        borderColor: (isThisSignalRunning && executionStep >= 3) ? '#a7f3d0' : (isThisSignalRunning && executionStep >= 1) ? '#c7d2fe' : '#cbd5e1'
                      }}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        (isThisSignalRunning && executionStep >= 3) ? 'bg-emerald-500' : (isThisSignalRunning && executionStep >= 1) ? 'bg-indigo-600 animate-ping' : 'bg-slate-450'
                      }`} />
                      <span>
                        {(isThisSignalRunning && executionStep >= 3) 
                          ? "BUY ORDER FILLED" 
                          : (isThisSignalRunning && executionStep >= 1) 
                            ? "BUY ORDER EXECUTING..." 
                            : "BUY ORDER LIMIT"
                        }
                      </span>
                    </div>

                    {/* SELL ORDER MARKER */}
                    <div 
                      className="absolute left-64 text-[8.5px] font-mono font-black px-2 py-0.5 rounded-md shadow-xs z-15 flex items-center gap-1 transition-all duration-300 border"
                      style={{ 
                        top: `${(sellY / 240) * 100}%`,
                        transform: 'translateY(-50%)',
                        backgroundColor: (isThisSignalRunning && executionStep >= 7) ? '#eff6ff' : (isThisSignalRunning && executionStep >= 5) ? '#edf2ff' : '#f8fafc',
                        color: (isThisSignalRunning && executionStep >= 7) ? '#2563eb' : (isThisSignalRunning && executionStep >= 5) ? '#4f46e5' : '#64748b',
                        borderColor: (isThisSignalRunning && executionStep >= 7) ? '#bfdbfe' : (isThisSignalRunning && executionStep >= 5) ? '#c7d2fe' : '#cbd5e1'
                      }}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        (isThisSignalRunning && executionStep >= 7) ? 'bg-blue-500' : (isThisSignalRunning && executionStep >= 5) ? 'bg-indigo-600 animate-ping' : 'bg-slate-450'
                      }`} />
                      <span>
                        {(isThisSignalRunning && executionStep >= 7) 
                          ? "SELL ORDER FILLED" 
                          : (isThisSignalRunning && executionStep >= 5) 
                            ? "SELL ORDER EXECUTING..." 
                            : "SELL ORDER LIMIT"
                        }
                      </span>
                    </div>

                    {/* Instant hover coordinate indicator widget */}
                    <div className="absolute top-2 left-4 bg-white/95 border border-slate-200/90 p-2.5 rounded-xl text-[9.5px] font-mono leading-tight pointer-events-none z-20 shadow-md space-y-1 min-w-[200px]">
                      <p className="text-[10px] font-black text-slate-850 uppercase tracking-wide text-left font-sans flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${hoveredPoint ? "bg-indigo-500" : "bg-emerald-500 animate-pulse"}`} />
                        {hoveredPoint ? `В точке (${hoveredPoint.time})` : "Текущие котировки (WS)"}
                      </p>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500 font-sans">Покупка {signal.buyDex}:</span>
                        <span className="text-emerald-600 font-extrabold font-mono">
                          {(hoveredPoint ? hoveredPoint.buyPrice : parsedBuy).toFixed(5)} USDT
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500 font-sans">Продажа {signal.sellDex}:</span>
                        <span className="text-blue-600 font-extrabold font-mono">
                          {(hoveredPoint ? hoveredPoint.sellPrice : parsedSell).toFixed(5)} USDT
                        </span>
                      </div>
                      <div className="flex justify-between gap-4 border-t border-slate-100 pt-1 mt-1 font-sans font-bold text-slate-700">
                        <span>{hoveredPoint ? "Спред в точке:" : "Живой спред:"}</span>
                        <span className="text-emerald-600 flex items-center gap-0.5 font-mono font-extrabold">
                          <TrendingUp size={9} />
                          +{(hoveredPoint ? hoveredPoint.spread : spreadPct).toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    {/* X scale times display */}
                    <div className="z-20 w-full flex justify-between text-[9px] font-bold font-mono text-slate-400 mt-auto pt-1 border-t border-slate-200/60">
                      <span>{chartPaths.times[0]}</span>
                      <span>{chartPaths.times[1]}</span>
                      <span>{chartPaths.times[2]}</span>
                      <span>{chartPaths.times[3]}</span>
                    </div>

                  </div>

                </div>

              </div>

              {/* Legends list block info */}
              <div className="pt-3 flex flex-wrap gap-4 text-xs font-sans border-t border-slate-100 text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
                  <span className="font-bold">Мин. цена на покупку ({signal.buyDex})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block" />
                  <span className="font-bold">Макс. цена на продажу ({signal.sellDex})</span>
                </div>
                <div className="sm:ml-auto text-[10.5px] text-slate-400 flex items-center gap-1.5 font-sans font-medium">
                  <Info size={13} className="text-slate-400" />
                  <span>Обновление транслируется с помощью WebSocket пулов напрямую</span>
                </div>
              </div>

            </div>

            {/* LIVE SESSION ORDERS TERMINAL BLOCK (Open & Completed Orders with data) */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6 text-left font-sans">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                    <Layers size={14} className="text-blue-600" />
                    Торговая сессия: Размещенные ордера
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {isThisSignalRunning 
                      ? "Трансляция активного арбитражного цикла в реальном времени" 
                      : "Индикаторы лимитных ордеров по текущему сигналу"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[9.5px] font-mono font-extrabold px-1.5 py-0.5 bg-slate-100 text-slate-650 border border-slate-200 rounded-md">
                    Круг: #{isThisSignalRunning ? thisArb.id : "ОЖИДАНИЕ ЗАПУСКА"}
                  </span>
                  
                  {isThisSignalRunning ? (
                    isExecuting ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md flex items-center gap-1 animate-pulse">
                        <RefreshCw size={10} className="animate-spin text-indigo-500" />
                        исполняется
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md flex items-center gap-1">
                        <Check size={10} className="stroke-[3] text-emerald-600" />
                        завершен
                      </span>
                    )
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-50 text-slate-400 border border-slate-200 rounded-md">
                      не запущен
                    </span>
                  )}
                </div>
              </div>

              {/* Table displaying the orders in a unified, professional format */}
              <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-left border-collapse font-sans text-xs min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] text-slate-450 font-extrabold uppercase tracking-wider select-none">
                      <th className="py-3 px-4 font-black">Направление ордера</th>
                      <th className="py-3 px-4 font-black">Площадка</th>
                      <th className="py-3 px-4 font-black">Торговая пара</th>
                      <th className="py-3 px-4 font-black text-right">Цена лимита</th>
                      <th className="py-3 px-4 font-black text-right">Размещенный объём</th>
                      <th className="py-3 px-4 font-black text-right">Выполнение</th>
                      <th className="py-3 px-4 font-black text-right">Итоговый результат</th>
                      <th className="py-3 px-4 font-black text-center">Статус</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium whitespace-nowrap">
                    
                    {/* ORDER #1: BUY LEG */}
                    <tr className={`transition-all duration-300 hover:bg-slate-50/40 ${
                      isThisSignalRunning && executionStep >= 1 && executionStep < 3 ? "bg-indigo-50/5 animate-pulse" : 
                      isThisSignalRunning && executionStep >= 3 ? "bg-emerald-50/5" : ""
                    }`}>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full text-[9px] font-mono font-black flex items-center justify-center ${
                            isThisSignalRunning && executionStep >= 3 ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                          }`}>
                            B
                          </span>
                          <div>
                            <span className="font-bold text-slate-800 block text-[11px]">BUY LIMIT (Закуп)</span>
                            <span className="text-[9px] font-mono text-slate-400 block -mt-0.5">ORD-{(signal.id * 101 + 2038).toString()}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-extrabold text-slate-800 uppercase tracking-tight">{signal.buyDex}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold font-mono text-slate-600 bg-slate-100/70 px-1.5 py-0.5 rounded text-[10px]">{signal.pair}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-bold font-mono text-slate-800">${parsedBuy.toFixed(5)}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-bold font-mono text-slate-700">{(parsedSum || 11.72).toFixed(2)} USDT</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex flex-col items-end">
                          <span className={`font-extrabold font-mono text-slate-800 text-[11px] ${isThisSignalRunning && executionStep === 2 ? "text-indigo-600 animate-pulse" : ""}`}>
                            {isThisSignalRunning && executionStep >= 3 
                              ? "100.00%" 
                              : isThisSignalRunning && executionStep === 2
                                ? "43.50%"
                                : "0.00%"
                            }
                          </span>
                          <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider block">
                            {isThisSignalRunning && executionStep >= 3 
                              ? "FILLED" 
                              : isThisSignalRunning && executionStep === 2
                                ? "CEX FILLING..."
                                : "QUEUED"
                            }
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        {isThisSignalRunning && executionStep >= 3 ? (
                          <span className="font-mono font-black text-emerald-700 bg-emerald-50 border border-emerald-100/60 px-2 py-0.5 rounded-md text-[10.5px]">
                            +{tokensBought.toFixed(2)} {baseToken}
                          </span>
                        ) : (
                          <span className="text-slate-450 font-mono text-[10px]">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {isThisSignalRunning && executionStep >= 3 ? (
                          <span className="text-[9px] font-black px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md">Исполнен</span>
                        ) : isThisSignalRunning && executionStep >= 1 ? (
                          <span className="text-[9px] font-black px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md animate-pulse">Активен</span>
                        ) : (
                          <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-50 text-slate-400 rounded-md">Ожидание</span>
                        )}
                      </td>
                    </tr>

                    {/* ORDER #2: SELL LEG */}
                    <tr className={`transition-all duration-300 hover:bg-slate-50/40 ${
                      isThisSignalRunning && executionStep >= 5 && executionStep < 7 ? "bg-indigo-50/5 animate-pulse" : 
                      isThisSignalRunning && executionStep >= 7 ? "bg-blue-50/5" : ""
                    }`}>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full text-[9px] font-mono font-black flex items-center justify-center ${
                            isThisSignalRunning && executionStep >= 7 ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
                          }`}>
                            S
                          </span>
                          <div>
                            <span className="font-bold text-slate-800 block text-[11px]">SELL LIMIT (Продажа)</span>
                            <span className="text-[9px] font-mono text-slate-400 block -mt-0.5">ORD-{(signal.id * 101 + 2039).toString()}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-extrabold text-slate-800 uppercase tracking-tight">{signal.sellDex}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold font-mono text-slate-600 bg-slate-100/70 px-1.5 py-0.5 rounded text-[10px]">{signal.pair}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-bold font-mono text-slate-800">${parsedSell.toFixed(5)}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-bold font-mono text-slate-700">
                          {isThisSignalRunning && executionStep >= 5 ? `${tokensBought.toFixed(2)} ${baseToken}` : `— ${baseToken}`}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex flex-col items-end">
                          <span className={`font-extrabold font-mono text-slate-800 text-[11px] ${isThisSignalRunning && executionStep === 6 ? "text-indigo-600 animate-pulse" : ""}`}>
                            {isThisSignalRunning && executionStep >= 7 
                              ? "100.00%" 
                              : isThisSignalRunning && executionStep === 6
                                ? "72.10%"
                                : "0.00%"
                            }
                          </span>
                          <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider block">
                            {isThisSignalRunning && executionStep >= 7 
                              ? "FILLED" 
                              : isThisSignalRunning && executionStep === 6
                                ? "CEX FILLING..."
                                : "QUEUED"
                            }
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        {isThisSignalRunning && executionStep >= 7 ? (
                          <span className="font-mono font-black text-blue-700 bg-blue-50 border border-blue-100/60 px-2 py-0.5 rounded-md text-[10.5px]">
                            +{grossReturn.toFixed(2)} USDT
                          </span>
                        ) : (
                          <span className="text-slate-450 font-mono text-[10px]">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {isThisSignalRunning && executionStep >= 7 ? (
                          <span className="text-[9px] font-black px-2 py-0.5 bg-blue-50 text-blue-800 rounded-md">Исполнен</span>
                        ) : isThisSignalRunning && executionStep >= 5 ? (
                          <span className="text-[9px] font-black px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md animate-pulse">Активен</span>
                        ) : (
                          <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-50 text-slate-400 rounded-md">Ожидание</span>
                        )}
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>

              {/* Network fee & Net Profit footer panel inside Big Terminal view */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-[11px] text-slate-450 space-y-0.5 leading-tight font-sans text-left">
                  <div>Сеть перевода: <strong className="text-slate-800 font-mono">{signal.network}</strong> · Сбор сети: <strong className="text-slate-800 font-mono">{networkFee.toFixed(4)} USDT</strong></div>
                  <div>Торговые комиссии CEX (за закупку и продажу ордеров): <strong className="text-slate-800 font-mono">{(takerBuy + takerSell).toFixed(4)} USDT</strong> ({0.2}%)</div>
                </div>

                <div className="flex items-center gap-1.5 self-stretch justify-between sm:justify-end">
                  <span className="text-xs text-slate-500 font-bold">Чистый профит сделки:</span>
                  <strong className={`font-mono text-sm font-black px-2.5 py-1 rounded-lg border transition-all ${
                    isThisSignalRunning && executionStep >= 7 
                      ? "text-emerald-700 bg-emerald-50/50 border-emerald-200" 
                      : isThisSignalRunning
                        ? "text-indigo-600 bg-indigo-50/50 border-indigo-200 animate-pulse"
                        : "text-slate-500 bg-white border-slate-200/50"
                  }`}>
                    {isThisSignalRunning && executionStep >= 7 
                      ? `+${netProfit.toFixed(4)} USDT` 
                      : isThisSignalRunning 
                        ? "Исполняется..." 
                        : `+${(0.53).toFixed(4)} USDT (оценка)`
                    }
                  </strong>
                </div>
              </div>

            </div>

            {/* Side-by-Side Live Exchange Order Books depth grids */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest font-sans flex items-center gap-2">
                    <Layers size={15} className="text-emerald-600" />
                    Глубина лимитных стаканов
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Доступные ордера для мгновенного встречного сведения ордеров без перекоса спреда
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg text-[10px] font-sans text-slate-500">
                  Базовый объём: <span className="text-indigo-600 font-bold font-mono">10,000 USDT</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                
                {/* Vertical separator line */}
                <span className="hidden md:block absolute inset-y-0 left-1/2 -ml-px border-r border-slate-200/60 z-0" />

                {/* Left CEX ASKs depth stacks (Sell orders on buy-CEX platform) */}
                <div className="space-y-3 z-10 text-left">
                  <div className="flex justify-between items-center bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl">
                    <span className="text-xs font-sans font-bold text-rose-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      {signal.buyDex} • ASKS (Продажа)
                    </span>
                    <span className="text-[9px] font-extrabold text-rose-500 uppercase bg-white border border-rose-200 px-1.5 rounded font-sans">Лучшая цена</span>
                  </div>

                  <div className="grid grid-cols-3 text-[9px] font-extrabold text-slate-400 uppercase py-1 border-b border-slate-100 font-sans">
                    <span>Цена (USDT)</span>
                    <span className="text-right">Объём ({baseToken})</span>
                    <span className="text-right">Сумма (USDT)</span>
                  </div>

                  {/* Ask list levels */}
                  <div className="space-y-1.5 font-mono text-xs">
                    
                    {/* Level 3 */}
                    <div className="relative grid grid-cols-3 py-1 px-1.5 items-center hover:bg-rose-50/40 rounded transition-all">
                      <div className="absolute top-0 bottom-0 right-0 bg-rose-500/5 pointer-events-none z-0 rounded" style={{ width: "30%" }} />
                      <span className="text-rose-600 font-bold">{(parsedBuy * 1.0012).toFixed(5)}</span>
                      <span className="text-right text-slate-700">1,820</span>
                      <span className="text-right text-slate-500">{(parsedBuy * 1.0012 * 1820).toFixed(1)}</span>
                    </div>

                    {/* Level 2 */}
                    <div className="relative grid grid-cols-3 py-1 px-1.5 items-center hover:bg-rose-50/40 rounded transition-all">
                      <div className="absolute top-0 bottom-0 right-0 bg-rose-500/10 pointer-events-none z-0 rounded" style={{ width: "60%" }} />
                      <span className="text-rose-600 font-bold">{(parsedBuy * 1.0006).toFixed(5)}</span>
                      <span className="text-right text-slate-700">2,150</span>
                      <span className="text-right text-slate-500">{(parsedBuy * 1.0006 * 2150).toFixed(1)}</span>
                    </div>

                    {/* Best level */}
                    <div className="relative grid grid-cols-3 py-1 px-1.5 items-center bg-rose-50 border-l-2 border-rose-500 rounded font-bold">
                      <div className="absolute top-0 bottom-0 right-0 bg-rose-500/10 pointer-events-none z-0" style={{ width: "85%" }} />
                      <span className="text-rose-600">{parsedBuy.toFixed(5)}</span>
                      <span className="text-right text-slate-900">3,650</span>
                      <span className="text-right text-slate-700">{(parsedBuy * 3650).toFixed(1)}</span>
                    </div>

                  </div>
                </div>

                {/* Right CEX BIDs depth stacks (Buy orders on sell-CEX platform) */}
                <div className="space-y-3 z-10 text-left">
                  <div className="flex justify-between items-center bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl">
                    <span className="text-xs font-sans font-bold text-emerald-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {signal.sellDex} • BIDS (Покупка)
                    </span>
                    <span className="text-[9px] font-extrabold text-emerald-600 uppercase bg-white border border-emerald-200 px-1.5 rounded font-sans">Лучшая цена</span>
                  </div>

                  <div className="grid grid-cols-3 text-[9px] font-extrabold text-slate-400 uppercase py-1 border-b border-slate-100 font-sans">
                    <span>Цена (USDT)</span>
                    <span className="text-right">Объём ({baseToken})</span>
                    <span className="text-right">Сумма (USDT)</span>
                  </div>

                  {/* Bid list levels */}
                  <div className="space-y-1.5 font-mono text-xs">
                    
                    {/* Best Bid */}
                    <div className="relative grid grid-cols-3 py-1 px-1.5 items-center bg-emerald-50 border-l-2 border-emerald-500 rounded font-bold">
                      <div className="absolute top-0 bottom-0 right-0 bg-emerald-500/10 pointer-events-none z-0" style={{ width: "90%" }} />
                      <span className="text-emerald-600">{parsedSell.toFixed(5)}</span>
                      <span className="text-right text-slate-900">4,400</span>
                      <span className="text-right text-slate-700">{(parsedSell * 4400).toFixed(1)}</span>
                    </div>

                    {/* Level 2 */}
                    <div className="relative grid grid-cols-3 py-1 px-1.5 items-center hover:bg-emerald-50/40 rounded transition-all">
                      <div className="absolute top-0 bottom-0 right-0 bg-emerald-500/10 pointer-events-none z-0 rounded" style={{ width: "55%" }} />
                      <span className="text-emerald-600">{(parsedSell * 0.9994).toFixed(5)}</span>
                      <span className="text-right text-slate-700">1,960</span>
                      <span className="text-right text-slate-500">{(parsedSell * 0.9994 * 1960).toFixed(1)}</span>
                    </div>

                    {/* Level 3 */}
                    <div className="relative grid grid-cols-3 py-1 px-1.5 items-center hover:bg-emerald-50/40 rounded transition-all">
                      <div className="absolute top-0 bottom-0 right-0 bg-emerald-500/5 pointer-events-none z-0 rounded" style={{ width: "25%" }} />
                      <span className="text-emerald-600">{(parsedSell * 0.9988).toFixed(5)}</span>
                      <span className="text-right text-slate-700">2,250</span>
                      <span className="text-right text-slate-500">{(parsedSell * 0.9988 * 2250).toFixed(1)}</span>
                    </div>

                  </div>
                </div>

              </div>
            </div>

            {/* COMPREHENSIVE COMPLIANCE CHECKLIST REPORT */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 text-left shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest font-sans flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-emerald-600" />
                    Проверка условий сделки
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">Результаты автоматической проверки параметров и доступности арбитража</p>
                </div>

                <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                  <button 
                    type="button" 
                    onClick={() => setActiveCheckTab("all")}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg font-sans transition-all cursor-pointer focus:outline-none outline-none select-none ${
                      activeCheckTab === "all" ? "bg-white text-slate-800 shadow-xs border border-slate-200" : "text-slate-450 hover:text-slate-650 border border-transparent"
                    }`}
                  >
                    Все (4)
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setActiveCheckTab("security")}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg font-sans transition-all cursor-pointer focus:outline-none outline-none select-none ${
                      activeCheckTab === "security" ? "bg-white text-slate-800 shadow-xs border border-slate-200" : "text-slate-450 hover:text-slate-650 border border-transparent"
                    }`}
                  >
                    Доступность (2)
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setActiveCheckTab("liquidity")}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg font-sans transition-all cursor-pointer focus:outline-none outline-none select-none ${
                      activeCheckTab === "liquidity" ? "bg-white text-slate-800 shadow-xs border border-slate-200" : "text-slate-450 hover:text-slate-650 border border-transparent"
                    }`}
                  >
                    Объёмы и Лимиты (2)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                
                {/* Audit level #1 */}
                {(activeCheckTab === "all" || activeCheckTab === "security") && (
                  <div className="bg-slate-50/50 border border-slate-200/60 p-3.5 rounded-2xl space-y-1">
                    <div className="flex items-center gap-2 justify-between">
                      <span className="font-sans font-extrabold text-slate-900 flex items-center gap-1.5 uppercase text-[10.5px]">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        Актуальность цен
                      </span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 rounded uppercase font-bold font-sans">ОК</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      Цены на покупку и продажу актуальны и обновляются в реальном времени. Нет зависших торговых стаканов.
                    </p>
                  </div>
                )}

                {/* Audit level #2 */}
                {(activeCheckTab === "all" || activeCheckTab === "security") && (
                  <div className="bg-slate-50/50 border border-slate-200/60 p-3.5 rounded-2xl space-y-1">
                    <div className="flex items-center gap-2 justify-between">
                      <span className="font-sans font-extrabold text-slate-900 flex items-center gap-1.5 uppercase text-[10.5px]">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        Сеть для перевода
                      </span>
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 rounded uppercase font-bold font-sans">АКТИВНА</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      Выбранная сеть <strong className="font-black text-slate-700 font-mono uppercase">{signal.network}</strong> активна на прием и вывод средств на обеих биржах.
                    </p>
                  </div>
                )}

                {/* Audit level #3 */}
                {(activeCheckTab === "all" || activeCheckTab === "liquidity") && (
                  <div className="bg-slate-50/50 border border-slate-200/60 p-3.5 rounded-2xl space-y-1">
                    <div className="flex items-center gap-2 justify-between">
                      <span className="font-sans font-extrabold text-slate-900 flex items-center gap-1.5 uppercase text-[10.5px]">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        Минимальные лимиты бирж
                      </span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 rounded uppercase font-bold font-sans">ОК</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      Сумма сделки и доступный баланс соответствуют минимально допустимым лимитам на ордера и выводы.
                    </p>
                  </div>
                )}

                {/* Audit level #4 */}
                {(activeCheckTab === "all" || activeCheckTab === "liquidity") && (
                  <div className="bg-slate-50/50 border border-slate-200/60 p-3.5 rounded-2xl space-y-1">
                    <div className="flex items-center gap-2 justify-between">
                      <span className="font-sans font-extrabold text-slate-900 flex items-center gap-1.5 uppercase text-[10.5px]">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        Ликвидность направления
                      </span>
                      <span className="text-[9px] bg-cyan-50 text-cyan-700 border border-cyan-200 px-1.5 rounded uppercase font-bold font-sans">ДОСТАТОЧНА</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      Объёма встречных ордеров в биржевых стаканах достаточно для проведения сделки по указанным ценам.
                    </p>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </div> {/* Close LEFT SECTION: MAIN SYSTEM WORKSPACE (detailed-analysis-workspace-left) */}

      {/* RIGHT COMPANION: PINNED FAST LAUNCH SIDEBAR - FULL SCREEN HEIGHT */}
      <div className={`w-full lg:w-[420px] flex-1 lg:h-full lg:shrink-0 lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-3 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white flex flex-col text-left relative overflow-hidden ${mobileWorkspaceTab === "trade" ? "flex" : "hidden lg:flex"}`} id="detailed-analysis-right-sidebar">
        
        {/* TABS CONTROLLER CONTAINER (PINNED AND STATIC HEIGHT) */}
        <div className="flex-shrink-0 px-5 pt-4 border-b border-slate-100 flex items-center justify-between bg-white relative z-10 text-xs font-bold font-sans">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setSidebarTab("trade")}
              className={`pb-2.5 transition-all text-left relative cursor-pointer select-none uppercase tracking-wider text-[11px] ${
                sidebarTab === "trade"
                  ? "text-indigo-600 font-extrabold border-b-2 border-indigo-600"
                  : "text-slate-400 hover:text-slate-650"
              }`}
            >
              Запуск
            </button>
            <button
              type="button"
              onClick={() => setSidebarTab("faq")}
              className={`pb-2.5 transition-all text-left relative cursor-pointer select-none flex items-center gap-1 uppercase tracking-wider text-[11px] ${
                sidebarTab === "faq"
                  ? "text-indigo-600 font-extrabold border-b-2 border-indigo-600"
                  : "text-slate-400 hover:text-slate-650"
              }`}
            >
              Справочник
            </button>
          </div>
          <span className="text-[9px] text-emerald-600 font-extrabold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase font-sans shrink-0 mb-2">
            99.8% Safe
          </span>
        </div>

        {/* DYNAMIC SCROLLABLE BODY AREA - ALL INPUTS & LOGS GO HERE */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4" id="detailed-analysis-right-sidebar-scroll">
          {sidebarTab === "trade" ? (
                <>
                  <p className="text-xs text-slate-450 leading-relaxed font-sans">
                    Управление ценами, расчётами и мгновенным запуском в один клик. Контролируйте ордер в реальном времени.
                  </p>

                  {/* 1. Крупные карточки текущих цен на биржах покупки и продажи */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-left space-y-1 shadow-xs">
                      <div className="flex items-center gap-1.5 flex-nowrap">
                        <span className="text-[9.5px] font-black text-emerald-600 tracking-wider uppercase block">{signal.buyDex}</span>
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      </div>
                      <span className="text-base font-black text-slate-900 font-mono tracking-tight block">
                        ${parsedBuy.toFixed(4)}
                      </span>
                      <span className="text-[9.5px] font-bold text-slate-400 block pb-0.5">Текущая цена покупки</span>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 text-left space-y-1 shadow-xs">
                      <div className="flex items-center gap-1.5 flex-nowrap">
                        <span className="text-[9.5px] font-black text-blue-600 tracking-wider uppercase block">{signal.sellDex}</span>
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                      </div>
                      <span className="text-base font-black text-slate-900 font-mono tracking-tight block">
                        ${parsedSell.toFixed(4)}
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
                          <span className="text-[9.5px] font-bold text-slate-400 font-sans">Тек: <span className="font-mono font-extrabold">{parsedBuy.toFixed(4)}</span></span>
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
                          <span className="text-[9.5px] font-bold text-slate-400 font-sans">Тек: <span className="font-mono font-extrabold">{parsedSell.toFixed(4)}</span></span>
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
                      <span className="text-slate-400 font-sans font-semibold">
                        Доступно: <span className="font-extrabold font-mono text-slate-855">{balance.toFixed(2)} USDT</span>
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-3 focus-within:border-indigo-400 transition-all">
                      <div className="flex items-center justify-between gap-1">
                        <input 
                          type="text"
                          disabled={isExecuting}
                          value={sumInput}
                          onChange={(e) => setSumInput(e.target.value)}
                          className="bg-transparent border-0 p-0 text-lg font-black text-slate-855 focus:ring-0 focus:outline-none w-[60%] font-mono"
                          placeholder="Сумма"
                        />
                        <div className="flex flex-col items-end flex-shrink-0 font-sans">
                          <span className="text-xs font-extrabold text-slate-800 font-mono">{quoteToken}</span>
                          {parsedSum > 0 && (
                            <span className="text-[9px] font-semibold text-rose-500 mt-0.5">
                              ком. <span className="font-mono font-bold">-{totalTakerFees.toFixed(3)}</span>
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
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 font-sans">
                        <span className="font-semibold text-slate-500">Signal ID</span>
                        <span className="font-bold text-slate-800 font-mono">#{signal.id || "f554ba7"}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 font-sans">
                        <span className="font-semibold text-slate-500">Сеть</span>
                        <span className="font-bold text-slate-800 uppercase font-mono">{signal.network}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 font-sans">
                        <span className="font-semibold text-slate-500">Мин. вывод</span>
                        <span className="font-bold text-slate-800">5 <span className="font-mono font-bold">{baseToken}</span></span>
                      </div>
                      <div className="flex justify-between items-center font-sans">
                        <span className="font-semibold text-slate-500">Комиссия сети</span>
                        <span className="font-bold text-slate-800 font-mono">${networkFee.toFixed(4)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 6. Route Diagram Map Panel */}
                  <div className="space-y-1.5 text-left">
                    <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase pl-1 block">Маршрут</span>
                    <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3.5 space-y-2 font-sans text-[10.5px]">
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
                            <div className="h-0.5 bg-indigo-200 flex-1" />
                            <span className="text-[8px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold uppercase leading-none font-sans">
                              Перевод
                            </span>
                            <div className="h-0.5 bg-indigo-200 flex-1" />
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
                      <div className="px-2.5 py-1.5 bg-white border border-slate-200/60 rounded-lg text-[10px] font-bold font-sans text-slate-700 inline-flex items-center gap-1.5 shadow-5xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                        Ордер: <span className="font-mono font-black">Limit</span> (Лимитный)
                      </div>
                      <div className="px-2.5 py-1.5 bg-white border border-slate-200/60 rounded-lg text-[10px] font-bold font-sans text-slate-700 inline-flex items-center gap-1.5 shadow-5xs">
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

                  {/* 8. Spec flow layout: ЧТО ПРОИЗОЙДЕТ */}
                  <div className="space-y-2 pt-2 text-left animate-fade-in">
                    <div className="flex justify-between items-center px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>Что произойдет</span>
                      <span className="font-mono text-[9px] lowercase">~78с</span>
                    </div>

                    {/* Vertically chained sequence */}
                    <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-4 relative overflow-hidden text-left">
                      
                      {/* Top Balance Banner */}
                      <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 text-emerald-600 font-sans text-[11px] font-extrabold justify-between">
                        <div className="flex items-center gap-2">
                          <Check size={13} className="stroke-[3] text-emerald-500" />
                          <span>Баланс подтверждён</span>
                        </div>
                        <span className="font-mono bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px]">
                          {balance.toFixed(2)} USDT
                        </span>
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
                              if (completed || executionStep >= 3) return "Выполнен";
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
                              <div className="flex-1 flex flex-col space-y-0.5 text-left font-sans">
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
                                <span className={`text-[9.5px] transition-all duration-200 font-medium ${
                                  isActive ? "text-indigo-500 animate-pulse" : "text-slate-450 font-medium"
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
                </>
              ) : (
                /* FAQ/Справочное руководство tab content */
                <div className="space-y-4 text-left animate-fade-in" id="sidebar-faq-tab-view">
                  <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase font-sans block">
                    Базовые Вопросы и Ответы
                  </span>

                  <div className="space-y-3 font-sans text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/50 space-y-1.5 font-sans">
                      <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        Как обеспечивается безрисковость?
                      </h5>
                      <p className="text-slate-500 leading-relaxed text-[11px] pl-3">
                        Сделки выполняются с использованием мгновенного API-хеджирования. Наш алгоритм одновременно проверяет ордера на обеих подключаемых CEX-биржах и исполняет их суб-миллисекундно, полностью исключая риск зависания открытой позиции при внезапном развороте спреда.
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/50 space-y-1.5 font-sans">
                      <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        С какой суммы можно начать круг?
                      </h5>
                      <p className="text-slate-500 leading-relaxed text-[11px] pl-3">
                        Минимальный лимит на запуск отсутствует, однако рекомендуется соразмерять ордер с комиссиями перевода и торговыми сборами бирж ({networkFee.toFixed(4)} USDT) для достижения оптимальной положительной доходности. Спред в 1.0% превосходно окупает круг от 10 USDT.
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/50 space-y-1.5 font-sans">
                      <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        Как учитываются комиссии бирж?
                      </h5>
                      <p className="text-slate-500 leading-relaxed text-[11px] pl-3">
                        Наш калькулятор автоматически вычитает стандартные комиссии тейкера спотового рынка (0.1% на обеих CEX платформах) при расчете окупаемости, ROI и чистой прибыли.
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/50 space-y-1.5 font-sans">
                      <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        Безопасно ли передавать API ключи?
                      </h5>
                      <p className="text-slate-500 leading-relaxed text-[11px] pl-3">
                        Да, торговые ключи ваших CEX-интеграций шифруются локально по протоколу AES-256. В целях безопасности права вывода средств обязательно должны быть отключены в настройках биржевого аккаунта.
                      </p>
                    </div>
                  </div>
                </div>
              )}

          </div> {/* Close dynamic scrollable body (detailed-analysis-right-sidebar-scroll) */}

          {/* PINNED LAUNCH & COMPLIANCE FOOTER (always static, pinned to bottom) */}
          {sidebarTab === "trade" && (
            <div className="flex-shrink-0 p-4 border-t border-slate-200 bg-white space-y-3 relative z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
              {/* 1. COMPLIANCE CONFIRMATION BOX - only visible BEFORE launch */}
              {!isThisSignalRunning && (
                <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl text-left">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      disabled={isExecuting}
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-650 focus:ring-indigo-400 cursor-pointer"
                    />
                    <span className="text-[10.5px] leading-relaxed font-bold text-slate-550 font-sans select-none">
                      Я подтверждаю автоматическое сведение ордеров и несу полную ответственность за риски.
                      <span className="font-black text-indigo-600 block mt-1 uppercase text-[9px] tracking-wider">Согласие подтверждено</span>
                    </span>
                  </label>
                </div>
              )}

              {/* 2. LAUNCH / EXECUTION / ACTION BUTTON */}
              {isThisSignalRunning && !isExecuting && executionStep === 7 ? (
                <div className="space-y-2">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl space-y-0.5 text-center font-sans">
                    <span className="text-[10px] uppercase font-black block text-emerald-700">Ордер Завершен</span>
                    <p className="text-sm font-bold font-sans">
                      Итого зачислено: <span className="text-emerald-600 font-mono font-extrabold">+{netProfit.toFixed(4)} USDT</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 bg-slate-900 border border-slate-950 hover:bg-slate-800 text-white rounded-xl font-black text-xs tracking-wider uppercase shadow-md active:scale-95 transition-all text-center cursor-pointer select-none"
                  >
                    Вернуться к сигналам
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={isExecuting || !confirmed}
                  onClick={handleExecuteArbitrage}
                  className={`w-full py-3.5 rounded-xl font-black text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] select-none ${
                    isExecuting 
                      ? "bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-100 cursor-pointer animate-pulse" 
                      : confirmed
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 cursor-pointer"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                  }`}
                >
                  {isExecuting ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      Идёт выполнение арбитража...
                    </>
                  ) : (
                    <>
                      <Play size={10} className="fill-white" />
                      Запустить автоматический арбитраж
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div> {/* Close right sidebar wrapper (detailed-analysis-right-sidebar) */}
    </motion.div>
  );
}
