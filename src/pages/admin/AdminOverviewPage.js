// src/pages/admin/AdminOverviewPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore'; // Импортируем getDocs
import { db } from '../../utils/firebaseConfig'; // Убедитесь, что путь к firebaseConfig правильный

import './AdminOverviewPage.css'; // Создадим этот CSS-файл

function AdminOverviewPage() {
    const [opportunityCount, setOpportunityCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOpportunityCount = async () => {
            try {
                setLoading(true);
                const querySnapshot = await getDocs(collection(db, 'opportunities'));
                setOpportunityCount(querySnapshot.size); // .size возвращает количество документов
            } catch (err) {
                console.error("Ошибка при подсчете возможностей:", err);
                setError("Не удалось загрузить количество возможностей.");
            } finally {
                setLoading(false);
            }
        };

        fetchOpportunityCount();
    }, []); // Пустой массив зависимостей означает, что эффект запустится один раз при монтировании

    return (
        <div className="admin-page-content">
            <h3>Обзор админ-панели</h3>
            <p>Добро пожаловать в панель управления возможностями.</p>

            <div className="overview-cards-container">
                <div className="overview-card">
                    <h4>Общее количество возможностей</h4>
                    {loading ? (
                        <p>Загрузка...</p>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : (
                        <p className="count-number">{opportunityCount}</p>
                    )}
                </div>
                {/* Здесь можно добавить другие карточки статистики, например, по категориям */}
            </div>

            <div className="quick-links">
                <h4>Быстрые действия:</h4>
                <ul>
                    <li>
                        <Link to="/admin/opportunities/new" className="btn btn-primary">
                            Добавить новую возможность
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/opportunities" className="btn btn-secondary">
                            Просмотреть все возможности
                        </Link>
                    </li>
                    {/* Добавьте другие полезные ссылки по мере необходимости */}
                </ul>
            </div>
        </div>
    );
}

export default AdminOverviewPage;