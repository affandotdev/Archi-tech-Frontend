import AppRouter from './app/router/AppRouter';
import { requestFcmPermission, onMessageListener } from './pushNotification';
import { registerFcmToken } from './features/chat/api/chat.api';
import { useEffect, useState } from 'react';
import NotificationToast from './shared/components/NotificationToast';

import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const initNotifications = async () => {
      // If permission is already granted, we can get the token directly
      if (Notification.permission === 'granted') {
        const token = await requestFcmPermission();
        if (token && user?.id) {
          await registerFcmToken(user.id, token);
        }
      }
      // If permission is default (not asked yet), we show the button to request it
      else if (Notification.permission === 'default') {
        // We do nothing automatically. 
        // The user must click the "Enable Notifications" button.
      }
    };

    if (user?.id) {
      initNotifications();
    }

    onMessageListener()
      .then((payload) => {
        console.log("Receive foreground message: ", payload);
        setNotification({
          title: payload?.notification?.title || "New Message",
          body: payload?.notification?.body || "You received a new notification"
        });
      })
      .catch((err) => console.log("failed: ", err));
  }, [user?.id]);

  const handleEnableNotifications = async () => {
    const token = await requestFcmPermission();
    if (token && user?.id) {
      await registerFcmToken(user.id, token);
      // Force re-render to hide button if needed, 
      // or rely on Notification.permission check in a re-render
    }
  };

  return (
    <>
      <AppRouter />
      <NotificationToast notification={notification} onClose={() => setNotification(null)} />

      {/* Permission Request Button (Visible only if permission is default) */}
      {Notification.permission === 'default' && user?.id && (
        <div className="fixed bottom-4 left-4 z-50 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-indigo-100 dark:border-gray-700 flex items-center gap-4 animate-slide-up">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <p className="font-medium text-gray-900 dark:text-white">Enable Notifications</p>
            <p>Get instant updates for new messages.</p>
          </div>
          <button
            onClick={handleEnableNotifications}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            Allow
          </button>
        </div>
      )}
    </>
  );
}

export default App;
