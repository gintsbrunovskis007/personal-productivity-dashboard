import { readFile } from "node:fs/promises";
import db from "../database/db.js";

export default async function tasksRoute(req, res) {
  if (req.url === "/task" && req.method === "GET") {
    try {
      const html = await readFile("../public/task/index.html");
      res.writeHead(200, {
        "Content-Type": "text/html",
      });
      res.end(html);
      return true;
    } catch (err) {
      console.error(err);
      res.writeHead(500);
      return res.end(err.message);
    }
  }

  if (req.method === "GET" && req.url === "/task/script.js") {
    try {
      const javascript = await readFile("../public/task/script.js");
      res.writeHead(200, { "Content-Type": "text/javascript" });
      res.end(javascript);
      return true;
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
    return true;
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
    return true;
  }

  if (req.method === "DELETE" && req.url.startsWith("/api/tasks/")) {
    const id = req.url.split("/").pop();
    db.run("DELETE FROM tasks WHERE id = ?", [id], function (err) {
      if (err) {
        console.log(err);
        res.writeHead(500);
        res.end(err.message);
        return;
      }
      res.writeHead(204);
      res.end();
    });
    return true;
  }

  return false;
}
