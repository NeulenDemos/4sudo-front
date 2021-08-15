import React, {Fragment, useContext, useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import {Link} from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import Cookies from 'js-cookie';
import {Helmet} from "react-helmet";
import {ApiContext} from "../context/api/apiContext";
import {catColors, getDateString, getRatingClass, getRatingText} from "../context/utils";
import * as Icons from "@material-ui/icons";
import HappyLogo from "../assets/images/happy.svg";
import {Avatar} from "../components/Avatar";


function btnHandler(event, post_id, opt, setOpt, opt2, setCallback, sendAction, isAuth, fetchPost) {
    let btn = event.target;
    while (btn.tagName.toLowerCase() !== 'button')
        btn = btn.parentNode;
    const btn_id = btn.id || btn.name;
    switch (btn_id) {
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
            sendAction({id: post_id, remove: opt});
            break;
        case "notify-btn":
            if (!isAuth) {
                toast.error('Please authorize first!');
                return;
            }
            setOpt(!opt);
            sendAction({id: post_id, remove: opt});
            break;
        case "share-btn":
            navigator.clipboard.writeText(`https://murmuring-bayou-41768.herokuapp.com/posts/${post_id}`).then();
            toast.success("Share link copied to clipboard!");
            break;
        case "report-btn":
            toast.error("Report sent!", {icon: '⚠'});
            break;
        case "delete-btn": case "delete-comm-btn":
            toast((t) => (
                    <div>
                        <span>Are you sure you want to delete this {btn_id === "delete-btn" ? "post" : "comment"}?</span>
                        <button style={{marginTop: "6px", padding: "5px", width: "100%", backgroundColor: "#e15f5f",
                            border: "none", borderRadius: "6px", color: "white", fontWeight: "500"}}
                                onClick={() => {
                                    sendAction(opt || post_id);
                                    toast.dismiss(t.id);
                                    if (btn_id === "delete-btn")
                                        setTimeout(() => document.location.href = "/", 2000);
                                    else
                                        setTimeout(fetchPost, 2000, post_id);
                                }}>Confirm</button>
                    </div>
                ), {duration: 6000}
            );
            break;
        case "best-comm-btn":
            sendAction[0]({id: opt, best: true});
            sendAction[1]({id: post_id, status: false});
            break;
        case "like-comm-btn":
            if (!isAuth) {
                toast.error('Please authorize first!');
                return;
            }
            sendAction({id: opt, type: 'like', comment: true});
            setTimeout(fetchPost, 3000, post_id);
            break;
        case "dislike-comm-btn":
            if (!isAuth) {
                toast.error('Please authorize first!');
                return;
            }
            sendAction({id: opt, type: 'dislike', comment: true});
            setTimeout(fetchPost, 3000, post_id);
            break;
        default:
            break;
    }
}

function replyHandler(text, post_id, comm_id, sendComm, isAuth, fetchComm) {
    if (!isAuth) {
        toast.error('Please authorize first!');
        return;
    }
    if (!text) {
        toast.error('Please reply with some text!');
        return;
    }
    sendComm({id: comm_id || post_id, content: text});
    setTimeout(fetchComm, 3000, post_id);
}

const ReplyBlock = ({post_id, comm, avatar, username, sendComm, isAuth, fetchComm, sub=false, border=false}) => {
    let text = '';
    return (
        <div className={"d-flex flex-row justify-content-start list-group-item post-reply" + (!border ? " no-border" : '')}
             style={!border ? {padding: "20px 0 0 0", marginLeft: "-15px"} : null}>
            <div>
                <Avatar avatar={avatar} size={35} username={username} padding={8}/>
            </div>
            <textarea className="mb-1" style={{marginLeft: "15px"}} placeholder={"Write a reply..."}
                      onChange={event => {text = event.target.value}}/>
            <div style={{marginLeft: "15px", height: "48px"}}>
                <button className="post-reply-btn" onClick={() =>
                    replyHandler(sub && text ? `[@${comm.user.login}](/users/${comm.user.id}) ${text}` : text,
                        post_id, comm.id, sendComm, isAuth, fetchComm)}>
                    <Icons.SendRounded/></button>
            </div>
        </div>
    );
}

const EditBlock = ({post_id, comm_id=0, editComm, isAuth, fetchComm, sub=false}) => {
    let text = '';
    return (
        <div className="d-flex flex-row justify-content-start list-group-item post-reply no-border" style={{padding: 0}}>
            <textarea className="mb-1" placeholder={"Edit a reply..."}
                      onChange={event => {text = event.target.value}}/>
            <div style={{height: "48px"}}>
                <button className="post-reply-btn" onClick={() => {
                    replyHandler(text, post_id, comm_id, editComm, isAuth, fetchComm);
                    const s = sub ? 'sub-' : '';
                    document.getElementById(`${s}comm-btn-${comm_id}`).style.display = "block";
                    document.getElementById(`${s}comm-content-${comm_id}`).style.display = "block";
                    document.getElementById(`${s}comm-edit-block-${comm_id}`).style.display = "none";}}>
                    <Icons.SendRounded/></button>
            </div>
        </div>
    );
}

export const Post = ({match}) => {
    const {post, categories, user, post_comments, post_actions,
        fetchCategories, fetchPost, fetchUser, fetchPostComments, fetchPostActions, editComment, editPost, deleteComment,
        sendLike, sendFavorite, sendSubscribe, sendComment, sendSubComment, deletePost, isAuth} = useContext(ApiContext);
    const [isLike, setLike] = useState();
    const [isDislike, setDislike] = useState();
    const [isFav, setFav] = useState();
    const [isNotify, setNotify] = useState();
    const [best_comm, setBest] = useState();
    const post_id = match.params.id;
    let loadAllComments = false;

    /* eslint-disable */
    useEffect(() => {
        fetchPost(post_id);
        fetchCategories();
        fetchPostComments(post_id);
    }, []);
    useEffect(() => {if (post) fetchUser(post.user_id);}, [post]);
    useEffect(() => {if (isAuth) fetchPostActions(post_id);}, [isAuth]);
    useEffect(() => {setLike(); setDislike(); setFav(); setNotify(); setBest();}, [post_actions]);

    if (post_actions) {
        if (!isLike && !isDislike && post_actions.like) {
            if (post_actions.like.type === 'like')
                setLike(true);
            else if (post_actions.like.type === 'dislike')
                setDislike(true);
        }
        if (isFav === undefined && post_actions.favorite)
            setFav(true);
        if (isNotify === undefined  && post_actions.subscription)
            setNotify(true);
    }
    const me = Cookies.get('me') ? JSON.parse(Cookies.get('me')) : null;
    let canEdit = false;
    const authed = isAuth && me;
    if (authed && post && (me.id === post.user_id || me.role === "admin"))
        canEdit = true;

    return (
        <Fragment>
            <Helmet title={post ? post.title : "Post"}/>
            {post && categories && user ?
                <div className="container main-container" style={{marginTop: "20px", padding: "20px", width: "1000px"}}>
                    <div className="list-group content">
                        <div className="list-group-item" aria-current="true" key="post">
                            <div className="d-flex w-100 justify-content-between post-header">
                                <h5 className="mb-1 fw-bold">{post.title}</h5>
                                <span className="date-time">{getDateString(post.created_at)}</span>
                            </div>
                            <div className="tags mt-2">
                                {categories.data.filter(tag => JSON.parse(post.categories).includes(tag.id.toString())).map(tag => (
                                    <Link to={`/posts?category=${tag.id}`} style={{color: "#212529", textDecoration: "none"}}>
                                        <span className="tag" style={{background: catColors[tag.id % catColors.length]}} key={tag.id}>{tag.title}</span>
                                    </Link>
                                ))}
                            </div>
                            <p className="mb-1 mt-2"><ReactMarkdown>{post.content}</ReactMarkdown></p>
                            <div className="d-flex flex-column mt-md-3">
                                <div className="d-flex flex-row justify-content-between">
                                    <div>
                                        <button className="post-options-btn" id="like-btn" onClick={event =>
                                            btnHandler(event, post_id, isLike, setLike, isDislike, setDislike, sendLike, isAuth, fetchPost)}>
                                            {isLike ? <Icons.ThumbUp className="post-options-icon" style={{color: "#3ea6ff"}}/> :
                                                <Icons.ThumbUpOutlined className="post-options-icon"/>}</button>
                                        <button className="post-options-btn" id="dislike-btn" onClick={event =>
                                            btnHandler(event, post_id, isDislike, setDislike, isLike, setLike, sendLike, isAuth, fetchPost)}>
                                            {isDislike ? <Icons.ThumbDown className="post-options-icon" style={{color: "#3ea6ff"}}/> :
                                                <Icons.ThumbDownOutlined className="post-options-icon"/>}</button>
                                        <button className="post-options-btn" id="fav-btn" onClick={event =>
                                            btnHandler(event, post_id, isFav, setFav, null, null, sendFavorite, isAuth)}>
                                            {isFav ? <Icons.StarRounded className="post-options-icon" style={{width: "28px", height: "28px", color: "#fbb03b"}}/> :
                                                <Icons.StarOutlineRounded className="post-options-icon" style={{width: "28px", height: "28px"}}/>}</button>
                                        <button className="post-options-btn" id="notify-btn" onClick={event =>
                                            btnHandler(event, post_id, isNotify, setNotify, null, null, sendSubscribe, isAuth)}>
                                            {isNotify ? <Icons.NotificationsActiveRounded className="post-options-icon" style={{width: "28px", height: "28px", color: "#3ea6ff"}}/> :
                                                <Icons.NotificationsNoneRounded className="post-options-icon" style={{width: "28px", height: "28px"}}/>}</button>
                                        <button className="post-options-btn" id="share-btn" onClick={event =>
                                            btnHandler(event, post_id)}><Icons.ShareOutlined className="post-options-icon"/></button>
                                        <button className="post-options-btn" id="report-btn" onClick={event =>
                                            btnHandler(event, post_id)}><Icons.FlagOutlined className="post-options-icon"/></button>
                                        {canEdit ?
                                            <Link to={`/posts/${post_id}/edit`}>
                                                <button className="post-options-btn" id="edit-btn" onClick={event =>
                                                    btnHandler(event, post_id)}><Icons.EditOutlined className="post-options-icon"/>
                                                </button>
                                            </Link> : null}
                                        {canEdit ?
                                            <button className="post-options-btn" id="delete-btn" onClick={event =>
                                                btnHandler(event, post_id, null, null, null, null, deletePost)}>
                                                <Icons.DeleteOutline className="post-options-icon" style={{color: "#e15f5f"}}/></button> : null}
                                    </div>
                                    <small className={getRatingClass(post.rating) + " rating"}>{getRatingText(post.rating)}</small>
                                </div>
                                <div className="d-flex flex-row justify-content-between" style={{margin: "10px 0 0 5px", width: "100%"}}>
                                    {post.status === 0 || best_comm ?
                                        <div className="d-flex flex-row">
                                            <img src={HappyLogo} alt="" style={{height: "25px"}}/>
                                            <span style={{fontWeight: 500, fontSize: "14px", color: "#706c64", padding: "2px 0 0 10px"}}>This post is now closed</span>
                                        </div> : null}
                                    <div className="d-flex flex-row" style={{marginLeft: "auto"}}>
                                        <span>By&nbsp;</span>
                                        <Link to={`/users/${post.user_id}`}>{user ? user.name : null}</Link>
                                    </div>
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
                                        <div className="d-flex flex-column justify-content-between">
                                            <Link to={`/users/${p_comm.user.id}`} style={{textDecoration: "none"}}>
                                                <Avatar avatar={p_comm.user.picture} size={35} username={p_comm.user.name} padding={8}/></Link>
                                            {canEdit && post.status === 1 && !best_comm ?
                                                <button className="post-comm-btn" name="best-comm-btn" style={{marginRight: 0}} onClick={event => {
                                                    btnHandler(event, post_id, p_comm.id, null, null, null, [editComment, editPost]);
                                                    setBest(p_comm.id);}}>
                                                    <Icons.CheckCircleOutlineRounded/></button> : null}
                                            {p_comm.best === 1 || best_comm === p_comm.id ?
                                                <button className="post-comm-btn" style={{marginRight: 0}}>
                                                    <Icons.CheckCircleRounded style={{color: "#3ea6ff"}}/></button> : null}
                                        </div>
                                        <div style={{marginLeft: "15px", width: "100%"}}>
                                            <div className="d-flex flex-row justify-content-between mb-2">
                                                <span className="fw-bold">{p_comm.user.name}</span>
                                                <span className="date-time">{getDateString(p_comm.created_at)}</span>
                                            </div>
                                            <p className="mb-1" id={`comm-content-${p_comm.id}`}><ReactMarkdown>{p_comm.content}</ReactMarkdown></p>
                                            <div id={`comm-btn-${p_comm.id}`}>
                                                <button className="post-options-btn" name="like-comm-btn" onClick={event =>
                                                    btnHandler(event, post_id, p_comm.id, null, null, null, sendLike, isAuth, fetchPostComments)}>
                                                    <Icons.ThumbUpOutlined className="post-options-icon"/></button>
                                                <span style={{marginLeft: "-10px", marginRight: "5px", fontWeight: 500}}>{p_comm.rating}</span>
                                                <button className="post-options-btn" name="dislike-comm-btn" onClick={event =>
                                                    btnHandler(event, post_id, p_comm.id, null, null, null, sendLike, isAuth, fetchPostComments)}>
                                                    <Icons.ThumbDownOutlined className="post-options-icon"/></button>
                                                {authed && (p_comm.user.id === me.id || me.role === "admin") ?
                                                        <button className="post-options-btn" name="edit-comm-btn" onClick={() =>
                                                            {document.getElementById(`comm-btn-${p_comm.id}`).style.display = "none";
                                                             document.getElementById(`comm-content-${p_comm.id}`).style.display = "none";
                                                             document.getElementById(`comm-edit-block-${p_comm.id}`).style.display = "block";}}>
                                                            <Icons.EditOutlined className="post-options-icon"/>
                                                        </button> : null}
                                                {authed && (p_comm.user.id === me.id || me.role === "admin") ?
                                                    <button className="post-options-btn" name="delete-comm-btn" onClick={event =>
                                                        btnHandler(event, post_id, p_comm.id, null, null, null, deleteComment, null, fetchPostComments)}>
                                                        <Icons.DeleteOutline className="post-options-icon" style={{color: "#e15f5f"}}/></button> : null}
                                                <button className="post-comm-btn" onClick={() =>
                                                    {document.getElementById(`comm-btn-${p_comm.id}`).style.display = "none";
                                                     document.getElementById(`comm-block-${p_comm.id}`).style.display = "block";}}>
                                                    <Icons.ChatBubbleOutlineRounded/></button>
                                            </div>
                                            <div id={`comm-block-${p_comm.id}`} style={{display: "none"}}>
                                                <ReplyBlock post_id={post_id} comm={p_comm} username={authed ? me.name : null}
                                                            avatar={authed ? me.picture : null} sendComm={sendSubComment} isAuth={isAuth} fetchComm={fetchPostComments}/>
                                                <button className="post-comm-btn" style={{marginLeft: "35px"}} onClick={() =>
                                                    {document.getElementById(`comm-btn-${p_comm.id}`).style.display = "block";
                                                     document.getElementById(`comm-block-${p_comm.id}`).style.display = "none";}}>Cancel</button>
                                            </div>
                                            <div id={`comm-edit-block-${p_comm.id}`} style={{display: "none"}}>
                                                <EditBlock post_id={post_id} comm_id={p_comm.id} editComm={editComment} isAuth={isAuth} fetchComm={fetchPostComments}/>
                                                <button className="post-comm-btn" onClick={() =>
                                                {document.getElementById(`comm-btn-${p_comm.id}`).style.display = "block";
                                                    document.getElementById(`comm-content-${p_comm.id}`).style.display = "block";
                                                    document.getElementById(`comm-edit-block-${p_comm.id}`).style.display = "none";}}>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column mt-2" style={{marginLeft: "40px"}}>
                                        {p_comm.comments ? p_comm.comments.map(p_c_comm => (
                                            <div className="d-flex flex-row justify-content-start mt-2">
                                                <div>
                                                    <Link to={`/users/${p_c_comm.user.id}`} style={{textDecoration: "none"}}>
                                                        <Avatar avatar={p_c_comm.user.picture} size={35} username={p_c_comm.user.name} padding={8}/></Link>
                                                </div>
                                                <div style={{marginLeft: "15px", width: "100%"}}>
                                                    <div className="d-flex flex-row justify-content-between mb-2">
                                                        <span className="fw-bold">{p_c_comm.user.name}</span>
                                                        <span className="date-time">{getDateString(p_c_comm.created_at)}</span>
                                                    </div>
                                                    <p className="mb-1" id={`sub-comm-content-${p_c_comm.id}`}><ReactMarkdown>{p_c_comm.content}</ReactMarkdown></p>
                                                    <div id={`sub-comm-btn-${p_c_comm.id}`}>
                                                        <button className="post-options-btn" name="like-comm-btn" onClick={event =>
                                                            btnHandler(event, post_id, p_c_comm.id, null, null, null, sendLike, isAuth, fetchPostComments)}>
                                                            <Icons.ThumbUpOutlined className="post-options-icon"/></button>
                                                        <span style={{marginLeft: "-10px", marginRight: "5px", fontWeight: 500}}>{p_c_comm.rating}</span>
                                                        <button className="post-options-btn" name="dislike-comm-btn" onClick={event =>
                                                            btnHandler(event, post_id, p_c_comm.id, null, null, null, sendLike, isAuth, fetchPostComments)}>
                                                            <Icons.ThumbDownOutlined className="post-options-icon"/></button>
                                                        {authed && (p_c_comm.user.id === me.id || me.role === "admin") ?
                                                            <button className="post-options-btn" onClick={() =>
                                                            {document.getElementById(`sub-comm-btn-${p_c_comm.id}`).style.display = "none";
                                                                document.getElementById(`sub-comm-content-${p_c_comm.id}`).style.display = "none";
                                                                document.getElementById(`sub-comm-edit-block-${p_c_comm.id}`).style.display = "block";}}>
                                                                <Icons.EditOutlined className="post-options-icon"/>
                                                            </button> : null}
                                                        {authed && (p_c_comm.user.id === me.id || me.role === "admin") ?
                                                            <button className="post-options-btn" name="delete-comm-btn" onClick={event =>
                                                                btnHandler(event, post_id, p_c_comm.id, null, null, null, deleteComment, null, fetchPostComments)}>
                                                                <Icons.DeleteOutline className="post-options-icon" style={{color: "#e15f5f"}}/></button> : null}
                                                        <button className="post-comm-btn" onClick={() =>
                                                            {document.getElementById(`sub-comm-btn-${p_c_comm.id}`).style.display = "none";
                                                             document.getElementById(`sub-comm-block-${p_c_comm.id}`).style.display = "block";}}>
                                                            <Icons.ChatBubbleOutlineRounded/></button>
                                                    </div>
                                                    <div id={`sub-comm-block-${p_c_comm.id}`} style={{display: "none"}}>
                                                        <ReplyBlock post_id={post_id} comm={p_comm} username={authed ? me.name : null}
                                                                    avatar={authed ? me.picture : null} sendComm={sendSubComment} isAuth={isAuth} fetchComm={fetchPostComments} sub={true}/>
                                                        <button className="post-comm-btn" style={{marginLeft: "35px"}} onClick={() =>
                                                            {document.getElementById(`sub-comm-btn-${p_c_comm.id}`).style.display = "block";
                                                             document.getElementById(`sub-comm-block-${p_c_comm.id}`).style.display = "none";}}>Cancel</button>
                                                    </div>
                                                    <div id={`sub-comm-edit-block-${p_c_comm.id}`} style={{display: "none"}}>
                                                        <EditBlock post_id={post_id} comm_id={p_c_comm.id} editComm={editComment} isAuth={isAuth} fetchComm={fetchPostComments} sub={true}/>
                                                        <button className="post-comm-btn" onClick={() =>
                                                        {document.getElementById(`sub-comm-btn-${p_c_comm.id}`).style.display = "block";
                                                            document.getElementById(`sub-comm-content-${p_c_comm.id}`).style.display = "block";
                                                            document.getElementById(`sub-comm-edit-block-${p_c_comm.id}`).style.display = "none";}}>Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )) : null}
                                    </div>
                                </div>
                            ))
                        ) : null}
                        {authed && post.status === 1 && !best_comm ?
                            <ReplyBlock post_id={post_id} avatar={me.picture} username={me.name} sendComm={sendComment} isAuth={isAuth} fetchComm={fetchPostComments} border={true}/> : null}
                    </div>
                </div> : null}
        </Fragment>
    );
}