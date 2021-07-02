import React, {useContext, useEffect} from 'react'
import {ApiContext} from "../context/api/apiContext";
import {Loader} from "./Loader";
import {Link} from "react-router-dom";

function getDateString(str) {
    let date = new Date(str);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
}

function getRatingClass(likes) {
    if (likes > 10)
        return "ratingGold";
    else if (likes > 0)
        return "ratingGreen";
    else if (likes === 0)
        return "ratingGrey";
    return "ratingRed";
}

function getRatingText(likes) {
    if (likes >= 0)
        return `${likes} Likes`;
    return `${-likes} Dislikes`;
}

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

export const Posts = ({posts}) => {
    const {page, categories, fetchCategories, changePage} = useContext(ApiContext);
    const catColors = [
        "#cc2714",
        "#cc5b14",
        "#cc9214",
        "#0f9962",
        "#143fcc"];

    useEffect(() => {
        fetchCategories();
        // eslint-disable-next-line
    }, [])

    return (
    <div className="container" style={{marginLeft: "auto", marginRight: "auto"}}>
        <div className="list-group">
            {posts ? posts.data.map(post => (
                <Link to={`/posts/${post.id}`} className="list-group-item list-group-item-action" aria-current="true" key={post.id}>
                    <div className="d-flex w-100 justify-content-between post-header">
                        <h5 className="mb-1">{post.title}</h5>
                        <small>{getDateString(post.created_at)}</small>
                    </div>
                    <div className="tags">
                        {categories ? categories.filter(tag => JSON.parse(post.categories).includes(tag.id)).map(tag => (
                            <span className="tag" style={{background: catColors[tag.id % catColors.length]}} key={tag.id}>{tag.title}</span>
                        )) : <Loader/>}
                    </div>
                    <p className="mb-1">{post.content.length > 200 ? post.content.slice(0, 200) + '...' : post.content}</p>
                    <small className={getRatingClass(post.rating) + " rating"}>{getRatingText(post.rating)}</small>
                </Link>
            )) : null}
        </div>
        <div style={{marginTop: "10px", marginLeft: "auto", marginRight: "auto", width: "fit-content"}}>
            {posts ? pagination(page, posts.last_page, changePage) : null}
        </div>
    </div>
    );
};