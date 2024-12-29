import { FigmaAssetExporter } from "./figma";

(async () => {
  const figmaExporter = new FigmaAssetExporter({
    token: "access_token", // Access token for Figma API authentication
    pageName: "⛳  Icons", // The name of the page to use within the Figma file
    assetsPath: "assets/", // Folder path that you want to store assets
    fileId: "aoYFvJICwPNqjPQNrUCcIO", // The ID of the Figma file
  });

  const assets = await figmaExporter.getAssets(["1314-464"]); // node-id
  const results = await figmaExporter.exportAssets(assets);
  await figmaExporter.saveAssets(results);
})();
