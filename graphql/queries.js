import { gql, useMutation } from "@apollo/client";

export const LOBBY_SUBSCRIPTION = gql`
subscription {
  lobby {
    id
    board
    players {
      name
    }
    winner {
      name
    }
    stake
  }
}
`

export const CREATE_GAME = gql`
  mutation CreateGane(
    $player:String!
    $stake:Float!
    ) {
    createGame(input: { player: { name: $player },stake:$stake }) {
      id
      board
      players {
        name
      }
      winner {
        name
      }
      stake
    }
  }`

export const JOIN_GAME = gql`
  mutation JoinGame(
    $gameId:String!
    $playername:String!
  ) {
    joinGame(input: { gameId: $gameId, player: { name: $playername } }) {
      id
      board
      players {
        name
      }
      winner {
        name
      }
      stake
    }
  }
`

export const LOBBY_QUERY = gql`
  {
    lobby {
      id
      stake
      winner {
        name
      }
      players {
        name
      }
      board
    }
  }
`;