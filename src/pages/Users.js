import React, {Fragment, useContext, useEffect} from 'react';
import {ApiContext} from "../context/api/apiContext";
import {Link} from "react-router-dom";
import {Helmet} from "react-helmet";
import {catColors, pagination} from "../context/utils";
import {Avatar} from "../components/Avatar";


export const Users = ({location}) => {
    const {users, fetchUsers, page, changePage} = useContext(ApiContext);

    useEffect(() => {
        fetchUsers(location.search);
        // eslint-disable-next-line
    }, [page, location.search]);
    useEffect(() => {
        changePage(1);
        // eslint-disable-next-line
    }, []);
    return (
        <Fragment>
            <Helmet title="Users"/>
            <div className="container d-flex flex-row justify-content-between" style={{marginTop: "20px"}}>
                <h1 className="display-6">Users</h1>
            </div>
            <div className="container main-container" style={{padding: "20px"}}>
                <div className="row content">
                    {users ?
                        users.data.map(user => (
                            <div className="resp-col col-sm-3 mt-3">
                                <Link to={`/users/${user.id}`} style={{color: "#212529", textDecoration: "none"}}>
                                    <div className="d-flex flex-row" style={{padding: "5px", borderRadius: "5px", border: "1px solid #dddddd", backgroundColor: "#fefefe"}}>
                                        <Avatar avatar={user.picture} size={46} username={user.name}/>
                                        <div className="d-flex flex-column" style={{marginLeft: "8px"}}>
                                            <span style={{fontWeight: 500, color: catColors[user.id % catColors.length]}}
                                            title={user.name}>{user.login}</span>
                                            <span style={{fontWeight: 500, fontSize: "14px"}}>{user.rating}</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )) : null}
                </div>
                <div className="pagination-box">
                    {users ? pagination(page, users.last_page, changePage) : null}
                </div>
            </div>
        </Fragment>
    );
}