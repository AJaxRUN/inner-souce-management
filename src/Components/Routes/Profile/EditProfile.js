import React, { useState } from "react";
import Navbar from "../../Navigation/Navbar";
import Button from "../../Common/Button/Button";
import TextInput from "../../Common/InputFields/TextInput";
import TextAreaInput from "../../Common/InputFields/TextAreaInput";
import SearchTagsInput from "../../Common/InputFields/SearchTagsInput";
import { UPDATE_USER_PROFILE } from "../../../mutations";
import { GET_JOB_DISCUSSIONS, GET_USER_PROFILE } from "../../../queries";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { Query } from "react-apollo";
import { useMutation } from "@apollo/client";
import { validateProfileUpdate } from "./ValidateForm";

const EditProfile = (props) => {
    return (
        <Query query={GET_USER_PROFILE} variables={{ userId: props.user.id }}>
            {({ loading, error, data }) => {
                if (loading) {
                    return "Loading...";
                } else if (error) alert(`Error! ${error.message}`);
                return (
                    <EditProfileBody data={data} {...props} />
                );
            }}
        </Query>
    );
};

const EditProfileBody = (props) => {
    const userData = props.data["User"];
    const initialState = {
        id: userData.id,
        name: userData.name,
        position: userData.role,
        department: userData.department,
        bio: userData.bio,
        contact: userData.contact,
        email: userData.email,
        photoUrl: userData.photoUrl,
        skills: userData.skills.map((skill, key) => skill.value),
        errMsg: "",
    };

    const [updateUserMutation, { loading, error }] = useMutation(
        UPDATE_USER_PROFILE, {
            refetchQueries: [
                { query: GET_USER_PROFILE,
                    variables: { userId: userData.id }
                },
            ],
        });
    const [state, setState] = useState(initialState);

    const onInputChangeHandler = (event) => {
        const value = event.currentTarget.value;
        switch (event.currentTarget.id) {
        case "name":
            setState({
                ...state,
                name: value,
            });
            break;
        case "email":
            setState({
                ...state,
                email: value,
            });
            break;
        case "bio":
            setState({
                ...state,
                bio: value,
            });
            break;
        case "position":
            setState({
                ...state,
                position: value,
            });
            break;
        case "department":
            setState({
                ...state,
                department: value,
            });
            break;
        case "contact":
            setState({
                ...state,
                contact: value,
            });
            break;
        }
    };

    const getTagList = (skillList) => {
        setState({
            ...state,
            skills: skillList,
        },
        );
    };

    const updateProfile = () => {
        let isValid = validateProfileUpdate(state);
        if (isValid) {
            updateUserMutation({
                variables: {
                    userInput: {
                        name: state.name,
                        email: state.email,
                        bio: state.bio,
                        role: state.position,
                        department: state.department,
                        contact: state.contact,
                        skills: state.skills,
                    },
                },
            },
            ).then(res => {
                props.history.push("/profile/" + parseInt(state.id));
            }, //Navigate to profile page on success
            err => {
                console.log(err);
            },
            );
            setState({
                ...state,
                errMsg: "",
            });

        } else {
            setState({
                ...state,
                errMsg: "Please enter valid values in all fields!",
            });
        }
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error! {error}</p>;

    return (
        <div className="px-4 lg:px-10 container mx-auto">
            <Navbar/>
            <div className="flex flex-row">
                <h1 className="text-2xl">Edit Profile</h1>
            </div>
            <div className="mx-auto max-w-screen-md flex flex-col justify-center">

                <div className="mx-auto w-full">
                    <div
                        className="flex flex-row items-center mt-16 mb-4 justify-center">
                        <img src={state.photoUrl}
                            className="flex-0 h-24 w-24 rounded-full"/>
                    </div>
                    <div className="flex flex-col mt-8">
                        <TextInput
                            id="name"
                            label="Full Name"
                            placeholder="Full Name"
                            value={state.name}
                            onChange={onInputChangeHandler}
                        />
                        <TextInput
                            id="position"
                            label="Position"
                            placeholder="Position"
                            value={state.position}
                            onChange={onInputChangeHandler}
                        />
                        <TextInput
                            id="department"
                            label="Department"
                            placeholder="Department"
                            value={state.department}
                            onChange={onInputChangeHandler}
                        />
                        <TextInput
                            id="email"
                            label="Email"
                            placeholder="email"
                            value={state.email}
                            onChange={onInputChangeHandler}
                        />
                        <TextInput
                            id="contact"
                            label="Contact"
                            placeholder="Email, Slack ID..."
                            value={state.contact}
                            onChange={onInputChangeHandler}
                        />
                        <TextAreaInput
                            id="bio"
                            cols="10"
                            label="Bio"
                            placeholder="Bio"
                            value={state.bio}
                            onChange={onInputChangeHandler}
                        />
                        <SearchTagsInput
                            id="skills"
                            label="Skills"
                            className="mt-8"
                            placeholder="Type and press Enter to add skills"
                            initialList={state.skills}
                            getTagList={getTagList}
                        />
                        <hr className="mt-12 mb-4"/>
                        {
                            state.errMsg ?
                                <div
                                    className="m-2 text-nebula-red">{state.errMsg}</div>
                                : ""
                        }
                        <div className="flex flex-row flex-wrap mb-20">
                            <Button label="Save changes" type="primary"
                                className="mx-2" onClick={updateProfile}/>
                            <Button label="Discard changes" type="secondary"
                                className="mx-2"
                                onClick={() => props.history.goBack()}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        user: state.user,
    };
};

export default withRouter(connect(mapStateToProps)(EditProfile));
