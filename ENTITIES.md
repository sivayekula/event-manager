# ENTITIES

## User
- id: string (unique identifier, UUID)
- name: string
- email: string (unique)
- createdAt: date (ISO string)

**Notes:** Users create/manage Events. Not every Attendee is a User.

## Event
- id: string (UUID)
- title: string
- date: date (ISO string)
- creatorId: string (references User.id)
- tagIds: string[] (references Tag.id)
- attendeeIds: string[] (references Attendee.id)
- createdAt: date (ISO)
- updatedAt: date (ISO)

**Indexes/Considerations:**  
- Index on `date` for sorting upcoming events.  
- Composite index `(creatorId, date)` for listing events by user.

## Tag
- id: string (UUID)
- name: string (unique, case-insensitive)

**Considerations:**  
- Normalize to avoid duplicates; store lowercase for uniqueness.

## Attendee
- id: string (UUID)
- name: string
- email: string | null (optional, not unique globally)
- createdAt: date (ISO)

**Notes:**  
Attendees are not Users. They can attend multiple events.

## RSVP (Join Entity)
Represents an attendee's status *for a specific event*.

- eventId: string (references Event.id)
- attendeeId: string (references Attendee.id)
- status: enum { INVITED, GOING, MAYBE, NOT_GOING }
- updatedAt: date (ISO)

**Keys/Constraints:**  
- Composite unique key `(eventId, attendeeId)`.  
- Index on `(eventId, status)` for quick counts and filters.

## Relationships

- **User 1–N Event**: A user creates many events (`Event.creatorId -> User.id`)
- **Event N–M Tag**: via `Event.tagIds` referencing Tag ids (in a relational DB you'd use an EventTag join table)
- **Event N–M Attendee**: via `RSVP` join (or `Event.attendeeIds` + separate RSVP table)
- **Attendee N–M Event**: via `RSVP`

## Assumptions

- Attendee emails are optional; two attendees can share the same email (e.g., family) unless business rules forbid.  
- Tags are globally deduplicated by case-insensitive `name`.  
- Deleting an Event cascades to remove RSVPs; Attendees can be orphaned or soft-deleted depending on product needs.  
- Timezone handling is done on the client; server stores ISO UTC.