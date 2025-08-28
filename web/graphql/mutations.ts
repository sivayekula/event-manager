
import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation login($email: String!) {
    login(email: $email) {
      id
      email
    }
  }
`;

const CREATE_EVENT = gql`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) { id }
  }
`;
