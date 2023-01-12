let socket;
let videoGrid = document.getElementById("video-grid");;
let myPeer;
let myVideoStream;
let myVideo;
let devicesId = [];
const peers = {};
let videos = {};
let myCall;
let videoDevices = [];
let labelDevices = [];
let selectedid = 0;
let tsname = document.getElementById("tsname");
let tsvalue = document.getElementById("tsvalue");
let stylevalue = '180deg';
function intialise() {
    socket = io("/");

    myPeer = new Peer(undefined, {
        path: "/peerjs",
        // host: "/",
        // port: "443",


        host: window.location.hostname,
        port: "4001"
    });
    myVideo = document.createElement("video");
    myVideo.id = "myvid";
    myVideo.style.transform=`rotateY(${stylevalue})`
    myVideo.muted = true;
    navigator.mediaDevices
        .getUserMedia({
            video: (videoDevices[selectedid] ? { deviceId: videoDevices[selectedid] } : true),
            audio: true,
        })
        .then((stream) => {
            myVideoStream = stream;
            addVideoStream(myVideo, stream);
            myPeer.on("call", (call) => {
                call.answer(stream);
                let video = document.createElement("video");
                myCall = call;
                peers[myCall.provider._id] = myCall;
                videos[myCall.provider._id] = video;
                call.on("stream", (userVideoStream) => {
                    video = videos[myCall.provider._id] ? videos[myCall.provider._id] : video;
                    addVideoStream(video, userVideoStream);
                });
                call.on("close", () => {
                    video.remove();
                    if (videoGrid.children.length == 1) {
                        end_meet();
                    }
                });
            });
            socket.on("user-connected", (userId, data) => {
                connectToNewUser(userId, stream);
                try {
                    if (data) {
                        let tdata = JSON.parse(data);
                        tdata = JSON.parse(tdata.tdata);
                        usimage = tdata.photo;
                        usname = tdata.name;
                        console.log(tdata)
                        name_up("Teacher");
                    }
                } catch (err) {
                    console.group(err);
               }
            });
            socket.emit("user-check");
            socket.on("user-check-result", (no) => {
                if (no && no == 2) {
                    if (videoGrid.children.length === 2) {
                        let mmamaa = setInterval(() => {
                            socket.emit("end-check");
                            socket.on("end-check-result", (no) => {
                                if (no>=2) {
                                } else {
                                    end_meet();
                                }
                            })
                         }, 2000);
                    } else {
                        socket.disconnect();
                        [...videoGrid.children].forEach(elem => elem.remove());
                        intialise();
                    }
                }
            });
            // input value
            let text = $("input");
            // when press enter send message
            $("html").keydown(function (e) {
                if (e.which == 13 && text.val().length !== 0) {
                    socket.emit("message", text.val());
                    document.getElementById("main__chat_window").insertAdjacentHTML("beforeend", ` <div class="userrsent"><p>${text.val()}</p><div class="usersentimage"><img src="/img/users/${myimage}" alt="" srcset="" /></div></div>`);
                    text.val("");
                }
            });
            socket.on("createMessage", (message) => {
                document.getElementById("main__chat_window").insertAdjacentHTML("beforeend", `<div class="usersent"><div class="usersentimage"><img src="/img/users/${usimage}" alt="" srcset="" /></div><p>${message}</p></div>`);
                document.getElementById("shownewchat").style.display = "block";
                scrollToBottom();
            });
        }).catch(err => {
            alert("Video Permission Error.")
        });
    socket.on("end_meet", () => {
        console.log("meet ended");
        end_meet();
    })
    socket.on("user-disconnected", (userId) => {
        if (peers[userId]) {
            peers[userId].close();
        };
    });
    myPeer.on("open", (id) => {
        socket.emit("join-room", ROOM_ID, id);
    });
    socket.on("received_data_info", (data) => {
        console.log(data);
    })
}

function connectToNewUser(userId, stream) {
    myCall = myPeer.call(userId, stream);
    let video = document.createElement("video");
    myCall.on("stream", (userVideoStream) => {
        video = videos[myCall.provider._id] ? videos[myCall.provider._id] : video;
            addVideoStream(video, userVideoStream);
    });
    myCall.on("close", () => {
        video.remove();
        if (videoGrid.children.length == 1) {
            end_meet();
        }
    });

    peers[userId] = myCall;
}

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
    });
    videoGrid.append(video);
    if (videoGrid.children.length > 2) {
        videos.forEach(userid => {
            if (peers[userid] && !(peers[userid]._open)) {
                videos[userid].remove();
            }
            if (videoGrid.children.length > 2) {
                videoGrid.children[0].remove();
            }
        });
    }
    if (videoGrid.children.length == 2) {
        if (socket) {
            socket.emit("get_data", ROOM_ID);
        }
    }
}
const scrollToBottom = () => {
    var d = $(".main__chat_window");
    d.scrollTop(d.prop("scrollHeight"));
};

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
};

const playStop = () => {
    console.log("object");
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    } else {
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
};

const setMuteButton = () => {
    const html = `<i class="fas fa-microphone"></i>`;
    document.querySelector(".main__mute_button").innerHTML = html;
};

const setUnmuteButton = () => {
    const html = `<i class="unmute fas fa-microphone-slash"></i>`;
    document.querySelector(".main__mute_button").innerHTML = html;
};

const setStopVideo = () => {
    const html = `<i class="fas fa-video"></i>`;
    document.querySelector(".main__video_button").innerHTML = html;
};

const setPlayVideo = () => {
    const html = `<i class="stop fas fa-video-slash"></i>`;
    document.querySelector(".main__video_button").innerHTML = html;
};
const chatBtn = document.querySelector("#chat-btn");
const chatDiv = document.querySelector(".main__right");
const showChat = () => {
    let elem = document.getElementsByClassName("main_video_chat")[0];
    elem.style.display = "block";
    elem.style.animationName = "videoout";
    document.getElementById("shownewchat").style.display = "none";
};
const closechat = () => {
    let elem = document.getElementsByClassName("main_video_chat")[0];
    elem.style.animationName = "videoon";
    elem.addEventListener("animationend", check_end_anima);

}
function check_end_anima() {
    let elem = document.getElementsByClassName("main_video_chat")[0];
    elem.style.display = "none";
    elem.removeEventListener("animationend", check_end_anima);
}
window.onbeforeunload = function (event) {
    event.preventDefault();
    if (socket) {
        socket.emit("end_room");
        socket.disconnect();
    }
}

function start_chat() {
    let elem = document.getElementById("chat_message");
    if (elem.value) {
        socket.emit("message", elem.value);
        document.getElementById("main__chat_window").insertAdjacentHTML("beforeend", ` <div class="userrsent"><p>${elem.value}</p><div class="usersentimage"><img src="/img/users/${myimage}" alt="" srcset="" /></div></div>`);
        elem.value = "";
    }
}
function end_meet() {
    socket.emit("end_room");
    socket.disconnect();
    if (window.location.href.indexOf("student-call") == -1) {
        window.location = "/teacher-request";
    } else {
        window.location = "/student-call-request";
    }
}
videoGrid.addEventListener("click", (event) => {
    let target = document.elementFromPoint(event.pageX, event.pageY);
    if (target) {
        if (videoGrid.children.length == 2 && videoGrid.children[1] == target) {
            videoGrid.append(videoGrid.children[0]);
        }
    }
})
async function cameraList() {
    navigator.mediaDevices.enumerateDevices().then(devices => {
        devices.forEach(device => {
            if (device.kind == "videoinput") {
                videoDevices.push(device.deviceId);
                labelDevices.push(device.label);
                if (device.label.indexOf("facing back") != -1) {
                    selectedid = labelDevices.length - 1;
                    stylevalue = '0deg';
                }
            }
        });
        intialise();
    })
}
cameraList();
let facemode = {
    exact: "environment"
};
// function changeCamera() {
//     if (videoDevices.length > 0) {
//         if (selectedid == videoDevices.length - 1) {
//             selectedid = 0;
//         } else {
//             selectedid++;
//         }
//         if (myCall) {
//             let taa = myCall.peerConnection.getSenders();
//             let ww;
//             taa.forEach(t => {
//                 if (t.track.kind == "video") {
//                     ww = t;
//                 }
//             })
//             navigator.mediaDevices.getUserMedia({ video: { deviceId: videoDevices[selectedid] } }).then(stream => {
//                 console.log(labelDevices[selectedid])
//                 if (labelDevices[selectedid].indexOf("facing front") == -1) {
//                     myVideo.style.transform = 'rotateY(0deg)';
//                 } else {
//                     myVideo.style.transform = 'rotateY(180deg)';
//                 }
//                 myVideoStream.getVideoTracks()[0].stop();
//                 ww.replaceTrack(stream.getVideoTracks()[0]);
//                 myVideo.srcObject = stream;
//                 myVideoStream.removeTrack(myVideoStream.getVideoTracks()[0]);
//                 myVideoStream.addTrack(stream.getVideoTracks()[0]);
//             })
//         } else {
//             navigator.mediaDevices.getUserMedia({ video: { deviceId: videoDevices[selectedid] } }).then(stream => {
//                 console.log(labelDevices[selectedid])
//                 if (labelDevices[selectedid].indexOf("facing front") == -1) {
//                     console.log("chnged");
//                     myVideo.style.transform = 'rotateY(0deg)';
//                 } else {
//                     myVideo.style.transform = 'rotateY(180deg)';
//                 }
//                 myVideoStream.getVideoTracks()[0].stop();
//                 myVideo.srcObject = stream;
//                 myVideoStream.removeTrack(myVideoStream.getVideoTracks()[0]);
//                 myVideoStream.addTrack(stream.getVideoTracks()[0]);
//             })
//         }

//     }
// };
let hide = true;
document.getElementById("hide_video_button").addEventListener("click", (event) => {
    if (hide) {
        document.getElementById("hide_video_button").innerHTML = "<i class='fas fa-eye-slash'></i>";
        videoGrid.children[1].style.display = "none";
        hide = false;
    } else {
        document.getElementById("hide_video_button").innerHTML = "<i class='fas fa-eye'></i>";
        videoGrid.children[1].style.display = "block";
        hide = true;

    }
});
window.onload = function () {
    if (window.location.href.indexOf("student-call") == -1) {
        name_up("Student");
    }
}
function name_up(val) {
    let tsname = document.getElementById("tsname");
    let tsvalue = document.getElementById("tsvalue");
    let tsimg = document.getElementById("tsimg");
    tsname.innerHTML = usname;
    tsimg.src =`/img/users/${usimage}`;
    tsvalue.innerHTML = val;
}