import * as types from '../types';

const handlers = {
    [types.SHOW_LOADER]: state => ({...state, loading: true}),
    [types.FETCH_POSTS]: (state, {payload}) => ({...state, posts: payload, loading: false}),
    [types.CHANGE_PAGE]: (state, {page}) => ({...state, page}),
    [types.CHANGE_POSTS_SORT]: (state, {param}) => ({...state, posts_params: param, asc: !state.asc}),
    [types.CHANGE_POSTS_FILTER]: (state, {params}) => ({...state, posts_params: {...state.posts_params, ...params}}),
    [types.FETCH_POST]: (state, {payload}) => ({...state, post: payload, loading: false}),
    [types.FETCH_CATEGORY]: (state, {payload}) => ({...state, category: payload, loading: false}),
    [types.FETCH_CATEGORIES]: (state, {payload}) => ({...state, categories: payload, loading: false}),
    [types.FETCH_USER]: (state, {payload}) => ({...state, user: payload, loading: false}),
    [types.FETCH_ME]: (state, {payload}) => ({...state, me: payload, loading: false}),
    [types.FETCH_POST_COMMENTS]: (state, {payload}) => ({...state, post_comments: payload, loading: false}),
    [types.FETCH_POST_ACTIONS]: (state, {payload}) => ({...state, post_actions: payload, loading: false}),
    [types.FETCH_USERS]: (state, {payload}) => ({...state, users: payload, loading: false}),
    [types.LOGIN]: (state, {isAuth}) => ({...state, isAuth: isAuth, loading: false}),
    [types.FETCH_USER_COMMENTS]: (state, {payload}) => ({...state, user_comments: payload, loading: false}),
    [types.FETCH_USER_LIKES]: (state, {payload}) => ({...state, user_likes: payload, loading: false}),
    [types.FETCH_FAVORITES]: (state, {payload}) => ({...state, favorites: payload, loading: false}),
    DEFAULT: state => state
};

export const apiReducer = (state, action) => {
    const handle = handlers[action.type] || handlers.DEFAULT;
    return handle(state, action);
};