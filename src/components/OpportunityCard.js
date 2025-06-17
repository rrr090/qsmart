import React from 'react';
import './OpportunityCard.css';

function OpportunityCard({ opportunity}){
    const {title, description, date, link, type, imageUrl } = opportunity;
    
    // date formatting [YYYY-MM-DD]
    const formatDate = (isoDateString)=> {
        if(!isoDateString) return 'No date';
        try{
            const [year, month, day] = isoDateString.split('-');
            const d = new Date(year, month-1, day);
            return new Intl.DateTimeFormat('ru-RU', { year: 'numeric', month: 'long', day:'numeric'}).format(d);
        } catch (e){
            console.error("formatiing data error:", e);
            return isoDateString;
        }
    };

    return(
        <div className="opportunity-card">
        <div className="opportunity-content">
            <span className={`opportunity-type-badge type-${type}`}>
            {type === 'olympiad' && 'Олимпиада'}
            {type === 'circle' && 'Кружок'}
            {type === 'competition' && 'Конкурс'}
            {type === 'hackaton' && 'Хакатон'}
            </span>

            <h3 className="opportunity-title">{title}</h3>
            <p className="opportunity-description">{description}</p>

            <div className="opportunity-details">
            <i className="fas fa-calendar-alt"></i>
            <span>{formatDate(date)}</span>
            </div>

            <a href={link} className="opportunity-link" target="_blank" rel="noopener noreferrer">
            Подробнее <i className="fas fa-arrow-right"></i>
            </a>
        </div>

        <img src={imageUrl} alt={title} className="opportunity-image" />
        </div>
    )
}

export default OpportunityCard;