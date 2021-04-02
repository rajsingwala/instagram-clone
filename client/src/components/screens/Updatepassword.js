import React, { useState } from "react";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { useHistory, Link } from "react-router-dom";
import EmailIcon from "@material-ui/icons/Email";
import ReplayIcon from "@material-ui/icons/Replay";
import * as ReactBootStrap from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const Updatepassword = () => {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const postData = () => {
    setLoading(true);
    if (
      !/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)
    ) {
      setLoading(false);
      toast.error(
        "Password length should minimum 8 letters with at least a symbol, upper and lower case letters and a number"
      );

      return;
    }

    fetch("/updatepassword", {
      method: "post",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        password,
        password2,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
          setLoading(false);
        } else {
          setLoading(false);
          toast.success(data.message);
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
            <VpnKeyIcon style={{ fontSize: "2.7rem", marginBottom: "3rem" }} />{" "}
          </motion.span>
          <h1 className="instagram_head">Update Password</h1>
        </div>

        <ReactBootStrap.InputGroup className="mb-3">
          <ReactBootStrap.InputGroup.Prepend>
            <ReactBootStrap.InputGroup.Text id="basic-addon1">
              <EmailIcon />
            </ReactBootStrap.InputGroup.Text>
          </ReactBootStrap.InputGroup.Prepend>

          <ReactBootStrap.FormControl
            placeholder="New Password"
            aria-label="Password"
            aria-describedby="basic-addon1"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </ReactBootStrap.InputGroup>
        <ReactBootStrap.InputGroup className="mb-3">
          <ReactBootStrap.InputGroup.Prepend>
            <ReactBootStrap.InputGroup.Text id="basic-addon1">
              <ReplayIcon />
            </ReactBootStrap.InputGroup.Text>
          </ReactBootStrap.InputGroup.Prepend>

          <ReactBootStrap.FormControl
            placeholder="Retype-password"
            aria-label="Retype-password"
            aria-describedby="basic-addon1"
            name="password2"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            type="password"
          />
        </ReactBootStrap.InputGroup>

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
            />
          ) : (
            "Update Password"
          )}
        </ReactBootStrap.Button>
        <h6 className="swap">
          Go{" "}
          <Link to="/" style={{ textDecoration: "None" }}>
            Back
          </Link>
        </h6>
      </div>
    </motion.div>
  );
};

export default Updatepassword;
