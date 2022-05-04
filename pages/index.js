import { useEffect, useState } from "react";
import { myIp, serverPort, USERID, USERNAME } from "../constants";
import Lobby from "../components/lobby";
import Login from "./login";


export let ws;


export default function Home() {
  const [lobbyData, setLobbyData] = useState([])

  function connect(userId) {
    if (typeof window == "undefined") { return }
    let url = `wss://${myIp}/ws/${userId}`;
    // let url = `ws://${myIp}:${serverPort}/ws/${userId}`;
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

      console.log(r)

      if (r.event == "game.info") { ; }
      if (r.newguy != undefined) { ; }

      if (r.event == "new.game") {
        let lobby = []
        for (const match of Object.values(r.meta)) {
          lobby.push(match)
        }
        setLobbyData(lobby)
      }

      if (r.event == "lobby.info") {
        let lobby = []
        for (const match of Object.values(r.data)) {
          lobby.push(match)
        }
        setLobbyData(lobby)
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
      <Lobby wsocket={ws} data={lobbyData} />
    </>
  )
}

