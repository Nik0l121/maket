import React, { useState } from "react";
import { 
  HelpCircle, 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  FileText, 
  ChevronRight, 
  ChevronLeft,
  Search, 
  Eye, 
  ShieldAlert, 
  Save, 
  RotateCcw,
  Sparkles,
  Layers,
  Calendar,
  UserCheck,
  UserX,
  Zap,
  Target,
  ThumbsUp,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
  isDraft: boolean;
  updatedAt: string;
}

const INITIAL_ARTICLES: Article[] = [
  {
    id: "1",
    title: "Как запустить процесс арбитража из сканера?",
    category: "Запуск арбитража",
    content: "Откройте раздел «Сканер», выберите сигнал и нажмите «Открыть». На странице сигнала проверьте сумму, биржи, сеть перевода и комиссию. После проверки нажмите «Запустить арбитраж».\n\nСистема покажет этапы: покупка, whitelist, перевод, отслеживание поступления и продажа на второй бирже.",
    isDraft: false,
    updatedAt: "02.05"
  },
  {
    id: "2",
    title: "Что нужно проверить перед запуском сделки?",
    category: "Запуск арбитража",
    content: "Перед запуском сделки обязательно убедитесь в следующем:\n\n1. Сети перевода на бирже отправления и бирже получения полностью совпадают (например, ERC-20 или BEP-20).\n2. Вывод средств на бирже-доноре и ввод средств на бирже-получателе открыты и не находятся на техническом обслуживании.\n3. Комиссия сети перевода не превышает ожидаемый спред сделки.\n4. Достаточно ли ликвидности в стакане на обеих биржах для проведения вашего объема сделки.",
    isDraft: false,
    updatedAt: "04.05"
  },
  {
    id: "3",
    title: "Какие права нужны API-ключам?",
    category: "Биржи и API",
    content: "Для безопасной работы автоматических и полуавтоматических функций платформы вашим API-ключам требуются только следующие разрешения:\n\n- Чтение данных / Информация об аккаунте (Read Info / View Balance) — для отображения балансов.\n- Спотовая торговля (Spot Trading) — если планируется выполнение ордеров через интерфейс платформы.\n\nКАТЕГОРИЧЕСКИ ЗАПРЕЩАЕТСЯ включать разрешение на вывод средств (Withdrawal). Платформа никогда не запрашивает и не использует права на вывод ваших активов.",
    isDraft: false,
    updatedAt: "10.05"
  },
  {
    id: "4",
    title: "Почему биржа может показывать предупреждение?",
    category: "Биржи и API",
    content: "Некоторые биржи могут присылать предупреждения на email или в личном кабинете при частых запросах к API. Это стандартное поведение систем безопасности.\n\nВ настройках нашей платформы вы можете настроить частоту запросов (таймаут) в зависимости от тарифа, чтобы избежать временных блокировок (rate-limiting) со стороны биржевых серверов.",
    isDraft: false,
    updatedAt: "12.05"
  },
  {
    id: "5",
    title: "Что делать, если подписка активна, но доступ не появился?",
    category: "Оплата и доступ",
    content: "Обычно активация подписки происходит в течение 1–5 минут после подтверждения транзакции в блокчейне или получения фиатного платежа. Если этого не произошло:\n\n1. Попробуйте обновить страницу или выйти/войти в аккаунт.\n2. Проверьте хэш транзакции в эксплорере или статус в квитанции.\n3. Если прошло более 15 минут, напишите в нашу службу поддержки в Telegram, прикрепив хэш или квитанцию об оплате.",
    isDraft: false,
    updatedAt: "15.05"
  },
  {
    id: "6",
    title: "Как система считает риск запуска?",
    category: "Запуск арбитража",
    content: "Система оценки рисков анализирует множество параметров в реальном времени:\n\n1. Текущая ликвидность пары и глубина стакана (учитывается проскальзывание).\n2. Задержка сети (latency) между биржами и API-серверами.\n3. Среднее время подтверждения транзакции в выбранной сети блокчейна.\n4. Динамика изменения цен за последние 30 секунд.\n\nЕсли риск превышает допустимый порог, система присваивает сигналу статус «Риск» и предупреждает о возможных отклонениях от расчетной доходности.",
    isDraft: true,
    updatedAt: "18.05"
  }
];

export function FaqPage() {
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [selectedArticleId, setSelectedArticleId] = useState<string>("1");
  const [isAdminMode, setIsAdminMode] = useState<boolean>(true); // Starts in admin mode as requested
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mobileActiveView, setMobileActiveView] = useState<'list' | 'detail'>('list');
  
  // Feedback States & Interactivity
  const [feedbackStatus, setFeedbackStatus] = useState<'none' | 'yes' | 'no' | 'submitted_yes' | 'submitted_no'>('none');
  const [feedbackComment, setFeedbackComment] = useState<string>("");
  const [showCustomCommentForm, setShowCustomCommentForm] = useState<boolean>(false);

  React.useEffect(() => {
    setFeedbackStatus('none');
    setFeedbackComment('');
    setShowCustomCommentForm(false);
  }, [selectedArticleId]);

  // Edit & Create States
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editCategory, setEditCategory] = useState<string>("");
  const [editContent, setEditContent] = useState<string>("");
  const [editIsDraft, setEditIsDraft] = useState<boolean>(false);

  // Local notifications inside page
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Derived counts
  const publishedArticles = articles.filter(a => !a.isDraft);
  const draftArticles = articles.filter(a => a.isDraft);
  const totalCount = articles.length;

  // Selected Article
  const selectedArticle = articles.find(a => a.id === selectedArticleId) || articles[0];

  // Helper to start editing
  const handleStartEdit = () => {
    if (!selectedArticle) return;
    setEditTitle(selectedArticle.title);
    setEditCategory(selectedArticle.category);
    setEditContent(selectedArticle.content);
    setEditIsDraft(selectedArticle.isDraft);
    setIsEditing(true);
    setIsCreating(false);
    setMobileActiveView('detail');
  };

  // Helper to start creating
  const handleStartCreate = () => {
    setEditTitle("");
    setEditCategory("Запуск арбитража");
    setEditContent("");
    setEditIsDraft(true);
    setIsCreating(true);
    setIsEditing(false);
    setMobileActiveView('detail');
  };

  // Handle Save
  const handleSave = () => {
    if (!editTitle.trim()) {
      triggerToast("Заголовок статьи не может быть пустым!");
      return;
    }
    if (!editContent.trim()) {
      triggerToast("Текст статьи не может быть пустым!");
      return;
    }

    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}`;

    if (isCreating) {
      const newId = String(Number(articles.reduce((max, cur) => Number(cur.id) > max ? Number(cur.id) : max, 0)) + 1);
      const newArticle: Article = {
        id: newId,
        title: editTitle,
        category: editCategory,
        content: editContent,
        isDraft: editIsDraft,
        updatedAt: formattedDate
      };
      setArticles([...articles, newArticle]);
      setSelectedArticleId(newId);
      setIsCreating(false);
      triggerToast("Новая статья успешно добавлена!");
    } else if (isEditing && selectedArticle) {
      const updatedArticles = articles.map(a => {
        if (a.id === selectedArticle.id) {
          return {
            ...a,
            title: editTitle,
            category: editCategory,
            content: editContent,
            isDraft: editIsDraft,
            updatedAt: formattedDate
          };
        }
        return a;
      });
      setArticles(updatedArticles);
      setIsEditing(false);
      triggerToast("Изменения сохранены!");
    }
  };

  // Handle Delete
  const handleDeleteArticle = (id: string) => {
    if (window.confirm("Вы уверены, что хотите удалить эту статью?")) {
      const filtered = articles.filter(a => a.id !== id);
      setArticles(filtered);
      triggerToast("Статья успешно удалена");
      
      // Auto-select another article
      if (filtered.length > 0) {
        setSelectedArticleId(filtered[0].id);
      }
    }
  };

  // Collect categorised articles for display in sidebar
  const visibleArticles = articles.filter(a => {
    // Search query match
    const matchesSearch = searchQuery.trim() === "" || 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    // Under regular user mode, filter out drafts
    if (!isAdminMode && a.isDraft) return false;

    return true;
  });

  // Unique categories from visible articles (excluding drafts as category name if they go into a special draft section in admin mode)
  const categories = Array.from(new Set(
    visibleArticles
      .filter(a => !isAdminMode || !a.isDraft)
      .map(a => a.category)
  ));

  const draftSectionArticles = visibleArticles.filter(a => isAdminMode && a.isDraft);

  return (
    <div id="faq-page-container" className="flex-1 flex flex-col overflow-hidden relative min-h-0 bg-[#F8FAFC]">
      {/* Dynamic Top Banner with counters */}
      <div className="bg-white border-b border-slate-200/60 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-3xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100/50">
            <HelpCircle size={18} className="text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Раздел</span>
              <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-600 font-black px-1.5 py-0.5 rounded-md leading-none uppercase">База знаний</span>
            </div>
            <h2 className="text-sm font-black text-slate-800 tracking-tight leading-none uppercase mt-1">FAQ</h2>
          </div>
        </div>

        {/* Global Stats Counter badges */}
        <div className="flex items-center flex-wrap gap-2 md:gap-4 md:border-l md:border-slate-100 md:pl-6">
          {isAdminMode && (
            <>
              <div className="flex flex-col items-start px-3 py-1 bg-white border border-slate-200/50 rounded-xl">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Опубликовано</span>
                <span className="text-[11px] font-extrabold text-emerald-600 mt-0.5">{publishedArticles.length}</span>
              </div>
              <div className="flex flex-col items-start px-3 py-1 bg-white border border-slate-200/50 rounded-xl">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Черновики</span>
                <span className="text-[11px] font-extrabold text-amber-500 mt-0.5">{draftArticles.length}</span>
              </div>
              <div className="flex flex-col items-start px-3 py-1 bg-white border border-slate-200/50 rounded-xl">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Всего статей</span>
                <span className="text-[11px] font-extrabold text-indigo-600 mt-0.5">{totalCount}</span>
              </div>
            </>
          )}

          <button
            onClick={() => {
              setIsAdminMode(!isAdminMode);
              setIsEditing(false);
              setIsCreating(false);
              triggerToast(isAdminMode ? "Включен режим пользователя" : "Включен режим администратора");
            }}
            className={`ml-2 px-3 py-1.5 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-3xs ${
              isAdminMode 
                ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-950" 
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            {isAdminMode ? (
              <>
                <UserCheck size={12} className="text-emerald-400" />
                <span>Администратор</span>
              </>
            ) : (
              <>
                <UserX size={12} className="text-slate-400" />
                <span>Пользователь</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Page Content Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className={`w-full lg:w-80 border-r border-slate-200/60 bg-white flex flex-col shrink-0 overflow-y-auto ${mobileActiveView === 'list' ? 'flex' : 'hidden lg:flex'}`}>


          {/* Search bar integration */}
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Поиск по базе знаний..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/50 focus:bg-white text-xs border border-slate-200/60 rounded-xl focus:outline-none focus:border-blue-500 transition-all font-medium text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Collapsible Topics and Articles List */}
          <div className="flex-1 p-3 space-y-5 overflow-y-auto">
            {categories.map((cat, idx) => {
              const catArticles = visibleArticles.filter(a => a.category === cat && (!isAdminMode || !a.isDraft));
              if (catArticles.length === 0) return null;

              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex items-center justify-between px-2 py-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Layers size={10} className="text-slate-400" />
                      {cat}
                    </span>
                    <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.2 rounded-md font-mono">
                      {catArticles.length}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {catArticles.map(art => (
                      <button
                        key={art.id}
                        onClick={() => {
                          setSelectedArticleId(art.id);
                          setIsEditing(false);
                          setIsCreating(false);
                          setMobileActiveView('detail');
                        }}
                        className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer border text-xs font-semibold ${
                          selectedArticleId === art.id && !isCreating
                            ? "bg-blue-50/70 border-blue-100/60 text-blue-600 shadow-3xs"
                            : "bg-white hover:bg-slate-50/70 border-transparent text-slate-600 hover:text-slate-800"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 transition-all ${
                            selectedArticleId === art.id && !isCreating
                              ? "bg-blue-600 ring-4 ring-blue-100"
                              : "bg-slate-300"
                          }`} />
                          <span className="line-clamp-2 leading-relaxed">{art.title}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Admin Drafts Section */}
            {isAdminMode && draftSectionArticles.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                    <FileText size={10} className="text-amber-500" />
                    Черновики
                  </span>
                  <span className="text-[9px] bg-amber-50 border border-amber-100 text-amber-600 font-bold px-1.5 py-0.2 rounded-md font-mono">
                    {draftSectionArticles.length}
                  </span>
                </div>

                <div className="space-y-1">
                  {draftSectionArticles.map(art => (
                    <button
                      key={art.id}
                      onClick={() => {
                        setSelectedArticleId(art.id);
                        setIsEditing(false);
                        setIsCreating(false);
                        setMobileActiveView('detail');
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer border text-xs font-semibold ${
                        selectedArticleId === art.id && !isCreating
                          ? "bg-amber-50/70 border-amber-100/60 text-amber-700 shadow-3xs"
                          : "bg-white hover:bg-slate-50/70 border-transparent text-slate-500 hover:text-slate-750"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 transition-all ${
                          selectedArticleId === art.id && !isCreating
                            ? "bg-amber-500 ring-4 ring-amber-100"
                            : "bg-slate-300"
                        }`} />
                        <span className="line-clamp-2 leading-relaxed">{art.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Empty visible articles fall-back */}
            {visibleArticles.length === 0 && (
              <div className="py-8 px-4 text-center">
                <p className="text-xs text-slate-400 font-bold">Статьи не найдены</p>
                <p className="text-[10px] text-slate-400 mt-1">Попробуйте изменить поисковый запрос</p>
              </div>
            )}
          </div>

          {/* Add Article Button (Sticky at sidebar bottom, Admin only) */}
          {isAdminMode && (
            <div className="p-4 border-t border-slate-100 shrink-0 bg-slate-50/50">
              <button
                onClick={handleStartCreate}
                className="w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100/50 border border-blue-200 text-blue-600 hover:text-blue-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-3xs hover:shadow-2xs cursor-pointer"
              >
                <Plus size={14} className="stroke-[2.5]" />
                <span>Новая статья</span>
              </button>
            </div>
          )}
        </aside>

        {/* Right Main Article Zone */}
        <div className={`flex-1 p-4 md:p-6 overflow-y-auto relative bg-slate-50/30 ${mobileActiveView === 'detail' ? 'block' : 'hidden lg:block'}`}>
          {/* Subtle blueprint grid wallpaper */}
          <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

          {/* Native Toast Messages within App */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed right-6 top-6 bg-slate-900 text-white rounded-xl shadow-lg px-4 py-3 text-xs font-semibold z-50 flex items-center gap-2 border border-slate-800"
              >
                <Sparkles size={14} className="text-amber-400" />
                <span>{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            {/* Mobile Adaptive Back navigation bar */}
            <div className="lg:hidden flex items-center justify-between border-b border-slate-100/85 pb-3.5 mb-2 shrink-0">
              <button
                onClick={() => setMobileActiveView('list')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs shadow-3xs cursor-pointer"
              >
                <ChevronLeft size={14} className="text-slate-500" />
                <span>Назад к разделу</span>
              </button>
              
              <span className="text-[9px] bg-slate-100 border border-slate-200/60 text-slate-500 font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                База знаний
              </span>
            </div>

            {/* Editing / Creating Form View */}
            {isAdminMode && (isEditing || isCreating) ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200/60 shadow-md p-6 space-y-5"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Edit3 size={15} />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                        {isCreating ? "Новая статья базы знаний" : "Редактирование статьи"}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                        Пожалуйста, заполните все поля перед сохранением публикации
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setIsCreating(false);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all"
                    title="Отмена"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Form Inputs Grid */}
                <div className="space-y-4 text-xs font-bold text-slate-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Category Column */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">Раздел / Категория</label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 font-semibold text-slate-800"
                      >
                        <option value="Запуск арбитража">Запуск арбитража</option>
                        <option value="Биржи и API">Биржи и API</option>
                        <option value="Оплата и доступ">Оплата и доступ</option>
                      </select>
                    </div>

                    {/* Status Column */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">Статус публикации</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditIsDraft(false)}
                          className={`flex-1 py-1.5 text-center rounded-xl border font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                            !editIsDraft 
                              ? "bg-emerald-50 border-emerald-200 text-emerald-600 shadow-3xs" 
                              : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                          }`}
                        >
                          <Check size={12} className={!editIsDraft ? "text-emerald-500" : "opacity-0"} />
                          Опубликовано
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditIsDraft(true)}
                          className={`flex-1 py-1.5 text-center rounded-xl border font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                            editIsDraft 
                              ? "bg-amber-50 border-amber-200 text-amber-600 shadow-3xs" 
                              : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                          }`}
                        >
                          <FileText size={12} className={editIsDraft ? "text-amber-500" : "opacity-0"} />
                          Черновик
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Title of article */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">Заголовок статьи</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Например: Как правильно привязать API ключи биржи HTX?"
                      className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 font-semibold text-slate-800 placeholder-slate-400"
                    />
                  </div>

                  {/* Content of article */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">Текст статьи (поддерживается перенос строк)</label>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={8}
                      placeholder="Введите подробные инструкции, руководства или шаги решения проблемы..."
                      className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 font-semibold text-slate-800 placeholder-slate-400 leading-relaxed font-sans"
                    />
                  </div>
                </div>

                {/* Form Action buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setIsCreating(false);
                    }}
                    className="px-4 py-2 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw size={12} />
                    <span>Отмена</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold tracking-tight transition-all shadow-md shadow-blue-100 cursor-pointer flex items-center gap-1.5"
                  >
                    <Save size={12} />
                    <span>Сохранить</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Regular View mode of selected article */
              selectedArticle ? (
                <motion.div
                  key={selectedArticle.id}
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl border border-slate-200/60 shadow-3xs hover:shadow-2xs transition-all relative overflow-hidden"
                >
                  {/* Visual Status strip header inside card */}
                  <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wide whitespace-nowrap">
                        {selectedArticle.category}
                      </span>
                      {selectedArticle.isDraft ? (
                        <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-100 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wide whitespace-nowrap">
                          В черновиках
                        </span>
                      ) : (
                        <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wide whitespace-nowrap">
                          Опубликовано
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      {/* Last updated indicator */}
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 font-mono tracking-wider">
                        <Calendar size={11} className="text-slate-300" />
                        Обновлено {selectedArticle.updatedAt}
                      </span>

                      {/* Admin operational editing buttons */}
                      {isAdminMode && (
                        <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
                          <button
                            onClick={handleStartEdit}
                            className="p-1.5 sm:p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 transition-all cursor-pointer shadow-3xs"
                            title="Редактировать статью"
                          >
                            <Edit3 size={12} className="stroke-[2.5]" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(selectedArticle.id)}
                            className="p-1.5 sm:p-2 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-100 rounded-xl text-slate-500 hover:text-rose-600 transition-all cursor-pointer shadow-3xs"
                            title="Удалить статью"
                          >
                            <Trash2 size={12} className="stroke-[2.5]" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body Content element */}
                  <div className="p-6 md:p-8 space-y-5">
                    <h1 className="text-basic md:text-lg font-black text-slate-800 tracking-tight leading-snug">
                      {selectedArticle.title}
                    </h1>

                    <div className="bg-[#FAFBFD]/90 border border-[#EDF1FD] rounded-2xl p-5 md:p-6 text-xs sm:text-[13px] leading-relaxed font-semibold text-slate-700 font-sans shadow-3xs whitespace-pre-line">
                      {selectedArticle.content}
                    </div>

                    {/* Bottom action banner */}
                    {feedbackStatus === 'none' && (
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between text-xs font-semibold text-slate-600">
                        <div className="flex items-center gap-2">
                          <BookOpen size={14} className="text-blue-500" />
                          <span>Помог ли вам этот ответ?</span>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setFeedbackStatus('yes')} 
                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold leading-none cursor-pointer"
                          >
                            Да
                          </button>
                          <button 
                            onClick={() => setFeedbackStatus('no')} 
                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 transition-all text-xs font-bold leading-none cursor-pointer"
                          >
                            Нет
                          </button>
                        </div>
                      </div>
                    )}

                    {feedbackStatus === 'yes' && (
                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 space-y-3 text-xs font-semibold text-slate-700 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-emerald-700 font-bold">
                            <Check size={16} className="text-emerald-500" />
                            <span>Отлично! Что именно понравилось вам в этой статье?</span>
                          </div>
                          <button 
                            onClick={() => setFeedbackStatus('none')} 
                            className="p-1 text-slate-400 hover:text-slate-650 rounded-md transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">Ваш голос помогает нам улучшать Базу Знаний.</p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <button
                            onClick={() => {
                              setFeedbackStatus('submitted_yes');
                              triggerToast("Спасибо за ваш отзыв!");
                            }}
                            className="px-3 py-2 bg-white hover:bg-emerald-50/40 border border-emerald-200 hover:border-emerald-300 text-emerald-700 font-black text-[10px] uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-3xs"
                          >
                            <FileText size={13} className="text-emerald-500" />
                            <span>Четкая инструкция</span>
                          </button>
                          <button
                            onClick={() => {
                              setFeedbackStatus('submitted_yes');
                              triggerToast("Спасибо за ваш отзыв!");
                            }}
                            className="px-3 py-2 bg-white hover:bg-emerald-50/40 border border-emerald-200 hover:border-emerald-300 text-emerald-700 font-black text-[10px] uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-3xs"
                          >
                            <Zap size={13} className="text-emerald-550" />
                            <span>Простой язык</span>
                          </button>
                          <button
                            onClick={() => {
                              setFeedbackStatus('submitted_yes');
                              triggerToast("Спасибо за ваш отзыв!");
                            }}
                            className="px-3 py-2 bg-white hover:bg-emerald-50/40 border border-emerald-200 hover:border-emerald-300 text-emerald-700 font-black text-[10px] uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-3xs"
                          >
                            <Target size={13} className="text-emerald-600" />
                            <span>Прямо в точку</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {feedbackStatus === 'no' && (
                      <div className="bg-amber-50/40 border border-amber-100 rounded-xl p-4 space-y-3 text-xs font-semibold text-slate-700 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-amber-700 font-bold">
                            <ShieldAlert size={16} className="text-amber-500" />
                            <span>Что именно не понравилось в этой статье?</span>
                          </div>
                          <button 
                            onClick={() => {
                              setFeedbackStatus('none');
                              setFeedbackComment('');
                              setShowCustomCommentForm(false);
                            }} 
                            className="p-1 text-slate-400 hover:text-slate-650 rounded-md transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        
                        {!showCustomCommentForm ? (
                          <div className="space-y-2">
                            <p className="text-[11px] text-slate-500 font-medium font-sans">Выберите готовую причину или опишите свою:</p>
                            <div className="flex flex-wrap gap-2 pt-1">
                              <button
                                onClick={() => {
                                  setFeedbackStatus('submitted_no');
                                  triggerToast("Спасибо за ваш отзыв!");
                                }}
                                className="px-3 py-2 bg-white hover:bg-amber-50/40 border border-amber-200 hover:border-amber-300 text-amber-700 font-black text-[10px] uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-3xs"
                              >
                                <Clock size={13} className="text-amber-500" />
                                <span>Устаревшие данные</span>
                              </button>
                              <button
                                onClick={() => {
                                  setFeedbackStatus('submitted_no');
                                  triggerToast("Спасибо за ваш отзыв!");
                                }}
                                className="px-3 py-2 bg-white hover:bg-amber-50/40 border border-amber-200 hover:border-amber-300 text-amber-700 font-black text-[10px] uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-3xs"
                              >
                                <HelpCircle size={13} className="text-amber-500" />
                                <span>Сложная инструкция</span>
                              </button>
                              <button
                                onClick={() => {
                                  setFeedbackStatus('submitted_no');
                                  triggerToast("Спасибо за ваш отзыв!");
                                }}
                                className="px-3 py-2 bg-white hover:bg-amber-50/40 border border-amber-200 hover:border-amber-300 text-amber-700 font-black text-[10px] uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-3xs"
                              >
                                <UserX size={13} className="text-amber-550" />
                                <span>Не решает проблему</span>
                              </button>
                              <button
                                onClick={() => {
                                  setShowCustomCommentForm(true);
                                }}
                                className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white font-black text-[10px] uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-3xs hover:shadow-2xs"
                              >
                                <Edit3 size={13} className="text-amber-100" />
                                <span>Другая причина...</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <textarea
                              value={feedbackComment}
                              onChange={(e) => setFeedbackComment(e.target.value)}
                              placeholder="Напишите, что было непонятно или какой шаг вызвал затруднения..."
                              rows={3}
                              className="w-full bg-white border border-amber-200 focus:border-amber-400 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-300 resize-none font-sans"
                            />
                            <div className="flex justify-end gap-2 text-xs">
                              <button
                                onClick={() => {
                                  setShowCustomCommentForm(false);
                                  setFeedbackComment('');
                                }}
                                className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold rounded-lg transition-all cursor-pointer text-[11px]"
                              >
                                Назад
                              </button>
                              <button
                                onClick={() => {
                                  setFeedbackStatus('submitted_no');
                                  triggerToast("Спасибо за ваш отзыв!");
                                }}
                                disabled={!feedbackComment.trim()}
                                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all shadow-3xs cursor-pointer text-[11px]"
                              >
                                Отправить
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {(feedbackStatus === 'submitted_yes' || feedbackStatus === 'submitted_no') && (
                      <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold text-slate-700 animate-fadeIn">
                        <div className="flex items-start gap-2.5">
                          <div className="p-1 rounded-full bg-emerald-100 text-emerald-600 shrink-0 mt-0.5">
                            <Check size={13} className="stroke-[2.5]" />
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-emerald-800 font-bold text-xs leading-snug">Спасибо за ваш отзыв!</p>
                            <p className="text-[11px] text-slate-500 font-medium leading-normal">Мы учтем его для улучшения этой статьи.</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setFeedbackStatus('none');
                            setFeedbackComment('');
                          }} 
                          className="self-start sm:self-auto px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 text-slate-600 hover:text-slate-800 font-black text-[10px] uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap shadow-3xs"
                        >
                          Изменить ответ
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-md p-10 text-center text-slate-500">
                  <ShieldAlert size={40} className="mx-auto text-slate-350 stroke-[1.5] mb-3" />
                  <p className="text-sm font-extrabold text-slate-700">База знаний пуста</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                    Добавьте свою первую статью с помощью кнопки в панели управления или сбросьте фильтры поиска.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
