import React, { useState, createContext, useContext } from 'react';
import { projectData } from '../services/projectData';

const DevelopProjectsContext = createContext();
const PhotographyProjectsContext = createContext();

export const useDevelopProjects = () => {
    return useContext(DevelopProjectsContext);
}

export const usePhotographyProjects = () => {
    return useContext(PhotographyProjectsContext);
}

export const ProjectsProvider = ({ children }) => {
    const [developProjects] = useState(projectData.develop);
    const [photographyProjects] = useState(projectData.photography);

    return ( 
        <DevelopProjectsContext.Provider value={ developProjects } >
            <PhotographyProjectsContext.Provider value={ photographyProjects } >
                { children }
            </PhotographyProjectsContext.Provider>
        </DevelopProjectsContext.Provider>
    );
};