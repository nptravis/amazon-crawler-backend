import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { connect } from "./utils/db";
import productRouter from "./resources/products/product.router";
import { json, urlencoded, bodyParser } from "body-parser";

const port = 3000;
const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../build")));
}

app.use(cors());
app.use(morgan("dev"));
app.use(json());
// app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/ping", function(req, res) {
  res.send("pong");
});

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://github.com");
  await page.screenshot({ path: "screenshots/github.png" });

  browser.close();
}

app.use("/products", productRouter);

// always keep this as the last route, to catch all undefined routes
app.post("*", function(req, res) {
  res.status(404).send("Resource not found.");
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
