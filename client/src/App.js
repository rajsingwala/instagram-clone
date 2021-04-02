import React, { useEffect, createContext, useReducer, useContext } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";
import Home from "./components/screens/Home";
import Profile from "./components/screens/Profile";
import Login from "./components/screens/Login";
import Signup from "./components/screens/Signup";
import CreatePost from "./components/screens/CreatePost";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initialState, reducer } from "./reducer/userReducer";
import Userprofile from "./components/screens/Userprofile";
import Loading from "./components/screens/Loading";
import Followingposts from "./components/screens/Followingposts";
import Editprofile from "./components/screens/Editprofile";
import Updatepic from "./components/screens/Updatepic";
import Resetpassword from "./components/screens/Resetpassword";
import Newpassword from "./components/screens/Newpassword";
import Updatepassword from "./components/screens/Updatepassword";
import { AnimatePresence } from "framer-motion";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      if (!history.location.pathname.startsWith("/reset"))
        history.push("/signin");
    }
  }, []);
  return (
    <AnimatePresence>
      <Switch location={location} key={location.key}>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/signin">
          <Login />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route exact path="/reset">
          <Resetpassword />
        </Route>
        <Route path="/reset/:token">
          <Newpassword />
        </Route>
        <Route path="/updatepassword">
          <Newpassword />
        </Route>
        <Route path="/updatepassword2">
          <Updatepassword />
        </Route>
        <Route exact path="/profile">
          <Profile />
        </Route>
        <Route path="/createpost">
          <CreatePost />
        </Route>
        <Route path="/subposts">
          <Followingposts />
        </Route>
        <Route path="/editprofile">
          <Editprofile />{" "}
        </Route>
        <Route path="/editprofilepic">
          <Updatepic />{" "}
        </Route>
        <Route path="/profile/:userid">
          <Userprofile />
        </Route>
        <Route path="/loading">
          <Loading />
        </Route>

        <Redirect to="/"></Redirect>
      </Switch>
    </AnimatePresence>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        progress={undefined}
      />
      <UserContext.Provider value={{ state, dispatch }}>
        <Router>
          <Navbar />
          <Routing />
        </Router>
      </UserContext.Provider>
    </>
  );
};

export default App;
