import React from "react";
import { User, ShieldCheck, Key, CreditCard, Info, RefreshCcw, CheckCircle2, Upload, Trash2, Shield } from "lucide-react";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "../types";
import { StatItem, SectionCard, InputField, ReadOnlyField, ActionButton } from "../components/CommonUI";

interface AccountPageProps {
  username: string;
  setUsername: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  isSaving: boolean;
  handleSave: () => void;
  key?: React.Key;
}

export function AccountPage({
  username,
  setUsername,
  email,
  setEmail,
  phone,
  setPhone,
  isSaving,
  handleSave
}: AccountPageProps) {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-5 sm:p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6 sm:space-y-8"
    >
      {/* Page Header & Stats */}
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
              label="PRO ГРЕЙД" 
              value="до 24.06" 
              color="text-emerald-500" 
              icon={<CreditCard size={18} className="text-emerald-400" />} 
            />
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-slate-200/60 via-slate-200/60 to-transparent w-full" />
      </motion.div>

      {/* Action Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-none">Профиль пользователя</h2>
            <div className="px-1.5 py-0.5 bg-emerald-100 text-emerald-600 rounded text-[8px] font-black uppercase tracking-widest shrink-0">Active</div>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm font-medium max-w-xl">Параметры персональной интеграции и Telegram соединений.</p>
        </div>
        <button 
          id="save-profile-button"
          onClick={handleSave}
          disabled={isSaving}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-black shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2 group text-xs tracking-tight"
        >
          {isSaving ? <RefreshCcw size={16} className="animate-spin" /> : <CheckCircle2 size={16} className="group-hover:scale-110 transition-transform" />}
          {isSaving ? "СОХРАНЕНИЕ..." : "СОХРАНИТЬ ПРОФИЛЬ"}
        </button>
      </motion.div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start pb-10">
        {/* Left Column: Avatar & System Fields */}
        <div className="lg:col-span-4 space-y-6 sm:space-y-8">
          {/* Avatar Card */}
          <motion.div variants={itemVariants}>
            <SectionCard title="Аватар" icon={<User className="text-blue-500" size={14} />}>
              <div className="flex flex-col items-center gap-6 py-1">
                <div id="avatar-container" className="relative group cursor-pointer w-full max-w-[200px] mx-auto">
                  <div className="aspect-square rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-xl border-[6px] sm:border-[8px] border-white transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-blue-200">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} 
                      alt="Profile Avatar" 
                      className="w-full h-full object-cover shadow-inner bg-slate-50"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 flex flex-col gap-2 scale-90 transition-all duration-500 group-hover:rotate-1">
                    <ActionButton icon={<Upload size={18} />} label="Загрузить новое фото" primary />
                    <ActionButton icon={<Trash2 size={18} />} label="Удалить аватар" />
                  </div>
                </div>
                <div className="text-center mt-1">
                  <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.1em] px-4 leading-tight">MAX 5MB</p>
                </div>
              </div>
            </SectionCard>
          </motion.div>

          {/* System Fields Card */}
          <motion.div variants={itemVariants}>
            <SectionCard title="Безопасный доступ" icon={<Info className="text-blue-500" size={14} />}>
              <div id="system-info-section" className="space-y-2.5 sm:space-y-3">
                <ReadOnlyField label="UUID АККАУНТА" value="2147483647" />
                <ReadOnlyField label="ID TELEGRAM" value="1271389897" />
                <ReadOnlyField label="РЕГИСТРАЦИЯ" value="15 МАЯ 2024" />
              </div>
            </SectionCard>
          </motion.div>
        </div>

        {/* Right Column: Profile Data */}
        <motion.div variants={itemVariants} className="lg:col-span-8">
          <SectionCard 
            title="Персональные данные" 
            icon={<ShieldCheck className="text-blue-500" size={14} />}
            action={<button title="Sync" className="text-[8px] font-black text-blue-600 bg-blue-50/50 px-2 py-1 rounded-lg hover:bg-blue-100 transition-all active:scale-95 tracking-normal uppercase">Синхронизация</button>}
          >
            <div className="space-y-6 sm:space-y-8">
              <InputField 
                label="ЛОГИН ПОЛЬЗОВАТЕЛЯ" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Напр. Admin"
              />
              <InputField 
                label="ЭЛЕКТРОННАЯ ПОЧТА (2FA)" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                type="email"
                placeholder="admin@arbitrizor.com"
              />
              <InputField 
                label="КОНТАКТНЫЙ ТЕЛЕФОН" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="+7 999 000 00 00"
              />
              
              <div id="security-notice" className="pt-3 flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 p-5 sm:p-6 bg-blue-50/50 border border-blue-100/50 rounded-[24px] sm:rounded-[28px] shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                   <ShieldCheck size={80} />
                </div>
                <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 relative z-10 shrink-0 transform group-hover:scale-110 transition-transform">
                  <Shield size={16} />
                </div>
                <div className="space-y-1 relative z-10 text-center sm:text-left">
                  <p className="text-xs sm:text-sm font-black text-blue-900 tracking-tight">Центр безопасности данных</p>
                  <p className="text-[11px] sm:text-xs text-blue-800/70 leading-relaxed font-bold tracking-tight">
                    Система может отправить push-уведомление в ваш Telegram бот для подтверждения сессии. 
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
