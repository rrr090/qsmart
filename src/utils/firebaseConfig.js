// src/utils/firebaseConfig.js

// Импортируем необходимые функции из SDK Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";       // <-- ЭТО ВАЖНО для 'auth'
import { getFirestore } from "firebase/firestore"; // <-- ЭТО ВАЖНО для 'db'
import { getStorage } from "firebase/storage";   // <-- ЭТО ВАЖНО для 'storage' (для изображений)

// Ваша конфигурация веб-приложения Firebase
// Скопируйте это из Firebase Console -> Project settings -> Your apps -> Web app
const firebaseConfig = {
  apiKey: "AIzaSyCWDQ6d5BX9T-0-Yh_IivhhSm1L5vgzENM",
  authDomain: "qsmart-57492.firebaseapp.com",
  projectId: "qsmart-57492",
  storageBucket: "qsmart-57492.firebasestorage.app",
  messagingSenderId: "443092707291",
  appId: "1:443092707291:web:44a04c0a486f821ab169fe",
  measurementId: "G-JYBT16680R"
};

// Инициализируем Firebase
const app = initializeApp(firebaseConfig);

// Получаем экземпляры сервисов Firebase и ЭКСПОРТИРУЕМ ИХ
// Теперь другие файлы смогут импортировать 'auth', 'db' и 'storage'
export const auth = getAuth(app);         // Экспортируем 'auth' для Firebase Authentication
export const db = getFirestore(app);       // Экспортируем 'db' для Firestore Database
export const storage = getStorage(app);   // Экспортируем 'storage' для Cloud Storage