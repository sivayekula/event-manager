export const typeDefs = `#graphql
  scalar Date

  enum RSVPStatus {
    GOING
    MAYBE
    NOT_GOING
    INVITED
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Tag {
    id: ID!
    name: String!
  }

  type Attendee {
    id: ID!
    name: String!
    email: String
  }

  type Event {
    id: ID!
    title: String!
    date: String!
    creatorId: ID!
    tags: [Tag!]!
    attendees: [Attendee!]!
    attendeeCount: Int!
  }

  type RSVP {
    eventId: ID!
    attendeeId: ID!
    status: RSVPStatus!
    updatedAt: String!
  }

  type Query {
    events: [Event!]!
    event(id: ID!): Event
    tags: [Tag!]!
  }

  type AuthPayload {
    id: ID!
    name: String!
    email: String!
  }

  input CreateEventInput {
    title: String!
    date: String!
    tagNames: [String!]
    creatorId: ID!
  }

  input AddAttendeeInput {
    eventId: ID!
    name: String!
    email: String
  }

  type Mutation {
    login(email: String!): AuthPayload!
    createEvent(input: CreateEventInput!): Event!
    addAttendee(input: AddAttendeeInput!): Event!
    removeAttendee(eventId: ID!, attendeeId: ID!): Event!
    updateRSVP(eventId: ID!, attendeeId: ID!, status: RSVPStatus!): RSVP!
  }
`;