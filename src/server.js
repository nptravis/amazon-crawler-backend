import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { connect } from "./utils/db";

const port = 3000;
const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../build")));
}

app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/ping", function(req, res) {
  res.send("pong");
});

// always keep this as the last route, to catch all undefined routes and redirect home
app.get("*", function(req, res) {
  res.redirect("/");
});

export const start = async () => {
  try {
    await connect();
    app.listen(port, () => {
      console.log(`Server listening on on http://localhost:${port}`);
    });
  } catch (e) {
    console.error(e);
  }
};
