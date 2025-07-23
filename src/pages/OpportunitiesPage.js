// src/pages/OpportunitiesPage.js

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig'; 
import OpportunityCard from '../components/OpportunityCard';
import './OpportunitiesPage.css';
import Pagination from '@mui/material/Pagination';


const TYPE_MAPPINGS = {
    'Олимпиада': ['Олимпиада', 'Olympiad'], 
    'Конкурс': ['Конкурс', 'Contest'],
    'Хакатон': ['Хакатон', 'Hackaton'],
    'Кружок': ['Кружок', 'Circle'],
    'Лекция': ['Лекция', 'Lecture'],
    'Мероприятие': ['Мероприятие', 'Event'],
};

// ОБНОВЛЕНО: Используем короткие значения тегов из SideNav в качестве ключей
// Маппинг теперь включает как полные названия, так и короткие коды для гибкости запроса Firestore
const CATEGORY_MAPPINGS = {
    'math': ['Математика', 'Mathematics', 'math'], // Добавлен 'math'
    'it': ['IT', 'Information Technology', 'it'],   // Добавлен 'it'
    'phys': ['Физика', 'Physics', 'phys'],         // Добавлен 'phys'
    'chem': ['Химия', 'Chemistry', 'chem'],         // Добавлен 'chem'
    'bio': ['Биология', 'Biology', 'bio'],         // Добавлен 'bio'
    'hist': ['История', 'History', 'hist'],         // Добавлен 'hist'
    'art': ['Искусство', 'Art', 'art'],             // Добавлен 'art'
    'sport': ['Спорт', 'Sport', 'sport'],         // Добавлен 'sport'
    'lang': ['Языки', 'Languages', 'lang'],         // Добавлен 'lang'
};


function OpportunitiesPage() {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [searchParams, setSearchParams] = useSearchParams();

    // Получаем текущие фильтры и сортировку из URL
    const currentTypes = searchParams.get('type');
    const currentCategories = searchParams.get('category');
    const currentSort = searchParams.get('sort') || 'createdAt_desc'; // Дефолтная сортировка

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                setLoading(true);
                const opportunitiesRef = collection(db, 'opportunities');
                let q = opportunitiesRef;

                // Применяем фильтр по типу (множественный выбор)
                if (currentTypes) {
                    const selectedTypes = currentTypes.split(',');
                    let allPossibleTypeValues = [];
                    selectedTypes.forEach(type => {
                        if (TYPE_MAPPINGS[type]) {
                            allPossibleTypeValues = allPossibleTypeValues.concat(TYPE_MAPPINGS[type]);
                        }
                    });
                    if (allPossibleTypeValues.length > 0) {
                        if (allPossibleTypeValues.length <= 10) {
                            q = query(q, where('type', 'in', allPossibleTypeValues));
                        } else {
                            console.warn("Too many type filters for 'in' query. Max 10 values supported.");
                            q = query(q, where('type', 'in', allPossibleTypeValues.slice(0, 10)));
                        }
                    }
                }

                // Применяем фильтр по категории (множественный выбор)
                if (currentCategories) {
                    const selectedCategories = currentCategories.split(',');
                    let allPossibleCategoryValues = [];
                    selectedCategories.forEach(category => {
                        // ОБНОВЛЕНО: Теперь CATEGORY_MAPPINGS использует короткие значения тегов в качестве ключей
                        if (CATEGORY_MAPPINGS[category]) {
                            allPossibleCategoryValues = allPossibleCategoryValues.concat(CATEGORY_MAPPINGS[category]);
                        }
                    });
                    if (allPossibleCategoryValues.length > 0) {
                        if (allPossibleCategoryValues.length <= 10) {
                            q = query(q, where('category', 'in', allPossibleCategoryValues));
                        } else {
                            console.warn("Too many category filters for 'in' query. Max 10 values supported.");
                            q = query(q, where('category', 'in', allPossibleCategoryValues.slice(0, 10)));
                        }
                    }
                }

                // Применяем сортировку
                switch (currentSort) {
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
    }, [currentTypes, currentCategories, currentSort]); // Зависимости: текущие значения фильтров и сортировки из URL

    if (loading) {
        return (
            <div className="opportunities-content-inner">
                <h2>Выбирай. Действуй. Расти.</h2>
                <p className="loading-message">Загрузка возможностей...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="opportunities-content-inner">
                <h2>Выбирай. Действуй. Расти.</h2>
                <p className="error-message">{error}</p>
            </div>
        );
    }

    return (
        <div className="opportunities-content-inner">
            
            {opportunities.length === 0 ? (
                <p className="no-opportunities-message">К сожалению, пока нет доступных возможностей, соответствующих вашему запросу.</p>
            ) : (
                <div className="opportunities-grid">
                    {opportunities.map(opportunity => (
                        <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                    ))}
                </div>
            )}

        </div>
    );
}

export default OpportunitiesPage;
