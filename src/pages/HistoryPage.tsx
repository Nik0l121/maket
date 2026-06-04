import React, { useState } from "react";
import { createPortal } from "react-dom";
import { 
  Clock, 
  Search, 
  Filter, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ExternalLink, 
  Copy, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  DollarSign, 
  Bookmark, 
  Layers, 
  Zap,
  Check,
  ChevronDown,
  ChevronUp,
  History
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useToast } from "../components/Toast";

export interface HistoricalTrade {
  id: string;
  pair: string;
  network: string;
  executionDate: string;
  executionTime: string;
  buyDex: string;
  sellDex: string;
  status: "Успешно" | "Ошибка" | "В процессе" | "Отменен";
  volume: number;
  volumeAsset: string;
  buyPrice: number;
  sellPrice: number;
  netProfit: number;
  roi: number;
  networkFee: number;
  networkFeeAsset: string;
  txHashTransfer: string;
  addressBuy: string;
  addressSell: string;
  steps: {
    time: string;
    description: string;
    status: "done" | "warning" | "pending" | "info";
    badgeText?: string;
  }[];
}

const mockHistoricalTrades: HistoricalTrade[] = [
  {
    id: "trade-001",
    pair: "BER/USDT",
    network: "BERA",
    executionDate: "04.06.2026",
    executionTime: "08:04",
    buyDex: "HTX",
    sellDex: "Bitget",
    status: "Успешно",
    volume: 414.22,
    volumeAsset: "BER",
    buyPrice: 0.02827,
    sellPrice: 0.02828,
    netProfit: 0.53,
    roi: 4.52,
    networkFee: 0.005,
    networkFeeAsset: "BER",
    txHashTransfer: "0x7b3e9af89c...12fe",
    addressBuy: "0x7415eC...2311",
    addressSell: "0xbf2c33...ee21",
    steps: [
      { time: "08:03:15", description: "Ордер на покупку: 414.22 BER на HTX по курсу $0.02827 (затраты: $11.71 USDT).", status: "done" },
      { time: "08:03:28", description: "Вывод средств на биржу Bitget: перевод 414.21 BER по сети BERA. Комиссия: 0.005 BER.", status: "done" },
      { time: "08:04:52", description: "Ордер на продажу: 414.21 BER на Bitget по курсу $0.02828 (выручка: $11.71 USDT).", status: "done" },
      { time: "08:04:58", description: "Сводный итог: Куплено на $11.71 USDT, продано на $11.71 USDT. Итоговые комиссии: $0.023 USDT + 0.005 BER. Чистая прибыль: +$0.53 USDT.", status: "done", badgeText: "+4.52% ROI" }
    ]
  },
  {
    id: "trade-002",
    pair: "ETHW/USDT",
    network: "ETHW",
    executionDate: "04.06.2026",
    executionTime: "01:22",
    buyDex: "MEXC",
    sellDex: "Gate",
    status: "Успешно",
    volume: 125.40,
    volumeAsset: "ETHW",
    buyPrice: 0.3175,
    sellPrice: 0.3188,
    netProfit: 1.15,
    roi: 2.89,
    networkFee: 0.01,
    networkFeeAsset: "ETHW",
    txHashTransfer: "0x4ae6c098df...cc52",
    addressBuy: "0x892a01...ab12",
    addressSell: "0x5a1b02...ef45",
    steps: [
      { time: "01:20:02", description: "Ордер на покупку: 125.40 ETHW на MEXC по курсу $0.3175 (затраты: $39.81 USDT).", status: "done" },
      { time: "01:20:15", description: "Вывод средств на биржу Gate: перевод 125.39 ETHW по сети ETHW. Комиссия: 0.01 ETHW.", status: "done" },
      { time: "01:22:10", description: "Ордер на продажу: 125.39 ETHW на Gate по курсу $0.3188 (выручка: $39.97 USDT).", status: "done" },
      { time: "01:22:20", description: "Сводный итог: Куплено на $39.81 USDT, продано на $39.97 USDT. Итоговые комиссии: $0.08 USDT + 0.01 ETHW. Чистая прибыль: +$1.15 USDT.", status: "done", badgeText: "+2.89% ROI" }
    ]
  },
  {
    id: "trade-003",
    pair: "BER/USDT",
    network: "BERA",
    executionDate: "03.06.2026",
    executionTime: "18:45",
    buyDex: "Bybit",
    sellDex: "OKX",
    status: "Успешно",
    volume: 850.00,
    volumeAsset: "BER",
    buyPrice: 0.02830,
    sellPrice: 0.02842,
    netProfit: 0.94,
    roi: 3.91,
    networkFee: 0.005,
    networkFeeAsset: "BER",
    txHashTransfer: "0xb3e18cfd92...0a3e",
    addressBuy: "0x1234ea...cba1",
    addressSell: "0x5678fd...9876",
    steps: [
      { time: "18:43:15", description: "Ордер на покупку: 850.00 BER на Bybit по курсу $0.02830 (затраты: $24.06 USDT).", status: "done" },
      { time: "18:43:40", description: "Вывод средств на биржу OKX: перевод 849.99 BER по сети BERA. Комиссия: 0.005 BER.", status: "done" },
      { time: "18:44:50", description: "Ордер на продажу: 849.99 BER на OKX по курсу $0.02842 (выручка: $24.16 USDT).", status: "done" },
      { time: "18:45:00", description: "Сводный итог: Куплено на $24.06 USDT, продано на $24.16 USDT. Итоговые комиссии: $0.048 USDT + 0.005 BER. Чистая прибыль: +$0.94 USDT.", status: "done", badgeText: "+3.91% ROI" }
    ]
  },
  {
    id: "trade-004",
    pair: "SOL/USDT",
    network: "SOL",
    executionDate: "03.06.2026",
    executionTime: "10:14",
    buyDex: "KuCoin",
    sellDex: "Bybit",
    status: "Ошибка",
    volume: 2.50,
    volumeAsset: "SOL",
    buyPrice: 154.20,
    sellPrice: 154.22,
    netProfit: -4.50,
    roi: -1.16,
    networkFee: 0.01,
    networkFeeAsset: "SOL",
    txHashTransfer: "0xf8ab5ee511...41bc",
    addressBuy: "0xbcda81...2390",
    addressSell: "0xac9102...11ff",
    steps: [
      { time: "10:11:15", description: "Ордер на покупку: 2.50 SOL на KuCoin по курсу $154.20 (затраты: $385.50 USDT).", status: "done" },
      { time: "10:12:30", description: "Вывод средств на биржу Bybit завис в мемпуле из-за перегрузки сети Solana (<200 TPS). Комиссия сети списана: 0.01 SOL.", status: "warning", badgeText: "Перегрузка" },
      { time: "10:14:15", description: "Сводный итог: Сделка отменена оператором. Ручной возврат средств. Убыток (списана комиссия сети): -$4.50 USDT.", status: "info", badgeText: "-1.16% ROI" }
    ]
  },
  {
    id: "trade-005",
    pair: "BTC/USDT",
    network: "BTC",
    executionDate: "02.06.2026",
    executionTime: "22:15",
    buyDex: "Binance",
    sellDex: "OKX",
    status: "Успешно",
    volume: 0.15,
    volumeAsset: "BTC",
    buyPrice: 65200.00,
    sellPrice: 65450.00,
    netProfit: 18.25,
    roi: 0.19,
    networkFee: 0.0001,
    networkFeeAsset: "BTC",
    txHashTransfer: "0x91da23e1ca...bfd2",
    addressBuy: "0x1111aa...fade",
    addressSell: "0x2222bb...dead",
    steps: [
      { time: "22:03:15", description: "Ордер на покупку: 0.15 BTC на Binance по курсу $65,200.00 (затраты: $9,780.00 USDT).", status: "done" },
      { time: "22:11:22", description: "Вывод средств на биржу OKX: перевод 0.1499 BTC по сети Lightning Network. Комиссия: 0.0001 BTC.", status: "done" },
      { time: "22:15:00", description: "Ордер на продажу: 0.1499 BTC на OKX по курсу $65,450.00 (выручка: $9,810.95 USDT).", status: "done" },
      { time: "22:15:10", description: "Сводный итог: Куплено на $9,780.00 USDT, продано на $9,810.95 USDT. Итоговые комиссии: $19.59 USDT + 0.0001 BTC. Чистая прибыль: +$18.25 USDT.", status: "done", badgeText: "+0.19% ROI" }
    ]
  },
  {
    id: "trade-006",
    pair: "TON/USDT",
    network: "TON",
    executionDate: "02.06.2026",
    executionTime: "15:40",
    buyDex: "OKX",
    sellDex: "Bitget",
    status: "Успешно",
    volume: 85.00,
    volumeAsset: "TON",
    buyPrice: 6.25,
    sellPrice: 6.32,
    netProfit: 4.82,
    roi: 0.91,
    networkFee: 0.05,
    networkFeeAsset: "TON",
    txHashTransfer: "0x61da928bc1...3dfa",
    addressBuy: "0x8888cc...1a2b",
    addressSell: "0x9999dd...3c4d",
    steps: [
      { time: "15:37:25", description: "Ордер на покупку: 85.00 TON на OKX по курсу $6.25 (затраты: $531.25 USDT).", status: "done" },
      { time: "15:39:12", description: "Вывод средств на биржу Bitget: перевод 84.95 TON по сети TON. Комиссия: 0.05 TON.", status: "done" },
      { time: "15:40:02", description: "Ордер на продажу: 84.95 TON на Bitget по курсу $6.32 (выручка: $536.88 USDT).", status: "done" },
      { time: "15:40:15", description: "Сводный итог: Куплено на $531.25 USDT, продано на $536.88 USDT. Итоговые комиссии: $1.07 USDT + 0.05 TON. Чистая прибыль: +$4.82 USDT.", status: "done", badgeText: "+0.91% ROI" }
    ]
  },
  {
    id: "trade-007",
    pair: "BER/USDT",
    network: "BERA",
    executionDate: "01.06.2026",
    executionTime: "14:10",
    buyDex: "Bybit",
    sellDex: "Gate",
    status: "Отменен",
    volume: 500.00,
    volumeAsset: "BER",
    buyPrice: 0.02810,
    sellPrice: 0.02815,
    netProfit: 0.00,
    roi: 0.00,
    networkFee: 0.00,
    networkFeeAsset: "BER",
    txHashTransfer: "",
    addressBuy: "",
    addressSell: "",
    steps: [
      { time: "14:08:12", description: "Сканер зафиксировал разницу курсов BER (+0.18%). Ордер подготовлен.", status: "done" },
      { time: "14:09:40", description: "Пользователь инициировал принудительную отмену перед исполнением.", status: "info", badgeText: "Отменено" },
      { time: "14:10:00", description: "Сводный итог: Сессия закрыта без резервирования ликвидности. Средства сохранены, комиссии отсутствуют.", status: "done" }
    ]
  }
];

function getExtendedData(trade: HistoricalTrade) {
  const seed = trade.id;
  const memoNum = (seed.charCodeAt(seed.length - 1) * 38294 + 5819) % 900000 + 100000;
  
  let hasMemo = true;
  let memoText = String(memoNum);
  if (trade.volumeAsset === "BER" || trade.volumeAsset === "ETHW") {
    hasMemo = false;
    memoText = "Не требуется (Прямой ERC-20 смарт-контракт)";
  } else if (trade.volumeAsset === "BTC") {
    hasMemo = false;
    memoText = "Отсутствует (SegWit нативный адрес)";
  } else if (trade.volumeAsset === "SOL" || trade.volumeAsset === "TON") {
    hasMemo = true;
    memoText = String(memoNum) + " (Депозитный тег назначений)";
  }

  const buyOrderId = `#${trade.buyDex.toUpperCase().substring(0, 3)}-SP-${(seed.charCodeAt(seed.length - 1) * 2910 + 4829) % 800000 + 100000}`;
  const sellOrderId = `#${trade.sellDex.toUpperCase().substring(0, 3)}-SP-${(seed.charCodeAt(seed.length - 1) * 1928 + 2381) % 800000 + 100000}`;

  let timeSent = "unknown";
  let timeReceived = "unknown";
  
  const stepSent = trade.steps.find(s => s.description.toLowerCase().includes("вывод") || s.description.toLowerCase().includes("трансфер") || s.description.toLowerCase().includes("запуск"));
  const stepRecv = trade.steps.find(s => s.description.toLowerCase().includes("зачисление") || s.description.toLowerCase().includes("баланс") || s.description.toLowerCase().includes("продаж") || s.description.toLowerCase().includes("исполнен"));

  if (stepSent) timeSent = stepSent.time;
  else if (trade.steps[2]) timeSent = trade.steps[2].time;
  else timeSent = trade.executionTime + ":15";

  if (stepRecv) timeReceived = stepRecv.time;
  else if (trade.steps[trade.steps.length - 1]) timeReceived = trade.steps[trade.steps.length - 1].time;
  else timeReceived = trade.executionTime + ":45";

  const buyTotal = trade.volume * trade.buyPrice;
  const buyFee = buyTotal * 0.001; 
  
  const receiveAmount = Math.max(0, trade.volume - trade.networkFee);
  const sellTotal = receiveAmount * trade.sellPrice;
  const sellFee = sellTotal * 0.001; 
  
  return {
    buyOrderId,
    sellOrderId,
    hasMemo,
    memoText,
    timeSent,
    timeReceived,
    buyTotal,
    buyFee,
    receiveAmount,
    sellTotal,
    sellFee
  };
}

function getStepDetailsType(stepText: string): "buy" | "transfer" | "sell" | "summary" | null {
  const norm = stepText.toLowerCase();
  
  if (norm.includes("сводный итог") || norm.includes("итог")) {
    return "summary";
  }
  if (norm.includes("вывод") || norm.includes("трансфер") || norm.includes("зачисление средств") || norm.includes("баланс зачислен") || norm.includes("перевод по блокчейну")) {
    return "transfer";
  }
  if (norm.includes("продаж") || norm.includes("сделка исполнена") || norm.includes("итог маржи") || norm.includes("выручка")) {
    return "sell";
  }
  if (norm.includes("покупк") || norm.includes("куплен") || norm.includes("закупк") || norm.includes("ордер исполнен") || norm.includes("ордер на покупку")) {
    return "buy";
  }
  return null;
}

interface HistoryPageProps {
  onGoToSignal?: (pair: string) => void;
}

export function HistoryPage({ onGoToSignal }: HistoryPageProps = {}) {
  const { showToast } = useToast();
  const [trades, setTrades] = useState<HistoricalTrade[]>(mockHistoricalTrades);
  const [searchTerm, setSearchTerm] = useState("");
  const [exchangeFilter, setExchangeFilter] = useState("Все");
  const [statusFilter, setStatusFilter] = useState("Все");
  const [selectedTrade, setSelectedTrade] = useState<HistoricalTrade | null>(null);
  const [reportMode, setReportMode] = useState<"standard" | "extended">("standard");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedStepIdx, setExpandedStepIdx] = useState<number | null>(null);

  const handleSelectTrade = (trade: HistoricalTrade | null) => {
    setSelectedTrade(trade);
    setReportMode("standard");
    setExpandedStepIdx(null);
  };

  const ext = selectedTrade ? getExtendedData(selectedTrade) : null;

  // Stats derivations
  const successfulTrades = trades.filter(t => t.status === "Успешно");
  const totalProfit = successfulTrades.reduce((acc, t) => acc + t.netProfit, 0);
  const winRate = ((successfulTrades.length / trades.filter(t => t.status !== "В процессе" && t.status !== "Отменен").length) * 100).toFixed(1);

  const handleCopyText = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    showToast(`${label} успешно скопирован!`, "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRefresh = () => {
    showToast("История сделок синхронизирована с блокчейн-нодами", "info");
  };

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = trade.pair.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          trade.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          trade.volumeAsset.toLowerCase().includes(searchTerm.toLowerCase());
                          
    const matchesExchange = exchangeFilter === "Все" || 
                            trade.buyDex.toLowerCase() === exchangeFilter.toLowerCase() || 
                            trade.sellDex.toLowerCase() === exchangeFilter.toLowerCase();
                            
    const matchesStatus = statusFilter === "Все" || trade.status === statusFilter;
    
    return matchesSearch && matchesExchange && matchesStatus;
  });

  const getStatusColor = (status: HistoricalTrade["status"]) => {
    switch (status) {
      case "Успешно":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30";
      case "Ошибка":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-100 dark:border-rose-900/30";
      case "В процессе":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-100 dark:border-blue-900/30";
      case "Отменен":
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700";
      default:
        return "bg-slate-50 text-slate-705 border-slate-100";
    }
  };

  return (
    <div id="history-page" className="flex-1 p-4 lg:p-6 space-y-6 overflow-y-auto">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-200/50 pb-5 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-600/10 border border-blue-500/15 text-blue-600 shadow-3xs">
            <History size={20} className="stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none uppercase">История сделок</h1>
            <p className="text-[10px] font-bold text-slate-400 mt-1">
              Подробный аудит исполненных и завершенных арбитражных кругов
            </p>
          </div>
        </div>

        <button 
          onClick={handleRefresh}
          className="self-end sm:self-auto flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-405 hover:bg-slate-50 dark:hover:bg-slate-850 bg-white dark:bg-slate-900 rounded-xl transition-all shadow-4xs active:scale-95 cursor-pointer"
        >
          <RefreshCw size={12} className="text-slate-400" />
          Синхронизировать
        </button>
      </div>

      {/* Analytics widgets with neat custom background gradients */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        {/* Card 1: Profit */}
        <div className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-950/25 dark:to-teal-950/20 border border-emerald-500/10 dark:border-emerald-500/15 p-4 rounded-2xl flex flex-col justify-between hover:shadow-2xs transition-all duration-200">
          <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none">Всего чистой прибыли</span>
          <span className="text-xl font-black font-mono tracking-tight text-emerald-600 dark:text-emerald-400 mt-2 block">
            +${totalProfit.toFixed(2)}
          </span>
          <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
            <TrendingUp size={10} className="text-emerald-500" /> Вычет всех сборов сети
          </p>
        </div>

        {/* Card 2: Successful Trades */}
        <div className="bg-gradient-to-br from-blue-500/5 to-indigo-500/5 dark:from-blue-950/25 dark:to-indigo-950/20 border border-blue-500/10 dark:border-blue-500/15 p-4 rounded-2xl flex flex-col justify-between hover:shadow-2xs transition-all duration-200">
          <span className="text-[9px] font-black text-blue-600 dark:text-blue-450 uppercase tracking-widest leading-none">Успешно закрыто</span>
          <span className="text-xl font-black font-mono tracking-tight text-slate-800 dark:text-slate-200 mt-2 block">
            {successfulTrades.length} / {trades.length} кругов
          </span>
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-505 mt-1">Остальные диверсифицированы</span>
        </div>

        {/* Card 3: Win Rate */}
        <div className="bg-gradient-to-br from-indigo-500/5 to-violet-500/5 dark:from-indigo-950/25 dark:to-violet-950/20 border border-indigo-500/10 dark:border-indigo-500/15 p-4 rounded-2xl flex flex-col justify-between hover:shadow-2xs transition-all duration-200">
          <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest leading-none">Успешность винрейт</span>
          <span className="text-xl font-black font-mono tracking-tight text-indigo-500 dark:text-indigo-400 mt-2 block">
            {winRate}%
          </span>
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-505 mt-1">Высокая точность кругов</span>
        </div>

        {/* Card 4: Protected Capital */}
        <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 dark:from-amber-950/25 dark:to-orange-950/20 border border-amber-500/15 dark:border-amber-500/20 p-4 rounded-2xl flex flex-col justify-between hover:shadow-2xs transition-all duration-200">
          <span className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest leading-none">Сохраненный депозит</span>
          <span className="text-xl font-black font-mono tracking-tight text-slate-800 dark:text-slate-200 mt-2 block">
            $9,410.00
          </span>
          <span className="text-[9px] font-bold text-emerald-500 dark:text-emerald-400 mt-1 leading-normal uppercase text-[8px] font-extrabold tracking-wider bg-emerald-500/10 dark:bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/20 dark:border-emerald-500/15 self-start">ПОД ЗАЩИТОЙ SLIPPAGE</span>
        </div>
      </div>

      {/* Operational Controls Sidebar / Controls Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-3xl p-4.5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-3.5 text-slate-400 stroke-[2.5]" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск по паре или ID сделки (например, BER, trade-001)..."
              className="w-full text-xs font-bold text-slate-700 dark:text-slate-202 placeholder-slate-400 pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-xl outline-hidden focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900/40 transition-all font-sans"
            />
          </div>

          {/* Exchange Filter */}
          <div className="w-full md:w-52">
            <div className="relative">
              <select 
                value={exchangeFilter}
                onChange={(e) => setExchangeFilter(e.target.value)}
                className="w-full text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 outline-hidden focus:border-blue-400 cursor-pointer appearance-none"
              >
                <option value="Все">Биржа: Все</option>
                <option value="HTX">HTX</option>
                <option value="Bitget">Bitget</option>
                <option value="OKX">OKX</option>
                <option value="Bybit">Bybit</option>
                <option value="Gate">Gate</option>
                <option value="KuCoin">KuCoin</option>
                <option value="MEXC">MEXC</option>
                <option value="Binance">Binance</option>
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
                <Filter size={12} />
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-48">
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 outline-hidden focus:border-blue-400 cursor-pointer appearance-none"
              >
                <option value="Все">Статус: Все</option>
                <option value="Успешно">Успешно</option>
                <option value="Ошибка">Ошибка</option>
                <option value="В процессе">В процессе</option>
                <option value="Отменен">Отменен</option>
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
                <Filter size={12} />
              </div>
            </div>
          </div>
        </div>

        {/* Table Rows Structure */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="py-3 px-4">Сделка / Валютная пара</th>
                <th className="py-3 px-4">Направление (Маршрут)</th>
                <th className="py-3 px-4 text-right">Объем торгов</th>
                <th className="py-3 px-4 text-right">Стоимость входа / выхода</th>
                <th className="py-3 px-4 text-center">Статус</th>
                <th className="py-3 px-4 text-right">Результат круга</th>
                <th className="py-3 px-4 text-center">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredTrades.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium font-sans">
                    Исторических записей по вашему запросу не найдено.
                  </td>
                </tr>
              ) : (
                filteredTrades.map((trade) => {
                  const isProfit = trade.netProfit > 0;
                  return (
                    <tr 
                      key={trade.id}
                      onClick={() => handleSelectTrade(trade)}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-850/40 transition-colors duration-150 cursor-pointer group"
                    >
                      {/* Name details */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{trade.pair}</span>
                          <span className="text-[9px] font-mono font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{trade.id} · {trade.executionDate} {trade.executionTime}</span>
                        </div>
                      </td>

                      {/* Route */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-2 py-0.5 rounded text-[10.5px] font-bold text-slate-600 dark:text-slate-350">
                            {trade.buyDex}
                          </span>
                          <span className="text-slate-400 font-bold">→</span>
                          <span className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100/40 dark:border-indigo-900/30 px-2 py-0.5 rounded text-[10.5px] font-bold text-indigo-600 dark:text-indigo-400">
                            {trade.sellDex}
                          </span>
                        </div>
                      </td>

                      {/* volume */}
                      <td className="py-4 px-4 text-right font-mono font-semibold text-slate-700 dark:text-slate-350">
                        {trade.volume.toLocaleString('en-US')} {trade.volumeAsset}
                      </td>

                      {/* Buy price / sell price */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex flex-col font-mono text-[11px] leading-snug">
                          <span className="text-slate-500 font-medium">B: ${trade.buyPrice.toFixed(5)}</span>
                          <span className="text-slate-700 dark:text-slate-300 font-bold">S: ${trade.sellPrice.toFixed(5)}</span>
                        </div>
                      </td>

                      {/* status */}
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center border text-[9px] font-black rounded-lg px-2 py-0.5 border leading-none uppercase ${getStatusColor(trade.status)}`}>
                          {trade.status}
                        </span>
                      </td>

                      {/* Net profit */}
                      <td className="py-4 px-4 text-right">
                        {trade.status === "Отменен" ? (
                          <span className="font-mono text-slate-400">—</span>
                        ) : isProfit ? (
                          <div className="flex flex-col items-end leading-snug font-mono">
                            <span className="text-emerald-600 dark:text-emerald-400 font-black">
                              +${trade.netProfit.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-emerald-500 font-bold">
                              +{trade.roi.toFixed(2)}% ROI
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-end leading-snug font-mono">
                            <span className="text-rose-600 dark:text-rose-400 font-black">
                              -${Math.abs(trade.netProfit).toFixed(2)}
                            </span>
                            <span className="text-[10px] text-rose-500 font-bold">
                              {trade.roi.toFixed(2)}% ROI
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectTrade(trade);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50/50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10.5px] font-bold uppercase tracking-wider transition-colors cursor-pointer border-0"
                        >
                          Отчет
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Report Section */}
      {createPortal(
        <AnimatePresence>
          {selectedTrade && (
            <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 z-50">
            {/* Modal Body container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] z-10"
            >
              {/* Header section with Close */}
              <div className="p-5 border-b border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-920">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl text-xs font-black ${
                    selectedTrade.status === "Успешно" 
                      ? "bg-emerald-500/10 text-emerald-600" 
                      : selectedTrade.status === "Ошибка" 
                        ? "bg-rose-500/10 text-rose-600" 
                        : "bg-slate-500/10 text-slate-500"
                  }`}>
                    {selectedTrade.pair}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-850 dark:text-slate-100 uppercase leading-none">Отчет о проведении арбитража</h3>
                    <div className="flex items-center flex-wrap gap-2 mt-1.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono leading-none">
                        ID операции: #{selectedTrade.id} · {selectedTrade.executionDate} в {selectedTrade.executionTime}
                      </p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleSelectTrade(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border-0"
                >
                  <X size={15} className="stroke-[2.5]" />
                </button>
              </div>

              {/* Scrollable analysis report content */}
              <div className="overflow-y-auto p-5 space-y-6 font-sans">
                {/* Ledger metrics overview columns */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50/40 dark:bg-[#121d30] border border-slate-100 dark:border-slate-800/80 p-4 rounded-2xl">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase leading-none">Куплено на {selectedTrade.buyDex}</span>
                    <strong className="text-xs font-black text-slate-800 dark:text-slate-250 mt-1 font-mono tracking-tight select-all">
                      {selectedTrade.volume} {selectedTrade.volumeAsset}
                    </strong>
                    <span className="text-[9px] font-bold text-slate-455 dark:text-slate-400 font-mono mt-0.5">@ ${selectedTrade.buyPrice}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase leading-none">Продано на {selectedTrade.sellDex}</span>
                    <strong className="text-xs font-black text-slate-800 dark:text-slate-250 mt-1 font-mono tracking-tight select-all">
                      {(selectedTrade.volume * 0.999).toFixed(2)} {selectedTrade.volumeAsset}
                    </strong>
                    <span className="text-[9px] font-bold text-slate-455 dark:text-slate-400 font-mono mt-0.5">@ ${selectedTrade.sellPrice}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase leading-none">Сеть и сборы вывода</span>
                    <strong className="text-xs font-black text-slate-850 dark:text-slate-250 mt-1 font-mono tracking-tight">
                      {selectedTrade.networkFee} {selectedTrade.networkFeeAsset}
                    </strong>
                    <span className="text-[9px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest font-mono mt-0.5">{selectedTrade.network} network</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-505 uppercase leading-none">Чистый профит</span>
                    <strong className={`text-xs font-black mt-1 font-mono tracking-tight ${selectedTrade.netProfit >= 0 ? "text-emerald-505" : "text-rose-505"}`}>
                      {selectedTrade.netProfit >= 0 ? `+$${selectedTrade.netProfit.toFixed(2)}` : `-$${Math.abs(selectedTrade.netProfit).toFixed(2)}`}
                    </strong>
                    <span className={`text-[9px] font-semibold uppercase tracking-wider px-1 inline-block self-start rounded mt-0.5 ${
                      selectedTrade.netProfit >= 0 
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    }`}>
                      {selectedTrade.roi.toFixed(2)}% ROI
                    </span>
                  </div>
                </div>

                {/* Step-by-Step Blockchain Audit Log */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Пошаговый трек транзакции</h4>
                    <span className="text-[8.5px] font-semibold text-slate-400 dark:text-slate-505 uppercase tracking-wider">
                      Нажмите на шаг для просмотра деталей
                    </span>
                  </div>
                  
                  <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-[32px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800">
                    {selectedTrade.steps.map((step, idx) => {
                      const detailsType = getStepDetailsType(step.description);
                      const isExpandable = detailsType !== null;
                      const isExpanded = expandedStepIdx === idx;

                      return (
                        <div key={idx} className="relative flex items-start gap-3.5">
                          {/* Bullet point node marker - perfectly centered with line */}
                          <div className="relative flex flex-col items-center shrink-0 w-[18px] pt-1">
                            <span className={`w-3.5 h-3.5 rounded-full border-2 bg-white dark:bg-slate-900 transition-colors z-10 ${
                              step.status === "done" 
                                ? "border-emerald-500 bg-emerald-500" 
                                : step.status === "warning" 
                                  ? "border-amber-500 bg-amber-500" 
                                  : "border-slate-300"
                            }`} />
                          </div>

                          {/* Content block */}
                          <div 
                            className={`flex-1 min-w-0 transition-all duration-205 p-2.5 -m-2.5 rounded-2xl ${
                              isExpandable 
                                ? "cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/15 border border-transparent hover:border-slate-100 dark:hover:border-slate-800/60" 
                                : ""
                            }`}
                            onClick={() => {
                              if (isExpandable) {
                                setExpandedStepIdx(isExpanded ? null : idx);
                              }
                            }}
                          >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-1.5">
                              <div className="space-y-0.5">
                                <span className="text-[10px] font-black font-mono text-slate-400 leading-none">{step.time}</span>
                                <p className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 leading-snug">
                                  {step.description}
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-2 self-start shrink-0">
                                {isExpandable && (
                                  <button 
                                    type="button"
                                    className={`p-1 flex items-center justify-center transition-all duration-205 rounded-lg border cursor-pointer focus:outline-hidden ${
                                      isExpanded
                                        ? "bg-amber-500/10 border-amber-500/20 text-amber-505"
                                        : "bg-indigo-500/5 hover:bg-indigo-500/10 dark:bg-indigo-950/40 border-indigo-100/30 dark:border-indigo-900/40 text-indigo-500 dark:text-indigo-400"
                                    }`}
                                  >
                                    {isExpanded ? <ChevronUp size={11} className="stroke-[2.5]" /> : <ChevronDown size={11} className="stroke-[2.5]" />}
                                  </button>
                                )}
                                
                                {step.badgeText && (
                                  <span className="text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 bg-blue-50/50 dark:bg-indigo-950 text-blue-600 dark:text-indigo-400 border border-blue-100/50 dark:border-indigo-900 overflow-hidden rounded-md text-right">
                                    {step.badgeText}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Render expandable detailed metrics */}
                            {isExpanded && detailsType === "buy" && ext && (
                              <div 
                                className="mt-3.5 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-850/60 rounded-xl p-4 space-y-3 text-xs text-left"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="font-extrabold text-[9px] text-slate-550 uppercase tracking-wider">Аналитика исполнения сделки на CEX (Buy Order)</span>
                                  </div>
                                  <span className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase font-mono">
                                    Исполнен (Filled)
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4">
                                  <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider">Биржа покупки</span>
                                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-205 mt-1">{selectedTrade.buyDex}</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider">Валютная пара</span>
                                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-205 mt-1 font-mono">{selectedTrade.pair}</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider">ID ордера</span>
                                    <span className="text-[11px] font-mono text-slate-500 mt-1 truncate" title={ext.buyOrderId}>{ext.buyOrderId}</span>
                                  </div>
                                  <div className="flex flex-col border-t border-slate-100/50 dark:border-slate-800/40 pt-2">
                                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider">Курс исполнения</span>
                                    <span className="text-[11px] font-bold font-mono text-slate-700 dark:text-slate-300 mt-1">${selectedTrade.buyPrice.toFixed(5)}</span>
                                  </div>
                                  <div className="flex flex-col border-t border-slate-100/50 dark:border-slate-800/40 pt-2">
                                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider">Объем закупки</span>
                                    <span className="text-[11px] font-bold font-mono text-slate-700 dark:text-slate-305 mt-1">
                                      {selectedTrade.volume} {selectedTrade.volumeAsset}
                                    </span>
                                  </div>
                                  <div className="flex flex-col border-t border-slate-100/50 dark:border-slate-800/40 pt-2">
                                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider">Квота затрат (USDT)</span>
                                    <span className="text-[11px] font-bold font-mono mt-1 text-indigo-605 dark:text-indigo-400">
                                      ${ext.buyTotal.toFixed(4)}
                                    </span>
                                  </div>
                                  <div className="flex flex-col border-t border-slate-100/50 dark:border-slate-800/40 pt-2">
                                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider">Комиссия (0.1%)</span>
                                    <span className="text-[11px] font-bold font-mono text-rose-505 mt-1">
                                      -{ext.buyFee.toFixed(4)} USDT
                                    </span>
                                  </div>
                                  <div className="flex flex-col border-t border-slate-100/50 dark:border-slate-800/40 pt-2">
                                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider">Время операции</span>
                                    <span className="text-[11px] font-mono text-slate-600 dark:text-slate-355 mt-1">{ext.timeSent}</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {isExpanded && detailsType === "transfer" && ext && (
                              <div 
                                className="mt-3.5 bg-indigo-50/10 dark:bg-indigo-950/10 border border-indigo-100/30 dark:border-indigo-900/40 rounded-xl p-4 space-y-3.5 text-xs text-left"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex items-center justify-between border-b border-indigo-100/30 dark:border-indigo-900/30 pb-2">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                    <span className="font-extrabold text-[9px] text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Детали монетного трансфера (Fund Transfer)</span>
                                  </div>
                                  <span className="text-[8px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded uppercase font-mono">
                                    Зачислено
                                  </span>
                                </div>

                                <div className="flex flex-col gap-2.5">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                    <div className="flex flex-col">
                                      <span className="text-[8px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Адрес отправителя (From Wallet)</span>
                                      <div className="flex items-center justify-between bg-white dark:bg-slate-900/70 p-1.5 rounded-lg mt-1 border border-slate-200/40 dark:border-slate-800">
                                        <span className="font-mono text-[9.5px] text-slate-550 truncate select-all leading-none">{selectedTrade.addressBuy || "0x7415eC29bc12ea808"}</span>
                                        <button 
                                          type="button"
                                          onClick={(e) => { e.stopPropagation(); handleCopyText(selectedTrade.addressBuy || "0x7415eC29bc12ea800", "Адрес отправителя"); }}
                                          className="text-slate-400 hover:text-slate-600 cursor-pointer ml-1 p-0.5 rounded hover:bg-slate-100"
                                        >
                                          <Copy size={10.5} />
                                        </button>
                                      </div>
                                    </div>

                                    <div className="flex flex-col">
                                      <span className="text-[8px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Адрес получателя (To Wallet)</span>
                                      <div className="flex items-center justify-between bg-white dark:bg-slate-900/70 p-1.5 rounded-lg mt-1 border border-slate-200/40 dark:border-slate-800">
                                        <span className="font-mono text-[9.5px] text-slate-550 truncate select-all leading-none">{selectedTrade.addressSell || "0xbf2c33ba210edfeab"}</span>
                                        <button 
                                          type="button"
                                          onClick={(e) => { e.stopPropagation(); handleCopyText(selectedTrade.addressSell || "0xbf2c33ba210edfeab", "Адрес получателя"); }}
                                          className="text-slate-400 hover:text-slate-600 cursor-pointer ml-1 p-0.5 rounded hover:bg-slate-100"
                                        >
                                          <Copy size={10.5} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4 border-t border-slate-100 dark:border-slate-800/40 pt-2.5">
                                    <div className="flex flex-col">
                                      <span className="text-[8px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Валютная сеть (Network)</span>
                                      <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 mt-1 uppercase font-mono">{selectedTrade.network}</span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[8px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Комиссия сети (Fee)</span>
                                      <span className="text-[11px] font-bold font-mono text-rose-500 mt-1 flex items-center flex-row">-{selectedTrade.networkFee} {selectedTrade.networkFeeAsset}</span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[8px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">MEMO / Тег назначения</span>
                                      <span className={`text-[10px] font-mono mt-1 ${ext.hasMemo ? "text-amber-500 font-bold" : "text-slate-400"}`}>{ext.memoText}</span>
                                    </div>
                                    <div className="flex flex-col border-t border-slate-100 dark:border-slate-800/40 pt-2">
                                      <span className="text-[8px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Начало перевода</span>
                                      <span className="text-[11px] font-mono text-slate-600 dark:text-slate-350 mt-1">{ext.timeSent}</span>
                                    </div>
                                     <div className="flex flex-col border-t border-slate-100 dark:border-slate-800/40 pt-2">
                                       <span className="text-[8px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Фиксация депозита</span>
                                       <span className="text-[11px] font-mono text-slate-600 dark:text-slate-350 mt-1">{ext.timeReceived}</span>
                                     </div>
                                     <div className="flex flex-col border-t border-slate-100 dark:border-slate-800/40 pt-2">
                                       <span className="text-[8px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Чистый объем перевода</span>
                                       <span className="text-[11px] font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                                         {ext.receiveAmount.toFixed(4)} {selectedTrade.volumeAsset}
                                       </span>
                                     </div>
                                   </div>
                                 </div>
                               </div>
                             )}

                             {isExpanded && detailsType === "sell" && ext && (
                              <div 
                                className="mt-3.5 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-850/60 rounded-xl p-4 space-y-3 text-xs text-left"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                    <span className="font-extrabold text-[9px] text-slate-550 uppercase tracking-wider">Детальный аудит продажи (Sell Order)</span>
                                  </div>
                                  <span className="text-[8px] font-black text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded uppercase font-mono">
                                    Исполнен (Filled)
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4">
                                  <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Биржа продажи</span>
                                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 mt-1">{selectedTrade.sellDex}</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Валютная пара</span>
                                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 mt-1 font-mono">{selectedTrade.pair}</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">ID ордера</span>
                                    <span className="text-[11px] font-mono text-slate-500 mt-1 truncate" title={ext.sellOrderId}>{ext.sellOrderId}</span>
                                  </div>
                                  <div className="flex flex-col border-t border-slate-100/50 dark:border-slate-800/40 pt-2">
                                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Курс исполнения</span>
                                    <span className="text-[11px] font-bold font-mono text-slate-700 dark:text-slate-300 mt-1">${selectedTrade.sellPrice.toFixed(5)}</span>
                                  </div>
                                  <div className="flex flex-col border-t border-slate-100/50 dark:border-slate-800/40 pt-2">
                                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Проданный объем</span>
                                    <span className="text-[11px] font-bold font-mono text-slate-700 dark:text-slate-300 mt-1">
                                      {ext.receiveAmount.toFixed(4)} {selectedTrade.volumeAsset}
                                    </span>
                                  </div>
                                  <div className="flex flex-col border-t border-slate-100/50 dark:border-slate-800/40 pt-2">
                                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Итоговая выручка</span>
                                    <span className="text-[11px] font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                                      ${ext.sellTotal.toFixed(4)} USDT
                                    </span>
                                  </div>
                                  <div className="flex flex-col border-t border-slate-100/50 dark:border-slate-800/40 pt-2">
                                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Комиссия (0.1%)</span>
                                    <span className="text-[11px] font-bold font-mono text-rose-500 mt-1">
                                      -{ext.sellFee.toFixed(4)} USDT
                                    </span>
                                  </div>
                                  <div className="flex flex-col border-t border-slate-100/50 dark:border-slate-800/40 pt-2">
                                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Время операции</span>
                                    <span className="text-[11px] font-mono text-slate-600 dark:text-slate-355 mt-1">{ext.timeReceived}</span>
                                  </div>
                                  <div className="flex flex-col border-t border-slate-100/50 dark:border-slate-800/40 pt-2">
                                    <span className="text-[8px] font-bold text-slate-405 dark:text-slate-555 uppercase tracking-wider">Чистый результат</span>
                                    <span className={`text-[10px] font-black mt-1 leading-none uppercase ${selectedTrade.netProfit >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                                      {selectedTrade.netProfit >= 0 ? `+${selectedTrade.roi}% (Прибыль)` : `${selectedTrade.roi}% (Убыток)`}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {isExpanded && detailsType === "summary" && ext && (
                              <div 
                                className="mt-3.5 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/55 dark:border-slate-850/60 rounded-2xl p-4.5 space-y-4 text-xs text-left"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {/* Title of summary */}
                                <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800/60 pb-2.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                    <span className="font-extrabold text-[9.5px] text-slate-550 uppercase tracking-wider">Сводное сравнение этапов операции (Buy vs Sell)</span>
                                  </div>
                                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase font-mono ${
                                    selectedTrade.netProfit >= 0 
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                  }`}>
                                    {selectedTrade.netProfit >= 0 ? "Сделка прибыльна" : "Убыточная сделка"}
                                  </span>
                                </div>

                                {/* Side-by-side Buy vs Sell */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                                  {/* Visual connector/divider */}
                                  <div className="hidden md:block absolute left-1/2 top-2 bottom-2 w-px bg-slate-200/50 dark:bg-slate-800/50 -translate-x-1/2" />

                                  {/* Buy Column */}
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2 border-b border-emerald-500/10 pb-1.5">
                                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <ArrowDownRight size={10} className="stroke-[3]" />
                                      </div>
                                      <span className="font-black text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                        1. Вход (Покупка на {selectedTrade.buyDex})
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-2.5 gap-x-2">
                                      <div>
                                        <span className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase">Биржа закупки</span>
                                        <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200">{selectedTrade.buyDex}</span>
                                      </div>
                                      <div>
                                        <span className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase">Курс покупки</span>
                                        <span className="text-[11px] font-extrabold font-mono text-slate-800 dark:text-slate-200">${selectedTrade.buyPrice.toFixed(5)}</span>
                                      </div>
                                      <div>
                                        <span className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase">Объем покупки</span>
                                        <span className="text-[11px] font-extrabold font-mono text-slate-800 dark:text-slate-200">
                                          {selectedTrade.volume} {selectedTrade.volumeAsset}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase">Комиссия (0.1%)</span>
                                        <span className="text-[11px] font-bold font-mono text-rose-500">-${ext.buyFee.toFixed(4)} USDT</span>
                                      </div>
                                      <div className="col-span-2 bg-slate-100/30 dark:bg-slate-900/40 p-2 rounded-xl border border-slate-200/30 dark:border-slate-850/60">
                                        <span className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase">Итого затрачено капитала</span>
                                        <span className="text-xs font-black font-mono text-slate-800 dark:text-slate-200 mt-0.5 block">${ext.buyTotal.toFixed(4)} USDT</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Sell Column */}
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2 border-b border-indigo-500/10 pb-1.5">
                                      <div className="w-4 h-4 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                        <ArrowUpRight size={10} className="stroke-[3]" />
                                      </div>
                                      <span className="font-black text-[10px] text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                        2. Выход (Продажа на {selectedTrade.sellDex})
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-2.5 gap-x-2">
                                      <div>
                                        <span className="block text-[8px] font-bold text-slate-400 dark:text-slate-550 uppercase">Биржа выхода</span>
                                        <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200">{selectedTrade.sellDex}</span>
                                      </div>
                                      <div>
                                        <span className="block text-[8px] font-bold text-slate-400 dark:text-slate-550 uppercase">Курс продажи</span>
                                        <div className="flex items-center gap-1">
                                          <span className="text-[11px] font-extrabold font-mono text-slate-800 dark:text-slate-200">${selectedTrade.sellPrice.toFixed(5)}</span>
                                          {selectedTrade.sellPrice > selectedTrade.buyPrice && (
                                            <span className="text-[8px] font-black text-emerald-500 bg-emerald-500/10 px-1 py-0.2 rounded-sm leading-none">
                                              +{(((selectedTrade.sellPrice - selectedTrade.buyPrice) / selectedTrade.buyPrice) * 100).toFixed(2)}%
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div>
                                        <span className="block text-[8px] font-bold text-slate-400 dark:text-slate-550 uppercase">Проданный объем</span>
                                        <span className="text-[11px] font-extrabold font-mono text-slate-800 dark:text-slate-200">
                                          {ext.receiveAmount.toFixed(4)} {selectedTrade.volumeAsset}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="block text-[8px] font-bold text-slate-400 dark:text-slate-550 uppercase">Комиссия (0.1%)</span>
                                        <span className="text-[11px] font-bold font-mono text-rose-500">-${ext.sellFee.toFixed(4)} USDT</span>
                                      </div>
                                      <div className="col-span-2 bg-slate-100/30 dark:bg-slate-900/40 p-2 rounded-xl border border-slate-200/30 dark:border-slate-850/60">
                                        <span className="block text-[8px] font-bold text-slate-400 dark:text-slate-550 uppercase">Итого выручено средств</span>
                                        <span className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block">${ext.sellTotal.toFixed(4)} USDT</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Financial Summary and Metrics */}
                                <div className="border-t border-slate-150 dark:border-slate-800/60 pt-3.5 space-y-3">
                                  <span className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Баланс доходности круга арбитража</span>
                                  
                                  {/* Dynamic progress bar */}
                                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden flex">
                                    <div 
                                      className="bg-emerald-500/80 transition-all duration-300 h-full" 
                                      style={{ width: `${selectedTrade.netProfit >= 0 ? Math.min(100, Math.max(20, 50 + selectedTrade.roi * 5)) : 30}%` }} 
                                    />
                                    <div 
                                      className="bg-rose-400/80 transition-all duration-300 h-full flex-1" 
                                    />
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                                    {/* Total Costs */}
                                    <div className="bg-slate-100/30 dark:bg-slate-900/45 p-2.5 rounded-xl border border-slate-200/40 dark:border-slate-800/75">
                                      <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Всего затрат (USDT)</span>
                                      <div className="flex items-baseline gap-1 mt-1 font-mono">
                                        <span className="text-xs font-extrabold text-slate-700 dark:text-slate-250">
                                          ${(ext.buyTotal + ext.buyFee + ext.sellFee).toFixed(4)}
                                        </span>
                                        <span className="text-[9px] text-slate-400">USDT</span>
                                      </div>
                                      <span className="text-[8px] text-slate-400 mt-0.5 block">(сделка + комиссии CEX)</span>
                                    </div>

                                    {/* Network GAS fee */}
                                    <div className="bg-slate-100/30 dark:bg-slate-900/45 p-2.5 rounded-xl border border-slate-200/40 dark:border-slate-800/75">
                                      <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Комиссия блокчейн-сети</span>
                                      <div className="flex items-baseline gap-1 mt-1 font-mono">
                                        <span className="text-xs font-extrabold text-rose-500">
                                          {selectedTrade.networkFee} {selectedTrade.networkFeeAsset}
                                        </span>
                                      </div>
                                      <span className="text-[8px] text-slate-400 mt-0.5 block">({selectedTrade.network} Network Fee)</span>
                                    </div>

                                    {/* Net financial profile */}
                                    <div className={`p-2.5 rounded-xl border ${
                                      selectedTrade.netProfit >= 0 
                                        ? "bg-emerald-500/[0.04] dark:bg-emerald-950/20 border-emerald-500/10 dark:border-emerald-500/25 text-emerald-600 dark:text-emerald-400" 
                                        : "bg-rose-500/[0.04] dark:bg-rose-950/20 border-rose-500/10 dark:border-rose-500/25 text-rose-600 dark:text-rose-400"
                                    }`}>
                                      <span className="text-[8px] font-black uppercase block">Чистый финансовый итог</span>
                                      <div className="flex items-baseline gap-1 mt-1 font-mono">
                                        <span className="text-sm font-black">
                                          {selectedTrade.netProfit >= 0 ? `+$${selectedTrade.netProfit.toFixed(2)}` : `-$${Math.abs(selectedTrade.netProfit).toFixed(2)}`}
                                        </span>
                                        <span className="text-[9.5px] font-extrabold">USDT</span>
                                      </div>
                                      <span className="text-[8px] font-black uppercase tracking-wider block mt-0.5">
                                        {selectedTrade.roi.toFixed(2)}% ROI
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action operations footer */}
              <div className="p-4 bg-slate-50/50 dark:bg-slate-920 border-t border-slate-200/50 dark:border-slate-800/70 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400">
                  Общая маржинальность круга: <strong className="text-slate-600 dark:text-slate-350">{selectedTrade.roi}% ROI</strong>
                </span>

                <div className="flex items-center gap-2">
                  {onGoToSignal && (
                    <button
                      type="button"
                      onClick={() => {
                        onGoToSignal(selectedTrade.pair);
                        handleSelectTrade(null);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-[10.5px] font-black uppercase tracking-wider text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/15 dark:bg-blue-500/15 dark:hover:bg-blue-500/25 border-0 rounded-xl transition-all cursor-pointer select-none active:scale-95 duration-150"
                    >
                      <Zap size={11} className="fill-blue-600 dark:fill-blue-400 stroke-[3]" />
                      Смотреть сигнал
                    </button>
                  )}
                  <button 
                    onClick={() => handleSelectTrade(null)}
                    className="px-4 py-2 text-[10.5px] font-black uppercase tracking-wider bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-755 text-slate-600 dark:text-slate-300 rounded-xl transition-all cursor-pointer"
                  >
                    Закрыть отчет
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </div>
  );
}
