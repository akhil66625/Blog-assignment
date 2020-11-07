import React, { Component } from "react";
import firebase from "../../firebase";
import { Link, withRouter } from "react-router-dom";
import {
  Card,
  Button,
  Alert,
  Image,
  Modal,
  Form,
  FormGroup,
  ProgressBar,
} from "react-bootstrap";
import "./profile.css";

class Profile extends Component {
  random = Math.random();
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      image: null,
      url: firebase.getCurrentUserDetails().photoURL,
      show: false,
      currentUser: firebase.getCurrentUserDetails(),
    };

    console.log(firebase.getCurrentUserDetails());
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  handleChange = async (e) => {
    if (e.target.files[0]) {
      const imageh = e.target.files[0];

      if (imageh.type === "image/png" || imageh.type === "image/jpeg") {
        console.log("image uploading");
        await this.setState({ image: imageh });
        this.handleUpload();
      } else {
        this.setState({ imageh: null });
        return null;
      }
    }
  };

  handleUpload = async () => {
    const { image } = this.state;
    const currentUid = firebase.getCurrentUid();
    console.log("current user>> ", currentUid);
   
    const uploadTasks = firebase.storage
      .ref(`images/${currentUid}/${image.name + this.random.toString()}`)
      .put(image);

    await uploadTasks.on(
      "state_changed",
      (snapshot) => {
        //Progress
        const tmpprogress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progress: tmpprogress });
        console.log("progressing", tmpprogress);
      },
      (error) => {
        console.log("Error image: " + error);
      }
    );
  };

  uploadImage = async () => {
   
    firebase.storage
      .ref(`images/${firebase.getCurrentUid()}`)
      .child(this.state.image.name + this.random.toString())
      .getDownloadURL()
      .then((url) => {
        // Set image url to currentUser
        firebase.updatephotoURL(url).then(() => {
          this.hideModal();
          console.log(url);
          this.setState({ progress: 0, url: url });
        });
      });
  };

  render() {
    return (
      <div>
        <Card style={{ top: "90px" }}>
          <Card.Body>
            <Image
              onClick={this.showModal}
              className="profileImage"
              src={this.state.url || "http://via.placeholder.com/300"}
              roundedCircle
            />
            <Modal
              show={this.state.show}
              onHide={this.hideModal}
              animation={false}
              style={{ top: "160px" }}
            >
              <Modal.Header closeButton variant="primary">
                <Modal.Title>Change Profile Photo</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <br />
                <div className="editbar">
                  <div>
                    <ProgressBar
                      now={this.state.progress}
                      label={`${this.state.progress}%`}
                    />
                  </div>
                  <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label>Select Image</Form.Label>
                    <Form.Control
                      onChange={this.handleChange}
                      type="file"
                      placeholder="add image"
                    />
                  </Form.Group>
                  <div className="text-center">
                    <Button
                      className="text-center"
                      variant="primary"
                      onClick={this.uploadImage}
                    >
                      Upload
                    </Button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>

            <h4>
              <strong>Name:</strong> {this.state.currentUser.displayName}
            </h4>
            <h4>
              <strong>Email:</strong> {this.state.currentUser.email}
            </h4>
            <Link to="/update" className="btn btn-primary w-100 mt-3">
              Update Profile
            </Link>
            <Link to="/update-password" className="btn btn-primary w-100 mt-3">
              Update Password
            </Link>
          </Card.Body>
        </Card>
      </div>
    );
  }
}
export default withRouter(Profile);
