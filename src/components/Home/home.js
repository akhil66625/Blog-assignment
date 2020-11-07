import React, { Component } from "react";
import firebase from "../../firebase";

import "./home.css";

class Home extends Component {
  state = {
    posts: [],
  };

  componentDidMount() {
    firebase.app.ref("posts").once("value", (snapshot) => {
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

  render() {
    return (
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
              </footer>
            </article>
          );
        })}
      </section>
    );
  }
}

export default Home;
