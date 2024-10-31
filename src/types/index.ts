export type FigmaConfig = {
  /** Scale factor for the exported image, defaults to 1 if not provided */
  scale?: number;
  /** Format of the exported image, can be "svg", "png", or "jpg" */
  format?: "svg" | "png" | "jpg";
  /** Personal access token for Figma API authentication */
  token: string;
  /** ID of the Figma file containing assets */
  fileId: string;
  /** Name of the page within the Figma file where assets are located */
  pageName: string;
  /** Local path where assets should be saved */
  assetsPath: string;
  /** Optional: Name of the frame within the page for targeted asset extraction */
  frameName?: string;
};

export type FigmaNode = {
  id: string;
  name: string;
  visible: boolean;
  type: string;
  scrollBehavior: string;
  blendMode: string;
  children: FigmaNode[];
};

export type FigmaUser = {
  id: string;
  email: string;
  handle: string;
  img_url: string;
};

export type FigmaFrameInfo = {
  nodeId: string;
  name: string;
  backgroundColor: string;
  pageId: string;
  pageName: string;
};

export type FigmaComponent = {
  key: string;
  file_key: string;
  node_id: string;
  thumbnail_url: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  containing_frame: FigmaFrameInfo | {};
  user: FigmaUser;
};

export type FigmaComponentSet = {
  key: string;
  file_key: string;
  node_id: string;
  thumbnail_url: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  containing_frame: FigmaFrameInfo | {};
};

export type FigmaFile = {
  name: string;
  role: string;
  lastModified: string;
  editorType: string;
  thumbnailUrl: string;
  version: string;
  document: FigmaNode;
  schemaVersion: 0;
  mainFileKey: string;
  components: Record<string, FigmaComponent>; //{ [key: string]: FigmaComponent };
  componentSets: Record<string, FigmaComponentSet>; //{ [key: string]: FigmaComponentSet };
};

export type FigmaAsset = {
  id: string;
  name: string;
};

export type FigmaImage = {
  err: string;
  images: Record<string, string>;
  status: number;
};
