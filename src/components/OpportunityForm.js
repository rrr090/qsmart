// src/components/OpportunityForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig'; // Убедитесь, что путь правильный
import './OpportunityForm.css'; // Создадим этот CSS-файл

// Вспомогательная функция для форматирования даты для инпута типа datetime-local
const formatTimestampToDateTimeLocal = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate(); // Преобразуем Firestore Timestamp в объект Date
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

function OpportunityForm() {
    const { id } = useParams(); // Получаем ID из URL, если это режим редактирования
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: '', // Например: "Олимпиада", "Конкурс", "Кружок"
        category: '', // Например: "Математика", "Физика", "Программирование"
        deadline: '', // Будет храниться в формате datetime-local, затем конвертироваться
        link: '',
        organizer: '',
        // imageUrl: '', // Пока не реализуем загрузку изображений, но поле можно держать
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formMode, setFormMode] = useState('add'); // 'add' или 'edit'

    // Эффект для загрузки данных, если это режим редактирования
    useEffect(() => {
        if (id) {
            setFormMode('edit');
            const fetchOpportunity = async () => {
                try {
                    const docRef = doc(db, 'opportunities', id);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setFormData({
                            title: data.title || '',
                            description: data.description || '',
                            type: data.type || '',
                            category: data.category || '',
                            // Важно: преобразуем Firestore Timestamp в формат для input type="datetime-local"
                            deadline: formatTimestampToDateTimeLocal(data.deadline),
                            link: data.link || '',
                            organizer: data.organizer || '',
                            // imageUrl: data.imageUrl || '',
                        });
                    } else {
                        setError("Возможность не найдена.");
                        navigate('/admin/opportunities'); // Если не найдено, перенаправляем на список
                    }
                } catch (err) {
                    console.error("Ошибка при загрузке возможности для редактирования:", err);
                    setError("Ошибка при загрузке данных.");
                } finally {
                    setLoading(false);
                }
            };
            fetchOpportunity();
        } else {
            setFormMode('add');
            setLoading(false); // Если это режим добавления, загрузка не нужна
        }
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null); // Сбрасываем предыдущие ошибки

        try {
            // Преобразуем строку даты/времени из инпута в объект Date, а затем в Firestore Timestamp
            const deadlineTimestamp = formData.deadline ? new Date(formData.deadline) : null;
            if (deadlineTimestamp && isNaN(deadlineTimestamp.getTime())) {
                throw new Error("Некорректный формат даты дедлайна.");
            }

            const dataToSave = {
                ...formData,
                deadline: deadlineTimestamp, // Firestore будет автоматически конвертировать Date в Timestamp
            };

            if (formMode === 'add') {
                await addDoc(collection(db, 'opportunities'), {
                    ...dataToSave,
                    createdAt: serverTimestamp(), // Добавляем метку времени создания
                });
                alert('Возможность успешно добавлена!');
            } else { // formMode === 'edit'
                await updateDoc(doc(db, 'opportunities', id), dataToSave);
                alert('Возможность успешно обновлена!');
            }

            navigate('/admin/opportunities'); // Перенаправляем на список после успешного сохранения

        } catch (err) {
            console.error("Ошибка при сохранении возможности:", err);
            setError(`Ошибка при сохранении: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-page-content">
                <h3>Загрузка формы...</h3>
                <p>Пожалуйста, подождите.</p>
            </div>
        );
    }

    return (
        <div className="admin-page-content">
            <h3>{formMode === 'add' ? 'Добавить новую возможность' : 'Редактировать возможность'}</h3>

            {error && <p className="form-error-message">{error}</p>}

            <form onSubmit={handleSubmit} className="opportunity-form">
                <div className="form-group">
                    <label htmlFor="title">Название:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Описание:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="5"
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="type">Тип:</label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Выберите тип</option>
                        <option value="Олимпиада">Олимпиада</option>
                        <option value="Хакатон">Хакатон</option>
                        <option value="Конкурс">Конкурс</option>
                        <option value="Кружок">Кружок</option>
                        <option value="Лекция">Лекция</option>
                        <option value="Грант">Грант</option>
                        <option value="Мероприятие">Мероприятие</option>
                        {/* Добавьте другие типы по необходимости */}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="category">Категория:</label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="organizer">Организатор:</label>
                    <input
                        type="text"
                        id="organizer"
                        name="organizer"
                        value={formData.organizer}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="link">Ссылка:</label>
                    <input
                        type="url"
                        id="link"
                        name="link"
                        value={formData.link}
                        onChange={handleChange}
                        placeholder="http://example.com"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="deadline">Дедлайн:</label>
                    <input
                        type="datetime-local"
                        id="deadline"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                    />
                </div>

                {/* Поле для imageUrl пока закомментировано, если вы не готовы к загрузке файлов */}
                {/*
                <div className="form-group">
                    <label htmlFor="imageUrl">URL изображения (пока без загрузки):</label>
                    <input
                        type="url"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="http://example.com/image.jpg"
                    />
                </div>
                */}

                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Сохранение...' : (formMode === 'add' ? 'Добавить возможность' : 'Обновить возможность')}
                </button>
            </form>
        </div>
    );
}

export default OpportunityForm;