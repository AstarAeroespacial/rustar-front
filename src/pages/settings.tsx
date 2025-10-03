import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Layout from "~/components/Layout";

const Settings: NextPage = () => {
  const [apiBaseUrl, setApiBaseUrl] = useState("http://localhost:8080");
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleSaveSettings = () => {
    // In a real app, this would save to localStorage or send to an API
    console.log("Settings saved:", {
      apiBaseUrl,
      refreshInterval,
      notifications,
      darkMode
    });
  };

  return (
    <>
      <Head>
        <title>Settings - SatCom</title>
        <meta name="description" content="Application settings" />
      </Head>
      <Layout>
        <div className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white">Settings</h1>
          </div>
          
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-8">
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
              <div className="space-y-8">
                
                {/* API Configuration */}
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4">API Configuration</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-2">
                        API Base URL
                      </label>
                      <input
                        type="url"
                        value={apiBaseUrl}
                        onChange={(e) => setApiBaseUrl(e.target.value)}
                        className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="http://localhost:8080"
                      />
                      <p className="text-sm text-dark-400 mt-1">
                        Base URL for the satellite management API
                      </p>
                    </div>
                  </div>
                </div>

                {/* Application Settings */}
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4">Application Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-2">
                        Data Refresh Interval (seconds)
                      </label>
                      <select
                        value={refreshInterval}
                        onChange={(e) => setRefreshInterval(Number(e.target.value))}
                        className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value={1}>1 second</option>
                        <option value={5}>5 seconds</option>
                        <option value={10}>10 seconds</option>
                        <option value={30}>30 seconds</option>
                        <option value={60}>1 minute</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-dark-300">
                          Enable Notifications
                        </label>
                        <p className="text-sm text-dark-400">
                          Receive alerts for satellite status changes
                        </p>
                      </div>
                      <button
                        onClick={() => setNotifications(!notifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications ? 'bg-primary-600' : 'bg-dark-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-dark-300">
                          Dark Mode
                        </label>
                        <p className="text-sm text-dark-400">
                          Use dark theme for better visibility
                        </p>
                      </div>
                      <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          darkMode ? 'bg-primary-600' : 'bg-dark-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            darkMode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* System Information */}
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4">System Information</h2>
                  <div className="bg-dark-700 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-dark-300">Application Version:</span>
                      <span className="text-white">v0.1.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-300">Build Date:</span>
                      <span className="text-white">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-300">Framework:</span>
                      <span className="text-white">Next.js + T3 Stack</span>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Settings;
