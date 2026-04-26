import React, { useState, useEffect } from 'react';

const CATEGORIES = [
  { id: 'work', label: 'Work', color: 'bg-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400' },
  { id: 'personal', label: 'Personal', color: 'bg-green-500', bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400' },
  { id: 'important', label: 'Important', color: 'bg-red-500', bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400' },
  { id: 'study', label: 'Study', color: 'bg-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-400' },
];

function EventModal({ isOpen, onClose, onSave, onDelete, initialData, defaultDate }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('60'); // Minutes
  const [category, setCategory] = useState('work');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || '');
        setDate(initialData.date || '');
        setTime(initialData.time || '');
        setDuration(initialData.duration?.toString() || '60');
        setCategory(initialData.category || 'work');
      } else {
        setTitle('');
        setDate(defaultDate || new Date().toISOString().split('T')[0]);
        const now = new Date();
        now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30);
        setTime(now.toTimeString().slice(0, 5));
        setDuration('60');
        setCategory('work');
      }
    }
  }, [isOpen, initialData, defaultDate]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    
    onSave({
      ...(initialData || {}),
      title: title.trim(),
      date,
      time,
      duration: parseInt(duration),
      category,
      completed: initialData ? initialData.completed : false
    });
  };

  const inputClass = "w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800 dark:text-slate-200 transition-colors";
  const labelClass = "block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in border border-slate-100 dark:border-slate-700">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            {initialData ? 'Edit Event' : 'Add Event'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className={labelClass}>Event Title</label>
            <input autoFocus type="text" placeholder="Add title..." value={title} onChange={e => setTitle(e.target.value)} className={inputClass} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Time</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Duration</label>
            <select value={duration} onChange={e => setDuration(e.target.value)} className={inputClass}>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
              <option value="240">4 hours</option>
              <option value="1440">All day</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    category === cat.id 
                      ? 'bg-slate-100 dark:bg-slate-700 ring-2 ring-blue-500' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${cat.color}`}></span>
                  <span className="text-slate-700 dark:text-slate-300">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 dark:border-slate-700">
            {initialData ? (
              <button type="button" onClick={() => onDelete(initialData.id)} className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                Delete
              </button>
            ) : <div></div>}
            
            <div className="flex items-center gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventModal;
