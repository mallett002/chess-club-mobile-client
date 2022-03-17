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
      opponentUsername
      playerOne
      playerTwo
      turn
	  }
  }
`;

export const UPDATE_BOARD_MUTATION = gql`
  mutation updateBoard($gameId: ID!, $cell: String!) {
      updateBoard(gameId: $gameId, cell: $cell) {
        gameId
        playerOne
        playerTwo
        turn
        moves {
          color
          from
          to
          flags
          piece
          san
        }
        positions {
          type
          color
          label
        }
      }
    }
`;

export const BOARD_UPDATED_SUBSCRIPTION = gql`
  subscription boardUpdated($gameId: ID!) {
    boardUpdated(gameId: $gameId) {
      gameId
      moves {
        color
        from
        to
        flags
        piece
        san
      }
      opponentUsername
      playerOne
      playerTwo
      positions {
        type
        color
        label
      }
      status
      turn
    }
  }
`

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

export const GET_BOARD_QUERY = gql`
  query GetBoard($gameId: ID!){
    getBoard(gameId: $gameId) {
      gameId
      moves {
        color
        from
        to
        flags
        piece
        san
      }
      opponentUsername
      playerOne
      playerTwo
      positions {
        type
        color
        label
      }
      status
      turn
    }
  }
`;
