import { Link } from 'react-router-dom';

export const PortfolioProject = ({ name, title, tags, imgSrc }) => {
    const openProject = (project) => {
        const modalContainer = document.querySelector('.portfolio__modal-container');
        const modals = Array.from(document.querySelectorAll('.portfolio__modal'));
        const selectedModal = document.querySelector('[data-object="' + project + '"]');

        const prevButton = document.querySelector('.portfolio__modal-container__button--nav--prev');
        const nextButton = document.querySelector('.portfolio__modal-container__button--nav--next');

        prevButton.classList.remove('hidden');
        nextButton.classList.remove('hidden');
        
        if(modals[0] === selectedModal) prevButton.classList.add('hidden');
        else if(modals[modals.length - 1] === selectedModal) nextButton.classList.add('hidden');

        modalContainer.classList.add('open');
        selectedModal.classList.add('active');
    }
    return (
        <div className="portfolio__project" onClick={() => openProject(name)}>
            <div className="portfolio__project__image-container">
                <img src={ imgSrc } alt={ title } className="portfolio__project__image"/>
            </div>
            <div className="portfolio__project__content">
                <h3 className="portfolio__project__title">{ title }</h3>
                <p className="portfolio__project__tags">
                    {tags.map((tag) => <span key={ tag }className="portfolio__project__tags__tag">{ tag }</span>)}
                </p>
            </div>
        </div>
    )
};

export const PortfolioModal = ({ name, title, text, imgSrc, tags, localUrl, externalUrl }) => {
    return (
        <div className="portfolio__modal" data-object={ name }>
            <div className="portfolio__modal__holder">
                <div className="portfolio__modal__image-container">
                    <img src={ imgSrc } alt={ title } className="portfolio__modal__image"/>
                </div>
                <div className="portfolio__modal__content">
                    <div className="portfolio__modal__text-container">
                        <div className="portfolio__modal__header">
                            <h3 className="portfolio__modal__title">{ title }</h3>
                            <h4 className="portfolio__modal__header__tags">
                                { tags.map((tag) => <span key={ tag }className="portfolio__modal__tag">{ tag }</span>) }
                            </h4>
                        </div>
                        <p className="portfolio__modal__description">{ text }</p>
                    </div>
                    <div className="portfolio__modal__cta-container">
                    <Link to={ `${localUrl}/${name}` } className="portfolio__modal__cta">
                        <p className="portfolio__modal__cta__text">Ver proyecto</p>
                    </Link>
                    <a href={ externalUrl } className="portfolio__modal__cta" target="_blank" rel="noreferrer">
                        <p className="portfolio__modal__cta__text">Ir al sitio</p>
                    </a>
                </div>
                </div>
            </div>
        </div>
    )
};