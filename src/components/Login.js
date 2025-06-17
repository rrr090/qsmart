// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Импортируем контекст аутентификации
import './Login.css'; 

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth(); // Получаем функцию login из контекста
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password); // Вызываем функцию входа
            navigate('/admin'); // Перенаправляем на админ-панель после успешного входа
        } catch (err) {
            console.error("Ошибка входа:", err.message);
            setError('Неверный Email или пароль. Попробуйте снова.'); // Более общее сообщение для безопасности
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Вход в админ-панель</h2>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? 'Вход...' : 'Войти'}
                </button>
            </form>
        </div>
    );
}

export default Login;