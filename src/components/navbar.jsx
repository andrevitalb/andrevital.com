import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

// Assets
import Logo from '../assets/images/logo_negative.svg';

const navbar = () => {
    return (
        <Fragment>
            <header>
                <nav className="navbar">
                    <div className="navbar__container">
                        <Link to="/" className="navbar__logo-container" title="Inicio">
                            <img src={ Logo } alt="André Vital" className="navbar__logo"/>
                        </Link>
                        <div className="navbar__link-container">
                            <Link to="/" className="navbar__link" title="Inicio">
                                <i className="fal fa-home-alt navbar__link__icon"></i>
                                <p className="navbar__link__text">Inicio</p>
                            </Link>
                            <Link to="/desarrollo" className="navbar__link" title="Portafolio Desarrollo">
                                <i className="fal fa-desktop navbar__link__icon"></i>
                                <p className="navbar__link__text">Web</p>
                            </Link>
                            <Link to="/fotografia" className="navbar__link" title="Portafolio Fotografía">
                                <i className="fal fa-camera navbar__link__icon"></i>
                                <p className="navbar__link__text">Foto</p>
                            </Link>
                            <Link to="/acerca-de" className="navbar__link" title="Acerca de">
                                <i className="fal fa-user navbar__link__icon"></i>
                                <p className="navbar__link__text">Acerca de</p>
                            </Link>
                            <Link to="/contacto" className="navbar__link" title="Contacto">
                                <i className="fal fa-envelope navbar__link__icon"></i>
                                <p className="navbar__link__text">Contacto</p>
                            </Link>
                        </div>
                        <div className="navbar__socialLink-container">
                            <a href="https://www.github.com/andrevitalb" className="navbar__socialLink" rel="noreferrer" target="_blank" title="GitHub">
                                <i className="fab fa-github"></i>
                            </a>
                            <a href="https://www.linkedin.com/in/andrevitalb/" className="navbar__socialLink" rel="noreferrer" target="_blank" title="LinkedIn">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                            <a href="https://www.instagram.com/im_andrevital" className="navbar__socialLink" rel="noreferrer" target="_blank" title="Instagram">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="https://www.twitter.com/andrevitalb" className="navbar__socialLink" rel="noreferrer" target="_blank" title="Twitter">
                                <i className="fab fa-twitter"></i>
                            </a>
                        </div>
                    </div>
                </nav>
            </header>
        </Fragment>
    )
}


export default navbar;