import React from 'react';
import { Link } from 'react-router-dom';

const ctaButton = ({ href = '/contacto', color = 'gray', text = 'Contáctame', align = 'center' }) => {
    return (
        <div className={ `cta-button-container align-${ align }` }>
            <Link to={ href } className={ `cta-button cta-button--${ color }` } title={ text }>
                <p className="cta-button__text">{ text }</p>
            </Link>
        </div>
    )
}

export default ctaButton;
