import { FigmaAssetExporter } from "./figma";

(async () => {
  const figmaExporter = new FigmaAssetExporter({
    token: "access token",
    pageName: "❖ Icongraphy",
    assetsPath: "assets/",
    fileId: "3uSQpEeQnvkYWonbL0XGn3",
  });

  const assets = await figmaExporter.getAssets(["838-2908"]);
  const results = await figmaExporter.exportAssets(assets);
  await figmaExporter.saveAssets(results);
})();
