import React, { useContext, useState } from "react";
import * as ReactBootStrap from "react-bootstrap";
import InstagramIcon from "@material-ui/icons/Instagram";
import { Link, useHistory, NavLink } from "react-router-dom";
import { UserContext } from "../App";
import SearchIcon from "@material-ui/icons/Search";
import { motion } from "framer-motion";

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);
  const [userDetails, setUserdetails] = useState([]);

  const handleClose = () => {
    setShow(false);
    setName("");
    setUserdetails([]);
  };
  const handleShow = () => setShow(true);

  const renderList = () => {
    if (state) {
      return [
        <ReactBootStrap.Nav.Link className="primary_color">
          <motion.span
            className="instagram"
            variants={navVariants}
            initial="hidden"
            animate="visible"
            style={{ color: "black" }}
          >
            <SearchIcon onClick={handleShow} />{" "}
          </motion.span>
        </ReactBootStrap.Nav.Link>,

        <ReactBootStrap.Nav.Link href="/" eventKey={1}>
          <NavLink exact to="/" className="active-nav" activeClassName="active">
            <motion.span
              variants={navVariants}
              initial="hidden"
              animate="visible"
            >
              Home
            </motion.span>
          </NavLink>
        </ReactBootStrap.Nav.Link>,

        <ReactBootStrap.Nav.Link href="/subposts" eventKey={2}>
          <NavLink
            to="/subposts"
            activeClassName="active"
            className="active-nav"
          >
            <motion.span
              variants={navVariants}
              initial="hidden"
              animate="visible"
            >
              Following Posts
            </motion.span>
          </NavLink>
        </ReactBootStrap.Nav.Link>,

        <ReactBootStrap.Nav.Link href="/createpost" eventKey={3}>
          <NavLink
            to="/createpost"
            activeClassName="active"
            className="active-nav"
          >
            <motion.span
              variants={navVariants}
              initial="hidden"
              animate="visible"
            >
              Create Post
            </motion.span>
          </NavLink>
        </ReactBootStrap.Nav.Link>,

        <motion.span variants={navVariants} initial="hidden" animate="visible">
          <ReactBootStrap.NavDropdown
            title={state?.name}
            id="basic-nav-dropdown"
            className="dropdown"
          >
            <ReactBootStrap.NavDropdown.Item href="/profile">
              <NavLink
                activeClassName="active"
                to="/profile"
                style={{ textDecoration: "None", color: "inherit" }}
              >
                Profile
              </NavLink>
            </ReactBootStrap.NavDropdown.Item>

            <ReactBootStrap.NavDropdown.Item href="/editprofilepic">
              <NavLink
                activeClassName="active"
                to="/editprofilepic"
                style={{ textDecoration: "None", color: "inherit" }}
              >
                Change Avatar
              </NavLink>
            </ReactBootStrap.NavDropdown.Item>
            <ReactBootStrap.NavDropdown.Item href="/editprofile">
              <NavLink
                activeClassName="active"
                to="/editprofile"
                style={{ textDecoration: "None", color: "inherit" }}
              >
                {" "}
                Change Bio
              </NavLink>
            </ReactBootStrap.NavDropdown.Item>
            <ReactBootStrap.NavDropdown.Item href="/updatepassword2">
              <NavLink
                activeClassName="active"
                to="/updatepassword2"
                style={{ textDecoration: "None", color: "inherit" }}
              >
                {" "}
                Change Password
              </NavLink>
            </ReactBootStrap.NavDropdown.Item>
            <ReactBootStrap.NavDropdown.Divider />
            <ReactBootStrap.NavDropdown.Item
              onClick={() => {
                localStorage.clear();
                dispatch({ type: "CLEAR" });
                history.push("/signin");
              }}
            >
              Logout
            </ReactBootStrap.NavDropdown.Item>
          </ReactBootStrap.NavDropdown>
        </motion.span>,
      ];
    } else {
      return [
        <ReactBootStrap.Nav.Link eventKey={4} href="/signup">
          <NavLink to="/signup" activeClassName="active" className="active-nav">
            <motion.span
              variants={navVariants}
              initial="hidden"
              animate="visible"
            >
              Signup
            </motion.span>
          </NavLink>
        </ReactBootStrap.Nav.Link>,
        <ReactBootStrap.Nav.Link eventKey={5} href="/signin">
          <NavLink to="/signin" activeClassName="active" className="active-nav">
            <motion.span
              variants={navVariants}
              initial="hidden"
              animate="visible"
            >
              Login
            </motion.span>
          </NavLink>
        </ReactBootStrap.Nav.Link>,
      ];
    }
  };

  const fetchUser = (query) => {
    setName(query);
    fetch("/searchuser", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setUserdetails(result.user);
      });
  };

  const iconVariants = {
    hidden: {
      opacity: 0.5,
    },
    hover: {
      scale: 1.1,
    },
    visible: {
      opacity: 1,
      scale: [1, 1, 1.1, 1, 1],
      rotate: [0, 0, 270, 270, 0],
      transition: {
        delay: 0.5,
        duration: 3,
        yoyo: Infinity,
      },
    },
  };

  const navVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        ease: "easeIn",
        delay: 1,
        duration: 2,
      },
    },
  };

  return (
    <ReactBootStrap.Navbar
      collapseOnSelect
      expand="lg"
      variant="light"
      fixed="top"
      className="nav"
    >
      <Link to={state ? "/" : "/signin"} style={{ textDecoration: "None" }}>
        <ReactBootStrap.Navbar.Brand className="brand">
          <motion.span
            variants={iconVariants}
            initial="hidden"
            animate="visible"
          >
            <InstagramIcon style={{ fontSize: "2.7rem" }} />{" "}
          </motion.span>

          <motion.span
            className="instagram"
            variants={navVariants}
            initial="hidden"
            animate="visible"
          >
            Instagram
          </motion.span>
        </ReactBootStrap.Navbar.Brand>
      </Link>
      <ReactBootStrap.Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <ReactBootStrap.Navbar.Collapse
        id="responsive-navbar-nav"
        className="nav_coll"
      >
        <ReactBootStrap.Nav className="mr-auto"></ReactBootStrap.Nav>
        <ReactBootStrap.Nav className="auth"></ReactBootStrap.Nav>
        {renderList()}
        <ReactBootStrap.Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <ReactBootStrap.Modal.Header closeButton>
            <ReactBootStrap.Modal.Title>Search User</ReactBootStrap.Modal.Title>
          </ReactBootStrap.Modal.Header>
          <ReactBootStrap.Modal.Body>
            <ReactBootStrap.FormControl
              placeholder="Enter Username"
              aria-label="Username"
              aria-describedby="basic-addon1"
              name="name"
              value={name}
              onChange={(e) => fetchUser(e.target.value)}
            />
            {userDetails.map((item) => {
              return (
                <ReactBootStrap.ListGroup as="ul" style={{ marginTop: "1rem" }}>
                  <ReactBootStrap.ListGroup.Item as="li">
                    <div className="search">
                      <Link
                        to={
                          item._id !== state._id
                            ? "/profile/" + item._id
                            : "/profile"
                        }
                        style={{
                          textDecoration: "None",
                          color: "black",
                          fontWeight: "400px",
                        }}
                        onClick={handleClose}
                      >
                        <ReactBootStrap.Image
                          className="search_image"
                          src={item.pic}
                          roundedCircle
                        />
                        <span className="search_name">{item.name}</span>
                      </Link>
                    </div>
                  </ReactBootStrap.ListGroup.Item>
                </ReactBootStrap.ListGroup>
              );
            })}
          </ReactBootStrap.Modal.Body>
          <ReactBootStrap.Modal.Footer>
            <ReactBootStrap.Button variant="primary" onClick={handleClose}>
              Close
            </ReactBootStrap.Button>
          </ReactBootStrap.Modal.Footer>
        </ReactBootStrap.Modal>
      </ReactBootStrap.Navbar.Collapse>
    </ReactBootStrap.Navbar>
  );
};

export default Navbar;
