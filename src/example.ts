import { FigmaAssetExporter } from "./figma";

(async () => {
  const figmaExporter = new FigmaAssetExporter({
    token: "access token",
    pageName: "All icons",
    assetsPath: "assets/", // folder path that you want to store assets
    fileId: "mgKaQN0rrDKx9FrfbtNJE0", // figma fileId
  });

  const assets = await figmaExporter.getAssets(["489-220448"]); // node-id
  const results = await figmaExporter.exportAssets(assets);
  await figmaExporter.saveAssets(results);
})();
