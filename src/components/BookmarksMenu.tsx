import React, { useState, useEffect, useRef } from 'react';
import { Bookmark, GraduationCap, CloudUpload, Link as LinkIcon, Plus, X, ExternalLink, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  iconType: 'GraduationCap' | 'CloudUpload' | 'Link';
  isDefault: boolean;
}

const DEFAULT_BOOKMARKS: BookmarkItem[] = [
  {
    id: 'default-1',
    title: '加入 Google Classroom',
    url: 'https://classroom.google.com/c/ODM5NjI1ODc2NDg3?cjc=2zq3psgj',
    iconType: 'GraduationCap',
    isDefault: true
  },
  {
    id: 'default-2',
    title: '作業上傳',
    url: 'https://stuworkupload.netlify.app/',
    iconType: 'CloudUpload',
    isDefault: true
  },
  {
    id: 'default-3',
    title: 'Scratch 基礎教學',
    url: 'https://steam.oxxostudio.tw/category/scratch/index.html#google_vignette',
    iconType: 'Link',
    isDefault: true
  }
];

export default function BookmarksMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(DEFAULT_BOOKMARKS);
  const menuRef = useRef<HTMLDivElement>(null);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('custom_bookmarks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBookmarks([...DEFAULT_BOOKMARKS, ...parsed]);
      } catch (e) {
        console.error('Failed to parse bookmarks', e);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsEditing(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveCustomBookmarks = (items: BookmarkItem[]) => {
    const customItems = items.filter(b => !b.isDefault);
    localStorage.setItem('custom_bookmarks', JSON.stringify(customItems));
    setBookmarks(items);
  };

  const addBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    let finalUrl = newUrl.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    const newItem: BookmarkItem = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      url: finalUrl,
      iconType: 'Link',
      isDefault: false
    };

    saveCustomBookmarks([...bookmarks, newItem]);
    setNewTitle('');
    setNewUrl('');
    setIsEditing(false);
  };

  const removeBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    saveCustomBookmarks(bookmarks.filter(b => b.id !== id));
  };

  const renderIcon = (type: string, className?: string) => {
    switch (type) {
      case 'GraduationCap': return <GraduationCap size={18} className={className} />;
      case 'CloudUpload': return <CloudUpload size={18} className={className} />;
      default: return <LinkIcon size={18} className={className} />;
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm border ${
          isOpen 
            ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        }`}
      >
        <Bookmark size={18} className={isOpen ? "text-indigo-600" : "text-slate-500 group-hover:text-indigo-500 transition-colors"} />
        <span>常用網頁</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
          >
            <div className="p-3 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-700">常用網頁連結</span>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`p-1.5 rounded-lg transition-colors ${isEditing ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 hover:bg-slate-200 hover:text-slate-700'}`}
                title="編輯連結"
              >
                <Settings size={16} />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto outline-none p-2 space-y-1">
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="relative group">
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                    onClick={(e) => isEditing && e.preventDefault()}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 shrink-0">
                      {renderIcon(bookmark.iconType)}
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <p className="text-sm font-bold text-slate-800 truncate">{bookmark.title}</p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{bookmark.url}</p>
                    </div>
                    {!isEditing && (
                      <ExternalLink size={14} className="text-slate-300 group-hover:text-indigo-400 absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </a>
                  
                  {isEditing && !bookmark.isDefault && (
                    <button
                      onClick={(e) => removeBookmark(bookmark.id, e)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors bg-white shadow-sm border border-slate-100"
                      title="移除連結"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="p-3 bg-slate-50 border-t border-slate-100">
                <form onSubmit={addBookmark} className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1"><Plus size={12}/> 新增自訂連結</p>
                  <input
                    type="text"
                    placeholder="網頁名稱 (例如: 教育局)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                  />
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="網址 (https://...)"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      required
                      className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                    />
                    <button
                      type="submit"
                      disabled={!newTitle.trim() || !newUrl.trim()}
                      className="shrink-0 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white p-2 rounded-xl transition-colors shadow-sm"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
