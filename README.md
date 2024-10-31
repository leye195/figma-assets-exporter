# Figma Assets Exporter

package for exporting assets from Figma API

## How to get figma access token?

- https://www.figma.com/developers/api?fuid=1432579692283177650#access-tokens

## Examples

```
import { FigmaAssetExporter } from "./figma";

(async () => {
  const figmaExporter = new FigmaAssetExporter({
    token: "figma access token",
    pageName: "All icons",
    assetsPath: "assets/", // folder path that you want to store assets
    fileId: "mgKaQN0rrDKx9FrfbtNJE0", // figma fileId
  });

  const assets = await figmaExporter.getAssets(["489-220448"]); // node-id
  const results = await figmaExporter.exportAssets(assets);
  await figmaExporter.saveAssets(results);
})();


```
