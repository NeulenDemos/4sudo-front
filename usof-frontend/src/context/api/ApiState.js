import React, {useReducer} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {ApiContext} from './apiContext';
import {apiReducer} from './apiReducer';
import * as types from '../types';
import {apiUrl} from "../utils";
import toast from 'react-hot-toast';


export const ApiState = ({children}) => {
    const [state, dispatch] = useReducer(apiReducer, {loading: false, page: 1, posts_per_page: 5, asc: false});

    const showLoader = () => dispatch({type: types.SHOW_LOADER});

    const changePage = (page) => dispatch({type: types.CHANGE_PAGE, page});
    const changePostsSort = (param) => dispatch({type: types.CHANGE_POSTS_SORT, param});
    const changePostsFilter = (params) => dispatch({type: types.CHANGE_POSTS_FILTER, params});

    const fetchPosts = async (inline_params=null) => {
        showLoader();
        let urlParams = typeof(inline_params) === 'string' ? inline_params.replace('?', '&') : '';
        let params = state.posts_params || (inline_params && typeof(inline_params) === 'object' ? inline_params : null);
        if (params)
            Object.keys(params).forEach((key) => {
                if (params[key] !== null)
                    urlParams += `&${key}=${params[key]}`
            });
        const res = await axios.get(`${apiUrl}/posts?page=${state.page}&posts_per_page=${state.posts_per_page}${urlParams}`);
        const payload = res.data;
        dispatch({type: types.FETCH_POSTS, payload});
    };

    const fetchCategory = async (id) => {
        showLoader();
        const res = await axios.get(`${apiUrl}/categories/${id}`);
        const payload = {...res.data, id};
        dispatch({type: types.FETCH_CATEGORY, payload});
    };

    const fetchPost = async (id) => {
        showLoader();
        const res = await axios.get(`${apiUrl}/posts/${id}`);
        const payload = res.data[0];
        dispatch({type: types.FETCH_POST, payload});
    };

    const fetchPostActions = async (id) => {
        showLoader();
        const res = await axios.get(`${apiUrl}/posts/${id}/actions`, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
        const payload = res.data;
        dispatch({type: types.FETCH_POST_ACTIONS, payload});
    };

    const fetchCategories = async () => {
        showLoader();
        const res = await axios.get(`${apiUrl}/categories`);
        const payload = res.data;
        dispatch({type: types.FETCH_CATEGORIES, payload});
    };

    const fetchUser = async (id) => {
        showLoader();
        const res = await axios.get(`${apiUrl}/users/${id}`);
        const payload = res.data[0];
        dispatch({type: types.FETCH_USER, payload});
        console.log(state)
    };

    const fetchPostComments = async (id) => {
        showLoader();
        const res = await axios.get(`${apiUrl}/posts/${id}/comments`);
        const payload = res.data;
        dispatch({type: types.FETCH_POST_COMMENTS, payload});
        console.log(state)
    };

    const fetchUserComments = async (id) => {
        showLoader();
        const res = await axios.get(`${apiUrl}/users/${id}/comments`);
        const payload = res.data;
        dispatch({type: types.FETCH_USER_COMMENTS, payload});
        console.log(state)
    };

    const fetchUserLikes = async (id) => {
        showLoader();
        const res = await axios.get(`${apiUrl}/users/${id}/likes`);
        const payload = res.data;
        dispatch({type: types.FETCH_USER_LIKES, payload});
        console.log(state)
    };

    const fetchUsers = async () => {
        showLoader();
        const res = await axios.get(`${apiUrl}/users`);
        const payload = res.data;
        dispatch({type: types.FETCH_USERS, payload});
    };

    const fetchMe = async () => {
        try {
            const res = await axios.get(`${apiUrl}/users/me`, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
            const payload = res.data[0];
            Cookies.set('me', payload, {sameSite: 'strict'});
            dispatch({type: types.FETCH_ME, payload});
        }
        catch (e) {
            if (state.isAuth) {
                dispatch({type: types.LOGIN, isAuth: false});
                Cookies.remove('me');
            }
        }
    };

    const fetchFavorites = async () => {
        let success = true;
        const res = await axios.get(`${apiUrl}/users/favorites`, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}})
            .catch(() => success=false);
        if (success) {
            const payload = {data: res.data, last_page: 1};
            dispatch({type: types.FETCH_FAVORITES, payload});
        }
    };

    const login = async ({email, pass}) => {
        let success = true;
        const res = await axios.post(`${apiUrl}/auth/login`, {email, password: pass})
            .catch(() => success=false);
        if (!success) {
            toast.error("Incorrect email or password");
            dispatch({type: types.LOGIN, isAuth: false});
            return;
        }
        Cookies.set('token', res.data["access_token"], {expires: (res.data["expires_in"] / 86400), sameSite: 'strict'});
        dispatch({type: types.LOGIN, isAuth: true});
        await fetchMe();
    }

    const register = async ({email, username, name, pass}) => {
        let success = true;
        await axios.post(`${apiUrl}/auth/register`, {email, login: username, name, password: pass})
            .catch(e => {toast.error(e.response.data.error); success=false;});
        if (success) {
            await dispatch({type: types.REGISTER, success: true});
            await login({email, pass});
        }
    }

    const logout = async () => {
        let success = true;
        await axios.post(`${apiUrl}/auth/logout`, null, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}})
            .catch(() => success=false);
        if (!success) {
            toast.error("An error occurred");
            return;
        }
        Cookies.remove('me');
        Cookies.remove('token');
        dispatch({type: types.LOGIN, isAuth: false});
        toast.success("Successfully logged out");
    }

    const passwordReset = async (email) => {
        await axios.post(`${apiUrl}/auth/password-reset`, {email});
    }

    const refreshAuth = async () => {
        if (!state.isAuth && Cookies.get('token'))
            dispatch({type: types.LOGIN, isAuth: true});
    }

    const sendLike = async ({id, type=null, remove=false, comment=false}) => {
        if (remove)
            await axios.delete(`${apiUrl}/${comment ? "comments" : "posts"}/${id}/like`, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
        if (type)
            await axios.post(`${apiUrl}/${comment ? "comments" : "posts"}/${id}/like`, {type}, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
    }

    const sendFavorite = async ({id, remove=false}) => {
        if (remove)
            await axios.delete(`${apiUrl}/posts/${id}/favorite`, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
        else
            await axios.post(`${apiUrl}/posts/${id}/favorite`, null, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
    }

    const sendSubscribe = async ({id, remove=false}) => {
        if (remove)
            await axios.delete(`${apiUrl}/posts/${id}/subscribe`, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
        else
            await axios.post(`${apiUrl}/posts/${id}/subscribe`, null, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
    }

    const sendComment = async ({id, content}) => {
        await axios.post(`${apiUrl}/posts/${id}/comments`, {content}, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
    }

    const sendSubComment = async ({id, content}) => {
        await axios.post(`${apiUrl}/comments/${id}/comments`, {content}, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
    }

    const createPost = async (title, content, categories) => {
        await axios.post(`${apiUrl}/posts`,
            {title, content, categories}, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
    }

    const editPost = async ({id, title, content, status, categories}) => {
        let data = {};
        if (title) data.title = title;
        if (content) data.content = content;
        if (status !== undefined) data.status = status;
        if (categories) data.categories = categories;
        await axios.patch(`${apiUrl}/posts/${id}`, data, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
    }

    const editComment = async ({id, content, best}) => {
        let data = {};
        if (content) data.content = content;
        if (best) data.best = best;
        await axios.patch(`${apiUrl}/comments/${id}`, data, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
    }

    const deletePost = async (id) => {
        await axios.delete(`${apiUrl}/posts/${id}`, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
    }

    const deleteComment = async (id) => {
        await axios.delete(`${apiUrl}/comments/${id}`, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
    }

    const editAvatar = async (image) => {
        const formData = new FormData();
        formData.append("image", image);
        await axios.post(`${apiUrl}/users/avatar`, formData, {headers: {Authorization: `Bearer ${Cookies.get('token')}`, 'Content-Type': 'multipart/form-data'}});
    }

    const editUser = async ({id, data}) => {
        await axios.patch(`${apiUrl}/users/${id}`, data, {headers: {Authorization: `Bearer ${Cookies.get('token')}`}});
    }

    return (
        <ApiContext.Provider value={{
            showLoader,
            fetchPosts,
            changePage,
            changePostsSort,
            changePostsFilter,
            fetchPost,
            fetchCategory,
            fetchCategories,
            fetchUser,
            fetchPostComments,
            fetchUserComments,
            fetchUserLikes,
            fetchPostActions,
            fetchUsers,
            login,
            logout,
            register,
            passwordReset,
            refreshAuth,
            fetchMe,
            fetchFavorites,
            sendLike,
            sendFavorite,
            sendSubscribe,
            sendComment,
            sendSubComment,
            createPost,
            editPost,
            deletePost,
            editComment,
            deleteComment,
            editAvatar,
            editUser,

            loading: state.loading,
            posts: state.posts,
            page: state.page,
            posts_params: state.posts_params,
            asc: state.asc,
            post: state.post,
            categories: state.categories,
            user: state.user,
            post_comments: state.post_comments,
            user_comments: state.user_comments,
            users: state.users,
            isAuth: state.isAuth,
            isReg: state.isReg,
            isErr: state.isErr,
            me: state.me,
            post_actions: state.post_actions,
            user_likes: state.user_likes,
            favorites: state.favorites
        }}>
            {children}
        </ApiContext.Provider>
    )
}