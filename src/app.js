const path = require('path');
const express = require('express');
const { Server } = require('socket.io');
const handlebars = require("express-handlebars");
const productsRouter = require('./routes/productsRoutes');
const cartsRouter = require('./routes/cartsRoutes');
const homeRouter = require('./routes/homeRoutes');
const ProductManager = require('./managers/productManager');

const PORT = 8080;
const app = express();
const httpServer = app.listen(PORT, () => console.log(`listening on port ${PORT}`))
const io = new Server(httpServer)

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "handlebars")
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "../public")));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", homeRouter)

io.on("connection", async (socket) => {
  console.log("new connection ", socket.id)

  socket.emit("products", await ProductManager.getProducts())

  socket.on("new-product", async(data) => {
    console.log(data)
    await ProductManager.addProduct(data)
    io.emit("products", await ProductManager.getProducts())
  })
})