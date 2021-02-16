import React, { Fragment, useState, useEffect } from 'react';

const Project = ({ match }) => {
    const [type, setType] = useState();
    const [name, setName] = useState();
    const [title, setTitle] = useState();
    const [logoUrl, setLogoUrl] = useState();
    const [content, setContent] = useState();

    const fetchProjectInfo = () => {
        match.url.split('/')[1] === 'desarrollo' ? setType("develop") : setType("photography");

        setName(match.params.projectName);

        const nameString = name.split('-');
        const projectTitle = [];
        nameString.forEach((namePart) => {
            namePart !== 'aag' ?
            projectTitle.push(namePart.charAt(0).toUpperCase() + namePart.slice(1)) : 
            projectTitle.push(namePart.toUpperCase());
        });
        setTitle(projectTitle.join(' '));

        type === 'develop' ? 
        setLogoUrl(`/assets/images/portfolio/develop/${ name }/logo.svg`) :
        setLogoUrl(`/assets/images/portfolio/photography/${ name }/logo.svg`);

        fetch('/projectData.json')
        .then((res) =>  res.json())
        .then((data) => {
            console.log(data);
            // if(data !== undefined && content !== '') {
            //     const projectData = data[type].filter((project) => project.name === name)[0].sections;
            //     setContent(projectData);
            //     console.log(content);
            // }
        })
        .catch((err) => console.error(err));
    }

    useEffect(() => {
        fetchProjectInfo();
        // eslint-disable-next-line
    }, [type, name, content]);

    return (
        <Fragment>
            <section className={ `project project--${ name }` }>
                <section className="project__jumbotron">
                    <img src={ logoUrl } alt={ title } className="project__jumbotron__logo"/>
                </section>
                <section className="project__content">
                    <section className="project__section project__section--headers">
                        <h1 className="project__title">{ title }</h1>
                    </section>
                    {/* {content.map((section) => {
                        <section className={}
                    )} */}
                </section>
            </section>
        </Fragment>
    )
}

export default Project;