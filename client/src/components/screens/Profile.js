import React, { useEffect, useState, useContext } from "react";
import * as ReactBootStrap from "react-bootstrap";
import { UserContext } from "../../App";
import { motion } from "framer-motion";

const Profile = () => {
  const [pics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(async () => {
    await fetch("/myposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setPics(result.posts);
      });
  }, []);

  const pageAnimation = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        delay: 1,
        duration: 2,
      },
    },

    exit: {
      opacity: 0,
      transition: {
        duration: 1,
      },
    },
  };

  return (
    <motion.div
      variants={pageAnimation}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="profile"
    >
      <div className="profile_details">
        <div>
          <ReactBootStrap.Image
            src={state?.pic}
            roundedCircle
            className="profile_image"
          />
        </div>
        <div className="info">
          <h2 className="name">{state?.name}</h2>
          <h5 className="bio">{state?.bio}</h5>
          <div className="activites">
            <h6 className="activity">
              {pics?.length}{" "}
              {pics?.length > 1 || pics?.length === 0 ? "Posts" : "Post"}
            </h6>
            <h6 className="activity">
              {state ? state.followers?.length : "0"}{" "}
              {state?.followers?.length > 1 || state?.followers?.length === 0
                ? "Followers"
                : "Follower"}
            </h6>
            <h6 className="activity">
              {state ? state.following?.length : "0"} Following
            </h6>
          </div>
        </div>
      </div>
      <div className="gallery">
        {pics.map((item) => {
          return (
            <ReactBootStrap.Image
              key={item._id}
              src={item.photo}
              className="item"
            />
          );
        })}
      </div>
    </motion.div>
  );
};

export default Profile;
