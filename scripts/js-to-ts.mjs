import { rename } from "fs/promises";
import { fdir } from "fdir";

const args = process.argv;
if (args.length !== 3) {
  throw Error("Usage: node script/css-purger [dir]");
}

const arg = args[2];

const api = new fdir()
  .withBasePath()
  .exclude((dirName) => {
    return (
      dirName.startsWith(".") ||
      dirName.startsWith("node_modules") ||
      dirName.startsWith("scripts")
    );
  })
  .filter((path, _) => {
    path = path.replace("./", "");
    return (
      !path.startsWith(".") &&
      path.split("/").length > 1 &&
      (path.endsWith(".jsx") || path.endsWith(".js"))
    );
  })
  .crawl(arg);

const files = await api.withPromise();

const renames = [];
for (const v of files) {
  let newname = "";
  if (v.endsWith(".jsx")) {
    newname = v.replace(".jsx", ".tsx");
  } else if (v.endsWith(".js")) {
    newname = v.replace(".js", ".ts");
  }

  renames.push(rename(v, newname));
}

await Promise.all(renames).catch((e) => {
  console.err(e);
});
