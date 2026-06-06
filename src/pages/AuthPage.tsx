import React, { useState } from "react";
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useToast } from "../components/Toast";

type AuthMode = "login" | "register" | "recover" | "reset";

interface AuthPageProps {
  onLoginSuccess: (email: string, username: string) => void;
  onClose?: () => void;
  initialMode?: AuthMode;
  isModal?: boolean;
}

export function AuthPage({ onLoginSuccess, onClose, initialMode, isModal = false }: AuthPageProps) {
  const { showToast } = useToast();
  const [mode, setMode] = useState<AuthMode>(initialMode || "login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Error States
  const [errorMsg, setErrorMsg] = useState("");

  const handleValidateEmail = (emailStr: string) => {
    return /\S+@\S+\.\S+/.test(emailStr);
  };

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (mode === "login") {
      if (!email || !password) {
        setErrorMsg("Пожалуйста, заполните все обязательные поля");
        return;
      }
      if (!handleValidateEmail(email)) {
        setErrorMsg("Введите корректный адрес электронной почты");
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        showToast("Успешная авторизация в системе!", "success");
        onLoginSuccess(email, username || email.split("@")[0]);
      }, 1200);
    } 
    
    else if (mode === "register") {
      if (!email || !password || !confirmPassword || !username) {
        setErrorMsg("Пожалуйста, заполните все обязательные поля");
        return;
      }
      if (!handleValidateEmail(email)) {
        setErrorMsg("Введите корректный адрес электронной почты");
        return;
      }
      if (password.length < 6) {
        setErrorMsg("Пароль должен содержать минимум 6 символов");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Пароли не совпадают");
        return;
      }
      if (!agreeTerms) {
        setErrorMsg("Необходимо согласиться с правилами платформы");
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        showToast("Регистрация успешно завершена!", "success");
        onLoginSuccess(email, username);
      }, 1200);
    } 
    
    else if (mode === "recover") {
      if (!email) {
        setErrorMsg("Укажите ваш e-mail для отправки инструкций");
        return;
      }
      if (!handleValidateEmail(email)) {
        setErrorMsg("Введите корректный адрес электронной почты");
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        showToast(`Код восстановления отправлен на ${email}`, "info");
        setMode("reset");
      }, 1200);
    } 
    
    else if (mode === "reset") {
      if (!resetCode || !password || !confirmPassword) {
        setErrorMsg("Пожалуйста, заполните все поля");
        return;
      }
      if (password.length < 6) {
        setErrorMsg("Пароль должен содержать минимум 6 символов");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Пароли не совпадают");
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        showToast("Пароль успешно изменен. Войдите с новым паролем", "success");
        setMode("login");
        setPassword("");
        setConfirmPassword("");
      }, 1200);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.35, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -15,
      transition: { duration: 0.25, ease: "easeIn" }
    }
  };

  if (isModal) {
    return (
      <div className="w-full max-w-[420px] mx-auto text-left relative z-10 font-sans">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white border border-slate-200/80 rounded-[32px] p-8 shadow-2xl relative"
          >
            {/* Close Button overlay */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                title="Закрыть"
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer z-50 animate-fade-in"
              >
                <X size={16} />
              </button>
            )}

            {/* Mode selection links/tabs when acting as modal */}
            {onClose && (
              <div className="absolute top-4 left-4 flex gap-1 bg-slate-100 rounded-lg p-0.5 border border-slate-200/40">
                {(["login", "register"] as AuthMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMode(m);
                      setErrorMsg("");
                    }}
                    className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded transition-all ${
                      mode === m 
                        ? "bg-white text-blue-600 shadow-xs" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {m === "login" ? "Вход" : "Рег."}
                  </button>
                ))}
              </div>
            )}

            {/* Error Box */}
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="mb-4 mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 flex items-start gap-2.5"
              >
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <span className="text-[11px] font-bold leading-normal">{errorMsg}</span>
              </motion.div>
            )}

            {/* ACTION: LOGIN SCREEN */}
            {mode === "login" && (
              <form onSubmit={handleAction} className="space-y-5">
                <div className="space-y-1.5 pt-4">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Добро пожаловать в систему</h2>
                  <p className="text-xs font-semibold text-slate-400">Введите свои учетные данные для управления сканером</p>
                </div>

                <div className="space-y-4 pt-1">
                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">E-mail адрес</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@contract.io"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-blue-500 transition-all focus:shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Password field */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center pl-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Пароль</label>
                      <button
                        type="button"
                        onClick={() => setMode("recover")}
                        className="text-[10px] font-extrabold text-blue-500 hover:text-blue-600 transition-colors uppercase tracking-widest"
                      >
                        Забыли?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-blue-500 transition-all focus:shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pl-1 pt-1">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="remember"
                      className="rounded border-slate-200 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                    />
                    <label htmlFor="remember" className="text-xs font-bold text-slate-400 cursor-pointer select-none">
                      Запомнить меня
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 mt-1"
                >
                  {isLoading ? "Вход в панель..." : "ВОЙТИ В ПАНЕЛЬ"}
                  {!isLoading && <ArrowRight size={14} />}
                </button>

                <div className="text-center pt-2">
                  <span className="text-xs font-semibold text-slate-400">Впервые у нас? </span>
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="text-xs font-extrabold text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    Создать аккаунт
                  </button>
                </div>
              </form>
            )}

            {/* ACTION: REGISTER SCREEN */}
            {mode === "register" && (
              <form onSubmit={handleAction} className="space-y-4">
                <div className="space-y-1.5 pt-4">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Регистрация аккаунта</h2>
                  <p className="text-xs font-semibold text-slate-400">Зарегистрируйтесь, чтобы запустить сканер</p>
                </div>

                <div className="space-y-3 pt-1">
                  {/* Username Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Имя пользователя (Никнейм)</label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="arbitrageur_77"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-blue-500 transition-all focus:shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">E-mail адрес</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@smart-arb.com"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-blue-500 transition-all focus:shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Пароль (мин. 6 знаков)</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-blue-500 transition-all focus:shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Подтвердите пароль</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-blue-500 transition-all focus:shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pl-1 pt-1">
                  <input 
                    type="checkbox" 
                    id="agree"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="rounded border-slate-200 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 mt-0.5 cursor-pointer"
                  />
                  <label htmlFor="agree" className="text-[10.5px] font-bold text-slate-400 leading-normal cursor-pointer select-none">
                    Я принимаю условия <span className="text-blue-500 hover:underline">Пользовательского Соглашения</span> и обработки персональных данных.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 mt-1"
                >
                  {isLoading ? "Регистрация профиля..." : "ЗАРЕГИСТРИРОВАТЬСЯ"}
                  {!isLoading && <ArrowRight size={14} />}
                </button>

                <div className="text-center pt-2">
                  <span className="text-xs font-semibold text-slate-400">Уже зарегистрированы? </span>
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-xs font-extrabold text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    Войти
                  </button>
                </div>
              </form>
            )}

            {/* ACTION: PASSWORD RECOVERY (FORGOT PASSWORD) SCREEN */}
            {mode === "recover" && (
              <form onSubmit={handleAction} className="space-y-5">
                <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 mb-2 mt-4">
                  <KeyRound size={22} />
                </div>

                <div className="space-y-1.5">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Забыли пароль?</h2>
                  <p className="text-xs font-semibold text-slate-400 leading-normal">
                    Введите адрес электронной почты, указанный при регистрации. Мы вышлем временный проверочный код.
                  </p>
                </div>

                {/* Email field */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">E-mail адрес</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your-email@host.com"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-blue-500 transition-all focus:shadow-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  {isLoading ? "Отправка кода..." : "ОТПРАВИТЬ ССЫЛКУ ВОССТАНОВЛЕНИЯ"}
                  {!isLoading && <ArrowRight size={14} />}
                </button>

                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-extrabold text-slate-400 hover:text-slate-600 transition-colors pt-1"
                >
                  <ArrowLeft size={13} />
                  Вернуться ко входу
                </button>
              </form>
            )}

            {/* ACTION: PASSWORD RESET (SETTING NEW PASSWORD WITH SENT CODE) SCREEN */}
            {mode === "reset" && (
              <form onSubmit={handleAction} className="space-y-4">
                <div className="space-y-1.5 pt-4">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Сброс пароля</h2>
                  <p className="text-xs font-semibold text-slate-400">Введите полученный проверочный код и задайте новый пароль</p>
                </div>

                <div className="space-y-3.5 pt-1">
                  {/* Reset Code */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Проверочный код из письма</label>
                    <input
                      type="text"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="Код (например: 489102)"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-blue-500 transition-all text-center tracking-widest font-mono"
                    />
                  </div>

                  {/* New Password */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Новый пароль</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-blue-500 transition-all focus:shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Подтвердите новый пароль</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-blue-500 transition-all focus:shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 mt-1"
                >
                  {isLoading ? "Сброс..." : "УСТАНОВИТЬ НОВЫЙ ПАРОЛЬ"}
                  {!isLoading && <ArrowRight size={14} />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMsg("");
                  }}
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-extrabold text-slate-400 hover:text-slate-600 transition-colors pt-1"
                >
                  <ArrowLeft size={13} />
                  Вернуться к авторизации
                </button>
              </form>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F8FAFC] font-sans text-slate-800 relative overflow-hidden">
      {/* Background radial accent patterns */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-400/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-400/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Left Column: Promo Info Pane */}
      <div className="w-full md:w-[45%] bg-slate-900 text-white p-8 md:p-16 flex flex-col justify-between relative overflow-hidden shrink-0">
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
          style={{ 
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", 
            backgroundSize: "20px 20px" 
          }} 
        />
        
        {/* Orbit decoration */}
        <div className="absolute top-[40%] right-[-10%] w-72 h-72 rounded-full border border-white/[0.04] flex items-center justify-center pointer-events-none">
          <div className="w-56 h-56 rounded-full border border-dashed border-white/[0.02] animate-[spin_40s_linear_infinite]" />
        </div>

        {/* Header Branding */}
        <div className="relative z-10 flex items-center gap-2.5">
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

        {/* Promo Messaging Carousel / Section */}
        <div className="relative z-10 my-16 space-y-6 max-w-sm">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/[0.06] border border-white/[0.08] rounded-full">
            <ShieldCheck size={12} className="text-blue-400" />
            <span className="text-[9px] font-extrabold text-blue-300 uppercase tracking-widest leading-none">
              Интелектуальная защита
            </span>
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight text-white">
              Автоматизированный поиск доходных цепочек
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              Мгновенное сканирование децентрализованных и централизованных обменников с анализом комиссий в реальном времени.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/[0.06]">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-[10px] font-black shrink-0 mt-0.5">✓</div>
              <p className="text-[11px] font-bold text-slate-300">Субсекундный пинг и анализ стакана цен</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-[10px] font-black shrink-0 mt-0.5">✓</div>
              <p className="text-[11px] font-bold text-slate-300">Безопасное проксирование API-ключей</p>
            </div>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="relative z-10 text-[10px] text-slate-500 font-bold tracking-tight">
          © 2026 Arbitrage Quantum Platform. Все права защищены.
        </div>
      </div>

      {/* Right Column: Interaction Auth Box */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative z-10">
        
        {/* Toggleable view states selector (strictly for client testing/presentation of all requested screens) */}
        <div className="absolute top-4 right-4 flex gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/50">
          {(["login", "register", "recover", "reset"] as AuthMode[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setErrorMsg("");
              }}
              className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg transition-all ${
                mode === m 
                  ? "bg-white text-blue-600 shadow-xs border border-slate-200/40" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {m === "login" && "Вход"}
              {m === "register" && "Рег."}
              {m === "recover" && "Восст."}
              {m === "reset" && "Сброс"}
            </button>
          ))}
        </div>

        <div className="w-full max-w-[420px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white border border-slate-200/80 rounded-[32px] p-8 shadow-sm relative"
            >
              {/* Close Button overlay */}
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  title="Закрыть"
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 transition-colors cursor-pointer z-50"
                >
                  <X size={16} />
                </button>
              )}

              {/* Error Box */}
              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 flex items-start gap-2.5"
                >
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  <span className="text-[11px] font-bold leading-normal">{errorMsg}</span>
                </motion.div>
              )}

              {/* ACTION: LOGIN SCREEN */}
              {mode === "login" && (
                <form onSubmit={handleAction} className="space-y-5">
                  <div className="space-y-1.5">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Добро пожаловать в систему</h2>
                    <p className="text-xs font-semibold text-slate-400">Введите свои учетные данные для управления сканером</p>
                  </div>

                  <div className="space-y-4 pt-1">
                    {/* Email field */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">E-mail адрес</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="example@contract.io"
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-blue-500 transition-all focus:shadow-xs"
                        />
                      </div>
                    </div>

                    {/* Password field */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center pl-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Пароль</label>
                        <button
                          type="button"
                          onClick={() => setMode("recover")}
                          className="text-[10px] font-extrabold text-blue-500 hover:text-blue-600 transition-colors uppercase tracking-widest"
                        >
                          Забыли?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-blue-500 transition-all focus:shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pl-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-200 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                      />
                      <span className="text-[11px] font-bold text-slate-500">Запомнить меня</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                  >
                    {isLoading ? "Авторизация..." : "ВОЙТИ В ПАНЕЛЬ"}
                    {!isLoading && <ArrowRight size={14} />}
                  </button>

                  <div className="text-center pt-2">
                    <span className="text-xs font-semibold text-slate-400">Впервые у нас? </span>
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="text-xs font-extrabold text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      Создать аккаунт
                    </button>
                  </div>
                </form>
              )}

              {/* ACTION: REGISTRATION SCREEN */}
              {mode === "register" && (
                <form onSubmit={handleAction} className="space-y-4">
                  <div className="space-y-1.5">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Создание профиля</h2>
                    <p className="text-xs font-semibold text-slate-400">Быстрая регистрация для моментального доступа к сканерам</p>
                  </div>

                  <div className="space-y-3.5 pt-1">
                    {/* Full Name field */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Ваше имя / Логин</label>
                      <div className="relative">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Иван Петров"
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-blue-500 transition-all focus:shadow-xs"
                        />
                      </div>
                    </div>

                    {/* Email field */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">E-mail адрес</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="user@smart-arb.com"
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-blue-500 transition-all focus:shadow-xs"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Пароль (мин. 6 знаков)</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-blue-500 transition-all focus:shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Подтвердите пароль</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-blue-500 transition-all focus:shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pl-1 pt-1">
                    <input 
                      type="checkbox" 
                      id="agree"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="rounded border-slate-200 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 mt-0.5 cursor-pointer"
                    />
                    <label htmlFor="agree" className="text-[10.5px] font-bold text-slate-400 leading-normal cursor-pointer select-none">
                      Я принимаю условия <span className="text-blue-500 hover:underline">Пользовательского Соглашения</span> и обработки персональных данных.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 mt-1"
                  >
                    {isLoading ? "Регистрация профиля..." : "ЗАРЕГИСТРИРОВАТЬСЯ"}
                    {!isLoading && <ArrowRight size={14} />}
                  </button>

                  <div className="text-center pt-2">
                    <span className="text-xs font-semibold text-slate-400">Уже зарегистрированы? </span>
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-xs font-extrabold text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      Войти
                    </button>
                  </div>
                </form>
              )}

              {/* ACTION: PASSWORD RECOVERY (FORGOT PASSWORD) SCREEN */}
              {mode === "recover" && (
                <form onSubmit={handleAction} className="space-y-5">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 mb-2">
                    <KeyRound size={22} />
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Забыли пароль?</h2>
                    <p className="text-xs font-semibold text-slate-400 leading-normal">
                      Введите адрес электронной почты, указанный при регистрации. Мы вышлем временный проверочный код.
                    </p>
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">E-mail адрес</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your-email@host.com"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-blue-500 transition-all focus:shadow-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                  >
                    {isLoading ? "Отправка кода..." : "ОТПРАВИТЬ ССЫЛКУ ВОССТАНОВЛЕНИЯ"}
                    {!isLoading && <ArrowRight size={14} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="w-full flex items-center justify-center gap-1.5 text-xs font-extrabold text-slate-400 hover:text-slate-600 transition-colors pt-1"
                  >
                    <ArrowLeft size={13} />
                    Вернуться ко входу
                  </button>
                </form>
              )}

              {/* ACTION: PASSWORD RESET (SETTING NEW PASSWORD WITH SENT CODE) SCREEN */}
              {mode === "reset" && (
                <form onSubmit={handleAction} className="space-y-4">
                  <div className="space-y-1.5">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Сброс пароля</h2>
                    <p className="text-xs font-semibold text-slate-400">Введите полученный проверочный код и задайте новый пароль</p>
                  </div>

                  <div className="space-y-3.5 pt-1">
                    {/* Reset Code */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Проверочный код из письма</label>
                      <input
                        type="text"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        placeholder="Код (например: 489102)"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-blue-500 transition-all text-center tracking-widest font-mono"
                      />
                    </div>

                    {/* New Password */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Новый пароль</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-blue-500 transition-all focus:shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm New Password */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Подтвердите новый пароль</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-blue-500 transition-all focus:shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 mt-1"
                  >
                    {isLoading ? "Сброс..." : "УСТАНОВИТЬ НОВЫЙ ПАРОЛЬ"}
                    {!isLoading && <ArrowRight size={14} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setErrorMsg("");
                    }}
                    className="w-full flex items-center justify-center gap-1.5 text-xs font-extrabold text-slate-400 hover:text-slate-600 transition-colors pt-1"
                  >
                    <ArrowLeft size={13} />
                    Вернуться к авторизации
                  </button>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
