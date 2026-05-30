import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  title?: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "success", title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    // Default titles if not provided
    let defaultTitle = "";
    if (!title) {
      switch (type) {
        case "success":
          defaultTitle = "Успешно";
          break;
        case "error":
          defaultTitle = "Ошибка";
          break;
        case "warning":
          defaultTitle = "Внимание";
          break;
        case "info":
          defaultTitle = "Информация";
          break;
      }
    }

    const newToast: ToastMessage = {
      id,
      message,
      type,
      title: title || defaultTitle,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      
      {/* Toast Portal/Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-[380px] pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => {
            // Pick styles based on toast type
            let bgClass = "";
            let borderClass = "";
            let iconColor = "";
            let Icon = Info;

            switch (toast.type) {
              case "success":
                bgClass = "bg-white/95 backdrop-blur-md shadow-lg shadow-emerald-100/30";
                borderClass = "border-l-4 border-l-emerald-500 border-slate-200/80";
                iconColor = "text-emerald-500";
                Icon = CheckCircle2;
                break;
              case "error":
                bgClass = "bg-white/95 backdrop-blur-md shadow-lg shadow-rose-100/30";
                borderClass = "border-l-4 border-l-rose-500 border-slate-200/80";
                iconColor = "text-rose-500";
                Icon = AlertCircle;
                break;
              case "warning":
                bgClass = "bg-white/95 backdrop-blur-md shadow-lg shadow-amber-100/30";
                borderClass = "border-l-4 border-l-amber-500 border-slate-200/80";
                iconColor = "text-amber-500";
                Icon = AlertTriangle;
                break;
              case "info":
                bgClass = "bg-white/95 backdrop-blur-md shadow-lg shadow-blue-100/30";
                borderClass = "border-l-4 border-l-blue-500 border-slate-200/80";
                iconColor = "text-blue-500";
                Icon = Info;
                break;
            }

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className={`pointer-events-auto flex w-full border rounded-[16px] overflow-hidden ${bgClass} ${borderClass}`}
              >
                <div className="p-4 flex items-start gap-3 w-full">
                  <div className={`mt-0.5 shrink-0 ${iconColor}`}>
                    <Icon size={18} className="stroke-[2.5]" />
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-2">
                    {toast.title && (
                      <h4 className="text-[12px] font-black uppercase tracking-wider text-slate-800 leading-none mb-1">
                        {toast.title}
                      </h4>
                    )}
                    <p className="text-[12px] font-semibold text-slate-600 leading-snug">
                      {toast.message}
                    </p>
                  </div>

                  <button
                    onClick={() => removeToast(toast.id)}
                    className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <X size={14} className="stroke-[2.5]" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
