import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import firebase from "../../firebase";
import "./newpost.css";

export class NewPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null,
      title: "",
      image: null,
      url: "",
      description: "",
      alert: "",
      progress: 0,
    };

    this.uploadPost = this.uploadPost.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  async componentDidMount() {
    if (!firebase.getCurrent()) {
      this.props.history.replace("/");
      return null;
    }
    console.log(this.props.elementValue);
    if (this.props.elementValue) {
      this.setState({
        post: this.props.elementValue,
        title: this.props.elementValue.title,
        description: this.props.elementValue.description,
        url: this.props.elementValue.image,
        image: {},
      });
    }
  }

  uploadPost = async (e) => {
    e.preventDefault();
    console.log("working");
    if (
      this.state.title !== "" &&
      this.state.description !== "" &&
      this.state.image !== null &&
      this.state.url !== ""
    ) {
      let posts = firebase.app.ref("posts/");

      if (this.state.post !== null) {
        let posts = firebase.app.ref("posts/" + this.state.post.key);
        console.log("updating post");
        await posts.update({
          title: this.state.title,
          image: this.state.url,
          description: this.state.description,
          updatedDate: this.formatDate(Date.now()),
        });
        this.props.modalClose();
        return;
      } else {
        let posts = firebase.app.ref("posts/");
        let save = posts.push().key;
        await posts.child(save).set({
          title: this.state.title,
          image: this.state.url,
          description: this.state.description,
          auther: firebase.getCurrentUserDetails().displayName,
          uid: firebase.getCurrentUid(),
          postDate: this.formatDate(Date.now()),
          updatedDate: this.formatDate(Date.now()),
        });
        console.log("sucessfully created");
        this.props.history.push("/dashboard");
      }
    } else {
      this.setState({ aert: "Wrong Password or Invalid Email !" });
    }
  };

  formatDate(date) {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  }

  handleFile = async (e) => {
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

    var random = Math.random();
    const uploadTasks = firebase.storage
      .ref(`images/${currentUid}/${image.name + random.toString()}`)
      .put(image);

    await uploadTasks.on(
      "state_changed",
      (snapshot) => {
        //Progress
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progress });
        console.log("progressing", progress);
      },
      (error) => {
        console.log("Error image: " + error);
      },
      () => {
        firebase.storage
          .ref(`images/${currentUid}`)
          .child(image.name + random.toString())
          .getDownloadURL()
          .then((url) => {
            this.setState({ url: url });
            console.log("image sets");
          });
      }
    );
  };

  render() {
    return (
      <div>
        <div className="buttonContainer">
          <button className="btn closeButton"><Link to={"/dashboard"}>X</Link></button>
        </div>

        <form onSubmit={this.uploadPost} id="new-post">
          <span>{this.state.alert}</span>

          <input type="file" onChange={this.handleFile} />
          {this.state.url !== "" ? (
            <img
              src={this.state.url}
              width="250"
              height="150"
              alt="Capa do Post"
            />
          ) : (
            <progress value={this.state.progress} max="100" />
          )}

          <label>Title:</label>
          <input
            type="text"
            placeholder="Title of Post"
            value={this.state.title}
            autoFocus
            onChange={(e) => this.setState({ title: e.target.value })}
          />

          <label>Description:</label>
          <textarea
            minLength="10"
            type="text"
            placeholder="Description of post"
            value={this.state.description}
            autoFocus
            onChange={(e) => this.setState({ description: e.target.value })}
          />
          <br />
          {this.state.post == null && (
            <button type="submit">Create Post</button>
          )}
          {this.state.post !== null && (
            <button type="submit">Update Post</button>
          )}
        </form>
      </div>
    );
  }
}

export default withRouter(NewPost);
