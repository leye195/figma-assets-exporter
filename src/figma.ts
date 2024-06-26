import axios, { AxiosInstance } from "axios";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { dirname, resolve } from "path";
import { stringify } from "qs";
import type { FigmaAsset, FigmaConfig, FigmaFile, FigmaImage } from "./types";

const baseURL = "https://api.figma.com/v1";

export type AssetsFromFigmaFile = {
  fileId?: string;
  pageName?: string;
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
  private _clientInstance?: AxiosInstance;

  constructor(config: FigmaConfig) {
    this._config = {
      ...config,
      format: "svg",
      scale: 1,
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

  getAssets(ids?: string[]) {
    return this.getAssetsFromFigmaFile({
      fileId: this._config.fileId,
      pageName: this._config.pageName,
      frameName: this._config.frameName,
      ids,
    });
  }

  private async getAssetsFromFigmaFile({
    fileId,
    pageName,
    frameName,
    ids,
  }: AssetsFromFigmaFile = {}): Promise<FigmaAsset[]> {
    if (!this._clientInstance) {
      throw new Error("Need to create instance first!");
    }

    try {
      const queryString = stringify(
        {
          ids: ids?.join() ?? null,
        },
        {
          skipNulls: true,
        }
      );

      const res = await this._clientInstance?.get(
        `/files/${fileId}?${queryString}`
      );
      const data: FigmaFile = res.data;
      const page = data.document.children.find(
        (child) => child.name === pageName
      );

      if (!page) throw new Error("Cannot find Assets Page!");

      let assetArray = page.children;

      if (frameName) {
        assetArray =
          assetArray.find((asset) => asset.name === frameName)?.children ??
          assetArray;
      }

      const assets = assetArray.flatMap((asset) => {
        if (asset.children && asset.children.length > 0) {
          return asset.children.map(({ id, name }) => {
            return { id, name };
          });
        }

        return [{ id: asset.id, name: asset.name }];
      });

      return assets;
    } catch (error) {
      console.error(error);
      return [];
    }
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

      const res = await this._clientInstance.get(
        `/images/${this._config.fileId}?${queryString}`
      );
      const data: FigmaImage = res.data;

      // Map or object?
      const results = assets.map((asset) => ({
        format,
        image: data.images[asset.id],
        name: asset.name,
      }));

      return results;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  saveAssets(assets: ExportFigmaAsset[]) {
    assets.forEach((asset) => this.saveAsset(asset));
  }

  async saveAsset(asset: ExportFigmaAsset) {
    const config = { ...this._config };
    const { name, image, format } = asset;

    const imagePath = resolve(config.assetsPath, `${name}.${format}`);
    const directory = dirname(imagePath);
    const writer = createWriteStream(imagePath);

    if (!existsSync(directory)) {
      mkdirSync(directory, {
        recursive: true,
      });
    }

    const response = await axios({
      url: image,
      responseType: "stream",
    });
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  }
}

export default FigmaAssetExporter;
