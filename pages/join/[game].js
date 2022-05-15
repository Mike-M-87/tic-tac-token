import { useEffect, useState } from "react";
import Profile from "../../components/profile";
import { USERID, USERNAME, USERTOKEN, wsURL } from "../../constants";

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
    let url = `${wsURL}/${localStorage.getItem(USERID)}`;
    
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
    updateScroll()
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
          style.titleColor = "bg-info"
        } else {
          switch (userid) {
            case winnerId:
              style.titleText = ("YOU WON " + data.StakedAmount)
              style.titleColor = "bg-success"
              break;
            case data.Opponent.ID: case data.Host.ID:
              style.titleText = ("YOU LOST " + data.StakedAmount)
              style.titleColor = "bg-secondary"
              break;
            default:
              style.titleText = (winnerName + " WON " + data.StakedAmount)
              style.titleColor = "bg-info"
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

  return (
    <main className="container-fluid gamewindow bg-black text-white mx-auto">
      <div className="d-flex justify-content-between">
        <button onClick={(e) => window.location.assign("/")} className="btn btn-danger m-4">Quit</button>
        <Profile />
      </div>

      {data &&
        <>
          <div className="gamecard mt-3">
            <span className={"p-2 rounded my-3 " + fetchTheme().titleColor}>{fetchTheme().titleText}</span>
            {data.GameBoard &&
              <div className="grid-container my-3">
                {data.GameBoard.map((value, index) => (
                  <button key={index} className="grid-item" onClick={(e) => Play(index)}>{value == 0 ? "X" : value == 1 ? "O" : " "}</button>
                ))}
              </div>
            }
          </div>

          <div className="d-grid gap-1">
            <h3 className="text-center">Game {data.GameID}</h3>

            <div className="d-flex flex-wrap justify-content-around">
              <h3>Host : {data.Host.Name}</h3>
              <span className="lead">Plays</span>
              <h4>Opponent : {data.Opponent ? data.Opponent.Name : ''}</h4>
              <h4>TotalStake ${data.StakedAmount * 2}</h4>
            </div>

            <div className="d-flex justify-content-center">
              <h4>Winner : </h4>
              <h4 className="mx-3"> {data.Winner ? data.Winner.Name : ""}</h4>
            </div>

            <h4>Invite Others to watch</h4>
            <input className="w-50" readOnly onClick={(e) => {
              e.target.select();
              document.execCommand('copy');
            }} value={data.GameID} />

          </div>


          <div className="offcanvas bg-dark offcanvas-end my-4 mx-md-3 rounded-3" id="chatbox">

            <div className="offcanvas-header">
              <h3 className="offcanvas-title">Game Chat</h3>
              <button type="button" className="btn-close text-white" data-bs-dismiss="offcanvas"></button>
            </div>

            <div className="offcanvas-body">
              <dl className="chatlist" id="mychat">
                {data.Chat && data.Chat.map(({ SenderName, Text }, index) => (
                  <div key={index}>
                    <dt className={SenderName == localStorage.getItem(USERNAME) ? "text-primary" : ""}>{SenderName == localStorage.getItem(USERNAME) ? "You" : SenderName}</dt>
                    <dd className="mx-1 d-flex text-break">{Text}</dd>
                  </div>
                ))}
              </dl>
              <form onSubmit={(e) => SendMessage(e)} className="d-flex">
                <input id="msg" className="form-control" type="text" required />
                <button className="btn btn-dark" type="submit"><span className="material-icons">send</span></button>
              </form>
            </div>

          </div>


          <button className="float-end mx-5 my-3 btn rounded-circle btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#chatbox">
            <span className="material-icons pt-2">chat_bubble</span>
          </button>

        </>
      }
    </main >
  )
}
