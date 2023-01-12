const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
mongoose.set('strictQuery', false);

//myedits

// const fs = require("fs")
// var privateKey = fs.readFileSync('/etc/letsencrypt/live/ycyclass.com/privkey.pem', 'utf8');
// var certificate = fs.readFileSync('/etc/letsencrypt/live/ycyclass.com/fullchain.pem', 'utf8');

const server = require("http").Server(app);
const io = require("socket.io")(server);
const StuddentRequests = require("./models/StudentModel");
io.on("connection", async (socket) => {
  socket.on("join-room", async (roomId, userId) => {
    if (!io.sockets.adapter.rooms.get(roomId) || io.sockets.adapter.rooms.get(roomId).size < 2) {
      socket.join(roomId);
      const data = await StuddentRequests.findOne({ url: roomId }, "sdata tdata");
      if (data) {
        socket.to(roomId).emit("user-connected", userId, JSON.stringify({ tdata: data.tdata }));
      } else {
        socket.to(roomId).emit("user-connected", userId, JSON.stringify({ tdata: "" }));
      }
     
      // messages
      socket.on("message", (message) => {
        socket.to(roomId).emit("createMessage", message);
      });
      
      socket.on("user-check", () => {
        if (io.sockets.adapter.rooms.get(roomId)) {
          socket.emit("user-check-result", io.sockets.adapter.rooms.get(roomId).size);
        }
      })
      socket.on("end-check", () => {
        if (io.sockets.adapter.rooms.get(roomId)) {
          socket.emit("end-check-result", io.sockets.adapter.rooms.get(roomId).size);
        }
      })
      socket.on("end_room", () => {
        socket.to(roomId).emit("end_meet");
      })
      socket.on("disconnect", async () => {
        socket.to(roomId).emit("user-disconnected", userId);
          await StuddentRequests.deleteOne({ url: roomId });
      });
    }
  });
});
const { PeerServer } = require('peer');
const peerServer = PeerServer({
  port: 4001,
  path: '/peerjs',
  // ssl: {
  //   key: privateKey,
  //   cert: certificate
  // }
});
//


dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {}).then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
