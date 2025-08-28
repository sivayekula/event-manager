import { gql } from "@apollo/client";

export const EVENTS = gql`
  query Events {
    events {
      id
      title
      date
      attendeeCount
      tags { id name }
    }
  }
`;

export const EVENT = gql`
  query Event($id: ID!) {
    event(id: $id) {
      id
      title
      date
      attendeeCount
      tags { id name }
      attendees { id name email }
    }
  }
`;

export const ADD_ATTENDEE = gql`
  mutation AddAttendee($input: AddAttendeeInput!) {
    addAttendee(input: $input) {
      id
      attendeeCount
      attendees { id name email }
    }
  }
`;

export const REMOVE_ATTENDEE = gql`
  mutation RemoveAttendee($eventId: ID!, $attendeeId: ID!) {
    removeAttendee(eventId: $eventId, attendeeId: $attendeeId) {
      id
      attendeeCount
      attendees { id name email }
    }
  }
`;