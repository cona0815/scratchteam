import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { googleSignIn, logout } from "../lib/auth";
import {
  getLocalDateString,
  getAttendances,
  createTask,
  getTasks,
  getAllTaskCompletions,
  AttendanceRecord,
  TaskRecord,
  TaskCompletion,
} from "../lib/db";
import {
  LogOut,
  UserCheck,
  BookOpen,
  RefreshCw,
  Plus,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { VALID_STUDENTS } from "../data";

export default function TeacherPanel({
  currentUser,
  onBack,
}: {
  currentUser: User | null;
  onBack?: () => void;
}) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "tasks">(
    "dashboard",
  );
  const [isLoading, setIsLoading] = useState(false);

  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [completions, setCompletions] = useState<TaskCompletion[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const isTeacher = currentUser && currentUser.email;

  useEffect(() => {
    if (isTeacher) {
      loadData();
    }
  }, [isTeacher, activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const date = getLocalDateString();
      const [a, t, c] = await Promise.all([
        getAttendances(date),
        getTasks(),
        getAllTaskCompletions(),
      ]);
      setAttendances(a);
      setTasks(t);
      setCompletions(c);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await googleSignIn();
    } catch (err: any) {
      console.error("Login failed:", err);
      alert("登入失敗");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !currentUser?.email) return;
    setIsLoading(true);
    try {
      await createTask(newTaskTitle.trim(), currentUser.email);
      setNewTaskTitle("");
      await loadData();
    } catch (err: any) {
      console.error(err);
      alert("新增任務失敗: " + (err.message || String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isTeacher) {
    return (
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 max-w-sm mx-auto text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-2">
          <BookOpen className="text-indigo-600" size={24} />
          老師管理介面
        </h2>
        <p className="text-slate-600 mb-8 text-sm">
          請使用 Google 帳號登入來管理學生出缺席與設定學習任務
        </p>
        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="flex items-center justify-center w-full gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          {isLoggingIn ? (
            <RefreshCw className="animate-spin text-slate-400" size={20} />
          ) : (
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 48 48"
              className="mr-2"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              ></path>
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              ></path>
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              ></path>
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              ></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
          )}
          Google 登入
        </button>
        {onBack && (
          <button
            onClick={onBack}
            className="mt-6 text-sm text-slate-400 hover:text-slate-600 font-medium"
          >
            返回課程
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 max-w-5xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="text-indigo-600" size={24} />
          老師管理介面
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            {currentUser.email}
          </span>
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-xl transition-colors font-bold text-sm"
            >
              返回課程
            </button>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 px-3 py-1.5 rounded-xl transition-colors font-bold text-sm"
          >
            登出
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 p-1.5 bg-slate-100 rounded-2xl">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
            activeTab === "dashboard"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          📊 全班儀表板
        </button>
        <button
          onClick={() => setActiveTab("tasks")}
          className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
            activeTab === "tasks"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          🎓 學習任務設定
        </button>
      </div>

      {isLoading && (
        <div className="py-4 text-center text-slate-400 font-bold flex items-center justify-center gap-2">
          <RefreshCw className="animate-spin" size={18} /> 載入中...
        </div>
      )}

      {!isLoading && activeTab === "dashboard" && (
        <div className="space-y-4">
          <div className="flex justify-between items-end mb-2">
            <h3 className="font-bold text-lg text-slate-800">
              今日 ({getLocalDateString()}) 學習進度
            </h3>
            <button
              onClick={loadData}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-bold flex items-center gap-1"
            >
              <RefreshCw size={14} /> 重新整理
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-3 text-slate-600 font-bold text-sm min-w-[80px]">
                    座號
                  </th>
                  <th className="p-3 text-slate-600 font-bold text-sm min-w-[80px]">
                    今日出席
                  </th>
                  {tasks.map((t) => (
                    <th
                      key={t.id}
                      className="p-3 text-slate-600 font-bold text-sm max-w-[150px] truncate"
                      title={t.title}
                    >
                      {t.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {VALID_STUDENTS.map((sid) => {
                  const hasAttended = attendances.some(
                    (a) => a.studentId === sid,
                  );
                  return (
                    <tr
                      key={sid}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-3 font-mono font-bold text-slate-700">
                        {sid}
                      </td>
                      <td className="p-3">
                        {hasAttended ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-xs font-bold w-fit">
                            <CheckCircle2 size={12} /> 已簽到
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded text-xs font-bold w-fit opacity-60">
                            <XCircle size={12} /> 未簽到
                          </span>
                        )}
                      </td>
                      {tasks.map((t) => {
                        const isDone = completions.some(
                          (c) => c.taskId === t.id && c.studentId === sid,
                        );
                        return (
                          <td key={t.id} className="p-3">
                            {isDone ? (
                              <CheckCircle2
                                className="text-emerald-500"
                                size={20}
                              />
                            ) : (
                              <span className="text-slate-200 font-bold">
                                -
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!isLoading && activeTab === "tasks" && (
        <div className="space-y-8">
          <form onSubmit={handleCreateTask} className="flex gap-3">
            <input
              type="text"
              required
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="新增任務 (例：完成第一課的臉型設計)"
              className="flex-1 border-2 border-slate-200 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Plus size={20} /> 新增
            </button>
          </form>

          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-800">已建立任務列表</h3>
            {tasks.length === 0 ? (
              <p className="text-slate-500 bg-slate-50 p-4 rounded-xl">
                尚未建立任務
              </p>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => {
                  const completedBy = completions
                    .filter((c) => c.taskId === task.id)
                    .map((c) => c.studentId);
                  return (
                    <div
                      key={task.id}
                      className="bg-white border-2 border-slate-100 rounded-2xl p-5 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-lg text-slate-800">
                          {task.title}
                        </h4>
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-black px-2 py-1 rounded-lg">
                          已完成 {completedBy.length} 人
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {completedBy.map((sid) => (
                          <span
                            key={sid}
                            className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1"
                          >
                            <CheckCircle2 size={14} /> {sid}
                          </span>
                        ))}
                        {completedBy.length === 0 && (
                          <span className="text-xs text-slate-400 font-medium">
                            尚未有學生完成
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
