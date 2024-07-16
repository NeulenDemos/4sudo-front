import React, {Fragment, useContext, useEffect} from 'react';
import {ApiContext} from "../context/api/apiContext";
import {catColors, catColorsLight, pagination} from "../context/utils";
import {Link} from "react-router-dom";
import {Helmet} from "react-helmet";


export const Categories = ({location}) => {
    const {categories, fetchCategories, page, changePage} = useContext(ApiContext);

    useEffect(() => {
        fetchCategories(location.search, true);
        // eslint-disable-next-line
    }, [page, location.search]);
    useEffect(() => {
        changePage(1);
        // eslint-disable-next-line
    }, []);
    return (
        <Fragment>
            <Helmet title="Categories"/>
            <div className="container d-flex flex-row justify-content-between" style={{marginTop: "20px"}}>
                <h1 className="display-6">Categories</h1>
            </div>
            <div className="container main-container" style={{padding: "20px"}}>
                <div className="row content">
                    {categories ?
                        categories.map(category => (
                            <div className="resp-col col-sm-3 mt-3">
                                <div className="card" style={{borderColor: catColors[category.id % catColors.length]}}>
                                    <Link to={`/posts?category=${category.id}`} style={{color: "#212529", textDecoration: "none"}}>
                                        <h5 className="card-header" style={{borderColor: catColors[category.id % catColors.length],
                                            background: catColorsLight[category.id % catColors.length]}}>{category.title}</h5>
                                    </Link>
                                    <div className="card-body">
                                        <p className="card-text" style={{fontSize: "14px"}}>{category.description}</p>
                                    </div>
                                </div>
                            </div>
                        )) : null}
                </div>
                <div className="pagination-box">
                    {categories ? pagination(page, categories.last_page, changePage) : null}
                </div>
            </div>
        </Fragment>
    );
}