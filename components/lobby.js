import Link from "next/link";
import React, { useEffect, useState } from "react"
import { createGameURL, DetailsURL, myIp, serverPort, USERID, USERNAME, USERTOKEN } from "../constants"
import { _makeRequest } from "./network";




export default function Lobby({ wsocket, data }) {
  const [searchTerm, setSearch] = useState('')
  const [details, setDetails] = useState(null)

  async function CreateGame(e) {
    e.preventDefault()
    const body = {
      userId: localStorage.getItem(USERID),
      amount: parseFloat(e.target["stake"].value),
      username: localStorage.getItem(USERNAME)
    };

    const response = await _makeRequest({ url: createGameURL, reqBody: body })
    if (response.success) {
      window.location.assign("/join/" + response.body.GameID)
    } else {
      alert(response.errorMessage)
    }
  }

  const searcher = (arr, filterKey) => {
    return arr.filter((obj) => JSON.stringify(obj).includes(filterKey));
  }

  useEffect(() => {
    async function GetDetails() {
      const body = {
        token: localStorage.getItem(USERTOKEN),
      };
      const response = await _makeRequest({ url: DetailsURL, reqBody: body })
      if (response.success) {
        setDetails(response.body)
      } else {
        alert(response.errorMessage)
      }
    }

    GetDetails()
  }, [])

  return (
    <>
      <main className="container-fluid">

        <div className='gap-3 d-flex justify-content-end align-items-center'>
          <span class="material-icons">face</span>

          <div className='text-start p-1'>
            <h6>{details && details.username}</h6>
            <span className="text-muted">${details && details.balance}</span>
          </div>
          <button className="btn btn-dark btn-sm" onClick={(e) => { localStorage.clear(); window.location.reload() }}>Logout</button>
        </div>


        <div className="d-lg-flex gap-3 justify-content-around align-items-start">

          <form onSubmit={(e) => CreateGame(e)}>
            <button className="btn btn-dark my-2" type="submit">Create</button>
            <div className="form-floating">
              <input type="number" className="form-control" id="stake" placeholder="Enter Stake Prize" required />
              <label htmlFor="stake">Stake</label>
            </div>
          </form>


          <div className="flex-grow-1">
            <h3>LOBBY</h3>
            <form>
              <input className="form-control my-3" type="search" placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
            </form>

            <div className="table-responsive">
              <table className="table table-hover table-striped table-dark">
                <thead className="table-warning">
                  <tr>
                    <th>Game ID</th>
                    <th>Stake Prize</th>
                    <th>Host</th>
                    <th>Play</th>
                  </tr>
                </thead>
                {data &&
                  <tbody>
                    {searcher(data, searchTerm).map(({ Status, GameID, HostUserId, HostUserName, StakedAmount }) => (
                      <tr key={GameID}>
                        <td>{GameID}</td>
                        <td>${StakedAmount}</td>
                        <td>{HostUserName}</td>
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

        </div>
      </main>
    </>
  )
}

