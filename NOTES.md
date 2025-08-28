# NOTES

- **In-memory storage** is used for simplicity; restarting the server resets data.
- `createEvent` requires a `creatorId`. For the assignment, the server seeds a default User. The UI will call the login route and fetch the default user and stores it in zustand store; the server validates against the seeded user.
- Validation is intentionally minimal (Yup in the "Create Event" form). You can extend it easily.
- Mutations in the Event detail page refetch the Event query for simplicity; can be improved with Apollo cache updates and optimistic UI.
- Styling is intentionally minimal with Tailwind utility classes.
- App Router is used (`/app` directory). Pages implemented:
  - `/events` — list events
  - `/events/new` — create event
  - `/events/[id]` — event details + attendee management
- Known limitations:
  - Not implemented proper Authentication and Authroization
  - No pagination or search on events.
  - Tags are created on-the-fly when adding an event.
  - RSVP management UI not exposed; mutation exists (`updateRSVP`).