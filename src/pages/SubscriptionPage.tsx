import React, { useState } from "react";
import { 
  CreditCard, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Plus, 
  X, 
  ExternalLink,
  ShieldCheck, 
  TrendingUp, 
  Coins, 
  Clock, 
  Copy, 
  RefreshCw, 
  Info,
  Calendar,
  AlertCircle,
  QrCode,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { containerVariants, itemVariants } from "../types";
import { useToast } from "../components/Toast";

interface SubscriptionItem {
  id: string;
  type: "АКТИВНА" | "ПЛАТЕЖ" | "ОЖИДАНИЕ" | "ИСТОРИЯ";
  badgeText: string;
  dateStr: string;
  subDateInfo: string;
  title: string;
  subtitle: string;
  amount: string;
  cryptoRoute: string;
  mode: "НОРМА" | "ПРОВЕРИТЬ" | "ОЖИДАНИЕ" | "ИСТОРИЯ";
  isPrimaryActive?: boolean;
  leftIndicatorColor: string;
  
  // Detail-specific fields
  planName?: string;
  costStr?: string;
  periodStr?: string;
  paymentMethod?: string;
  autoRenewStr?: string;
  
  // Progress bars (only for active)
  limits?: { name: string; percent: number; colorClass: string }[];
  access?: { name: string; val: string }[];

  // Payment detailed fields
  network?: string;
  currencyCode?: string;
  walletAddress?: string;
  memoTag?: string;
  txid?: string;
}

export function SubscriptionPage() {
  const { showToast } = useToast();
  const [activeFilter, setActiveFilter] = useState("Все");
  const [expandedId, setExpandedId] = useState<string | null>("active-curr");
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [activePlan, setActivePlan] = useState("PROFESSIONAL");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Interactive billing screen state variables
  const [selectedPeriod, setSelectedPeriod] = useState<"1" | "3" | "6">("3");
  const [selectedPlanId, setSelectedPlanId] = useState<"BASIC" | "PROFESSIONAL">("BASIC");
  const [selectedMethod, setSelectedMethod] = useState<"CARD" | "CRYPTO">("CRYPTO");
  const [isInvoiceGenerated, setIsInvoiceGenerated] = useState(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [isSuccessPaid, setIsSuccessPaid] = useState(false);

  const [historyConfirmingId, setHistoryConfirmingId] = useState<string | null>(null);
  const [historySuccessId, setHistorySuccessId] = useState<string | null>(null);

  const handleGenerateInvoice = () => {
    setIsGeneratingInvoice(true);
    setTimeout(() => {
      setIsGeneratingInvoice(false);
      setIsInvoiceGenerated(true);
      showToast("Счет на оплату успешно сгенерирован", "info", "Оплата");
    }, 1500);
  };

  const handleConfirmPayment = () => {
    setIsConfirmingPayment(true);
    setTimeout(() => {
      setIsConfirmingPayment(false);
      setIsSuccessPaid(true);
      showToast(`Оплата подтверждена! План ${selectedPlanId} успешно подключен`, "success", "Подписка");
      setTimeout(() => {
        setIsSuccessPaid(false);
        setIsInvoiceGenerated(false);
        setIsPlanModalOpen(false);
      }, 2500);
    }, 2000);
  };

  const handleHistoryConfirmPayment = (itemId: string) => {
    setHistoryConfirmingId(itemId);
    setTimeout(() => {
      setHistoryConfirmingId(null);
      setHistorySuccessId(itemId);
      showToast("Транзакция успешно подтверждена сетью", "success", "Сеть TON");
      setTimeout(() => {
        setHistorySuccessId(null);
        // Update the item in items to OПЛАЧЕНО
        setItems(prev => prev.map(item => {
          if (item.id === itemId) {
            return {
              ...item,
              type: "ПЛАТЕЖ",
              badgeText: "ОПЛАЧЕНО",
              subtitle: "Оплата успешно подтверждена • Лимиты и подписка обновлены в TON Network",
              leftIndicatorColor: "bg-emerald-500",
              txid: "0xec72fa84b90de124a9a99abdf78e219cf8888b610398"
            };
          }
          return item;
        }));
      }, 2500);
    }, 2000);
  };
  
  // Dynamic stats calculated from state
  const totalDaysRemaining = 47; 
  const totalPaidCount = "1/3";
  const selectPlanCosts: Record<string, string> = {
    STARTER: "9.00 USDT",
    PROFESSIONAL: "29.00 USDT",
    ENTERPRISE: "79.00 USDT"
  };

  const planDetails: Record<string, {
    name: string;
    tagline: string;
    description: string;
    badgeColor: string;
    price: string;
    included: string[];
    limits: { name: string; percent: number; colorClass: string }[];
    access: { name: string; val: string }[];
    period: string;
    autoRenew: string;
    paymentMethod: string;
  }> = {
    STARTER: {
      name: "STARTER",
      tagline: "Базовый тариф для начинающих трейдеров",
      description: "Простой и доступный инструмент для автоматизации торговли на небольшом количестве активов с минимальными задержками.",
      badgeColor: "bg-blue-50 text-blue-600 border-blue-100",
      price: "9.00 USDT / мес",
      included: [
        "До 3-х активных бирж одновременно",
        "Лимит сигналов и API health запросов",
        "Опрос сканера с задержкой (10 сек)",
        "Базовая поддержка по email",
      ],
      limits: [
        { name: "Сигналы", percent: 40, colorClass: "bg-amber-500" },
        { name: "API health", percent: 15, colorClass: "bg-emerald-500" },
        { name: "Webhook", percent: 20, colorClass: "bg-blue-500" }
      ],
      access: [
        { name: "Биржи", val: "до 3" },
        { name: "Стратегии", val: "до 5 моделей" },
        { name: "Сканирование", val: "интервал 10с" }
      ],
      period: "24.05.2026 → 24.06.2026",
      autoRenew: "Вручную",
      paymentMethod: "USDT (TON)"
    },
    PROFESSIONAL: {
      name: "PROFESSIONAL",
      tagline: "Премиум-тариф для профессиональных трейдеров",
      description: "Полнофункциональное решение для активных трейдеров с моментальным сканированием, неограниченными стратегиями и приоритетным исполнением.",
      badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
      price: "29.00 USDT / мес",
      included: [
        "До 10 активных бирж одновременно",
        "Использование системы без лимитов",
        "Сканирование рынка в реальном времени (real-time)",
        "Приоритетный менеджер поддержки",
      ],
      limits: [
        { name: "Сигналы", percent: 72, colorClass: "bg-amber-500" },
        { name: "API health", percent: 38, colorClass: "bg-emerald-500" },
        { name: "Webhook", percent: 54, colorClass: "bg-blue-500" }
      ],
      access: [
        { name: "Биржи", val: "до 10" },
        { name: "Стратегии", val: "без лимита" },
        { name: "Сканирование", val: "real-time" }
      ],
      period: "24.05.2026 → 24.06.2026",
      autoRenew: "Вручную",
      paymentMethod: "USDT (TON)"
    },
    ENTERPRISE: {
      name: "ENTERPRISE",
      tagline: "Максимальный тариф без ограничений",
      description: "Выделенная инфраструктура, отсутствие каких-либо лимитов, выделенные серверы доступа и круглосуточная поддержка 24/7 для крупных трейдеров.",
      badgeColor: "bg-indigo-50 text-indigo-600 border-indigo-100",
      price: "79.00 USDT / мес",
      included: [
        "Абсолютно без лимитов и ограничений",
        "Выделенные прокси и серверы сканирования",
        "Персональная круглосуточная поддержка 24/7",
        "Доступ к бета-тестированию новых моделей",
      ],
      limits: [
        { name: "Сигналы", percent: 95, colorClass: "bg-amber-500" },
        { name: "API health", percent: 90, colorClass: "bg-emerald-500" },
        { name: "Webhook", percent: 85, colorClass: "bg-blue-500" }
      ],
      access: [
        { name: "Биржи", val: "без лимита" },
        { name: "Стратегии", val: "без лимита" },
        { name: "Сканирование", val: "real-time" }
      ],
      period: "24.05.2026 → 24.06.2026",
      autoRenew: "Вручную",
      paymentMethod: "USDT (TON)"
    }
  };

  const currentPlanData = planDetails[activePlan] || planDetails.PROFESSIONAL;

  const [items, setItems] = useState<SubscriptionItem[]>([
    {
      id: "pay-610398",
      type: "ОЖИДАНИЕ",
      badgeText: "В ОБРАБОТКЕ",
      dateStr: "24.06.2026",
      subDateInfo: "ID: 610398",
      title: "Продление PROFESSIONAL",
      subtitle: "Ожидание подтверждения сети TON • Ссылка на оплату создана",
      amount: "29.00 USDT",
      cryptoRoute: "TON",
      mode: "ОЖИДАНИЕ",
      leftIndicatorColor: "bg-amber-500",
      network: "Сеть TON",
      currencyCode: "USDT",
      walletAddress: "EQDz0KrCP8F4K2Q1Fk92",
      memoTag: "610398",
      txid: "Ожидание подтверждения..."
    },
    {
      id: "pay-583920",
      type: "ПЛАТЕЖ",
      badgeText: "ОПЛАЧЕНО",
      dateStr: "24.05.2026",
      subDateInfo: "ID: 583920",
      title: "Активация PROFESSIONAL",
      subtitle: "1 мес • с 24.05.2026 по 24.06.2026",
      amount: "29.00 USDT",
      cryptoRoute: "TON",
      mode: "НОРМА",
      leftIndicatorColor: "bg-emerald-500",
      network: "Сеть TON",
      currencyCode: "USDT",
      walletAddress: "EQDz0KrCP8F4K2Q1Fk92",
      memoTag: "583920",
      txid: "0x8af3f2b4c8901de24a9190ab7c55cbda"
    },
    {
      id: "pay-failed-1",
      type: "ИСТОРИЯ",
      badgeText: "ОШИБКА",
      dateStr: "24.04.2026",
      subDateInfo: "ID: 395028",
      title: "Продление STARTER",
      subtitle: "Ошибка проведения транзакции • Превышено время ожидания перевода",
      amount: "9.00 USDT",
      cryptoRoute: "TRX",
      mode: "ИСТОРИЯ",
      leftIndicatorColor: "bg-rose-500",
      network: "Сеть TRON (TRC-20)",
      currencyCode: "USDT",
      walletAddress: "TY9b4uUa2L89Xv72qC3m1OpD",
      memoTag: "395028",
      txid: "Транзакция отсутствует в сети"
    },
    {
      id: "pay-412775",
      type: "ИСТОРИЯ",
      badgeText: "ОПЛАЧЕНО",
      dateStr: "24.04.2026",
      subDateInfo: "ID: 412775",
      title: "Активация STARTER",
      subtitle: "1 мес • с 24.04.2026 по 24.05.2026",
      amount: "9.00 USDT",
      cryptoRoute: "TON",
      mode: "ИСТОРИЯ",
      leftIndicatorColor: "bg-emerald-500",
      network: "Сеть TON",
      currencyCode: "USDT",
      walletAddress: "EQDz0KrCP8F4K2Q1Fk92",
      memoTag: "412775",
      txid: "0x2cd58fab392e2101fa2d039f99ad9cf8"
    }
  ]);

  const handleCopy = (text: string, labelId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(labelId);
    showToast("Данные успешно скопированы в буфер обмена", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSelectPlan = (plan: string) => {
    setActivePlan(plan);
    setIsPlanModalOpen(false);
  };

  const filteredItems = items.filter(item => {
    if (activeFilter === "Все") return true;
    if (activeFilter === "Оплачено") return item.badgeText === "ОПЛАЧЕНО";
    if (activeFilter === "В обработке") return item.badgeText === "В ОБРАБОТКЕ";
    if (activeFilter === "Ошибка") return item.badgeText === "ОШИБКА";
    return true;
  });

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-5 sm:p-6 lg:p-8 max-w-[1240px] mx-auto space-y-6 sm:space-y-8"
    >
      {/* Top action pane with metrics and billing button */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Compact Metrics Widget */}
        <div className="flex divide-x divide-slate-100 bg-white border border-slate-200/60 rounded-xl overflow-hidden shadow-xs self-start sm:self-auto shrink-0 select-none h-[34px] items-stretch">
          <div className="px-3 flex flex-col justify-center min-w-[110px] hover:bg-slate-50/40 transition-colors">
            <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-wider leading-none">ТАРИФ</span>
            <span className="text-xs font-black text-slate-850 mt-0.5 tracking-tight uppercase">{activePlan}</span>
          </div>
          <div className="px-3 flex flex-col justify-center min-w-[76px] hover:bg-slate-50/40 transition-colors">
            <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-wider leading-none">СТАТУС</span>
            <span className="text-xs font-black text-emerald-500 mt-0.5 tracking-tight tabular-nums">АКТИВНА</span>
          </div>
          <div className="px-3 flex flex-col justify-center min-w-[80px] hover:bg-slate-50/40 transition-colors">
            <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-wider leading-none">ОСТАЛОСЬ</span>
            <span className="text-xs font-black text-blue-500 mt-0.5 tracking-tight tabular-nums">{totalDaysRemaining} дн.</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <button 
          onClick={() => setIsPlanModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 text-slate-700 rounded-xl text-[10px] font-black tracking-tight uppercase shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 shrink-0"
        >
          <CreditCard size={12} className="text-slate-400 stroke-[3]" />
          Управление счетом
        </button>
      </motion.div>

      {/* Dynamic Active Subscription Card */}
      <motion.div 
        variants={itemVariants} 
        className="bg-white border border-slate-200/60 rounded-[28px] shadow-sm p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative overflow-hidden"
      >
        {/* Absolute subtle background decorative badge */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-5 pointer-events-none select-none">
          <CreditCard size={280} className="text-slate-800" />
        </div>

        {/* Left Side: Tariff Intro & what's included */}
        <div className="lg:col-span-7 space-y-6 z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[9px] font-black tracking-wider text-[#1e40af] bg-blue-50/70 border border-blue-100/50 px-2.5 py-0.5 rounded-[8px] uppercase">
                ТЕКУЩИЙ ТАРИФНЫЙ ПЛАН
              </span>
              <span className="text-[9px] font-black tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-[8px] uppercase select-none flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Активна
              </span>
            </div>
            
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-855 tracking-tight uppercase leading-none">
                {currentPlanData.name}
              </h2>
              <span className="inline-block text-xs font-extrabold text-blue-600">
                {currentPlanData.tagline}
              </span>
            </div>
            
            <p className="text-xs sm:text-[13px] text-slate-500 font-medium leading-relaxed max-w-xl">
              {currentPlanData.description}
            </p>
          </div>

          {/* Bullet Points what's included */}
          <div className="space-y-3 border-t border-slate-100 pt-5">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
              ЧТО ВКЛЮЧЕНО В ПОДПИСКУ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {currentPlanData.included.map((benefit, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs">
                  <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={9} className="text-emerald-600 stroke-[3]" />
                  </div>
                  <span className="font-bold text-slate-650 leading-tight">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Usage & Detail metrics */}
        <div className="lg:col-span-5 bg-slate-50/60 border border-slate-100/80 rounded-2xl p-5 sm:p-6 space-y-6 z-10">
          <div className="space-y-4">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
              ПОДРОБНЫЕ ДАHHЫЕ
            </h3>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
              <div className="leading-tight">
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-tight">Стоимость</span>
                <span className="block text-xs font-black text-slate-800 mt-1">{currentPlanData.price}</span>
              </div>
              <div className="leading-tight">
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-tight">Действует до</span>
                <span className="block text-xs font-black text-slate-800 mt-1">24.06.2026</span>
              </div>
              <div className="leading-tight col-span-2 border-t border-b border-slate-200/40 py-2.5">
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-tight">Период действия</span>
                <span className="block text-xs font-bold text-slate-600 mt-1">{currentPlanData.period}</span>
              </div>
              <div className="leading-tight">
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-tight">Метод оплаты</span>
                <span className="block text-xs font-black text-slate-800 mt-1 uppercase">{currentPlanData.paymentMethod}</span>
              </div>
              <div className="leading-tight">
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-tight">Автопродление</span>
                <span className="inline-block text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-2 py-0.5 mt-1">
                  {currentPlanData.autoRenew}
                </span>
              </div>
            </div>
          </div>

          {/* Metric Status bars in the card itself */}
          <div className="space-y-3 border-t border-slate-200/50 pt-5">
            <div className="flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-wider">
              <span>ТЕКУЩИЕ ЛИМИТЫ</span>
              <span className="text-blue-600">{totalDaysRemaining} ДНЕЙ ОСТАЛОСЬ</span>
            </div>
            
            <div className="space-y-2.5">
              {currentPlanData.limits.map((l, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-extrabold text-slate-500">{l.name}</span>
                    <span className="font-black text-slate-800">{l.percent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200/40 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${l.colorClass}`} style={{ width: `${l.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* History Section Header and Filter Navigation Pills */}
      <motion.div 
        variants={itemVariants} 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 pb-1"
      >
        <div className="space-y-1">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">
            ИСТОРИЯ ОПЛАТЫ И ПРОДЛЕНИЯ
          </h3>
          <p className="text-xs text-slate-500 font-bold">
            Детализация всех совершенных транзакций и текущий статус счетов
          </p>
        </div>

        {/* Moved Navigation Pills (Filters) */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl shrink-0 border border-slate-200/30">
          {["Все", "Оплачено", "В обработке", "Ошибка"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-tight uppercase transition-all duration-300 ${
                activeFilter === f 
                  ? "bg-white text-slate-800 shadow-sm" 
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-50/30"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Styled Grid Content */}
      <motion.div variants={itemVariants} className="bg-white border border-slate-200/60 rounded-[28px] shadow-sm overflow-hidden">
        {/* Table Headers */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-slate-50 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
          <div className="col-span-2">ДАТА / ID</div>
          <div className="col-span-5">ТАРИФ И Описание</div>
          <div className="col-span-2">СУММА</div>
          <div className="col-span-2 text-left">СТАТУС</div>
          <div className="col-span-1"></div>
        </div>

        {/* Subscription / Invoice Items List */}
        <div className="divide-y divide-slate-100">
          <AnimatePresence initial={false} mode="popLayout">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const isOpen = expandedId === item.id;
                
                return (
                  <motion.div 
                    layout
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group transition-all duration-300"
                  >
                    {/* Primary Row */}
                    <div 
                      onClick={() => setExpandedId(isOpen ? null : item.id)}
                      className={`grid grid-cols-1 md:grid-cols-12 gap-4 px-6 md:px-8 py-5 md:py-6 items-center cursor-pointer select-none transition-colors relative ${
                        isOpen ? "bg-blue-50/15" : "hover:bg-slate-50/40"
                      }`}
                    >
                      {/* Left vertical border indicator */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${
                        item.leftIndicatorColor
                      }`} />

                      {/* DATE / ID */}
                      <div className="col-span-2 flex items-center gap-2 ml-1">
                        <div className="leading-tight">
                          <span className="text-xs font-extrabold text-slate-800 tracking-tight block md:inline-block">
                            {item.dateStr}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold block">
                            {item.subDateInfo}
                          </span>
                        </div>
                      </div>

                      {/* TITLE / SUBTITLE */}
                      <div className="col-span-5">
                        <div className="leading-tight">
                          <span className="text-xs font-black text-slate-800 tracking-tight block uppercase">
                            {item.title}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400 block mt-0.5">
                            {item.subtitle}
                          </span>
                        </div>
                      </div>

                      {/* AMOUNT */}
                      <div className="col-span-2">
                        <div className="leading-tight">
                          <span className="text-xs font-extrabold text-slate-800 tracking-tight block">
                            {item.amount}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold block uppercase mt-0.5">
                            сеть {item.cryptoRoute}
                          </span>
                        </div>
                      </div>

                      {/* STATUS BADGE */}
                      <div className="col-span-2">
                        <span className={`text-[9px] font-black uppercase tracking-tight px-2.5 py-1 rounded-[8px] border inline-block ${
                          item.badgeText === "В ОБРАБОТКЕ" 
                            ? "bg-amber-50 text-amber-600 border-amber-100" 
                            : item.badgeText === "ОШИБКА"
                            ? "bg-rose-50 text-rose-600 border-rose-100"
                            : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        }`}>
                          {item.badgeText}
                        </span>
                      </div>

                      {/* CHEVRON */}
                      <div className="col-span-1 flex items-center justify-end gap-1.5">
                        <div className="p-1 text-slate-300 group-hover:text-slate-500 transition-colors">
                          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Drawer Area */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-slate-50/30 border-t border-slate-100/60"
                        >
                          {item.badgeText === "В ОБРАБОТКЕ" ? (
                            historyConfirmingId === item.id ? (
                              <div className="p-8 bg-slate-50/70 border-t border-slate-100 w-full flex flex-col items-center justify-center min-h-[300px] text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-indigo-500 to-amber-400 animate-pulse" />
                                <motion.div
                                  animate={{ rotate: -360 }}
                                  transition={{ repeat: Infinity, ease: "linear", duration: 1.2 }}
                                  className="w-14 h-14 border-4 border-slate-200 border-t-amber-500 rounded-full flex items-center justify-center mb-4 text-amber-500"
                                >
                                  <RefreshCw size={24} className="animate-pulse" />
                                </motion.div>
                                <span className="text-xs font-black text-amber-600 uppercase tracking-widest animate-pulse">
                                  Проверка блокчейн транзакции
                                </span>
                                <p className="text-xs font-bold text-slate-500 max-w-md mt-2.5 leading-relaxed">
                                  Опрашиваем ноды TON Network... Сканируем блоки на наличие входящих переводов с точным MEMO-кодом <span className="font-mono text-slate-700 font-extrabold">{item.memoTag}</span> на кошелек системы.
                                </p>
                                <div className="mt-4 flex gap-2">
                                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce delay-75" />
                                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce delay-150" />
                                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce delay-300" />
                                </div>
                              </div>
                            ) : historySuccessId === item.id ? (
                              <div className="p-8 bg-emerald-50/20 border-t border-slate-100 w-full flex flex-col items-center justify-center min-h-[300px] text-center relative overflow-hidden">
                                <motion.div 
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                  className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-emerald-200"
                                >
                                  <Check size={32} className="stroke-[3]" />
                                </motion.div>
                                <span className="text-sm font-black text-emerald-700 uppercase tracking-wide">
                                  Платеж успешно подтвержден!
                                </span>
                                <p className="text-xs font-bold text-slate-600 max-w-md mt-2 leading-relaxed">
                                  Детали транзакции успешно подтверждены в сети TON. Лимиты и подписка для аккаунта обновлены в реальном времени!
                                </p>
                              </div>
                            ) : (
                              <div className="p-6 md:p-8 space-y-6 bg-slate-50/70 border-t border-slate-100 w-full">
                                {/* Upper Header Row with Warn and Button */}
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
                                  {/* Left Side: Title */}
                                  <div className="space-y-1">
                                    <span className="text-[9px] font-black uppercase text-[#4f46e5]/80 tracking-wider block">
                                      ОПЛАТА • ОЖИДАНИЕ ПОДТВЕРЖДЕНИЯ
                                    </span>
                                    <h3 className="text-base font-black text-slate-800 tracking-tight">
                                      Ожидается перевод USDT
                                    </h3>
                                  </div>

                                  {/* Center: Warning Box */}
                                  <div className="flex-1 flex items-start gap-2.5 p-3 bg-amber-50/60 border border-amber-100/80 rounded-xl lg:max-w-2xl">
                                    <AlertCircle size={15} className="text-amber-600 mt-0.5 shrink-0" />
                                    <div className="text-[11px] text-amber-800 leading-normal font-semibold">
                                      <span className="font-extrabold text-amber-900 uppercase text-[9px] tracking-wider mr-1">
                                        ВНИМАНИЕ:
                                      </span>
                                      Отправляйте <strong className="font-bold text-amber-950">USDT</strong> только в сети <strong className="font-bold text-emerald-600">TON</strong> и обязательно укажите <strong className="font-bold text-amber-950">MEMO (тег)</strong>, иначе платеж не зачислится.
                                    </div>
                                  </div>

                                  {/* Right Side: Button */}
                                  <button 
                                    onClick={() => handleHistoryConfirmPayment(item.id)}
                                    className="py-3 px-8 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-md cursor-pointer hover:shadow-lg hover:shadow-indigo-150 transition-all active:scale-95 shrink-0 select-none"
                                  >
                                    Я оплатил
                                  </button>
                                </div>

                                {/* Three Columns Info Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch w-full">
                                  {/* 1. QR Code Panel */}
                                  <div className="flex flex-col items-center justify-center p-5 bg-white border border-slate-200/60 rounded-2xl shadow-xs space-y-3 min-h-[220px]">
                                    <div className="p-3 bg-slate-50 border border-slate-100/80 rounded-xl flex items-center justify-center relative group">
                                      <div className="w-[110px] h-[110px] flex flex-col justify-between p-1 bg-white relative">
                                        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800">
                                          <rect x="0" y="0" width="25" height="25" fill="currentColor" />
                                          <rect x="5" y="5" width="15" height="15" fill="white" />
                                          <rect x="9" y="9" width="7" height="7" fill="currentColor" />

                                          <rect x="75" y="0" width="25" height="25" fill="currentColor" />
                                          <rect x="80" y="5" width="15" height="15" fill="white" />
                                          <rect x="84" y="9" width="7" height="7" fill="currentColor" />

                                          <rect x="0" y="75" width="25" height="25" fill="currentColor" />
                                          <rect x="5" y="80" width="15" height="15" fill="white" />
                                          <rect x="9" y="84" width="7" height="7" fill="currentColor" />

                                          <rect x="35" y="0" width="8" height="8" fill="currentColor" />
                                          <rect x="50" y="5" width="12" height="5" fill="currentColor" />
                                          <rect x="30" y="15" width="5" height="15" fill="currentColor" />
                                          <rect x="45" y="20" width="15" height="8" fill="currentColor" />
                                          <rect x="65" y="10" width="5" height="12" fill="currentColor" />

                                          <rect x="0" y="35" width="8" height="15" fill="currentColor" />
                                          <rect x="15" y="45" width="12" height="8" fill="currentColor" />
                                          <rect x="0" y="60" width="18" height="5" fill="currentColor" />

                                          <rect x="40" y="40" width="20" height="20" rx="3" fill="currentColor" />
                                          <rect x="44" y="44" width="12" height="12" rx="2" fill="white" />
                                          <circle cx="50" cy="50" r="3" fill="currentColor" />

                                          <rect x="70" y="35" width="15" height="5" fill="currentColor" />
                                          <rect x="85" y="45" width="15" height="15" fill="currentColor" />
                                          <rect x="75" y="55" width="5" height="15" fill="currentColor" />
                                          <rect x="65" y="75" width="5" height="18" fill="currentColor" />
                                          <rect x="35" y="70" width="15" height="5" fill="currentColor" />
                                          <rect x="45" y="85" width="18" height="10" fill="currentColor" />
                                          <rect x="35" y="80" width="5" height="15" fill="currentColor" />
                                          <rect x="75" y="80" width="20" height="5" fill="currentColor" />
                                        </svg>
                                      </div>
                                    </div>
                                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                                      сканируйте для оплаты
                                    </span>
                                    <button className="w-full py-1.5 px-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-[10px] font-extrabold text-slate-600 rounded-lg transition-all active:scale-95">
                                      Открыть в приложении
                                    </button>
                                  </div>

                                  {/* 2. Billing Details Panel */}
                                  <div className="flex flex-col p-5 bg-white border border-slate-200/60 rounded-2xl shadow-xs justify-between min-h-[220px]">
                                    <div className="space-y-4">
                                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                                        РЕКВИЗИТЫ ПЛАТЕЖА
                                      </h4>
                                      <div className="space-y-3 text-xs">
                                        <div className="flex justify-between items-center py-0.5">
                                          <span className="font-bold text-slate-400">Сеть</span>
                                          <span className="font-black text-[#0098ea] uppercase">{item.network || "Сеть TON"}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-0.5">
                                          <span className="font-bold text-slate-400">Валюта</span>
                                          <span className="font-black text-emerald-500">USDT</span>
                                        </div>
                                        <div className="flex justify-between items-start py-0.5 gap-2">
                                          <span className="font-bold text-slate-400 shrink-0">Адрес кошелька</span>
                                          <div className="flex items-center gap-1.5 overflow-hidden">
                                            <span className="font-mono text-[10px] text-slate-500 truncate max-w-[130px] font-extrabold" title={item.walletAddress || "EQDz0KrCP8F4K2Q1Fk92"}>
                                              {item.walletAddress ? `${item.walletAddress.substring(0, 6)}...${item.walletAddress.slice(-4)}` : "—"}
                                            </span>
                                            {item.walletAddress && (
                                              <button 
                                                title="Скопировать адрес кошелька"
                                                onClick={() => handleCopy(item.walletAddress || "", item.id + "w_copy")}
                                                className="p-0.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                                              >
                                                {copiedId === item.id + "w_copy" ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex justify-between items-center py-0.5">
                                          <span className="font-bold text-slate-400">Мемо (Tag)</span>
                                          <div className="flex items-center gap-1.5">
                                            <span className="font-mono text-slate-600 font-black">
                                              {item.memoTag || "—"}
                                            </span>
                                            {item.memoTag && (
                                              <button 
                                                title="Скопировать Memo"
                                                onClick={() => handleCopy(item.memoTag || "", item.id + "m_copy")}
                                                className="p-0.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                                              >
                                                {copiedId === item.id + "m_copy" ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                                      <span className="font-bold text-slate-400">Сумма</span>
                                      <span className="font-black text-slate-800 text-sm">{item.amount}</span>
                                    </div>
                                  </div>

                                  {/* 3. Check Status Panel */}
                                  <div className="flex flex-col p-5 bg-white border border-slate-200/60 rounded-2xl shadow-xs justify-between min-h-[220px]">
                                    <div className="space-y-4">
                                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                                        СТАТУС ПРОВЕРКИ
                                      </h4>
                                      <div className="space-y-3 text-xs">
                                        <div className="flex justify-between items-center py-0.5">
                                          <span className="font-bold text-slate-400">Платеж</span>
                                          <span className="bg-amber-50 text-amber-600 border border-amber-200 text-[9px] font-black uppercase px-2 py-0.5 rounded-[6px]">
                                            В ОБРАБОТКЕ
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center py-0.5">
                                          <span className="font-bold text-slate-400">ID платежа</span>
                                          <span className="font-mono text-slate-600 font-extrabold">{item.id}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-0.5">
                                          <span className="font-bold text-slate-400">Создан</span>
                                          <span className="font-semibold text-slate-600">{item.dateStr}</span>
                                        </div>
                                        <div className="flex justify-between items-start py-0.5 gap-2">
                                          <span className="font-bold text-slate-400 shrink-0">Хэш транзакции (TXID)</span>
                                          <div className="flex items-center gap-1.5 overflow-hidden">
                                            {item.txid && item.txid.startsWith("0x") ? (
                                              <>
                                                <span className="font-mono text-[10px] text-slate-500 truncate max-w-[130px]" title={item.txid}>
                                                  {item.txid}
                                                </span>
                                                <button 
                                                  title="Скопировать"
                                                  onClick={() => handleCopy(item.txid || "", item.id + "t_copy")}
                                                  className="p-0.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                                                >
                                                  {copiedId === item.id + "t_copy" ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                                                </button>
                                              </>
                                            ) : (
                                              <span className="font-bold text-slate-400 text-[11px]">—</span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                      <span className="text-[10px] text-slate-400 font-bold">Последнее обновление:</span>
                                      <span className="text-[10px] font-black text-amber-600 uppercase flex items-center gap-1">
                                        <RefreshCw size={10} className="animate-spin" /> Проверка статуса...
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          ) : (
                            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/40">
                              
                              {/* Left Panel: Subscription & Payment Info */}
                              <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/50 pb-2">
                                  ИНФОРМАЦИЯ О ТАРИФЕ
                                </h4>
                                <div className="space-y-3 text-xs text-[#0f172a]">
                                  <div className="flex justify-between items-center py-0.5">
                                    <span className="font-bold text-slate-400">Операция</span>
                                    <span className="font-black text-slate-800 uppercase">{item.title}</span>
                                  </div>
                                  <div className="flex justify-between items-center py-0.5">
                                    <span className="font-bold text-slate-400">Период действия</span>
                                    <span className="font-semibold text-slate-600">
                                      {item.periodStr || item.subtitle}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center py-0.5">
                                    <span className="font-bold text-slate-400">Сумма операции</span>
                                    <span className="font-black text-slate-850">{item.amount}</span>
                                  </div>
                                  <div className="flex justify-between items-center py-0.5">
                                    <span className="font-bold text-slate-400">Метод оплаты</span>
                                    <span className="font-bold text-slate-600 uppercase">
                                      {item.paymentMethod || `USDT (${item.cryptoRoute})`}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Right Panel: Transaction status & details */}
                              <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/50 pb-2">
                                  СТАТУС ТРАНЗАКЦИИ
                                </h4>
                                <div className="space-y-3 text-xs text-[#0f172a]">
                                  <div className="flex justify-between items-center py-0.5">
                                    <span className="font-bold text-slate-400">Текущий статус</span>
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black tracking-tight uppercase ${
                                      item.badgeText === "В ОБРАБОТКЕ" 
                                        ? "bg-amber-50 text-amber-600 animate-pulse border border-amber-100" 
                                        : item.badgeText === "ОШИБКА" 
                                        ? "bg-rose-50 text-rose-600 border border-rose-100" 
                                        : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                    }`}>{item.badgeText}</span>
                                  </div>
                                  <div className="flex justify-between items-center py-0.5">
                                    <span className="font-bold text-slate-400">ID операции</span>
                                    <span className="font-mono text-slate-500 font-bold">{item.id}</span>
                                  </div>
                                  {item.txid && (
                                    <div className="flex justify-between items-center py-0.5">
                                      <span className="font-bold text-slate-400">Хэш транзакции (TXID)</span>
                                      {item.txid.startsWith("0x") ? (
                                        <div className="flex items-center gap-1.5">
                                          <span className="font-mono text-[10px] text-slate-500 bg-slate-1050/60 px-2 py-1 rounded tracking-tighter truncate max-w-[140px]" title={item.txid}>
                                            {item.txid.substring(0, 10)}...{item.txid.slice(-6)}
                                          </span>
                                          <button 
                                            title="Скопировать" 
                                            onClick={() => handleCopy(item.txid || "", item.id + "txid")}
                                            className="p-1 hover:bg-slate-200/50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                                          >
                                            {copiedId === item.id + "txid" ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                          </button>
                                        </div>
                                      ) : (
                                        <span className="font-bold text-slate-500 text-[11px]">{item.txid}</span>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Special checkout fields and buttons for pending items */}
                                {item.type === "ОЖИДАНИЕ" && (
                                  <div className="pt-3 border-t border-slate-200/40 space-y-3 text-xs">
                                    <div className="flex justify-between items-start gap-4">
                                      <span className="font-bold text-slate-400 shrink-0">Адрес кошелька</span>
                                      <div className="flex items-center gap-1.5 select-all">
                                        <span className="font-mono text-[10px] text-slate-600 bg-slate-100/60 px-2 py-0.5 rounded tracking-tight text-right break-all">
                                          {item.walletAddress}
                                        </span>
                                        <button 
                                          title="Скопировать" 
                                          onClick={() => handleCopy(item.walletAddress || "", item.id + "wallet")}
                                          className="p-1 hover:bg-slate-200/50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                                        >
                                          {copiedId === item.id + "wallet" ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                        </button>
                                      </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="font-bold text-slate-400">Memo перевод</span>
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-mono text-slate-600 font-extrabold tracking-tight">
                                          {item.memoTag}
                                        </span>
                                        <button 
                                          title="Скопировать" 
                                          onClick={() => handleCopy(item.memoTag || "", item.id + "memo")}
                                          className="p-1 hover:bg-slate-200/50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                          {copiedId === item.id + "memo" ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                        </button>
                                      </div>
                                    </div>
                                    
                                    <div className="pt-2 flex gap-2">
                                      <button className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black uppercase tracking-tight rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-amber-100 active:scale-95 leading-none">
                                        <RefreshCw size={12} className="animate-spin" />
                                        Проверить оплату
                                      </button>
                                      <div className="px-3 bg-white border border-slate-200 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-50" title="Показать QR-код">
                                        <QrCode size={16} className="text-slate-400" />
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {item.type === "АКТИВНА" && (
                                  <div className="pt-2">
                                    <button 
                                      onClick={() => setIsPlanModalOpen(true)}
                                      className="w-full py-2.5 bg-[#1e40af] hover:bg-[#1d4ed8] text-white text-[10px] font-black uppercase tracking-tight rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                                    >
                                      <Zap size={11} className="fill-white" />
                                      Изменить или продлить тариф
                                    </button>
                                  </div>
                                )}
                              </div>

                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <div className="p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                  <CreditCard size={26} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-850">Данные не найдены</h4>
                  <p className="text-xs text-slate-400 font-medium">Нет записей, удовлетворяющих выбранному фильтру.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Interactive Plan / Management Modal */}
      <AnimatePresence>
        {isPlanModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] w-full max-w-5xl max-h-[calc(100vh-48px)] sm:max-h-[88vh] overflow-hidden shadow-2xl border border-slate-200/80 flex flex-col my-auto"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-[#f6f8fd]/60 shrink-0">
                <div className="space-y-0.5">
                  <h3 className="font-extrabold text-[#0f172a] text-sm sm:text-base tracking-tight leading-none">Управление счетом и подпиской</h3>
                  <p className="text-[10px] sm:text-[11px] text-blue-600 font-bold tracking-tight">Изменение, выбор, продление тарифов и формирование счетов.</p>
                </div>
                <button 
                  onClick={() => setIsPlanModalOpen(false)} 
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200/60 bg-slate-100 transition-colors cursor-pointer"
                >
                  <X size={14} className="text-slate-500" />
                </button>
              </div>

              {/* Scrollable Container */}
              <div className="p-6 md:p-8 space-y-8 overflow-y-auto flex-1 min-h-0">
                {/* 1. ВЫБЕРИТЕ ТАРИФ SECTION */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-0.5">
                      <h4 className="text-base font-black text-slate-800 tracking-tight">Выберите тариф</h4>
                      <p className="text-xs text-slate-400 font-bold">Нажмите на карточку для выбора</p>
                    </div>
                    <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/30 self-stretch sm:self-auto justify-center select-none">
                      {(["1", "3", "6"] as const).map((period) => (
                        <button
                          key={period}
                          onClick={() => {
                            setSelectedPeriod(period);
                            setIsInvoiceGenerated(false);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-tight uppercase transition-all duration-300 cursor-pointer ${
                            selectedPeriod === period
                              ? "bg-white text-slate-800 shadow-xs"
                              : "text-slate-400 hover:text-slate-700 hover:bg-slate-50/30"
                          }`}
                        >
                          {period} MEC{period === "3" ? " -5%" : period === "6" ? " -10%" : ""}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Three Tariff Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                    {/* Card 1: ТЕКУЩИЙ ТАРИФ (Dull details state) */}
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between min-h-[170px] select-none">
                      <div>
                        <span className="text-[8px] font-black text-[#64748b] uppercase tracking-widest block">ТЕКУЩИЙ ТАРИФ</span>
                        <h4 className="text-base font-extrabold text-slate-800 tracking-tight mt-1">Профессиональный</h4>
                        <div className="mt-4 space-y-1.5">
                          <div className="flex items-center gap-2 text-[11px] font-black text-[#1e40af]">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                            <span>Активна до: 24.06.2024</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            <span>Для продления выберите нужный тариф</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card 2: BASIC */}
                    <div 
                      onClick={() => {
                        setSelectedPlanId("BASIC");
                        setIsInvoiceGenerated(false);
                      }}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer relative min-h-[170px] flex flex-col justify-between select-none ${
                        selectedPlanId === "BASIC"
                          ? "border-blue-500 bg-[#4f46e5] text-white shadow-md shadow-indigo-150"
                          : "border-slate-200 bg-white hover:bg-slate-50/50 text-slate-700"
                      }`}
                    >
                      {selectedPlanId === "BASIC" && (
                        <div className="absolute top-4 right-4 bg-white text-[#4f46e5] rounded-full p-0.5 shadow-sm">
                          <Check size={11} className="stroke-[3]" />
                        </div>
                      )}
                      <div>
                        <span className={`text-[8px] font-black uppercase tracking-widest block ${
                          selectedPlanId === "BASIC" ? "text-indigo-200" : "text-slate-400"
                        }`}>
                          BASIC
                        </span>
                        <h4 className="text-lg font-black tracking-tight mt-1">
                          {selectedPeriod === "1" ? "$9.00" : selectedPeriod === "3" ? "$25.65" : "$48.60"}
                          <span className={`text-[10px] font-medium tracking-normal ${
                            selectedPlanId === "BASIC" ? "text-indigo-200" : "text-slate-400"
                          }`}>
                            /{selectedPeriod === "1" ? "мес" : `${selectedPeriod} мес`}
                          </span>
                        </h4>
                        <ul className={`mt-3 space-y-1 text-[11px] font-semibold ${
                          selectedPlanId === "BASIC" ? "text-indigo-100" : "text-slate-500"
                        }`}>
                          <li className="flex items-center gap-1.5">• API ключи: до 5 бирж</li>
                          <li className="flex items-center gap-1.5">• 1 активная стратегия</li>
                          <li className="flex items-center gap-1.5">• Сканирование: 30-60 сек</li>
                          <li className="flex items-center gap-1.5">• Объём сделок: ограничен</li>
                        </ul>
                      </div>
                    </div>

                    {/* Card 3: PROFESSIONAL */}
                    <div 
                      onClick={() => {
                        setSelectedPlanId("PROFESSIONAL");
                        setIsInvoiceGenerated(false);
                      }}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer relative min-h-[170px] flex flex-col justify-between select-none ${
                        selectedPlanId === "PROFESSIONAL"
                          ? "border-blue-500 bg-[#4f46e5] text-white shadow-md shadow-indigo-150"
                          : "border-slate-200 bg-white hover:bg-slate-50/50 text-slate-700"
                      }`}
                    >
                      {selectedPlanId === "PROFESSIONAL" && (
                        <div className="absolute top-4 right-4 bg-white text-[#4f46e5] rounded-full p-0.5 shadow-sm">
                          <Check size={11} className="stroke-[3]" />
                        </div>
                      )}
                      <div>
                        <span className={`text-[8px] font-black uppercase tracking-widest block ${
                          selectedPlanId === "PROFESSIONAL" ? "text-indigo-200" : "text-slate-400"
                        }`}>
                          PROFESSIONAL
                        </span>
                        <h4 className="text-lg font-black tracking-tight mt-1">
                          {selectedPeriod === "1" ? "$29.00" : selectedPeriod === "3" ? "$82.65" : "$156.60"}
                          <span className={`text-[10px] font-medium tracking-normal ${
                            selectedPlanId === "PROFESSIONAL" ? "text-indigo-200" : "text-slate-400"
                          }`}>
                            /{selectedPeriod === "1" ? "мес" : `${selectedPeriod} мес`}
                          </span>
                        </h4>
                        <ul className={`mt-3 space-y-1 text-[11px] font-semibold ${
                          selectedPlanId === "PROFESSIONAL" ? "text-indigo-100" : "text-slate-500"
                        }`}>
                          <li className="flex items-center gap-1.5">• Биржи: до 10 (безлимит API)</li>
                          <li className="flex items-center gap-1.5">• Сканирование: 5-10 сек</li>
                          <li className="flex items-center gap-1.5">• Стратегии/объём: без лимитов</li>
                          <li className="flex items-center gap-1.5">• Приоритет исполнения</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. СПОСОБ ОПЛАТЫ SECTION */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-0.5">
                      <h4 className="text-base font-black text-slate-800 tracking-tight">Способ оплаты</h4>
                      <p className="text-xs text-slate-400 font-bold">Выберите тариф выше для активации</p>
                    </div>
                    <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/30 self-stretch sm:self-auto justify-center select-none">
                      {(["CARD", "CRYPTO"] as const).map((method) => (
                        <button
                          key={method}
                          onClick={() => {
                            setSelectedMethod(method);
                          }}
                          className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-tight uppercase transition-all duration-300 cursor-pointer ${
                            selectedMethod === method
                              ? "bg-white text-slate-800 shadow-xs"
                              : "text-slate-400 hover:text-slate-700 hover:bg-slate-50/30"
                          }`}
                        >
                          {method === "CARD" ? "КАРТА" : "CRYPTO"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Details Container */}
                  {selectedMethod === "CARD" ? (
                    <div className="p-5 border border-slate-200/60 rounded-2xl bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 border border-slate-200/40">
                          <CreditCard size={18} />
                        </div>
                        <div className="leading-tight">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">ОПЛАТА КАРТОЙ</span>
                          <span className="text-xs font-black text-slate-800 mt-0.5 block">Временно недоступно</span>
                          <span className="text-[10px] font-medium text-slate-400 mt-0.5 block">Оплата картой временно недоступна в демо-режиме</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedMethod("CRYPTO")}
                        className="text-[10px] font-black text-[#4f46e5] hover:text-[#4338ca] uppercase tracking-wider select-none shrink-0 cursor-pointer bg-transparent border-0"
                      >
                        ВЫБРАТЬ CRYPTO
                      </button>
                    </div>
                  ) : (
                    /* Crypto Panel */
                    !isInvoiceGenerated ? (
                      isGeneratingInvoice ? (
                        /* Beautiful glowing loading screen for generating invoice */
                        <div className="relative p-8 border border-slate-200/60 rounded-2xl bg-[#f8fafc]/40 flex flex-col items-center justify-center min-h-[190px] text-center overflow-hidden">
                          {/* Animated gradient top bar */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-pulse" />
                          
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
                            className="w-12 h-12 border-4 border-indigo-100 border-t-[#4f46e5] rounded-full flex items-center justify-center mb-4"
                          >
                            <RefreshCw size={18} className="text-[#4f46e5]" />
                          </motion.div>
                          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest animate-pulse">
                            Генерация реквизитов
                          </span>
                          <p className="text-[11.5px] font-bold text-slate-500 max-w-sm mt-2 leading-relaxed">
                            Опрашиваем блокчейн-сеть TON, создаем уникальный адрес смарт-контракта и формируем проверочный MEMO-код...
                          </p>
                        </div>
                      ) : (
                        /* Option A: Generation Screen */
                        <div className="relative p-8 border border-slate-200/60 rounded-2xl bg-[#f8fafc]/40 flex flex-col items-center justify-center min-h-[190px] text-center">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 border border-slate-200/50 mb-3">
                            <QrCode size={18} />
                          </div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ГЕНЕРАЦИЯ ПЛАТЕЖА</span>
                          <p className="text-[11px] font-bold text-slate-400 max-w-sm mt-1.5 leading-relaxed">
                            Выберите тариф и нажмите «Сформировать счет» в панели выше — мы создадим уникальный адрес и MEMO-код для оплаты через сеть TON.
                          </p>
                          <button
                            onClick={handleGenerateInvoice}
                            className="mt-5 py-3 px-8 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-md cursor-pointer hover:shadow-lg hover:shadow-indigo-150 transition-all active:scale-95 text-center"
                          >
                            СФОРМИРОВАТЬ СЧЕТ  •  ${
                              selectedPlanId === "BASIC"
                                ? (selectedPeriod === "1" ? "9.00" : selectedPeriod === "3" ? "25.65" : "48.60")
                                : (selectedPeriod === "1" ? "29.05" : selectedPeriod === "3" ? "82.65" : "156.60")
                            }
                          </button>
                        </div>
                      )
                    ) : (
                      /* Option B: Active Invoice Fields Screen with QR */
                      isConfirmingPayment ? (
                        <div className="p-8 border border-slate-200/60 rounded-2xl bg-[#f8fafc]/40 flex flex-col items-center justify-center min-h-[290px] text-center relative overflow-hidden w-full">
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-indigo-500 to-emerald-400 animate-pulse" />
                          <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ repeat: Infinity, ease: "linear", duration: 1.2 }}
                            className="w-14 h-14 border-4 border-slate-100 border-t-emerald-500 rounded-full flex items-center justify-center mb-4 text-emerald-500"
                          >
                            <RefreshCw size={24} className="animate-pulse" />
                          </motion.div>
                          <span className="text-xs font-black text-emerald-600 uppercase tracking-widest animate-pulse">
                            Проверка блокчейн транзакции
                          </span>
                          <p className="text-xs font-bold text-slate-500 max-w-md mt-2.5 leading-relaxed">
                            Опрашиваем ноды TON Network... Сканируем блоки на наличие входящего перевода с точным MEMO-кодом на кошелек системы.
                          </p>
                          <div className="mt-4 flex gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-75" />
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-150" />
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-300" />
                          </div>
                        </div>
                      ) : isSuccessPaid ? (
                        <div className="p-8 border border-slate-200/60 rounded-2xl bg-emerald-50/20 flex flex-col items-center justify-center min-h-[290px] text-center relative overflow-hidden w-full">
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-emerald-200"
                          >
                            <Check size={32} className="stroke-[3]" />
                          </motion.div>
                          <span className="text-sm font-black text-emerald-700 uppercase tracking-wide">
                            Заявка успешно отправлена!
                          </span>
                          <p className="text-xs font-bold text-slate-600 max-w-md mt-2 leading-relaxed">
                            Транзакция отправлена в обработку. Лимиты и подписка обновятся автоматически в течение пары минут после финального подтверждения в сети TON.
                          </p>
                          <span className="text-[10px] font-bold text-slate-400 mt-4 block animate-pulse">
                            Окно автоматически закроется через пару секунд...
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch w-full">
                            {/* Left Column: QR Code & app actions */}
                            <div className="md:col-span-4 flex flex-col items-center justify-center p-5 bg-white border border-slate-200/60 rounded-2xl shadow-xs space-y-3 min-h-[220px]">
                              <div className="p-3 bg-slate-50 border border-slate-100/80 rounded-xl flex items-center justify-center relative group">
                                <div className="w-[110px] h-[110px] flex flex-col justify-between p-1 bg-white relative">
                                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800">
                                    <rect x="0" y="0" width="25" height="25" fill="currentColor" />
                                    <rect x="5" y="5" width="15" height="15" fill="white" />
                                    <rect x="9" y="9" width="7" height="7" fill="currentColor" />

                                    <rect x="75" y="0" width="25" height="25" fill="currentColor" />
                                    <rect x="80" y="5" width="15" height="15" fill="white" />
                                    <rect x="84" y="9" width="7" height="7" fill="currentColor" />

                                    <rect x="0" y="75" width="25" height="25" fill="currentColor" />
                                    <rect x="5" y="80" width="15" height="15" fill="white" />
                                    <rect x="9" y="84" width="7" height="7" fill="currentColor" />

                                    <rect x="35" y="0" width="8" height="8" fill="currentColor" />
                                    <rect x="50" y="5" width="12" height="5" fill="currentColor" />
                                    <rect x="30" y="15" width="5" height="15" fill="currentColor" />
                                    <rect x="45" y="20" width="15" height="8" fill="currentColor" />
                                    <rect x="65" y="10" width="5" height="12" fill="currentColor" />

                                    <rect x="0" y="35" width="8" height="15" fill="currentColor" />
                                    <rect x="15" y="45" width="12" height="8" fill="currentColor" />
                                    <rect x="0" y="60" width="18" height="5" fill="currentColor" />

                                    <rect x="40" y="40" width="20" height="20" rx="3" fill="currentColor" />
                                    <rect x="44" y="44" width="12" height="12" rx="2" fill="white" />
                                    <circle cx="50" cy="50" r="3" fill="currentColor" />

                                    <rect x="70" y="35" width="15" height="5" fill="currentColor" />
                                    <rect x="85" y="45" width="15" height="15" fill="currentColor" />
                                    <rect x="75" y="55" width="5" height="15" fill="currentColor" />
                                    <rect x="65" y="75" width="5" height="18" fill="currentColor" />
                                    <rect x="35" y="70" width="15" height="5" fill="currentColor" />
                                    <rect x="45" y="85" width="18" height="10" fill="currentColor" />
                                    <rect x="35" y="80" width="5" height="15" fill="currentColor" />
                                    <rect x="75" y="80" width="20" height="5" fill="currentColor" />
                                  </svg>
                                </div>
                              </div>
                              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                                сканируй для оплаты
                              </span>
                              <div className="w-full space-y-1 select-none">
                                <button className="w-full py-2 px-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-[10px] font-extrabold text-slate-600 rounded-xl transition-all active:scale-95 cursor-pointer">
                                  Открыть в приложении
                                </button>
                                <button 
                                  onClick={handleConfirmPayment}
                                  className="w-full py-2 px-3 bg-[#4f46e5] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all active:scale-95 hover:bg-[#4338ca] cursor-pointer"
                                >
                                  Я оплатил
                                </button>
                              </div>
                            </div>

                          {/* Right Column: Key payment fields row-by-row */}
                          <div className="md:col-span-8 flex flex-col justify-between p-5 bg-white border border-slate-200/60 rounded-2xl shadow-xs space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">РЕКВИЗИТЫ ПЛАТЕЖА</span>
                              <div className="flex gap-1.5 select-none">
                                <span className="px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-[9px] font-black uppercase tracking-wider leading-none">TON NETWORK</span>
                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[9px] font-black uppercase tracking-wider leading-none">USDT</span>
                              </div>
                            </div>

                            {/* Forms list */}
                            <div className="space-y-4">
                              {/* WALLET */}
                              <div className="space-y-1">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">АДРЕС КОШЕЛЬКА</span>
                                <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
                                  <span className="font-mono text-xs text-slate-705 font-extrabold select-all truncate pr-8">
                                    EQDz0KrCPSQW9MWQWFk92
                                  </span>
                                  <button 
                                    onClick={() => handleCopy("EQDz0KrCPSQW9MWQWFk92", "m_wallet_copy")}
                                    className="absolute right-3 p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                  >
                                    {copiedId === "m_wallet_copy" ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                  </button>
                                </div>
                              </div>

                              {/* MEMO / TAG */}
                              <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">MEMO / TAG</span>
                                  <span className="text-[8px] font-black bg-rose-50 border border-rose-100 text-rose-600 px-1.5 py-0.5 rounded uppercase tracking-widest scale-95 origin-right font-bold">ОБЯЗАТЕЛЬНО</span>
                                </div>
                                <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
                                  <span className="font-mono text-xs text-slate-705 font-extrabold select-all pr-8">
                                    761840
                                  </span>
                                  <button 
                                    onClick={() => handleCopy("761840", "m_memo_copy")}
                                    className="absolute right-3 p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                  >
                                    {copiedId === "m_memo_copy" ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                  </button>
                                </div>
                              </div>

                              {/* AMOUNT */}
                              <div className="space-y-1">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">СУММА</span>
                                <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
                                  <span className="font-mono text-xs text-slate-705 font-black pr-8">
                                    {selectedPlanId === "BASIC"
                                      ? (selectedPeriod === "1" ? "9.00" : selectedPeriod === "3" ? "25.65" : "48.60")
                                      : (selectedPeriod === "1" ? "29.00" : selectedPeriod === "3" ? "82.65" : "156.60")
                                    } USDT
                                  </span>
                                  <button 
                                    onClick={() => handleCopy(
                                      selectedPlanId === "BASIC"
                                        ? (selectedPeriod === "1" ? "9.00" : selectedPeriod === "3" ? "25.65" : "48.60")
                                        : (selectedPeriod === "1" ? "29.00" : selectedPeriod === "3" ? "82.65" : "156.60")
                                    , "m_amount_copy")}
                                    className="absolute right-3 p-1 hover:bg-slate-100 rounded-lg text-slate-405 hover:text-slate-600 transition-colors cursor-pointer"
                                  >
                                    {copiedId === "m_amount_copy" ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Attention warning callout */}
                        <div className="flex items-start gap-2.5 p-3.5 bg-amber-50/60 border border-amber-100 rounded-xl">
                          <AlertCircle size={15} className="text-amber-600 mt-0.5 shrink-0" />
                          <div className="text-[11px] text-amber-805 leading-normal font-semibold">
                            <span className="font-extrabold text-amber-900 uppercase text-[9px] tracking-wider mr-1">
                              ВНИМАНИЕ:
                            </span>
                            Убедитесь, что отправляете <strong className="font-bold text-amber-950">USDT</strong> в сети <strong className="font-bold text-emerald-600">TON</strong>. Обязательно укажите <strong className="font-bold text-amber-955">MEMO (Tag)</strong>, иначе средства не будут зачислены на баланс.
                          </div>
                        </div>
                      </div>
                    )
                  )
                )}
                </div>
              </div>

              {/* Info Notice footer */}
              <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-start gap-2.5 text-[11px] font-bold text-slate-500 shrink-0">
                <Info size={14} className="text-[#1e40af] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  При переходе на тариф более высокого класса действующие и уплаченные дни перерасчитываются автоматически по текущему курсу. Вы можете продлить подписку в любой момент.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
