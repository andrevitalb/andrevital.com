import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';

// Components
import { PortfolioModal, PortfolioProject } from '../components/portfolioComponents';
import Project from './Project';

// Images
import LiveOut2015 from '../assets/images/portfolio/photography/live_out_2015.jpg';
import LiveOut2016 from '../assets/images/portfolio/photography/live_out_2016.jpg';
// import Placeholder from '../assets/images/portfolio/develop/placeholder.jpg';

const photography = ({ location, match }) => {
    const projects = [
        {
            name: "live-out-2015",
            text: "Lorem ipsum",
            title: "Live Out 2015",
            tags: ["Fotografía Musical"],
            imgSrc: LiveOut2015
        },
        {
            name: "live-out-2016",
            text: "Lorem ipsum",
            title: "Live Out 2016",
            tags: ["Fotografía Musical"],
            imgSrc: LiveOut2016
        },
    ]
    projects.forEach((project) => project.localUrl = match.url);
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
        }
        else if(direction === 'next') {
            const lastModal = document.querySelector('.portfolio__modal:nth-last-of-type(4)');

            currentModal.nextElementSibling.classList.add('active');
            if(lastModal === currentModal.nextElementSibling) nextButton.classList.add('hidden');
        }
    };
    return (
        <Fragment>
            {
                match.path === location.pathname && (
                    <section className="portfolio">
                        <div className="portfolio__container">
                            { projects.map((project) => <PortfolioProject key={ project.name } name={ project.name } title={ project.title } tags={ project.tags }imgSrc={ project.imgSrc }/>) }
                        </div>
                        <div className="portfolio__modal-container" onClick={(event) => hideModal(event) }>                    
                            { projects.map((project) => <PortfolioModal key={ project.name } { ...project }/>) }
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
                )
            }
            <Route path={ `${match.path}/:projectName` } component={ Project } /> 
        </Fragment>
    )
}

export default photography;