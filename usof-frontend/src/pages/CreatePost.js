import React, {Fragment, useContext, useEffect, useState} from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {Loader} from '../components/Loader';
import {ApiContext} from "../context/api/apiContext";
import {Link} from "react-router-dom";
import {catColors, getDateString, getRatingClass, getRatingText} from "../context/utils";
import * as Icons from "@material-ui/icons";
import DefaultAvatar from "../assets/images/account_circle_black_36dp.svg";


function btnHandler(event, post_id, opt, setOpt, opt2, setCallback, sendAction, isAuth, fetchPost) {
    let btn = event.target;
    while (btn.tagName.toLowerCase() !== 'button')
        btn = btn.parentNode;
    switch (btn.id) {
        case "like-btn":
            if (!isAuth) {
                toast.error('Please authorize first!');
                return;
            }
            setOpt(!opt);
            setCallback(false);
            sendAction({id: post_id, type: !opt ? 'like' : null, remove: opt || opt2});
            setTimeout(fetchPost, 3000, post_id);
            break;
        case "dislike-btn":
            if (!isAuth) {
                toast.error('Please authorize first!');
                return;
            }
            setOpt(!opt);
            setCallback(false);
            sendAction({id: post_id, type: !opt ? 'dislike' : null, remove: opt || opt2});
            setTimeout(fetchPost, 3000, post_id);
            break;
        case "fav-btn":
            if (!isAuth) {
                toast.error('Please authorize first!');
                return;
            }
            setOpt(!opt);
            sendAction(post_id);
            break;
        case "notify-btn":
            if (!isAuth) {
                toast.error('Please authorize first!');
                return;
            }
            setOpt(!opt);
            sendAction(post_id);
            break;
        case "share-btn":
            navigator.clipboard.writeText(`https://murmuring-bayou-41768.herokuapp.com/posts/${post_id}`).then();
            toast.success("Share link copied to clipboard!");
            break;
        case "report-btn":
            toast.error("Report sent!", {icon: '⚠'});
            break;
        default:
            break;
    }
}

function replyHandler(text, post_id, comm_id, sendComm, isAuth, fetchComm) {
    // if (!isAuth) {
    //     toast.error('Please authorize first!');
    //     return;
    // }
    if (!text) {
        toast.error('Please reply with some text!');
        return;
    }
    console.log(text)
    // sendComm({id: post_id, content: text, subComment: comm_id});
    setTimeout(fetchComm, 3000, post_id);
}

const ReplyBlock = ({post_id, comm_id=0, avatar, sendComm, isAuth, fetchComm, ph=null}) => {
    let text = '';
    return (
        <div className="d-flex flex-row justify-content-start list-group-item post-reply" style={{paddingTop: "20px"}}>
            <div>
                <img src={avatar ? avatar : DefaultAvatar}
                    alt="" style={{height: "35px", width: "35px", borderRadius: "50%"}}/>
            </div>
            <textarea className="mb-1" style={{marginLeft: "15px"}} placeholder={"Write a reply..."}
                      onChange={event => {text = event.target.value}}/>
            <div style={{marginLeft: "15px", height: "48px"}}>
                <button className="post-reply-btn" onClick={() =>
                    replyHandler(ph && text ? `@${ph} ${text}` : text, post_id, comm_id, sendComm, isAuth, fetchComm)}>
                    <Icons.SendRounded/></button>
            </div>
        </div>
    );
}


export const Post = ({match}) => {
    const {post, categories, user, post_comments, post_like,
        fetchCategories, fetchPost, fetchUser, fetchPostComments, fetchPostLike,
        sendLike, sendFavorite, sendSubscribe, sendComment, isAuth} = useContext(ApiContext);
    const [isLike, setLike] = useState();
    const [isDislike, setDislike] = useState();
    const [isFav, setFav] = useState();
    const [isNotify, setNotify] = useState();
    const post_id = match.params.id;
    let loadAllComments = false;

    useEffect(() => {
        fetchPost(post_id);
        fetchCategories();
        fetchPostComments(post_id);
        if (isAuth)
            fetchPostLike(post_id);
        if (post)
            fetchUser(post.user_id);
        // eslint-disable-next-line
    }, [post ? post.id || post_comments : null]);

    if (post_like && !isLike && !isDislike) {
        if (post_like.type === 'like')
            setLike(true);
        else if (post_like.type === 'dislike')
            setDislike(true);
    }

    return (
        <Fragment>
            {!(post && categories && user) ? <Loader /> :
                <div className="container" style={{marginTop: "20px", padding: "20px", width: "1000px"}}>
                    <div className="list-group">
                        <div className="list-group-item" aria-current="true" key="post">
                            <div className="d-flex w-100 justify-content-between post-header">
                                <h5 className="mb-1 fw-bold">{post.title}</h5>
                                <span className="date-time">{getDateString(post.created_at)}</span>
                            </div>
                            <div className="tags mt-2">
                                {categories ? categories.filter(tag => JSON.parse(post.categories).includes(tag.id)).map(tag => (
                                    <span className="tag" style={{background: catColors[tag.id % catColors.length]}} key={tag.id}>{tag.title}</span>
                                )) : <Loader/>}
                            </div>
                            <p className="mb-1 mt-2">{post.content}</p>
                            <div className="d-flex flex-column mt-md-3">
                                <div className="d-flex flex-row justify-content-between">
                                    <div>
                                        <button className="post-options-btn" id="like-btn" onClick={(event) =>
                                            btnHandler(event, post_id, isLike, setLike, isDislike, setDislike, sendLike, isAuth, fetchPost)}>
                                            {isLike ? <Icons.ThumbUp className="post-options-icon"/> : <Icons.ThumbUpOutlined className="post-options-icon"/>}</button>
                                        <button className="post-options-btn" id="dislike-btn" onClick={(event) =>
                                            btnHandler(event, post_id, isDislike, setDislike, isLike, setLike, sendLike, isAuth, fetchPost)}>
                                            {isDislike ? <Icons.ThumbDown className="post-options-icon"/> : <Icons.ThumbDownOutlined className="post-options-icon"/>}</button>
                                        <button className="post-options-btn" id="fav-btn" onClick={(event) =>
                                            btnHandler(event, post_id, isFav, setFav, null, null, sendFavorite, isAuth)}>
                                            {isFav ? <Icons.StarRounded className="post-options-icon" style={{width: "28px", height: "28px"}}/> :
                                                <Icons.StarOutlineRounded className="post-options-icon" style={{width: "28px", height: "28px"}}/>}</button>
                                        <button className="post-options-btn" id="notify-btn" onClick={(event) =>
                                            btnHandler(event, post_id, isNotify, setNotify, null, null, sendSubscribe, isAuth)}>
                                            {isNotify ? <Icons.NotificationsActiveRounded className="post-options-icon" style={{width: "28px", height: "28px"}}/> :
                                                <Icons.NotificationsNoneRounded className="post-options-icon" style={{width: "28px", height: "28px"}}/>}</button>
                                        <button className="post-options-btn" id="share-btn" onClick={(event) =>
                                            btnHandler(event, post_id)}><Icons.ShareOutlined className="post-options-icon"/></button>
                                        <button className="post-options-btn" id="report-btn" onClick={(event =>
                                            btnHandler(event, post_id))}><Icons.FlagOutlined className="post-options-icon"/></button>
                                    </div>
                                    <small className={getRatingClass(post.rating) + " rating"}>{getRatingText(post.rating)}</small>
                                </div>
                                <div className="d-flex flex-row justify-content-end">
                                    <span>By&nbsp;</span>
                                    <Link to={`/users/${post.user_id}`}>{user ? user.name : null}</Link>
                                </div>
                            </div>
                        </div>
                        {post_comments ? (
                            post_comments.map((p_comm, index) => (
                                <div className={`list-group-item post-comment ${!loadAllComments && index >= 2 ? "visually-hidden" : null}`} aria-current="true" key={p_comm.id}>
                                    {index === 0 && post_comments.length > 2 ? (
                                        <div className="d-flex flex-row justify-content-between mt-2" id="post-comments-elem">
                                            <button className="button-link" onClick={() => {
                                                let comm_iter = document.getElementsByClassName("post-comment");
                                                for (let i = 0; i < comm_iter.length; i++)
                                                    comm_iter[i].className = "list-group-item post-comment";
                                                document.getElementById("post-comments-elem").className = "visually-hidden";
                                            }}>Load more comments</button>
                                            <span>2 of {post_comments.length}</span>
                                        </div>
                                    ) : null}
                                    <div className="d-flex flex-row justify-content-start mt-2">
                                        <div>
                                            <Link to={`/users/${/* TODO p_comm.user.id*/5}`}><img
                                                src={/*p_comm.user.picture ? `/storage/images/${p_comm.user.picture}` :*/ DefaultAvatar}
                                                alt=""  style={{height: "35px", width: "35px", borderRadius: "50%"}}/></Link>
                                        </div>
                                        <div style={{marginLeft: "15px", width: "100%"}}>
                                            <div className="d-flex flex-row justify-content-between mb-2">
                                                <span className="fw-bold">{p_comm.user.name}</span>
                                                <span className="date-time">{getDateString(p_comm.created_at)}</span>
                                            </div>
                                            <p className="mb-1">{p_comm.content}</p>
                                            <div id={`comm-btn-${p_comm.id}`}>
                                                <button className="post-comm-btn" onClick={() =>
                                                    {document.getElementById(`comm-btn-${p_comm.id}`).style.display = "none";
                                                     document.getElementById(`comm-block-${p_comm.id}`).style.display = "block";}}>
                                                    <Icons.ChatBubbleOutlineRounded/></button>
                                            </div>
                                            <div id={`comm-block-${p_comm.id}`} style={{display: "none"}}>
                                                <ReplyBlock post_id={post_id} comm_id={p_comm.id}
                                                            avatar={0} sendComm={sendComment} isAuth={isAuth} fetchComm={fetchPostComments}/>
                                                <button className="post-comm-btn" onClick={() =>
                                                    {document.getElementById(`comm-btn-${p_comm.id}`).style.display = "block";
                                                     document.getElementById(`comm-block-${p_comm.id}`).style.display = "none";}}>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column mt-2" style={{marginLeft: "40px"}}>
                                        {p_comm ? post_comments.map(p_c_comm => ( // TODO p_comm.comments ? p_comm.comments
                                            <div className="d-flex flex-row justify-content-start mt-2">
                                                <div>
                                                    <Link to={`/users/${/* TODO p_comm.user.id*/5}`}><img
                                                        src={/*p_c_comm.user.picture ? `/storage/images/${p_c_comm.user.picture}` :*/ DefaultAvatar}
                                                        alt=""  style={{height: "35px", width: "35px", borderRadius: "50%"}}/></Link>
                                                </div>
                                                <div style={{marginLeft: "15px", width: "100%"}}>
                                                    <div className="d-flex flex-row justify-content-between mb-2">
                                                        <span className="fw-bold">{p_comm.user.name}</span>
                                                        <span className="date-time">{getDateString(p_c_comm.created_at)}</span>
                                                    </div>
                                                    <p className="mb-1">{p_c_comm.content}</p>
                                                    <div id={`sub-comm-btn-${p_comm.id}`}>
                                                        <button className="post-comm-btn" onClick={() =>
                                                            {document.getElementById(`sub-comm-btn-${p_comm.id}`).style.display = "none";
                                                             document.getElementById(`sub-comm-block-${p_comm.id}`).style.display = "block";}}>
                                                            <Icons.ChatBubbleOutlineRounded/></button>
                                                    </div>
                                                    <div id={`sub-comm-block-${p_comm.id}`} style={{display: "none"}}>
                                                        <ReplyBlock post_id={post_id} comm_id={p_comm.id}
                                                                    avatar={0} sendComm={sendComment} isAuth={isAuth} fetchComm={fetchPostComments} ph={p_c_comm.user.login}/>
                                                        <button className="post-comm-btn" onClick={() =>
                                                            {document.getElementById(`sub-comm-btn-${p_comm.id}`).style.display = "block";
                                                             document.getElementById(`sub-comm-block-${p_comm.id}`).style.display = "none";}}>Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )) : null}
                                    </div>
                                </div>
                            ))
                        ) : null}
                        <ReplyBlock post_id={post_id} avatar={0} sendComm={sendComment} isAuth={isAuth} fetchComm={fetchPostComments}/>
                    </div>
                </div>
            }
            <Toaster position="bottom-center"  reverseOrder={false} toastOptions=
                {{  duration: 2000,
                    style: {
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        padding: '10px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#7c6aef',
                            secondary: '#FFF',
                        }
                    },
                    error: {duration: 4000}}}/>
        </Fragment>
    );
}