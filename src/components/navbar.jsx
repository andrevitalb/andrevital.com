import React from 'react';
import { NavLink } from 'react-router-dom';

// Assets
import Logo from '../assets/images/logo_negative.svg';

const Navbar = () => {
    return (
        <header>
            <nav className="navbar">
                <div className="navbar__container">
                    <NavLink to="/" className="navbar__logo-container" title="Inicio">
                        <img src={ Logo } alt="André Vital" className="navbar__logo"/>
                    </NavLink>
                    <div className="navbar__link-container">
                        <NavLink exact to="/" activeClassName="active" className="navbar__link" title="Inicio">
                            <i className="fal fa-home-alt navbar__link__icon"></i>
                            <p className="navbar__link__text">Inicio</p>
                        </NavLink>
                        <NavLink strict to="/desarrollo" activeClassName="active" className="navbar__link" title="Portafolio Desarrollo">
                            <i className="fal fa-desktop navbar__link__icon"></i>
                            <p className="navbar__link__text">Web</p>
                        </NavLink>
                        <NavLink strict to="/fotografia" activeClassName="active" className="navbar__link" title="Portafolio Fotografía">
                            <i className="fal fa-camera navbar__link__icon"></i>
                            <p className="navbar__link__text">Foto</p>
                        </NavLink>
                        <NavLink exact to="/acerca-de" activeClassName="active" className="navbar__link" title="Acerca de">
                            <i className="fal fa-user navbar__link__icon"></i>
                            <p className="navbar__link__text">Acerca de</p>
                        </NavLink>
                        <NavLink exact to="/contacto" activeClassName="active" className="navbar__link" title="Contacto">
                            <i className="fal fa-envelope navbar__link__icon"></i>
                            <p className="navbar__link__text">Contacto</p>
                        </NavLink>
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
    )
}


export default Navbar;