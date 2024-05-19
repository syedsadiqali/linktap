const fs = require("fs");
const path = require("path");

function getFolderNames(dir, folderNames = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      const hasPageOrRouteFile = fs.readdirSync(filePath).some((fileName) => {
        return fileName === "page.tsx" || fileName === "route.ts";
      });

      if (hasPageOrRouteFile) {
        folderNames.push(`/${file}`);
      }

      getFolderNames(filePath, folderNames);
    }
  }

  return folderNames;
}

const directoryPath = "./src/app";
const allFolderNames = getFolderNames(directoryPath);

let content = {
  folderNames: allFolderNames,
};

const jsonContent = JSON.stringify(content, null, 3);

fs.writeFileSync("reserved_routes.json", jsonContent);
