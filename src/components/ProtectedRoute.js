// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Импортируем контекст аутентификации

function ProtectedRoute({ children }) {
    const { currentUser, loading } = useAuth(); // Получаем текущего пользователя и состояние загрузки

    if (loading) {
        // Пока происходит проверка состояния аутентификации, можно показать лоадер
        return <div style={{textAlign: 'center', padding: '50px'}}>Загрузка аутентификации...</div>;
    }

    // Если пользователь аутентифицирован, показываем дочерние компоненты (админ-панель)
    if (currentUser) {
        return children;
    }

    // Если пользователь не аутентифицирован, перенаправляем на страницу входа
    return <Navigate to="/admin/login" replace />;
}

export default ProtectedRoute;