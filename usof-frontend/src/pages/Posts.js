import React, {Fragment, useContext, useEffect} from 'react';
import {PostsList} from '../components/PostsList';
import {Loader} from '../components/Loader';
import {ApiContext} from "../context/api/apiContext";

export const Home = () => {
    const {loading, posts, page, fetchPosts} = useContext(ApiContext);

    useEffect(() => {
        fetchPosts(page);
        // eslint-disable-next-line
    }, [page]);

    return (
        <Fragment>
            <div className="container" style={{marginTop: "20px", marginBottom: "20px"}}>
                <h1 className="display-6">Last posts</h1>
            </div>
            {loading ? <Loader /> : <PostsList posts={posts} />}
        </Fragment>
    );
}