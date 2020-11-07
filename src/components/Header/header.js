import React from "react";
import { Link, withRouter } from "react-router-dom";
import "./header.css";
import { Dropdown, ButtonGroup, Button } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import firebase from "../../firebase";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout = async () => {
    await firebase.logout().catch((error) => {
      console.log(error);
    });
    console.log("logout succesfully");
    this.props.history.push("/");
  };

  render() {
    return (
      <header id="main-header">
        <div className="header-content">
          <Link to="/">DBlog</Link>
          <div>
            {firebase.getCurrentUserDetails() == null && (
              <Link to={"/login"}>
                <FaUserCircle />
              </Link>
            )}
            {firebase.getCurrentUserDetails() && (
              <Dropdown as={ButtonGroup}>
                <Button style={{ background: "#272727" }}>
                  <Link className="profileLink" to={"/profile"}>
                    <FaUserCircle />
                  </Link>
                </Button>

                <Dropdown.Toggle split id="dropdown-split-basic" />

                <Dropdown.Menu>
                  <Dropdown.Item href="/dashboard">My Post</Dropdown.Item>
                  <Dropdown.Item onClick={this.logout}>Logo-out</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </div>
      </header>
    );
  }
}

export default withRouter(Header);
