import React, { useEffect, useState } from "react"
import { myIp, serverPort, USERID } from "../constants"
import Board from "./board"



export default function Lobby({ data }) {
  const [matches, setMatches] = useState([])

  useEffect(() => {
    if (data) {
      const currentMatches = [...matches]
      for (const match of Object.entries(data)) {
        currentMatches.push(match)
      }
      setMatches(currentMatches)
    }
  }, [])


  async function createGame(e) {
    e.preventDefault()

    let API_URL = `http://${myIp}:${serverPort}/create`;

    const data = JSON.stringify({
      userId: localStorage.getItem(USERID),
      amount: e.target["stake"].value,
    });

    const payload = {
      method: "post",
      body: data,
      mode: "no-cors",
      headers: {
        Authorization: `Bearer <<JWT STUFF GO HERE>>`,
        "Content-Type": "application/json",
        "Content-Length": data.length,
      },
    };

    console.log(payload);
    
    const rbody = await fetch(API_URL, payload);
    let parsedResp = rbody.json;
    console.log(parsedResp);
  }


  function OpenModal(n) {
    document.getElementById('exampleModalLabel').innerHTML = "Play With " + n;
  }

  return (
    <>
      <main className="container-fluid">
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
              {matches &&
                <tbody>
                  {matches.map(({ id, stake, players }, index) => (
                    <tr key={id}>
                      <td>{index}</td>
                      <td>${stake}</td>
                      <td>
                        {players.map((player, index) => (
                          <span key={index}>{player.name}</span>
                        ))}
                      </td>
                      <td><button className="btn btn-info btn-sm">Join</button></td>
                    </tr>
                  ))}</tbody>}
            </table>
          </div>

          <div>
            <form className="mt-1" onSubmit={(e) => createGame(e)}>
              <button className="btn btn-dark" type="submit">Create</button>
              <div className="form-floating my-3">
                <input type="number" className="form-control" id="stake" placeholder="Enter Stake Prize" required />
                <label htmlFor="stake">Stake</label>
              </div>
            </form>
            <Board />
          </div>

        </div>
      </main>
    </>
  )
}

