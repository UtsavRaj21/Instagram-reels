import Login from './components/login'
import Feed from './components/feed'
import Signup from './components/singup'
import Profile from './components/profile'
import {Switch,Route, Redirect} from 'react-router-dom'
let isAuthenticated = true;

//npm i react-route
//npm i react-route-dom

function App() {
  return (
    // <h1>Reels</h1>
    // <Login/>
    // <Todo/>
    <Switch>
        <Route path="/login" component={Login}></Route>
        <Route path="/signup" component={Signup}></Route>
        <ProtectedRoute path="/feed" abc={Feed} ></ProtectedRoute>  /*abc instead of component beacuse component give bug */
        <Route path="/profile" component={Profile}></Route>
        <Redirect path="/" to="/feed"></Redirect>
    </Switch>
  );
}

function ProtectedRoute(props) {
  let Component = props.abc;
  return (<Route {...props} render={(props) => {
    console.log(isAuthenticated);
    return (isAuthenticated == true ? <Component {...props} ></Component> : <Redirect to="/login"></Redirect>
    )
  }}></Route>

  )
}

export default App;
