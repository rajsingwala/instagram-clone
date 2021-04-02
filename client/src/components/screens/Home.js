import React, { useState, useEffect, useContext } from "react";
import * as ReactBootStrap from "react-bootstrap";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ClosedCaptionIcon from "@material-ui/icons/ClosedCaption";
import Loading from "./Loading";
import InsertCommentIcon from "@material-ui/icons/InsertComment";
import { UserContext } from "../../App";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import DeleteIcon from "@material-ui/icons/Delete";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import moment from "moment";
import { motion } from "framer-motion";

const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  useEffect(() => {
    fetch("/allposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result.posts);
      });
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return { ...item, likes: result.likes };
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unLikepost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return { ...item, likes: result.likes };
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text,
        postId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return { ...item, comments: result.comments };
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        handleClose();
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
        toast.success("Post Deleted Successfully");
      })
      .catch((err) => console.error(err));
  };

  const deleteComment = (postId, commentId) => {
    fetch(`/deletecomment/${postId}/${commentId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        handleClose2();
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
        toast.success("Comment deleted Successfully ");
      })
      .catch((err) => console.log(err));
  };

  const pageAnimation = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 2,
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 1,
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
    <>
      {data?.length > 0 ? (
        <div className="home">
          {data.map((item) => {
            return (
              <motion.div
                variants={pageAnimation}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                exit="exit"
                className="card home-card"
                key={item._id}
              >
                <span className="post_header">
                  <h4>
                    <Link
                      to={
                        item.postedBy._id !== state?._id
                          ? "/profile/" + item.postedBy._id
                          : "/profile"
                      }
                      style={{ textDecoration: "None" }}
                    >
                      <ReactBootStrap.Image
                        src={item.postedBy.pic}
                        roundedCircle
                        className="avatar"
                      />
                      <span className="home_name">{item.postedBy.name}</span>
                    </Link>
                  </h4>

                  {item.postedBy._id === state?._id && (
                    <DeleteIcon className="bin" onClick={handleShow} />
                  )}
                </span>
                <ReactBootStrap.Card className="card_container">
                  <ReactBootStrap.Card.Img
                    className="home_image"
                    variant="top"
                    src={item.photo}
                  />

                  <div className="likes">
                    {item.likes.includes(state?._id) ? (
                      <FavoriteIcon
                        onClick={() => unLikepost(item._id)}
                        style={{
                          marginTop: "7px",
                          color: "red",
                          marginLeft: "0.5rem",
                          cursor: "pointer",
                        }}
                      />
                    ) : (
                      <FavoriteBorderIcon
                        onClick={() => likePost(item._id)}
                        style={{
                          marginTop: "7px",
                          marginLeft: "0.5rem",
                          cursor: "pointer",
                        }}
                      />
                    )}
                    <h6 className="likes">
                      {item.likes.length}{" "}
                      {item.likes.length > 1 || item.likes.length === 0
                        ? "likes"
                        : "like"}
                      <span className="time">
                        {moment(item.createdAt).fromNow()}
                      </span>
                    </h6>
                  </div>
                  <ReactBootStrap.Card.Body>
                    <ReactBootStrap.Card.Text>
                      <strong style={{ display: "flex", marginTop: "-10px" }}>
                        <ClosedCaptionIcon className="caption" />
                        <span className="body_title">{item.body}</span>
                      </strong>
                      <div className="border"></div>
                      {item.comments.length == 0 ? (
                        <span className="no_com">No Comments</span>
                      ) : (
                        <span>
                          {" "}
                          {item.comments.map((record) => {
                            return (
                              <h6 key={record._id} className="cross">
                                <span style={{ fontWeight: "bolder" }}>
                                  {record.postedBy.map((comment) => {
                                    return (
                                      <span>
                                        {comment._id === state?._id && (
                                          <HighlightOffIcon
                                            className="cross_img"
                                            onClick={handleShow2}
                                          />
                                        )}
                                        <span className="comment_name">
                                          {comment.name}
                                        </span>
                                      </span>
                                    );
                                  })}
                                </span>{" "}
                                <span className="comment_text">
                                  {record.text}
                                </span>
                              </h6>
                            );
                          })}
                        </span>
                      )}
                    </ReactBootStrap.Card.Text>
                  </ReactBootStrap.Card.Body>
                </ReactBootStrap.Card>
                <ReactBootStrap.Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    makeComment(e.target[0].value, item._id);
                  }}
                >
                  <ReactBootStrap.InputGroup className="mb-3">
                    <ReactBootStrap.InputGroup.Prepend>
                      <ReactBootStrap.InputGroup.Text>
                        <InsertCommentIcon />
                      </ReactBootStrap.InputGroup.Text>
                    </ReactBootStrap.InputGroup.Prepend>
                    <ReactBootStrap.FormControl placeholder="add a comment" />
                  </ReactBootStrap.InputGroup>
                </ReactBootStrap.Form>

                {/* delete post */}
                <ReactBootStrap.Modal
                  show={show}
                  onHide={handleClose}
                  backdrop="static"
                  keyboard={false}
                >
                  <ReactBootStrap.Modal.Header closeButton>
                    <ReactBootStrap.Modal.Title>
                      Delete Post
                    </ReactBootStrap.Modal.Title>
                  </ReactBootStrap.Modal.Header>
                  <ReactBootStrap.Modal.Body>
                    Do you want to delete this post?
                  </ReactBootStrap.Modal.Body>
                  <ReactBootStrap.Modal.Footer>
                    <ReactBootStrap.Button
                      variant="secondary"
                      onClick={handleClose}
                    >
                      No
                    </ReactBootStrap.Button>
                    <ReactBootStrap.Button
                      variant="primary"
                      onClick={() => deletePost(item._id)}
                    >
                      Yes
                    </ReactBootStrap.Button>
                  </ReactBootStrap.Modal.Footer>
                </ReactBootStrap.Modal>

                {/* delete comment */}
                {item.comments.map((record) => {
                  return (
                    <ReactBootStrap.Modal
                      show={show2}
                      onHide={handleClose2}
                      backdrop="static"
                      keyboard={false}
                    >
                      <ReactBootStrap.Modal.Header closeButton>
                        <ReactBootStrap.Modal.Title>
                          Delete Comment
                        </ReactBootStrap.Modal.Title>
                      </ReactBootStrap.Modal.Header>
                      <ReactBootStrap.Modal.Body>
                        Do you want to delete this comment?
                      </ReactBootStrap.Modal.Body>
                      <ReactBootStrap.Modal.Footer>
                        <ReactBootStrap.Button
                          variant="secondary"
                          onClick={handleClose2}
                        >
                          No
                        </ReactBootStrap.Button>
                        <ReactBootStrap.Button
                          variant="primary"
                          onClick={() => deleteComment(item._id, record._id)}
                        >
                          Yes
                        </ReactBootStrap.Button>
                      </ReactBootStrap.Modal.Footer>
                    </ReactBootStrap.Modal>
                  );
                })}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Home;
