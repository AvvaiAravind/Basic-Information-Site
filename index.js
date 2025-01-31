import fs from "fs";
import { createServer } from "http";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080;
const HOSTNAME = "localhost";
const fsPromises = fs.promises;

const serveFile = async (filePath, response) => {
  try {
    const data = await fsPromises.readFile(filePath, "utf8");
    response.writeHead(filePath.includes("404.html") ? 400 : 200, {
      "Content-Type": "text/html",
    });
    response.end(data);
  } catch (error) {
    console.error(error);
    response.statusCode = 500;
    response.end();
  }
};

const server = createServer((req, res) => {
  console.log(req.url, req.method);
  const url = req.url;
  let filePath;

  switch (url) {
    case "/":
    case "/index":
      filePath = path.join(__dirname, "/index.html");
      break;
    case "/about":
      filePath = path.join(__dirname, "/about.html");
      break;
    case "/contact-me":
      filePath = path.join(__dirname, "/contact-me.html");
      break;
    default:
      filePath = path.join(__dirname, "/404.html");
      break;
  }
  serveFile(filePath, res);
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server is running at https://${HOSTNAME}:${PORT}/`);
});
