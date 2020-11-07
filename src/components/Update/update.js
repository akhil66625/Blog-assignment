import React from "react";
import firebase from "../../firebase";
import { Link, withRouter } from "react-router-dom";
import { Card, Button, Alert, Form } from "react-bootstrap";
class Update extends React.Component {
  updatePromises = [];
  constructor(props) {
    super(props);
    this.state = {
      email: firebase.getCurrentUserDetails().email,
      name: firebase.getCurrentUserDetails().displayName,
      error: "",
      loading: false,
      currentUser: firebase.getCurrentUserDetails(),
    };

    console.log(firebase.getCurrentUserDetails());
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);
    if (firebase.getCurrentUserDetails().displayName !== this.state.name) {
      this.updatePromises.push(firebase.updateName(this.state.name));
    }
    if (firebase.getCurrentUserDetails().email !== this.state.email) {
      this.updatePromises.push(firebase.updateEmail(this.state.email));
    }
    Promise.all(this.updatePromises).then(() => {
      firebase.getCurrentUserDetails().reload();
      this.props.history.replace("/profile");
    });
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
            <h2 className="text-center mb-4">Update Profile</h2>
            {this.state.error && (
              <Alert variant="danger">{this.state.error}</Alert>
            )}
            <Form onSubmit={this.handleSubmit}>
              <Form.Group id="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="name"
                  name="name"
                  onChange={this.myChangeHandler}
                  defaultValue={this.state.name}
                  required
                />
              </Form.Group>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  onChange={this.myChangeHandler}
                  defaultValue={this.state.email}
                  required
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
export default withRouter(Update);
