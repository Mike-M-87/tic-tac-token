import { useState } from "react"

export default function Home() {
  const [mainboard, setBoard] = useState(Array(9).fill("."))
  const [current, setCurrent] = useState("X")
  const winstates = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

  function Play(e) {
    let idx = e.target.value
    let board = [...mainboard]
    board[idx] = current
    e.target.disabled = true
    setBoard(board)
    CheckWin(board, current)
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
        console.log(cboard[v]);
        if (cboard[v] == move) {
          count = count + 1
        }
      })
      if (count >= 3) {
        alert("Player " + current + "  Wins")
        window.location.reload(false)
      }
    });
  }

  return (
    <>
      < h1 className="text-3xl m-5">Play</h1 >
      <div className="grid grid-cols-3 gap-4 w-[300px] m-5">
        {
          mainboard.map((value, index) => (
            <button key={index} onClick={(e) => Play(e)} className="bg-slate-300 py-4" value={index}>{value}</button>
          ))
        }
      </div>
    </>
  )
}