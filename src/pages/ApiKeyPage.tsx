import React, { useState } from "react";
import { 
  Key, 
  ShieldCheck, 
  CreditCard, 
  Radio, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  AlertCircle, 
  Trash2, 
  Plus, 
  X, 
  RefreshCw, 
  Info, 
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { containerVariants, itemVariants } from "../types";
import { StatItem } from "../components/CommonUI";
import { useToast } from "../components/Toast";

interface ApiKey {
  id: number;
  exchange: string;
  keyMask: string;
  lastCheck: string;
  permissions: { read: boolean; trade: boolean };
  mode: "НОРМА" | "ПРОВЕРИТЬ";
  status: "ТОРГОВЛЯ" | "ТОЛЬКО ЧТЕНИЕ" | "ПРОВЕРИТЬ";
  statusText: "НОРМА" | "ПРОВЕРИТЬ" | "ОШИБКА";
  created: string;
  checkTime: string;
  balanceReadable: "OK" | "ОШИБКА";
  tradePermissions: "OK" | "ПРОВЕРИТЬ";
}

export function ApiKeyPage() {
  const { showToast } = useToast();
  const [activeFilter, setActiveFilter] = useState("Все");
  const [expandedId, setExpandedId] = useState<number | null>(1); // default expand first item like in screenshot
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<number | null>(null);

  // Form State
  const [newExchange, setNewExchange] = useState("Binance");
  const [newApiKey, setNewApiKey] = useState("");
  const [newSecretKey, setNewSecretKey] = useState("");
  const [newPassphrase, setNewPassphrase] = useState("");
  const [newCanTrade, setNewCanTrade] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Tab state for modal
  const [modalTab, setModalTab] = useState<"save" | "create">("save");
  const [selectedCreateExchange, setSelectedCreateExchange] = useState<string>("Binance");

  const exchangeInstructions: Record<string, { steps: string[]; url: string }> = {
    Binance: {
      steps: [
        "Security Management → API Management",
        "Create API → System generated",
        "Restrict access to trusted IPs only"
      ],
      url: "https://www.binance.com/en/my/settings/api-management"
    },
    Bybit: {
      steps: [
        "Account & Security → API Management",
        "Create New Key → System-generated API Keys",
        "Set Read-Write permissions & Restrict IP access"
      ],
      url: "https://www.bybit.com/app/user/api-management"
    },
    OKX: {
      steps: [
        "API → Create V5 API Key",
        "Link API name, set passphrase & bind IP",
        "Grant Read and Trade permissions"
      ],
      url: "https://www.okx.com/account/my-api"
    },
    Gate: {
      steps: [
        "API Management → Create API Key",
        "Choose API Key type and API name",
        "Assert IP Whitelist access permission settings"
      ],
      url: "https://www.gate.io/myaccount/apikeys"
    },
    KuCoin: {
      steps: [
        "API Management → Create API",
        "Complete name, set passphrase & add white IP",
        "Grant Read & General Trade functionalities"
      ],
      url: "https://www.kucoin.com/account/api"
    },
    MEXC: {
      steps: [
        "Personal Center → API Management",
        "Fill API label, set IP bind address",
        "Toggle Read-Write and confirm Spot permission"
      ],
      url: "https://www.mexc.com/user/api"
    }
  };

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: 1,
      exchange: "Binance",
      keyMask: "BN-7F4A ... 92C1",
      lastCheck: "1 мин",
      permissions: { read: true, trade: true },
      mode: "НОРМА",
      status: "ТОРГОВЛЯ",
      statusText: "НОРМА",
      created: "12.04.2024",
      checkTime: "23:04:12",
      balanceReadable: "OK",
      tradePermissions: "OK"
    },
    {
      id: 2,
      exchange: "Bybit",
      keyMask: "BB-A91D ... 71E4",
      lastCheck: "3 мин",
      permissions: { read: true, trade: true },
      mode: "НОРМА",
      status: "ТОРГОВЛЯ",
      statusText: "НОРМА",
      created: "08.05.2024",
      checkTime: "23:02:40",
      balanceReadable: "OK",
      tradePermissions: "OK"
    },
    {
      id: 3,
      exchange: "OKX",
      keyMask: "OKX-3C8F ... 2A10",
      lastCheck: "2 мин",
      permissions: { read: true, trade: true },
      mode: "НОРМА",
      status: "ТОРГОВЛЯ",
      statusText: "НОРМА",
      created: "15.05.2024",
      checkTime: "23:03:15",
      balanceReadable: "OK",
      tradePermissions: "OK"
    },
    {
      id: 4,
      exchange: "Gate",
      keyMask: "GT-22E9 ... B8F0",
      lastCheck: "8 мин",
      permissions: { read: true, trade: true },
      mode: "ПРОВЕРИТЬ",
      status: "ПРОВЕРИТЬ",
      statusText: "ПРОВЕРИТЬ",
      created: "10.01.2024",
      checkTime: "22:56:04",
      balanceReadable: "OK",
      tradePermissions: "ПРОВЕРИТЬ"
    }
  ]);

  const handleAddKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApiKey) return;

    setIsAdding(true);
    setTimeout(() => {
      const firstPart = newApiKey.substring(0, 4).toUpperCase();
      const lastPart = newApiKey.substring(newApiKey.length - 4).toUpperCase();
      const namePrefix = newExchange.substring(0, 2).toUpperCase();

      const newKey: ApiKey = {
        id: Date.now(),
        exchange: newExchange,
        keyMask: `${namePrefix}-${firstPart} ... ${lastPart}`,
        lastCheck: "сейчас",
        permissions: { read: true, trade: newCanTrade },
        mode: "НОРМА",
        status: newCanTrade ? "ТОРГОВЛЯ" : "ТОЛЬКО ЧТЕНИЕ",
        statusText: "НОРМА",
        created: new Date().toLocaleDateString("ru-RU"),
        checkTime: new Date().toLocaleTimeString("ru-RU"),
        balanceReadable: "OK",
        tradePermissions: "OK"
      };

      setApiKeys([newKey, ...apiKeys]);
      setIsAdding(false);
      setIsAddModalOpen(false);
      setNewApiKey("");
      setNewSecretKey("");
      setNewPassphrase("");
      setNewCanTrade(true);
      showToast(`API-ключ для биржи ${newExchange} успешно сохранен и верифицирован`, "success", "Интеграция");
    }, 1200);
  };

  const handleDelete = (id: number) => {
    const keyToDelete = apiKeys.find(k => k.id === id);
    setApiKeys(apiKeys.filter(k => k.id !== id));
    setIsDeleteConfirmOpen(null);
    showToast(`API-ключ ${keyToDelete ? `для ${keyToDelete.exchange}` : ""} успешно удален`, "info", "Удаление");
  };

  // Stats calculation
  const totalKeys = apiKeys.length;
  const activeKeys = apiKeys.filter(k => k.mode === "НОРМА").length;
  const needsCheck = apiKeys.filter(k => k.mode === "ПРОВЕРИТЬ").length;
  const filteredKeys = apiKeys.filter(k => {
    if (activeFilter === "Все") return true;
    if (activeFilter === "Активные") return k.mode === "НОРМА";
    if (activeFilter === "Требуют проверки") return k.mode === "ПРОВЕРИТЬ";
    return true;
  });

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-5 sm:p-6 lg:p-8 max-w-[1240px] mx-auto space-y-6 sm:space-y-8"
    >
      {/* Action panel: Filters, Compact Metrics, and Add Button on a single line */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Pills container */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
          {["Все", "Активные", "Требуют проверки"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-tight uppercase transition-all duration-300 ${
                activeFilter === f 
                  ? "bg-white text-slate-800 shadow-sm" 
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-50/50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Compact Metrics Widget (Single Card with 3 Sections) */}
        <div className="flex divide-x divide-slate-100 bg-white border border-slate-200/60 rounded-xl overflow-hidden shadow-xs self-start md:self-auto shrink-0 select-none h-[34px] items-stretch">
          <div className="px-3 flex flex-col justify-center min-w-[68px] hover:bg-slate-55 transition-colors">
            <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-wider leading-none">КЛЮЧЕЙ</span>
            <span className="text-xs font-black text-slate-850 mt-0.5 tracking-tight tabular-nums">{totalKeys}</span>
          </div>
          <div className="px-3 flex flex-col justify-center min-w-[76px] hover:bg-slate-55 transition-colors">
            <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-wider leading-none">АКТИВНЫХ</span>
            <span className="text-xs font-black text-emerald-500 mt-0.5 tracking-tight tabular-nums">{activeKeys}</span>
          </div>
          <div className="px-3 flex flex-col justify-center min-w-[80px] hover:bg-slate-55 transition-colors">
            <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-wider leading-none">ПРОВЕРИТЬ</span>
            <span className={`text-xs font-black mt-0.5 tracking-tight tabular-nums ${needsCheck > 0 ? "text-amber-500 animate-pulse" : "text-slate-400"}`}>{needsCheck}</span>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="w-full md:w-auto px-4 py-2.5 bg-white border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 text-slate-700 rounded-xl text-[10px] font-black tracking-tight uppercase shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 shrink-0"
        >
          <Plus size={12} className="text-slate-400 stroke-[3]" />
          Добавить API-ключ
        </button>
      </motion.div>

      {/* Table Headers */}
      <motion.div variants={itemVariants} className="bg-white border border-slate-200/60 rounded-[28px] shadow-sm overflow-hidden">
        {/* Header row */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-slate-50 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
          <div className="col-span-2">ПРОВЕРКА</div>
          <div className="col-span-4">БИРЖА / КЛЮЧ</div>
          <div className="col-span-3">СОСТОЯНИЕ</div>
          <div className="col-span-2">РЕЖИМ</div>
          <div className="col-span-1"></div>
        </div>

        {/* Api Key Items List */}
        <div className="divide-y divide-slate-100">
          <AnimatePresence initial={false} mode="popLayout">
            {filteredKeys.length > 0 ? (
              filteredKeys.map((item) => {
                const isOpen = expandedId === item.id;
                const isWarning = item.mode === "ПРОВЕРИТЬ";
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
                        isWarning ? "bg-amber-500" : "bg-emerald-500"
                      }`} />

                      {/* ПРОВЕРКА */}
                      <div className="col-span-2 flex items-center gap-2 ml-1">
                        <div className="leading-tight">
                          <span className="text-xs font-extrabold text-slate-800 tracking-tight block md:inline-block">
                            {item.lastCheck}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold block">
                            последняя проверка
                          </span>
                        </div>
                      </div>

                      {/* БИРЖА / КЛЮЧ */}
                      <div className="col-span-4">
                        <div className="leading-tight">
                          <span className="text-xs font-black text-slate-800 tracking-tight block">
                            {item.exchange}
                          </span>
                          <span className="text-[10px] font-mono font-medium text-slate-400 block mt-0.5">
                            {item.keyMask}
                          </span>
                        </div>
                      </div>

                      {/* СОСТОЯНИЕ */}
                      <div className="col-span-3">
                        <span className={`text-[9px] font-black uppercase tracking-tight px-2.5 py-1 rounded-[8px] border inline-block ${
                          isWarning 
                            ? "bg-amber-50 text-amber-600 border-amber-100" 
                            : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        }`}>
                          {item.mode}
                        </span>
                      </div>

                      {/* РЕЖИМ */}
                      <div className="col-span-2 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tight">ЧТЕНИЕ</span>
                        <span className="text-slate-300 text-[9px] font-bold">•</span>
                        <span className={`text-[9px] font-black uppercase tracking-tight ${item.permissions.trade ? "text-blue-600" : "text-slate-300"}`}>ТОРГОВЛЯ</span>
                      </div>

                      {/* CHEVRON & ACTIONS */}
                      <div className="col-span-1 flex items-center justify-end gap-1.5">
                        <div className="p-1 text-slate-300 group-hover:text-slate-500 transition-colors">
                          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content Drawer */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-slate-50/30 border-t border-slate-100/60"
                        >
                          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left panel: ПОДКЛЮЧЕНИЕ */}
                            <div className="space-y-4">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/50 pb-2">
                                ПОДКЛЮЧЕНИЕ
                              </h4>
                              <div className="space-y-2.5">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-bold text-slate-400">Биржа</span>
                                  <span className="font-black text-slate-800">{item.exchange}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-bold text-slate-400">API-ключ</span>
                                  <span className="font-mono font-bold text-slate-600">{item.keyMask}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-bold text-slate-400">Добавлен</span>
                                  <span className="font-bold text-slate-600">{item.created}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-bold text-slate-400">Последняя проверка</span>
                                  <span className="font-bold text-slate-600">{item.checkTime}</span>
                                </div>
                              </div>
                            </div>

                            {/* Right panel: ПРОВЕРКА ПОДКЛЮЧЕНИЯ */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  ПРОВЕРКА ПОДКЛЮЧЕНИЯ
                                </h4>
                                <button 
                                  onClick={() => setIsDeleteConfirmOpen(item.id)}
                                  className="text-[9px] font-black text-rose-500 hover:text-rose-600 uppercase flex items-center gap-1 transition-colors"
                                >
                                  <Trash2 size={11} />
                                  Удалить интеграцию
                                </button>
                              </div>
                              <div className="space-y-2.5">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-bold text-slate-400">Баланс читается</span>
                                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black tracking-tight ${
                                    item.balanceReadable === "OK" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                  }`}>{item.balanceReadable}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-bold text-slate-400">Торговые права</span>
                                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black tracking-tight ${
                                    item.tradePermissions === "OK" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                  }`}>{item.tradePermissions}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-bold text-slate-400">Состояние</span>
                                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black tracking-tight ${
                                    item.mode === "НОРМА" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                  }`}>{item.mode}</span>
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
            ) : (
              <div className="p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                  <Key size={26} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-850">Интеграции не найдены</h4>
                  <p className="text-xs text-slate-400 font-medium">Нет подключений, удовлетворяющих выбранному фильтру.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Add API Key Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] w-full max-w-xl overflow-hidden shadow-2xl border border-slate-200/80 flex flex-col my-8 h-[90vh] max-h-[580px] sm:max-h-[640px]"
            >
              {/* Modal Header (FIXED) */}
              <div className="p-4.5 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-[#f6f8fd]/60 shrink-0">
                <div className="space-y-0.5">
                  <h3 className="font-extrabold text-[#0f172a] text-sm sm:text-base tracking-tight leading-none">Добавить API-ключ</h3>
                  <p className="text-[10px] sm:text-[11px] text-blue-600 font-bold tracking-tight">Демо-подключение биржи для сканера и арбитража.</p>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200/60 bg-slate-100 transition-colors"
                >
                  <X size={14} className="text-slate-500" />
                </button>
              </div>

              {/* Tabs Navigator (FIXED) */}
              <div className="flex gap-1 bg-white p-1.5 px-5 border-b border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalTab("save")}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-tight transition-all duration-300 ${
                    modalTab === "save"
                      ? "bg-[#f1f5f9] text-slate-800 border border-slate-200/40 shadow-sm"
                      : "text-slate-400 hover:text-slate-700 hover:bg-slate-50/50"
                  }`}
                >
                  Сохранить ключ
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab("create")}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-tight transition-all duration-300 ${
                    modalTab === "create"
                      ? "bg-[#f1f5f9] text-slate-800 border border-slate-200/40 shadow-sm"
                      : "text-slate-400 hover:text-slate-700 hover:bg-slate-50/50"
                  }`}
                >
                  Создать ключ
                </button>
              </div>

              {/* Core Content Container */}
              {modalTab === "save" ? (
                /* TAB 1: SAVE API KEY - FORM CAN WRAP THE SCROLL AREA AND FIXED FOOTER */
                <form onSubmit={handleAddKey} className="flex-1 min-h-0 flex flex-col">
                  {/* Scrollable area for inputs */}
                  <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                    {/* Select Exchange */}
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 tracking-[0.1em] uppercase block">
                        БИРЖА
                      </label>
                      <div className="relative">
                        <select 
                          value={newExchange}
                          onChange={(e) => setNewExchange(e.target.value)}
                          className="w-full px-3 py-2 bg-[#f0f5ff] border border-[#c9ddff] rounded-xl text-slate-900 font-extrabold text-[11px] focus:ring-4 focus:ring-blue-100 focus:border-blue-450 outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="Binance">Binance</option>
                          <option value="Bybit">Bybit</option>
                          <option value="OKX">OKX</option>
                          <option value="Gate">Gate.io</option>
                          <option value="KuCoin">KuCoin</option>
                          <option value="MEXC">MEXC</option>
                        </select>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                          <ChevronDown size={14} />
                        </div>
                      </div>
                    </div>

                    {/* API Key Input */}
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 tracking-[0.1em] uppercase block">
                        API KEY
                      </label>
                      <input 
                        type="text" 
                        value={newApiKey}
                        onChange={(e) => setNewApiKey(e.target.value)}
                        placeholder="Значение API ключа"
                        required
                        className="w-full px-3 py-2 bg-[#f0f5ff] border border-[#c9ddff] rounded-xl text-slate-950 font-mono text-[11px] focus:ring-4 focus:ring-blue-100 focus:border-blue-450 outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>

                    {/* Secret Key Input */}
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 tracking-[0.1em] uppercase block">
                        API SECRET (СЕКРЕТНЫЙ КЛЮЧ)
                      </label>
                      <input 
                        type="password" 
                        value={newSecretKey}
                        onChange={(e) => setNewSecretKey(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full px-3 py-2 bg-[#f0f5ff] border border-[#c9ddff] rounded-xl text-slate-950 font-mono text-[11px] focus:ring-4 focus:ring-blue-100 focus:border-blue-450 outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>

                    {/* API Passphrase Input */}
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 tracking-[0.1em] uppercase block">
                        API PASSPHRASE / ПАРОЛЬ API
                      </label>
                      <input 
                        type="password" 
                        value={newPassphrase}
                        onChange={(e) => setNewPassphrase(e.target.value)}
                        placeholder="Пароль API (нужно для OKX, KuCoin и др.)"
                        className="w-full px-3 py-2 bg-[#f0f5ff] border border-[#c9ddff] rounded-xl text-slate-950 font-mono text-[11px] focus:ring-4 focus:ring-blue-100 focus:border-blue-450 outline-none transition-all placeholder:text-slate-400/75"
                      />
                    </div>

                    {/* Whitelist IP Field */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[8px] font-black text-slate-400 tracking-[0.1em] uppercase block">
                          WHITELIST IP
                        </label>
                        <span className="text-[8px] text-[#335ae6] font-bold">Нажмите для копирования</span>
                      </div>
                      <input 
                        type="text" 
                        value="185.185.142.24"
                        readOnly
                        onClick={() => {
                          navigator.clipboard.writeText("185.185.142.24");
                          showToast("IP-адрес 185.185.142.24 скопирован в буфер обмена", "success");
                        }}
                        title="Скопировать IP"
                        className="w-full px-3 py-2 bg-[#f4f7fc] border border-slate-200/80 rounded-xl text-slate-900 font-extrabold text-[11px] outline-none cursor-pointer hover:bg-[#eef2f9] transition-all font-mono"
                      />
                    </div>

                    {/* Permissions lists */}
                    <div className="bg-[#f5f8fd]/70 border border-slate-100 rounded-xl p-3.5 space-y-2.5 text-[10px] sm:text-[11px]">
                      <div className="flex justify-between items-center pb-1.5 border-b border-dashed border-slate-200/60">
                        <span className="font-extrabold text-slate-900">Read</span>
                        <span className="text-slate-500 font-bold text-[10px] text-right">чтение баланса и статусов</span>
                      </div>
                      <div className="flex justify-between items-center pb-1.5 border-b border-dashed border-slate-200/60">
                        <span className="font-extrabold text-slate-900">Trade</span>
                        <span className="text-slate-500 font-bold text-[10px] text-right">покупка и продажа актива</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-slate-900">Withdraw / Transfer</span>
                        <span className="text-slate-500 font-bold text-[10px] text-right">перевод на биржу продажи</span>
                      </div>
                    </div>

                    {/* Important warning info box */}
                    <div className="bg-[#fff9f3]/80 border border-[#fde5cc] rounded-xl p-3 text-[10px] leading-normal">
                      <p className="text-[#a45e22] font-semibold">
                        <span className="font-black text-[#854512] uppercase tracking-wider block sm:inline mr-1">ВАЖНО:</span>
                        права API нельзя включить здесь. Создайте ключ на стороне биржи и заранее разрешите Read, Trade и Withdraw/Transfer. Без прав на вывод арбитражный маршрут не сможет перевести актив.
                      </p>
                    </div>
                  </div>

                  {/* FIXED PINNED FOOTER FOR SAVE KEY */}
                  <div className="px-5 py-3 border-t border-slate-100 bg-[#fbfcfd] flex items-center justify-end gap-2.5 shrink-0">
                    <button 
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-4 py-2 bg-white text-slate-600 border border-slate-200 hover:border-slate-300 rounded-lg text-[10px] font-black tracking-tight uppercase hover:bg-slate-50 transition-colors"
                    >
                      Отмена
                    </button>
                    <button 
                      type="submit"
                      disabled={isAdding}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-black tracking-tight uppercase shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-55"
                    >
                      {isAdding ? <RefreshCw size={11} className="animate-spin" /> : null}
                      {isAdding ? "Добавление..." : "Добавить ключ"}
                    </button>
                  </div>
                </form>
              ) : (
                /* TAB 2: CREATE API KEY */
                <div className="flex-1 min-h-0 flex flex-col">
                  {/* Scrollable area for instructions */}
                  <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                    {/* Header instruction meta */}
                    <div className="flex items-center justify-between pb-1">
                      <div className="space-y-0.5">
                        <h4 className="font-extrabold text-slate-900 text-xs tracking-tight leading-tight">Инструкция создания ключа</h4>
                        <p className="text-[10px] text-slate-400 font-semibold max-w-[340px]">Выберите биржу, добавьте наш IP в whitelist и включите нужные права на стороне биржи.</p>
                      </div>
                      <span className="text-[9px] text-[#3b66f5] font-black uppercase tracking-wider hidden sm:block">Выберите биржу</span>
                    </div>

                    {/* Exchange pills grid selection */}
                    <div className="grid grid-cols-3 gap-1.5">
                      {["Binance", "Bybit", "OKX", "Gate", "KuCoin", "MEXC"].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setSelectedCreateExchange(item)}
                          className={`py-2 px-2.5 rounded-lg text-[10px] font-black tracking-tight transition-all text-center border ${
                            selectedCreateExchange === item 
                              ? "bg-[#e2e9fe] border-[#bcccfc] text-[#2557e4] shadow-sm" 
                              : "bg-white border-slate-200/70 text-slate-650 hover:bg-slate-50/70"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>

                    {/* Selected instruction card details */}
                    <div className="border border-slate-100 rounded-xl bg-[#f5f8fd]/60 p-4 space-y-3">
                      <h4 className="font-extrabold text-slate-850 text-[11px] tracking-tight">
                        {selectedCreateExchange}: как создать ключ
                      </h4>

                      {/* Numbered instructions steps */}
                      <div className="space-y-2">
                        {exchangeInstructions[selectedCreateExchange]?.steps.map((step, idx) => (
                          <div key={idx} className="flex items-center gap-2.5">
                            <span className="w-4.5 h-4.5 flex items-center justify-center rounded bg-blue-100 text-[#2557e4] text-[9px] font-black shrink-0">
                              {idx + 1}
                            </span>
                            <p className="text-[10px] font-bold text-slate-650 leading-none">
                              {step}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Connection details simple summary table */}
                      <div className="border border-[#dce4fc] rounded-xl overflow-hidden bg-white text-[10px] mt-1">
                        <div className="flex border-b border-[#e9effd] p-2.5 justify-between items-center">
                          <span className="text-[8px] font-black text-slate-400 tracking-wider uppercase">ПРАВА</span>
                          <span className="font-extrabold text-slate-850 text-[10px]">Read, Trade, Withdraw / Transfer</span>
                        </div>
                        <div className="flex border-b border-[#e9effd] p-2.5 justify-between items-center">
                          <span className="text-[8px] font-black text-slate-400 tracking-wider uppercase">БЕЛЫЙ СПИСОК IP</span>
                          <span 
                            onClick={() => {
                              navigator.clipboard.writeText("185.185.142.24");
                              showToast("IP-адрес 185.185.142.24 скопирован в буфер обмена", "success");
                            }}
                            title="Скопировать"
                            className="font-extrabold text-[#3b66f5] hover:underline cursor-pointer select-all font-mono text-[10px]"
                          >
                            185.185.142.24
                          </span>
                        </div>
                        <div className="flex p-2.5 justify-between gap-3 items-start">
                          <span className="text-[8px] font-black text-slate-400 tracking-wider uppercase shrink-0">ПОСЛЕ СОЗДАНИЯ</span>
                          <span className="font-bold text-slate-800 text-[10px] text-right">
                            вернитесь во вкладку <span className="text-[#3b66f5] font-black">«Сохранить ключ»</span> и вставьте API Key / Secret
                          </span>
                        </div>
                      </div>

                      {/* Create key link action button */}
                      <a 
                        href={exchangeInstructions[selectedCreateExchange]?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 bg-[#eef1fc] hover:bg-[#e4ebfc] text-[#335ae6] rounded-lg text-[10px] font-black tracking-tight uppercase transition-all flex items-center justify-center gap-1.5 border border-[#dce4fc] text-center"
                      >
                        <ExternalLink size={10} className="stroke-[2.5]" />
                        Открыть страницу создания ключа
                      </a>
                    </div>

                    {/* Informative info label */}
                    <div className="flex items-center gap-2 bg-slate-50 p-3 border border-slate-100 rounded-xl">
                      <div className="w-6.5 h-6.5 rounded-full bg-slate-200 border border-slate-350 shrink-0 text-slate-600 flex items-center justify-center text-[10px]">
                        <Info size={11} className="stroke-[2.5]" />
                      </div>
                      <p className="text-[9px] text-slate-500 font-semibold leading-normal">
                        При подключении биржевого аккаунта все транзакции защищены сквозным AES-256 шифрованием. Доступны только указанные права.
                      </p>
                    </div>
                  </div>

                  {/* FIXED PINNED FOOTER FOR INSTRUCTIONS */}
                  <div className="px-5 py-3 border-t border-slate-100 bg-[#fbfcfd] flex items-center justify-end shrink-0">
                    <button 
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-4 py-2 bg-white text-slate-600 border border-slate-200 hover:border-slate-300 rounded-lg text-[10px] font-black tracking-tight uppercase hover:bg-slate-50 transition-colors"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteConfirmOpen !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl border border-slate-200"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
                <div className="flex items-center gap-3 text-rose-600">
                  <div className="p-2 bg-rose-600 rounded-xl text-white">
                    <ShieldAlert size={18} />
                  </div>
                  <h3 className="font-black text-xs tracking-tight uppercase">Удаление интеграции</h3>
                </div>
                <button onClick={() => setIsDeleteConfirmOpen(null)} className="p-2 hover:bg-rose-100 rounded-lg transition-colors text-rose-400">
                  <X size={18} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100 space-y-2">
                  <p className="text-center text-sm font-bold text-slate-700 leading-relaxed">
                    Вы действительно хотите отключить эту биржу? Торговые сессии по ее ключам будут приостановлены.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsDeleteConfirmOpen(null)}
                    className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-[20px] font-black text-xs uppercase tracking-tight transition-all"
                  >
                    ОТМЕНИТЬ
                  </button>
                  <button 
                    onClick={() => handleDelete(isDeleteConfirmOpen)}
                    className="flex-1 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-[20px] font-black text-xs uppercase tracking-tight shadow-xl shadow-rose-100 transition-all active:scale-95"
                  >
                    ДА, УДАЛИТЬ
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
