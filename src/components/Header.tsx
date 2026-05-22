import React from "react";
import { Search, Bell, Sun, Menu, X, Activity } from "lucide-react";
import { HeaderNav } from "../types";

interface HeaderProps {
  headerNav: HeaderNav[];
  activeHeaderNav: string;
  setActiveHeaderNav: (name: string) => void;
  username: string;
  email: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export function Header({
  headerNav,
  activeHeaderNav,
  setActiveHeaderNav,
  username,
  email,
  isSidebarOpen,
  setIsSidebarOpen
}: HeaderProps) {
  return (
    <header id="main-header" className="h-14 flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200/60 z-40 px-5 sm:px-6">
      <div className="h-full flex items-center justify-between font-medium">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200 transform transition-transform hover:scale-105">
            <Activity size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-800 hidden sm:inline-block">Arbitrizor</span>
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
                  ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <span className={`${activeHeaderNav === nav.name ? "text-white" : "group-hover:text-blue-500"}`}>{nav.icon}</span>
              <span className="text-[13px] font-bold tracking-tight">{nav.name}</span>
            </button>
          ))}
        </nav>

        {/* Right Side Icons & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-1.5 pr-3 border-r border-slate-100">
            <button title="Search" className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all">
              <Search size={16} />
            </button>
            <button title="Notifications" className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all relative">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white" />
            </button>
            <button title="Theme" className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all">
              <Sun size={16} />
            </button>
          </div>

          <div id="user-profile-header" className="flex items-center gap-2.5 bg-slate-50/50 p-1 pl-3 rounded-lg transition-all hover:bg-slate-50 cursor-pointer group border border-transparent hover:border-slate-100">
            <div className="flex flex-col items-end shrink-0 leading-tight">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">{username}</span>
              <span className="text-[10px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight mt-0.5">{email}</span>
            </div>
            <div className="w-7 h-7 rounded-lg overflow-hidden shadow-sm border border-white transition-transform group-hover:scale-95">
               <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} 
                  alt="User Profile" 
                  className="w-full h-full object-cover"
                />
            </div>
          </div>

          <button 
            id="mobile-menu-toggle" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="lg:hidden p-1.5 text-slate-500 hover:text-slate-800 transition-all rounded-lg bg-slate-50 border border-slate-100"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
