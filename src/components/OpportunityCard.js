// src/components/OpportunityCard.js
import React, { useState } from 'react';
import './OpportunityCard.css'; // Импортируем стили для новой карточки

// Вспомогательная функция для форматирования даты дедлайна
const formatDeadline = (timestamp) => {
    if (!timestamp) return 'Не указан';
    // Проверяем, является ли timestamp объектом Firebase Timestamp
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    // Если это не Firebase Timestamp, попробуйте преобразовать в Date
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error("Не удалось отформатировать дату дедлайна:", timestamp, e);
      return 'Не указан';
    }
};

// Основной компонент карточки возможности

// Объект для сопоставления коротких названий тегов с полными русскими эквивалентами
const TAG_DISPLAY_NAMES = {
    'Олимпиада': 'Олимпиада',
    'Конкурс': 'Конкурс',
    'Хакатон': 'Хакатон',
    'Кружок': 'Кружок',
    'Лекция': 'Лекция',
    'Грант': 'Грант',
    'Мероприятие': 'Мероприятие',
    'math': 'Математика',
    'it': 'IT',
    'phys': 'Физика',
    'chem': 'Химия',
    'bio': 'Биология',
    'hist': 'История',
    'art': 'Искусство',
    'sport': 'Спорт',
    'lang': 'Языки',
    // Добавьте сюда другие соответствия, если они появятся
};


// Основной компонент карточки возможности
export default function OpportunityCard({ opportunity }) {
    const [expanded, setExpanded] = useState(false); // Состояние для управления видимостью полного описания

    // Обработчик клика для кнопки "Показать больше"
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    // Функция для рендеринга тегов (категории или типа)
    // Теперь принимает массив строк тегов
    const renderTags = (tagsArray) => {
        if (!tagsArray || tagsArray.length === 0) return null;
        
        return (
            <div className="opportunity-tag-container">
                {tagsArray.map((tag, index) => (
                    <span key={index} className="opportunity-tag">
                        {TAG_DISPLAY_NAMES[tag] || tag} {/* Используем сопоставление или исходное значение */}
                    </span>
                ))}
            </div>
        );
    };

    // Собираем все теги в один массив и применяем сопоставление
    const allTags = [];
    if (opportunity.type) {
        opportunity.type.split(',').forEach(tag => {
            const trimmedTag = tag.trim();
            if (trimmedTag) allTags.push(trimmedTag);
        });
    }
    if (opportunity.category) {
        opportunity.category.split(',').forEach(tag => {
            const trimmedTag = tag.trim();
            if (trimmedTag) allTags.push(trimmedTag);
        });
    }

    return (
        <div className="opportunity-card">
            <div className="card-header">
                <div className="header-content">
                    <h3 className="card-title">{opportunity.title || "Название возможности"}</h3>
                    <p className="card-organizer">Организатор: {opportunity.organizer || "Не указан"}</p>
                </div>
            </div>


            <div className="card-content">
                <p className="card-description">
                    {opportunity.description || "Краткое описание возможности."}
                </p>
                
                {/* Рендерим все теги в одном контейнере */}
                {renderTags(allTags)}

                <p className="card-deadline">
                    Дедлайн: {formatDeadline(opportunity.deadline)}
                </p>
            </div>

            <div className="card-actions">
                {opportunity.link && (
                    <a href={opportunity.link} target="_blank" rel="noopener noreferrer" className="btn-primary-card">
                        Подробнее
                    </a>
                )}
                {opportunity.fullDescription && (
                    <button
                        className={`expand-button ${expanded ? 'expanded' : ''}`}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="Показать больше"
                    >
                        {expanded ? 'Скрыть' : 'Показать больше'}
                        <span className="expand-icon"></span> {/* Для стилизации стрелки */}
                    </button>
                )}
            </div>

            {/* Коллапсируемый блок для полного описания */}
            <div className={`card-collapse ${expanded ? 'show' : ''}`}>
                <div className="card-body">
                    <p>{opportunity.fullDescription || "Полное описание отсутствует."}</p>
                </div>
            </div>
        </div>
    );
}
