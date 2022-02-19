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
  mutation createInvitation($inviteeUsername: String!) {
  createInvitation(inviteeUsername: $inviteeUsername) {
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
export const CREATE_GAME_MUTATION = gql`
  mutation createGame($invitationId: ID!, $inviteeColor: String!) {
    createGame(invitationId: $invitationId, inviteeColor: $inviteeColor) {
      gameId
      playerOne
      playerTwo
      turn
    }
}`;