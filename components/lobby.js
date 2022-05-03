import React, { useEffect, useState } from "react"
import { myIp, serverPort, USERID } from "../constants"


export default function Lobby({ wsocket, data }) {
  
  async function CreateGame(e) {
    e.preventDefault()
    let API_URL = `http://${myIp}:${serverPort}/create`;

    const data = JSON.stringify({
      userId: localStorage.getItem(USERID),
      amount: parseFloat(e.target["stake"].value),
    });

    const payload = {
      method: "post",
      body: data,
      mode: "cors",
      headers: {
        Authorization: `Bearer <<JWT STUFF GO HERE>>`,
        "Content-Type": "application/json",
        "Content-Length": data.length,
      },
    };

    const rbody = await fetch(API_URL, payload);
    let parsedResp = rbody.json();
  }

  
  async function JoinGame(gameId) {
    let subMessage = JSON.stringify({
      event: "sub.game",
      gameid: gameId,
    });
    wsocket.send(subMessage);
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
                  <th>Host</th>
                  <th>Play</th>
                </tr>
              </thead>
              {data &&
                <tbody>
                  {data.map(({ Stauts, GameID, HostUserId, StakedAmount }) => (
                    <tr key={GameID}>
                      <td>{GameID}</td>
                      <td>${StakedAmount}</td>
                      <td>{HostUserId}</td>
                      <td><button className="btn btn-info btn-sm" onClick={(e) => JoinGame(GameID)}>Join</button></td>
                    </tr>
                  ))}</tbody>}
            </table>
          </div>

          <div>
            <form className="mt-1" onSubmit={(e) => CreateGame(e)}>
              <button className="btn btn-dark" type="submit">Create</button>
              <div className="form-floating my-3">
                <input type="number" className="form-control" id="stake" placeholder="Enter Stake Prize" required />
                <label htmlFor="stake">Stake</label>
              </div>
            </form>
          </div>

        </div>
      </main>
    </>
  )
}

