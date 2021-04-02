import React, { useEffect, useState } from "react";
import InstagramIcon from "@material-ui/icons/Instagram";
import { Link, useHistory } from "react-router-dom";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import EmailIcon from "@material-ui/icons/Email";
import LockIcon from "@material-ui/icons/Lock";
import ReplayIcon from "@material-ui/icons/Replay";
import * as ReactBootStrap from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EventNoteIcon from "@material-ui/icons/EventNote";
import { motion } from "framer-motion";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);

  const uploadPic = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "instagram");
    data.append("cloud_name", "dsicbm1ar");

    fetch("https://api.cloudinary.com/v1_1/dsicbm1ar/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const uploadFields = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      setLoading(false);
      toast.error("invalid email");
      return;
    }
    if (
      !/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)
    ) {
      setLoading(false);
      toast.error(
        "Password length should minimum 8 letters with at least a symbol, upper and lower case letters and a number"
      );

      return;
    }

    fetch("/signup", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        password2,
        pic: url,
        bio,
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
          history.push("/signin");
        }
      })
      .catch((err) => console.error(err));
  };

  const postData = async () => {
    setLoading(true);

    if (image) {
      uploadPic();
    } else {
      uploadFields();
    }
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
          <h1 className="instagram_head">Signup</h1>
        </div>

        <ReactBootStrap.InputGroup className="mb-3">
          <ReactBootStrap.InputGroup.Prepend>
            <ReactBootStrap.InputGroup.Text id="basic-addon1">
              <AccountCircleIcon />
            </ReactBootStrap.InputGroup.Text>
          </ReactBootStrap.InputGroup.Prepend>

          <ReactBootStrap.FormControl
            placeholder="Username"
            aria-label="Username"
            aria-describedby="basic-addon1"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </ReactBootStrap.InputGroup>

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
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <ReactBootStrap.InputGroup className="mb-3">
          <ReactBootStrap.InputGroup.Prepend>
            <ReactBootStrap.InputGroup.Text id="basic-addon1">
              <EventNoteIcon />
            </ReactBootStrap.InputGroup.Text>
          </ReactBootStrap.InputGroup.Prepend>

          <ReactBootStrap.FormControl
            placeholder="Add Bio"
            aria-label="Add-Bio"
            aria-describedby="basic-addon1"
            name="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            type="text"
          />
        </ReactBootStrap.InputGroup>

        <ReactBootStrap.Form.File
          label="Upload Profile Pic"
          custom
          lang="en"
          className="mt-2 mb-3"
          fluid
          style={{ textAlign: "left" }}
          name="image"
          onChange={(e) => setImage(e.target.files[0])}
        ></ReactBootStrap.Form.File>

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
            "Signup"
          )}
        </ReactBootStrap.Button>
        <h6 className="swap">
          Already an User{" "}
          <Link to="/signin" style={{ textDecoration: "None" }}>
            Login
          </Link>
        </h6>
      </div>
    </motion.div>
  );
};

export default Signup;
