import React, {Fragment, useContext, useEffect} from 'react';
import {Helmet} from "react-helmet";
import {PostsList} from '../components/PostsList';
import {ApiContext} from "../context/api/apiContext";


function moveMenu(menu, opened, display=0,  height="fit-content") {
    const item = document.getElementById(menu);
    if (!item)
        return;
    if (opened) {
        setTimeout(() => item.style.display = "none", display);
        item.style.height = "0";
    }
    else {
        item.style.display = "block";
        setTimeout(() => item.style.height = height, 0);
    }
    return !opened;
}


export const Posts = ({location}) => {
    const {posts, page, posts_params, asc, changePostsSort, changePostsFilter, fetchPosts, categories, fetchCategories} = useContext(ApiContext);

    let formData = {};
    let openDrop1 = false;
    let openDrop2 = false;
    function formSubmitHandler(event) {
        event.preventDefault();
        changePostsFilter(formData);
    }
    function inputChangeHandler(event) {
        formData[event.target.name] = event.target.value;
        if (formData[event.target.name] === "all")
            formData[event.target.name] = null;
    }

    /* eslint-disable */
    useEffect(() => {
        fetchPosts(location.search);
    }, [page, posts_params, location.search]);
    useEffect(() => fetchCategories(), []);

    return (
        <Fragment>
            <Helmet title="Posts"/>
            <div className="container d-flex flex-row justify-content-between" style={{marginTop: "20px", marginBottom: "20px"}}>
                <h1 className="display-6">Posts</h1>
                <div className="d-flex flex-row">
                    <div className="collapse-wrapper">
                        <button className="btn btn-primary" style={{width: "min-content"}}
                                onClick={() => openDrop1 = moveMenu("filter-menu", openDrop1, 200, "165px")}>
                            Filter
                        </button>
                        <div className="collapse" id="filter-menu" style={{height: 0}}>
                            <div className="card card-body">
                                <form className="d-flex flex-column" onSubmit={formSubmitHandler}>
                                    <div className="d-sm-flex flex-row justify-content-between">
                                        <label htmlFor="date-from">Date from:&nbsp;</label>
                                        <input type="datetime-local" id="date-from" name="dateFrom" onChange={inputChangeHandler}/>
                                    </div>
                                    <div className="d-sm-flex flex-row justify-content-between mt-2">
                                        <label htmlFor="date-to">Date to:&nbsp;</label>
                                        <input type="datetime-local" id="date-to" name="dateTo" onChange={inputChangeHandler}/>
                                    </div>
                                    <div className="d-flex flex-row justify-content-between mt-2">
                                        <span>Status:&nbsp;</span>
                                        <div>
                                        <label style={{marginRight: "8px"}}>
                                            <input type="radio" value="all" name="status" onChange={inputChangeHandler}/>
                                            &nbsp;All
                                        </label>
                                        <label style={{marginRight: "8px"}}>
                                            <input type="radio" value="1" name="status" onChange={inputChangeHandler}/>
                                            &nbsp;Active
                                        </label>
                                        <label>
                                            <input type="radio" value="a" name="status" onChange={inputChangeHandler}/>
                                            &nbsp;Blocked
                                        </label>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-outline-primary mt-2">Apply</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="dropdown">
                        <button className="btn btn-primary dropdown-toggle" type="button"
                        onClick={() => openDrop2 = moveMenu("sort-menu", openDrop2)}>
                            Sort
                        </button>
                        <ul className="dropdown-menu" id="sort-menu">
                            <li><button className="dropdown-item" id="sort1" onClick={() => {
                                changePostsSort({ordRating: asc ? "asc" : "desc"});
                                document.getElementById("sort1").className += " active";
                                document.getElementById("sort2").className = "dropdown-item";}}>By rating {asc ? '↓' : '↑'}</button></li>
                            <li><button className="dropdown-item" id="sort2" onClick={() => {
                                changePostsSort({ordDate: asc ? "asc" : "desc"});
                                document.getElementById("sort2").className += " active";
                                document.getElementById("sort1").className = "dropdown-item";}}>By date {asc ? '↓' : '↑'}</button></li>
                        </ul>
                    </div>
                </div>
            </div>
            <PostsList posts={posts} categories={categories}/>
        </Fragment>
    );
}