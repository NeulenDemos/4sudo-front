import React, {Fragment, useContext} from 'react';
import toast from 'react-hot-toast';
import {ApiContext} from "../context/api/apiContext";
import {Link} from "react-router-dom";
import {emailRegexp} from "../context/utils";

export const PasswordReset = () => {
    const {passwordReset} = useContext(ApiContext);

    let formData = {};
    function formSubmitHandler(event) {
        event.preventDefault();
        if (!formData.email || !formData.email.match(emailRegexp))
            toast.error("Incorrect email");
        else {
            passwordReset(formData.email);
            toast.success("Password reset confirmation sent!");
        }
    }
    function inputChangeHandler(event) {
        formData[event.target.name] = event.target.value;
    }

    return (
        <Fragment>
            <div className="main-container" style={{display: "flex", flexDirection: "column", maxWidth: "300px", padding: "10px", margin: "auto"}}>
                <span style={{textAlign: "center", fontSize: "28px"}}>Password reset</span>
                <form style={{backgroundColor: "#f6f8fa", border: "1px solid #ebedef", borderRadius: "5px", marginTop: "15px"}}>
                    <div style={{display: "flex", flexDirection: "column", padding: "20px 20px 20px 20px"}} className="login-form">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" onChange={inputChangeHandler}/>
                        <button onClick={formSubmitHandler}>Submit</button>
                    </div>
                </form>
                <span style={{textAlign: "center", fontSize: "14px", color: "#706c64", fontWeight: 500}}>
                    Suddenly remembered the password?<br/><Link to="/login" style={{textDecoration: "none"}}>Sign In</Link></span>
            </div>
        </Fragment>
    );
};
