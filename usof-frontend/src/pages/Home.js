import React, {Fragment, useContext, useEffect} from 'react';
import {Helmet} from "react-helmet";
import {PostsList} from '../components/PostsList';
import {ApiContext} from "../context/api/apiContext";

export const Home = () => {
    const {posts, page, fetchPosts, categories, fetchCategories} = useContext(ApiContext);

    /* eslint-disable */
    useEffect(() => {
        fetchPosts({ordDate: "desc"});
    }, [page]);
    useEffect(() => fetchCategories(), []);

    return (
        <Fragment>
            <Helmet title="Home"/>
            <div className="container" style={{marginTop: "20px", marginBottom: "20px"}}>
                <h1 className="display-6">Last posts</h1>
            </div>
            <PostsList posts={posts} categories={categories}/>
        </Fragment>
    );
}