import http from "node:http";
import { readFile } from "node:fs/promises";
import tasksRoute from "./routes/tasks.js";

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  if (await tasksRoute(req, res)) {
    return;
  }

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

  res.writeHead(404, {
    "Content-Type": "text/plain",
  });
  return res.end("Not Found!");
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
