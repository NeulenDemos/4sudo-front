import React, {Fragment, useContext, useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import AsyncSelect from 'react-select/async'
import makeAnimated from 'react-select/animated'
import {Redirect} from "react-router-dom";
import {Loader} from '../components/Loader';
import {Toaster} from "../components/Toaster";
import {ApiContext} from "../context/api/apiContext";


function formSubmitHandler(event, title, content, categories, createPost, setSuccess) {
    event.preventDefault();
    if (!title || !content || !title.trim() || !content.trim()) {
        toast.error("Title or content are incorrect!");
        return;
    }
    if (!categories) {
        toast.error("Choose at least one category!");
        return;
    }
    let cats = [];
    categories.forEach(cat => {
       cats.push(cat.value);
    });
    // createPost(title, content, cats);
    toast.success("Post created!");
    setTimeout(setSuccess, 1500, true);
}

const loadOptions = async (data, callback, cats) => {
    cats = cats.filter(cat => (cat.title.toLowerCase().indexOf(data.toLowerCase()) !== -1));
    cats = cats.map(cat => ({label: cat.title, value: cat.id}));
    callback(cats);
}

export const CreatePost = () => {
    const {categories, fetchCategories, isAuth, createPost} = useContext(ApiContext);

    useEffect(() => {
        if (!isAuth)
            return;
        fetchCategories();
        // eslint-disable-next-line
    }, []);
    const [title, setTitle] = useState();
    const [content, setContent] = useState();
    const [selectCategories, setCategories] = useState();
    const [success, setSuccess] = useState();
    if (!isAuth)
        return <Redirect to="/login"/>;
    if (success)
        return <Redirect to="/"/>;

    return (
        <Fragment>
            <div className="container" style={{marginTop: "20px", marginBottom: "20px"}}>
                <h1 className="display-6">Create a post</h1>
                {!categories ? <Loader /> :
                    <div className="container content" style={{marginTop: "20px", padding: "20px", width: "1000px"}}>
                        <form className="create-post">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" name="title" maxLength="64" placeholder="Write a post title..." onChange={(event) => setTitle(event.target.value)}/>
                            <label htmlFor="content">Content</label>
                            <textarea id="content" name="content" maxLength="4000" placeholder="Write a post content..." onChange={(event) => setContent(event.target.value)}/>
                            <label>Categories</label>
                            <AsyncSelect
                                id="categories"
                                components={makeAnimated()}
                                value={selectCategories}
                                onChange={cats => setCategories(cats)}
                                loadOptions={(data, callback) => loadOptions(data, callback, categories)}
                                placeholder="Search the categories..."
                                isMulti
                                theme={theme => ({
                                ...theme
                            })}/>
                            <button type="submit" onClick={(event) =>
                                formSubmitHandler(event, title, content, selectCategories, createPost, setSuccess)}>Create post</button>
                        </form>
                    </div>
                }
            </div>
            <Toaster/>
        </Fragment>
    );
}