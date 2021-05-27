import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Contexts
import { useDevelopProjects, usePhotographyProjects } from '../contexts/ProjectsContext';

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
    };

    return (
        <div className="portfolio__project" onClick={() => openProject(name)}>
            <div className="portfolio__project__image-container">
                <img src={ imgSrc } alt={ title } className="portfolio__project__image"/>
            </div>
            <div className="portfolio__project__content">
                <h3 className="portfolio__project__title">{ title }</h3>
                <p className="portfolio__project__tags">
                    {tags.map((tag) => <span key={ tag } className="portfolio__project__tags__tag">{ tag }</span>)}
                </p>
            </div>
        </div>
    )
};

export const PortfolioModal = ({ name, title, description, url, tags, type, externalUrl }) => {
    return (
        <div className="portfolio__modal" data-object={ name }>
            <div className="portfolio__modal__holder">
                <div className="portfolio__modal__image-container">
                    <img src={ `/assets/images/portfolio/${url}/${name}/thumbnail.jpg` } alt={ title } className="portfolio__modal__image"/>
                </div>
                <div className="portfolio__modal__content">
                    <div className="portfolio__modal__text-container">
                        <div className="portfolio__modal__header">
                            <h3 className="portfolio__modal__title">{ title }</h3>
                            <h4 className="portfolio__modal__header__tags">
                                { tags.map((tag) => <span key={ tag } className="portfolio__modal__tag">{ tag }</span>) }
                            </h4>
                        </div>
                        <p className="portfolio__modal__description">{ description }</p>
                    </div>
                    <div className="portfolio__modal__cta-container">
                    <Link to={ `${type}/${name}` } className="portfolio__modal__cta">
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

export const PortfolioList = ({ match }) => {
    const [url, setUrl] = useState();
    const developProjects = useDevelopProjects();
    const photographyProjects = usePhotographyProjects();

    const initPortfolio = useRef(null);

    if(!initPortfolio.current) {
        initPortfolio.current = () => {
            match.url === '/desarrollo' ? setUrl('develop') : setUrl('photography');
        }
    }

    const hideModal = (source = 'close') => {
        const modalContainer = document.querySelector('.portfolio__modal-container');
        if(source === 'close' || source.target === modalContainer) {
            const currentModal = document.querySelector('.portfolio__modal.active');

            modalContainer.classList.remove('open');
            currentModal.classList.remove('active');
        }
    };

    const changeActiveProject = (direction) => {
        const currentModal = document.querySelector('.portfolio__modal.active');
        const prevButton = document.querySelector('.portfolio__modal-container__button--nav--prev');
        const nextButton = document.querySelector('.portfolio__modal-container__button--nav--next');

        currentModal.classList.remove('active');
        prevButton.classList.remove('hidden');
        nextButton.classList.remove('hidden');

        if(direction === 'prev') {
            const firstModal = document.querySelector('.portfolio__modal:first-child');

            currentModal.previousElementSibling.classList.add('active');
            if(firstModal === currentModal.previousElementSibling) prevButton.classList.add('hidden');
        } else if(direction === 'next') {
            const lastModal = document.querySelector('.portfolio__modal:nth-last-of-type(4)');

            currentModal.nextElementSibling.classList.add('active');
            if(lastModal === currentModal.nextElementSibling) nextButton.classList.add('hidden');
        }
    };

    useEffect(() => {
        initPortfolio.current();
    }, []);

    return (
        <section className="portfolio">
            <div className="portfolio__container">
                {
                    url === 'develop' ? 
                    developProjects.map(({ name, title, tags }) => <PortfolioProject key={ name } name={ name } title={ title } tags={ tags } imgSrc={ `/assets/images/portfolio/${url}/${name}/thumbnail.jpg` }/>) :
                    photographyProjects.map(({ name, title, tags }) => <PortfolioProject key={ name } name={ name } title={ title } tags={ tags } imgSrc={ `/assets/images/portfolio/${url}/${name}/thumbnail.jpg` }/>)
                }
            </div>
            <div className="portfolio__modal-container" onClick={(event) => hideModal(event) }>
                {
                    url === 'develop' ? 
                    developProjects.map(({ name, title, description, tags, externalUrl }) => <PortfolioModal key={ name } name={ name } title={ title } description={ description } url={ url } tags={ tags } type={ match.url } externalUrl={ externalUrl }/>) :
                    photographyProjects.map(({ name, title, description, tags, externalUrl }) => <PortfolioModal key={ name } name={ name } title={ title } description={ description } url={ url } tags={ tags } type={ match.url } externalUrl={ externalUrl }/>)
                }
                <div className="portfolio__modal-container__button portfolio__modal-container__button--close" title="Cerrar" onClick={() => hideModal('close') }>
                    <i className="fal fa-times"></i>
                </div>
                <div className="portfolio__modal-container__button portfolio__modal-container__button--nav portfolio__modal-container__button--nav--prev" title="Anterior" onClick={() => changeActiveProject('prev') }>
                    <i className="fal fa-chevron-left"></i>
                </div>
                <div className="portfolio__modal-container__button portfolio__modal-container__button--nav portfolio__modal-container__button--nav--next" title="Siguiente" onClick={() => changeActiveProject('next') }>
                    <i className="fal fa-chevron-right"></i>
                </div>
            </div>
        </section>
    );
};
