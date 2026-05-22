import React, { useState } from "react";
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert,
  Activity, 
  Key, 
  Trash2, 
  Laptop, 
  Smartphone, 
  MessageSquare, 
  Monitor, 
  CreditCard, 
  User,
  Radio,
  Lock,
  X,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { containerVariants, itemVariants } from "../types";
import { StatItem, SectionCard, InputField } from "../components/CommonUI";

export function ChangePasswordModal({ isOpen, onClose, twoFAEnabled }: { isOpen: boolean, onClose: () => void, twoFAEnabled: boolean }) {
  const [step, setStep] = useState(1); // 1: Password, 2: 2FA, 3: Success
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && twoFAEnabled) {
      setStep(2);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
        setStep(1);
        setPasswords({ old: '', new: '', confirm: '' });
        setCode('');
      }, 1500);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setIsSuccess(false);
      setStep(1);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl border border-slate-200"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl text-white ${isSuccess ? "bg-emerald-500" : "bg-blue-600"}`}>
              {isSuccess ? <ShieldCheck size={18} /> : <Lock size={18} />}
            </div>
            <h3 className="font-black text-slate-800 text-sm tracking-tight uppercase">
              {isSuccess ? "Успешно" : "Смена пароля"}
            </h3>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
                <ShieldCheck size={40} className="animate-bounce" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-black text-slate-900 tracking-tight">Пароль изменен!</h4>
                <p className="text-sm text-slate-500 font-medium">Ваш новый пароль успешно сохранен. Мы рекомендуем завершить другие активные сессии.</p>
              </div>
              <button 
                onClick={handleClose}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[20px] font-black text-sm uppercase tracking-tight shadow-xl shadow-emerald-100 transition-all active:scale-95"
              >
                ОТЛИЧНО
              </button>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit} 
              className="p-8 space-y-6"
            >
              {step === 1 ? (
                <div className="space-y-4">
                  <InputField 
                    label="ТЕКУЩИЙ ПАРОЛЬ" 
                    type="password" 
                    value={passwords.old} 
                    onChange={(e) => setPasswords({...passwords, old: e.target.value})} 
                    placeholder="••••••••"
                  />
                  <InputField 
                    label="НОВЫЙ ПАРОЛЬ" 
                    type="password" 
                    value={passwords.new} 
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})} 
                    placeholder="••••••••"
                  />
                  <InputField 
                    label="ПОДТВЕРДИТЕ ПАРОЛЬ" 
                    type="password" 
                    value={passwords.confirm} 
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} 
                    placeholder="••••••••"
                  />
                </div>
              ) : (
                <div className="space-y-6 text-center">
                  <div className="space-y-2">
                    <h4 className="font-black text-slate-800 tracking-tight">Двухфакторная проверка</h4>
                    <p className="text-xs text-slate-500 font-medium">Введите код из Telegram-бота или Authenticator</p>
                  </div>
                  <div className="flex justify-center gap-2">
                    {[...Array(6)].map((_, i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        className="w-10 h-12 bg-slate-50 border border-slate-200 rounded-xl text-center font-black text-lg focus:border-blue-500 outline-none"
                        value={code[i] || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val) setCode(prev => (prev + val).slice(0, 6));
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-[20px] font-black text-sm uppercase tracking-tight shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <RefreshCw size={18} className="animate-spin" /> : (step === 1 && twoFAEnabled ? "Перейти к 2FA" : "Подтвердить смену")}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export function SecurityToggle({ title, desc, enabled, onToggle }: { title: string, desc: string, enabled: boolean, onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:border-slate-200 transition-all">
      <div>
        <h4 className="text-xs font-black text-slate-800 leading-none">{title}</h4>
        <p className="text-[10px] text-slate-400 font-bold mt-1.5">{desc}</p>
      </div>
      <button 
        onClick={onToggle}
        className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${enabled ? "bg-emerald-500 shadow-lg shadow-emerald-100" : "bg-slate-200"}`}
      >
        <motion.div 
          animate={{ x: enabled ? 20 : 2 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
}

export function SessionItem({ 
  id,
  device, 
  loc, 
  time, 
  ip,
  browser,
  current = false,
  onTerminate
}: { 
  id: number,
  device: string, 
  loc: string, 
  time: string, 
  ip: string,
  browser: string,
  current?: boolean,
  onTerminate: (id: number) => void,
  key?: React.Key
}) {
  const [showDetails, setShowDetails] = useState(false);

  const getDeviceIcon = () => {
    const d = device.toLowerCase();
    if (d.includes('chrome') || d.includes('windows') || d.includes('laptop')) return <Laptop size={14} />;
    if (d.includes('iphone') || d.includes('phone') || d.includes('android')) return <Smartphone size={14} />;
    if (d.includes('telegram')) return <MessageSquare size={14} />;
    return <Monitor size={14} />;
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className={`group flex flex-col px-4 -mx-4 rounded-xl transition-all ${current ? "bg-blue-50/40 border border-blue-100/50" : "hover:bg-slate-50"}`}
    >
      <div className="flex items-center justify-between py-4 border-b border-slate-50 group-last:border-0">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${current ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-50 text-slate-400"}`}>
            {getDeviceIcon()}
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <h4 className={`text-xs font-black tracking-tight ${current ? "text-blue-900" : "text-slate-800"}`}>{device}</h4>
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className={`p-1 rounded hover:bg-slate-100 transition-colors ${current ? "text-blue-400" : "text-slate-300"}`}
                title="Подробнее"
              >
                {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>
            <p className={`text-[10px] font-bold mt-1 ${current ? "text-blue-600/70" : "text-slate-400"}`}>{loc} • {time}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {current && <span className="text-[8px] font-black text-blue-600 bg-white border border-blue-100 px-2 py-1 rounded shadow-sm tracking-widest uppercase">ТЕКУЩАЯ</span>}
          {!current && (
            <button 
              onClick={() => onTerminate(id)}
              className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-40 group-hover:opacity-100"
              title="Завершить сессию"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {showDetails && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className={`p-4 rounded-xl mb-4 space-y-2 border ${current ? "bg-blue-50/50 border-blue-100" : "bg-slate-50/50 border-slate-100"}`}>
               <div className="flex justify-between">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">IP АДРЕС</span>
                 <span className="text-[10px] font-mono font-bold text-slate-600">{ip}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">БРАУЗЕР</span>
                 <span className="text-[10px] font-bold text-slate-600">{browser}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ДАТА ВХОДА</span>
                 <span className="text-[10px] font-bold text-slate-600">22.05.2026, 12:40:54</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ЛОКАЦИЯ</span>
                 <span className="text-[10px] font-bold text-slate-600">{loc} (RU)</span>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function TerminateSessionsModal({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl border border-slate-200"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-3 text-rose-600">
            <div className="p-2 bg-rose-600 rounded-xl text-white">
              <Shield size={18} />
            </div>
            <h3 className="font-black text-xs tracking-tight uppercase">Завершение сессий</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-rose-100 rounded-lg transition-colors text-rose-400">
            <X size={18} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100 space-y-3">
            <div className="flex justify-center text-rose-500 mb-2">
              <ShieldAlert size={32} className="animate-pulse" />
            </div>
            <p className="text-center text-sm font-bold text-slate-700 leading-relaxed">
              В целях безопасности все активные подключения к вашему аккаунту на других устройствах будут мгновенно прекращены.
            </p>
            <p className="text-center text-[11px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 py-2 rounded-xl">
              Текущий сеанс останется активным
            </p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-[20px] font-black text-xs uppercase tracking-tight transition-all"
            >
              ОТМЕНИТЬ
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-[20px] font-black text-xs uppercase tracking-tight shadow-xl shadow-rose-100 transition-all active:scale-95"
            >
              ДА, ЗАВЕРШИТЬ
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function SecurityPage() {
  const [twoFA, setTwoFA] = useState(true);
  const [loginNotify, setLoginNotify] = useState(true);
  const [criticalConfirm, setCriticalConfirm] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);

  const [sessions, setSessions] = useState([
    { id: 1, device: "Chrome / Windows 11", loc: "Москва, Россия", time: "сейчас", current: true, ip: "185.185.142.24", browser: "Chrome 124.0.6367.201" },
    { id: 2, device: "Telegram WebApp", loc: "Неизвестно", time: "12 мин. назад", ip: "91.240.50.11", browser: "Telegram Web/K 1.0" },
    { id: 3, device: "iPhone 15 Pro", loc: "Санкт-Петербург, Россия", time: "2 ч. назад", ip: "176.59.1.18", browser: "Mobile Safari 17.5" },
  ]);

  const terminateSession = (id: number) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const terminateOtherSessions = () => {
    setSessions(prev => prev.filter(s => s.current));
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-5 sm:p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6 sm:space-y-8"
    >
      {/* Page Header & Stats (Same as Account) */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-100 transition-transform hover:rotate-3">
              <User size={22} className="sm:size-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">Аккаунт</h1>
              <p className="text-slate-400 text-[10px] sm:text-xs lg:text-sm font-bold tracking-tight">Безопасность и персональные данные</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-4 sm:gap-6 bg-white p-4 sm:p-5 rounded-[24px] border border-slate-200/60 shadow-sm transition-all hover:shadow-lg hover:shadow-slate-200/10">
            <StatItem 
              label="ЗАЩИТА" 
              value="94/100" 
              color="text-emerald-500" 
              icon={<ShieldCheck size={18} className="text-emerald-400" />} 
            />
            <div className="w-px h-8 bg-slate-100 hidden sm:block" />
            <StatItem 
              label="API" 
              value="6 активных" 
              color="text-blue-600" 
              icon={<Key size={18} className="text-blue-400" />} 
            />
            <div className="w-px h-8 bg-slate-100 hidden sm:block" />
            <StatItem 
              label="СЕССИИ" 
              value={`${sessions.length} онлайн`} 
              color="text-blue-600" 
              icon={<Radio size={18} className="text-blue-400" />} 
            />
            <div className="w-px h-8 bg-slate-100 hidden sm:block" />
            <StatItem 
              label="PRO ГРЕЙД" 
              value="до 24.06" 
              color="text-emerald-500" 
              icon={<CreditCard size={18} className="text-emerald-400" />} 
            />
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-slate-200/60 via-slate-200/60 to-transparent w-full" />
      </motion.div>

      {/* Security Level Banner */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-emerald-50/50 border border-emerald-100 rounded-[24px] relative overflow-hidden group">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-100">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-emerald-900 leading-none">Ваш аккаунт надежно защищен</h3>
            <p className="text-[11px] text-emerald-800/70 font-bold mt-1">Все основные функции безопасности активированы и работают исправно.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 relative z-10">
          <button 
            onClick={() => setIsPasswordModalOpen(true)}
            className="px-5 py-2.5 bg-white text-slate-700 hover:bg-slate-50 rounded-xl text-[10px] font-black shadow-sm border border-slate-100 transition-all"
          >
            Сменить пароль
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-12 space-y-6">
          <SectionCard title="Защита входа" icon={<Key size={16} className="text-blue-600" />}>
            <div className="space-y-4">
              <SecurityToggle 
                title="Двухфакторная защита" 
                desc="Telegram / Authenticator подключен" 
                enabled={twoFA}
                onToggle={() => setTwoFA(!twoFA)}
              />
              <SecurityToggle 
                title="Уведомления о входе" 
                desc="Web + Telegram уведомления о новых сессиях" 
                enabled={loginNotify}
                onToggle={() => setLoginNotify(!loginNotify)}
              />
              <SecurityToggle 
                title="Подтверждение критических действий" 
                desc="Запуск новых лимитов и редактирование API ключей" 
                enabled={criticalConfirm}
                onToggle={() => setCriticalConfirm(!criticalConfirm)}
              />
            </div>
          </SectionCard>
        </div>

        <div className="lg:col-span-12">
          <SectionCard 
            title="Активные сессии" 
            icon={<Radio size={16} className="text-blue-600" />}
            action={
              <button 
                onClick={() => setIsTerminateModalOpen(true)}
                className="text-[8px] font-black text-rose-500 bg-rose-50 px-2 py-1 rounded-lg hover:bg-rose-100 transition-all active:scale-95 tracking-tight uppercase"
              >
                Завершить сессии
              </button>
            }
          >
            <div className="space-y-1">
              <AnimatePresence initial={false} mode="popLayout">
                {sessions.map(session => (
                  <SessionItem 
                    key={session.id}
                    id={session.id}
                    device={session.device} 
                    loc={session.loc} 
                    time={session.time} 
                    ip={session.ip}
                    browser={session.browser}
                    current={session.current}
                    onTerminate={terminateSession}
                  />
                ))}
              </AnimatePresence>
            </div>
          </SectionCard>
        </div>
      </div>

      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
        twoFAEnabled={twoFA}
      />

      <TerminateSessionsModal
        isOpen={isTerminateModalOpen}
        onClose={() => setIsTerminateModalOpen(false)}
        onConfirm={terminateOtherSessions}
      />
    </motion.div>
  );
}
