import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Event, BlockNode, TextNode } from '@/types'

const formatPublishDate = (date: Date | string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("en-US", options);
};

function renderTextNode(node: TextNode | any, index: number) {
  if (node.type !== 'text') {
    if (node.type === 'list-item') {
       return <li key={index} className="text-slate-700 leading-relaxed mb-1">{node.children?.map((child: any, i: number) => renderTextNode(child, i))}</li>;
    }
    return <span key={index}>{node.children?.map((child: any, i: number) => renderTextNode(child, i))}</span>;
  }

  let content: React.ReactNode = node.text;
  if (node.bold) content = <strong key={index} className="font-bold text-slate-900">{content}</strong>;
  if (node.italic) content = <em key={index}>{content}</em>;
  if (node.underline) content = <u key={index} className="underline decoration-indigo-300 underline-offset-2">{content}</u>;
  if (node.strikethrough) content = <del key={index} className="text-slate-400">{content}</del>;
  if (node.code) content = <code className="bg-slate-100 text-indigo-600 rounded-md px-1.5 py-0.5 text-sm font-mono" key={index}>{content}</code>;
  
  return <React.Fragment key={index}>{content}</React.Fragment>;
}

function renderBlockNode(block: BlockNode | any, index: number) {
  switch (block.type) {
    case 'paragraph':
      if (block.children?.length === 1 && block.children[0].text === "") {
        return <br key={index} />;
      }
      return <p key={index} className="mb-6 text-slate-700 leading-relaxed text-lg">{block.children?.map((child: any, i: number) => renderTextNode(child, i))}</p>;
    case 'heading':
      const level = block.level || 2;
      const Tag = `h${level}` as keyof JSX.IntrinsicElements;
      const classes = {
        1: 'text-4xl md:text-5xl font-extrabold text-slate-900 mt-12 mb-6 tracking-tight',
        2: 'text-3xl font-bold text-slate-900 mt-10 mb-5 tracking-tight',
        3: 'text-2xl font-bold text-slate-900 mt-8 mb-4 tracking-tight',
        4: 'text-xl font-bold text-slate-900 mt-6 mb-4',
        5: 'text-lg font-bold text-slate-900 mt-6 mb-3',
        6: 'text-base font-bold text-slate-900 mt-6 mb-3',
      }[level as 1|2|3|4|5|6];
      return <Tag key={index} className={classes}>{block.children?.map((child: any, i: number) => renderTextNode(child, i))}</Tag>;
    case 'list':
      const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
      const listClasses = block.format === 'ordered' ? 'list-decimal pl-6 mb-8 space-y-2 text-lg marker:text-slate-500 marker:font-semibold' : 'list-disc pl-6 mb-8 space-y-2 text-lg marker:text-indigo-400';
      return (
        <ListTag key={index} className={listClasses}>
          {block.children?.map((child: any, i: number) => renderTextNode(child, i))}
        </ListTag>
      );
    case 'quote':
      return (
        <blockquote key={index} className="border-l-4 border-indigo-500 pl-6 italic my-8 text-slate-600 bg-indigo-50/50 py-5 pr-5 rounded-r-2xl text-lg font-medium">
          {block.children?.map((child: any, i: number) => renderTextNode(child, i))}
        </blockquote>
      );
    case 'image':
      if (block.image) {
        return (
           <div key={index} className="my-10 relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-md group">
             <Image 
               src={process.env.NEXT_PUBLIC_STRAPI_API_URL + block.image.url} 
               alt={block.image.alternativeText || 'Event image'} 
               fill 
               className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
             />
             {block.image.caption && (
               <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12 text-center text-white text-sm font-medium">
                 {block.image.caption}
               </div>
             )}
           </div>
        )
      }
      return null;
    default:
      return <div key={index} className="mb-6">{block.children?.map((child: any, i: number) => renderTextNode(child, i))}</div>;
  }
}

const EventPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/events/${id}?populate=*`);
  console.log(res);
  const { data: event } : { data: Event } = await res.json();
  
  if (!event) {
    return (
      <main className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Event Not Found</h1>
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">&larr; Back to Events</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 mb-8 transition-colors group">
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to all events
        </Link>
        
        <article className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
          {event.Images && event.Images.length > 0 && (
            <div className="relative w-full h-[45vh] min-h-[350px] max-h-[600px]">
              <Image
                src={process.env.NEXT_PUBLIC_STRAPI_API_URL + event.Images[0].url}
                alt={event.Title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                <div className="flex items-center space-x-4 mb-4 text-sm font-medium text-white/90">
                  <span className="bg-indigo-600/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full uppercase tracking-wider text-xs shadow-sm">Event</span>
                  <span className="flex items-center bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {event.EventDate}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-2 text-white drop-shadow-md">
                  {event.Title}
                </h1>
              </div>
            </div>
          )}
          
          <div className="p-8 md:p-12 lg:p-14">
            <div className="flex flex-wrap items-center justify-between gap-8 pb-10 mb-10 border-b border-slate-100">
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl shadow-sm">
                  {event.organizer?.Name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-0.5">Organized by</p>
                  <p className="text-lg font-bold text-slate-900">{event.organizer?.Name}</p>
                </div>
              </div>
              
              <div className="flex gap-8 flex-wrap">
                <div className="flex items-center text-slate-600">
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-full mr-4 text-indigo-500 shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Location</p>
                    <p className="font-semibold text-slate-900 text-base">{event.Location}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-slate-600">
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-full mr-4 text-indigo-500 shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Contact</p>
                    <a href={`mailto:${event.organizer?.ContactEmail}`} className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors text-base">{event.organizer?.ContactEmail}</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-none">
              {(!event.Images || event.Images.length === 0) && (
                <div className="mb-12 border-b border-slate-100 pb-8">
                  <div className="flex items-center space-x-4 mb-4 text-sm font-medium text-indigo-600">
                    <span className="bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider text-xs">Event</span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {event.EventDate}
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-2">
                    {event.Title}
                  </h1>
                </div>
              )}

              {event.Description?.map((block, index) => renderBlockNode(block, index))}
            </div>
            
            <div className="mt-14 pt-8 border-t border-slate-100 flex justify-between items-center text-sm text-slate-400 font-medium uppercase tracking-wider">
              <span>Published {formatPublishDate(event.publishedAt)}</span>
            </div>
          </div>
        </article>
      </div>
    </main>
  )
}

export default EventPage