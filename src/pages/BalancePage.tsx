import React, { useState } from "react";
import { 
  Wallet, 
  RefreshCw, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Search,
  LayoutGrid,
  List,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useToast } from "../components/Toast";

export interface AssetInfo {
  symbol: string;
  name: string;
  amount: number;
  usdValue: string;
  color: string;
  bgClass: string;
}

export interface ExchangeBalance {
  id: string;
  name: string;
  logoColor: string;
  lastSync: string;
  subtext: string;
  source: string;
  balance: string;
  tokensCount: number;
  recon: "OK" | "ERR";
  statusAction: "SYNC" | "ERR";
  assets: AssetInfo[];
  url: string;
  shortAssets: string;
}

const mockBalances: ExchangeBalance[] = [
  {
    id: "binance",
    name: "Binance",
    logoColor: "bg-amber-500 text-black",
    lastSync: "1 мин назад",
    subtext: "last sync",
    source: "API → BALANCE",
    balance: "$48,210",
    tokensCount: 4,
    recon: "OK",
    statusAction: "SYNC",
    url: "https://binance.com",
    shortAssets: "USDT · BTC · ETH · BNB",
    assets: [
      { symbol: "USDT", name: "Tether USD", amount: 24810.42, usdValue: "$24,810", color: "text-emerald-500", bgClass: "bg-emerald-500/10 border-emerald-500/20" },
      { symbol: "BTC", name: "Bitcoin", amount: 0.2148, usdValue: "$13,918", color: "text-amber-500", bgClass: "bg-amber-500/10 border-amber-500/20" },
      { symbol: "ETH", name: "Ethereum", amount: 1.94, usdValue: "$6,231", color: "text-indigo-505", bgClass: "bg-indigo-500/10 border-indigo-500/20" },
      { symbol: "BNB", name: "Binance Coin", amount: 5.42, usdValue: "$3,251", color: "text-yellow-650", bgClass: "bg-yellow-550/10 border-yellow-500/20" }
    ]
  },
  {
    id: "okx",
    name: "OKX",
    logoColor: "bg-slate-900 text-white border border-slate-800",
    lastSync: "2 мин назад",
    subtext: "last sync",
    source: "API → BALANCE",
    balance: "$34,782",
    tokensCount: 3,
    recon: "OK",
    statusAction: "SYNC",
    url: "https://okx.com",
    shortAssets: "BTC · USDT · TON",
    assets: [
      { symbol: "BTC", name: "Bitcoin", amount: 0.3542, usdValue: "$22,960", color: "text-amber-500", bgClass: "bg-amber-500/10 border-amber-500/20" },
      { symbol: "USDT", name: "Tether USD", amount: 10250.00, usdValue: "$10,250", color: "text-emerald-500", bgClass: "bg-emerald-500/10 border-emerald-500/20" },
      { symbol: "TON", name: "Toncoin", amount: 250.50, usdValue: "$1,572", color: "text-sky-500", bgClass: "bg-sky-500/10 border-sky-500/20" }
    ]
  },
  {
    id: "bybit",
    name: "Bybit",
    logoColor: "bg-yellow-500 text-slate-950",
    lastSync: "3 мин назад",
    subtext: "last sync",
    source: "API → BALANCE",
    balance: "$31,140",
    tokensCount: 23,
    recon: "OK",
    statusAction: "SYNC",
    url: "https://bybit.com",
    shortAssets: "USDT · ETH · SOL · BTC · ADA · DOT · LINK · +16",
    assets: [
      { symbol: "USDT", name: "Tether USD", amount: 15220.00, usdValue: "$15,220", color: "text-emerald-500", bgClass: "bg-emerald-500/10 border-emerald-500/20" },
      { symbol: "ETH", name: "Ethereum", amount: 1.85, usdValue: "$5,940", color: "text-indigo-500", bgClass: "bg-indigo-500/10 border-indigo-500/20" },
      { symbol: "SOL", name: "Solana", amount: 35.80, usdValue: "$6,250", color: "text-purple-500", bgClass: "bg-purple-500/10 border-purple-500/20" },
      { symbol: "BTC", name: "Bitcoin", amount: 0.015, usdValue: "$975", color: "text-amber-500", bgClass: "bg-amber-500/10 border-amber-500/20" },
      { symbol: "ADA", name: "Cardano", amount: 1200, usdValue: "$450", color: "text-sky-600", bgClass: "bg-sky-500/10 border-sky-500/20" },
      { symbol: "DOT", name: "Polkadot", amount: 80, usdValue: "$320", color: "text-pink-600", bgClass: "bg-pink-500/10 border-pink-500/20" },
      { symbol: "LINK", name: "Chainlink", amount: 15, usdValue: "$225", color: "text-blue-700", bgClass: "bg-blue-500/10 border-blue-500/20" },
      { symbol: "DOGE", name: "Dogecoin", amount: 1500, usdValue: "$210", color: "text-yellow-600", bgClass: "bg-yellow-500/10 border-yellow-500/20" },
      { symbol: "XRP", name: "Ripple", amount: 350, usdValue: "$195", color: "text-sky-500", bgClass: "bg-sky-500/10 border-sky-500/20" },
      { symbol: "LTC", name: "Litecoin", amount: 2.1, usdValue: "$180", color: "text-slate-500", bgClass: "bg-slate-500/10 border-slate-500/20" },
      { symbol: "MATIC", name: "Polygon", amount: 250, usdValue: "$150", color: "text-purple-650", bgClass: "bg-purple-505/10 border-purple-500/20" },
      { symbol: "AVAX", name: "Avalanche", amount: 4.5, usdValue: "$135", color: "text-red-500", bgClass: "bg-red-500/10 border-red-500/20" },
      { symbol: "ATOM", name: "Cosmos", amount: 12, usdValue: "$108", color: "text-slate-800", bgClass: "bg-slate-500/10 border-slate-500/20" },
      { symbol: "UNI", name: "Uniswap", amount: 15, usdValue: "$95", color: "text-pink-500", bgClass: "bg-pink-500/10 border-pink-500/20" },
      { symbol: "NEAR", name: "NEAR Protocol", amount: 20, usdValue: "$92", color: "text-slate-900", bgClass: "bg-slate-500/10 border-slate-500/20" },
      { symbol: "TRX", name: "TRON", amount: 620, usdValue: "$86", color: "text-red-600", bgClass: "bg-red-500/10 border-red-500/20" },
      { symbol: "TON", name: "Toncoin", amount: 12, usdValue: "$75", color: "text-sky-500", bgClass: "bg-sky-500/10 border-sky-500/20" },
      { symbol: "SHIB", name: "Shiba Inu", amount: 2500000, usdValue: "$62", color: "text-orange-500", bgClass: "bg-orange-500/10 border-orange-500/20" },
      { symbol: "ICP", name: "Internet Computer", amount: 6.5, usdValue: "$54", color: "text-indigo-650", bgClass: "bg-indigo-500/10 border-indigo-500/20" },
      { symbol: "FIL", name: "Filecoin", amount: 10, usdValue: "$48", color: "text-cyan-500", bgClass: "bg-cyan-500/10 border-cyan-500/20" },
      { symbol: "DAI", name: "Dai", amount: 35, usdValue: "$35", color: "text-yellow-650", bgClass: "bg-yellow-550/10 border-yellow-500/20" },
      { symbol: "BCH", name: "Bitcoin Cash", amount: 0.08, usdValue: "$32", color: "text-emerald-600", bgClass: "bg-emerald-500/10 border-emerald-500/20" },
      { symbol: "XLM", name: "Stellar", amount: 150, usdValue: "$18", color: "text-blue-500", bgClass: "bg-blue-500/10 border-blue-500/20" }
    ]
  },
  {
    id: "gate",
    name: "Gate",
    logoColor: "bg-blue-600 text-white",
    lastSync: "8 мин назад",
    subtext: "last sync",
    source: "API → BALANCE",
    balance: "$14,490",
    tokensCount: 3,
    recon: "ERR",
    statusAction: "ERR",
    url: "https://gate.io",
    shortAssets: "USDT · ETHW · BER",
    assets: [
      { symbol: "USDT", name: "Tether USD", amount: 11728.66, usdValue: "$11,729", color: "text-emerald-500", bgClass: "bg-emerald-500/10 border-emerald-500/20" },
      { symbol: "ETHW", name: "Ethereum PoW", amount: 842.10, usdValue: "$2,219", color: "text-slate-600", bgClass: "bg-slate-500/10 border-slate-500/20" },
      { symbol: "BER", name: "Bera Token", amount: 18440.00, usdValue: "$542", color: "text-indigo-600", bgClass: "bg-indigo-500/10 border-indigo-500/20" }
    ]
  },
  {
    id: "kucoin",
    name: "KuCoin",
    logoColor: "bg-emerald-550 text-white",
    lastSync: "нет активов",
    subtext: "last sync",
    source: "API → BALANCE",
    balance: "$0",
    tokensCount: 2,
    recon: "ERR",
    statusAction: "ERR",
    url: "https://kucoin.com",
    shortAssets: "USDT · BTC",
    assets: [
      { symbol: "USDT", name: "Tether USD", amount: 0.00, usdValue: "$0", color: "text-emerald-500", bgClass: "bg-emerald-500/10 border-emerald-500/20" },
      { symbol: "BTC", name: "Bitcoin", amount: 0.0000, usdValue: "$0", color: "text-amber-500", bgClass: "bg-amber-500/10 border-amber-500/20" }
    ]
  }
];

export interface BalancePageProps {
  selectedExchangeFilter?: string;
  balanceSubView?: string;
}

const STATUS_EXPLANATIONS = {
  OK: "Соединение активно: балансы на бирже успешно получены и актуальны.",
  ERR: "Ошибка подключения: проверьте API ключи или права доступа для чтения балансов."
};

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  alignClass?: string;
}

function Tooltip({ content, children, position = "top", alignClass = "" }: TooltipProps) {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2 origin-bottom",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2 origin-top",
    left: "right-full top-1/2 -translate-y-1/2 mr-2 origin-right",
    right: "left-full top-1/2 -translate-y-1/2 ml-2 origin-left",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-slate-900 border-x-transparent border-b-transparent",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-slate-900 border-x-transparent border-t-transparent",
    left: "left-full top-1/2 -translate-y-1/2 border-l-slate-900 border-y-transparent border-r-transparent",
    right: "right-full top-1/2 -translate-y-1/2 border-r-slate-900 border-y-transparent border-l-transparent",
  };

  return (
    <div className={`relative group/tooltip inline-flex items-center ${alignClass}`}>
      {children}
      <div className={`absolute ${positionClasses[position]} z-50 pointer-events-none whitespace-normal opacity-0 scale-95 group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-150 ease-out`}>
        <div className="bg-slate-900 text-white text-[10px] font-medium py-1.5 px-2.5 rounded-lg shadow-xl w-48 text-center leading-normal border border-slate-800/80 drop-shadow-md">
          {content}
          <div className={`absolute border-4 ${arrowClasses[position]} content-['']`} />
        </div>
      </div>
    </div>
  );
}

export function BalancePage({ selectedExchangeFilter = "Все", balanceSubView = "Отчет по активам" }: BalancePageProps) {
  const { showToast } = useToast();
  
  // Choose default 'grid' view as it avoids the heavy table format requested by the user.
  // The user can toggle between "Сетка" (Grid cards) and "Список" (Compact rows view).
  const [displayMode, setDisplayMode] = useState<"grid" | "list">("grid");
  const [exchangeList, setExchangeList] = useState<ExchangeBalance[]>(mockBalances);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [tokenSearchQueries, setTokenSearchQueries] = useState<Record<string, string>>({});

  // Expanded cards tracker for detailed token breakdown lists inside the Bento view
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    binance: true,
    bybit: true,
    gate: true
  });

  const toggleCard = (id: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSyncExchange = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSyncingId(id);
    showToast(`Запущена синхронизация балансов ${name}...`, "info");
    setTimeout(() => {
      setSyncingId(null);
      showToast(`Синхронизация ${name} завершена успешно`, "success");
    }, 1500);
  };

  // Helper to parse numeric values from currency string (e.g., "$48,210" -> 48210)
  const getNumericValue = (valStr: string): number => {
    return parseFloat(valStr.replace(/[^0-9.]/g, '')) || 0;
  };

  // Get segment background colors
  const getAssetBgColor = (symbol: string): string => {
    switch (symbol.toUpperCase()) {
      case "USDT": return "bg-emerald-500";
      case "BTC": return "bg-amber-500";
      case "ETH": return "bg-indigo-500";
      case "BNB": return "bg-yellow-500";
      case "TON": return "bg-sky-500";
      case "SOL": return "bg-purple-500";
      case "ETHW": return "bg-slate-400";
      case "BER": return "bg-indigo-600";
      default: return "bg-slate-450";
    }
  };

  const getStatusLabel = (status: string): string => {
    return status === "OK" ? "ОК" : "Ошибка";
  };

  // Filter exchanges if selected in sidebar
  const filteredExchanges = exchangeList.filter(exch => 
    selectedExchangeFilter === "Все" || exch.name.toLowerCase() === selectedExchangeFilter.toLowerCase()
  );

  // Aggregated assets for "Сводка" view
  const aggregatedAssets = [
    { symbol: "USDT", name: "Tether USD", amount: 62009.08, usdValue: "$62,009", rawValue: 62009, percent: "49.6%", color: "text-emerald-500", bgClass: "bg-emerald-500/10 border-emerald-500/20", barColor: "bg-emerald-500" },
    { symbol: "BTC", name: "Bitcoin", amount: 0.569, usdValue: "$36,878", rawValue: 36878, percent: "29.5%", color: "text-amber-500", bgClass: "bg-amber-500/10 border-amber-500/20", barColor: "bg-amber-500" },
    { symbol: "ETH", name: "Ethereum", amount: 3.79, usdValue: "$12,171", rawValue: 12171, percent: "9.7%", color: "text-indigo-500", bgClass: "bg-indigo-500/10 border-indigo-500/20", barColor: "bg-indigo-500" },
    { symbol: "SOL", name: "Solana", amount: 35.80, usdValue: "$6,250", rawValue: 6250, percent: "5.0%", color: "text-purple-500", bgClass: "bg-purple-500/10 border-purple-500/20", barColor: "bg-purple-500" },
    { symbol: "BNB", name: "Binance Coin", amount: 5.42, usdValue: "$3,251", rawValue: 3251, percent: "2.6%", color: "text-yellow-500", bgClass: "bg-yellow-500/10 border-yellow-500/20", barColor: "bg-yellow-500" },
    { symbol: "ETHW", name: "Ethereum PoW", amount: 842.10, usdValue: "$2,219", rawValue: 2219, percent: "1.8%", color: "text-slate-600", bgClass: "bg-slate-500/10 border-slate-500/20", barColor: "bg-slate-500" },
    { symbol: "TON", name: "Toncoin", amount: 250.50, usdValue: "$1,572", rawValue: 1572, percent: "1.3%", color: "text-sky-500", bgClass: "bg-sky-500/10 border-sky-500/20", barColor: "bg-sky-500" },
    { symbol: "BER", name: "Bera Token", amount: 18440.00, usdValue: "$542", rawValue: 542, percent: "0.5%", color: "text-indigo-600", bgClass: "bg-indigo-500/10 border-indigo-500/20", barColor: "bg-indigo-600" }
  ];

  return (
    <div id="balance-page" className="flex-1 p-4 lg:p-6 space-y-6 overflow-y-auto">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-200/50 pb-5 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-600/10 border border-blue-500/15 text-blue-600 shadow-3xs">
            <Wallet size={20} className="stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-800 tracking-tight leading-none uppercase">Баланс</h1>
            <p className="text-[10px] font-bold text-slate-400 mt-1">
              {balanceSubView === "Сводка" ? "Аналитика распределения активов" : "Отчет по активам и статус подключения бирж"}
            </p>
          </div>
        </div>

        {/* Display mode switcher for active assets list (only shown when not in "Сводка") */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {selectedExchangeFilter !== "Все" && (
            <div className="hidden md:flex items-center gap-1.5 bg-blue-50 border border-blue-105 px-2.5 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[9.5px] font-black text-blue-700 uppercase tracking-wide">Фильтр: {selectedExchangeFilter}</span>
            </div>
          )}

          {balanceSubView !== "Сводка" && (
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/60 shadow-3xs">
              <button 
                onClick={() => setDisplayMode("grid")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${displayMode === "grid" ? "bg-white text-slate-800 shadow-4xs" : "text-slate-400 hover:text-slate-650"}`}
                title="Отображение плиткой (Bento)"
              >
                <LayoutGrid size={15} className="stroke-[2.2]" />
              </button>
              <button 
                onClick={() => setDisplayMode("list")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${displayMode === "list" ? "bg-white text-slate-800 shadow-4xs" : "text-slate-400 hover:text-slate-650"}`}
                title="Отображение списком"
              >
                <List size={15} className="stroke-[2.2]" />
              </button>
            </div>
          )}
        </div>
      </div>

      {balanceSubView === "Сводка" ? (
        /* --- СВОДКА VIEW --- */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            {/* Asset Distribution */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-2xs space-y-4">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Распределение</h2>
              
              <div className="relative py-6 flex flex-col items-center justify-center">
                <div className="w-40 h-40 rounded-full border-[14px] border-slate-50 flex flex-col items-center justify-center relative">
                  <div className="absolute inset-0 border-[14px] border-transparent border-t-emerald-500 border-l-amber-500 rounded-full rotate-45 pointer-events-none" />
                  <span className="text-[10px] font-black text-slate-400 uppercase leading-none">Всего активов</span>
                  <span className="text-sm font-black text-slate-800 font-mono tracking-tight mt-1">$124,892</span>
                </div>
              </div>

              <div className="space-y-2 bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                    <span>Стабильные (USDT)</span>
                  </div>
                  <span className="text-slate-800 font-mono">49.6%</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                    <span>Рыночные (BTC)</span>
                  </div>
                  <span className="text-slate-800 font-mono">29.5%</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-indigo-500" />
                    <span>Альты (ETH, др.)</span>
                  </div>
                  <span className="text-slate-800 font-mono">20.9%</span>
                </div>
              </div>
            </div>

            {/* Total breakdown stats */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-2xs space-y-4">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Информация</h2>
              <div className="grid grid-cols-2 gap-3.5 text-xs">
                <div className="p-3 bg-slate-50/60 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <span className="font-bold text-slate-450 text-[10px] uppercase leading-none">Биржевой баланс</span>
                  <span className="font-black text-slate-700 font-mono text-sm mt-2">$124,892</span>
                </div>
                <div className="p-3 bg-slate-50/60 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <span className="font-bold text-slate-450 text-[10px] uppercase leading-none">Активных лимитов</span>
                  <span className="font-black text-slate-700 text-sm mt-2 font-mono">0</span>
                </div>
                <div className="p-3 bg-slate-50/60 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <span className="font-bold text-slate-450 text-[10px] uppercase leading-none">Подключено API</span>
                  <span className="font-black text-slate-700 text-sm mt-2 font-mono">4 ключа</span>
                </div>
                <div className="p-3 bg-slate-50/60 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <span className="font-bold text-slate-450 text-[10px] uppercase leading-none">Общий статус</span>
                  <span className="font-black text-emerald-600 text-xs mt-2 inline-flex items-center gap-1">
                    <CheckCircle2 size={12} /> OK
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {/* Aggregated list container */}
            <div className="bg-white rounded-3xl border border-slate-200/70 shadow-2xs p-5 space-y-4.5">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Суммарные балансы токенов</h2>
                <span className="text-[10px] font-semibold text-slate-400">8 уникальных токенов в сети</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {aggregatedAssets.map((asset) => (
                  <div 
                    key={asset.symbol}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50/40 hover:bg-slate-50 border border-slate-200/60 hover:border-slate-350 rounded-2xl transition-all duration-200 gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black text-xs ${asset.bgClass}`}>
                        {asset.symbol.substring(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-800 leading-none">
                          {asset.symbol} 
                          <span className="text-[10px] font-bold text-slate-400 ml-1.5 font-sans">{asset.name}</span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-450 mt-1 font-mono leading-none">
                          Баланс: {asset.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center md:justify-end gap-6 w-full md:w-auto overflow-hidden">
                      {/* Percent Fill bar */}
                      <div className="hidden md:flex flex-col w-28 items-end gap-1 shrink-0">
                        <span className="text-[9.5px] font-black text-slate-400/90 leading-none font-mono">{asset.percent}</span>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${asset.barColor}`} style={{ width: asset.percent }} />
                        </div>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-slate-805 font-mono tracking-tight block leading-none">
                          {asset.usdValue}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 leading-none mt-1 inline-block md:hidden">
                          {asset.percent} доля
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : displayMode === "grid" ? (
        /* --- BRAND NEW BENTO GRID DESIGN (NO DRY TABLES!) --- */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredExchanges.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white border border-slate-205 rounded-3xl">
              <span className="text-xs font-bold text-slate-400">Биржи, удовлетворяющие условию фильтра, не найдены</span>
            </div>
          ) : (
            filteredExchanges.map((exchange) => {
              const isExpanded = !!expandedCards[exchange.id];
              const totalVal = getNumericValue(exchange.balance);
              const q = (tokenSearchQueries[exchange.id] || "").trim().toLowerCase();
              const filteredAssets = exchange.assets.filter(asset => 
                !q || 
                asset.symbol.toLowerCase().includes(q) || 
                asset.name.toLowerCase().includes(q)
              );

              return (
                <div 
                  key={exchange.id}
                  className="bg-white rounded-3xl border border-slate-200/75 shadow-3xs hover:shadow-2xs transition-all duration-300 flex flex-col justify-between overflow-hidden relative group/card"
                >
                  {/* Card Main Body */}
                  <div className="p-5 space-y-4">
                    {/* Header: Logo, Name, Sync Indicator */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-[12px] uppercase tracking-wide shrink-0 shadow-3xs ${exchange.logoColor}`}>
                          {exchange.name.substring(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-800 tracking-tight leading-none">
                              {exchange.name}
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-slate-400 mt-1 font-mono uppercase tracking-wider scale-95 origin-left">
                            {exchange.lastSync}
                          </span>
                        </div>
                      </div>

                      {/* Status display instead of sync button */}
                      <Tooltip content={STATUS_EXPLANATIONS[exchange.recon]} position="left">
                        <span className={`inline-flex items-center justify-center border text-[9px] font-black leading-none px-2 py-1 rounded-lg cursor-help ${
                          exchange.recon === "OK"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-110"
                            : "bg-rose-50 text-rose-600 border-rose-110"
                        }`}>
                          {getStatusLabel(exchange.recon)}
                        </span>
                      </Tooltip>
                    </div>

                    {/* Balance Display */}
                    <div className="pt-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none block">Баланс аккаунта</span>
                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="text-2xl font-black text-slate-800 tracking-tight font-mono leading-none">
                          {exchange.balance}
                        </span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100 text-[8.5px] font-black text-slate-500 font-mono scale-90">
                          {exchange.source}
                        </span>
                      </div>
                    </div>

                    {/* Segmented Portfolio composition bar (Gorgeous portfolio breakdown) */}
                    {totalVal > 0 && exchange.assets.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          <span>Доли активов</span>
                          <span className="font-mono text-slate-550 italic">Ratio metrics</span>
                        </div>
                        {/* The Actual Stacked segmented bar chart */}
                        <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-100 border border-slate-50 shadow-4xs">
                          {exchange.assets.map((asset) => {
                            const val = getNumericValue(asset.usdValue);
                            const prc = (val / totalVal) * 105; // soft scalar to fill nicely
                            const finalWidth = Math.min(prc, 100);
                            if (finalWidth <= 0) return null;
                            return (
                              <div 
                                key={asset.symbol}
                                className={`h-full transition-all duration-350 hover:brightness-110 relative group/segment ${getAssetBgColor(asset.symbol)}`}
                                style={{ width: `${finalWidth}%` }}
                                title={`${asset.symbol}: ${finalWidth.toFixed(1)}%`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Assets Header Trigger */}
                    <div 
                      onClick={() => toggleCard(exchange.id)}
                      className="flex justify-between items-center py-1.5 border-t border-b border-slate-100/70 select-none cursor-pointer text-[10px] font-black text-slate-500 hover:text-slate-800 uppercase tracking-widest transition-colors"
                    >
                      <span>Токенов в кошельке ({exchange.tokensCount})</span>
                      <span className="flex items-center gap-1.5 font-bold tracking-tight text-[9px] lowercase text-slate-400 font-sans">
                        {isExpanded ? "скрыть" : "показать"}
                        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </span>
                    </div>

                    {/* Detailed Interactive coin listings */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden flex flex-col pt-1.5"
                        >
                          {/* Inner Search Box shown for larger lists >= 6 items */}
                          {exchange.assets.length >= 6 && (
                            <div className="relative mb-2 shrink-0">
                              <Search size={11} className="absolute left-2.5 top-2.5 text-slate-405 stroke-[2.5]" />
                              <input 
                                type="text"
                                value={tokenSearchQueries[exchange.id] || ""}
                                onChange={(e) => setTokenSearchQueries(prev => ({ ...prev, [exchange.id]: e.target.value }))}
                                placeholder="Поиск токена..."
                                className="w-full text-[10px] font-bold text-slate-700 placeholder-slate-400 pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl outline-hidden focus:border-indigo-400 focus:bg-white transition-all font-sans"
                              />
                            </div>
                          )}

                          {/* Scrollable list area for grid composition */}
                          <div className="overflow-y-auto max-h-[290px] space-y-1.5 pr-1 text-xs">
                            {filteredAssets.length === 0 ? (
                              <div className="py-4 text-center text-[10px] font-bold text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                Совпадений не найдено
                              </div>
                            ) : (
                              filteredAssets.map((asset) => (
                                <div 
                                  key={asset.symbol}
                                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50/50 hover:bg-slate-50 border border-slate-100/60 hover:border-slate-200 transition-all duration-150"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${getAssetBgColor(asset.symbol)} shrink-0`} />
                                    <span className="text-xs font-black text-slate-705 leading-none">
                                      {asset.symbol}
                                    </span>
                                    <span className="text-[9.5px] font-bold text-slate-400 bg-white border border-slate-100 px-1 py-0.5 rounded leading-none">
                                      {asset.name}
                                    </span>
                                  </div>
                                  <div className="text-right flex flex-col items-end">
                                    <span className="text-xs font-black text-slate-755 font-mono leading-none">
                                      {asset.usdValue}
                                    </span>
                                    <span className="text-[9px] font-semibold text-slate-400 mt-1 font-mono leading-none">
                                      {asset.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                                    </span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Card Action footer button */}
                  <div className="bg-slate-50/50 border-t border-slate-100/80 px-5 py-3.5 flex items-center justify-between">
                    <span className="text-[9.5px] font-bold text-slate-405 font-mono uppercase">
                      {exchange.source}
                    </span>
                    <a 
                      href={exchange.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-[9.5px] font-black uppercase tracking-wider border border-slate-205 hover:border-slate-300 text-slate-655 hover:text-slate-800 bg-white rounded-lg transition-all shadow-4xs cursor-pointer active:scale-97"
                    >
                      Открыть биржу
                      <ExternalLink size={10} className="stroke-[2.5]" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* --- COMPACT HIGH-CRAFT ROW VIEW (REPLACES BULKY TABLE) --- */
        <div className="bg-white rounded-3xl border border-slate-200/70 shadow-2xs overflow-hidden">
          <div className="p-4 bg-slate-50/30 border-b border-slate-100 flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Список активных кошельков</span>
            <span className="text-[10px] font-bold text-slate-400 font-sans">Кликните на строку, чтобы просмотреть детальный состав токенов</span>
          </div>
          <div className="divide-y divide-slate-100/85">
            {filteredExchanges.length === 0 ? (
              <div className="py-12 text-center text-xs font-bold text-slate-400">
                Биржи, удовлетворяющие условию фильтра, не найдены
              </div>
            ) : (
              filteredExchanges.map((exchange) => {
                const isExpanded = !!expandedCards[exchange.id];
                const q = (tokenSearchQueries[exchange.id] || "").trim().toLowerCase();
                const filteredAssets = exchange.assets.filter(asset => 
                  !q || 
                  asset.symbol.toLowerCase().includes(q) || 
                  asset.name.toLowerCase().includes(q)
                );
                return (
                  <div key={exchange.id} className="transition-all duration-250">
                    {/* Main Row */}
                    <div 
                      onClick={() => toggleCard(exchange.id)}
                      className={`p-4 grid grid-cols-1 md:grid-cols-12 md:items-center gap-4 cursor-pointer select-none transition-all ${
                        isExpanded ? "bg-slate-50/40" : "hover:bg-slate-50/20"
                      }`}
                    >
                      {/* Left: Indicator, Logo, Info */}
                      <div className="flex items-center gap-3 md:col-span-5 min-w-0">
                        <div className="text-slate-400 shrink-0">
                          {isExpanded ? (
                            <ChevronUp size={16} className="stroke-[2.8] text-indigo-500" />
                          ) : (
                            <ChevronDown size={16} className="stroke-[2.8] text-slate-400" />
                          )}
                        </div>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[11px] shrink-0 shadow-3xs ${exchange.logoColor}`}>
                          {exchange.name.substring(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-850 leading-none">{exchange.name}</span>
                            <span className="bg-slate-50 border border-slate-100 text-slate-500 font-mono text-[8.5px] px-1 py-0.5 rounded leading-none">{exchange.source}</span>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-400 mt-1 block tracking-tight font-sans truncate">
                            Токены: <span className="font-bold text-slate-600 font-mono">{exchange.shortAssets}</span>
                          </span>
                        </div>
                      </div>

                      {/* Mid/Filters status */}
                      <div className="grid grid-cols-3 w-full md:col-span-4 items-center text-xs gap-2">
                        <div className="flex flex-col items-start md:items-center">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Обновлено</span>
                          <span className="font-extrabold text-slate-700 mt-0.5 text-[11px] md:text-[11.5px] leading-tight text-left md:text-center whitespace-nowrap">{exchange.lastSync}</span>
                        </div>
                        <div className="flex flex-col items-start md:items-center">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Статус</span>
                          <Tooltip content={STATUS_EXPLANATIONS[exchange.recon]} position="top" alignClass="mt-0.5">
                            <span className={`border text-[9px] font-black px-1.5 py-0.5 rounded-md whitespace-nowrap cursor-help ${
                              exchange.recon === "OK"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : "bg-rose-50 text-rose-600 border-rose-100"
                            }`}>
                              {getStatusLabel(exchange.recon)}
                            </span>
                          </Tooltip>
                        </div>
                        <div className="flex flex-col items-start md:items-center">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Токенов</span>
                          <span className="text-slate-800 font-black font-mono leading-none bg-blue-50/50 border border-blue-50/30 px-1.5 py-0.5 rounded-md mt-0.5">
                            {exchange.tokensCount}
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto md:col-span-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <span className="text-sm font-black text-slate-800 font-mono tracking-tight text-right md:mr-2">
                          {exchange.balance}
                        </span>
                        <div className="flex items-center gap-2">
                          <a 
                            href={exchange.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg border border-slate-200/60 hover:bg-slate-50 text-slate-450 hover:text-slate-600 transition-colors"
                            title="Открыть биржу"
                          >
                            <ExternalLink size={13} className="stroke-[2.2]" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Coin composition panel */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden border-t border-slate-100 bg-slate-50/50"
                        >
                          <div className="px-5 py-3 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-slate-100/30">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block leading-none">
                              Детализация портфеля ({filteredAssets.length} из {exchange.tokensCount} активов)
                            </span>
                            
                            {/* Inner Search Box shown for larger lists >= 6 items */}
                            {exchange.assets.length >= 6 && (
                              <div className="relative w-full md:w-60 shrink-0">
                                <Search size={11} className="absolute left-2.5 top-2 text-slate-400 stroke-[2.5]" />
                                <input   
                                  type="text"
                                  value={tokenSearchQueries[exchange.id] || ""}
                                  onChange={(e) => setTokenSearchQueries(prev => ({ ...prev, [exchange.id]: e.target.value }))}
                                  placeholder="Поиск по тикеру/названию..."
                                  className="w-full text-[10px] font-bold text-slate-750 placeholder-slate-400 pl-8 pr-2.5 py-1 bg-white border border-slate-200/90 rounded-xl outline-hidden focus:border-indigo-405 focus:bg-white transition-all font-sans"
                                />
                              </div>
                            )}
                          </div>

                          <div className="px-5 py-4 overflow-y-auto max-h-[310px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 scrollbar-thin">
                            {filteredAssets.length === 0 ? (
                              <div className="col-span-full py-6 text-center text-[10px] font-bold text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                                Совпадений не найдено
                              </div>
                            ) : (
                              filteredAssets.map((asset) => (
                                <div 
                                  key={asset.symbol} 
                                  className="flex items-center justify-between p-3 bg-white border border-slate-200/60 hover:border-slate-350 rounded-2xl transition-all shadow-4xs"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <span className={`w-2.5 h-2.5 rounded-full ${getAssetBgColor(asset.symbol)} shrink-0`} />
                                    <div>
                                      <span className="text-xs font-black text-slate-750 leading-none block">{asset.symbol}</span>
                                      <span className="text-[10px] font-bold text-slate-400 mt-1 block leading-none">{asset.name}</span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-xs font-black text-slate-800 font-mono block leading-none">{asset.usdValue}</span>
                                    <span className="text-[9.5px] font-bold text-slate-450 font-mono mt-1 block leading-none">
                                      {asset.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                                    </span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
