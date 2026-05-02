import Image from "next/image";
import Link from "next/link";
import { Header, Event} from "@/types";

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

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {header && (
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
              {header.Title}
            </h1>
            <div className="w-24 h-1.5 bg-indigo-600 mx-auto rounded-full opacity-80"></div>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
          {events.map((event: Event) => (
            <Link 
              href={`/events/${event.documentId}`} 
              key={event.documentId}
              className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 hover:-translate-y-1.5"
            >
              {event.Images && event.Images.length > 0 ? (
                <div className="relative w-full h-64 overflow-hidden bg-slate-200">
                  <Image
                    src={process.env.NEXT_PUBLIC_STRAPI_API_URL + event.Images[0].url} 
                    alt={event.Title} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ) : (
                <div className="w-full h-64 bg-slate-100 flex items-center justify-center">
                  <span className="text-slate-400">No image available</span>
                </div>
              )}
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {event.Title}
                  </h2>
                </div>
                
                <div className="space-y-3 mt-auto pt-4 border-t border-slate-100">
                  <div className="flex items-center text-sm text-slate-600 font-medium">
                    <svg className="w-5 h-5 mr-3 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="truncate">{event.Location}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-slate-600 font-medium">
                    <svg className="w-5 h-5 mr-3 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span>{event.EventDate}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-slate-600 font-medium">
                    <svg className="w-5 h-5 mr-3 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <span className="truncate">{event.organizer.Name}</span>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <span className="lowercase">published at {formatPublishDate(event.publishedAt)}</span>
                  <span className="text-indigo-600 group-hover:translate-x-1 transition-transform inline-block">View Event &rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {events.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100 mt-8">
            <h3 className="text-lg font-medium text-slate-900">No events found</h3>
            <p className="mt-2 text-slate-500">Check back later for upcoming events.</p>
          </div>
        )}
      </div>
    </main>
  );
}
