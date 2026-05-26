import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCfUrRDMHIimSV1lsv4LAeBxeQFVWr7Voo",
  authDomain: "dexa-hr-apps.firebaseapp.com",
  projectId: "dexa-hr-apps",
  storageBucket: "dexa-hr-apps.firebasestorage.app",
  messagingSenderId: "590724636836",
  appId: "1:590724636836:web:50be93b96d99450f094631",
};

export const VAPID_KEY = "BCmPBZYV8dNhTuuUtESccLF1WlwQdulKcMYVuVnEtgXQhYI3DkQadSwmnMiJCD09_6dBA1x9nx3L1V-gj5HngCc";

export const FCM_TOPIC = "update_data"

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
