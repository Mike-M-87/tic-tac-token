import { useEffect, useState } from "react";
import { myIp, serverPort, USERID, USERNAME } from "../constants";
import Lobby from "../components/lobby";
import Login from "./login";
import Game from "../components/game";


export let ws;


export default function Home() {
  const [userStatus, setUserStatus] = useState("lobby")
  const [allData, setAllData] = useState({
    lobbyInfo: [],
    gameInfo: {},
  })

  function connect(userId) {
    if (typeof window == "undefined") { return }

    let url = `ws://${myIp}:${serverPort}/ws/${userId}`;
    ws = new WebSocket(url);

    ws.onopen = function (event) {
      console.log("👾 Connection established");
      let data = JSON.stringify({
        data: "Hello from the client",
      });
      if (ws.readyState) {
        ws.send(data);
      }
    };

    ws.onmessage = function (event) {
      let r = JSON.parse(event.data);

      if (r.event == "game.info") {
        setAllData(prevData => ({
          ...prevData,
          gameInfo: r.data
        }));
        setUserStatus("playing")
      }

      if (r.newguy != undefined) { ; }

      if (r.meta != undefined) {
        let lobbydata = []
        for (const match of Object.values(r.meta)) {
          lobbydata.push(match)
        }
        setAllData(prevData => ({
          ...prevData,
          lobbyInfo: lobbydata
        }));
      }


      if (r.event == "lobby.info") {
        let lobbydata = []
        for (const match of Object.values(r.data)) {
          lobbydata.push(match)
        }

        setAllData(prevData => ({
          ...prevData,
          lobbyInfo: lobbydata
        }));
      }
    };


    ws.onclose = function (event) {
      console.log("❌ Connection closed");
      setTimeout(function () {
        connect(localStorage.getItem(USERID));
      }, 1000);
    };
  }

  useEffect(() => {
    const isLogged = localStorage.getItem(USERID) && localStorage.getItem(USERNAME)
    if (!isLogged) {
      window.location.assign("/login")
    } else {
      connect(localStorage.getItem(USERID))
    }
  }, [])


  return (
    <>
      <button className="btn btn-danger m-4" onClick={(e) => setUserStatus("lobby")}>EXIT TO LOBBY</button>
      {userStatus == "lobby" ?
        <Lobby wsocket={ws} data={allData.lobbyInfo} />
        : userStatus == "playing" ?
          <Game wsocket={ws} data={allData.gameInfo} /> : ''
      }
    </>
  )
}

