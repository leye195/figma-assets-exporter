import { FigmaAssetExporter } from "./figma";

(async () => {
  const figmaExporter = new FigmaAssetExporter({
    token: "FIGMA_ACCESS_TOKEN",
    pageName: "PAGE_NAME",
    assetsPath: "assets/",
    fileId: "FIGMA_FILE_ID",
  });

  const assets = await figmaExporter.getAssets(["838-2908"]);
  const results = await figmaExporter.exportAssets(assets);
  figmaExporter.saveAssets(results);
})();
