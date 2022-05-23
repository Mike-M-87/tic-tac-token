import Link from "next/link";
import { useEffect, useState } from "react";
import Board from "../../components/board";
import Icon from "../../components/Icon";
import Lobby from "../../components/lobby";
import Profile from "../../components/profile";
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
    // let url = `ws://${myIp}:${serverPort}/ws/${localStorage.getItem(USERID)}`;
    let url = `wss://${myIp}/ws/${localStorage.getItem(USERID)}`;
    ws = new WebSocket(url);

    ws.onopen = function (event) {
      console.log("👾 Connection established");
      if (id) {
        let subMessage = JSON.stringify({
          event: "sub.game",
          gameid: id,
          opponent: localStorage.getItem(USERID) ? localStorage.getItem(USERID) : "",
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
      if (data.Winner) {
        let name = localStorage.getItem(USERID) == data.Winner.ID ? "You" : data.Winner.Name
        alert(name + " already won")
        return
      } else {
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
  }

  function SendMessage(e) {
    e.preventDefault()
    let msgtext = e.target["msg"].value
    if (!msgtext.trim().length) { return }
    let subMessage = JSON.stringify({
      event: "sub.chat",
      gameid: id,
      sender: localStorage.getItem(USERNAME),
      text: msgtext
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


  function fetchTheme() {
    let userid = localStorage.getItem(USERID)
    let style = {
      titleText: "",
      titleColor: ""
    }

    if (data) {

      let playerName = data.CurrentPlayer.Name

      if (data.Winner) {
        let winnerName = data.Winner.Name
        let winnerId = data.Winner.ID
        if (winnerId == "Draw") {
          style.titleText = "GAME DRAW"
          style.titleColor = "accentcolor"
        } else {
          switch (userid) {
            case winnerId:
              style.titleText = ("YOU WON " + data.StakedAmount * 2)
              style.titleColor = "bg-success"
              break;
            case data.Opponent.ID: case data.Host.ID:
              style.titleText = ("YOU LOST " + data.StakedAmount * 2)
              style.titleColor = "bg-secondary"
              break;
            default:
              style.titleText = (winnerName + " WON " + data.StakedAmount * 2)
              style.titleColor = "accentcolor"
              break;
          }
        }

      } else {
        switch (userid) {
          case data.CurrentPlayer.ID:
            style.titleText = "Your turn"
            style.titleColor = "bg-warning"
            break;
          case data.Opponent.ID: case data.Host.ID:
            style.titleText = "Opponent's turn"
            style.titleColor = "bg-secondary"
            break;
          default:
            style.titleText = (playerName + "'s turn")
            style.titleColor = "bg-info"
            break;
        }
      }
    }
    return style
  }

  useEffect(() => {
    updateScroll()
  }, [data])

  return (
    <main className="container-fluid gamewindow  mx-auto">
      <div className="d-flex justify-content-between">
        <button onClick={(e) => window.location.assign("/")} className="btn btn-danger m-4">Quit</button>
        <Profile />
      </div>


      {data &&
        <>
          <div className="d-flex justify-content-around flex-wrap align-items-center">
            <div className="card p-2">
              <h4 className="text-center">Game {data.GameID}</h4>
              <div className="d-flex my-2 justify-content-between">
                <div className="d-flex flex-column">
                  <h5>Host</h5>
                  <h5>Opponent</h5>
                  <h5>TotalStake</h5>
                  <h5>Winner</h5>
                </div>
                <div className="d-flex flex-column"><h5>-</h5><h5>-</h5><h5>-</h5><h5>-</h5></div>
                <div className="d-flex flex-column">
                  <h5>{data.Host.Name}</h5>
                  <h5>{data.Opponent ? data.Opponent.Name : 'None'}</h5>
                  <h5>${data.StakedAmount * 2}</h5>
                  <h5>{data.Winner ? data.Winner.Name : "None"}</h5>
                </div>
              </div>

              <h6>Invite Others to watch</h6>
              <input className="form-control" readOnly onClick={(e) => {
                e.target.select();
                document.execCommand('copy');
              }} value={data.GameID} />
            </div>

            <div className="gamecard mt-3">
              <span className={"p-2 rounded my-3 " + fetchTheme().titleColor}>{fetchTheme().titleText}</span>
              {data.GameBoard &&
                <div className="grid-container my-3">
                  {data.GameBoard.map((value, index) => (
                    <button key={index} className="grid-item" onClick={(e) => Play(index)}>{value == 0 ? "X" : value == 1 ? "O" : ""}</button>
                  ))}
                </div>
              }
            </div>

            <button className="my-4  osition-absolute btn rounded-circle btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#chatbox">
              <span className="material-icons pt-2">chat_bubble</span>
            </button>
          </div>

          <div className="offcanvas offcanvas-end my-md-4 mx-md-3 rounded-4" id="chatbox">
            <div className="offcanvas-header">
              <h3 className="offcanvas-title">Game Chat</h3>
              <button type="button" className="btn-close text-white" data-bs-dismiss="offcanvas"></button>
            </div>
            <div className="offcanvas-body">
              <div className="chatlist" id="mychat">
                {data.Chat && data.Chat.map(({ SenderName, Text }, index) => (
                  <div key={index}>
                    <dt className={SenderName == localStorage.getItem(USERNAME) ? "text-primary" : ""}>{SenderName == localStorage.getItem(USERNAME) ? "You" : SenderName}</dt>
                    <dd className="mx-1 d-flex text-break">{Text}</dd>
                  </div>
                ))}
              </div>
              <form onSubmit={(e) => SendMessage(e)} className="d-flex">
                <input id="msg" placeholder="Type Message Here" autoComplete="off" className="form-control" type="text" required />
                <button className="btn ps-2 ms-1 btn-sm " type="submit"><Icon n="send" styles="mt-2" /></button>
              </form>
            </div>
          </div>

        </>
      }
    </main >
  )
}
