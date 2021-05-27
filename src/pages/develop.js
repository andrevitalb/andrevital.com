import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';

// Components
import { PortfolioList } from '../components/portfolioComponents';
import Project from './Project';

const develop = ({ location, match }) => {
    return (
        <Fragment>
            { match.path === location.pathname && <PortfolioList match={ match }/> }
            <Route path={ `${match.path}/:projectName` } component={ Project } /> 
        </Fragment>
    )
}

export default develop;