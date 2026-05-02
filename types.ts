export type ImageFormat = {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
};

export type EventImage = {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  focalPoint: string | null;
  width: number;
  height: number;
  formats: {
    large?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    thumbnail?: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

// A basic text node within a block
export interface TextNode {
  type: 'text';
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

// A block element (like a paragraph or heading)
export interface BlockNode {
  type: 'paragraph' | 'heading' | 'list' | 'quote' | 'image';
  children: TextNode[]; // The actual text content inside the block
  
  // Specific to headings
  level?: 1 | 2 | 3 | 4 | 5 | 6; 
  
  // Specific to lists
  format?: 'ordered' | 'unordered';
  
  // Specific to images
  image?: {
    url: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
  };
}
export type Organizer = {
  id: number;
  documentId: string;
  Name: string;
  ContactEmail: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type Event = {
  id: number;
  documentId: string;
  Title: string;
  Slug: string;
  Description: BlockNode[];
  EventDate: string;
  Location: string;
  Images: EventImage[];
  organizer: Organizer;
  createdAt: string;
  updatedAt: string;
  publishedAt: Date;
};
 
export type Header = {
  id: number;
  documentId: string;
  Title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}