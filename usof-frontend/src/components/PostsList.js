import React, {useContext} from 'react'
import {Link} from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import {ApiContext} from "../context/api/apiContext";
import {catColors, getDateString, getRatingClass, getRatingText} from "../context/utils";


function pagination(page, last_page, changePage) {
    const pages_range = 2;
    let last_curr = last_page;
    let first_page = page - pages_range;
    if (first_page < 1)
        first_page = 1;
    if (last_curr > page + pages_range)
        last_curr = page + pages_range;
    let pages = [];
    for (let i = first_page; i < page; i++)
        pages.push(<li className="page-item"><button className="page-link" onClick={() => changePage(i)}>{i}</button></li>);
    pages.push(<li className="page-item active" aria-current="page"><span className="page-link">{page}</span></li>);
    for (let i = page + 1; i < last_curr + 1; i++)
        pages.push(<li className="page-item"><button className="page-link" onClick={() => changePage(i)}>{i}</button></li>);
    return (
        <nav aria-label="...">
            <ul className="pagination">
                <li className="page-item">
                    <button className="page-link" onClick={() => changePage(1)}>First</button>
                </li>
                {pages}
                <li className="page-item">
                    <button className="page-link" onClick={() => changePage(last_page)}>Last</button>
                </li>
            </ul>
        </nav>
    );
}

export const PostsList = ({posts, categories, squeeze=false}) => {
    const {page, changePage} = useContext(ApiContext);

    const fill_content = posts ? posts.data.map(post => (
            <Link to={`/posts/${post.id}`} className={`list-group-item${squeeze ? '-squeeze' : ''} list-group-item-action`} aria-current="true" key={post.id}>
                <div className="d-flex w-100 justify-content-between post-header">
                    <h5 className="mb-1">{post.title}</h5>
                    <span className="date-time">{getDateString(post.created_at)}</span>
                </div>
                <div className="tags mt-2">
                    {categories ? categories.filter(tag => JSON.parse(post.categories).includes(tag.id.toString())).map(tag => (
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
        : <span className="empty-list-message">There is no any posts</span>);

    return (
        <div className="container main-container" style={{marginLeft: "auto", marginRight: "auto", marginBottom: "10px"}}>
            <div className="list-group content">
                {fill_content}
            </div>
            <div style={{marginTop: "10px", marginLeft: "auto", marginRight: "auto", width: "fit-content"}}>
                {posts ? pagination(page, posts.last_page, changePage) : null}
            </div>
        </div>
    );
};