import axios, { type AxiosInstance } from "axios";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { dirname, resolve } from "path";
import { stringify } from "qs";
import type { FigmaAsset, FigmaConfig, FigmaFile, FigmaImage } from "./types";

const baseURL = "https://api.figma.com/v1";

/**
 * Represents the structure for extracting SVG assets from a Figma file.
 * @param fileId - The unique identifier for the Figma file containing the SVGs.
 * @param pageName - The name of the page within the Figma file where SVGs are located.
 * @param frameName - Optional. The name of the frame within the page to narrow down SVG extraction.
 * @param ids - Optional. Specific node IDs within the frame to target particular SVG assets.
 */
export type AssetsFromFigmaFile = {
  fileId: string;
  pageName: string;
  frameName?: string;
  ids?: string[];
};

export type ExportFigmaAsset = {
  name: string;
  format: string;
  image: string;
};

export class FigmaAssetExporter {
  private _config: FigmaConfig & Required<Pick<FigmaConfig, "format">>;
  private _clientInstance: AxiosInstance;

  constructor(config: FigmaConfig) {
    this._config = {
      format: "svg",
      scale: 1,
      ...config,
    };
    this._clientInstance = this.createClientInstance(this._config.token);
  }

  private createClientInstance(token: string) {
    const instance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        "X-Figma-Token": token,
      },
    });
    return instance;
  }

  private async getAssetsFromFigmaFile({
    fileId,
    pageName,
    frameName,
    ids,
  }: AssetsFromFigmaFile): Promise<FigmaAsset[]> {
    try {
      const queryString = stringify(
        {
          ids: ids?.join() ?? null,
        },
        {
          skipNulls: true,
        }
      );
      const res = await this._clientInstance.get<FigmaFile>(
        `/files/${fileId}?${queryString}`
      );
      const data = res.data;
      const page = data.document.children.find(
        (child) => child.name === pageName
      );

      if (!page) {
        throw new Error("Cannot find Assets Page!");
      }

      let assetArray = page.children;

      if (frameName) {
        assetArray =
          assetArray.find((asset) => asset.name === frameName)?.children ??
          assetArray;
      }

      const assets = assetArray
        .flatMap((asset) => (asset.children?.length ? asset.children : [asset]))
        .map(({ id, name }) => ({ id, name }));

      return assets;
    } catch (error) {
      console.error("Error fetching assets from Figma file:", error);
      return [];
    }
  }

  getAssets(ids?: string[]): Promise<FigmaAsset[]> {
    return this.getAssetsFromFigmaFile({
      fileId: this._config.fileId,
      pageName: this._config.pageName,
      frameName: this._config.frameName,
      ids,
    });
  }

  async exportAssets(assets: FigmaAsset[]): Promise<ExportFigmaAsset[]> {
    try {
      if (!this._clientInstance) {
        throw new Error("Need to create instance first!");
      }

      const format = this._config.format;
      const ids = assets.map((asset) => asset.id).join() || null;
      const queryString = stringify(
        {
          ids,
          format,
          scale: this._config.scale,
        },
        {
          skipNulls: true,
        }
      );

      const res = await this._clientInstance.get<FigmaImage>(
        `/images/${this._config.fileId}?${queryString}`
      );
      const data = res.data;

      return assets.map((asset) => ({
        format,
        image: data.images[asset.id],
        name: asset.name,
      }));
    } catch (error) {
      console.error("Error exporting assets:", error);
      return [];
    }
  }

  async saveAssets(assets: ExportFigmaAsset[]) {
    await Promise.all(assets.map((asset) => this.saveAsset(asset)));
  }

  async saveAsset(asset: ExportFigmaAsset) {
    const { name, image, format } = asset;
    const imagePath = resolve(this._config.assetsPath, `${name}.${format}`);
    const directory = dirname(imagePath);

    if (!existsSync(directory)) {
      mkdirSync(directory, {
        recursive: true,
      });
    }

    const writer = createWriteStream(imagePath);
    const response = await axios({
      url: image,
      responseType: "stream",
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", (error) => {
        console.error(`Error saving asset ${name}:`, error);
        reject(error);
      });
    });
  }
}

export default FigmaAssetExporter;
