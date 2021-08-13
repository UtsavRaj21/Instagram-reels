import React, { useState, useContext,useEffect } from 'react';
import { AuthContext } from "../Context/AuthProvider";
import { storage,database } from "../firebaseAuth/firebase";
function Signup(props) {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    const [fullName, setfullName] = useState('');
    let [loginLoader, setLoginLoader] = useState(false);
    let [error, setError] = useState("");
    const [file, setFile] = useState(null);
    let { genericSignup, currentUser } = useContext(AuthContext);

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }
    const handlePassword = (e) => {
        setPassword(e.target.value);
    }
    const handleName = (e) => {
        setfullName(e.target.value);
    }
    const handleUpload = (e) => {
        // dom 
        let file = e?.target?.files[0];
        if (file != null)
            setFile(file);
        // console.log(file)
    }

    useEffect(() => {
        if (currentUser) {
            // send to feed page
            props.history.push('/feed');
        }
    });

    const handleSignup = async () => {
        try {
            setError("");
            setLoginLoader(true);
            //    1. signup 
            let userCredential = await genericSignup(email, password);
            let uid = userCredential.user.uid;
            // uid 
            console.log(uid);
            // 
            // user folder -> uid name file store
            //start storage in firebase then refresh to see the changes
            const uploadListener = storage.ref("/users/" + uid).put(file);
            uploadListener.on("state_changed", onprogress, onerror, onsucess);
            function onprogress(snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(progress)
            }
            function onerror(err) {
                console.log(err);
            }
            async function onsucess() {
                // /url 
                let downloadUrl = await uploadListener.snapshot.ref.getDownloadURL();
                console.log(downloadUrl);
                //3 . user create firestore 
                database.users.doc(uid).set({
                    email: email,
                    fullName: fullName,
                    profileUrl: downloadUrl,
                    reels:[],
                    likes:[],
                    comments:[],
                   // createdAt:database.createdAt.serverTimestamp(),
                })
            }
        } catch (err) {

        }

    }
    // usage
    return (
        <div>
            <div>
                <input type="email"
                placeholder="email"
                    value={email}
                    onChange={handleEmail}
                />
            </div>
            <div>
                <input type="password"
                placeholder="pass"
                    value={password}
                    onChange={handlePassword}
                />
            </div>
            <div>
                <input type="text"
                placeholder="name"
                    value={fullName}
                    onChange={handleName}
                />
            </div>
            <div>
                <input type="file"
                    accept="image/*"
                    onChange={handleUpload}
                />
            </div>
            <div>
                <input type="button" onClick={handleSignup} value="SIGNUP">
                    
                </input>
            </div>


        </div>
    )
}

export default Signup