import http from "node:http";
import { readFile } from "node:fs/promises";
import db from "./database/db.js";

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  if (req.url === "/" && req.method === "GET") {
    try {
      const html = await readFile("./index.html", "utf8");
      res.writeHead(200, {
        "Content-Type": "text/html",
      });
      return res.end(html);
    } catch (err) {
      console.error(err);
      res.writeHead(500);
      return res.end(err.message);
    }
  }

  if (req.url === "/app.js") {
    try {
      const javascript = await readFile("app.js");
      res.writeHead(200, { "Content-Type": "text/javascript" });
      return res.end(javascript);
    } catch (err) {
      console.error(err);
      res.writeHead(500);
      return res.end(err.message);
    }
  }

  if (req.url === "/task" && req.method === "GET") {
    try {
      const html = await readFile("../public/task/index.html");
      res.writeHead(200, {
        "Content-Type": "text/html",
      });
      return res.end(html);
    } catch (err) {
      console.error(err);
      res.writeHead(500);
      return res.end(err.message);
    }
  }

  if (req.url === "/task/script.js") {
    try {
      const javascript = await readFile("../public/task/script.js");
      res.writeHead(200, { "Content-Type": "text/javascript" });
      return res.end(javascript);
    } catch (err) {
      console.error(err);
      res.writeHead(500);
      return res.end(err.message);
    }
  }

  if (req.method === "POST" && req.url === "/api/tasks") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      let task;
      try {
        const data = JSON.parse(body);
        task = data.title;
      } catch (err) {
        console.log(err);
        res.writeHead(500);
        return res.end(err.message);
      }
      db.run("INSERT INTO tasks (title) VALUES (?)", [task], (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          return res.end(err.message);
        }
        res.writeHead(200);
        res.end();
      });
    });
    return;
  }

  if (req.method === "GET" && req.url === "/api/tasks") {
    db.all("SELECT * FROM tasks", [], (err, rows) => {
      if (err) {
        console.error(err);
        res.writeHead(500);
        return res.end(err.message);
      }
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      return res.end(JSON.stringify(rows));
    });
    return;
  }

  res.writeHead(404, {
    "Content-Type": "text/plain",
  });
  return res.end("Not Found!");
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
