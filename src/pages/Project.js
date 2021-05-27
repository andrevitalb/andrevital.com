import React, { useState, useEffect, useRef } from 'react';

// Components
import { DynamicPortfolioComponent } from '../components/portfolioComponents';

// Contexts
import { useDevelopProjects, usePhotographyProjects } from '../contexts/ProjectsContext';

const Project = ({ match }) => {
    const developProjects = useDevelopProjects();
    const photographyProjects = usePhotographyProjects();
    const [type, setType] = useState();
    const [name, setName] = useState();
    const [title, setTitle] = useState();
    const [tags, setTags] = useState([]);
    const [content, setContent] = useState();

    const fetchProjectInfo = useRef(null);
    if(!fetchProjectInfo.current) {
        fetchProjectInfo.current = () => {
            const currentType = match.url.split('/')[1] === 'desarrollo' ? 'develop' : 'photography';
            const currentName = match.params.projectName;
            setType(currentType);
            setName(currentName);
    
            if(currentName !== undefined) {
                const { title, tags, content } = currentType === 'develop' ? developProjects.find((project) => project.name === currentName) : photographyProjects.find((project) => project.name === currentName);
    
                setTitle(title);
                setTags(tags);
                setContent(content);
            }
        }
    }

    useEffect(() => {
        fetchProjectInfo.current();
    }, []);

    return (
        <section className={ `project project--${ name }` }>
            <section className="project__jumbotron">
                <img src={ `/assets/images/portfolio/${type}/${name}/logo.svg` } alt={ title } className="project__jumbotron__logo"/>
            </section>
            <section className="project__content">
                <section className="project__section project__section--header">
                    <h1 className="project__title">{ title }</h1>
                    <div className="project__tags">
                        <div className="project__tag-container">
                            { tags.map((tag) => (
                                <div key={ tag } className="project__tag">
                                    <p className="project__tag__text">
                                        { tag }
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                { 
                    content !== undefined && (
                        content.map((section, i) => (
                            <section key={ i } className={ `project__section ${section?.classes?.join(' ') || ''}` }>
                                { 
                                    section?.children.map((child, j) => 
                                        <DynamicPortfolioComponent 
                                            key={ j } 
                                            name={ name } 
                                            type={ type } 
                                            child={ child }
                                        />
                                    )
                                }
                            </section>
                        ))
                    )
                }
            </section>
        </section>
    )
}

export default Project;