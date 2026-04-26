import React from 'react';

function Header({ pendingCount, completedCount, totalCount, user, onLogout }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Greeting based on time of day
  const hour = new Date().getHours();
  let greeting = 'Good Morning';
  if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
  else if (hour >= 17) greeting = 'Good Evening';

  // Get first name for greeting
  const firstName = user ? user.name.split(' ')[0] : '';

  return (
    <header className="h-auto md:h-16 bg-white border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-6 py-3 md:py-0 gap-2 md:gap-0 shadow-sm">
      {/* Left side — Greeting */}
      <div>
        <h2 className="text-lg font-bold text-gray-800">
          {greeting}, {firstName} 👋
        </h2>
        <p className="text-xs text-gray-500 md:hidden">{today}</p>
      </div>

      {/* Right side — Stats, Date, Logout */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Stats pills */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            {pendingCount} Pending
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            {completedCount} Done
          </span>
        </div>

        {/* Date badge */}
        <div className="hidden md:flex text-sm font-medium text-gray-600 bg-gray-100 px-4 py-1.5 rounded-full">
          📅 {today}
        </div>

        {/* Logout Button */}
        <button
          id="logout-button"
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-100 transition-all duration-200"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
