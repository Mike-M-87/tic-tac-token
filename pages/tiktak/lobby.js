import React, { useEffect, useState } from "react"

export default function Lobby() {
  const [mainboard, setBoard] = useState(Array(9).fill("."))
  const [current, setCurrent] = useState("X")
  const [data, SetData] = useState(null)
  const winstates = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

  function CreateGame(e) {
    e.preventDefault()
    window.location.assign("/tiktak/game")
  }


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
                        onClick={(e) => {
                          e.preventDefault()
                          OpenModal(players[0].name)
                        }} >Join</button></td>
                    </tr>
                  ))}
                </tbody>
              }
            </table>
          </div>

          <div>
            <form className="mt-1" onSubmit={(e) => CreateGame(e)}>
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
              {mainboard.map((value, index) => (
                <button key={index} onClick={(e) => Play(e)} className="grid-item" value={index}>{value}</button>
              ))}
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

