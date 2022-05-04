import Link from "next/link";
import React, { useEffect, useState } from "react"
import { myIp, serverPort, USERID } from "../constants"




export default function Lobby({ wsocket, data }) {
  const [searchTerm, setSearch] = useState('')

  async function CreateGame(e) {
    e.preventDefault()
    let API_URL = `https://${myIp}/create`;
    // let API_URL = `http://${myIp}:${serverPort}/create`;
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
    let parsedResp = await rbody.json();
    window.location.assign("/join/" + parsedResp.GameID)
  }

  const searcher = (arr, filterKey) => {
    return arr.filter((obj) => JSON.stringify(obj).includes(filterKey));
  }

  return (
    <>
      <main className="container-fluid">
        <div className="d-flex flex-wrap justify-content-around align-items-start">

          <div className="mt-4">
            <form onSubmit={(e) => CreateGame(e)}>
              <button className="btn btn-dark" type="submit">Create</button>
              <div className="form-floating my-3">
                <input type="number" className="form-control" id="stake" placeholder="Enter Stake Prize" required />
                <label htmlFor="stake">Stake</label>
              </div>
            </form>
          </div>


          <div className="flex-grow-1 mx-5">
            <h3>LOBBY</h3>
            <form className="d-flex">
              <input className="form-control me-2 my-2" type="search" placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
            </form>

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
                  {searcher(data, searchTerm).map(({ Status, GameID, HostUserId, StakedAmount }) => (
                    <tr key={GameID}>
                      <td>{GameID}</td>
                      <td>${StakedAmount}</td>
                      <td>{HostUserId}</td>
                      <td>
                        <Link href={`/join/${GameID}`}>
                          <button className="btn btn-info btn-sm">Join</button>
                        </Link>
                      </td>
                    </tr>
                  ))}</tbody>}
            </table>
          </div>

        </div>
      </main>
    </>
  )
}

