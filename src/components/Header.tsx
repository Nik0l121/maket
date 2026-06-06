import React, { useState } from "react";
import { Bell, Sun, Moon, Menu, X, Activity, LogOut, Check, Eye } from "lucide-react";
import { HeaderNav, NotificationItem } from "../types";

interface HeaderProps {
  headerNav: HeaderNav[];
  activeHeaderNav: string;
  setActiveHeaderNav: (name: string) => void;
  username: string;
  email: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  onLogout?: () => void;
  theme?: "light" | "dark";
  onChangeTheme?: (theme: "light" | "dark") => void;
  notifications?: NotificationItem[];
  setNotifications?: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
}

export function Header({
  headerNav,
  activeHeaderNav,
  setActiveHeaderNav,
  username,
  email,
  isSidebarOpen,
  setIsSidebarOpen,
  onLogout,
  theme = "light",
  onChangeTheme,
  notifications = [],
  setNotifications
}: HeaderProps) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Filter unread notifications
  const unreadNotifications = notifications.filter(n => n.status === "новое");
  const unreadCount = unreadNotifications.length;

  const handleMarkAllAsRead = () => {
    if (setNotifications) {
      setNotifications(prev => prev.map(n => ({ ...n, status: "прочитано" as const })));
    }
  };

  const handleMarkOneAsRead = (id: string) => {
    if (setNotifications) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: "прочитано" as const } : n));
    }
  };

  return (
    <header id="main-header" className="h-14 flex-shrink-0 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 z-40 px-5 sm:px-6 transition-colors duration-200">
      <div className="h-full flex items-center justify-between font-medium">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none transform transition-transform hover:scale-105">
            <Activity size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-slate-100 hidden sm:inline-block">Arbitrizor</span>
        </div>

        {/* Nav Links - Desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          {headerNav.map((nav) => (
            <button
              id={`header-nav-${nav.name.toLowerCase()}`}
              key={nav.name}
              onClick={() => setActiveHeaderNav(nav.name)}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all duration-300 group ${
                activeHeaderNav === nav.name
                  ? "bg-blue-600 text-white shadow-md shadow-blue-100 dark:shadow-none"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              <span className={`inline-flex shrink-0 transition-transform duration-300 group-hover:scale-110 ${activeHeaderNav === nav.name ? "text-white" : "group-hover:text-blue-500 dark:group-hover:text-blue-400"}`}>{nav.icon}</span>
              <span className="text-[13px] font-bold tracking-tight">{nav.name}</span>
            </button>
          ))}
        </nav>

        {/* Right Side Icons & Profile */}
        <div className="flex items-center gap-2 sm:gap-4 relative">
          <div className="flex items-center gap-2 sm:gap-3 pr-2 sm:pr-3 border-r border-slate-100 dark:border-slate-800">
            
            {/* Notifications Button */}
            <div className="relative">
              <button 
                title="Уведомления" 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`p-1.5 rounded-lg transition-all relative cursor-pointer group ${
                  isNotifOpen 
                    ? "bg-slate-100 dark:bg-slate-850 text-slate-800 dark:text-slate-100" 
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <Bell size={16} className="transition-transform duration-300 group-hover:scale-110" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                )}
              </button>

              {/* Notifications Popover Dropdown */}
              {isNotifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-4 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider font-sans">Сигнальные события</span>
                        {unreadCount > 0 && (
                          <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button 
                          onClick={handleMarkAllAsRead}
                          className="text-[9px] font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <Check size={10} />
                          Прочитать все
                        </button>
                      )}
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-0.5">
                      {notifications.length === 0 ? (
                        <p className="text-[10px] text-slate-400 text-center py-4 font-sans font-bold">Оповещений пока нет</p>
                      ) : (
                        notifications.slice(0, 4).map((notif) => (
                          <div 
                            key={notif.id} 
                            onClick={() => handleMarkOneAsRead(notif.id)}
                            className={`p-2 rounded-xl border text-left transition-all relative group cursor-pointer ${
                              notif.status === "новое" 
                                ? "bg-blue-50/40 dark:bg-blue-950/20 border-blue-100/60 dark:border-blue-900/40 hover:bg-blue-50/70" 
                                : "bg-slate-50/50 dark:bg-slate-850/40 border-slate-100/40 dark:border-slate-800/40 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="text-[10.5px] font-black text-slate-800 dark:text-slate-200 leading-tight">
                                {notif.title}
                              </span>
                              {notif.status === "новое" && (
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                              {notif.subtitle}
                            </p>
                            <div className="flex items-center justify-between text-[8px] mt-1.5 text-slate-400 dark:text-slate-500 font-mono">
                              <span>{notif.time}</span>
                              <span className="uppercase font-bold tracking-wider">{notif.channel}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex justify-end">
                      <button 
                        onClick={() => {
                          setActiveHeaderNav("Уведомления");
                          setIsNotifOpen(false);
                        }}
                        className="text-[10px] font-black text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer select-none"
                      >
                        <Eye size={12} />
                        Открыть Журнал
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Theme Toggle Buttons Segmented Grid Control */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60 shrink-0 select-none">
              <button 
                type="button"
                onClick={() => onChangeTheme?.("light")}
                title="Светлая тема"
                className={`p-1 rounded-md transition-all cursor-pointer group ${
                  theme === "light" 
                    ? "bg-white text-blue-650 shadow-3xs" 
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400"
                }`}
              >
                <Sun size={13} className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              </button>
              <button 
                type="button"
                onClick={() => onChangeTheme?.("dark")}
                title="Темная тема"
                className={`p-1 rounded-md transition-all cursor-pointer group ${
                  theme === "dark" 
                    ? "bg-slate-900 text-amber-450 border border-slate-700/60 shadow-3xs" 
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-350"
                }`}
              >
                <Moon size={13} className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" />
              </button>
            </div>

          </div>

          <div id="user-profile-header" className="flex items-center gap-2.5 bg-slate-50/50 dark:bg-slate-850/30 p-1 pl-3 rounded-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
            <div className="flex flex-col items-end shrink-0 leading-tight">
              <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">{username}</span>
              <span className="text-[10px] font-bold text-slate-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight mt-0.5">{email}</span>
            </div>
            <div className="w-7 h-7 rounded-lg overflow-hidden shadow-sm border border-white dark:border-slate-800 transition-transform group-hover:scale-95">
               <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} 
                  alt="User Profile" 
                  className="w-full h-full object-cover"
                />
            </div>
          </div>

          {onLogout && (
            <button 
              onClick={onLogout}
              title="Выйти" 
              className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30 group"
            >
              <LogOut size={16} className="transition-transform duration-300 group-hover:scale-110 group-hover:-translate-x-0.5" />
            </button>
          )}

          {activeHeaderNav !== "FAQ" && (
            <button 
              id="mobile-menu-toggle" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="lg:hidden p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
