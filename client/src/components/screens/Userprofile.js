import React, { useEffect, useState, useContext } from "react";
import * as ReactBootStrap from "react-bootstrap";
import { useParams } from "react-router-dom";
import { UserContext } from "../../App";
import Loading from "./Loading";
import { motion } from "framer-motion";

const Profile = () => {
  const [userProfile, setUserprofile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [isfollow, setIsfollow] = useState(false);

  useEffect(() => {
    setIsfollow(state?.following?.includes(userid) ? true : false);
  }, [state]);

  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setUserprofile(result);
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

  const followUser = () => {
    setLoading(true);
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { followers: data.followers, following: data.following },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setUserprofile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setIsfollow(true);
        setLoading(false);
      });
  };

  const unFollowuser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { followers: data.followers, following: data.following },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setUserprofile((prevState) => {
          const newfollower = prevState.user.followers.filter(
            (item) => item != data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newfollower,
            },
          };
        });
        setIsfollow(false);
        setLoading(false);
      });
  };

  return (
    <>
      {userProfile ? (
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
                src={userProfile?.user?.pic}
                roundedCircle
                className="profile_image"
              />
            </div>
            <div className="info">
              <h2 className="name">{userProfile && userProfile.user?.name}</h2>
              <h4 className="bio">{userProfile?.user?.bio}</h4>
              <div className="activites">
                <h6 className="activity">
                  {userProfile?.post?.length}{" "}
                  {userProfile?.post?.length > 1 ||
                  userProfile?.post?.length === 0
                    ? "Posts"
                    : "Post"}
                </h6>
                <h6 className="activity">
                  {userProfile.user.followers.length}{" "}
                  {userProfile.user.followers.length > 1 ||
                  userProfile.user.followers.length === 0
                    ? "Followers"
                    : "Follower"}
                </h6>
                <h6 className="activity">
                  {userProfile.user.following.length} Following
                </h6>
              </div>
              {isfollow ? (
                <ReactBootStrap.Button
                  variant="primary"
                  className="follow"
                  disabled={loading}
                  onClick={() => unFollowuser()}
                >
                  {loading ? "UnFollowing" : "UnFollow"}
                </ReactBootStrap.Button>
              ) : (
                <ReactBootStrap.Button
                  variant="primary"
                  className="follow"
                  disabled={loading}
                  onClick={() => followUser()}
                >
                  {loading ? "Following" : "Follow"}
                </ReactBootStrap.Button>
              )}
            </div>
          </div>

          <div className="gallery">
            {userProfile?.post?.map((item) => {
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
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Profile;
