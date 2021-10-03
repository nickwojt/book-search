import { gql } from "@apollo/client";

export const GET_ME = gql`
  query getme($userId: ID!) {
    me(userId: $userId) {
      _id
      username
      savedBooks
    }
  }
`;
