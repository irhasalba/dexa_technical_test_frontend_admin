import { useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging, VAPID_KEY, FCM_TOPIC } from "../config/firebase";
import { saveDeviceToken, subscribeToTopic } from "../service/notification";
import type { Notification } from "../components/notification_bell";

export function useFirebaseMessaging() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [latestToast, setLatestToast] = useState<Notification | null>(null);

  useEffect(() => {
    async function initFCM() {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (!token) return;

        const userId = localStorage.getItem("user_id") ?? "";
        await saveDeviceToken(token, userId);
        await subscribeToTopic(token, FCM_TOPIC);
      } catch (err) {
        console.error("FCM init error:", err);
      }
    }

    initFCM();

    const unsubscribe = onMessage(messaging, (payload) => {
      const { title, body } = payload.notification ?? {};
      const data = payload.data ?? {};

      const newNotification: Notification = {
        id: Date.now().toString(),
        title: title ?? data.title ?? "Notifikasi",
        message: body ?? data.body ?? "",
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        read: false,
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setLatestToast(newNotification);
    });

    return () => unsubscribe();
  }, []);

  const markRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const dismissToast = () => setLatestToast(null);

  return { notifications, markRead, markAllRead, latestToast, dismissToast };
}
