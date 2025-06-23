import express from "express"
import handlebars from "express-handlebars"
import __dirname from "./utils.js"
import viewsRouter from "./routes/views.router.js"
import { Server } from "socket.io"

const app = express();
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const httpServer = app.listen(port, () => {
    console.log("Servidor activo: " + port);
});
const socketServer = new Server(httpServer);
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use("/", viewsRouter);

const mensajes = [];
const generarId = () => (mensajes.length + 1);
socketServer.on("connection", socket => {
    socket.on("nuevoUsuario", usuario => {
        socket.broadcast.emit("nuevoUsuario", usuario);
        socket.emit("messageLogs", mensajes);
    })

    socket.on("message", message => {        
        const mensaje = {id:generarId(), usuario:message.usuario, texto:message.texto};
        mensajes.push(mensaje);
        socket.emit("messageLogs", mensajes);
    })
});