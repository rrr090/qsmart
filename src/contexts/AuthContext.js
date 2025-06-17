// src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../utils/firebaseConfig';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
            // Шаг 1: Сразу устанавливаем базовый объект пользователя и завершаем загрузку.
            // Это гарантирует, что ProtectedRoute быстро получит не-null пользователя и loading=false.
            if (firebaseUser) {
                // Устанавливаем базовый объект пользователя Firebase.
                // В этот момент, currentUser еще НЕ БУДЕТ содержать role и name из Firestore.
                setCurrentUser(firebaseUser);
            } else {
                // Если пользователь не авторизован
                setCurrentUser(null);
            }
            setLoading(false); // Состояние аутентификации (вход/выход) теперь известно.

            // Шаг 2: Если пользователь существует, асинхронно получаем дополнительные данные (например, роль).
            // Этот блок выполняется ПОСЛЕ того, как setLoading(false) уже сработало.
            if (firebaseUser) {
                try {
                    const userDocRef = doc(db, 'users', firebaseUser.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    let userData = {};
                    if (userDocSnap.exists()) {
                        userData = userDocSnap.data();
                    }

                    // Шаг 3: Обновляем currentUser с ролью и именем.
                    // Это вызовет дополнительный ре-рендер, но уже после того,
                    // как ProtectedRoute пропустит пользователя.
                    const userWithRoleAndName = {
                        ...firebaseUser, // Сохраняем все оригинальные свойства Firebase user
                        role: userData.role || 'user', // Добавляем роль
                        name: userData.name || null // Добавляем имя
                    };
                    setCurrentUser(userWithRoleAndName); // Обновляем с обогащенным объектом пользователя

                    // ОПЦИОНАЛЬНО: Если вы хотите принудительно выйти не-админа,
                    // когда он пытается получить доступ к админ-панели (дополнительный уровень безопасности/UX)
                    // if (userWithRoleAndName.role !== 'admin' && window.location.pathname.startsWith('/admin')) {
                    //     console.warn("Non-admin user tried to access admin route. Logging out.");
                    //     await signOut(auth); // Выйти не-админа
                    //     setCurrentUser(null); // Сбросить пользователя
                    //     // Можно также добавить navigate('/') здесь, если это уместно
                    // }

                } catch (error) {
                    console.error("Ошибка при получении данных пользователя из Firestore:", error);
                    // Обработка ошибок: возможно, можно сбросить currentUser или показать ошибку
                    // В данном случае, currentUser останется базовым FirebaseUser без роли/имени.
                }
            }
        });

        // Отписываемся при размонтировании компонента
        return unsubscribe;
    }, []); // Пустой массив зависимостей означает, что эффект запустится один раз при монтировании

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    // Объект, который предоставляется всем компонентам-потомкам
    const value = {
        currentUser,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children} {/* Рендерим дочерние элементы только после завершения загрузки */}
        </AuthContext.Provider>
    );
}