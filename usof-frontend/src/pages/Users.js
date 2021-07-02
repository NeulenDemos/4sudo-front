import React, {Fragment, useContext, useEffect} from 'react';
import {PostsList} from '../components/PostsList';
import {Loader} from '../components/Loader';
import {ApiContext} from "../context/api/apiContext";
import {catColors, catColorsLight} from "../context/utils";
import {Link} from "react-router-dom"


export const Categories = () => {
    const {loading, categories, fetchCategories} = useContext(ApiContext);

    useEffect(() => {
        fetchCategories();
        // eslint-disable-next-line
    }, []);

    return (
        <Fragment>
            <div className="container" style={{marginTop: "20px", padding: "20px", width: "1000px"}}>
                <h1 className="display-6">Categories</h1>
                <div className="row">
                    {categories ?
                        categories.map(category => (
                            <div className="col-sm-4 mt-3">
                                <div className="card" style={{borderColor: catColors[category.id % catColors.length]}}>
                                    <Link to={`/posts?category=${category.id}`} style={{color: "#212529", textDecoration: "none"}}>
                                        <h5 className="card-header" style={{borderColor: catColors[category.id % catColors.length],
                                            background: catColorsLight[category.id % catColors.length]}}>{category.title}</h5>
                                    </Link>
                                    <div className="card-body">
                                        <p className="card-text" style={{fontSize: "14px"}}>{category.description}</p>
                                        {/*<a href="#" className="btn btn-primary">Go somewhere</a>*/}
                                    </div>
                                </div>
                            </div>
                        ))
                        : <Loader />}
                </div>
            </div>
        </Fragment>
    );
}