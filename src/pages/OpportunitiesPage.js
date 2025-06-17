import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig'; 
import './OpportunitiesPage.css';


const TYPE_MAPPINGS = {
    'Олимпиада': ['Олимпиада', 'Olympiad'], 
    'Конкурс': ['Конкурс', 'Contest'],
    'Хакатон': ['Хакатон', 'Hackaton'],
    'Кружок': ['Кружок', 'Circle'],
    'Лекция': ['Лекция', 'Lecture'],
    'Грант': ['Грант', 'Grant'],
    'Мероприятие': ['Мероприятие', 'Event'],
};

const FILTER_DISPLAY_TYPES = ['Все', ...Object.keys(TYPE_MAPPINGS)];

function OpportunitiesPage() {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOption, setSortOption] = useState('createdAt_desc');
    const [filterType, setFilterType] = useState('Все');

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                setLoading(true);
                const opportunitiesRef = collection(db, 'opportunities');
                let q = opportunitiesRef;

                
                if (filterType !== 'Все') {
                    const possibleTypeValues = TYPE_MAPPINGS[filterType];
                    if (possibleTypeValues && possibleTypeValues.length > 0) {
                        q = query(q, where('type', 'in', possibleTypeValues));
                    }
                }

                
                switch (sortOption) {
                    case 'createdAt_asc':
                        q = query(q, orderBy('createdAt', 'asc'));
                        break;
                    case 'deadline_asc':
                        q = query(q, orderBy('deadline', 'asc'));
                        break;
                    case 'deadline_desc':
                        q = query(q, orderBy('deadline', 'desc'));
                        break;
                    case 'createdAt_desc':
                    default:
                        q = query(q, orderBy('createdAt', 'desc'));
                        break;
                }

                const querySnapshot = await getDocs(q);

                const opportunitiesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setOpportunities(opportunitiesData);
            } catch (err) {
                console.error("Ошибка при загрузке возможностей:", err);
                setError("Не удалось загрузить возможности. Пожалуйста, попробуйте позже.");
            } finally {
                setLoading(false);
            }
        };

        fetchOpportunities();
    }, [sortOption, filterType]); 
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
    };

    if (loading) {
        return (
            <div className="opportunities-page-container">
                <h2>Все возможности</h2>
                <p className="loading-message">Загрузка возможностей...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="opportunities-page-container">
                <h2>Все возможности</h2>
                <p className="error-message">{error}</p>
            </div>
        );
    }

    return (
        <div className="opportunities-page-container">
            <h2>Все возможности</h2>

            <div className="filter-sort-controls">
                <div className="filter-controls">
                    <label htmlFor="filter-by">Тип:</label>
                    <select id="filter-by" value={filterType} onChange={handleFilterChange} className="filter-select">
                        {/* Используем фиксированный список типов для отображения */}
                        {FILTER_DISPLAY_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="sort-controls">
                    <label htmlFor="sort-by">Сортировать по:</label>
                    <select id="sort-by" value={sortOption} onChange={handleSortChange} className="sort-select">
                        <option value="createdAt_desc">Дате публикации (новые)</option>
                        <option value="createdAt_asc">Дате публикации (старые)</option>
                        <option value="deadline_asc">Дедлайну (ближайшие)</option>
                        <option value="deadline_desc">Дедлайну (дальние)</option>
                    </select>
                </div>
            </div>

            {opportunities.length === 0 ? (
                <p className="no-opportunities-message">К сожалению, пока нет доступных возможностей, соответствующих вашему запросу.</p>
            ) : (
                <div className="opportunities-grid">
                    {opportunities.map(opportunity => (
                        <div key={opportunity.id} className="opportunity-card">
                            {opportunity.imageUrl && (
                                <img src={opportunity.imageUrl} alt={opportunity.title} className="opportunity-card-image" />
                            )}
                            <div className="card-content">
                                <h3>{opportunity.title}</h3>
                                <p className="card-type">Тип: {opportunity.type}</p> 
                                <p className="card-category">Категория: {opportunity.category}</p>
                                <p className="card-organizer">Организатор: {opportunity.organizer}</p>
                                <p className="card-description">{opportunity.description}</p>
                                <p className="card-deadline">
                                    Дедлайн: {opportunity.deadline?.toDate().toLocaleDateString('ru-RU', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) || 'Не указан'}
                                </p>
                                <a href={opportunity.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                    Подробнее
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OpportunitiesPage;