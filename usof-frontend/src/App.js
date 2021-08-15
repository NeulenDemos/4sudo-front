import React from "react";
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Toaster} from "./components/Toaster";
import {Helmet} from 'react-helmet'
import {Loader} from './components/Loader';
import {Navbar} from './components/Navbar';
import {Footer} from "./components/Footer";
import {Home} from './pages/Home';
import {ApiState} from "./context/api/ApiState";
import {Users} from './pages/Users';
import {User} from './pages/User'
import {EditUser} from './pages/EditUser'
import {Post} from './pages/Post';
import {Posts} from './pages/Posts';
import {CreatePost} from "./pages/CreatePost";
import {EditPost} from './pages/EditPost';
import {Categories} from './pages/Categories';
import {Login} from "./pages/Login";
import {Registration} from "./pages/Registration";
import {PasswordReset} from "./pages/PasswordReset";

function App() {
  return (
      <ApiState>
          <BrowserRouter>
              <Helmet defaultTitle="4Sudo" titleTemplate="%s ∣ 4Sudo"/>
              <Loader/>
              <Navbar/>
              <Switch>
                  <Route path={'/'} exact component={Home}/>
                  <Route path={'/users'} exact component={Users}/>
                  <Route path={'/users/:id'} exact component={User}/>
                  <Route path={'/users/:id/edit'} exact component={EditUser}/>
                  <Route path={'/posts'} exact component={Posts}/>
                  <Route path={'/posts/create'} exact component={CreatePost}/>
                  <Route path={'/posts/:id'} exact component={Post}/>
                  <Route path={'/posts/:id/edit'} exact component={EditPost}/>
                  <Route path={'/categories/'} component={Categories}/>
                  <Route path={'/login'} first component={Login}/>
                  <Route path={'/registration'} first component={Registration}/>
                  <Route path={'/password-reset'} first component={PasswordReset}/>
              </Switch>
              <Footer/>
              <Toaster/>
          </BrowserRouter>
      </ApiState>
  );
}

export default App;
