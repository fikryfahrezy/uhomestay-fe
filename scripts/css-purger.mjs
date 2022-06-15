import { writeFile } from "fs/promises";
import { PurgeCSS } from "purgecss";
import { fdir } from "fdir";

const args = process.argv;
if (args.length !== 3) {
  throw Error("Usage: node script/css-purger [dir]");
}

const arg = args[2];

const api = new fdir()
  .withBasePath()
  .group()
  .filter((path, _) => {
    return path.endsWith("index.jsx") || path.endsWith("Styles.module.css");
  })
  .crawl(arg);
const files = await api.withPromise();

const formatedFiles = [];
for (const v in files) {
  const newFile = {
    index: "",
    css: "",
  };

  const f = files[v];
  if (f.length !== 2) {
    formatedFiles.push(newFile);
    continue;
  }

  const [eitherCss, eitherIndex] = f;

  if (
    eitherCss.endsWith("Styles.module.css") &&
    eitherIndex.endsWith("index.jsx")
  ) {
    newFile.index = eitherIndex;
    newFile.css = eitherCss;
    formatedFiles.push(newFile);
    continue;
  }

  newFile.index = eitherCss;
  newFile.css = eitherIndex;
  formatedFiles.push(newFile);
}

const purgeCSSResult = await Promise.all(
  formatedFiles.map(({ index, css }) => {
    if (index === "" || css === "") {
      const prom = Promise.resolve([
        {
          css: "",
          file: "",
        },
      ]);
      return prom;
    }

    const purged = new PurgeCSS().purge({
      content: [index],
      css: [css],
    });
    return purged;
  })
).catch((e) => {
  console.log(e);
});

await Promise.all(
  purgeCSSResult.map(([{ file, css }]) => {
    if (file !== "" && css !== "") {
      return writeFile(file, css);
    }
    return Promise.resolve(undefined);
  })
);
