import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { User, Bell, Monitor, Lock } from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';

export default function Settings() {
  const { preferences, setTheme, setLanguage, t } = usePreferences();
  const [userSettings, setUserSettings] = useState({
    name: 'Admin User',
    email: 'admin@pulsechain.com',
    role: 'Admin'
  });

  const [notifications, setNotifications] = useState({
    alertsEnabled: true,
    emailNotifications: true
  });

  const handleSave = () => {
    alert(t('saveChanges'));
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl mb-2">{t('settings')}</h1>
          <p className="text-sm text-gray-500">{t('userSettings')}</p>
        </div>

        <div className="max-w-3xl space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <User className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg">{t('userSettings')}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={userSettings.name}
                  onChange={(e) => setUserSettings({ ...userSettings, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={userSettings.email}
                  onChange={(e) => setUserSettings({ ...userSettings, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Role</label>
                <select
                  value={userSettings.role}
                  onChange={(e) => setUserSettings({ ...userSettings, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Admin">Admin</option>
                  <option value="Operator">Operator</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg">{t('notificationSettings')}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Enable Alerts</p>
                  <p className="text-xs text-gray-500">Receive real-time alerts for shipment issues</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, alertsEnabled: !notifications.alertsEnabled })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.alertsEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.alertsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Email Notifications</p>
                  <p className="text-xs text-gray-500">Get important updates via email</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, emailNotifications: !notifications.emailNotifications })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <Monitor className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg">{t('systemPreferences')}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">{t('theme')}</label>
                <select
                  value={preferences.theme}
                  onChange={(e) => setTheme(e.target.value as 'Light' | 'Dark' | 'Auto')}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Light">Light</option>
                  <option value="Dark">Dark</option>
                  <option value="Auto">Auto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">{t('language')}</label>
                <select
                  value={preferences.language}
                  onChange={(e) => setLanguage(e.target.value as 'English' | 'Spanish' | 'French' | 'German' | 'Chinese')}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Chinese">Chinese</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <Lock className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg">Security</h2>
            </div>
            <div className="p-6">
              <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Change Password
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('saveChanges')}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
