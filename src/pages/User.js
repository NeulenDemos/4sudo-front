import React, {Fragment, useContext, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import Cookies from 'js-cookie';
import {ApiContext} from "../context/api/apiContext";
import * as Icons from "@material-ui/icons";
import {getDateString, getRatingClass, getRatingText} from "../context/utils";
import {PostsList} from "../components/PostsList";
import ReactMarkdown from "react-markdown";
import {Helmet} from "react-helmet";
import {Avatar} from "../components/Avatar";


function moveCarriage(pos) {
    const carriage = document.getElementById("user-menu-carriage");
    const items = document.getElementsByClassName("user-menu-items");
    if (!carriage || !items)
        return;
    // eslint-disable-next-line default-case
    switch (pos) {
        case 1:
            carriage.style.transform = "translateX(0px)";
            carriage.style.width = "55px";
            [...items].forEach(item => item.style.color = "#787878")
            items[0].style.color = "#282c34";
            break;
        case 2:
            carriage.style.transform = "translateX(65px)";
            carriage.style.width = "100px";
            [...items].forEach(item => item.style.color = "#787878")
            items[1].style.color = "#282c34";
            break;
        case 3:
            carriage.style.transform = "translateX(175px)";
            carriage.style.width = "50px";
            [...items].forEach(item => item.style.color = "#787878")
            items[2].style.color = "#282c34";
            break;
        case 4:
            carriage.style.transform = "translateX(240px)";
            carriage.style.width = "80px";
            [...items].forEach(item => item.style.color = "#787878")
            items[3].style.color = "#282c34";
            break;
    }
}


const CommentsList = ({comments}) => {
    return (comments && comments.length ? comments.map(comm => (
        <Link to={`/posts/${comm.post_id}`} className="list-group-item-squeeze list-group-item-action" aria-current="true" key={comm.id}>
            <span className="date-time">{getDateString(comm.created_at)}</span>
            <p className="mb-1 mt-2"><ReactMarkdown>{comm.content.length > 200 ? comm.content.slice(0, 200) + '...' : comm.content}</ReactMarkdown></p>
            <div className="mt-2">
                <small className={getRatingClass(comm.rating) + " rating"}>{getRatingText(comm.rating)}</small>
            </div>
        </Link>
    )) : <span className="empty-list-message">There are no comments</span>);
};

const LikesList = ({likes}) => {
    return (likes && likes.length ? likes.map(like => (
        <Link to={`/posts/${like.post_id}`} className="list-group-item-squeeze list-group-item-action" aria-current="true" key={like.id}>
            <span className="date-time">{getDateString(like.created_at)}</span>
            <p className="mb-1 mt-" style={{fontWeight: 500, fontSize: "14px"}}>Post №{like.post_id}</p>
        </Link>
    )) : <span className="empty-list-message">There are no likes</span>);
};

function UserContent({menuItem, posts, categories, comments, likes, favorites}) {
    // eslint-disable-next-line default-case
    switch (menuItem) {
        case 1:
            return <PostsList posts={posts} categories={categories} squeeze={true}/>;
        case 2:
            return <CommentsList comments={comments}/>;
        case 3:
            return <LikesList likes={likes}/>;
        case 4:
            return <PostsList posts={favorites} categories={categories} squeeze={true}/>;
    }
}

export const User = ({match}) => {
    const {user, fetchUser, isAuth, fetchPosts, posts, fetchUserComments, user_comments,
        fetchUserLikes, user_likes, fetchFavorites, favorites, categories, fetchCategories, logout} = useContext(ApiContext);
    const user_id = match.params.id;
    const me = Cookies.get('me') ? JSON.parse(Cookies.get('me')) : null;
    let canEdit = false;
    if (isAuth && me && user && (me.id === user.id || me.role === "admin"))
        canEdit = true;
    const [menuItem, setMenuItem] = useState(1);

    /* eslint-disable */
    useEffect(() => {
        fetchUser(user_id);
        fetchPosts({user: user_id, ordDate: "desc"});
        fetchUserComments(user_id);
        fetchUserLikes(user_id);
        fetchCategories();
    }, [user_id]);
    useEffect(() => {
        if (canEdit)
            fetchFavorites();
    }, [canEdit, user_id]);

    moveCarriage(menuItem);

    return (
        <Fragment>
            <Helmet title={user ? user.name : "User"}/>
            {user ?
                <div className="container main-container" style={{marginTop: "20px", marginBottom: "20px"}}>
                    <div className="content" style={{padding: "20px"}}>
                        <div className="d-flex flex-row user-block">
                            <div className="d-flex flex-column user-params"
                                 style={{width: "30%", marginRight: "15px"}}>
                                <Link to={`/users/${user.id}`} style={{margin: "0 auto", textDecoration: "none"}}>
                                    <Avatar avatar={user.picture} size={150} username={user.name} padding={70}/>
                                </Link>
                                <span style={{textAlign: "center", marginTop: "15px", fontSize: "18px", fontWeight: 500}}>{user.name}</span>
                                <span style={{textAlign: "center", fontSize: "16px", color: "#706c64"}}>@{user.login}</span>
                                <hr/>
                                <div className="d-flex flex-row align-items-center" style={{paddingLeft: "15px"}}>
                                    <Icons.WhatshotOutlined className="user-params-icon"/>
                                    <div className="d-flex flex-column" style={{lineHeight: 0.9}}>
                                        <span style={{fontWeight: 500}}>{user.rating}</span>
                                        <span style={{marginTop: "5px"}}>Rating</span>
                                    </div>
                                </div>
                                <hr/>
                                <div className="d-flex flex-row align-items-center" style={{paddingLeft: "15px"}}>
                                    <Icons.HistoryRounded className="user-params-icon"/>
                                    <div className="d-flex flex-column" style={{lineHeight: 0.9}}>
                                        <span style={{fontWeight: 500}}>{getDateString(user.created_at, true)}</span>
                                        <span style={{ marginTop: "5px"}}>Joined</span>
                                    </div>
                                </div>
                                {canEdit ?
                                    <div>
                                        <hr/>
                                        <Link to={`/users/${user.id}/edit`}><button style={{width: "100%"}}>Profile settings</button></Link>
                                    </div>
                                : null}
                                {canEdit && me.id === user.id ?
                                    <button id="log-out" style={{width: "100%"}} onClick={logout}>Log out</button>
                                : null}
                            </div>
                            <div className="user-addons" style={{width: "80%"}}>
                                <div className="user-menu">
                                    <div className="d-flex flex-row button-block">
                                        <button id="btn-posts" className="user-menu-items" onClick={() => setMenuItem(1)}>Posts</button>
                                        <button id="btn-comms" className="user-menu-items" onClick={() => setMenuItem(2)}>Comments</button>
                                        <button id="btn-likes" className="user-menu-items" onClick={() => setMenuItem(3)}>Likes</button>
                                        {canEdit ?
                                            <button id="btn-favos" className="user-menu-items" onClick={() => setMenuItem(4)}>Favorites</button>
                                        : null}
                                    </div>
                                    <div style={{width: "100%", marginTop: "10px", backgroundColor: "rgb(229, 227, 221)"}}>
                                        <div id="user-menu-carriage" style={{width: "55px", height: "1px", backgroundColor: "#333333"}}/>
                                    </div>
                                </div>
                                <div style={{marginTop: "15px"}}>
                                    <UserContent menuItem={menuItem} posts={posts} categories={categories} comments={user_comments} likes={user_likes} favorites={favorites}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            : null}
        </Fragment>
    );
}