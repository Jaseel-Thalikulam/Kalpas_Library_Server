import express, { Application } from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { CLIENT_URL, MONGODB_URL, PORT } from "./constants";
import routes from "./routes/index";
const { bookRoute, borrowRoute, libraryRoute, userRoute } = routes;
import cron from './util/cron'
//Creating instance of express
const app: Application = express();

// CORS setup
const corsOptions = {
  origin: CLIENT_URL,
  methods: "GET,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


//Routes
app.use("/api/users", userRoute);
app.use("/api/books", bookRoute);
app.use("/api/libraries", libraryRoute);
app.use("/api/borrow", borrowRoute);

//MongoDB Config
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err: Error) => {
    console.error(err);
  });

app.listen(PORT, () => {
  console.log(`Server running@${PORT}`);
});


cron

export default app;
