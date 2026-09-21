import { StaticRouter } from "react-router-dom";
import { renderToPipeableStream } from "react-dom/server";
import { PassThrough } from "node:stream";
import App from "./App";
export async function render(url) {
  return new Promise((resolve, reject) => {
    let html = "";
    const stream = new PassThrough();
    stream.on("data", (chunk) => (html += chunk.toString()));
    stream.on("end", () => resolve(html));
    stream.on("error", reject);
    const rendering = renderToPipeableStream(
      <StaticRouter location={url}>
        <App />
      </StaticRouter>,
      {
        onAllReady() {
          rendering.pipe(stream);
        },
        onError(error) {
          reject(error);
        },
      },
    );
  });
}
