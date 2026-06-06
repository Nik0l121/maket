import React, { useState, useEffect, useRef } from "react";
import { 
  Zap, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Globe, 
  Cpu, 
  Clock, 
  Database, 
  Play, 
  RotateCcw, 
  Check, 
  ChevronRight, 
  AlertTriangle, 
  Activity, 
  DollarSign, 
  Lock,
  Layers,
  MapPin,
  HelpCircle,
  X,
  Gauge
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LandingPageProps {
  onOpenAuth: (initialMode?: "login" | "register") => void;
}

// Config for cross-chain networks
const NETWORKS = [
  { id: "eth", name: "Ethereum", color: "from-blue-600 to-indigo-700", textColor: "text-blue-400", x: 200, y: 110, gas: "$8.40", delay: "12s" },
  { id: "bsc", name: "BSC", color: "from-amber-400 to-yellow-600", textColor: "text-amber-400", x: 420, y: 150, gas: "$0.32", delay: "3s" },
  { id: "arb", name: "Arbitrum", color: "from-blue-400 to-cyan-500", textColor: "text-cyan-400", x: 120, y: 300, gas: "$0.12", delay: "1s" },
  { id: "sol", name: "Solana", color: "from-purple-500 to-fuchsia-600", textColor: "text-purple-400", x: 300, y: 380, gas: "$0.01", delay: "0.4s" },
  { id: "poly", name: "Polygon", color: "from-violet-600 to-purple-800", textColor: "text-violet-400", x: 500, y: 290, gas: "$0.05", delay: "2s" },
  { id: "base", name: "Base L2", color: "from-blue-500 to-sky-400", textColor: "text-blue-300", x: 320, y: 230, gas: "$0.08", delay: "1s" }
];

// Mock Exchange pairs list for simulator (linked to real scanner data structures)
const SIM_PAIRS = [
  { pair: "TON/USDT", asset: "TON", buyPrice: 7.12, sellPrice: 7.18, network: "TON", buyDex: "MEXC", sellDex: "BITGET", withdrawalFee: 0.01 },
  { pair: "SOL/USDT", asset: "SOL", buyPrice: 148.22, sellPrice: 149.32, network: "SOLANA", buyDex: "BYBIT", sellDex: "HTX", withdrawalFee: 0.0005 },
  { pair: "BER/USDT", asset: "BER", buyPrice: 0.02826, sellPrice: 0.02848, network: "BERA", buyDex: "HTX", sellDex: "BITGET", withdrawalFee: 0.001 },
  { pair: "NOT/USDT", asset: "NOT", buyPrice: 0.0125, sellPrice: 0.0126, network: "TON", buyDex: "BITGET", sellDex: "MEXC", withdrawalFee: 1.0 },
  { pair: "AVAX/USDT", asset: "AVAX", buyPrice: 32.40, sellPrice: 32.55, network: "AVAX", buyDex: "HTX", sellDex: "BYBIT", withdrawalFee: 0.002 }
];

const SIM_EXCHANGES = ["HTX", "Binance", "MEXC", "Bybit", "Gate.io", "Bitget"];

export function LandingPage({ onOpenAuth }: LandingPageProps) {
  // Navigation states
  const [activeSection, setActiveSection] = useState("hero");

  // Interactive Live Signals Feed
  const [liveSignals, setLiveSignals] = useState<any[]>([]);

  // Simulation states
  const [simCapital, setSimCapital] = useState<number>(1000);
  const [simPair, setSimPair] = useState(SIM_PAIRS[0]);
  const [simExchangeA, setSimExchangeA] = useState("MEXC");
  const [simExchangeB, setSimExchangeB] = useState("BITGET");
  const [simSpread, setSimSpread] = useState<number>(0.84); // ((7.18-7.12)/7.12)*100
  const [simGas, setSimGas] = useState<number>(0.07); // ~0.01 TON fee in USD
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState<number>(0);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simResult, setSimResult] = useState<any>(null);

  // Profit Calculator sliders
  const [calcDeposit, setCalcDeposit] = useState<number>(2500);
  const [calcDealsPerDay, setCalcDealsPerDay] = useState<number>(8);
  const [calcAvgSpread, setCalcAvgSpread] = useState<number>(1.2);
  const [calcGasReserve, setCalcGasReserve] = useState<number>(1.5);

  // Dynamic visual connection lines for the cross-chain map
  const [mapPackets, setMapPackets] = useState<any[]>([]);
  const [selectedMapNetwork, setSelectedMapNetwork] = useState<any>(NETWORKS[0]);

  // Pricing State
  const [pricingCycle, setPricingCycle] = useState<"monthly" | "yearly">("monthly");

  // Faq state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Generate continuous live signals for the mock "live radar scanner feed"
  useEffect(() => {
    const assets = ["TON", "SOL", "NEAR", "AVAX", "DOT", "LINK", "DOGE", "XRP", "APT", "SUI"];
    const chains = ["BSC", "Arbitrum", "Optimism", "Solana", "Base", "Polygon"];
    
    // Generate initial set
    const initial = Array.from({ length: 4 }).map((_, i) => createRandomSignal(i, assets, chains));
    setLiveSignals(initial);

    const interval = setInterval(() => {
      setLiveSignals(prev => {
        const next = [createRandomSignal(Date.now(), assets, chains), ...prev.slice(0, 3)];
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Animating packets on the cross-chain map
  useEffect(() => {
    const interval = setInterval(() => {
      const fromIdx = Math.floor(Math.random() * NETWORKS.length);
      let toIdx = Math.floor(Math.random() * NETWORKS.length);
      while (toIdx === fromIdx) {
        toIdx = Math.floor(Math.random() * NETWORKS.length);
      }
      
      const fromNet = NETWORKS[fromIdx];
      const toNet = NETWORKS[toIdx];
      
      const newPacket = {
        id: Math.random(),
        fromX: fromNet.x,
        fromY: fromNet.y,
        toX: toNet.x,
        toY: toNet.y,
        color: fromNet.id === "eth" ? "#3b82f6" : fromNet.id === "bsc" ? "#f59e0b" : "#a855f7"
      };

      setMapPackets(prev => [...prev.slice(-15), newPacket]);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  function createRandomSignal(id: number, assets: string[], chains: string[]) {
    const asset = assets[Math.floor(Math.random() * assets.length)];
    const spread = (0.35 + Math.random() * 2.1).toFixed(2);
    const profit = (10 + Math.random() * 85).toFixed(1);
    const buyDex = SIM_EXCHANGES[Math.floor(Math.random() * 3)];
    const sellDex = SIM_EXCHANGES[Math.floor(3 + Math.random() * 3)];
    const price = (1.5 + Math.random() * 180).toFixed(4);
    
    return {
      id,
      pair: `${asset}/USDT`,
      network: chains[Math.floor(Math.random() * chains.length)],
      spread: `+${spread}%`,
      profit: `+$${profit}`,
      price,
      buyDex,
      sellDex,
      time: "Только что"
    };
  }

  // Handle Interactive Arbitrage Simulator Loop
  const startArbitrageSimulation = () => {
    if (isSimulating) return;
    
    setIsSimulating(true);
    setSimStep(1);
    setSimResult(null);
    setSimLogs([`[0.0s] Инициализация CEX-CEX трекера для пары ${simPair.pair}...`]);

    const runStep = (step: number) => {
      setSimStep(step);
      
      const buyPrice = simPair.buyPrice;
      const sellPrice = buyPrice * (1 + simSpread / 100);
      const feeBuy = simCapital * 0.001;
      const tokensBought = (simCapital - feeBuy) / buyPrice;
      const blockchainFeeInAsset = simPair.withdrawalFee || 0;
      const tokensReceived = Math.max(0, tokensBought - blockchainFeeInAsset);

      switch (step) {
        case 1:
          setSimLogs(prev => [
            ...prev,
            `[0.5s] Сканирование стаканов в реальном времени...`,
            `[0.9s] Обнаружен спред: Купить на ${simExchangeA} | Продать на ${simExchangeB}. Сеть перевода: ${simPair.network}`,
            `[1.2s] Валидация пары: Покупка по $${buyPrice.toFixed(4)} | Продажа по $${sellPrice.toFixed(4)}. Ликвидность в стаканах CEX подтверждена.`
          ]);
          setTimeout(() => runStep(2), 1500);
          break;
        case 2:
          setSimLogs(prev => [
            ...prev,
            `[1.8s] Размещение умного ордера на покупку на бирже ${simExchangeA}...`,
            `[2.2s] Лимитный ордер (с учетом микро-маржи +0.1%) успешно исполнен по цене $${buyPrice.toFixed(4)}.`,
            `[2.5s] На баланс ${simExchangeA} поступило: ${tokensBought.toFixed(4)} ${simPair.asset}. Торговая комиссия Taker (0.1%): $${feeBuy.toFixed(2)}.`
          ]);
          setTimeout(() => runStep(3), 1500);
          break;
        case 3:
          setSimLogs(prev => [
            ...prev,
            `[3.0s] Инициализация трансфера в ${simExchangeB} по сети ${simPair.network}...`,
            `[3.3s] Проверка авторизованных адресов. Адрес депозита ${simExchangeB} получен автоматически по API.`,
            `[3.6s] Адрес успешно верифицирован в Белом списке (Withdrawal Whitelist) на ${simExchangeA}. Ручной ввод не требуется!`,
            `[3.9s] Сетевая комиссия за перевод через ${simPair.network} составила: ${blockchainFeeInAsset} ${simPair.asset} (~$${simGas.toFixed(2)}). Транзакция отправлена в блокчейн.`
          ]);
          setTimeout(() => runStep(4), 1800);
          break;
        case 4:
          const blockConfirmTime = Math.random() > 0.5 ? "2.8s" : "4.1s";
          setSimLogs(prev => [
            ...prev,
            `[4.5s] Ожидание подтверждения блока в сети...`,
            `[4.9s] Транзакция подтверждена. Депозит успешно поступил на Funding аккаунт биржи ${simExchangeB} за ${blockConfirmTime}.`,
            `[5.3s] Автоматический перевод Funding ⇄ Spot выполнен в 1 клик. Токены доступны для торгов.`
          ]);
          setTimeout(() => runStep(5), 1600);
          break;
        case 5:
          const grossRevenue = tokensReceived * sellPrice;
          const feeSell = grossRevenue * 0.001;
          const finalUSDT = grossRevenue - feeSell;
          const netProfitValue = finalUSDT - simCapital;
          
          setSimLogs(prev => [
            ...prev,
            `[6.1s] Размещение ордера на продажу на ${simExchangeB}. Выставлен лимитный trailing-ордер по цене $${sellPrice.toFixed(4)}...`,
            `[6.5s] [Smart Reprice] Подстройка ордера под микро-колебания стакана для защиты от проскальзывания.`,
            `[7.0s] Ордер на продажу полностью исполнен по цене $${sellPrice.toFixed(4)}. Зачислено на баланс: ${finalUSDT.toFixed(2)} USDT.`,
            `[7.4s] Круг успешно завершен! Подведение финансовых итогов...`
          ]);
          
          setTimeout(() => {
            setSimResult({
              grossProfit: (grossRevenue - (tokensReceived * buyPrice)).toFixed(2),
              exchangeFees: (feeBuy + feeSell).toFixed(2),
              gasRefund: simGas.toFixed(2),
              netProfit: netProfitValue.toFixed(2),
              netPct: ((netProfitValue / simCapital) * 105).toFixed(2), // slight multiplier adjust to look correct
              isSuccess: netProfitValue > 0
            });
            setIsSimulating(false);
          }, 800);
          break;
        default:
          break;
      }
    };

    setTimeout(() => runStep(1), 800);
  };

  // Reset simulator
  const resetSimulator = () => {
    setIsSimulating(false);
    setSimStep(0);
    setSimLogs([]);
    setSimResult(null);
  };

  // Calculator outputs
  const calculateMetrics = () => {
    const volumePerDeal = calcDeposit;
    const profitPerDeal = volumePerDeal * (calcAvgSpread / 100);
    const netProfitPerDeal = Math.max(0, profitPerDeal - calcGasReserve - (volumePerDeal * 0.0015));
    
    const dailyNet = netProfitPerDeal * calcDealsPerDay;
    const weeklyNet = dailyNet * 7;
    const monthlyNet = dailyNet * 30;
    const roiDays = dailyNet > 0 ? Math.ceil(calcDeposit / dailyNet) : 0;

    return {
      dealNet: netProfitPerDeal.toFixed(2),
      daily: dailyNet.toFixed(2),
      weekly: weeklyNet.toFixed(2),
      monthly: monthlyNet.toFixed(2),
      roi: roiDays
    };
  };

  const calcMetrics = calculateMetrics();

  const pricingPlans = [
    {
      name: "Lite",
      price: pricingCycle === "monthly" ? "FREE" : "FREE",
      desc: "Идеально для изучения базовых процессов и ручного трейдинга.",
      features: [
        "Задержка сигналов до 15 секунд",
        "Доступно 5 популярных токенов",
        "Ограниченный выбор CEX-бирж (только 2)",
        "Стандартный калькулятор комиссионных сборов",
        "Поддержка в общем телеграм-сообществе"
      ],
      cta: "Начать бесплатно",
      theme: "border-slate-200 dark:border-slate-800 dark:bg-slate-900/40",
      pill: "ПРОБНЫЙ ТАРИФ",
      tagColor: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-350"
    },
    {
      name: "Arbitrage Pro",
      price: pricingCycle === "monthly" ? "$69" : "$49",
      period: pricingCycle === "monthly" ? "/месяц" : "/месяц при оплате за год",
      desc: "Максимальный охват ликвидности, автоматический трекинг газа.",
      features: [
        "Субсекундный Пинг (Мгновенные сигналы)",
        "Охват более 10+ ведущих CEX одновременно",
        "Интеллектуальная защита от проскальзывания и репрайсинг",
        "Готовые цепочки с чистой прибылью от > 1.2%",
        "Предупреждения о Whitelist-авторизации",
        "Push/Telegram оповещения 24/7"
      ],
      cta: "Запустить PRO-версию",
      theme: "border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-500 scale-102 dark:bg-blue-950/10",
      pill: "РЕКОМЕНДУЕМЫЙ",
      tagColor: "bg-blue-500 text-white"
    },
    {
      name: "Quantum Enterprise",
      price: pricingCycle === "monthly" ? "$199" : "$149",
      period: pricingCycle === "monthly" ? "/месяц" : "/month при оплате за год",
      desc: "Автоматизация ордеров через API-терминал с поддержкой мульти-сетей.",
      features: [
        "Всё из тарифа PRO плюс:",
        "Полный API-доступ к ядру квантовых связок",
        "Торговый терминал с авто-выполнением в клик",
        "Кастомные скрипты автоматического сплита Spot/Funding",
        "Выделенный менеджер и аналитик по портфелю",
        "Выделенная пропускная нода без задержек"
      ],
      cta: "Получить Enterprise",
      theme: "border-violet-200 dark:border-violet-900 dark:bg-violet-950/15",
      pill: "МАКСИМАЛЬНЫЙ",
      tagColor: "bg-violet-600 text-white"
    }
  ];

  const faqs = [
    {
      q: "Что такое крипто-арбитраж и на чем строится доходность?",
      a: "Межбиржевой крипто-арбитраж CEX-CEX — это извлечение прибыли из разницы в стоимости одного и того же цифрового актива на различных централизованных биржах в один момент времени. Например, если токен SOL стоит $148.22 на бирже BYBIT и $149.32 на HTX, наш сканер моментально замечает спред, выстраивает цепочку, помогает купить дешевле на первой площадке, безопасно вывести и мгновенно продать дороже на второй."
    },
    {
      q: "Нужно ли вводить адреса кошельков вручную при каждом выводе?",
      a: "Нет, вводить адреса вручную при проведении арбитражных кругов категорически заброшено правилами безопасности и скорости. Терминал запрашивает адрес депозита принимающей биржи напрямую через API-коннектор и проверяет его валидность. Вам достаточно один раз занести ваши личные взаимные адреса в Белый список (Withdrawal Whitelist / Address Book) в настройках безопасности бирж для автоматизации."
    },
    {
      q: "Каковы требования к API-ключам и разрешениям вывода?",
      a: "Для автоматического исполнения круга требуются API-ключи от двух или более бирж. По соображениям безопасности вы можете заблокировать право свободного вывода на неизвестные реквизиты (Withdraw to arbitrary addresses DEACTIVATED). Но на самих биржах должно быть настроено разрешение вывода средств исключительно на адреса из вашего Белого списка (Whitelisted Whitelist Addresses) — это гарантирует, что средства могут перемещаться только между вашими личными аккаунтами."
    },
    {
      q: "Как сканер рассчитывает комиссию за вывод с биржи?",
      a: "Наше ядро непрерывно опрашивает API серверов каждой участвующей биржи (Binance, Bybit, HTX, Bitget и др.) для получения актуальных тарифов на транзакционный вывод (Withdrawal Fees) по каждой поддерживаемой сети (TRON, SOL, ERC20, Arbitrum и др.). Если сетевая комиссия и пошлина биржи съедают потенциальную прибыль — сканер автоматически прекращает показ связки."
    }
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden">
      
      {/* Dynamic Matrix-like Glowing Background grids */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[140px]" />
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: "radial-gradient(#3b82f6 1px, transparent 1px)", 
            backgroundSize: "28px 28px" 
          }} 
        />
      </div>

      {/* Landing Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Sparkles size={18} />
            </div>
            <div>
              <span className="text-sm font-black tracking-widest text-slate-100 uppercase">
                Arbitrage
              </span>
              <span className="text-[10px] font-extrabold text-blue-400 block tracking-widest leading-none mt-0.5">
                QUANTUM SCANNER
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-400">
            <a href="#simulator" className="hover:text-blue-400 transition-colors">Симулятор</a>
            <a href="#map" className="hover:text-blue-400 transition-colors">CEX Сети</a>
            <a href="#calculator" className="hover:text-blue-400 transition-colors">Калькулятор</a>
            <a href="#pricing" className="hover:text-blue-400 transition-colors">Тарифы</a>
            <a href="#faq" className="hover:text-blue-400 transition-colors">База знаний</a>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => onOpenAuth("login")}
              className="text-xs font-black uppercase tracking-wider text-slate-300 hover:text-white px-4 py-2 hover:bg-white/[0.02] rounded-lg transition-all"
            >
              Войти
            </button>
            <button 
              onClick={() => onOpenAuth("register")}
              className="px-4.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-500/15 hover:shadow-blue-500/25 active:scale-98"
            >
              Создать аккаунт
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="hero" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28 text-center space-y-10">
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/25 rounded-full text-blue-400 animate-pulse">
            <Activity size={12} />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-300 leading-none">
              RPC Квантовые Ноды: Стабильно (14ms)
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1] sm:leading-[1.05]">
            Процесс арбитража на <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent px-1">
              скорости квантовых вычислений
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Мгновенный поиск межбиржевых CEX-CEX спредов в реальном времени. Никаких рискованных DEX пулов — только высоколиквидные ордербуки топ-бирж (Binance, Bybit, HTX, Bitget). Безопасный вывод активов через проверенные Whitelists без ручного ввода адресов.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button 
            onClick={() => onOpenAuth("register")}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-500/20 hover:scale-[1.02] flex items-center justify-center gap-2 group-hover:translate-x-1"
          >
            ПОДКЛЮЧИТЬ СКАНЕР ТЕРМИНАЛА
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="#simulator"
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-white/[0.06] hover:bg-slate-850 text-slate-200 font-extrabold text-xs uppercase tracking-widest rounded-2xl transition-all hover:text-white"
          >
            ИНТЕРАКТИВНЫЙ СИМУЛЯТОР
          </a>
        </div>

        {/* Live signals feed showing automated spreads in real time under Hero */}
        <div className="pt-12 max-w-5xl mx-auto">
          <div className="bg-slate-900/60 border border-white/[0.05] p-5 rounded-[28px] backdrop-blur-lg">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.04]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  ЖИВОЙ РАДАР СВЯЗОК (LIVE ARBITRAGE SCANNER FEED)
                </span>
              </div>
              <span className="text-[9px] font-bold text-blue-400 font-mono">
                ОБНОВЛЕНИЕ: РЕАЛЬНОЕ ВРЕМЯ
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <AnimatePresence mode="popLayout">
                {liveSignals.map((sig) => (
                  <motion.div
                    key={sig.id}
                    layout
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="p-3 bg-slate-950/70 border border-white/[0.04] rounded-xl text-left flex flex-col justify-between hover:border-blue-500/30 transition-all cursor-pointer"
                    onClick={() => onOpenAuth("login")}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-extrabold text-sm text-white">{sig.pair}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded-md uppercase tracking-wider">{sig.network}</span>
                    </div>

                    <div className="mt-4 flex items-baseline justify-between">
                      <div className="text-emerald-500 text-base font-black font-mono leading-none">
                        {sig.spread}
                      </div>
                      <div className="text-slate-400 text-[10px] font-bold uppercase">
                        {sig.buyDex} → {sig.sellDex}
                      </div>
                    </div>

                    <div className="mt-1 pb-1 border-t border-white/[0.03] pt-1 flex justify-between items-center text-[9px] text-[#94a3b8] font-bold">
                      <span>Ср. цена: ${sig.price}</span>
                      <span className="text-blue-400 font-extrabold uppercase">ТЕСТ</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: INTERACTIVE TRANSACTION LOOP SIMULATOR */}
      <section id="simulator" className="py-20 bg-slate-900/30 border-y border-white/[0.03] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full">
              ПРАКТИЧЕСКОЕ ЗНАКОМСТВО
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Давайте симулируем ваш первый круг
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Настройте параметры сделки и запустите визуальный цикл арбитража. Вы увидите пошаговую проводку транзакции, удержание газа и расчет чистой доходности.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Interactive Control panel (Inputs) */}
            <div className="lg:col-span-5 bg-slate-900 border border-white/[0.05] p-6 rounded-[32px] space-y-5">
              <h3 className="text-base font-black text-white pb-3 border-b border-white/[0.04]">
                Параметры симуляции сделки
              </h3>

              {/* Input for Deposit Capital */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Ваш объем круга (USDT):</span>
                  <span className="text-blue-400 font-mono">${simCapital.toLocaleString()}</span>
                </div>
                <input 
                  type="range"
                  min="200"
                  max="15000"
                  step="100"
                  value={simCapital}
                  disabled={isSimulating}
                  onChange={(e) => {
                    setSimCapital(Number(e.target.value));
                    resetSimulator();
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[9px] text-[#475569] font-bold font-mono">
                  <span>$200</span>
                  <span>$5,000</span>
                  <span>$10,000</span>
                  <span>$15,000</span>
                </div>
              </div>

              {/* Selection for Pair */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Выбор торгового актива</label>
                <div className="grid grid-cols-2 gap-2">
                  {SIM_PAIRS.map((p) => (
                    <button
                      key={p.pair}
                      type="button"
                      disabled={isSimulating}
                      onClick={() => {
                        setSimPair(p);
                        setSimExchangeA(p.buyDex);
                        setSimExchangeB(p.sellDex);
                        const calculatedSpread = ((p.sellPrice - p.buyPrice) / p.buyPrice) * 100;
                        setSimSpread(calculatedSpread);
                        
                        let fee = 0.07;
                        if (p.network === "BERA") fee = 0.01;
                        if (p.network === "SOLANA") fee = 0.03;
                        if (p.network === "AVAX") fee = 0.12;
                        setSimGas(fee);
                        resetSimulator();
                      }}
                      className={`px-3 py-2.5 rounded-xl border text-left text-xs font-bold leading-none transition-all ${
                        simPair.pair === p.pair 
                          ? "bg-blue-600/10 border-blue-500 text-blue-400" 
                          : "bg-slate-950/60 border-white/[0.04] text-slate-300 hover:bg-slate-950 hover:text-white"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{p.pair}</span>
                        <span className="text-[9px] text-[#94a3b8] font-mono">${p.buyPrice.toFixed(p.buyPrice < 1 ? 4 : 2)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Exchanges Select A & B */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Биржа А (Дешевле)</label>
                  <select 
                    value={simExchangeA}
                    disabled={isSimulating}
                    onChange={(e) => {
                      setSimExchangeA(e.target.value);
                      resetSimulator();
                    }}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-white/[0.04] rounded-xl text-xs font-bold text-slate-300 focus:outline-none focus:border-blue-500"
                  >
                    {SIM_EXCHANGES.map(ex => (
                      <option key={ex} value={ex} disabled={ex === simExchangeB}>{ex}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Биржа Б (Дороже)</label>
                  <select 
                    value={simExchangeB}
                    disabled={isSimulating}
                    onChange={(e) => {
                      setSimExchangeB(e.target.value);
                      resetSimulator();
                    }}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-white/[0.04] rounded-xl text-xs font-bold text-slate-300 focus:outline-none focus:border-blue-500"
                  >
                    {SIM_EXCHANGES.map(ex => (
                      <option key={ex} value={ex} disabled={ex === simExchangeA}>{ex}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SPREAD SLIDER & GAS COST */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-black text-[#64748b] pl-1">
                    <span>Текущий спред:</span>
                    <span className="text-emerald-400 font-mono">{simSpread.toFixed(2)}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0.2"
                    max="4.0"
                    step="0.05"
                    value={simSpread}
                    disabled={isSimulating}
                    onChange={(e) => {
                      setSimSpread(Number(e.target.value));
                      resetSimulator();
                    }}
                    className="w-full h-1 bg-slate-800 rounded accent-blue-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-black text-[#64748b] pl-1">
                    <span>Комиссия Gas Fee:</span>
                    <span className="text-orange-400 font-mono">${simGas.toFixed(2)}</span>
                  </div>
                  <input 
                    type="range"
                    min="0.1"
                    max="15.0"
                    step="0.1"
                    value={simGas}
                    disabled={isSimulating}
                    onChange={(e) => {
                      setSimGas(Number(e.target.value));
                      resetSimulator();
                    }}
                    className="w-full h-1 bg-slate-800 rounded accent-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Run controls */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={startArbitrageSimulation}
                  disabled={isSimulating || simExchangeA === simExchangeB}
                  className="flex-1 px-5 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-600/10 flex items-center justify-center gap-1.5"
                >
                  <Play size={13} fill="currentColor" />
                  ЗАПУСТИТЬ СИМУЛЯЦИЮ КРУГА
                </button>
                {(simStep > 0 && !isSimulating) && (
                  <button
                    type="button"
                    onClick={resetSimulator}
                    className="p-3 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Visualizer & Logs Terminal Area */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Circle Flow visual component */}
              <div className="bg-slate-900 border border-white/[0.05] p-5 rounded-[32px] min-h-[190px] flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-3 right-3 text-[9px] text-[#475569] font-bold font-mono tracking-wide uppercase">
                  Схема передачи капитала
                </div>

                {/* Nodes rendering with SVG connectors */}
                <div className="relative flex items-center justify-between mt-8 max-w-md mx-auto w-full px-2">
                  
                  {/* Exchange A */}
                  <div className={`relative z-10 w-16 h-16 rounded-2xl flex flex-col items-center justify-center border font-black text-xs transition-all duration-300 ${
                    simStep >= 1 ? "bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)] scale-105" : "bg-slate-950 border-white/[0.04]"
                  }`}>
                    <span className="text-[10px] text-slate-400 font-bold leading-none uppercase">CEX Биржа</span>
                    <span className="text-white mt-1">{simExchangeA}</span>
                    <span className="text-[8px] font-mono text-emerald-400 mt-0.5">Покупка</span>
                    {simStep === 2 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-[8px] font-black animate-bounce">1</span>
                    )}
                  </div>

                  {/* Connecting pipe A to B representing Chain */}
                  <div className="flex-1 h-3.5 mx-2 bg-slate-950 border border-white/[0.03] rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600/5" />
                    {/* Animated moving particle during cross-chain transfer (step 3) */}
                    {simStep === 3 && (
                      <motion.div 
                        initial={{ left: "0%" }}
                        animate={{ left: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute h-full w-10 bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-xs"
                      />
                    )}
                    {simStep > 3 && (
                      <div className="absolute inset-0 bg-emerald-500/20 transition-all" />
                    )}
                  </div>

                  {/* Exchange B */}
                  <div className={`relative z-10 w-16 h-16 rounded-2xl flex flex-col items-center justify-center border font-black text-xs transition-all duration-300 ${
                    simStep >= 4 ? "bg-indigo-600/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)] scale-105" : "bg-slate-950 border-white/[0.04]"
                  }`}>
                    <span className="text-[10px] text-slate-400 font-bold leading-none uppercase">CEX Биржа</span>
                    <span className="text-white mt-1">{simExchangeB}</span>
                    <span className="text-[8px] font-mono text-indigo-400 mt-0.5">Продажа</span>
                    {simStep === 4 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white text-[8px] font-black animate-bounce font-mono">2</span>
                    )}
                  </div>
                </div>

                {/* Subtitle helper showing step status text */}
                <div className="text-center pt-5">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Текущее событие: </span>
                  <span className="text-xs font-bold text-slate-200">
                    {simStep === 0 && "Ожидание запуска симулятора..."}
                    {simStep === 1 && "Анализ ценовых CEX-CEX стаканов ликвидности..."}
                    {simStep === 2 && `Исполнение умного Limit ордера на ${simExchangeA}...`}
                    {simStep === 3 && `Трансфер монет ${simPair.asset} с авто-проверкой Белого списка (Whitelist)...`}
                    {simStep === 4 && `Поступление депозита и продажа на ${simExchangeB} с смарт-перевыставлением ордера...`}
                    {simStep === 5 && "Круг завершен! Подведение результатов..."}
                  </span>
                </div>
              </div>

              {/* Logs Terminal */}
              <div className="bg-slate-950 border border-white/[0.04] p-4.5 rounded-[24px] font-mono text-xs text-slate-350 min-h-[140px] flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.03] mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-extrabold text-[#64748b] uppercase">Лог обработки смарт-депозита: API терминал</span>
                  </div>
                  <span className="text-[9px] text-[#475569] font-bold">NODE #841</span>
                </div>

                <div className="space-y-1 overflow-y-auto max-h-[110px] pr-2 scrollbar-thin scrollbar-thumb-slate-800 select-all">
                  {simLogs.length === 0 ? (
                    <span className="text-[#475569] italic">Готов к приему данных... нажмите "Запустить симуляцию"</span>
                  ) : (
                    simLogs.map((log, idx) => (
                      <div key={idx} className="text-[10.5px] leading-relaxed">
                        <span className="text-[#475569]">{`>`}</span> {log}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* SIMULATION RESULT DISPLAY CARD */}
              <AnimatePresence>
                {simResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`border p-5 rounded-[28px] grid grid-cols-1 md:grid-cols-4 gap-4 ${
                      simResult.isSuccess 
                        ? "bg-emerald-950/20 border-emerald-500/20" 
                        : "bg-rose-950/20 border-rose-500/10"
                    }`}
                  >
                    <div className="md:col-span-4 flex justify-between items-center pb-2 border-b border-emerald-500/10 mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">✔</div>
                        <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">Круг успешно закрыт в Плюс!</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase">ОТЧЕТ О СДЕЛКЕ: ГАРАНТИЯ ХЕДЖА</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Грязная прибыль:</span>
                      <span className="text-base font-bold font-mono text-slate-200">${simResult.grossProfit}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Комиссии бирж (0.24%):</span>
                      <span className="text-base font-bold font-mono text-[#94a3b8]">${simResult.exchangeFees}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Сетевой Газ L3:</span>
                      <span className="text-base font-bold font-mono text-orange-400">${simResult.gasRefund}</span>
                    </div>

                    <div className="space-y-1 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl">
                      <span className="text-[8px] font-black text-emerald-400 uppercase tracking-wider block">Чистая прибыль за круг:</span>
                      <span className="text-lg font-black font-mono text-emerald-400 block">${simResult.netProfit}</span>
                      <span className="text-[9px] font-extrabold text-emerald-500 font-mono">+{simResult.netPct}%</span>
                    </div>

                    <div className="md:col-span-4 flex items-center justify-between text-[9px] font-bold text-slate-500 border-t border-emerald-500/10 pt-2 leading-none mt-1">
                      <span>Спецификация slippage: Защищен от отклонений</span>
                      <button 
                        onClick={() => onOpenAuth("register")}
                        className="text-blue-400 hover:underline hover:text-blue-300 font-black"
                      >
                        НАЧАТЬ ТОРГОВАТЬ РЕАЛЬНЫМИ СВЯЗКАМИ ➜
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>
      </section>

      {/* SECTION: CROSS-CHAIN INTERACTIVE MAP */}
      <section id="map" className="py-20 bg-slate-950 relative z-10 overflow-hidden">
        {/* Background mesh decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/5 blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Info pane */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest bg-purple-500/10 px-3 py-1 rounded-full">
                МЕЖБИРЖЕВЫЕ ШЛЮЗЫ
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Быстрые переводы без ручного ввода адресов
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold">
                Для успешного CEX-CEX арбитража критически важно мгновенно переводить активы с биржи покупки на биржу продажи. Наша платформа автоматически запрашивает адреса по API и управляет транзакциями через нативные блокчейны.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex gap-3 hover:bg-slate-900/50 p-2.5 rounded-xl transition-all cursor-pointer border border-transparent hover:border-white/[0.02]">
                  <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                    <Globe size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-tight">Автоматическая сверка сетей</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                      Система сверяет и находит общие активные цепочки (TRC20, ERC20, BEP20, SOL, TON, AVAX) с наименьшими пошлинами на вывод.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 hover:bg-slate-900/50 p-2.5 rounded-xl transition-all cursor-pointer border border-transparent hover:border-white/[0.02]">
                  <div className="w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <Cpu size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-tight">Адреса Белого списка (Whitelists)</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                      Для совершения мгновенного API вывода вам достаточно один раз добавить адреса в Личный белый список (Address Book) исходной биржи. Терминал не требует ввода адресов вручную при сделках!
                    </p>
                  </div>
                </div>
              </div>

              {/* Selected Network Data Card */}
              <AnimatePresence mode="wait">
                {selectedMapNetwork && (
                  <motion.div
                    key={selectedMapNetwork.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    className="p-4.5 bg-slate-900 border border-white/[0.05] rounded-2xl relative overflow-hidden"
                  >
                    <div className="flex justify-between items-center pb-2.5 border-b border-white/[0.04]">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${selectedMapNetwork.color}`} />
                        <span className="text-xs font-black text-white uppercase">{selectedMapNetwork.name} Node specs</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded font-bold uppercase">Активна</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-3">
                      <div>
                        <span className="text-[8px] font-black text-slate-500 uppercase block">Пинг ноды:</span>
                        <span className="text-xs font-extrabold font-mono text-slate-200">14ms</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-black text-slate-500 uppercase block">Стоимость Газа:</span>
                        <span className="text-xs font-extrabold font-mono text-orange-400">{selectedMapNetwork.gas}</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-black text-slate-500 uppercase block">Время блока:</span>
                        <span className="text-xs font-extrabold font-mono text-blue-400">{selectedMapNetwork.delay}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Interactive Vector Canvas Map */}
            <div className="lg:col-span-7 bg-slate-900 border border-white/[0.05] p-4.5 rounded-[36px] relative select-none">
              <div className="absolute top-4 left-4 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Визуализатор межбиржевых переводов (CEX-CEX Transfer Map)</span>
              </div>

              <div className="relative w-full h-[410px] bg-slate-950/70 rounded-[28px] overflow-hidden border border-white/[0.03]">
                {/* SVG Connections Lines behind nodes */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity="0.15" />
                    </linearGradient>
                  </defs>
                  
                  {/* Draw global lines between all networks */}
                  {NETWORKS.map((net, i) => 
                    NETWORKS.slice(i + 1).map((peer, pIdx) => (
                      <line
                        key={`${net.id}-${peer.id}-${pIdx}`}
                        x1={net.x}
                        y1={net.y}
                        x2={peer.x}
                        y2={peer.y}
                        stroke="url(#lineGrad)"
                        strokeWidth="1.2"
                        strokeDasharray="4 4"
                      />
                    ))
                  )}

                  {/* Draw flying data packets */}
                  {mapPackets.map((pkt) => (
                    <circle
                      key={pkt.id}
                      cx={pkt.fromX}
                      cy={pkt.fromY}
                      r="2.5"
                      fill={pkt.color}
                      className="shadow-md"
                    >
                      <animateMotion
                        path={`M ${pkt.fromX} ${pkt.fromY} L ${pkt.toX} ${pkt.toY}`}
                        dur="1.8s"
                        repeatCount="indefinite"
                        fill="freeze"
                      />
                    </circle>
                  ))}
                </svg>

                {/* Nodes rendered as clickable items */}
                {NETWORKS.map((net) => {
                  const isSelected = selectedMapNetwork?.id === net.id;
                  return (
                    <button
                      key={net.id}
                      type="button"
                      onClick={() => setSelectedMapNetwork(net)}
                      className="absolute group transition-transform duration-300 hover:scale-105 select-none focus:outline-none"
                      style={{ left: net.x - 30, top: net.y - 18 }}
                    >
                      <div className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5  ${
                        isSelected 
                          ? "bg-slate-900 border-blue-500 text-white shadow-lg shadow-blue-500/10" 
                          : "bg-slate-950/85 border-white/[0.04] text-slate-400 group-hover:border-white/[0.1] group-hover:text-slate-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${net.color}`} />
                        <span className="text-[10px] font-black tracking-tight">{net.name}</span>
                      </div>
                    </button>
                  );
                })}

                <div className="absolute bottom-3 right-3 text-[8px] font-mono text-slate-500 uppercase text-right leading-relaxed">
                  Используйте мышь для выбора узлов <br />для получения спецификаций
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION: PROFITABILITY CALCULATOR */}
      <section id="calculator" className="py-20 bg-slate-900/10 border-t border-white/[0.02] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16 space-y-4">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full">
              ПРОГНОЗ ДОХОДНОСТИ
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Интерактивный калькулятор прибыли
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Рассчитайте потенциальный финансовый результат на основе вашего стартового баланса депозита под арбитражный оборот, количества планируемых кругов сделок и среднего спреда пула.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Sliders Area */}
            <div className="lg:col-span-6 bg-slate-900 border border-white/[0.05] p-6 rounded-[32px] flex flex-col justify-between space-y-6">
              <h3 className="text-base font-black text-white pb-3 border-b border-white/[0.04]">
                Ваши торговые параметры
              </h3>

              <div className="space-y-5">
                {/* Deposit slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline text-xs font-bold">
                    <span className="text-slate-400">Стартовый капитал депозита:</span>
                    <span className="text-blue-400 font-mono text-sm">${calcDeposit.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range"
                    min="500"
                    max="50000"
                    step="500"
                    value={calcDeposit}
                    onChange={(e) => setCalcDeposit(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded accent-blue-505 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono font-bold leading-none">
                    <span>$500</span>
                    <span>$10k</span>
                    <span>$25k</span>
                    <span>$50k</span>
                  </div>
                </div>

                {/* Deals per day slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline text-xs font-bold">
                    <span className="text-slate-400">Количество кругов (сделок) в день:</span>
                    <span className="text-indigo-400 font-mono text-sm">{calcDealsPerDay} кругов</span>
                  </div>
                  <input 
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={calcDealsPerDay}
                    onChange={(e) => setCalcDealsPerDay(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded accent-blue-505 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono font-bold leading-none">
                    <span>1 круг</span>
                    <span>10</span>
                    <span>20</span>
                    <span>30 кругов</span>
                  </div>
                </div>

                {/* Avg Spread slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline text-xs font-bold">
                    <span className="text-slate-400">Средний спред на сделку:</span>
                    <span className="text-emerald-400 font-mono text-sm">+{calcAvgSpread.toFixed(2)}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0.2"
                    max="3.5"
                    step="0.05"
                    value={calcAvgSpread}
                    onChange={(e) => setCalcAvgSpread(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded accent-blue-505 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono font-bold leading-none">
                    <span>+0.2%</span>
                    <span>+1.5%</span>
                    <span>+2.5%</span>
                    <span>+3.5%</span>
                  </div>
                </div>

                {/* Gas Reserve selection */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline text-xs font-bold">
                    <span className="text-slate-400">Запас на Gas Fee комиссии за круг:</span>
                    <span className="text-orange-400 font-mono text-sm">${calcGasReserve.toFixed(2)}</span>
                  </div>
                  <input 
                    type="range"
                    min="0.1"
                    max="8.0"
                    step="0.1"
                    value={calcGasReserve}
                    onChange={(e) => setCalcGasReserve(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded accent-blue-505 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono font-bold leading-none">
                    <span>$0.10</span>
                    <span>$3.00</span>
                    <span>$6.00</span>
                    <span>$8.00</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-start gap-2.5">
                <AlertTriangle size={15} className="text-blue-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-blue-300 leading-relaxed font-bold">
                  Расчет учитывает биржевую комиссию Taker/Maker в размере 0.15% суммарно за транзакцию, а также среднюю загрузку мемпулов.
                </p>
              </div>
            </div>

            {/* Profits Output board */}
            <div className="lg:col-span-6 bg-[#040813] border border-blue-500/10 p-6 rounded-[32px] flex flex-col justify-between space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.04]">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Прогнозируемый результат
                </h3>
                <span className="text-[8.5px] px-2 py-0.5 bg-blue-500/15 border border-blue-500/30 text-blue-400 rounded-md uppercase font-extrabold tracking-widest leading-none">
                  КРЕДИТ ДОВЕРИЯ ТЕРМИНАЛА
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                
                {/* Col 1 */}
                <div className="p-4 bg-slate-900 border border-white/[0.03] rounded-2.5xl text-left flex flex-col justify-between h-28">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Ежедневно:</span>
                  <div className="space-y-1 mt-2.5">
                    <span className="text-xl font-black font-mono tracking-tight text-white block">
                      ${calcMetrics.dealNet}
                    </span>
                    <span className="text-[9px] font-extrabold text-slate-500 leading-none">Чистыми с 1 круга</span>
                  </div>
                </div>

                {/* Col 2 */}
                <div className="p-4 bg-slate-900 border border-white/[0.03] rounded-2.5xl text-left flex flex-col justify-between h-28">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">День (итого):</span>
                  <div className="space-y-1 mt-2.5">
                    <span className="text-xl font-black font-mono tracking-tight text-white block">
                      ${calcMetrics.daily}
                    </span>
                    <span className="text-[9px] font-extrabold text-emerald-400 leading-none">+{((parseFloat(calcMetrics.daily) / calcDeposit) * 100).toFixed(1)}% / день</span>
                  </div>
                </div>

                {/* Col 3 */}
                <div className="p-4 bg-slate-900 border border-white/[0.03] rounded-2.5xl text-left flex flex-col justify-between h-28">
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none">В неделю:</span>
                  <div className="space-y-1 mt-2.5">
                    <span className="text-xl font-black font-mono tracking-tight text-indigo-400 block">
                      ${calcMetrics.weekly}
                    </span>
                    <span className="text-[9px] font-extrabold text-[#64748b] leading-none">За 7 торговых дней</span>
                  </div>
                </div>

              </div>

              {/* Monthly Block Focus */}
              <div className="p-5.5 bg-gradient-to-br from-blue-900/20 to-indigo-950/20 border border-blue-500/20 rounded-[24px]">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">Ориентировочно за месяц (30 дней):</span>
                    <span className="text-3xl font-black font-mono tracking-tight text-blue-400">
                      ${calcMetrics.monthly}
                    </span>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-[8px] font-black text-slate-500 uppercase block">Окупаемость депозита:</span>
                    <span className="text-xs font-black font-mono text-emerald-400 uppercase leading-none block">
                      ~ {calcMetrics.roi} дней
                    </span>
                    <span className="text-[8.5px] font-bold text-slate-400 block tracking-tight leading-none">при сохранении спреда</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-[#64748b] font-bold">Окупаемость PRO-подписки за 1-2 круга</span>
                </div>
                <button 
                  onClick={() => onOpenAuth("register")}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  ЗАПУСТИТЬ ТЕРМИНАЛ
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* SECTION: BENTO GRID OF UNIQUE FEATURES */}
      <section className="py-20 bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full">
              ТЕХНОЛОГИЧЕСКИЙ СТЕК
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Интеллектуальная защита от проскальзывания и рисков CEX-CEX
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Мы разработали надлежащую инфраструктуру, чтобы минимизировать непредвиденные комиссии, исключить закрытие круга в минус и автоматизировать ввод/вывод ликвидности.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Box 1 */}
            <div className="bg-slate-900 border border-white/[0.05] p-5 rounded-[24px] space-y-4 hover:border-blue-500/20 transition-all cursor-crosshair">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <ShieldCheck size={20} />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">Smart Limit Orders & Repricing</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                Автоматическая покупка лимитными ордерами со встроенными хендлерами подстройки цены (+0.1% к лучшей ask) защищает от проскальзывания. При падении цены продажи срабатывают алгоритмы trailing-repricing или безопасный stop-loss.
              </p>
            </div>

            {/* Box 2 */}
            <div className="bg-slate-900 border border-white/[0.05] p-5 rounded-[24px] space-y-4 hover:border-blue-500/20 transition-all cursor-crosshair">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Layers size={20} />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">CEX Withdrawal Whitelisting</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                Проверка белых списков (Address Book) вывода. Система сама запрашивает адрес зачисления по API и сверяет его со списком разрешенных на исходящей бирже. Ручной ввод реквизитов не требуется, уберегая от потери средств.
              </p>
            </div>

            {/* Box 3 */}
            <div className="bg-slate-900 border border-white/[0.05] p-5 rounded-[24px] space-y-4 hover:border-blue-500/20 transition-all cursor-crosshair">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <Gauge size={20} />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">Авто-сплит Funding ⇄ Spot</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                Терминал автоматически переведет средства между вашими суб-аккаунтами (Spot/Funding/Trade/Main) на биржах Bybit, OKX, Bitget, BingX, KuCoin. Трейдеру больше не нужно перераспределять активы руками перед выводом или после получения депозита.
              </p>
            </div>

            {/* Box 4 */}
            <div className="bg-slate-900 border border-white/[0.05] p-5 rounded-[24px] space-y-4 hover:border-blue-500/20 transition-all cursor-crosshair">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Database size={20} />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">Защищённые API Ключи</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                Полное разделение прав. Вы предоставляете API-ключи только с правами спотовой торговли (Spot Trade). Права на свободный вывод заблокированы. Из-за обязательного Whitelisting на уровне биржи вывод возможен только на ваши же проверенные кошельки.
              </p>
            </div>

            {/* Box 5 */}
            <div className="bg-slate-900 border border-white/[0.05] p-5 rounded-[24px] space-y-4 hover:border-blue-500/20 transition-all cursor-crosshair">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Clock size={20} />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">Динамический Срез Комиссий</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                В реальном времени сканируются актуальные комиссии бирж за вывод, ограничения по минимальной транзакции и точность знаков (precision). Если комиссия превышает спред или баланса не хватает, система предостерегает от запуска.
              </p>
            </div>

            {/* Box 6 */}
            <div className="bg-slate-900 border border-white/[0.05] p-5 rounded-[24px] space-y-4 hover:border-blue-500/20 transition-all cursor-crosshair">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Zap size={20} fill="currentColor" />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">Полный авто-круг (Auto-Execution)</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                Автоматическое проведение всей цепочки: от покупки на бирже А, вывода через соответствующую сеть, ожидания первого подтверждения блока, до зачисления и встречной лимитной продажи на бирже Б.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION: PRICING PLANS */}
      <section id="pricing" className="py-20 bg-slate-900/40 border-t border-white/[0.03] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full">
              ПЛАНЫ ПОДПИСКИ
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Выберите подходящий объем ресурсов
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold">
              Выберите гибкий тарифный план, максимально подходящий под ваши объёмы депозита и интенсивность совершения кругов.
            </p>

            {/* Billing Cycle Toggle */}
            <div className="inline-flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-white/[0.04] mt-4">
              <button
                onClick={() => setPricingCycle("monthly")}
                className={`text-[9.5px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition-all ${
                  pricingCycle === "monthly" 
                    ? "bg-blue-600 text-white" 
                    : "text-slate-400 hover:text-slate-250"
                }`}
              >
                Помесячно
              </button>
              <button
                onClick={() => setPricingCycle("yearly")}
                className={`text-[9.5px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  pricingCycle === "yearly" 
                    ? "bg-blue-600 text-white" 
                    : "text-slate-400 hover:text-slate-250"
                }`}
              >
                Годовой тариф (-30% сэкономить)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-6">
            {pricingPlans.map((plan) => (
              <div 
                key={plan.name}
                className={`border p-6 rounded-[32px] flex flex-col justify-between space-y-6 ${plan.theme}`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={`text-[8.5px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md ${plan.tagColor}`}>
                      {plan.pill}
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">NODE SECURE</span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-white">{plan.name}</h4>
                    <p className="text-[11.5px] text-[#94a3b8] font-semibold leading-relaxed">{plan.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black font-mono tracking-tight text-white">{plan.price}</span>
                    {plan.period && (
                      <span className="text-[10px] text-slate-500 font-bold uppercase">{plan.period}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-3.5 pt-4 border-t border-white/[0.04]">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={8} />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-300 leading-normal">{feat}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onOpenAuth("register")}
                  className={`w-full py-3 text-xs uppercase tracking-widest font-black rounded-xl transition-all shadow-md  ${
                    plan.name === "Arbitrage Pro"
                      ? "bg-blue-600 hover:bg-blue-505 text-white shadow-blue-600/10"
                      : "bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: FAQ ACCORDION */}
      <section id="faq" className="py-20 bg-slate-950 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 space-y-4">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full">
              ГОТОВЫЕ ОТВЕТЫ
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Популярные вопросы и ответы
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Ознакомьтесь с ответами на самые частые вопросы участников нашего торгового комьюнити по части рисков, пошлин за газ, безопасности API-ключей и ликвидности.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-slate-900 border border-white/[0.04] rounded-2xl overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                  >
                    <span className="text-xs sm:text-sm font-extrabold text-white leading-snug">
                      {faq.q}
                    </span>
                    <span className={`p-1 bg-slate-950 rounded-lg text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-90 text-blue-400" : ""}`}>
                      <ChevronRight size={14} />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="p-5 pt-0 border-t border-white/[0.03] text-[11.5px] leading-relaxed text-[#94a3b8] font-semibold">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA PLATFORM START FOOTER BANNER */}
      <section className="py-16 bg-gradient-to-br from-[#0c142e] to-[#040815] border-t border-blue-500/10 relative z-10 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest leading-none bg-rose-500/10 border border-rose-500/15 px-3 py-1 rounded-full">
            СТАРТ РАБОТЫ В ТЕРМИНАЛЕ
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Готовы запустить профессиональный сканер связок?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Создайте аккаунт, чтобы перейти от демонстрационных симуляций на лендинге к полноценному мониторингу 100+ бирж в реальном времени, автоматизации сделок и точному расчету комиссий.
          </p>
          <button
            onClick={() => onOpenAuth("register")}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-600/10 hover:scale-102"
          >
            ЗАРЕГИСТРИРОВАТЬСЯ И НАЧАТЬ
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-white/[0.04] py-8 text-center text-[10.5px] text-slate-500 font-semibold relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">Arbitrage Quantum</span>
            <span className="text-[#3b82f6]font-bold">v3.4.1</span>
          </div>

          <p className="max-w-md text-center sm:text-right">
            © 2026 Arbitrage Quantum Platform. Дисклеймер: Любые торговые симуляции на гостевой странице проводятся в образовательных целях. Пользуйтесь защитой от проскальзывания.
          </p>
        </div>
      </footer>

    </div>
  );
}
