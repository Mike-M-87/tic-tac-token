import Link from "next/link";
import { useEffect, useState } from "react";
import { myIp, serverPort, USERID, USERNAME } from "../../constants";

let ws

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
          opponent: localStorage.getItem(USERNAME)
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
  }, [])

  function Play(e, idx) {
    if (id) {
      let subMessage = JSON.stringify({
        event: "sub.play",
        gameid: id,
        player: localStorage.getItem(USERID),
        playposition: idx.toString()
      });

      if (ws.readyState) {
        ws.send(subMessage);
        e.target.disable = true
      }
    }
  }

  return (
    <main className="container-fluid mx-auto">
      <Link href={"/"} ><button className="btn btn-danger m-4">Rage Quit</button></Link>
      {data &&

        <div className="d-lg-flex justify-content-around">
          <div className="d-flex flex-column gap-2">
            <h2>Game </h2><span> {data.GameID}</span>
            <h3>Host </h3><span>{data.HostUserName}</span>
            <h3>Opponent </h3><span>{data.OpponentUserName}</span>
            <h3>Stake </h3><span> ${data.StakedAmount}</span>
            <h4>Invite Others to watch</h4>
            <input className="orm-control" readonly="readonly" onClick={(e) => {
              e.target.select();
              document.execCommand('copy');
            }} value={window.location.href} />
          </div>

          <div>
            {data.GameBoard &&
              <div className="grid-container">
                {data.GameBoard.map((value, index) => (
                  <button key={index} className="grid-item" onClick={(e) => Play(e, index)} value={index}>{value == 0 ? "X" : value == 1 ? "O" : null}</button>
                ))}
              </div>}
          </div>
        </div>
      }
    </main >
  )
}
