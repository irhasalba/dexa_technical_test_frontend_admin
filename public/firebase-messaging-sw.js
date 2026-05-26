importScripts("https://www.gstatic.com/firebasejs/11.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCfUrRDMHIimSV1lsv4LAeBxeQFVWr7Voo",
  authDomain: "dexa-hr-apps.firebaseapp.com",
  projectId: "dexa-hr-apps",
  storageBucket: "dexa-hr-apps.firebasestorage.app",
  messagingSenderId: "590724636836",
  appId: "1:590724636836:web:50be93b96d99450f094631",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification ?? {};
  self.registration.showNotification(title ?? "Notifikasi", {
    body: body ?? "",
    icon: "/favicon.svg",
  });
});
