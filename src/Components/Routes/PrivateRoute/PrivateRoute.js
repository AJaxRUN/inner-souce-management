import React from "react";
import { withRouter, Redirect, Route } from "react-router";
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "../../../queries";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import { SET_USER_DATA } from "../../../Store/actions";
import LoadingIndicator from "../../Common/LoadingIndicator/LoadingIndicator";

// To allow routes only after user has logged in
const PrivateRoute = ({ children, ...props }) => {
    let isLoggedIn = false;
    //Checks if the user is logged in and sets the user redux store with cookies if it is empty
    if(!(props.user.id && props.user.token)) {
        //Check if cookies are set then set the user redux store with respective values
        if(Cookies.get("token") != undefined && Cookies.get("id") != undefined && Cookies.get("token") && Cookies.get("id")) {
            const { loading, error, data } = useQuery(GET_USER_PROFILE, { variables: { userId: Cookies.get("id").toString() } });
            if (loading) return <LoadingIndicator/>;
            else if (error) {
                isLoggedIn = false;
                Cookies.remove("id");
                Cookies.remove("token");
                Cookies.remove("githubName");
                alert(`User profile fetch error! Try logging in again${error.message}`);
                return <Redirect to="/login"/>
            }
            props.setUserData({
                token: Cookies.get("token"),
                id: parseInt(Cookies.get("id")),
                onboarded: data.User.onboarded ? data.User.onboarded : false,
                githubName: data.User.githubName ? data.User.githubName : "",
                name: data.User.name ? data.User.name : "",
                email: data.User.email ? data.User.email : "",
                photoUrl: data.User.photoUrl ? data.User.photoUrl : "",
                githubUrl: data.User.githubUrl ? data.User.githubUrl : "",
            });
            isLoggedIn = true;
        }
        //if the cookies are not set then the user is not logged in
        else {
            isLoggedIn = false;
        }
    }
    //If user  redux store has value and cookie doesn't exist means the cookie has expired
    //ToDo Implement refresh token 
    if(!(Cookies.get("token")&&Cookies.get("id")&&Cookies.get("githubName"))) {
        isLoggedIn = false;
    }
    else {
        isLoggedIn = true;
    }

    return (
        <Route
            {...props}
            render={({ location }) =>
                isLoggedIn? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location, msg:"Please log in to proceed!" }
                        }}
                    />
                )
            }
        />
    );
};

const mapStateToProps = state => {
    return {
        user: state.user,
    };
};
const mapDispatchToProps = dispatch => {
    return {
        setUserData: (profile) => dispatch({ type: SET_USER_DATA, payload: {profile: profile}})
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(PrivateRoute));
