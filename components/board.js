import { useState } from "react"

export default function Board() {
  const [mainboard, setBoard] = useState(Array(9).fill(" "))
  const [current, setCurrent] = useState("X")
  const winstates = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

  function Play(e) {
    let idx = e.target.value
    let board = [...mainboard]
    board[idx] = current

    e.target.disabled = true

    if (CheckWin(board, current)) {
      alert("Player " + current + "  Wins")
      window.location.reload()

    } else if (!board.includes(" ")) {
      alert("Game Draw")
      window.location.reload()
    }

    if (current == "X") {
      setCurrent("O")
    }
    else {
      setCurrent("X")
    }
    setBoard(board)
  }

  function CheckWin(cboard, move) {
    let result = false
    winstates.forEach(s => {
      let count = 0
      s.forEach(v => {
        if (cboard[v] == move) {
          count = count + 1
        }
      })
      if (count >= 3) {
        result = true
        return result
      }
    });
    return result
  }

  return (
    <div className="grid-container">
      {mainboard.map((value, index) => (
        <button key={index} onClick={(e) => Play(e)} className="grid-item bg-transparent" value={index}>{value}</button>
      ))}
    </div>
  )
}