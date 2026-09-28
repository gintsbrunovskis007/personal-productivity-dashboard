import http from "node:http";
import { readFile } from "node:fs/promises";

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  if (req.url === "/" && req.method === "GET") {
    try {
      const html = await readFile("./index.html", "utf8");
      res.writeHead(200, {
        "Content-Type": "text/html",
      });
      res.end(html);
    } catch (error) {
      console.error(error);
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end("Internal Server Error!");
    }
    return;
  }

  if (req.url === "/app.js") {
    const javascript = await readFile("app.js");
    res.writeHead(200, { "Content-Type": "text/javascript" });
    res.end(javascript);
    return;
  }

  res.writeHead(404, {
    "Content-Type": "text/plain",
  });
  res.end("Not Found!");
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
