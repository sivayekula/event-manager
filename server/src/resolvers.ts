import { v4 as uuid } from "uuid";

type RSVPStatus = "GOING" | "MAYBE" | "NOT_GOING" | "INVITED";

type User = { id: string; name: string; email: string; };
type Tag = { id: string; name: string; };
type Attendee = { id: string; name: string; email?: string | null; };
type Event = {
  id: string;
  title: string;
  date: string; // ISO
  creatorId: string;
  tagIds: string[];
  attendeeIds: string[];
};

type RSVP = {
  eventId: string;
  attendeeId: string;
  status: RSVPStatus;
  updatedAt: string;
};

// In-memory store
const users: Record<string, User> = {};
const tags: Record<string, Tag> = {};
const attendees: Record<string, Attendee> = {};
const events: Record<string, Event> = {};
// RSVP indexed by eventId+attendeeId
const rsvps: Record<string, RSVP> = {};

function ensureTag(name: string): Tag {
  const key = name.trim().toLowerCase();
  let existing = Object.values(tags).find(t => t.name.toLowerCase() === key);
  if (existing) return existing;
  const tag: Tag = { id: uuid(), name };
  tags[tag.id] = tag;
  return tag;
}

// seed a default user
const defaultUser: User = { id: uuid(), name: "Admin User", email: "admin@example.com" };
users[defaultUser.id] = defaultUser;

export const resolvers = {
  Query: {
    events: () => Object.values(events).map(materializeEvent),
    event: (_: any, { id }: { id: string }) => {
      const ev = events[id];
      return ev ? materializeEvent(ev) : null;
    },
    tags: () => Object.values(tags),
  },
  Event: {
    attendees: (parent: any) => parent.attendees,
    tags: (parent: any) => parent.tags,
    attendeeCount: (parent: any) => parent.attendees.length
  },
  Mutation: {
    login: (_: any, { email }: any) => {
      const user = Object.values(users).find(u => u.email === email);
      if(!user) throw new Error("user not found")
      return user;
    },
    createEvent: (_: any, { input }: any) => {
      const { title, date, tagNames = [], creatorId } = input;
      if (!users[creatorId]) throw new Error("creatorId not found");
      const tagObjs: Tag[] = tagNames.map((n: string) => ensureTag(n));
      const ev: Event = {
        id: uuid(),
        title,
        date: new Date(date).toISOString(),
        creatorId,
        tagIds: tagObjs.map(t => t.id),
        attendeeIds: []
      };
      events[ev.id] = ev;
      return materializeEvent(ev);
    },
    addAttendee: (_: any, { input }: any) => {
      const { eventId, name, email } = input;
      const ev = events[eventId];
      if (!ev) throw new Error("event not found");
      const at: Attendee = { id: uuid(), name, email };
      attendees[at.id] = at;
      ev.attendeeIds.push(at.id);
      // default RSVP invited
      const key = `${eventId}:${at.id}`;
      rsvps[key] = { eventId, attendeeId: at.id, status: "INVITED", updatedAt: new Date().toISOString() };
      return materializeEvent(ev);
    },
    removeAttendee: (_: any, { eventId, attendeeId }: { eventId: string; attendeeId: string; }) => {
      const ev = events[eventId];
      if (!ev) throw new Error("event not found");
      ev.attendeeIds = ev.attendeeIds.filter(id => id !== attendeeId);
      delete attendees[attendeeId];
      delete rsvps[`${eventId}:${attendeeId}`];
      return materializeEvent(ev);
    },
    updateRSVP: (_: any, { eventId, attendeeId, status }: { eventId: string; attendeeId: string; status: RSVPStatus; }) => {
      if (!events[eventId]) throw new Error("event not found");
      if (!attendees[attendeeId]) throw new Error("attendee not found");
      const key = `${eventId}:${attendeeId}`;
      rsvps[key] = { eventId, attendeeId, status, updatedAt: new Date().toISOString() };
      return rsvps[key];
    }
  }
};

function materializeEvent(ev: Event) {
  return {
    ...ev,
    tags: ev.tagIds.map(id => tags[id]).filter(Boolean),
    attendees: ev.attendeeIds.map(id => attendees[id]).filter(Boolean)
  };
}

export function seedDemoData() {
  const team = ensureTag("Team Offsite");
  const internal = ensureTag("Internal");
  const kickoff: Event = {
    id: uuid(),
    title: "Q4 Kickoff",
    date: new Date(Date.now() + 86400000).toISOString(),
    creatorId: Object.values(users)[0].id,
    tagIds: [team.id, internal.id],
    attendeeIds: []
  };
  events[kickoff.id] = kickoff;
}