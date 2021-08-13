import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Context/AuthProvider';
import firebase,{storage, database } from './../firebaseAuth/firebase';
//npm i react-uuid
import uuid from 'react-uuid';
// import './reel1.mp4';

function Feed() {
    let { currentUser } = useContext(AuthContext);
    let [user, setUser] = useState(null);
    useEffect(async () => {
        let user = await database.users.doc(currentUser.uid).get();
        console.log("in Feed", user.data());
        setUser(user.data());
    }, [])
    return (
        <div>
            <Header user={user}></Header>
            <Upload user={user} uid={currentUser.uid}></Upload>
            <Reels></Reels>
        </div>
    )
}



function Header(props) {
    let { user } = props
    return (
        <div style={{
            height: "5vh",
            border: "1px solid lightgray",
            boxShadow: "10px 5px 5px gray",
            textAlign: "center",
        }}>
            <span>{user?.fullName}</span>
            {/* Header */}
            <img style={
                {
                    height: "4vh", borderRadius: "50%",
                    border: "1px solid gray"
                }
            }
                src={user?.profileUrl} alt="" />

        </div>
    )
}

function Upload(props) {
    const handleUpload = async (e) => {
        // dom 
        let file = e?.target?.files[0];
        if (file != null)
            try {

                let ruid = uuid();
                // user folder -> uid name file store
                //start storage in firebase then refresh to see the changes
                const uploadListener = storage.ref("/reels/" + ruid).put(file);
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
                     console.log("uploadURL",downloadUrl);
                    //2 .  firestore 
                    let {user,uid} = props;
                      //3. user create firestore 
                    database.reels.doc(ruid).set({
                        authorName: user.fullName,
                        authorPicUrl : user.profileUrl,
                        videoUrl: downloadUrl,
                        likes: [],
                        comments: [],
                        createdAt:firebase.firestore.FieldValue.serverTimestamp(),
                    })
                    let updatedReelsId = [...user.reels,ruid];
                    // 4. profile page me reels add 
                    database.users.doc(uid).update({
                        reels:updatedReelsId,
                    })
                }
            } catch (err) {

            }

    }
    return (
        <div>
            <div>
                <input type="file"
                    accept="video/*"
                    onChange={handleUpload}
                />
            </div>
        </div>
    )
}

function Reels() {
    let [reels,setReels] = useState([]);

    const handleMuted = function (e) {
        e.target.muted = !e.target.muted;
    }

    useEffect(async()=>{
        let entries = await database.reels.orderBy("createdAt","desc").get();
        let arr=[];
        entries.forEach((entry)=>{
            let newEntry = entry.data();
            console.log("reelsFeed" , newEntry)
            arr.push(newEntry);
        })
        console.log("feedReels",arr);
        setReels(arr);
    },[]);


    return (
        <div>
            <div class="reels" style={{
                height:"80vh",
              

            }}>
                {
                    reels.map(function(videoObject,idx){
                       return ( <div className="video-container" style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                     
                    }}
                        key={idx}>
                            <video style={{
                                    height: "80vh",
                                    marginBottom: "3rem"
                                }}
                                src={videoObject.videoUrl}
                                loop autoPlay
                                muted={true}
                                controls={false}
                                onClick={handleMuted}
                            ></video>
                          
                        </div>)
                    })
                }
            </div>
        </div>
    )
}

export default Feed;