import React from 'react';
import SettingsTabs from '../components/SettingsTabs';

function Settings({ user }) {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your account preferences and configurations</p>
      </div>

      {/* Settings Tabs */}
      <SettingsTabs user={user} />
    </div>
  );
}

export default Settings;
