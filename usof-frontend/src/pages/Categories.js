import React, {Fragment, useContext, useEffect} from 'react';
import {PostsList} from '../components/PostsList';
import {Loader} from '../components/Loader';
import {ApiContext} from "../context/api/apiContext";


export const Posts = () => {
    const {loading, posts, page, posts_params, asc, changePostsSort, changePostsFilter, fetchPosts} = useContext(ApiContext);

    let formData = {};
    function formSubmitHandler(event) {
        event.preventDefault();
        changePostsFilter(formData);
    }
    function inputChangeHandler(event) {
        formData[event.target.name] = event.target.value;
        if (formData[event.target.name] === "all")
            formData[event.target.name] = null;
    }

    useEffect(() => {
        fetchPosts();
        // eslint-disable-next-line
    }, [page, posts_params]);

    return (
        <Fragment>
            <div className="container d-flex flex-row justify-content-between" style={{marginTop: "20px", marginBottom: "20px"}}>
                <h1 className="display-6">Posts</h1>
                <div className="d-flex flex-row">
                    <div className="collapse-wrapper">
                        <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample"
                                aria-expanded="false" aria-controls="collapseExample" style={{width: "min-content"}}>
                            Filter
                        </button>
                        <div className="collapse" id="collapseExample">
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
                        <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            Sort
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
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
            {loading ? <Loader /> : <PostsList posts={posts} />}
        </Fragment>
    );
}