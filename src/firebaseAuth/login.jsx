import React, { useState ,useEffect} from 'react';
import firebase from './firebase';
// authectication use 
const auth = firebase.auth();

function Login() {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [loginloader, setLoginLoader] = useState(false);
    let [error, setError] = useState("");
    let [userId, setUserId] = useState("");

    const loginFn = async () => {
        //login for one letter
        //email,password -> firebase
        // aith on -> enable email and password
        //user create on firebase site
        //npm i firebase -> local machine
        //firebase login

        // alert(email,password);
        try {
            setLoginLoader(true);
            let res = await auth.signInWithEmailAndPassword(email, password);
            console.log(res.user.uid);
            setLoginLoader(false)
            setUserId(res.user.uid);
        } catch (err) {
            setLoginLoader(false);
            setError(err.message);
            setTimeout(()=>{
                setError(false);
            },1000);
        }


    }

    const logoutFn = async ()=>{
        try {
            setLoginLoader(true);
           await auth.signOut();
           // console.log(res.user.uid);
            setLoginLoader(false)
            setUserId("");
        } catch (err) {
            setLoginLoader(false);
            setError(err.message);
            setTimeout(()=>{
                setError(false);
            },1000);
        }
    }
    //if login then direct page access
    //useEffect run  1 time and event lisenter attach for the first time
    useEffect(() =>{
        function action(user){
            let FinalUser = user?user.uid : null;
            setUserId(FinalUser);
        }
        auth.onAuthStateChanged(action);
    },[])
    return (
        // form will available
        loginloader == true ? <h1>Loading...</h1> :
                 userId ?<> <h1>{userId}</h1> 
                 <button onClick={logoutFn}>logOut</button></>:
            <div>
                <h1>Reels</h1>
                <div>
                    Email:
                <input type="Email" placeholder="your Email" value={email} onChange={(e) => {
                        //login for single charater check
                        setEmail(e.target.value);
                    }} />
                </div>
                <div>
                    PassWord:
                <input type="password" placeholder="your Password" value={password} onChange={(e) => {
                        setPassword(e.target.value);
                    }} />
                </div>
                <button onClick={loginFn}>login</button>
                {error ? <h1>Error</h1>:<></>}
            </div>
    )
}

export default Login;