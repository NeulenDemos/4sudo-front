import React, {Fragment, useContext, useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import {Redirect} from "react-router-dom";
import {ApiContext} from "../context/api/apiContext";
import Cookies from "js-cookie";
import {emailRegexp, passRegexp} from "../context/utils";
import {Avatar} from "../components/Avatar";


export const EditUser = ({match}) => {
    const {user, fetchUser, isAuth, editUser, editAvatar} = useContext(ApiContext);
    const [success, setSuccess] = useState();
    const [passCol, setPassCol] = useState("#aaaaaa");
    const user_id = match.params.id;
    const me = Cookies.get('me') ? JSON.parse(Cookies.get('me')) : null;

    useEffect(() => {
        if (!isAuth)
            return;
        fetchUser(user_id);
        // eslint-disable-next-line
    }, []);

    let formData = {};
    function formSubmitHandler(event) {
        event.preventDefault();
        if (formData.email && !formData.email.match(emailRegexp))
            toast.error("Incorrect email");
        else if (formData.pass && !formData.pass.match(passRegexp))
            toast.error("Incorrect password");
        else if (formData.pass && formData.pass !== formData.pass2)
            toast.error("Passwords are not matches");
        else {
            for (const [key, value] of Object.entries(formData))
                if (!value || !value.trim())
                    delete formData[key];
            delete formData.pass2;
            editUser({id: user.id, data: formData});
            toast.success("Profile edited!");
            setTimeout(setSuccess, 1500, true);
        }
    }
    function inputChangeHandler(event) {
        formData[event.target.name] = event.target.value;
        if ((event.target.name === "password" || event.target.name === "pass2") && formData.pass2) {
            if (formData.password === formData.pass2)
                setPassCol("#4bb359");
            else
                setPassCol("#e15f5f");
        }
    }
    if (!isAuth)
        return <Redirect to="/login"/>;
    if (user && me)
        if (user.id !== me.id && me.role !== "admin") {
            toast.error("You have not permission to edit this user!");
            setTimeout(setSuccess, 1500, true);
        }
    if (success)
        return <Redirect to={`/users/${user_id}`}/>;
    if (user) {
        const items = document.getElementsByClassName("user-inputs");
        [...items].forEach(item => {
            if ((formData[item.name] = item.value ? item.value : user[item.name]))
                item.value = formData[item.name];
        });
    }

    return (
        <Fragment>
            <div className="container" style={{marginTop: "20px", marginBottom: "20px"}}>
                <h1 className="display-6">Profile settings</h1>
            </div>
            {user && me ?
                <div className="container main-container">
                    <div className="content" style={{marginTop: "20px", padding: "20px"}}>
                        <form className="edit-user d-flex flex-column" style={{margin: "0 auto 0 auto", width: "min-content"}}>
                            <Avatar avatar={user.picture} size={150} username={user.name} padding={70}/>
                            <label htmlFor="image" style={{cursor: "pointer", textAlign: "center"}}>Upload an image</label>
                            <input id="image" type="file" accept="image/png, image/jpg, image/jpeg, image/gif" onChange={() => editAvatar(document.getElementById("image").files[0])}/>
                        </form>
                        <form className="edit-user">
                            <label htmlFor="email">Email</label>
                            <input className="user-inputs" type="email" id="email" name="email" onChange={inputChangeHandler}/>
                            <label htmlFor="login">Username</label>
                            <input className="user-inputs" type="text" id="login" name="login" maxLength="10" onChange={inputChangeHandler}/>
                            <label htmlFor="name">Full name</label>
                            <input className="user-inputs" type="text" id="name" name="name" onChange={inputChangeHandler}/>
                            <label htmlFor="password">Password</label>
                            <input className="user-inputs" type="password" id="password" name="password" style={{borderColor: passCol}} onChange={inputChangeHandler}/>
                            <label htmlFor="pass2">Confirm password</label>
                            <input className="user-inputs" type="password" id="pass2" name="pass2" style={{borderColor: passCol}} onChange={inputChangeHandler}/>
                            <button className="btn-primary" type="submit" onClick={formSubmitHandler}>Save changes</button>
                        </form>
                    </div>
                </div> : null}
        </Fragment>
    );
}