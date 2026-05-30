import React, { useState, useEffect, useRef } from "react";
import { 
  Bell, 
  Trash2, 
  CheckCheck,
  RefreshCw, 
  SlidersHorizontal, 
  ChevronDown, 
  ChevronUp, 
  Trash, 
  Sliders, 
  Settings, 
  AlertCircle, 
  Check, 
  X, 
  ToggleLeft, 
  ToggleRight, 
  Volume2, 
  VolumeX, 
  ArrowUpRight, 
  Info,
  Calendar,
  Send,
  Sparkles,
  Inbox,
  Columns2,
  Rows3,
  Copy,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { containerVariants, itemVariants, NotificationItem } from "../types";
import { useToast } from "../components/Toast";

// Initial Mock Data reflecting the provided screenshot and extra entries
export const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    time: "08:03",
    status: "прочитано",
    title: "Сигнал BER/USDT готов к проверке",
    subtitle: "Сигналы • Spread +0.44% • HTX → Bitget",
    source: "Scanner → HTX → Bitget",
    value: "+0.44%",
    valueColor: "green",
    priority: "NEW",
    channel: "WEB",
    group: "Сигналы",
    colorIndicator: "bg-emerald-500",
    detailedText: "Сканер нашел рабочий маршрут BER/USDT: покупка на HTX и продажа на Bitget. Спред держится выше минимального порога, доступная ликвидность подходит для тестовой сделки. Перед запуском проверьте стакан, комиссии и доступность вывода BER на стороне биржи покупки.",
    parameters: [
      { name: "Группа", value: "Сигналы", tagStyle: "bg-emerald-50 text-emerald-700 border-emerald-100" },
      { name: "Источник", value: "Scanner", tagStyle: "bg-slate-100 text-slate-700" },
      { name: "Маршрут", value: "HTX → Bitget", tagStyle: "bg-indigo-50 text-indigo-700 font-mono" },
      { name: "Значение", value: "+0.44%", tagStyle: "text-emerald-600 font-black" }
    ]
  },
  {
    id: "notif-2",
    time: "12:36",
    status: "новое",
    title: "Арбитраж по ETHW требует внимания",
    subtitle: "Арбитраж • отрицательный спред • MEXC ниже покупки",
    source: "Execution → MEXC → Gate",
    value: "-1.22%",
    valueColor: "red",
    priority: "NEW",
    channel: "WEB",
    group: "Арбитраж",
    colorIndicator: "bg-amber-500",
    detailedText: "Обнаружено расхождение цен на монету ETHW. Текущий спред находится в отрицательной зоне (-1.22%). Рекомендуется приостановить автоматические ордера по паре на MEXC во избежание убыточных транзакций, пока баланс ликвидности не стабилизируется.",
    parameters: [
      { name: "Группа", value: "Арбитраж", tagStyle: "bg-amber-50 text-amber-700 border-amber-100" },
      { name: "Источник", value: "Execution", tagStyle: "bg-slate-100 text-slate-700" },
      { name: "Маршрут", value: "MEXC → Gate", tagStyle: "bg-indigo-50 text-indigo-700 font-mono" },
      { name: "Значение", value: "-1.22%", tagStyle: "text-rose-600 font-black" }
    ]
  },
  {
    id: "notif-3",
    time: "12:24",
    status: "новое",
    title: "Проверка баланса пройдена",
    subtitle: "События исполнения • 11.72 USDT доступно",
    source: "Balance check → Gate wallet",
    value: "11.72 USDT",
    valueColor: "green",
    priority: "NEW",
    channel: "WEB",
    group: "События исполнения",
    colorIndicator: "bg-blue-500",
    detailedText: "Периодическая проверка кошелька на бирже Gate завершена успешно. Обнаружены доступные средства в размере 11.72 USDT. Средства свободны для покрытия транзакционных комиссий и полностью зарезервированы под новые ордера.",
    parameters: [
      { name: "Группа", value: "События исполнения", tagStyle: "bg-blue-50 text-blue-700 border-blue-100" },
      { name: "Источник", value: "Balance check", tagStyle: "bg-slate-100 text-slate-700" },
      { name: "Маршрут", value: "Gate wallet", tagStyle: "bg-indigo-50 text-indigo-700 font-mono" },
      { name: "Значение", value: "11.72 USDT", tagStyle: "text-emerald-600 font-black" }
    ]
  },
  {
    id: "notif-4",
    time: "12:20",
    status: "прочитано",
    title: "Обновлены системные параметры",
    subtitle: "Система • настройки уведомлений сохранены",
    source: "Profile → Web + Telegram",
    value: "SAVED",
    valueColor: "purple",
    priority: "СИСТЕМА",
    channel: "WEB",
    group: "Система",
    colorIndicator: "bg-slate-400",
    detailedText: "Пользователь успешно обновил профиль оповещений. Добавлены новые правила фильтрации по минимальному спреду (+0.15%), активирован Telegram-бот для мгновенной доставки критических событий выполнения.",
    parameters: [
      { name: "Группа", value: "Система", tagStyle: "bg-purple-50 text-purple-700 border-purple-100" },
      { name: "Источник", value: "Profile", tagStyle: "bg-slate-100 text-slate-700" },
      { name: "Маршрут", value: "Web + Telegram", tagStyle: "bg-indigo-50 text-indigo-700 font-mono" },
      { name: "Значение", value: "SAVED", tagStyle: "text-purple-600 font-black" }
    ]
  }
];

interface NotificationsPageProps {
  key?: string;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  activeGroupFilter: string;
  setActiveGroupFilter: (group: string) => void;
  isSettingsMode: boolean;
  setIsSettingsMode: (mode: boolean) => void;
  onGoToSignal?: (pairName: string) => void;
}

export function NotificationsPage({
  notifications,
  setNotifications,
  activeGroupFilter,
  setActiveGroupFilter,
  isSettingsMode,
  setIsSettingsMode,
  onGoToSignal
}: NotificationsPageProps) {
  const { showToast } = useToast();
  const [activeTabFilter, setActiveTabFilter] = useState<string>("Все");
  const [expandedId, setExpandedId] = useState<string | null>("notif-1");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "split">("list");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Keep track of the last known list of filtered IDs to trace the correct "next" element
  const prevFilteredIdsRef = useRef<string[]>([]);

  useEffect(() => {
    const currentIds = filteredNotifications.map(n => n.id);
    const prevIds = prevFilteredIdsRef.current;
    
    if (currentIds.length > 0) {
      if (!expandedId || !currentIds.includes(expandedId)) {
        // Find if the previously selected ID was in the previous list
        let nextId: string | null = null;
        if (expandedId && prevIds.includes(expandedId)) {
          const prevIdx = prevIds.indexOf(expandedId);
          // Try to select the item at the same index in the new list
          if (prevIdx < currentIds.length) {
            nextId = currentIds[prevIdx];
          } else {
            nextId = currentIds[currentIds.length - 1];
          }
        } else {
          // Default to the first one in the list
          nextId = currentIds[0];
        }
        setExpandedId(nextId);
      }
    } else {
      setExpandedId(null);
    }
    
    prevFilteredIdsRef.current = currentIds;
  }, [notifications, activeTabFilter, activeGroupFilter, expandedId]);

  // Automatically select view mode: split (Компакт-панель) on desktop, list (В строке) on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setViewMode("split");
      } else {
        setViewMode("list");
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Settings specific state
  const [telegramEnabled, setTelegramEnabled] = useState(true);
  const [telegramUser, setTelegramUser] = useState("@arbitrizor_bot_user");
  const [webPushEnabled, setWebPushEnabled] = useState(true);
  const [emailDigestEnabled, setEmailDigestEnabled] = useState(false);
  const [soundAlerts, setSoundAlerts] = useState(false);
  const [criticalThreshold, setCriticalThreshold] = useState("0.15");
  const [isConnectingTg, setIsConnectingTg] = useState(false);
  const [tgSuccessConnected, setTgSuccessConnected] = useState(false);

  // Group Rules Specific States (matching screenshot)
  const [signalsRule, setSignalsRule] = useState<"ON" | "OFF">("ON");
  const [arbitrageRule, setArbitrageRule] = useState<"ON" | "OFF">("ON");
  const [executionRule, setExecutionRule] = useState<"HIGH" | "MEDIUM" | "LOW" | "OFF">("HIGH");
  const [systemRule, setSystemRule] = useState<"INFO" | "WARN" | "ERROR" | "OFF">("INFO");

  const handleResetSettings = () => {
    setTelegramEnabled(true);
    setWebPushEnabled(true);
    setEmailDigestEnabled(false);
    setSignalsRule("ON");
    setArbitrageRule("ON");
    setExecutionRule("HIGH");
    setSystemRule("INFO");
    setCriticalThreshold("0.15");
    setSoundAlerts(false);
    showToast("Настройки уведомлений сброшены до стандартных значений", "info");
  };

  const handleSaveSettings = () => {
    const confirmNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      time: new Date().toLocaleTimeString("ru-RU", { hour: "numeric", minute: "2-digit" }),
      status: "новое",
      title: "Настройки уведомлений сохранены",
      subtitle: "Система • Сохранены правила групп и каналы доставки",
      source: "Profile → Web app",
      value: "SAVED",
      valueColor: "purple",
      priority: "СИСТЕМА",
      channel: "WEB",
      group: "Система",
      colorIndicator: "bg-slate-400",
      detailedText: `Параметры уведомлений успешно сохранены под текущие требования: Web PUSH: ${webPushEnabled ? "Вкл" : "Выкл"}, Telegram: ${telegramEnabled ? "Вкл" : "Выкл"}, Email digest: ${emailDigestEnabled ? "Вкл" : "Выкл"}. Правила групп уведомлений: Сигналы: ${signalsRule}, Арбитраж: ${arbitrageRule}, События исполнения: ${executionRule}, Система: ${systemRule}.`,
      parameters: [
        { name: "Web push", value: webPushEnabled ? "Вкл" : "Выкл", tagStyle: "bg-emerald-50 text-emerald-700 border-emerald-200" },
        { name: "Telegram", value: telegramEnabled ? "Вкл" : "Выкл", tagStyle: "bg-blue-50 text-blue-700 border-blue-200" },
        { name: "Email digest", value: emailDigestEnabled ? "Вкл" : "Выкл", tagStyle: "bg-slate-50 text-slate-700 border-slate-200" }
      ]
    };
    setNotifications(prev => [confirmNotif, ...prev]);
    setIsSettingsMode(false);
    setExpandedId(confirmNotif.id);
    showToast("Настройки успешно сохранены", "success");
  };


  // Stats calculation
  const totalCount = notifications.length;
  const newCount = notifications.filter(n => n.status === "новое").length;
  const importantCount = notifications.filter(n => n.group === "Арбитраж" || n.group === "Сигналы").length;
  const uniqueGroups = new Set(notifications.map(n => n.group)).size;
  const toCheckCount = notifications.filter(n => n.status === "новое" && (n.group === "Сигналы" || n.group === "Арбитраж")).length;

  // Filter notifications based on filters selected
  const filteredNotifications = notifications.filter(n => {
    // Left group filter
    if (activeGroupFilter !== "Все" && n.group !== activeGroupFilter) return false;

    // Top horizontal tabs filter
    if (activeTabFilter === "Новые") return n.status === "новое";
    if (activeTabFilter === "Важные") return n.group === "Арбитраж" || n.group === "Сигналы";
    if (activeTabFilter === "Сегодня") return n.time.startsWith("12") || n.time.startsWith("08"); // mock active check
    if (activeTabFilter === "История") return n.status === "прочитано";

    return true;
  });

  // Actions
  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent expanding when clicking checkbox
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map(n => n.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    setNotifications(prev => prev.filter(n => !selectedIds.includes(n.id)));
    setSelectedIds([]);
    showToast(`Успешно удалено уведомлений: ${count}`, "success");
  };

  const handleClearSingle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    setSelectedIds(prev => prev.filter(item => item !== id));
    if (expandedId === id) setExpandedId(null);
    showToast("Уведомление удалено", "info");
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, status: "прочитано" })));
    showToast("Все уведомления отмечены как прочитанные", "success");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // Simulate adding a new critical alert to list
      const newAlert: NotificationItem = {
        id: `notif-${Date.now()}`,
        time: "14:15",
        status: "новое",
        title: "Критический спред SOL/USDT готов!",
        subtitle: "Сигналы • Спред +0.95% • Bybit → Gate",
        source: "Scanner → Bybit → Gate",
        value: "+0.95%",
        valueColor: "green",
        priority: "NEW",
        channel: "WEB",
        group: "Сигналы",
        colorIndicator: "bg-emerald-500",
        detailedText: "Высокодоходный межбиржевой сигнал по направлению SOL/USDT. Покупка доступна на Bybit по цене $168.20, продажа на Gate по $169.80. Стакан на Gate имеет достаточную плотность (более $20,000 ликвидности в первом проценте). Настоятельно рекомендуется проверка комиссий на вывод.",
        parameters: [
          { name: "Группа", value: "Сигналы", tagStyle: "bg-emerald-50 text-emerald-700 border-emerald-100" },
          { name: "Источник", value: "Scanner", tagStyle: "bg-slate-100 text-slate-700" },
          { name: "Маршрут", value: "Bybit → Gate", tagStyle: "bg-indigo-50 text-indigo-700 font-mono" },
          { name: "Значение", value: "+0.95%", tagStyle: "text-emerald-600 font-black" }
        ]
      };
      setNotifications(prev => [newAlert, ...prev]);
      setExpandedId(newAlert.id);
      showToast("Синхронизация завершена. Поступил новый межбиржевой сигнал!", "success", "Обновление");
    }, 1200);
  };

  const handleToggleReadStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(n => {
      if (n.id === id) {
        const nextStatus = n.status === "новое" ? "прочитано" : "новое";
        showToast(`Уведомление отмечено как ${nextStatus === "новое" ? "новое" : "прочитанное"}`, "info");
        return { ...n, status: nextStatus };
      }
      return n;
    }));
  };

  const handleConnectTelegram = () => {
    setIsConnectingTg(true);
    setTimeout(() => {
      setIsConnectingTg(false);
      setTgSuccessConnected(true);
      setTelegramEnabled(true);
      showToast("Telegram аккаунт успешно привязан к системе", "success", "Аккаунт");
      setTimeout(() => setTgSuccessConnected(false), 3000);
    }, 1500);
  };


  // Left menus definitions
  const groupMenus = [
    { name: "Все", count: notifications.length },
    { name: "Сигналы", count: notifications.filter(n => n.group === "Сигналы").length },
    { name: "Арбитраж", count: notifications.filter(n => n.group === "Арбитраж").length },
    { name: "События исполнения", count: notifications.filter(n => n.group === "События исполнения").length },
    { name: "Система", count: notifications.filter(n => n.group === "Система").length },
  ];

  return (
    <div className="flex-1 w-full max-w-[1700px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6" id="notifications-container">
      {/* Top Page Title & Integration Badges Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
              <Bell size={20} className={isSettingsMode ? "" : "animate-pulse"} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                {isSettingsMode ? "Настройки" : "Уведомления"}
              </h1>
              <p className="text-xs font-bold text-slate-400 mt-0.5">
                {isSettingsMode 
                  ? "Каналы доставки и правила групп уведомлений." 
                  : "Системный журнал событий безопасности, арбитражных связок и выполнения процессов."}
              </p>
            </div>
          </div>
        </div>

        {isSettingsMode ? (
          <div className="flex items-center gap-2.5 select-none shrink-0">
            <button
              onClick={handleResetSettings}
              className="px-5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 hover:bg-slate-50 text-xs font-extrabold rounded-xl transition-all active:scale-98 cursor-pointer shadow-sm"
            >
              Сбросить
            </button>
            <button
              onClick={handleSaveSettings}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition-all active:scale-98 cursor-pointer shadow-md shadow-blue-100"
            >
              Сохранить
            </button>
          </div>
        ) : (
          /* Integration indicators (styled elegantly like the dashboard header in screenshots) */
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2 hover:bg-slate-100/50 transition-colors flex items-center gap-2">
              <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest block leading-none">НОВЫЕ</span>
              <span className="text-xs font-black text-blue-600 leading-none">{newCount}</span>
            </div>
            <button 
              onClick={() => {
                setIsSettingsMode(true);
              }}
              className={`border border-slate-200/60 rounded-xl px-4 py-2 hover:bg-slate-100 transition-colors flex items-center gap-2 text-left cursor-pointer ${
                telegramEnabled ? "bg-[#eaf5ff] border-[#bce2ff]" : "bg-slate-50 border-slate-200"
              }`}
            >
              <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest block leading-none">TELEGRAM</span>
              <span className={`text-[10px] font-black uppercase leading-none ${telegramEnabled ? "text-blue-600" : "text-slate-400"}`}>
                {telegramEnabled ? "Вкл" : "Выкл"}
              </span>
            </button>
            <button 
              onClick={() => setWebPushEnabled(!webPushEnabled)}
              className={`border border-slate-200/60 rounded-xl px-4 py-2 hover:bg-slate-100 transition-colors flex items-center gap-2 text-left cursor-pointer ${
                webPushEnabled ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"
              }`}
            >
              <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest block leading-none">WEB PUSH</span>
              <span className={`text-[10px] font-black uppercase leading-none ${webPushEnabled ? "text-emerald-600" : "text-slate-400"}`}>
                {webPushEnabled ? "Вкл" : "Выкл"}
              </span>
            </button>
            <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-2 hover:bg-rose-100/50 transition-colors flex items-center gap-2">
              <span className="text-[7.5px] font-black text-rose-400 uppercase tracking-widest block leading-none">КРИТИЧНЫЕ</span>
              <span className="text-xs font-black text-rose-600 leading-none">{importantCount}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Area: Entire list section is now taking full width as the group filters are moved to global Sidebar */}
      <div className="w-full flex flex-col">
          
          <AnimatePresence mode="wait">
            {!isSettingsMode ? (
              /* PANEL A: Notification Interactive List */
              <motion.div
                key="list-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-4 w-full"
              >
                {/* 2. List Control Toolbar (Filters tabs and buttons) */}
                <div className="bg-white border border-slate-200/60 rounded-2xl p-3 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                  {/* Category tabs */}
                  <div className="flex flex-wrap items-center gap-1.5" id="notification-tabs">
                    {["Все", "Новые", "Важные", "Сегодня", "История"].map((tab) => {
                      const isActive = activeTabFilter === tab;
                      return (
                        <button
                          key={tab}
                          onClick={() => setActiveTabFilter(tab)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all select-none cursor-pointer ${
                            isActive
                              ? "bg-slate-100/80 text-slate-900 border border-slate-200/50 shadow-2xs font-extrabold"
                              : "text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-transparent"
                          }`}
                        >
                          {tab}
                        </button>
                      );
                    })}

                    <span className="hidden md:inline-block w-px h-5.5 bg-slate-200/80 mx-2" />

                    {/* View mode buttons */}
                    <div className="flex items-center bg-slate-50 border border-slate-200/60 p-0.5 rounded-lg select-none">
                      <button
                        onClick={() => {
                          setViewMode("list");
                        }}
                        className={`px-2.5 py-1 rounded-[6px] text-[10px] font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                          viewMode === "list"
                            ? "bg-white text-slate-800 border border-slate-200/40 shadow-3xs"
                            : "text-slate-400 hover:text-slate-600 border border-transparent"
                        }`}
                        title="Классическая таблица с раскрытием строк"
                      >
                        <Rows3 size={11.5} />
                        <span className="hidden sm:inline">В строке</span>
                      </button>
                      <button
                        onClick={() => {
                          setViewMode("split");
                          if (!expandedId && filteredNotifications.length > 0) {
                            setExpandedId(filteredNotifications[0].id);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-[6px] text-[10px] font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                          viewMode === "split"
                            ? "bg-white text-blue-600 border border-slate-200/40 shadow-3xs font-extrabold"
                            : "text-slate-400 hover:text-slate-600 border border-transparent"
                        }`}
                        title="Компактные карточки слева + боковая панель справа"
                      >
                        <Inbox size={11.5} />
                        <span className="hidden sm:inline">Компакт-панель</span>
                      </button>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center justify-end gap-2 shrink-0">
                    <button
                      onClick={handleSelectAll}
                      disabled={filteredNotifications.length === 0}
                      className="py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 hover:text-slate-800 disabled:opacity-50 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all select-none cursor-pointer active:scale-97"
                    >
                      {selectedIds.length === filteredNotifications.length && filteredNotifications.length > 0
                        ? "Снять выделение"
                        : "Выделить все"
                      }
                    </button>
                    
                    {selectedIds.length > 0 && (
                      <button
                        onClick={handleDeleteSelected}
                        className="py-2 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer active:scale-97"
                      >
                        <Trash2 size={11} />
                        Удалить ({selectedIds.length})
                      </button>
                    )}

                    <span className="h-6 w-px bg-slate-200 mx-1 hidden sm:inline-block" />

                    <button
                      onClick={handleMarkAllAsRead}
                      title="Прочитать все уведомления"
                      className="py-2 px-3.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-600 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all select-none cursor-pointer active:scale-97"
                    >
                      <CheckCheck size={11} />
                      Прочитать все
                    </button>

                    <button
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className={`p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl transition-all select-none cursor-pointer active:scale-92 ${
                        isRefreshing ? "cursor-wait" : ""
                      }`}
                      title="Обновить"
                    >
                      <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />
                    </button>
                  </div>
                </div>

                {viewMode === "list" ? (
                  /* 3. The Interactive Data Grid */
                  <div className="bg-white border border-slate-200/60 rounded-[24px] overflow-hidden shadow-sm">
                    {/* Column headers (Desktop) */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50/50 text-[9.5px] font-black uppercase tracking-widest text-slate-400">
                      <div className="col-span-1 flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.length === filteredNotifications.length && filteredNotifications.length > 0}
                          onChange={handleSelectAll}
                          className="w-3.5 h-3.5 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500 cursor-pointer accent-blue-600"
                          title="Выбрать все"
                        />
                        <span>ВРЕМЯ</span>
                      </div>
                      <div className="col-span-4">УВЕДОМЛЕНИЕ</div>
                      <div className="col-span-3 text-center">ИСТОЧНИК</div>
                      <div className="col-span-1.5 text-right">ЗНАЧЕНИЕ</div>
                      <div className="col-span-1 text-center">ПРИОРИТЕТ</div>
                      <div className="col-span-0.5 text-center">КАНАЛ</div>
                      <div className="col-span-1 text-right">ГРУППА</div>
                    </div>

                    {/* Notification items container */}
                    <div className="divide-y divide-slate-100">
                      <AnimatePresence initial={false}>
                        {filteredNotifications.length === 0 ? (
                          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100">
                              <Inbox size={22} />
                            </div>
                            <div>
                              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">Новых уведомлений нет</h3>
                              <p className="text-[11px] font-bold text-slate-400 mt-1 max-w-sm">
                                Вы просмотрели или удалили все уведомления в выбранной категории. Измените фильтры или нажмите кнопку обновить.
                              </p>
                            </div>
                          </div>
                        ) : (
                          filteredNotifications.map((n) => {
                            const isExpanded = expandedId === n.id;
                            const isSelected = selectedIds.includes(n.id);
                            const isUnread = n.status === "новое";

                            const isSystem = n.group === "Система";
                            const isSignal = n.group === "Сигналы";
                            const isArbitrage = n.group === "Арбитраж";
                            const isExecEvent = n.group === "События исполнения";

                            return (
                              <motion.div
                                key={n.id}
                                initial={{ opacity: 0, height: "auto" }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`transition-all duration-200 flex flex-col relative w-full border-b border-slate-100 last:border-b-0 ${
                                  isSystem 
                                    ? (isUnread ? "bg-slate-50 border-l-4 border-l-slate-400" : "bg-white border-l-4 border-l-slate-200/40")
                                    : (isUnread ? "bg-blue-50/15 border-l-4 border-l-blue-500" : "bg-white border-l-4 border-l-slate-100")
                                } ${isExpanded ? "bg-slate-50/30" : ""}`}
                              >
                                {/* Row Summary header block */}
                                <div 
                                  onClick={() => handleToggleExpand(n.id)}
                                  className={`cursor-pointer hover:bg-slate-50/50 p-4 md:px-6 md:py-4.5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center select-none ${
                                    isExpanded ? "border-b border-dashed border-slate-100" : ""
                                  }`}
                                >
                                  {/* Left Time/Checkbox column */}
                                  <div className="col-span-1 flex items-center gap-3">
                                    <input 
                                      type="checkbox" 
                                      checked={isSelected}
                                      onChange={(e) => handleSelectRow(n.id, e as any)}
                                      onClick={(e) => e.stopPropagation()}
                                      className="w-3.5 h-3.5 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500 cursor-pointer shrink-0 accent-blue-600"
                                    />
                                    <div className="flex flex-col">
                                      <span className="font-mono text-[11px] font-black text-slate-800 tracking-tight">{n.time}</span>
                                      <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider leading-none mt-0.5">
                                        {n.status}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Title/Subtitle column */}
                                  <div className="col-span-4 space-y-1.5 min-w-0 pr-2">
                                    <div className="flex items-center gap-2">
                                      {isSystem ? (
                                        <div className="p-1 rounded bg-slate-100 border border-slate-200 text-slate-500 shrink-0 select-none">
                                          <Settings size={12} className="stroke-[2.5]" />
                                        </div>
                                      ) : isExecEvent ? (
                                        <div className="p-1 rounded bg-blue-500/10 border border-blue-200 text-blue-600 shrink-0 select-none">
                                          <Info size={12} className="stroke-[2.5]" />
                                        </div>
                                      ) : isSignal ? (
                                        <div className="p-1 rounded bg-emerald-500/10 border border-emerald-250 text-emerald-600 shrink-0 relative select-none">
                                          <Zap size={12} className="stroke-[2.5]" />
                                          {isUnread && (
                                            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                          )}
                                        </div>
                                      ) : (
                                        <div className="p-1 rounded bg-amber-500/10 border border-amber-200 text-amber-600 shrink-0 select-none">
                                          <AlertCircle size={12} className="stroke-[2.5]" />
                                        </div>
                                      )}
                                      <h3 className="text-xs font-black text-slate-800 tracking-tight truncate leading-none">
                                        {n.title}
                                      </h3>
                                    </div>
                                    <p className="text-[10px] font-semibold text-slate-400 truncate tracking-tight pl-7">
                                      {n.subtitle}
                                    </p>
                                  </div>

                                  {/* Source Column */}
                                  <div className="col-span-3 text-left md:text-center text-[10.5px] font-bold text-slate-500 flex items-center justify-start md:justify-center gap-1.5 font-mono">
                                    <span className="text-[9px] font-black text-slate-300 uppercase md:hidden tracking-wider">источник:</span>
                                    <span>{n.source}</span>
                                  </div>

                                  {/* Value Column */}
                                  <div className="col-span-1.5 text-left md:text-right font-black font-mono text-xs">
                                    <span className="text-[9px] font-black text-slate-300 uppercase md:hidden tracking-wider mr-1.5">значение:</span>
                                    <span className={
                                      n.valueColor === "green" 
                                        ? "text-emerald-500" 
                                        : n.valueColor === "red" 
                                        ? "text-rose-500" 
                                        : n.valueColor === "purple" 
                                        ? "text-purple-500 font-bold" 
                                        : "text-blue-500"
                                    }>
                                      {n.value}
                                    </span>
                                  </div>

                                  {/* Priority Badge */}
                                  <div className="col-span-1 text-left md:text-center shrink-0">
                                    <span className="text-[9px] font-black text-slate-300 uppercase md:hidden tracking-wider mr-1.5">приоритет:</span>
                                    <span className={`text-[9px] font-black uppercase rounded-sm px-1.5 py-0.5 ${
                                      n.priority === "NEW" 
                                        ? "bg-amber-50 text-amber-600 border border-amber-200" 
                                        : "bg-purple-50 text-purple-600 border border-purple-200"
                                    }`}>
                                      {n.priority}
                                    </span>
                                  </div>

                                  {/* Channel Column */}
                                  <div className="col-span-0.5 text-left md:text-center text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
                                    <span className="text-[9px] font-black text-slate-300 uppercase md:hidden tracking-wider mr-1.5">канал:</span>
                                    <span>{n.channel}</span>
                                  </div>

                                  {/* Group Badge & Quick Actions */}
                                  <div className="col-span-1 flex items-center justify-between md:justify-end gap-3 shrink-0">
                                    <div className="md:text-right">
                                      <span className="text-[9px] font-black text-slate-300 uppercase md:hidden tracking-wider mr-1.5">группа: </span>
                                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-[6px] border ${
                                        n.group === "Сигналы"
                                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                          : n.group === "Арбитраж"
                                          ? "bg-amber-50 text-amber-600 border-amber-100"
                                          : n.group === "События исполнения"
                                          ? "bg-blue-50 text-blue-600 border-blue-100"
                                          : "bg-slate-50 text-slate-600 border-slate-200"
                                      }`}>
                                        {n.group}
                                      </span>
                                    </div>

                                    {/* Inline item clear buttons */}
                                    <div className="flex items-center gap-1 shrink-0">
                                      <button 
                                        onClick={(e) => handleToggleReadStatus(n.id, e)}
                                        title={isUnread ? "Пометить как прочитанное" : "Пометить как непрочитанное"}
                                        className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-all hidden md:block cursor-pointer active:scale-90"
                                      >
                                        <Check size={11} className={!isUnread ? "text-emerald-500 stroke-[3]" : ""} />
                                      </button>
                                      <button 
                                        onClick={(e) => handleClearSingle(n.id, e)}
                                        title="Удалить уведомление"
                                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all cursor-pointer active:scale-90"
                                      >
                                        <X size={11} />
                                      </button>
                                      <span className="text-slate-400 md:hidden p-0.5">
                                        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Beautiful Expanded details panel (collapses/expands using Framer Motion) */}
                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2, ease: "easeInOut" }}
                                      className="overflow-hidden bg-slate-50/50 border-t border-slate-100"
                                    >
                                      <div className="p-5 md:p-6.5 grid grid-cols-1 md:grid-cols-12 gap-6 w-full text-xs">
                                        {/* Left block: Detailed summary information */}
                                        <div className="md:col-span-8 space-y-3.5">
                                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/50 pb-1.5 flex items-center gap-1">
                                            <Info size={11} className="text-slate-400" />
                                            подробный текст уведомления
                                          </h4>
                                          <p className="text-[11.5px] font-bold text-slate-500 leading-relaxed font-sans max-w-2xl bg-white border border-slate-100/80 p-4 rounded-xl shadow-2xs">
                                            {n.detailedText}
                                          </p>
                                          {isSignal && onGoToSignal && (
                                            <button
                                              onClick={() => onGoToSignal(n.title)}
                                              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 bg-blue-50/40 hover:bg-blue-50 text-blue-600 hover:text-blue-700 rounded-lg text-[10.5px] font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-2xs hover:shadow-xs"
                                            >
                                              Открыть сигнал
                                              <ArrowUpRight size={12} strokeWidth={2.5} />
                                            </button>
                                          )}
                                        </div>

                                        {/* Right block: Extra params metrics */}
                                        <div className="md:col-span-4 flex flex-col justify-between p-5 bg-white border border-slate-200/60 rounded-2xl shadow-2xs">
                                          <div className="space-y-4 w-full">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                                              ПАРАМЕТРЫ
                                            </h4>
                                            <div className="space-y-3 text-xs">
                                              {n.parameters.map((p, pIndex) => {
                                                const hasExplicitBorder = p.tagStyle?.includes("border-");
                                                const borderClass = hasExplicitBorder ? "border" : "border border-slate-200/50";
                                                return (
                                                  <div key={pIndex} className="flex justify-between items-center py-0.5 border-b border-slate-50 last:border-0 pb-1.5 last:pb-0">
                                                    <span className="font-bold text-slate-400">{p.name}</span>
                                                    <span className={`px-2 py-0.5 text-[10.5px] font-extrabold rounded-[5px] truncate max-w-[200px] ${borderClass} ${p.tagStyle || "bg-slate-50 text-slate-600"}`}>
                                                      {p.value}
                                                    </span>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            );
                          })
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ) : (
                  /* 3c. The Split Screen Master-Detail Grid */
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-[550px]" id="notifications-split-view">
                    
                    {/* Left Mini-List Column */}
                    <div className="lg:col-span-5 flex flex-col space-y-2.5 max-h-[750px] overflow-y-auto pr-2 relative scrollbar-thin">
                      <AnimatePresence initial={false}>
                        {filteredNotifications.length === 0 ? (
                          <div className="bg-white border border-slate-200/60 rounded-[24px] p-10 text-center flex flex-col items-center justify-center space-y-3">
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100">
                              <Inbox size={18} />
                            </div>
                            <div>
                              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">Уведомлений нет</h3>
                              <p className="text-[10.5px] font-bold text-slate-400 mt-1 max-w-sm">
                                Выберите другую вкладку или сбросьте фильтры в боковой панели.
                              </p>
                            </div>
                          </div>
                        ) : (
                          filteredNotifications.map((n) => {
                            const isSelectedDetail = expandedId === n.id;
                            const isChecked = selectedIds.includes(n.id);
                            const isUnread = n.status === "новое";
                            const isSystem = n.group === "Система";
                            const isSignal = n.group === "Сигналы";
                            const isExecEvent = n.group === "События исполнения";

                            return (
                              <motion.div
                                key={n.id}
                                layoutId={`split-card-${n.id}`}
                                className={`group p-3.5 border rounded-2xl relative transition-all duration-300 cursor-pointer select-none flex flex-col gap-2 ${
                                  isSystem
                                    ? isSelectedDetail
                                      ? "bg-slate-100 border-slate-400 shadow-2xs"
                                      : isUnread
                                      ? "bg-slate-50 border-slate-300 hover:bg-slate-105 hover:border-slate-350"
                                      : "bg-slate-50/30 border-slate-200/50 hover:bg-slate-50/70 hover:border-slate-300"
                                    : isSelectedDetail 
                                    ? "bg-blue-50/15 border-blue-500/60 shadow-2xs" 
                                    : isUnread
                                    ? "bg-white border-slate-300 hover:border-slate-405 hover:bg-slate-50/10 shadow-3xs"
                                    : "bg-white border-slate-200/60 hover:bg-slate-50/50 hover:border-slate-300"
                                }`}
                                onClick={() => setExpandedId(n.id)}
                              >
                                {/* Left Unread alert indicator */}
                                {isUnread && (
                                  <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-md ${
                                    isSystem ? "bg-slate-400" : isSignal ? "bg-emerald-500" : isExecEvent ? "bg-blue-500" : "bg-amber-550"
                                  }`} />
                                )}

                                {/* Top line: Checkbox & Time & Group Badge & Quick Clear */}
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <input 
                                      type="checkbox" 
                                      checked={isChecked}
                                      onChange={(e) => handleSelectRow(n.id, e as any)}
                                      onClick={(e) => e.stopPropagation()}
                                      className="w-3.5 h-3.5 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500 cursor-pointer shrink-0 accent-blue-600"
                                    />
                                    <span className="font-mono text-[10.5px] font-black text-slate-800 tracking-tight">{n.time}</span>
                                    {isUnread && (
                                      <span className="text-[8px] font-black uppercase text-blue-600 bg-blue-50/85 border border-blue-100 px-1 py-0.5 rounded-md leading-none">
                                        нов.
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-[5px] border ${
                                      n.group === "Сигналы"
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                        : n.group === "Арбитраж"
                                        ? "bg-amber-50 text-amber-600 border-amber-100"
                                        : n.group === "События исполнения"
                                        ? "bg-blue-50 text-blue-600 border-blue-100"
                                        : "bg-slate-50 text-slate-600 border-slate-200"
                                    }`}>
                                      {n.group}
                                    </span>
                                    
                                    <button 
                                      onClick={(e) => handleClearSingle(n.id, e)}
                                      className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all cursor-pointer active:scale-90"
                                      title="Удалить"
                                    >
                                      <X size={11} />
                                    </button>
                                  </div>
                                </div>

                                {/* Title */}
                                <div className="flex items-center gap-1.5 min-w-0">
                                  {isSystem ? (
                                    <Settings size={12} className="text-slate-450 shrink-0 stroke-[2.2]" />
                                  ) : isExecEvent ? (
                                    <Info size={12} className="text-blue-500 shrink-0 stroke-[2.2]" />
                                  ) : isSignal ? (
                                    <Zap size={12} className="text-emerald-500 shrink-0 stroke-[2.2]" />
                                  ) : (
                                    <AlertCircle size={12} className="text-amber-500 shrink-0 stroke-[2.2]" />
                                  )}
                                  <h3 className={`text-[12px] font-black tracking-tight leading-snug truncate ${
                                    isSelectedDetail ? "text-blue-900" : "text-slate-800"
                                  }`}>
                                    {n.title}
                                  </h3>
                                </div>

                                {/* Bottom metrics snippet: Source / Value */}
                                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                                  <span className="font-mono text-slate-550 truncate max-w-[150px]">{n.source}</span>
                                  <span className={`font-mono font-black ${
                                    n.valueColor === "green" 
                                      ? "text-emerald-500" 
                                      : n.valueColor === "red" 
                                      ? "text-rose-500" 
                                      : "text-purple-550"
                                  }`}>{n.value}</span>
                                </div>
                              </motion.div>
                            );
                          })
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Right Detailed Panel Column */}
                    <div className="lg:col-span-7 flex flex-col h-full">
                      <AnimatePresence mode="wait">
                        {(() => {
                          const activeNotif = notifications.find(n => n.id === expandedId);
                          
                          if (!activeNotif) {
                            return (
                              <motion.div
                                key="no-active-detail"
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                className="flex-1 flex flex-col items-center justify-center p-8 bg-white border border-slate-200/60 rounded-[28px] text-center space-y-4 min-h-[450px]"
                              >
                                <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-350">
                                  <Bell size={24} className="animate-spin duration-[3000ms]" />
                                </div>
                                <div className="space-y-1.5">
                                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Сообщение не выбрано</h3>
                                  <p className="text-[11px] font-bold text-slate-400 max-w-xs mx-auto leading-relaxed">
                                    Выберите любое оповещение из левой колонки для мгновенного просмотра подробностей и параметров.
                                  </p>
                                </div>
                              </motion.div>
                            );
                          }

                          const isUnread = activeNotif.status === "новое";

                          return (
                            <motion.div
                              key={`detail-${activeNotif.id}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="flex-1 bg-white border border-slate-200 rounded-[22px] md:rounded-[28px] p-5 sm:p-6 flex flex-col justify-between shadow-xs relative overflow-hidden"
                            >
                              {/* Card Content Top Block */}
                              <div className="space-y-5">
                                {/* Header actions row: Group & Quick Toggles */}
                                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${
                                      activeNotif.group === "Сигналы"
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                        : activeNotif.group === "Арбитраж"
                                        ? "bg-amber-50 text-amber-600 border-amber-100"
                                        : activeNotif.group === "События исполнения"
                                        ? "bg-blue-50 text-blue-600 border-blue-100"
                                        : "bg-slate-50 text-slate-600 border-slate-200"
                                    }`}>
                                      {activeNotif.group}
                                    </span>
                                    <span className="text-[10px] font-black uppercase bg-slate-50 border border-slate-200/50 px-2.5 py-1 rounded-lg text-slate-400 font-mono">
                                      {activeNotif.time}
                                    </span>
                                  </div>

                                  {/* Quick functional controls */}
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={(e) => handleToggleReadStatus(activeNotif.id, e)}
                                      className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg border cursor-pointer transition-all active:scale-95 flex items-center gap-1.5 ${
                                        isUnread
                                          ? "bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100"
                                          : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                                      }`}
                                    >
                                      <Check size={11} className="stroke-[3]" />
                                      {isUnread ? "Прочитано" : "Не прочитано"}
                                    </button>
                                    
                                    <button
                                      onClick={(e) => handleClearSingle(activeNotif.id, e)}
                                      className="p-1 px-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-[10px] font-black uppercase rounded-lg cursor-pointer transition-all active:scale-95 flex items-center gap-1"
                                      title="Удалить уведомление"
                                    >
                                      <Trash size={11} />
                                      Удалить
                                    </button>
                                  </div>
                                </div>

                                {/* Title & Subtitle Info block */}
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    {isUnread && (
                                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
                                    )}
                                    <h2 className="text-sm sm:text-lg font-black text-slate-800 tracking-tight leading-snug">
                                      {activeNotif.title}
                                    </h2>
                                  </div>
                                  <div className="flex items-center gap-2 font-mono text-[10.5px] text-slate-400 font-semibold select-all">
                                    <span className="text-slate-300">Путь:</span>
                                    <span>{activeNotif.source}</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-250" />
                                    <span className="text-slate-300">Значение:</span>
                                    <span className={
                                      activeNotif.valueColor === "green" 
                                        ? "text-emerald-500 font-black" 
                                        : activeNotif.valueColor === "red" 
                                        ? "text-rose-500 font-black" 
                                        : "text-purple-500 font-black"
                                    }>
                                      {activeNotif.value}
                                    </span>
                                  </div>
                                </div>

                                {/* Body Text details with copy button */}
                                <div className="space-y-2 mt-4">
                                  <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5">
                                    <span className="flex items-center gap-1.5">
                                      <Info size={11} className="text-slate-400" />
                                      содержание сообщения
                                    </span>
                                    <button
                                      onClick={() => {
                                        try {
                                          navigator.clipboard.writeText(activeNotif.detailedText);
                                          setCopiedId(activeNotif.id);
                                          setTimeout(() => setCopiedId(null), 1800);
                                        } catch (err) {}
                                      }}
                                      className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-lg text-slate-400 hover:text-slate-700 transition-all flex items-center gap-1 cursor-pointer"
                                      title="Скопировать"
                                    >
                                      <Copy size={11} />
                                      <span className="text-[9px] font-bold">{copiedId === activeNotif.id ? "Скопировано" : "Копировать"}</span>
                                    </button>
                                  </div>
                                  <p className="text-[12px] font-bold text-slate-600 leading-relaxed font-sans bg-slate-50/40 p-4 border border-slate-100/80 rounded-2xl select-all">
                                    {activeNotif.detailedText}
                                  </p>
                                  {activeNotif.group === "Сигналы" && onGoToSignal && (
                                    <div className="mt-3 flex">
                                      <button
                                        onClick={() => onGoToSignal(activeNotif.title)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 bg-blue-50/40 hover:bg-blue-50 text-blue-600 hover:text-blue-700 rounded-lg text-[10.5px] font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-2xs hover:shadow-xs"
                                      >
                                        Открыть сигнал
                                        <ArrowUpRight size={12} strokeWidth={2.5} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>

                            </motion.div>
                          );
                        })()}
                      </AnimatePresence>
                    </div>

                  </div>
                )}
              </motion.div>
            ) : (
              /* PANEL B: Notification Settings Settings Mode */
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                
                {/* Main Settings Form Panel: Left 8 columns */}
                <motion.div
                  key="settings-panel-left"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="xl:col-span-8 bg-white border border-slate-200/60 rounded-[24px] p-6 sm:p-7 space-y-7 shadow-xs flex flex-col"
                >
                  {/* Channels & Rules Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-[13.5px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                        <Sliders size={15} className="text-blue-500" />
                        Каналы доставки и правила групп
                      </h2>
                      <p className="text-[10.5px] font-semibold text-slate-400 mt-1 max-w-2xl leading-relaxed">
                        Управляйте получением алертов через Web Push, мессенджер Telegram и Email.
                      </p>
                    </div>
                  </div>

                  {/* 2-Column Rules and Channels split */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    
                    {/* Delivery Channels settings */}
                    <div className="space-y-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-0.5 select-none">
                        КАНАЛЫ ДОСТАВКИ
                      </span>

                      <div className="space-y-3">
                        {/* Web Push */}
                        <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-200/50 rounded-2xl hover:bg-slate-50 transition-all shadow-3xs">
                          <div className="space-y-1 pr-3">
                            <h3 className="text-xs font-black text-slate-800 leading-none">Web-уведомления</h3>
                            <p className="text-[11px] font-semibold text-slate-400 leading-none mt-1.5">Всплывающие окна внутри сайта</p>
                          </div>
                          <button
                            onClick={() => setWebPushEnabled(!webPushEnabled)}
                            className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              webPushEnabled ? "bg-[#10b981]" : "bg-slate-200"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                webPushEnabled ? "translate-x-4.5" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>

                        {/* Telegram Push */}
                        <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-200/50 rounded-2xl hover:bg-slate-50 transition-all shadow-3xs">
                          <div className="space-y-1 pr-3">
                            <h3 className="text-xs font-black text-slate-800 leading-none">Telegram Bot-алерты</h3>
                            <p className="text-[11px] font-semibold text-slate-400 leading-none mt-1.5">Прямая передача важных событий</p>
                          </div>
                          <button
                            onClick={() => setTelegramEnabled(!telegramEnabled)}
                            className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              telegramEnabled ? "bg-[#10b981]" : "bg-slate-200"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                telegramEnabled ? "translate-x-4.5" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>

                        {/* Email Digest */}
                        <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-200/50 rounded-2xl hover:bg-slate-50 transition-all shadow-3xs">
                          <div className="space-y-1 pr-3">
                            <h3 className="text-xs font-black text-slate-800 leading-none">Email дайджест</h3>
                            <p className="text-[11px] font-semibold text-slate-400 leading-none mt-1.5">Получать итоги за 24 часа</p>
                          </div>
                          <button
                            onClick={() => setEmailDigestEnabled(!emailDigestEnabled)}
                            className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              emailDigestEnabled ? "bg-[#10b981]" : "bg-slate-200"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                emailDigestEnabled ? "translate-x-4.5" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Group Delivery Rules */}
                    <div className="space-y-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-0.5 select-none font-black">
                        ПРАВИЛА ГРУПП
                      </span>

                      <div className="space-y-3">
                        {/* Сигналы */}
                        <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-200/50 rounded-2xl hover:bg-slate-50 transition-all shadow-3xs">
                          <div className="space-y-1 pr-3">
                            <h3 className="text-xs font-black text-slate-800 leading-none">Сигналы сканера</h3>
                            <p className="text-[11px] font-semibold text-slate-400 leading-none mt-1.5">Межбиржевые спреды в реальном времени</p>
                          </div>
                          <button
                            onClick={() => setSignalsRule(signalsRule === "ON" ? "OFF" : "ON")}
                            className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg border transition-all duration-200 ease-out active:scale-95 cursor-pointer shadow-3xs ${
                              signalsRule === "ON"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                                : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {signalsRule}
                          </button>
                        </div>

                        {/* Арбитраж */}
                        <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-200/50 rounded-2xl hover:bg-slate-50 transition-all shadow-3xs">
                          <div className="space-y-1 pr-3">
                            <h3 className="text-xs font-black text-slate-800 leading-none">Арбитражные связки</h3>
                            <p className="text-[11px] font-semibold text-slate-400 leading-none mt-1.5">Отследить запуск цепочки переводов</p>
                          </div>
                          <button
                            onClick={() => setArbitrageRule(arbitrageRule === "ON" ? "OFF" : "ON")}
                            className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg border transition-all duration-200 ease-out active:scale-95 cursor-pointer shadow-3xs ${
                              arbitrageRule === "ON"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                                : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {arbitrageRule}
                          </button>
                        </div>

                        {/* События исполнения */}
                        <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-200/50 rounded-2xl hover:bg-slate-50 transition-all shadow-3xs">
                          <div className="space-y-1 pr-3">
                            <h3 className="text-xs font-black text-slate-800 leading-none">События исполнения</h3>
                            <p className="text-[11px] font-semibold text-slate-400 leading-none mt-1.5">Перевод в сети, ордер, резерв балансов</p>
                          </div>
                          <button
                            onClick={() => {
                              const cycle: Record<string, "HIGH" | "MEDIUM" | "LOW" | "OFF"> = {
                                HIGH: "MEDIUM",
                                MEDIUM: "LOW",
                                LOW: "OFF",
                                OFF: "HIGH"
                              };
                              setExecutionRule(cycle[executionRule] || "HIGH");
                            }}
                            className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg border transition-all duration-200 ease-out active:scale-95 cursor-pointer shadow-3xs ${
                              executionRule === "HIGH"
                                ? "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
                                : executionRule === "MEDIUM"
                                ? "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"
                                : executionRule === "LOW"
                                ? "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                                : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {executionRule}
                          </button>
                        </div>

                        {/* Система */}
                        <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-200/50 rounded-2xl hover:bg-slate-50 transition-all shadow-3xs">
                          <div className="space-y-1 pr-3">
                            <h3 className="text-xs font-black text-slate-800 leading-none">Система</h3>
                            <p className="text-[11.5px] font-semibold text-slate-400 leading-none mt-1.5">Безопасность, входы, ошибки API линков</p>
                          </div>
                          <button
                            onClick={() => {
                              const cycle: Record<string, "INFO" | "WARN" | "ERROR" | "OFF"> = {
                                INFO: "WARN",
                                WARN: "ERROR",
                                ERROR: "OFF",
                                OFF: "INFO"
                              };
                              setSystemRule(cycle[systemRule] || "INFO");
                            }}
                            className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg border transition-all duration-200 ease-out active:scale-95 cursor-pointer shadow-3xs ${
                              systemRule === "INFO"
                                ? "bg-indigo-50/80 text-indigo-600 border-indigo-200 hover:bg-indigo-100"
                                : systemRule === "WARN"
                                ? "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
                                : systemRule === "ERROR"
                                ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
                                : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {systemRule}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Right Form Card: Telegram connection & Filters config (4 columns) */}
                <div className="xl:col-span-4 space-y-6">
                  {/* Telegram Setup */}
                  <div className="p-5 bg-gradient-to-br from-[#ebf5ff]/60 via-white to-white border border-[#bce2ff]/60 rounded-2xl flex flex-col justify-between relative overflow-hidden space-y-5 shadow-xs">
                    {/* Bot blue vertical decorator */}
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#0088cc]" />
                    
                    <div className="space-y-3 pl-2">
                       <div className="flex items-center gap-2 text-[#0088cc]">
                        <Send size={15} className="fill-current" />
                        <h3 className="text-xs font-black uppercase tracking-wider">ШЛЮЗ TELEGRAM BOT</h3>
                      </div>
                      <p className="text-[11px] font-bold text-slate-500 leading-normal">
                        Позволяет выводить сигналы спреда в реальном времени в зашифрованный чат с ботом Arbitrizor. Полезно для автоматического перехвата ордеров.
                      </p>
                    </div>

                    <div className="space-y-4 pl-2">
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                        <span className="text-xs font-black text-slate-800">Статус интеграции</span>
                        <button 
                          onClick={() => setTelegramEnabled(!telegramEnabled)}
                          className="text-slate-500 hover:text-slate-800 transition-colors cursor-pointer select-none"
                        >
                          {telegramEnabled ? (
                            <div className="flex items-center gap-1.5 text-blue-600">
                              <span className="text-[10px] font-bold uppercase">Активен</span>
                              <ToggleRight size={24} className="text-blue-600" />
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <span className="text-[10px] font-bold uppercase">Отключен</span>
                              <ToggleLeft size={24} className="text-slate-300" />
                            </div>
                          )}
                        </button>
                      </div>

                      {/* Bot connection parameter field */}
                      <div className="space-y-2">
                        <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block">Имя пользователя / ID для связи</label>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            value={telegramUser}
                            onChange={(e) => setTelegramUser(e.target.value)}
                            placeholder="@username"
                            className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
                          />
                          <button
                            onClick={handleConnectTelegram}
                            disabled={isConnectingTg}
                            className="px-4 py-2 bg-[#0088cc] hover:bg-[#0077b5] text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-xs transition-all active:scale-95 ease-out select-none cursor-pointer disabled:opacity-50 flex items-center justify-center min-w-[90px]"
                          >
                            {isConnectingTg ? "Связь..." : "Связать"}
                          </button>
                        </div>
                        {tgSuccessConnected && (
                          <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase tracking-wide">
                            <Check size={11} className="stroke-[3]" />
                            ID чата успешно проверен!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* General filtering parameters card */}
                  <div className="p-5 bg-slate-50/70 border border-slate-200/50 rounded-2xl flex flex-col justify-between space-y-5 shadow-xs">
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-200/30 pb-2">
                        ОСНОВНЫЕ ПАРАМЕТРЫ ФИЛЬТРАЦИИ
                      </h3>

                      {/* Threshold slider input */}
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-800">Минимальный спред</span>
                          <span className="font-extrabold text-blue-600 font-mono">+{criticalThreshold}%</span>
                        </div>
                        <input 
                          type="range"
                          min="0.10"
                          max="2.00"
                          step="0.05"
                          value={criticalThreshold}
                          onChange={(e) => setCriticalThreshold(e.target.value)}
                          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <p className="text-[10px] font-semibold text-slate-400 leading-normal">
                          События сканирования с доходностью ниже этого порога будут добавляться в архив бесшумно.
                        </p>
                      </div>

                      {/* Audio switch toggle */}
                      <div className="flex items-center justify-between py-2 border-t border-slate-200/50 mt-4.5">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-800 block">Звуковые алерты</span>
                          <span className="text-[10px] font-semibold text-slate-400 block leading-tight">Тон при превышении лимита порога</span>
                        </div>
                        <button
                          onClick={() => setSoundAlerts(!soundAlerts)}
                          className="p-1 focus:outline-none transition-all cursor-pointer select-none"
                        >
                          {soundAlerts ? (
                            <div className="flex items-center gap-1.5 text-emerald-600">
                              <Volume2 size={16} />
                              <ToggleRight size={24} />
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <VolumeX size={16} />
                              <ToggleLeft size={24} className="text-slate-300" />
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}
          </AnimatePresence>

      </div>
    </div>
  );
}
