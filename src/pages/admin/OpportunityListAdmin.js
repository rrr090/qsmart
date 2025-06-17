// src/pages/admin/OpportunityListAdmin.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig'; // Убедитесь, что путь к firebaseConfig правильный
import './OpportunityListAdmin.css'; // Создадим этот CSS-файл для таблицы

function OpportunityListAdmin() {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Создаем запрос к коллекции 'opportunities', упорядочиваем по дате создания
        const opportunitiesQuery = query(
            collection(db, 'opportunities'),
            orderBy('createdAt', 'desc') // Предполагаем, что у вас есть поле 'createdAt'
        );

        // Подписываемся на изменения в коллекции в реальном времени
        const unsubscribe = onSnapshot(opportunitiesQuery,
            (snapshot) => {
                const opportunitiesData = snapshot.docs.map(doc => ({
                    id: doc.id, // Добавляем ID документа
                    ...doc.data()
                }));
                setOpportunities(opportunitiesData);
                setLoading(false);
            },
            (err) => {
                console.error("Ошибка при получении возможностей:", err);
                setError("Не удалось загрузить список возможностей.");
                setLoading(false);
            }
        );

        // Отписываемся от слушателя при размонтировании компонента
        return () => unsubscribe();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Вы уверены, что хотите удалить эту возможность?")) {
            try {
                await deleteDoc(doc(db, 'opportunities', id));
                alert("Возможность успешно удалена!");
            } catch (err) {
                console.error("Ошибка при удалении возможности:", err);
                alert("Ошибка при удалении возможности. Пожалуйста, попробуйте снова.");
            }
        }
    };

    if (loading) {
        return (
            <div className="admin-page-content">
                <h3>Загрузка возможностей...</h3>
                <p>Пожалуйста, подождите.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-page-content">
                <h3 className="error-message">{error}</h3>
                <p>Попробуйте перезагрузить страницу или свяжитесь с поддержкой.</p>
            </div>
        );
    }

    return (
        <div className="admin-page-content">
            <h3>Список возможностей</h3>
            <div className="admin-actions-header">
                <Link to="/admin/opportunities/new" className="btn btn-primary">
                    Добавить новую возможность
                </Link>
            </div>

            {opportunities.length === 0 ? (
                <p>Пока нет добавленных возможностей. Нажмите "Добавить новую возможность", чтобы начать.</p>
            ) : (
                <div className="opportunities-table-container">
                    <table className="opportunities-table">
                        <thead>
                            <tr>
                                <th>Название</th>
                                <th>Тип</th>
                                <th>Организатор</th>
                                <th>Дата публикации</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {opportunities.map(opportunity => (
                                <tr key={opportunity.id}>
                                    <td>{opportunity.title}</td>
                                    <td>{opportunity.type}</td>
                                    <td>{opportunity.organizer}</td>
                                    <td>{opportunity.createdAt?.toDate().toLocaleDateString() || 'Не указано'}</td>
                                    <td className="actions-cell">
                                        <Link to={`/admin/opportunities/edit/${opportunity.id}`} className="btn btn-sm btn-info">
                                            Редактировать
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(opportunity.id)}
                                            className="btn btn-sm btn-danger"
                                        >
                                            Удалить
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default OpportunityListAdmin;