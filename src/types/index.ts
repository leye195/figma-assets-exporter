export type FigmaConfig = {
  scale?: number;
  format?: "svg" | "png" | "jpg";
  token: string;
  fileId: string;
  pageName: string;
  assetsPath: string;
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
  components: { [key: string]: FigmaComponent };
  componentSets: { [key: string]: FigmaComponentSet };
};

export type FigmaAsset = {
  id: string;
  name: string;
};

export type FigmaImage = {
  err: string;
  images: { [key: string]: string };
  status: number;
};
