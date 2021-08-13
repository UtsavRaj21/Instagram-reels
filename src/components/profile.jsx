import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Context/AuthProvider';
import firebase, { database } from './../firebaseAuth/firebase';

function Profile() {
    let { currentUser } = useContext(AuthContext);
    let [user, setUser] = useState(null);
    useEffect(async () => {
        let user = await database.users.doc(currentUser.uid).get();
        console.log("in profile", user.data());
        setUser(user.data());
    }, [])
    return (
        <div>
            <Header user={user}></Header>
            <Reels user={user}></Reels>
        </div>
    )
}

function Header(props) {
    let { user } = props
    return (
        <div style={{
            height: "30vh",
            width: "100vw",
            border: "1px solid lightgray",
            boxShadow: "10px 5px 5px gray",
            display:"flex",
            alignItems:"center"
        }}>

            <div>
            <img style={
                {
                    height: "20vh", borderRadius: "20%",
                    border: "1px solid gray",marginLeft:"20vw"
                }
            }
                src={user?.profileUrl} alt="" />
            </div>

            <div style={{
                marginLeft:"30vw",
              
            }}>
                <div style={{
                      fontSize:"xx-large"
                }}>{user?.fullName}</div>
                <div style={{
                      fontSize:"x-large"
                }}>{user?.email}</div>
            </div>
        </div>
    )
}

function Reels(props){
    let {user} = props;
    let [uploadReel,showReels] = useState([]);

    useEffect(()=>{
    //    let arr =[];
    //    user?.reels.forEach((entry)=>{
    //      arr.push(entry);
    //    })

    //    showReels(arr);
    let arr = user.reels;
    showReels(arr);
    console.log("arr",arr);
        //console.log("user1",arr);
    },[]);

   

    return(
        <div> 
            <div>
            uploadReel.map(function(videoId,idx){
                <span>videoId</span>
            }
            </div> 
          
            // <div class="reels" style={{
            //     height:"80vh",
            //     display:"flex",
            //     flexWrap:"wrap"
            // }}>
            //     <div style={{
            //          height:"20vh",
            //          width:"20vw"
            //     }}>
            //      {
            //         uploadReel.map(function(videoId,idx){
            //            return ( <div className="video-container" style={{
            //             display: "flex",
            //             justifyContent: "center",
            //             alignItems: "center",
                     
            //         }}
            //             key={idx}>
            //                 <video style={{
            //                         height: "20vh",
            //                         width:"20vw",
            //                         marginBottom: "3rem"
            //                     }}
            //                     src={database.reels.videoId.videoUrl}
            //                     loop autoPlay
            //                     muted={true}
            //                     controls={false}
            //                     // onClick={handleMuted}
            //                 ></video>
                          
            //             </div>)
            //         })
            //     } 
            //     </div>
            // </div>

        </div>
    )


}

export default Profile;