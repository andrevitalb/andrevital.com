import React, { Fragment } from 'react';

// Components
import CtaButton from '../components/cta-button';

const home = () => {
    return (
        <Fragment>
            <section className="home">
                <section className="jumbotron">
                    <div className="jumbotron__container">
                        <div className="container-fluid">
                            <div className="row justify-center">
                                <div className="col-12 jumbotron__title-container">
                                    <h1 className="jumbotron__title">Soy André Vital.</h1>
                                </div>
                                <div className="col-12 jumbotron__subtitle-container">
                                    <div className="jumbotron__subtitle">
                                        <p className="jumbotron__subtitle__text">Desarollador Full Stack</p>
                                        <p className="jumbotron__subtitle__text">Fotógrafo</p>
                                    </div>
                                </div>
                                <div className="col-12 jumbotron__cta-container">
                                    <CtaButton color="transparent" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </Fragment>
    )
}

export default home;