import { Server } from "socket.io";
import Redis from "ioredis";

const pub = new Redis({
  host: 'YOUR HOST ID',
  port: 15780,
  username: 'YOUR ID',
  password: 'YOUR PASSWORD'
});
const sub = new Redis({
  host: 'YOUR HOST ID',
  port: 15780,
  username: 'YOUR ID',
  password: 'YOUR PASSWORD'
});

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Init Socket Service...");
    this._io = new Server({
        cors: {
            allowedHeaders: ['*'],
            origin: "*",
        }
    });
    sub.subscribe("MESSAGES");
  }

  public initListeners() {
    const io = this._io;
    console.log("Init Socket Listeners...");
    io.on("connect", (socket) => {
      console.log(`New Socket Connected`, socket.id);

      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New Message Rec.", message);
        // Publish this Message to Redis
        await pub.publish('MESSAGES', JSON.stringify({ message }))
      });
    });

    sub.on('message', (channel, message) => {
      if(channel === 'MESSAGES') {
        io.emit("message", message);
      }
    })
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
