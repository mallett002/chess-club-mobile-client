import { gql } from '@apollo/client';

export const INVITATIONS_QUERY = gql`
  query GetInvitations {
    getInvitations {
      invitations {
        invitationId
        invitee
      }
      inboundGameRequests {
        invitationId
        invitor
      }
    }
  }
`;

// Todo: get opponentUsername & playerId for turn in this CURRENT_GAMES_QUERY:
/*
  {
    gameId: ID!
    playerOne: ID!
    playerTwo: ID!
    turn: ID!
    opponentUsername: String!
  }
*/
export const CURRENT_GAMES_QUERY = gql`
  query GetGames($playerId: ID!){
    getGames(playerId: $playerId) {
      gameId
      playerOne
      playerTwo
      turn
	  }
  }
`;

export const CREATE_INVITATION_MUTATION = gql`
  mutation createInvitation($inviteeUsername: String!, $invitorColor: InvitorColor!) {
  createInvitation(inviteeUsername: $inviteeUsername, invitorColor: $invitorColor) {
    invitationId
    invitor {
      playerId
      username
    }
    invitee {
      playerId
      username
    }
  }
}
`;

export const DELETE_INVITATION_MUTATION = gql`
  mutation deleteInvitation($invitationId: ID!) {
    deleteInvitation(invitationId: $invitationId)
  }
`;

export const CREATE_GAME_MUTATION = gql`
  mutation createGame($invitationId: ID!) {
    createGame(invitationId: $invitationId) {
      gameId
      playerOne
      playerTwo
      turn
    }
}`;
