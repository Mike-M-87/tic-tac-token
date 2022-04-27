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
    $name:String!
    $stake:Float!
    ) {
    createGame(input: { player: { name: $name },stake:$stake }) {
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
