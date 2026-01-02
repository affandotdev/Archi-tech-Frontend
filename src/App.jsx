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
      const token = await requestFcmPermission();
      if (token && user?.id) {
        await registerFcmToken(user.id, token);
      }
    };

    initNotifications();

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

  return (
    <>
      <AppRouter />
      <NotificationToast notification={notification} onClose={() => setNotification(null)} />
    </>
  );
}

export default App;
