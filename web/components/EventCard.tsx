import Link from "next/link";

export function EventCard({ event }: { event: any }) {
  const date = new Date(event.date).toLocaleString();
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{event.title}</h3>
          <p className="text-sm text-gray-600">{date}</p>
          {event.tags?.length ? (
            <div className="mt-2 flex gap-2 flex-wrap">
              {event.tags.map((t: any) => (
                <span key={t.id} className="text-xs bg-gray-100 rounded-full px-2 py-1 border">{t.name}</span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="text-sm">Attendees: <b>{event.attendeeCount}</b></div>
      </div>
      <div className="mt-4">
        <Link className="btn btn-primary" href={`/events/${event.id}`}>View Details</Link>
      </div>
    </div>
  );
}