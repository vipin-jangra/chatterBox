import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.DOMAIN || 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const userSocketMap = new Map();

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (!userId) {
      socket.disconnect();
      return;
    }

    userSocketMap.set(userId, socket.id);
    
    io.emit('onlineUser', Array.from(userSocketMap.keys()));

    socket.on('sendFriendRequest', (data) => {
      const receiverSocketId = userSocketMap.get(data.receiver);
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('friendRequestNotification', {
          sender: data,
          message: 'You got a new frnd request!',
        });
      }
    });

    socket.on('message',(data)=>{
      const receiverSocketId = userSocketMap.get(data.receiver);

      socket.emit('newMessage', {
        ...data,
      });

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('newMessage', {
          ...data,
        });
      }
    })


    socket.on('disconnect', () => {
      userSocketMap.forEach((value, key) => {
        if (value === socket.id) {
          userSocketMap.delete(key);
        }
      });
     
      io.emit('onlineUser', Array.from(userSocketMap.keys()));
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on PORT :${port}`);
  });
});
