import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  PlayCircle,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  CloudUpload,
  Maximize,
  Play,
  BookOpen,
  User as UserIcon,
} from "lucide-react";
import { User } from "firebase/auth";
import { initAuth } from "./lib/auth";
import { courseData, CourseItem } from "./data";
import Mermaid from "./components/Mermaid";
import TeacherPanel from "./components/TeacherPanel";
import StudentPanel from "./components/StudentPanel";
import BookmarksMenu from "./components/BookmarksMenu";

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // 'course' | 'student' | 'teacher'
  const [viewMode, setViewMode] = useState<"course" | "student" | "teacher">(
    "course",
  );

  const activeCourse = courseData[currentStep];
  const loggedInStudentId = localStorage.getItem("studentId");
  const isStudentLoggedIn = !!loggedInStudentId;

  useEffect(() => {
    const unsub = initAuth(
      (user) => setCurrentUser(user),
      () => setCurrentUser(null),
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    setZoomLevel(100);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  // Group items for the sidebar
  const courseGroups = useMemo(() => {
    return courseData.reduce(
      (acc, course, index) => {
        if (!acc[course.chapter]) acc[course.chapter] = [];
        acc[course.chapter].push({ ...course, globalIndex: index });
        return acc;
      },
      {} as Record<string, (CourseItem & { globalIndex: number })[]>,
    );
  }, []);

  const handleOpenNewWindow = (code: string) => {
    const newWin = window.open("", "_blank");
    if (newWin) {
      newWin.document.write(`
        <!DOCTYPE html>
        <html lang="zh-TW">
        <head>
            <meta charset="UTF-8">
            <title>Scratch 廣播訊息架構圖 (全螢幕)</title>
            <script src="https://cdn.jsdelivr.net/npm/mermaid@9.4.3/dist/mermaid.min.js"><\/script>
            <script>
                mermaid.initialize({
                    startOnLoad: true,
                    theme: 'default',
                    securityLevel: 'loose',
                });
            <\/script>
            <style>
                body { background-color: #f8fafc; margin: 0; padding: 40px; overflow: auto; font-family: "Noto Sans TC", sans-serif; display: flex; justify-content: center; }
                .mermaid svg { max-width: none !important; height: auto !important; transform: scale(1.2); transform-origin: top center; }
                .hint { position: fixed; top: 15px; left: 15px; background: rgba(15, 23, 42, 0.8); color: white; padding: 10px 16px; border-radius: 8px; font-size: 14px; z-index: 100; pointer-events: none; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            </style>
        </head>
        <body>
            <div class="hint">💡 提示：您可以使用瀏覽器內建功能 (Ctrl + 滑鼠滾輪) 自由縮放</div>
            <div class="mermaid">${code}</div>
            <script>
              setTimeout(() => { document.querySelector('.mermaid').removeAttribute('data-processed'); mermaid.init(undefined, document.querySelector('.mermaid')); }, 100);
            <\/script>
        </body>
        </html>
      `);
      newWin.document.close();
    } else {
      alert("開啟失敗，請確認您的瀏覽器沒有阻擋「彈出式視窗」喔！");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-4 sticky top-0 z-50 flex flex-col md:flex-row justify-between items-center gap-4 transition-all">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 lg:p-2.5 rounded-xl shadow-sm text-white">
            <Play className="w-5 h-5 lg:w-6 lg:h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-indigo-500">
              Scratch 基本功
            </h1>
            <p className="text-sm font-medium text-slate-500 hidden md:block mt-1">
              宜蘭縣教育處 學習資源
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() =>
              setViewMode(viewMode === "teacher" ? "course" : "teacher")
            }
            className={`group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
              viewMode === "teacher" || (currentUser && currentUser.email)
                ? "bg-indigo-600 text-white hover:bg-indigo-500"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <BookOpen
              className="group-hover:-translate-y-0.5 transition-transform"
              size={18}
            />
            {currentUser && currentUser.email ? "老師面板" : "老師登入"}
          </button>

          <button
            onClick={() =>
              setViewMode(viewMode === "student" ? "course" : "student")
            }
            className={`group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
              viewMode === "student" || isStudentLoggedIn
                ? "bg-emerald-600 text-white hover:bg-emerald-500"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <UserIcon
              className="group-hover:-translate-y-0.5 transition-transform"
              size={18}
            />
            {isStudentLoggedIn ? "學生面板" : "學生登入"}
          </button>

          <BookmarksMenu />
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row flex-1 w-full max-w-[1600px] mx-auto">
        {/* Left Sidebar */}
        <div className="w-full md:w-80 lg:w-[360px] shrink-0 bg-white border-r border-slate-200 flex flex-col h-auto md:h-[calc(100vh-80px)] md:sticky md:top-[80px] overflow-y-auto">
          <div className="p-6 lg:p-8 flex flex-col gap-8">
            {(
              Object.entries(courseGroups) as [
                string,
                (CourseItem & { globalIndex: number })[],
              ][]
            ).map(([chapter, courses]) => (
              <div key={chapter}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px bg-slate-200 flex-1"></div>
                  <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest">
                    {chapter}
                  </h3>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                <div className="flex flex-col gap-2">
                  {courses.map((course, localIndex) => {
                    const isActive = currentStep === course.globalIndex;
                    const isCompleted = currentStep > course.globalIndex;

                    return (
                      <button
                        key={course.id}
                        onClick={() => {
                          setCurrentStep(course.globalIndex);
                          if (viewMode !== "course") {
                            setViewMode("course");
                          }
                        }}
                        className={`group flex items-center text-left p-3.5 rounded-2xl transition-all duration-300 ${
                          isActive
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200/50"
                            : "hover:bg-slate-50 border border-transparent hover:border-slate-200 text-slate-600"
                        }`}
                      >
                        <div className="mr-3.5 shrink-0 transition-transform group-hover:scale-110">
                          {isCompleted ? (
                            <CheckCircle2
                              className="text-emerald-500"
                              size={24}
                            />
                          ) : (
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"}`}
                            >
                              {localIndex + 1}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3
                            className={`font-bold ${isActive ? "text-white" : "text-slate-700"}`}
                          >
                            {course.shortTitle}
                          </h3>
                        </div>
                        {isActive && (
                          <ChevronRight className="text-white/70" size={20} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 p-4 md:p-8 lg:p-12 h-auto md:h-[calc(100vh-80px)] overflow-y-auto relative bg-slate-50/50">
          <AnimatePresence mode="wait">
            {viewMode === "teacher" ? (
              <motion.div
                key="teacherPanel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full flex flex-col py-10"
              >
                <TeacherPanel
                  currentUser={currentUser}
                  onBack={() => setViewMode("course")}
                />
              </motion.div>
            ) : viewMode === "student" ? (
              <motion.div
                key="studentPanel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full flex flex-col justify-center py-10"
              >
                <StudentPanel
                  currentUser={currentUser}
                  onBack={() => setViewMode("course")}
                />
              </motion.div>
            ) : (
              <motion.div
                key={activeCourse.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="max-w-4xl mx-auto w-full"
              >
                {/* Breadcrumb / Chapter pill */}
                <div className="mb-6 flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold tracking-wide">
                    {activeCourse.chapter}
                  </span>
                  <span className="text-slate-400 font-medium">/</span>
                  <span className="text-slate-500 font-medium">
                    {activeCourse.shortTitle}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="bg-white p-6 lg:p-10 rounded-[2rem] shadow-sm border border-slate-200 mb-8">
                  <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
                    {activeCourse.title}
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed font-medium">
                    {activeCourse.description}
                  </p>
                </div>

                {/* YouTube Link Block */}
                {activeCourse.videoId && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-6 lg:p-8 border border-red-100 mb-8 shadow-sm"
                  >
                    <div className="flex items-center mb-6 sm:mb-0 w-full sm:w-auto">
                      <div className="bg-white p-3 rounded-2xl shadow-sm mr-5 text-red-600">
                        <PlayCircle size={32} strokeWidth={2} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-xl mb-1">
                          前往 YouTube 觀看教學
                        </h4>
                        <p className="text-sm font-medium text-slate-600">
                          點擊按鈕將自動跳轉至此進度的重點秒數
                        </p>
                      </div>
                    </div>
                    <a
                      href={`https://www.youtube.com/watch?v=${activeCourse.videoId}&t=${activeCourse.startTime}s`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg"
                    >
                      <ExternalLink size={20} />
                      開啟影片 (從 {Math.floor(activeCourse.startTime / 60)}:
                      {String(activeCourse.startTime % 60).padStart(2, "0")}{" "}
                      開始)
                    </a>
                  </motion.div>
                )}

                {/* Mermaid Diagram Block */}
                {activeCourse.mermaidCode && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8"
                  >
                    <div className="bg-slate-900 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="bg-slate-800 p-2 rounded-xl text-indigo-400">
                          <BookOpen size={20} />
                        </div>
                        <h3 className="text-white font-bold tracking-wide">
                          Scratch 廣播訊息架構圖
                        </h3>
                      </div>
                      {/* Controls */}
                      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                        <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
                          <button
                            onClick={() =>
                              setZoomLevel((prev) => Math.max(50, prev - 20))
                            }
                            className="text-slate-400 hover:text-white hover:bg-slate-700 w-8 h-8 flex items-center justify-center rounded-lg font-bold transition-colors"
                            title="縮小"
                          >
                            -
                          </button>
                          <span className="text-slate-300 text-xs px-2 min-w-[3.5rem] text-center font-bold tracking-wide">
                            {zoomLevel}%
                          </span>
                          <button
                            onClick={() =>
                              setZoomLevel((prev) => Math.min(200, prev + 20))
                            }
                            className="text-slate-400 hover:text-white hover:bg-slate-700 w-8 h-8 flex items-center justify-center rounded-lg font-bold transition-colors"
                            title="放大"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            handleOpenNewWindow(activeCourse.mermaidCode!)
                          }
                          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm"
                          title="在新分頁開啟全螢幕檢視"
                        >
                          <Maximize size={16} />
                          <span className="hidden sm:inline">全螢幕開啟</span>
                        </button>
                      </div>
                    </div>
                    <div
                      className="p-4 md:p-8 overflow-auto bg-slate-50 border-t border-slate-200"
                      style={{ maxHeight: "600px" }}
                    >
                      <div
                        className="flex justify-center transition-transform duration-300 origin-top"
                        style={{
                          transform: `scale(${zoomLevel / 100})`,
                          minWidth: "940px",
                        }}
                      >
                        <Mermaid chart={activeCourse.mermaidCode} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Learning Points */}
                {activeCourse.learningPoints && (
                  <div className="bg-amber-50/80 rounded-3xl p-6 lg:p-8 border border-amber-200 mb-8 shadow-sm">
                    <h4 className="font-extrabold text-amber-900 mb-6 text-xl flex items-center gap-3">
                      <span className="bg-amber-200/50 p-2 rounded-xl text-lg">
                        💡
                      </span>{" "}
                      重點觀念整理
                    </h4>
                    <ul className="space-y-4">
                      {activeCourse.learningPoints.map((point, idx) => {
                        const parts = point.split("**");
                        return (
                          <li
                            key={idx}
                            className="text-slate-700 leading-relaxed flex items-start text-lg font-medium"
                          >
                            <span className="text-amber-500 mr-4 mt-1">✦</span>
                            <span>
                              {parts.map((part, i) =>
                                i % 2 === 1 ? (
                                  <strong
                                    key={i}
                                    className="text-amber-900 bg-amber-100/60 px-1 rounded-md"
                                  >
                                    {part}
                                  </strong>
                                ) : (
                                  part
                                ),
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Footer navigation */}
                <div className="flex justify-between items-center pt-8 border-t border-slate-200 mt-12 pb-12">
                  <button
                    onClick={() =>
                      setCurrentStep((prev) => Math.max(0, prev - 1))
                    }
                    disabled={currentStep === 0}
                    className={`px-6 py-3.5 rounded-full font-bold transition-all ${
                      currentStep === 0
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed opacity-50"
                        : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm"
                    }`}
                  >
                    上一課
                  </button>

                  <button
                    onClick={() =>
                      setCurrentStep((prev) =>
                        Math.min(courseData.length - 1, prev + 1),
                      )
                    }
                    disabled={currentStep === courseData.length - 1}
                    className={`px-8 py-3.5 rounded-full font-bold transition-all ${
                      currentStep === courseData.length - 1
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed hidden"
                        : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-200"
                    }`}
                  >
                    完成並前往下一課
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
