"use client";
import { gql, useQuery } from "@apollo/client";
import { EventCard } from "../../components/EventCard";
import { EVENTS } from "../../graphql/query";

export default function EventsPage() {
  const { data, loading, error, refetch } = useQuery(EVENTS);
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      {data.events.length === 0 ? (
        <div className="card">No events yet. <a className="underline" href="/events/new">Create one</a>.</div>
      ) : (
        data.events.map((ev: any) => <EventCard key={ev.id} event={ev} />)
      )}
      <button className="btn" onClick={() => refetch()}>Refresh</button>
    </div>
  );
}