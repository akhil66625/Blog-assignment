import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import firebase from "./firebase";

import Home from "./components/Home/home";
import Login from "./components/Login/login";
import Register from "./components/Register/register";
import Dashboard from "./components/Dashboard/dashboard";
import Header from "./components/Header/header";
import NewPost from "./components/NewPost/newpost";
import "./global.css";
import Profile from "./components/Profile/profile";
import Update from "./components/Update/update";
import UpdatePassword from "./components/Update/updatePassword";

class App extends Component {
  state = {
    firebaseInitialized: false,
  };

  componentDidMount() {
    firebase.isInitialized().then((result) => {
      this.setState({ firebaseInitialized: result });
    });
  }

  render() {
    return this.state.firebaseInitialized !== false ? (
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/dashboard/newpost" component={NewPost} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/update" component={Update} />
          <Route exact path="/update-password" component={UpdatePassword} />
        </Switch>
      </BrowserRouter>
    ) : (
      <p className="loading">Loading...</p>
    );
  }
}

export default App;
