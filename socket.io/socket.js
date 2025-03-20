import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: [
      "http://localhost:5173",
      "https://shoob-estate-ocou.vercel.app",
    ],
  },
});

let onlineUsers = [];
console.log(onlineUsers);

const addUser = (userID, socketId) => {
  console.log("Adding user:", { userID, socketId });
  const existingUser = onlineUsers.find((user) => user.userID === userID);
  if (!existingUser) {
    onlineUsers.push({ userID, socketId });
    console.log("Updated online users:", onlineUsers);
  } else {
    console.log("User already exists");
  }
};

const getUser = (userID) => {
  console.log("onlineUser 1", onlineUsers[0]);
  const receiver = onlineUsers.find((user) => user.userID === userID);
  console.log("userID getting in getUser: ", userID);
  console.log(receiver);
  return receiver;
};

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("newUser", (userID) => {
    console.log("New user connected:", userID);
    addUser(userID, socket.id);
    console.log("Current online users:", onlineUsers);
  });

// In socket.js
socket.on("sendMessage", ({ receiverID, chatID, message }) => {
  console.log("Received sendMessage event");
  console.log("receiverID:", receiverID);
  console.log("chatID:", chatID);
  console.log("message:", message);
  
  const receiver = getUser(receiverID);
  console.log("Found receiver:", receiver);
  
  if (receiver) {
    console.log("Emitting getMessage to socket:", receiver.socketId);
    io.to(receiver.socketId).emit("getMessage", {
      message,
      chatID,
      senderID: socket.id,
    });
    console.log("Message emitted");
  } else {
    console.log("Receiver not found in online users");
  }
});

  socket.on("disconnect", () => {
    console.log("User disconnected with socket id: ", socket.id);
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id); // remove user from connection
    console.log("Current online users:", onlineUsers);
  });
});

io.listen(process.env.PORT || 5000);
console.log("Socket server running on port 5000");

