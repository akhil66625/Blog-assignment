import app from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/storage";

let firebaseConfig = {
  apiKey: "AIzaSyBglLEcq-1AB4fQSmP9TbRIu4lMzW9BnVo",
  authDomain: "dblog-1647a.firebaseapp.com",
  databaseURL: "https://dblog-1647a.firebaseio.com",
  projectId: "dblog-1647a",
  storageBucket: "dblog-1647a.appspot.com",
  messagingSenderId: "142783674588",
  appId: "1:142783674588:web:f55caf8fd74c6f50f01c19",
};
class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);

    this.app = app.database();

    this.storage = app.storage();
  }

  login(email, password) {
    return app.auth().signInWithEmailAndPassword(email, password);
  }

  logout() {
    return app.auth().signOut();
  }

  deletePost(post) {
    return app.database().ref("posts/").child(post.key).remove();
  }

  async register(name, email, password) {
    await app.auth().createUserWithEmailAndPassword(email, password);

    const uid = app.auth().currentUser.uid;
    await app.auth().currentUser.updateProfile({ displayName: name });
    return app.database().ref("dblog").child(uid).set({
      name: name,
    });
  }

  isInitialized() {
    return new Promise((resolve) => {
      app.auth().onAuthStateChanged(resolve);
    });
  }

  getCurrent() {
    return app.auth().currentUser && app.auth().currentUser.email;
  }

  getCurrentUserDetails() {
    return app.auth().currentUser;
  }

  updatephotoURL(photoURL) {
    return this.getCurrentUserDetails().updateProfile({ photoURL: photoURL });
  }

  updateName(name) {
    if (name) {
      return this.getCurrentUserDetails().updateProfile({ displayName: name });
    }
  }

  updateEmail(email) {
    if (email) {
      return app.auth().currentUser.updateEmail(email);
    }
  }

  updatePassword(password) {
    if (password) {
      return this.getCurrentUserDetails().updatePassword(password);
    }
  }

  getCurrentUid() {
    return app.auth().currentUser && app.auth().currentUser.uid;
  }

  async getUserName(callback) {
    if (!app.auth().currentUser) {
      return null;
    }

    const uid = app.auth().currentUser.uid;
    await app.database().ref("dblog").child(uid).once("value").then(callback);
  }
}

export default new Firebase();
