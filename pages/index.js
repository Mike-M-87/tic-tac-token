import { useEffect, useState } from "react"
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split, useMutation, useSubscription } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { CREATE_GAME, LOBBY_SUBSCRIPTION } from "../graphql/queries.js";
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

  const { loading, error, data } = useSubscription(
    LOBBY_SUBSCRIPTION
  )


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
                    <tr class="odd:bg-white even:bg-slate-100">
                      <td>{id}</td>
                      <td>${stake}</td>
                      <td>
                        {players.map((player, index) => (
                          <span>{player.name}</span>
                        ))}
                      </td>
                      <td><button className="btn btn-info btn-sm">Join</button></td>
                    </tr>
                  ))}
                </tbody>
              }
            </table>
          </div>

          <div>

            <form onSubmit={(e) =>{
              e.preventDefault()
              CreateNewGame({ variables: { name: e.target["name"].value, stake: e.target["stake"].value } });
            }}>
              <button className="btn btn-dark" type="submit">Create</button>
              <div class="form-floating my-3">
                <input type="number" class="form-control" id="stake" placeholder="Enter Stake Prize" required />
                <label htmlFor="stake">Stake</label>
              </div>
              <div className="form-floating my-3">
                <input type="text" class="form-control" id="name" placeholder="Enter your name" required />
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
    </>
  )
}

