import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';

// Components
import { PortfolioModal, PortfolioProject } from '../components/portfolioComponents';
import Project from './Project';

// Images
import Kinesis from '../assets/images/portfolio/develop/kinesis-rehab.jpg';
import Locksmith from '../assets/images/portfolio/develop/aag-locksmith.jpg';
import RadioUniversal from '../assets/images/portfolio/develop/radio-universal.jpg';
import Milla from '../assets/images/portfolio/develop/milla-83.jpg';
import OliveActiveWear from '../assets/images/portfolio/develop/olive-active-wear.jpg';
import Medestore from '../assets/images/portfolio/develop/medestore.jpg';
import TheDiveMachine from '../assets/images/portfolio/develop/the-dive-machine.jpg';
import DashboardMonalisa from '../assets/images/portfolio/develop/dashboard-monalisa.jpg';
import CrosCupones from '../assets/images/portfolio/develop/cros-cupones.jpg';
import DashboardEventos from '../assets/images/portfolio/develop/dashboard-eventos.jpg';
// import Placeholder from '../assets/images/portfolio/develop/placeholder.jpg';

const develop = ({ location, match }) => {
    const projects = [
        {
            name: "kinesis-rehab",
            text: "Lorem ipsum",
            title: "Kinesis Rehab",
            tags: ["HTML", "JS", "Sass"],
            externalUrl: 'https://www.rehabkinesis.com/',
            imgSrc: Kinesis
        },
        {
            name: "aag-locksmith",
            text: "Lorem ipsum",
            title: "AAG Locksmith",
            tags: ["HTML", "JS", "Sass"],
            externalUrl: 'https://www.aagcarlockout.com/',
            imgSrc: Locksmith
        },
        {
            name: "radio-universal",
            text: "Lorem ipsum",
            title: "Radio Universal",
            tags: ["HTML", "JS", "CSS"],
            externalUrl: 'https://www.radiouniversal.mx/',
            imgSrc: RadioUniversal
        },
        {
            name: "milla-83",
            text: "Lorem ipsum",
            title: "Milla 83",
            tags: ["HTML", "JS", "CSS", "PHP"],
            externalUrl: 'https://www.milla83.com/',
            imgSrc: Milla
        },
        {
            name: "olive-active-wear",
            text: "Lorem ipsum",
            title: "Olive Active Wear",
            tags: ["React", "Sass"],
            externalUrl: 'https://www.oliveactivewear.com/',
            imgSrc: OliveActiveWear
        },
        {
            name: "medestore",
            text: "Lorem ipsum",
            title: "Medestore",
            tags: ["HTML", "JS", "CSS"],
            externalUrl: 'https://www.medestore.mx/',
            imgSrc: Medestore
        },
        {
            name: "the-dive-machine",
            text: "Lorem ipsum",
            title: "The Dive Machine",
            tags: ["HTML", "JS", "Sass"],
            externalUrl: 'https://www.thedivemachine.com/',
            imgSrc: TheDiveMachine
        },
        {
            name: "dashboard-monalisa",
            text: "Lorem ipsum",
            title: "Dashboard Monalisa",
            tags: ["HTML", "JS", "CSS", "PHP"],
            externalUrl: 'https://www.andrevital.com/dashboard-monalisa',
            imgSrc: DashboardMonalisa
        },
        {
            name: "cros-cupones",
            text: "Lorem ipsum",
            title: "Cros Cupones",
            tags: ["HTML", "CSS", "PHP"],
            externalUrl: 'https://www.cros.com.mx/cupones',
            imgSrc: CrosCupones
        },
        {
            name: "dashboard-eventos",
            text: "Lorem ipsum",
            title: "Dashboard Eventos",
            tags: ["HTML", "CSS", "PHP"],
            externalUrl: 'https://www.andrevital.com/dashboard-eventos',
            imgSrc: DashboardEventos
        }
    ];
    projects.forEach((project) => project.localUrl = match.url);
    const hideModal = (source = 'close') => {
        const modalContainer = document.querySelector('.portfolio__modal-container');
        if(source === 'close' || source.target === modalContainer) {
            const currentModal = document.querySelector('.portfolio__modal.active');

            modalContainer.classList.remove('open');
            currentModal.classList.remove('active');
        }
    }
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
    }
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

export default develop;