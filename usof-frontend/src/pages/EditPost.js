import React, {Fragment, useContext, useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import axios from "axios";
import AsyncSelect from 'react-select/async';
import makeAnimated from 'react-select/animated';
import {Redirect} from "react-router-dom";
import {ApiContext} from "../context/api/apiContext";
import Cookies from "js-cookie";
import {Helmet} from "react-helmet";
import * as Icons from "@material-ui/icons";
import {apiUrl} from "../context/utils";


function formSubmitHandler(event, id, title, content, status, cats, editPost, setSuccess) {
    event.preventDefault();
    if (!title || !content || !title.trim() || !content.trim()) {
        toast.error("Title or content are incorrect!");
        return;
    }
    if (!cats) {
        toast.error("Choose at least one category!");
        return;
    }
    let categories = [];
    cats.forEach(cat => {
       categories.push(cat.value.toString());
    });
    editPost({id, title, content, status, categories});
    toast.success("Post edited!");
    setTimeout(setSuccess, 1500, true);
}

const loadOptions = async (data, callback) => {
    const res = await axios.get(`${apiUrl}/categories?search=${data}`);
    callback(res.data.map(cat => ({label: cat.title, value: cat.id})));
}

export const EditPost = ({match}) => {
    const {post, user, fetchPost, fetchUser, isAuth, editPost} = useContext(ApiContext);
    const [title, setTitle] = useState();
    const [content, setContent] = useState();
    const [status, setStatus] = useState();
    const [selectCategories, setCategories] = useState();
    const [success, setSuccess] = useState();
    const post_id = match.params.id;
    const me = Cookies.get('me') ? JSON.parse(Cookies.get('me')) : null;

    useEffect(() => {
        if (!isAuth)
            return;
        fetchPost(post_id);
        if (post)
            fetchUser(post.user_id);
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        if (post)
            fetchUser(post.user_id);
        // eslint-disable-next-line
    }, [post]);
    if (!isAuth)
        return <Redirect to="/login"/>;
    if (user && me)
        if (user.id !== me.id && me.role !== "admin") {
            toast.error("You have not permission to edit this post!");
            setTimeout(setSuccess, 1500, true);
        }
    if (success)
        return <Redirect to={`/posts/${post_id}`}/>;
    if (post) {
        const titleEl = document.getElementById("title");
        const contentEl = document.getElementById("content");
        if (title === undefined) setTitle(post.title);
        if (content === undefined) setContent(post.content);
        if (status === undefined) setStatus(post.status);
        if (titleEl && contentEl && !(titleEl.value && contentEl.value)) {
            titleEl.value = post.title;
            contentEl.value = post.content;
        }
    }
    return (
        <Fragment>
            <Helmet title="Edit post"/>
            <div className="container" style={{marginTop: "20px", marginBottom: "20px"}}>
                <h1 className="display-6">Edit a post</h1>
            </div>
                {post && user && me ?
                    <div className="container main-container">
                        <div className="content" style={{marginTop: "20px", padding: "20px"}}>
                            <form className="create-post">
                                <label htmlFor="title">Title</label>
                                <input type="text" id="title" name="title" maxLength="64" placeholder="Write a post title..." onChange={(event) => setTitle(event.target.value)}/>
                                <label htmlFor="content">Content</label>
                                <textarea id="content" name="content" maxLength="4000" placeholder="Write a post content..." onChange={(event) => setContent(event.target.value)}/>
                                <span style={{color: "#868686", fontSize: "12px", marginLeft: "5px"}}>Tips: <code>`code`</code> <b>**bold**</b> <i>*italic*</i></span>
                                <label>Categories</label>
                                <AsyncSelect
                                    id="categories"
                                    components={makeAnimated()}
                                    value={selectCategories}
                                    onChange={cats => setCategories(cats)}
                                    loadOptions={(data, callback) => loadOptions(data, callback)}
                                    placeholder="Search the categories..."
                                    isMulti
                                    theme={theme => ({
                                    ...theme
                                })}/>
                                <div>
                                    <label htmlFor="status">Active</label>
                                    <button type="button" className="post-comm-btn" style={{marginLeft: "10px"}} onClick={() => setStatus(!status)}>
                                        {status ? <Icons.ToggleOn style={{color: "#3ea6ff"}}/> : <Icons.ToggleOff/>}
                                    </button>
                                </div>
                                <button className="btn-primary" type="submit" onClick={event =>
                                    formSubmitHandler(event, post_id, title, content, status, selectCategories, editPost, setSuccess)}>Edit post</button>
                            </form>
                        </div>
                    </div> : null}
        </Fragment>
    );
}