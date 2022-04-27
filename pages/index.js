import { useEffect, useState } from "react"
import { ApolloClient, ApolloProvider, gql, HttpLink, InMemoryCache, split, useMutation, useQuery, useSubscription } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { CREATE_GAME, JOIN_GAME, LOBBY_QUERY, LOBBY_SUBSCRIPTION } from "../graphql/queries.js";
import { getMainDefinition } from "@apollo/client/utilities";
import Head from "next/head";
import Styles from '../styles/Home.module.css'


const wsLink = process.browser ? new WebSocketLink({ // if you instantiate in the server, the error will be thrown
  uri: `ws://localhost:8080/query`,
  options: {
    reconnect: true,
  }
}) : null;

const httplink = new HttpLink({
  uri: 'http://localhost:8080/query',
  credentials: 'same-origin'
});


const link = process.browser ? split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httplink,
) : httplink;

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

export default function Game() {

  return (
    <ApolloProvider client={client}>
      <Home />
    </ApolloProvider>
  )
}

export function Home() {
  const [mainboard, setBoard] = useState(Array(9).fill("."))
  const [current, setCurrent] = useState("X")

  const [lobby, setLobby] = useState([])
  const winstates = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

  function Play(e) {
    let idx = e.target.value
    let board = [...mainboard]
    board[idx] = current

    e.target.disabled = true
    setBoard(board)

    if (!CheckWin(board, current) && !board.includes(".")) {
      alert("Game Draw")
      window.location.reload(false)
    }

    if (current == "X") {
      setCurrent("O")
    }
    else {
      setCurrent("X")
    }
  }

  function CheckWin(cboard, move) {
    winstates.forEach(s => {
      let count = 0
      s.forEach(v => {
        if (cboard[v] == move) {
          count = count + 1
        }
      })
      if (count >= 3) {
        alert("Player " + current + "  Wins")
        window.location.reload(false)
      }
    });
    return false
  }


  const [CreateNewGame] = useMutation(CREATE_GAME)
  const [JoinGame] = useMutation(JOIN_GAME)

  function OpenModal(n) {
    document.getElementById('exampleModalLabel').innerHTML = "Play With " + n;
  }


  // const { data, loading, error, subscribeToMore } = useQuery(LOBBY_QUERY);

  // subscribeToMore({
  //   document: LOBBY_SUBSCRIPTION,
  //   updateQuery: (prev, { subscriptionData }) => {
  //     if (!subscriptionData.data) return prev;
  //     const newData = subscriptionData.data.lobby;
  //     return newData
  //   }
  // });

  const { loading, error, data } = useSubscription(LOBBY_SUBSCRIPTION, {
    onSubscriptionData: ({ data }) => {
      console.log(data);
    }
  })


  return (
    <>
      <main className="container-fluid">
        <p>{error ? "data error" : ""}</p>
        <p>{loading ? "data loading" : ""}</p>
        <p>{data ? "data success" : ""}</p>

        <div className="d-flex flex-wrap justify-content-around align-items-start">
          <div className="flex-grow-1 mx-5">
            <h3>LOBBY</h3>
            <table className="table table-striped text-light table-dark">
              <thead>
                <tr>
                  <th>Game ID</th>
                  <th>Stake Prize</th>
                  <th>Player</th>
                  <th>Play</th>
                </tr>
              </thead>
              {data &&
                <tbody>
                  {data.lobby.map(({ id, stake, players }, index) => (
                    <tr key={id}>
                      <td>{index}</td>
                      <td>${stake}</td>
                      <td>
                        {players.map((player, index) => (
                          <span key={index}>{player.name}</span>
                        ))}
                      </td>
                      <td><button
                        className="btn btn-info btn-sm"
                        data-id={id}
                        // data-bs-toggle="modal" data-bs-target="#joinModal"
                        onClick={(e) => {
                          e.preventDefault()
                          // OpenModal(players[0].name)
                          JoinGame({ variables: { gameId: id, playername: "mike" } })
                        }} >Join</button></td>
                    </tr>
                  ))}
                </tbody>
              }
            </table>
          </div>

          <div>

            <form onSubmit={(e) => {
              e.preventDefault()
              CreateNewGame({ variables: { player: e.target["name"].value, stake: e.target["stake"].value } });
            }}>
              <button className="btn btn-dark" type="submit">Create</button>
              <div className="form-floating my-3">
                <input type="number" className="form-control" id="stake" placeholder="Enter Stake Prize" required />
                <label htmlFor="stake">Stake</label>
              </div>
              <div className="form-floating my-3">
                <input type="text" className="form-control" id="name" placeholder="Enter your name" required />
                <label htmlFor="name">Name</label>
              </div>
            </form>

            <div className="grid-container">
              {
                mainboard.map((value, index) => (
                  <button key={index} onClick={(e) => Play(e)} className="grid-item" value={index}>{value}</button>
                ))
              }
            </div>
          </div>
        </div>
      </main>

      <div className="modal fade" id="joinModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Join</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-floating my-3">
                  <input type="text" className="form-control" id="name2" placeholder="Enter your Name" required />
                  <label htmlFor="name2">Enter your Name</label>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Join</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

