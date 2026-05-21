import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { logout } from "../lib/auth";
import {
  markAttendance,
  getTasks,
  getStudentTaskCompletions,
  toggleTaskCompletion,
  TaskRecord,
  TaskCompletion,
} from "../lib/db";
import {
  CheckCircle2,
  Circle,
  LogOut,
  User as UserIcon,
  BookOpen,
  RefreshCw,
} from "lucide-react";
import { VALID_STUDENTS } from "../data";

interface StudentPanelProps {
  onBack: () => void;
  currentUser: User | null;
}

export default function StudentPanel({
  onBack,
  currentUser,
}: StudentPanelProps) {
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [completions, setCompletions] = useState<Record<string, boolean>>({});

  // If already logged in, check if it's a student session
  // We'll store the verified studentId in localStorage
  const loggedInStudentId = localStorage.getItem("studentId");
  const isLoggedIn = !!loggedInStudentId;

  useEffect(() => {
    if (isLoggedIn) {
      loadData(loggedInStudentId);
      markAttendance(loggedInStudentId).catch(console.error);
    }
  }, [isLoggedIn, loggedInStudentId]);

  const loadData = async (sid: string) => {
    setIsLoading(true);
    try {
      const [t, c] = await Promise.all([
        getTasks(),
        getStudentTaskCompletions(sid),
      ]);
      setTasks(t);
      const compMap: Record<string, boolean> = {};
      c.forEach((comp) => {
        compMap[comp.taskId] = true;
      });
      setCompletions(compMap);
    } catch (err: any) {
      console.error(err);
      setError("載入資料失敗");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!VALID_STUDENTS.includes(studentId.trim())) {
      setError("無效的學生帳號！請輸入正確的班級+座號。");
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      localStorage.setItem("studentId", studentId.trim());
      // Force trigger re-render by updating local state or triggering a reload
      window.location.reload();
    } catch (err) {
      setError("登入失敗，請稍後再試。");
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("studentId");
    window.location.reload();
  };

  const toggleTask = async (taskId: string) => {
    if (!loggedInStudentId) return;
    const isCompleted = !completions[taskId];

    // Optimistic update
    setCompletions((prev) => ({ ...prev, [taskId]: isCompleted }));
    try {
      await toggleTaskCompletion(loggedInStudentId, taskId, isCompleted);
    } catch (err) {
      // Revert on error
      setCompletions((prev) => ({ ...prev, [taskId]: !isCompleted }));
      alert("更新狀態失敗，請檢測網路連線。");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 text-center max-w-sm mx-auto">
        <div className="bg-indigo-100 text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserIcon size={32} strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">學生登入</h2>
        <p className="text-slate-500 mb-6 text-sm">
          請輸入您的班級與座號來登入系統並記錄出席
        </p>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <input
              type="text"
              required
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                setError("");
              }}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-center text-lg font-bold tracking-widest text-slate-700"
              placeholder="例: 40108"
              maxLength={5}
            />
          </div>
          {error && (
            <p className="text-red-500 font-bold text-sm text-center bg-red-50 py-2 rounded-lg">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading || studentId.length !== 5}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <RefreshCw className="animate-spin" size={20} />
            ) : (
              "登入並簽到"
            )}
          </button>
        </form>
        <button
          onClick={onBack}
          className="mt-6 text-sm text-slate-400 hover:text-slate-600 font-medium"
        >
          返回首頁
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full">
            <UserIcon size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              學生學習檢視面板
            </h2>
            <p className="text-sm font-medium text-emerald-600 mt-1">
              ✓ {loggedInStudentId} 已完成今日簽到
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-colors"
          >
            返回課程
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"
          >
            <LogOut size={16} /> 登出
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="text-indigo-500" size={20} />
          <h3 className="font-bold text-lg text-slate-800">本期學習任務</h3>
        </div>

        {isLoading && tasks.length === 0 ? (
          <div className="py-12 flex justify-center">
            <RefreshCw className="animate-spin text-slate-300" size={32} />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
            <p className="text-slate-500 font-medium">
              目前老師尚未發布任何學習任務
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const isDone = !!completions[task.id!];
              return (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id!)}
                  className={`w-full flex items-center p-4 rounded-2xl transition-all duration-300 text-left border-2 ${
                    isDone
                      ? "bg-emerald-50 border-emerald-200 hover:bg-emerald-100 shadow-sm"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm"
                  }`}
                >
                  <div
                    className={`mr-4 transition-transform duration-300 ${isDone ? "scale-110" : ""}`}
                  >
                    {isDone ? (
                      <CheckCircle2
                        className="text-emerald-500 fill-emerald-100"
                        size={28}
                      />
                    ) : (
                      <Circle className="text-slate-300" size={28} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`font-bold text-lg ${isDone ? "text-emerald-800 line-through opacity-70" : "text-slate-700"}`}
                    >
                      {task.title}
                    </h4>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
