const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const playerRouter = require("./routes/playerRoutes");
const matchRouter = require("./routes/matchRoutes");
const scoreCardRouter = require("./routes/scoreCardRoutes");
const teamRouter = require("./routes/teamRoutes");
const YouTubeRouter = require("./routes/YouTubeRoutes");
const UploadImages = require("./routes/uploadImages");
const app = express();

app.use("/uploads", express.static("uploads"));
app.use(express.json());

mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


mongoose.connection.on("connected", () => {
  console.log("Connected to database");
});

const swaggerUi = require('swagger-ui-express')
swaggerDocument = require('./swagger.json');

app.use(
  '/api-docs',
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument)
);  

app.use("/api/user", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/player", playerRouter);
app.use("/api/match", matchRouter); // show player name
app.use("/api/scoreCard", scoreCardRouter); // show player name
app.use("/api/team", teamRouter); // show player name
app.use("/api/youtube", YouTubeRouter);
app.use("/api/upload", UploadImages);

app.get("/", (req, res) => {
  res.send("Welcome to Cric Streamer Backend App.");
});
app.listen(process.env.PORT, () =>
  console.log(`Listening on port ${process.env.PORT}!`)
);
