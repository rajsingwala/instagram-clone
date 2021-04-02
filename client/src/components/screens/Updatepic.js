import React, { useEffect, useState, useContext } from "react";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import { Link, useHistory } from "react-router-dom";
import * as ReactBootStrap from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../App";
import { motion } from "framer-motion";

const Updatepic = () => {
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    if (url) {
      fetch("/updatepic", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          localStorage.setItem(
            "user",
            JSON.stringify({ ...state, pic: result.pic })
          );
          dispatch({ type: "UPDATEPIC", payload: result.pic });
          history.push("/profile");
          toast.success("Profile Pic Updated");
        });
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
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const postData = () => {
    setLoading(true);
    if (image) {
      uploadPic();
    } else {
      toast.error("please upload an image");
      setLoading(false);
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
            <PhotoCameraIcon
              style={{ fontSize: "2.7rem", marginBottom: "3rem" }}
            />{" "}
          </motion.span>
          <h1 className="instagram_head">Change Avatar</h1>
        </div>
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

export default Updatepic;
