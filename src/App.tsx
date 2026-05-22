import { useState } from "react";
import { 
  User, 
  Shield, 
  Key, 
  CreditCard, 
  Zap, 
  Bell, 
  Wallet, 
  HelpCircle
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";

// --- Types & Components ---
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { ScannerPage, SignalDrawer } from "./pages/ScannerPage";
import { AccountPage } from "./pages/AccountPage";
import { SecurityPage } from "./pages/SecurityPage";

export default function App() {
  const [username, setUsername] = useState("Admin");
  const [email, setEmail] = useState("gavrfil@gmail.com");
  const [phone, setPhone] = useState("+79053440725");
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("Сканер");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeHeaderNav, setActiveHeaderNav] = useState("Сканер");
  const [isScannerRunning, setIsScannerRunning] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState<any>(null);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 2000);
  };

  const navItems = [
    { name: "Сканер", icon: <Zap size={20} /> },
    { name: "Профиль", icon: <User size={20} /> },
    { name: "Безопасность", icon: <Shield size={20} /> },
    { name: "API-ключи", icon: <Key size={20} /> },
    { name: "Подписка", icon: <CreditCard size={20} /> },
  ];

  const headerNav = [
    { name: "Сканер", icon: <Zap size={18} /> },
    { name: "Аккаунт", icon: <User size={18} /> },
    { name: "Уведомления", icon: <Bell size={18} /> },
    { name: "Баланс", icon: <Wallet size={18} /> },
    { name: "FAQ", icon: <HelpCircle size={18} /> },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#F9FAFB] font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#1e40af 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

      <Header 
        headerNav={headerNav}
        activeHeaderNav={activeHeaderNav}
        setActiveHeaderNav={(name) => {
          setActiveHeaderNav(name);
          if (name === "Сканер") setActiveTab("Сканер");
          if (name === "Аккаунт") setActiveTab("Профиль");
        }}
        username={username}
        email={email}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Overlay (Mobile) */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden backdrop-blur-sm"
            />
          )}
        </AnimatePresence>

        <Sidebar 
          isSidebarOpen={isSidebarOpen}
          navItems={navItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setIsSidebarOpen={setIsSidebarOpen}
          isScannerTab={activeTab === "Сканер"}
          isScannerRunning={isScannerRunning}
          setIsScannerRunning={setIsScannerRunning}
        />

        {/* Main Content Area */}
        <main id="main-content" className="flex-1 overflow-y-auto relative z-10 flex flex-col">
          <div className="flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              {activeTab === "Сканер" ? (
                <ScannerPage key="scanner" onSelectSignal={setSelectedSignal} isScannerRunning={isScannerRunning} />
              ) : activeTab === "Безопасность" ? (
                <SecurityPage key="security" />
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
            <SignalDrawer signal={selectedSignal} onClose={() => setSelectedSignal(null)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
