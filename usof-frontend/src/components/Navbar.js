import React, {useContext, useEffect, useState} from "react";
import {Link, Redirect} from 'react-router-dom'
import {NavLink} from 'react-router-dom'
import {ReactComponent as LogoBig} from "../assets/images/logo_label.svg"
import {SearchRounded, Menu} from '@material-ui/icons';
import {ApiContext} from "../context/api/apiContext";
import {Avatar} from "./Avatar";


function search(e, setSearchText) {
    if (e.key !== 'Enter')
        return;
    const text = e.target.value.trim();
    if (text)
        setSearchText(text.toLowerCase());
}

export const Navbar = () => {
    const {isAuth, me, refreshAuth, fetchMe} = useContext(ApiContext);
    const [openMenu, setOpenMenu] = useState(false);
    const [searchText, setSearchText] = useState();

    useEffect(() => {
        refreshAuth();
        if (isAuth)
            fetchMe();
        // eslint-disable-next-line
    }, [isAuth])

    if (searchText) {
        setTimeout(setSearchText, 0);
        return <Redirect to={`/posts?search=${searchText}`}/>;
    }

    return (
        <div style={{position: "fixed", width: "100%", top: 0, zIndex: 99}}>
            <nav className="navbar navbar-expand-sm">
                <button id="nav-menu" data-bs-toggle="collapse"
                        data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent"
                        aria-expanded="false" aria-label="Toggle navigation"
                        style={{width: "30px", padding: 0, marginRight: "8px", border: "none", background: "none"}}
                        onClick={() => setOpenMenu(!openMenu)}>
                    <Menu/>
                </button>
                <div className="navbar-brand">
                    <Link to="/"><LogoBig style={{height: "40px"}}/></Link>
                </div>
                <ul className="navbar-nav hidden-phone">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/posts/create" exact>New post</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/posts" exact>Posts</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/categories" exact>Categories</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/users" exact>Users</NavLink>
                    </li>
                </ul>
                <div className="nav-search" id="search-main">
                    <input type="search" placeholder="Search posts" onKeyDown={event => search(event, setSearchText)}/>
                    <SearchRounded id="nav-search-icon"/>
                </div>
                <div className="nav-profile">
                    {isAuth ? (
                        <NavLink to={`/users/${me ? me.id : 0}`} style={{textDecoration: "none"}}>
                            <div className="nav-profile-box">
                                <Avatar avatar={me ? me.picture : null} size={35} username={me ? me.name : null} padding={8}/>
                                <span className="nav-profile-text">{me ? me.login : null}</span>
                            </div>
                        </NavLink>
                    ) : (
                        <ul className="navbar-nav hidden-phone">
                            <li className="nav-item">
                                <NavLink to="/login" style={{textDecoration: "none"}}>
                                    <span className="nav-link">Sign In</span>
                                </NavLink>
                            </li>
                        </ul>
                    )}
                </div>
            </nav>
            <div className="collapse" style={{display: openMenu ? "block" : "none"}}>
                <div className="bg-light p-4">
                    <div className="nav-search" id="search-phone">
                        <input type="search" placeholder="Search posts" onKeyDown={event => search(event, setSearchText)}/>
                        <SearchRounded id="nav-search-icon"/>
                    </div>
                    <div onClick={() => setOpenMenu(false)}>
                        {!isAuth ? <NavLink className="nav-link" to="/login" style={{textDecoration: "none"}}>Sign In</NavLink> : null}
                        <NavLink className="nav-link" to="/posts/create" exact>New post</NavLink>
                        <NavLink className="nav-link" to="/posts" exact>Posts</NavLink>
                        <NavLink className="nav-link" to="/categories" exact>Categories</NavLink>
                        <NavLink className="nav-link" to="/users" exact>Users</NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}