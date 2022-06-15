import Link from "next/link";
import React, { useEffect, useState } from "react"
import { createGameURL, DetailsURL, myIp, serverPort, USERID, USERNAME, USERTOKEN } from "../constants"
import { _makeRequest } from "./network";
import Profile from "./profile";


export default function Lobby({ data }) {
  const [searchTerm, setSearch] = useState('')

  async function CreateGame(e) {
    e.preventDefault()
    const body = {
      userId: localStorage.getItem(USERID),
      amount: parseFloat(e.target["stake"].value),
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

  function EnterGame(game, stake) {
    if (confirm(`Would you like to stake ${stake} ? `)) {
      if (confirm("Are you sure you wish to join this game ?")) {
        window.location.assign("/join/" + game)
      }
    }
  }

  return (
    <>
      <main className="container-fluid">

        {/* <Profile /> */}

        <div className="d-lg-flex gap-3 justify-content-around align-items-start">

          <form onSubmit={(e) => CreateGame(e)}>
            <button className="px-3 py-2 rounded-3 join-button my-2" type="submit">Create</button>
            <div className="form-floating">
              <input type="number" className="form-control" id="stake" placeholder="Enter Stake Prize" required />
              <label htmlFor="stake">Stake</label>
            </div>
          </form>


          <div className="flex-grow-1 mt-3">
            <h3>LOBBY</h3>
            <form onSubmit={(e) => { e.preventDefault() }}>
              <input className="form-control my-3" type="search" placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
            </form>

            <div className="table-responsive">
              <table className="table table-borderless lobby-table text-light">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Game ID</th>
                    <th>Stake Pool Prize</th>
                    <th>Host</th>
                    <th>Opponent</th>
                    <th>Play</th>
                  </tr>
                </thead>
                {data &&
                  <tbody>
                    {searcher(data, searchTerm).map(({ Status, GameID, HostUserName, OpponentUserName, StakedAmount }, index) => (
                      Status !== "complete" ?
                        <tr key={GameID}>
                          <td>{index + 1}</td>
                          <td>#{GameID}</td>
                          <td className="moneybox">${(StakedAmount * 2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                          <td className={HostUserName == localStorage.getItem(USERNAME) && "text-info"}>{HostUserName}</td>
                          <td className={OpponentUserName == localStorage.getItem(USERNAME) && "text-info"}>{OpponentUserName && OpponentUserName}</td>
                          <td>
                            <button className="join-button p-1" onClick={(e) => EnterGame(GameID, StakedAmount)}>
                              {HostUserName == localStorage.getItem(USERNAME) ||
                                (OpponentUserName && OpponentUserName == localStorage.getItem(USERNAME)) ? "Play" :
                                !OpponentUserName ? "Join" : "Watch"
                              }
                            </button>
                          </td>
                        </tr> : ""
                    ))}</tbody>
                }
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

