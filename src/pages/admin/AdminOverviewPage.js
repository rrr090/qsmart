import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig'; 
import './AdminOverviewPage.css';

function AdminOverviewPage() {
    const [opportunityCount, setOpportunityCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOpportunityCount = async () => {
            try {
                setLoading(true);
                const querySnapshot = await getDocs(collection(db, 'opportunities'));
                setOpportunityCount(querySnapshot.size);
            } catch (err) {
                console.error("Ошибка при подсчете возможностей:", err);
                setError("Не удалось загрузить количество возможностей.");
            } finally {
                setLoading(false);
            }
        };

        fetchOpportunityCount();
    }, []); 

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
                    {/* можно добавить другие полезные ссылки по мере необходимости */}
                </ul>
            </div>
        </div>
    );
}

export default AdminOverviewPage;