import React from 'react';
import OpportunityCard from './OpportunityCard';
import './OpportunityCard';

function OpportunityList({ opportunities }) { // Принимает массив возможностей
    if (!opportunities || opportunities.length === 0) {
        return <p>Нет доступных возможностей в этой категории.</p>;
    }

    return (
        <div className="opportunity-grid">
            {opportunities.map(opportunity => (
                // Передаем весь объект 'opportunity' в компонент OpportunityCard
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
        </div>
    );
}

export default OpportunityList;