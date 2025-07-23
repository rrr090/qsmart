// src/components/SideNav.js
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './SideNav.css';
import PrettyCheckbox from './PrettyCheckbox';
import "./PrettyCheckbox.css"   

// Импорт компонентов React-Bootstrap
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';

// Иконки Material-UI (для стрелок аккордеона)

// Категории возможностей для аккордеона
const OPPORTUNITY_FILTERS = [
    { name: 'Все возможности', path: '/opportunities', param: 'all', eventKey: '0' },
    {
        name: 'Типы возможностей',
        param: 'type',
        eventKey: '1', // Уникальный ключ для Accordion.Item
        subcategories: [
            { name: 'Олимпиады', value: 'Олимпиада' },
            { name: 'Конкурсы', value: 'Конкурс' },
            { name: 'Хакатоны', value: 'Хакатон' },
            { name: 'Кружки', value: 'Кружок' },
            { name: 'Лекции', value: 'Лекция' },
            { name: 'Гранты', value: 'Грант' },
            { name: 'Мероприятия', value: 'Мероприятие' },
        ]
    },
    {
        name: 'По категориям (Тегам)',
        param: 'category',
        eventKey: '2', // Уникальный ключ для Accordion.Item
        subcategories: [
            { name: 'Математика', value: 'math' },
            { name: 'IT', value: 'it' },
            { name: 'Физика', value: 'phys' },
            { name: 'Химия', value: 'chem' },
            { name: 'Биология', value: 'bio' },
            { name: 'История', value: 'hist' },
            { name: 'Искусство', value: 'art' },
            { name: 'Спорт', value: 'sport' },
            { name: 'Языки', value: 'lang' },
        ]
    }
];

// Опции сортировки
const SORT_OPTIONS = [
    { name: 'Дате публикации (новые)', value: 'createdAt_desc' },
    { name: 'Дате публикации (старые)', value: 'createdAt_asc' },
    { name: 'Дедлайну (ближайшие)', value: 'deadline_asc' },
    { name: 'Дедлайну (дальние)', value: 'deadline_desc' },
];

function SideNav() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Состояние для активного аккордеона (только один может быть открыт)
    // Используем eventKey для управления состоянием
    const [activeAccordionKey, setActiveAccordionKey] = useState(null);

    // Состояние для выбранной опции сортировки (радио-кнопки)
    const [selectedSortOption, setSelectedSortOption] = useState(searchParams.get('sort') || 'createdAt_desc');

    // Синхронизируем состояние сортировки с URL при изменении URL
    useEffect(() => {
        setSelectedSortOption(searchParams.get('sort') || 'createdAt_desc');
    }, [searchParams]);

    // Обработчик для аккордеона React-Bootstrap
    const handleAccordionSelect = (eventKey) => {
        // Если eventKey равен текущему активному ключу, закрываем аккордеон
        // Иначе открываем новый
        setActiveAccordionKey(eventKey === activeAccordionKey ? null : eventKey);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Ошибка при выходе из SideNav:", error);
        }
    };

    // Функция для навигации с фильтром (множественный выбор для чекбоксов)
    const handleFilterNavigate = (param, value) => {
        const currentParams = new URLSearchParams(searchParams);
        
        if (param === 'all') {
            currentParams.delete('type');
            currentParams.delete('category');
        } else {
            const existingValues = currentParams.get(param);
            let valuesArray = existingValues ? existingValues.split(',') : [];

            if (valuesArray.includes(value)) {
                valuesArray = valuesArray.filter(item => item !== value);
            } else {
                valuesArray.push(value);
            }

            if (valuesArray.length > 0) {
                currentParams.set(param, valuesArray.join(','));
            } else {
                currentParams.delete(param);
            }
        }
        
        setSearchParams(currentParams);
    };

    // Функция для обработки изменения сортировки (радио-кнопки)
    const handleSortChange = (value) => {
        const currentParams = new URLSearchParams(searchParams);
        currentParams.set('sort', value);
        setSearchParams(currentParams);
    };

    const getNavLinkClass = ({ isActive }) =>
        isActive ? "sidenav-link active" : "sidenav-link";

    return (
        <div className="sideNav" id='sideNav'>
            <div className="sideflex">
                <div className="logoflex">
                    <NavLink to="/" className="sidenav-logo">
                        Qsmart
                    </NavLink>
                </div>
            </div>
            
            {/* ИСПОЛЬЗУЕМ ACCORDION ИЗ REACT-BOOTSTRAP */}
            <Accordion activeKey={activeAccordionKey} onSelect={handleAccordionSelect} className="sidenav-accordion">
                {OPPORTUNITY_FILTERS.map((filterGroup) => (
                    // Если это прямая ссылка (например, "Все возможности")
                    filterGroup.path ? (
                        <li key={filterGroup.name} className="sidenav-list-item"> {/* Оборачиваем в li для сохранения структуры sidenav-list */}
                            <NavLink
                                to={filterGroup.path}
                                className={getNavLinkClass}
                                onClick={() => handleFilterNavigate(filterGroup.param, '')}
                            >
                                {filterGroup.name}
                            </NavLink>
                        </li>
                    ) : (
                        // Если это раздел аккордеона (фильтры или статический контент)
                        <Accordion.Item eventKey={filterGroup.eventKey} key={filterGroup.eventKey}>
                            <Accordion.Header>
                                {filterGroup.name}

                            </Accordion.Header>
                            <Accordion.Body>
                                {filterGroup.isStaticContent ? (
                                    // Если это статический контент (из Accordionm)
                                    <p>{filterGroup.content}</p>
                                ) : (
                                    // Если это фильтры (типы или категории)
                                    <ul>
                                        {filterGroup.subcategories.map((sub, subIndex) => {
                                            const currentValues = searchParams.get(filterGroup.param);
                                            const isChecked = currentValues ? currentValues.split(',').includes(sub.value) : false;

                                            return (
                                                <li key={subIndex}>
                                                    <Form.Check
                                                        type="checkbox"
                                                        id={`filter-${filterGroup.param}-${sub.value}`}
                                                        label={sub.name}
                                                        checked={isChecked}
                                                        onChange={() => handleFilterNavigate(filterGroup.param, sub.value)}
                                                        className="custom-checkbox-label"
                                                    />
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    )
                ))}

                {/* --- Секция Сортировки --- */}
                <Accordion.Item eventKey="sort-options" className="sidenav-accordion-sort-item">
                    <Accordion.Header>
                        Сортировать по

                    </Accordion.Header>
                    <Accordion.Body>
                        <ul>
                            {SORT_OPTIONS.map((option) => (
                                <li key={option.value}>
                                    <Form.Check
                                        type="radio"
                                        name="sortOption"
                                        id={`sort-${option.value}`}
                                        label={option.name}
                                        value={option.value}
                                        checked={selectedSortOption === option.value}
                                        onChange={() => handleSortChange(option.value)}
                                        className="custom-radio-label"
                                    />
                                </li>
                            ))}
                        </ul>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Разделитель */}
                {/* Если Accordion оборачивает все, то разделитель может быть внутри Accordion,
                    или же эти элементы должны быть вне Accordion, но внутри sidenav-list.
                    Для простоты, я добавлю его как отдельный элемент списка внутри ul ниже.
                */}
            </Accordion> {/* Закрываем Accordion */}
            
            {/* Элементы, которые всегда отображаются внизу сайдбара, вне аккордеона */}
            <ul className="sidenav-list bottom-links"> {/* Добавляем класс для стилизации */}
                <li className="sidenav-separator"></li> {/* Разделитель */}
                {currentUser && currentUser.role === 'admin' && (
                    <li>
                        <NavLink to="/admin" className={getNavLinkClass}>
                            Админ-панель
                        </NavLink>
                    </li>
                )}
                {currentUser ? (
                    <li>
                        <button onClick={handleLogout} className="sidenav-link logout-button">
                            Выйти
                        </button>
                    </li>
                ) : (
                    <li>
                        <NavLink to="/admin/login" className={getNavLinkClass}>
                            Войти
                        </NavLink>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default SideNav;
