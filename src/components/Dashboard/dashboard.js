import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import firebase from "../../firebase";
import "./dashboard.css";
import { NewPost } from "../NewPost/newpost";
import { Button, Modal, Form } from "react-bootstrap";
import { FaTrashAlt, FaRegEdit } from "react-icons/fa";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: localStorage.name,
      posts: [],
      modalShow: false,
      currentEditPost: {},
    };

    this.logout = this.logout.bind(this);
  }

  handleClose = () => {
    this.setState({ modalShow: false });
    this.getPosts();
  };

  handleShow = () => {
    this.setState({ modalShow: true });
  };

  async componentDidMount() {
    if (!firebase.getCurrent()) {
      this.props.history.replace("/login");
      return null;
    }
    this.getPosts();

    firebase.getUserName((info) => {
      localStorage.name = info.val().name;
      console.log("user info", info, "name", localStorage.name);
      this.setState({ name: localStorage.name });
    });
  }

  logout = async () => {
    await firebase.logout().catch((error) => {
      console.log(error);
    });
    console.log("logout succesfully");
    this.props.history.push("/");
  };

  getPosts() {
    firebase.app
      .ref("posts")
      .orderByChild("uid")
      .equalTo(firebase.getCurrentUid())
      .once("value", (snapshot) => {
        let state = this.state;
        state.posts = [];
        snapshot.forEach((childItem) => {
          state.posts.push({
            key: childItem.key,
            title: childItem.val().title,
            image: childItem.val().image,
            description: childItem.val().description,
            auther: childItem.val().auther,
            updatedDate: childItem.val().updatedDate,
          });
          console.log("post details", state);
        });
        state.posts.reverse();
        this.setState(state);
      });
  }

  deletePost = (post) => {
    if (window.confirm("Do you want to delete his post")) {
      console.log(post);
      firebase.deletePost(post).then(() => {
        const posts = this.state.posts.filter(
          (tpost) => tpost.key !== post.key
        );
        this.setState({
          posts: posts,
        });
      });
    }
  };

  editPost = (post) => {
    console.log(post);
    this.setState({ currentEditPost: post });
    this.handleShow();
  };

  render() {
    return (
      <>
        <Modal
          show={this.state.modalShow}
          onHide={this.handleClose}
          animation={false}
        >
          <Modal.Header closeButton variant="primary">
            <Modal.Title>Edit Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <NewPost
              modalClose={this.handleClose}
              elementValue={this.state.currentEditPost}
            ></NewPost>
          </Modal.Body>
        </Modal>
        <h3 className="text-center myPost">My Posts</h3>
        <hr />
        <div id="floatingActionButton">
          {/* <div className="user-info">
                <h1>Name {this.state.name}</h1> */}
          <a style={{ textDecoration: "none" }} href="/dashboard/newpost">
            {" "}
            +{" "}
          </a>
        </div>
        {this.state.posts.length == 0 && (
              <p className="noPost">No Posts</p>
            )}
        <section id="post">
          {this.state.posts.map((post) => {
            return (
              <article key={post.key}>
                <header className="homeHeader">
                  <div className=" text-left">
                    <strong>
                      <h3>{post.title}</h3>
                    </strong>
                    <span>
                      {post.auther} - {post.updatedDate}
                    </span>
                  </div>
                </header>
                <img src={post.image} alt="image here" />
                <footer>
                  <p>{post.description}</p>
                  <div className="text-right buttonContainer">
                    <span onClick={() => this.deletePost(post)}>
                      <FaTrashAlt />
                    </span>

                    <span onClick={() => this.editPost(post)}>
                      <FaRegEdit />
                    </span>
                  </div>
                </footer>
              </article>
            );
          })}
        </section>
      </>
    );
  }
}

export default withRouter(Dashboard);
