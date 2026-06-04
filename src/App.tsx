import { useState, useEffect } from "react";
import { 
  User, 
  Shield, 
  Key, 
  CreditCard, 
  Zap, 
  Bell, 
  Wallet, 
  HelpCircle,
  History
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";

// --- Types & Components ---
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { ScannerPage, SignalDrawer } from "./pages/ScannerPage";
import { DetailedSignalAnalysis } from "./pages/DetailedAnalysisPage";
import { AccountPage } from "./pages/AccountPage";
import { SecurityPage } from "./pages/SecurityPage";
import { ApiKeyPage } from "./pages/ApiKeyPage";
import { SubscriptionPage } from "./pages/SubscriptionPage";
import { NotificationsPage, initialNotifications } from "./pages/NotificationsPage";
import { BalancePage } from "./pages/BalancePage";
import { HistoryPage } from "./pages/HistoryPage";
import { FaqPage } from "./pages/FaqPage";
import { AuthPage } from "./pages/AuthPage";
import { NotificationItem } from "./types";
import { useToast } from "./components/Toast";

export default function App() {
  const { showToast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | any>(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      return "dark";
    }
    document.documentElement.classList.remove("dark");
    return "light";
  });

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const [username, setUsername] = useState("Admin");
  const [email, setEmail] = useState("gavrfil@gmail.com");
  const [phone, setPhone] = useState("+79053440725");
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("Сканер");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeHeaderNav, setActiveHeaderNav] = useState("Сканер");
  const [isScannerRunning, setIsScannerRunning] = useState(false);
  const [scannerSubView, setScannerSubView] = useState<"scanner" | "history">("scanner");
  const [selectedSignal, setSelectedSignal] = useState<any>(null);
  const [detailedSignal, setDetailedSignal] = useState<any>(null);

  // Lifted Arbitrage Running State
  const [runningArbitrages, setRunningArbitrages] = useState<any[]>([]);

  // Lifted Notification States
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [activeGroupFilter, setActiveGroupFilter] = useState("Все");
  const [isSettingsMode, setIsSettingsMode] = useState(false);

  // Lifted Balance States
  const [selectedExchangeFilter, setSelectedExchangeFilter] = useState("Все");
  const [balanceSubView, setBalanceSubView] = useState("Отчет по активам");

  // Page Loading States
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  // Sync animation on mount
  useEffect(() => {
    setLoadingText("Инициализация криптографического туннеля...");
    setIsLoadingPage(true);
    const timer = setTimeout(() => {
      setIsLoadingPage(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const getLoadingMessage = (tabName: string) => {
    switch (tabName) {
      case "Сканер":
        return "Инициализация алгоритмов сканера...";
      case "Профиль":
        return "Синхронизация профиля...";
      case "Безопасность":
        return "Проверка сертификатов защиты...";
      case "API-ключи":
        return "Расшифровка API-конфигураций...";
      case "Подписка":
        return "Сверка подписки с контрактами...";
      case "История":
        return "Загрузка детальной истории кругов...";
      case "Уведомления":
        return "Загрузка журнала сигналов...";
      case "Баланс":
        return "Сбор балансов по биржам...";
      case "FAQ":
        return "Интеграция базы знаний...";
      default:
        return "Синхронизация данных...";
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast("Настройки профиля успешно обновлены", "success");
    }, 2000);
  };


  const handleActiveTabChange = (name: string) => {
    const targetTab = name === "Сигналы" ? "Сканер" : name;
    setLoadingText(getLoadingMessage(targetTab));
    setIsLoadingPage(true);

    setTimeout(() => {
      setActiveTab(targetTab);
      setDetailedSignal(null);
      if (targetTab === "Сканер") {
        setScannerSubView("scanner");
        setActiveHeaderNav("Сигналы");
      } else if (["Профиль", "Безопасность", "API-ключи", "Подписка"].includes(targetTab)) {
        setActiveHeaderNav("Аккаунт");
      } else if (targetTab === "Уведомления") {
        setActiveHeaderNav("Уведомления");
      } else if (targetTab === "Баланс") {
        setActiveHeaderNav("Баланс");
      } else if (targetTab === "FAQ") {
        setActiveHeaderNav("FAQ");
      }

      setTimeout(() => {
        setIsLoadingPage(false);
      }, 150);
    }, 450);
  };

  const handleGoToSignal = (pairName: string) => {
    const signalsList = [
      { id: 1, pair: "BER/USDT", network: "BERA", spread: "+0.44%", profit: "+$0.53", buyPrice: "0.02826", sellPrice: "0.02827", buyDex: "HTX", sellDex: "BITGET", status: "К запуску", type: "profit" },
      { id: 2, pair: "ETHW/USDT", network: "ETHW", spread: "-1.22%", profit: "-$0.20", buyPrice: "0.3225", sellPrice: "0.3179", buyDex: "HTX", sellDex: "MEXC", status: "Риск", type: "risk" }
    ];
    
    const searchStr = pairName.toLowerCase();
    const found = signalsList.find(s => {
      const pName = s.pair.toLowerCase();
      const pBase = s.pair.split('/')[0].toLowerCase();
      return searchStr.includes(pName) || searchStr.includes(pBase) || pName.includes(searchStr) || pBase.includes(searchStr);
    });

    if (found) {
      setSelectedSignal(found);
      handleActiveTabChange("Сканер");
      showToast(`Сигнал ${found.pair} успешно открыт в Сканере`, "success", "Переход к сигналу");
    } else {
      handleActiveTabChange("Сканер");
      showToast("Переход в Сканер Арбитража", "info");
    }
  };

  const navItems = [
    { name: "Сигналы", icon: <Zap size={20} /> },
    { name: "Профиль", icon: <User size={20} /> },
    { name: "Безопасность", icon: <Shield size={20} /> },
    { name: "API-ключи", icon: <Key size={20} /> },
    { name: "Подписка", icon: <CreditCard size={20} /> },
  ];

  const headerNav = [
    { name: "Сигналы", icon: <Zap size={18} /> },
    { name: "Аккаунт", icon: <User size={18} /> },
    { name: "Уведомления", icon: <Bell size={18} /> },
    { name: "Баланс", icon: <Wallet size={18} /> },
    { name: "FAQ", icon: <HelpCircle size={18} /> },
  ];

  if (!isLoggedIn) {
    return (
      <AuthPage 
        onLoginSuccess={(newEmail, newUser) => {
          setEmail(newEmail);
          setUsername(newUser);
          setIsLoggedIn(true);
        }} 
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#F9FAFB] dark:bg-slate-950 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden transition-colors duration-200">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#1e40af 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

      <Header 
        headerNav={headerNav}
        activeHeaderNav={activeHeaderNav}
        setActiveHeaderNav={(name) => {
          if (name === "Сигналы" || name === "Сканер") handleActiveTabChange("Сканер");
          if (name === "Аккаунт") handleActiveTabChange("Профиль");
          if (name === "Уведомления") handleActiveTabChange("Уведомления");
          if (name === "Баланс") handleActiveTabChange("Баланс");
          if (name === "FAQ") handleActiveTabChange("FAQ");
        }}
        username={username}
        email={email}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onLogout={() => {
          setIsLoggedIn(false);
          showToast("Вы успешно вышли из учетной записи", "info");
        }}
        theme={theme}
        onChangeTheme={handleThemeChange}
        notifications={notifications}
        setNotifications={setNotifications}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Overlay (Mobile) */}
        <AnimatePresence>
          {isSidebarOpen && activeTab !== "FAQ" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden backdrop-blur-sm"
            />
          )}
        </AnimatePresence>

        {activeTab !== "FAQ" && (
          <Sidebar 
            isSidebarOpen={isSidebarOpen}
            navItems={navItems}
            activeTab={activeTab}
            setActiveTab={handleActiveTabChange}
            setIsSidebarOpen={setIsSidebarOpen}
            isScannerTab={activeTab === "Сканер"}
            isScannerRunning={isScannerRunning}
            setIsScannerRunning={setIsScannerRunning}
            scannerSubView={scannerSubView}
            setScannerSubView={setScannerSubView}
            notifications={notifications}
            activeGroupFilter={activeGroupFilter}
            setActiveGroupFilter={setActiveGroupFilter}
            isSettingsMode={isSettingsMode}
            setIsSettingsMode={setIsSettingsMode}
            selectedExchangeFilter={selectedExchangeFilter}
            setSelectedExchangeFilter={setSelectedExchangeFilter}
            balanceSubView={balanceSubView}
            setBalanceSubView={setBalanceSubView}
            runningArbitrages={runningArbitrages}
            setRunningArbitrages={setRunningArbitrages}
            onSelectRunningArbitrage={(arb) => {
              if (arb) {
                setSelectedSignal(arb.signal);
                if (activeTab !== "Сканер") {
                  handleActiveTabChange("Сканер");
                }
              }
            }}
          />
        )}

        {/* Main Content Area */}
        <main id="main-content" className="flex-1 overflow-y-auto relative z-10 flex flex-col">
          <div className="flex-1 flex flex-col relative">
            {/* Top progress indicator bar */}
            <AnimatePresence>
              {isLoadingPage && (
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                  className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600 absolute top-0 left-0 right-0 z-50 shadow-[0_1px_5px_rgba(59,130,246,0.3)]"
                />
              )}
            </AnimatePresence>

            {/* Dynamic visual page loading screen */}
            <AnimatePresence>
              {isLoadingPage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#F9FAFB]/90 dark:bg-[#070c17]/90 backdrop-blur-xs min-h-[400px]"
                >
                  <div className="flex flex-col items-center space-y-5">
                    {/* Pulsating dual-orbit loading animation using SVG */}
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      {/* Outer track */}
                      <svg className="absolute w-14 h-14" viewBox="0 0 50 50">
                        <circle
                          cx="25"
                          cy="25"
                          r="22"
                          fill="none"
                          strokeWidth="2.5"
                          className="stroke-slate-200 dark:stroke-slate-800/80"
                        />
                      </svg>
                      {/* Outer spinning arc */}
                      <svg className="absolute w-14 h-14 animate-spin" viewBox="0 0 50 50">
                        <circle
                          cx="25"
                          cy="25"
                          r="22"
                          fill="none"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          className="stroke-blue-500 dark:stroke-blue-400"
                          strokeDasharray="40 100"
                        />
                      </svg>
                      {/* Inner reverse-spinning arc */}
                      <svg className="absolute w-10 h-10 animate-spin" viewBox="0 0 50 50" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}>
                        <circle
                          cx="25"
                          cy="25"
                          r="22"
                          fill="none"
                          strokeWidth="4.5"
                          strokeLinecap="round"
                          className="stroke-blue-400 dark:stroke-blue-500"
                          strokeDasharray="30 100"
                        />
                      </svg>
                    </div>

                    <div className="space-y-1.5 text-center">
                      <h3 className="text-[9px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest leading-none">
                        ПОДКЛЮЧЕНИЕ К СЕТИ
                      </h3>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200 tracking-tight font-sans">
                        {loadingText || "Синхронизация данных..."}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {activeTab === "Сканер" ? (
                detailedSignal ? (
                  <DetailedSignalAnalysis 
                    key="detailed-analysis"
                    signal={detailedSignal}
                    onClose={() => setDetailedSignal(null)}
                    runningArbitrages={runningArbitrages}
                    setRunningArbitrages={setRunningArbitrages}
                  />
                ) : (
                  <ScannerPage 
                    key="scanner" 
                    onSelectSignal={setSelectedSignal} 
                    onShowDetailedAnalysis={setDetailedSignal}
                    isScannerRunning={isScannerRunning} 
                    setIsScannerRunning={setIsScannerRunning} 
                    runningArbitrages={runningArbitrages}
                    scannerSubView={scannerSubView}
                  />
                )
              ) : activeTab === "Безопасность" ? (
                <SecurityPage key="security" />
              ) : activeTab === "API-ключи" ? (
                <ApiKeyPage key="api-keys" />
              ) : activeTab === "Подписка" ? (
                <SubscriptionPage key="subscription" />
              ) : activeTab === "Уведомления" ? (
                <NotificationsPage 
                  key="notifications" 
                  notifications={notifications}
                  setNotifications={setNotifications}
                  activeGroupFilter={activeGroupFilter}
                  setActiveGroupFilter={setActiveGroupFilter}
                  isSettingsMode={isSettingsMode}
                  setIsSettingsMode={setIsSettingsMode}
                  onGoToSignal={handleGoToSignal}
                />
              ) : activeTab === "Баланс" ? (
                <BalancePage 
                  selectedExchangeFilter={selectedExchangeFilter} 
                  balanceSubView={balanceSubView} 
                />
              ) : activeTab === "FAQ" ? (
                <FaqPage key="faq" />
              ) : (
                <AccountPage 
                  key="account"
                  username={username}
                  setUsername={setUsername}
                  email={email}
                  setEmail={setEmail}
                  phone={phone}
                  setPhone={setPhone}
                  isSaving={isSaving}
                  handleSave={handleSave}
                />
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Signal Drawer Overlay */}
        <AnimatePresence>
          {selectedSignal && (
            <SignalDrawer 
              signal={selectedSignal} 
              onClose={() => setSelectedSignal(null)} 
              runningArbitrages={runningArbitrages}
              setRunningArbitrages={setRunningArbitrages}
              onShowFullAnalysis={setDetailedSignal}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden h-16 flex-shrink-0 bg-white border-t border-slate-200/80 flex items-center justify-around px-2 relative z-30 pb-safe shadow-lg select-none">
        {headerNav.map((nav) => {
          const isActive = activeHeaderNav === nav.name;
          return (
            <button
              key={nav.name}
              onClick={() => {
                if (nav.name === "Сигналы" || nav.name === "Сканер") handleActiveTabChange("Сканер");
                if (nav.name === "Аккаунт") handleActiveTabChange("Профиль");
                if (nav.name === "Уведомления") handleActiveTabChange("Уведомления");
                if (nav.name === "Баланс") handleActiveTabChange("Баланс");
                if (nav.name === "FAQ") handleActiveTabChange("FAQ");
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
                isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-700"
              }`}
            >
              <div className={`p-1 transition-transform duration-200 ${isActive ? "scale-110 text-blue-600" : "text-slate-400 font-bold"}`}>
                {React.cloneElement(nav.icon as React.ReactElement, { size: 18 })}
              </div>
              <span className={`text-[8.5px] font-black tracking-tight uppercase mt-0.5 leading-none transition-colors duration-200 ${
                isActive ? "text-blue-600" : "text-slate-400"
              }`}>{nav.name === "Аккаунт" ? "Аккаунт" : nav.name}</span>
              {isActive && (
                <motion.div 
                  layoutId="active-dot-mobile"
                  className="absolute bottom-1 w-1 h-1 bg-blue-600 rounded-full"
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
