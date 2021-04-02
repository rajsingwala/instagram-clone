import React, { useState, useContext } from "react";
import InstagramIcon from "@material-ui/icons/Instagram";
import { Link, useHistory } from "react-router-dom";
import EmailIcon from "@material-ui/icons/Email";
import LockIcon from "@material-ui/icons/Lock";
import * as ReactBootStrap from "react-bootstrap";
import { UserContext } from "../../App";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const Login = () => {
  const { state, dispatch } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const postData = async () => {
    setLoading(true);
    await fetch("/signin", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
          setLoading(false);
        } else {
          toast.success("Login Successfully");
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          setLoading(false);
          history.push("/");
        }
      })
      .catch((err) => console.error(err));
  };

  const iconVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      scale: [1, 1.3, 1.3, 1, 1],
      transition: {
        delay: 2,
        duration: 2,
      },
    },
  };

  const pagecardVariants = {
    hidden: {
      opacity: 0,
      y: "-100vw",
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1,
        duration: 1.5,
        type: "spring",
      },
    },
    exit: {
      y: "100vw",
      transition: {
        duration: 1,
      },
    },
  };

  return (
    <motion.div
      variants={pagecardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="mycard"
    >
      <div className="card auth-card">
        <div className="head">
          <motion.span
            variants={iconVariants}
            initial="hidden"
            animate="visible"
          >
            <InstagramIcon
              style={{ fontSize: "2.7rem", marginBottom: "3rem" }}
            />{" "}
          </motion.span>
          <h1 className="instagram_head">Login</h1>
        </div>

        <ReactBootStrap.InputGroup className="mb-3">
          <ReactBootStrap.InputGroup.Prepend>
            <ReactBootStrap.InputGroup.Text id="basic-addon1">
              <EmailIcon />
            </ReactBootStrap.InputGroup.Text>
          </ReactBootStrap.InputGroup.Prepend>

          <ReactBootStrap.FormControl
            placeholder="Email"
            aria-label="Email"
            aria-describedby="basic-addon1"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </ReactBootStrap.InputGroup>
        <ReactBootStrap.InputGroup className="mb-3">
          <ReactBootStrap.InputGroup.Prepend>
            <ReactBootStrap.InputGroup.Text id="basic-addon1">
              <LockIcon />
            </ReactBootStrap.InputGroup.Text>
          </ReactBootStrap.InputGroup.Prepend>

          <ReactBootStrap.FormControl
            placeholder="Password"
            aria-label="Password"
            aria-describedby="basic-addon1"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </ReactBootStrap.InputGroup>
        <motion.span whileHover={{ scale: 1.1 }}>
          {" "}
          <Link to="/reset" style={{ textDecoration: "None" }}>
            {" "}
            Forgot Password{" "}
          </Link>
        </motion.span>

        <ReactBootStrap.Button
          type="submit"
          className="button"
          disabled={loading}
          onClick={() => postData()}
        >
          {loading ? (
            <ReactBootStrap.Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              disabled={loading}
            />
          ) : (
            "Login"
          )}
        </ReactBootStrap.Button>

        <h6 className="swap">
          New Here{" "}
          <Link to="/signup" style={{ textDecoration: "None" }}>
            Signup
          </Link>
        </h6>
      </div>
    </motion.div>
  );
};

export default Login;
