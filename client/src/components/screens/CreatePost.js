import React, { useState, useEffect } from "react";
import * as ReactBootStrap from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import ClosedCaptionIcon from "@material-ui/icons/ClosedCaption";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const CreatePost = () => {
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");

  const history = useHistory();

  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
            setLoading(false);
          } else {
            setLoading(false);
            toast.success("Post Created Successfully");
            history.push("/");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [url]);

  const postDetails = () => {
    setLoading(true);

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
        setLoading(false);
        setUrl(data.url);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
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
            <h1 className="instagram_head">Create Post</h1>
          </motion.span>
        </div>

        <ReactBootStrap.Form>
          <ReactBootStrap.InputGroup className="mb-3">
            <ReactBootStrap.InputGroup.Prepend>
              <ReactBootStrap.InputGroup.Text id="basic-addon1">
                <ClosedCaptionIcon />
              </ReactBootStrap.InputGroup.Text>
            </ReactBootStrap.InputGroup.Prepend>

            <ReactBootStrap.FormControl
              placeholder="Create Caption"
              aria-label="Caption"
              aria-describedby="basic-addon1"
              name="body"
              value={body}
              type="text"
              onChange={(e) => setBody(e.target.value)}
            />
          </ReactBootStrap.InputGroup>

          <ReactBootStrap.Form.File
            label="Upload Image"
            custom
            lang="en"
            className="mt-2 mb-3"
            fluid
            style={{ textAlign: "left" }}
            name="image"
            onChange={(e) => setImage(e.target.files[0])}
          ></ReactBootStrap.Form.File>

          <motion.div whileHover={{ scale: 1.1 }}>
            <ReactBootStrap.Button
              type="submit"
              className="button"
              disabled={loading}
              onClick={() => postDetails()}
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
                "Create Post"
              )}
            </ReactBootStrap.Button>
          </motion.div>
          <h6 className="swap">
            Go{" "}
            <Link to="/" style={{ textDecoration: "None" }}>
              Back
            </Link>
          </h6>
        </ReactBootStrap.Form>
      </div>
    </motion.div>
  );
};

export default CreatePost;
