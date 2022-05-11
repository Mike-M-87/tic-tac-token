import Link from "next/link";
import { useEffect, useState } from "react";
import { myIp, serverPort, USERID, USERNAME, USERTOKEN } from "../../constants";

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

    let url = `ws://${myIp}:${serverPort}/ws/${localStorage.getItem(USERID)}`;
    ws = new WebSocket(url);

    ws.onopen = function (event) {
      console.log("👾 Connection established");
      if (id) {
        let subMessage = JSON.stringify({
          event: "sub.game",
          gameid: id,
          opponent: localStorage.getItem(USERNAME) ? localStorage.getItem(USERNAME) : "",
        });
        if (ws.readyState) {
          ws.send(subMessage);
        }
      }
    };

    ws.onmessage = function (event) {
      let r = JSON.parse(event.data);
      console.log("gamer r", r);
      if (r.event == "game.info" && r.data.GameID == id) {
        setData(r.data);
      } else if (r.event == "error.info") {
        alert(r.error)
      }
      updateScroll()
    }

    ws.onclose = function (event) {
      console.log("❌ Connection closed");
      setTimeout(function () {
        connect(localStorage.getItem(USERID));
      }, 1000);
    };
  }

  useEffect(() => {
    const isLogged = localStorage.getItem(USERID) && localStorage.getItem(USERNAME) && localStorage.getItem(USERTOKEN)
    if (!isLogged) {
      window.location.assign("/login")
    }
    connect()
  }, [])


  function Play(idx) {
    if (id) {
      if (data.Winner != "") {
        let name = localStorage.getItem(USERNAME) == data.Winner ? "You" : data.Winner
        alert(name + " already won")
        return
      }
      let subMessage = JSON.stringify({
        event: "sub.play",
        gameid: id,
        player: localStorage.getItem(USERID),
        playposition: idx.toString()
      });

      if (ws.readyState) {
        ws.send(subMessage);
      }
    }
  }

  function SendMessage(e) {
    e.preventDefault()
    let subMessage = JSON.stringify({
      event: "sub.chat",
      gameid: id,
      sender: localStorage.getItem(USERNAME),
      text: e.target["msg"].value
    });

    if (ws.readyState) {
      ws.send(subMessage);
    }
    e.target["msg"].value = ""
  }

  function updateScroll() {
    var element = document.getElementById("mychat");
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }

  return (
    <main className="container-fluid gamewindow bg-black text-white mx-auto">
      <Link passHref  href={"/"} ><button className="btn btn-danger m-4">Rage Quit</button></Link>
      {data &&
        <>

          <div className="d-grid gap-1">
            <h3 className="text-center">Game {data.GameID}</h3>

            <div className="d-flex flex-wrap justify-content-around">
              <h3>Host : {data.HostUserName}</h3>
              <span className="lead">Plays</span>
              <h4>Opponent : {data.OpponentUserName}</h4>
              <h4>Stake ${data.StakedAmount}</h4>
            </div>

            <div className="d-flex justify-content-center">
              <h4>Winner : </h4>
              <h4 className="mx-3"> {data.Winner || <div className="spinner-border"></div>}</h4>
            </div>

            <h4>Invite Others to watch</h4>
            <input className="form-control" readOnly onClick={(e) => {
              e.target.select();
              document.execCommand('copy');
            }} value={window.location.href} />

          </div>

          <div className="my-4">
            {data.GameBoard &&
              <div className="grid-container">
                {data.GameBoard.map((value, index) => (
                  <button key={index} className="grid-item" onClick={(e) => Play(index)}>{value == 0 ? "X" : value == 1 ? "O" : "-"}</button>
                ))}
              </div>
            }
          </div>


          <div className="offcanvas bg-dark offcanvas-end my-4 mx-3 rounded-3" id="chatbox">

            <div className="offcanvas-header">
              <h3 className="offcanvas-title">Game Chat</h3>
              <button type="button" className="btn-close text-white" data-bs-dismiss="offcanvas"></button>
            </div>

            <div className="offcanvas-body">
              <dl className="chatlist" id="mychat">
                {data.Chat && data.Chat.map(({ SenderName, Text }, index) => (
                  <div key={index}>
                    <dt className={SenderName == localStorage.getItem(USERNAME) ? "text-primary" : ""}>{SenderName == localStorage.getItem(USERNAME) ? "You" : SenderName}</dt>
                    <dd className="mx-1">{Text}</dd>
                  </div>
                ))}
              </dl>
              <form onSubmit={(e) => SendMessage(e)} className="d-flex">
                <input id="msg" className="form-control" type="text" required />
                <button className="btn btn-dark" type="submit"><span className="material-icons">send</span></button>
              </form>
            </div>

          </div>


          <button className="float-end mx-5 btn rounded-circle btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#chatbox">
            <span className="material-icons pt-2">chat_bubble</span>
          </button>
        </>
      }
    </main >
  )
}
