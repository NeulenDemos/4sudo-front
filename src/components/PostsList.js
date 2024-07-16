import React, {useContext, useEffect} from 'react'
import {Link} from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import {ApiContext} from "../context/api/apiContext";
import {catColors, getDateString, getRatingClass, getRatingText, pagination} from "../context/utils";


export const PostsList = ({posts, categories, squeeze=false}) => {
    const {page, changePage} = useContext(ApiContext);

    useEffect(() => {
        changePage(1);
        // eslint-disable-next-line
    },[])

    const fill_content = posts ? posts.data.map(post => (
            <Link to={`/posts/${post.id}`} className={`list-group-item${squeeze ? '-squeeze' : ''} list-group-item-action`} aria-current="true" key={post.id}>
                <div className="d-flex w-100 justify-content-between post-header">
                    <h5 className="mb-1">{post.title}</h5>
                    <span className="date-time">{getDateString(post.created_at)}</span>
                </div>
                <div className="tags mt-2">
                    {categories ? categories.data.filter(tag => JSON.parse(post.categories).includes(tag.id.toString())).map(tag => (
                        <span className="tag" style={{background: catColors[tag.id % catColors.length]}} key={tag.id}>{tag.title}</span>
                    )) : null}
                </div>
                <p className="mb-1 mt-2"><ReactMarkdown>{post.content.length > 200 ? post.content.slice(0, 200) + '...' : post.content}</ReactMarkdown></p>
                <div className="mt-2">
                    <small className={getRatingClass(post.rating) + " rating"}>{getRatingText(post.rating)}</small>
                </div>
            </Link>
        )) : null;

    if (squeeze)
        return (
            fill_content && fill_content.length ?
            <div>
                {fill_content}
                <div style={{marginTop: "10px", marginLeft: "auto", marginRight: "auto", width: "fit-content"}}>
                    {posts ? pagination(page, posts.last_page, changePage) : null}
                </div>
            </div>
        : <span className="empty-list-message">There are no posts</span>);

    return (
        <div className="container main-container" style={{marginLeft: "auto", marginRight: "auto", marginBottom: "10px"}}>
            <div className="list-group content">
                {fill_content}
            </div>
            <div className="pagination-box">
                {posts ? pagination(page, posts.last_page, changePage) : null}
            </div>
        </div>
    );
};