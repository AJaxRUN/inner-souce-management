import React, { Component, Fragment } from 'react';
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import Content from "./Content";

class Home extends Component {
    render() {
        return (
            <div className=" px-4 lg:px-10">
                <Navbar />
                <Content setModalState={this.props.setModalState} />
            </div>
        );
    }
}

export default Home;