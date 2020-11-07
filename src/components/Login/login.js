import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import firebase from "../../firebase";
import "./login.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    if (firebase.getCurrent()) {
      return this.props.history.replace("dashboard");
    }
  }

  handleLogin(e) {
    e.preventDefault();
    this.login();
  }

  login = async () => {
    const { email, password } = this.state;

    try {
      await firebase.login(email, password).catch((error) => {
        console.log("sucess", this.email, "???", error);
        if (error.code === "auth/user-not-found") {
          alert("User not found!");
        } else {
          alert("Error:" + error.code);
          return null;
        }
      });

      this.props.history.replace("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleLogin} id="login">
          <label>Email:</label>
          <br />
          <input
            type="email"
            autoFocus
            value={this.state.email}
            onChange={(e) => this.setState({ email: e.target.value })}
          />

          <label>Password:</label>
          <br />
          <input
            type="password"
            value={this.state.password}
            onChange={(e) => this.setState({ password: e.target.value })}
          />

          <button type="submit">Submit</button>
          <Link to="/register">Don't have a account register ?</Link>
        </form>
      </div>
    );
  }
}

export default withRouter(Login);
