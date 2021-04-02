import React, { useState, useContext } from "react";
import NotesIcon from "@material-ui/icons/Notes";
import { Link, useHistory } from "react-router-dom";
import * as ReactBootStrap from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EventNoteIcon from "@material-ui/icons/EventNote";
import { UserContext } from "../../App";
import { motion } from "framer-motion";

const Editprofile = () => {
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);

  const postData = () => {
    setLoading(true);
    fetch("/updatebio", {
      method: "put",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        bio,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...state, bio: result.bio })
        );
        dispatch({ type: "UPDATEBIO", payload: result.bio });
        history.push("/profile");
        toast.success("Bio Updated");
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
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
            <NotesIcon style={{ fontSize: "2.7rem", marginBottom: "3rem" }} />{" "}
          </motion.span>
          <h1 className="instagram_head">Update Bio</h1>
        </div>

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
            defaultValue={state?.bio}
            onChange={(e) => setBio(e.target.value)}
            type="text"
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
            "Update"
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

export default Editprofile;
