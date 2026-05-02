import Image from "next/image";
import Link from "next/link";

type ImageFormat = {
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

type EventImage = {
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
type Organizer = {
  id: number;
  documentId: string;
  Name: string;
  ContactEmail: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

type Event = {
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
 
type Header = {
  id: number;
  documentId: string;
  Title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

const formatPublishDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return new Date(date).toLocaleDateString("en-US", options);
};

export default async function Home() {
  const [resEvents, resHeader] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/events?populate=*`),
    fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/page-header`)
  ])

  const { data: header } : { data: Header } = await resHeader.json()
  const { data: events } : { data: Event[] } = await resEvents.json()
  
  console.dir(events, { depth: null })
  console.dir(header, { depth: null })
  
  return (
    <div>
      {header && (
        <h1> {header.Title} </h1>
      )}
      {events.map((event: Event) => (
        <Link href={`/events/${event.Slug}`} key={event.id}>
          <h1> {event.Title} </h1>
          {event.Images && event.Images.length > 0 && (
            <Image
              key={event.id}
              src={process.env.NEXT_PUBLIC_STRAPI_API_URL + event.Images[0].url} 
              alt={event.Title} 
              width={event.Images[0].formats.small?.width || event.Images[0].width}
              height={event.Images[0].formats.small?.height || event.Images[0].height}
              
            />
          )}
            
            <div className="text-blue-500">{event.Location}</div>
            <div className="text-green-500">{event.EventDate}</div>
            <div className="text-red-500">{event.organizer.Name}</div>
            <p>{formatPublishDate(event.publishedAt)}</p>
            
          
        </Link>
      ))}
    </div>
  );
}
