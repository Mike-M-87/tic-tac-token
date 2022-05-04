import Link from "next/link";
import { useEffect, useState } from "react";
import { myIp, serverPort, USERID, USERNAME } from "../../constants";

let ws
let mydetails = { name: '', id: '' }

export async function getServerSideProps({ params }) {
  let id = params.game
  return {
    props: {
      id
    }
  }
}

export default function Game({ id }) {
  const [data, setData] = useState(null)

  function connect() {
    if (typeof window == "undefined") { return }
    let url = `wss://${myIp}/ws/${localStorage.getItem(USERID)}`;
    // let url = `ws://${myIp}:${serverPort}/ws/${localStorage.getItem(USERID)}`;
    ws = new WebSocket(url);

    ws.onopen = function (event) {
      console.log("👾 Connection established");
      if (id) {
        let subMessage = JSON.stringify({
          event: "sub.game",
          gameid: id,
        });

        if (ws.readyState) {
          ws.send(subMessage);
        }
      }
    };

    ws.onmessage = function (event) {
      let r = JSON.parse(event.data);
      console.log(r);
      if (r.event == "game.info" && r.data.GameID == id) {
        setData(r.data);
      }
    }

    ws.onclose = function (event) {
      console.log("❌ Connection closed");
      setTimeout(function () {
        connect(localStorage.getItem(USERID));
      }, 1000);
    };
  }

  useEffect(() => {
    connect()
    mydetails.id = localStorage.getItem(USERID)
    mydetails.name = localStorage.getItem(USERNAME)
  }, [])

  return (
    <main className="container-fluid mx-auto">
      {/* <Link href={"/"} <button className="btn btn-danger m-4" onClick={(e) => setUserStatus("lobby")}>EXIT TO LOBBY</button> */}

      <p>MY ID : {mydetails.id}</p>
      <p>MY NAME : {mydetails.name}</p>

      {data &&
        <div className="row mx-5">
          <div className="col-3">
            <h2>Game: </h2><span> {data.GameID}</span>
            <h3>Host: </h3><span>{data.HostUserId}</span>
            <h3>Opponent: </h3><span>{data.OpponentUserId}</span>
            <h3>Stake: </h3><span> {data.StakedAmount}</span>
          </div>

          <div className="col-md-8">
            {data.GameBoard &&
              <div className="grid-container">
                {data.GameBoard.map((value, index) => (
                  <button key={index} className="grid-item" value={index}>{value}</button>
                ))}
              </div>}
          </div>
        </div>}
    </main>
  )
}
