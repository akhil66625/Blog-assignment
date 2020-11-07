import React from "react";
import { Card, Button, Alert, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import firebase from "../../firebase";

class UpdatePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      confirmPassword: "",
      error: "",
      loading: false,
    };

    console.log(firebase.getCurrentUserDetails());
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);
    if (
      this.state.password !== "" &&
      this.state.password === this.state.confirmPassword
    ) {
      firebase.updatePassword(this.state.password).then(() => {
        firebase.getCurrentUserDetails().reload();
        window.alert("Password Updated Succesfully");
        this.props.history.replace("/profile");
      });
    }
  };

  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  };

  render() {
    return (
      <>
        <Card className="updateCard">
          <Card.Body>
            <h2 className="text-center mb-4">Update Password</h2>
            {this.state.error && (
              <Alert variant="danger">{this.state.error}</Alert>
            )}
            <Form onSubmit={this.handleSubmit}>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  onChange={this.myChangeHandler}
                  defaultValue={this.state.password}
                  placeholder="enter your new password"
                />
              </Form.Group>
              <Form.Group id="password-confirm">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  onChange={this.myChangeHandler}
                  defaultValue={this.state.confirmPassword}
                  placeholder="Re Enter your new password"
                />
              </Form.Group>
              <Button
                disabled={this.state.loading}
                className="w-100"
                type="submit"
              >
                Update
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          <Link to="/profile">Cancel</Link>
        </div>
      </>
    );
  }
}
export default UpdatePassword;
