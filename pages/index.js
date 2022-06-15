import { useEffect, useState } from "react";
import { myIp, serverPort, USERID, USERNAME, USERTOKEN } from "../constants";
import Lobby from "../components/lobby";
import Login from "./login";
import Deposit from "../components/deposit";

let ws;

export default function Home() {
  const [lobbyData, setLobbyData] = useState([])
  const [msg, setMsg] = useState('')

  function connect(userId) {
    if (typeof window == "undefined") { return }
    // let url = `ws://${myIp}:${serverPort}/ws/${userId}`;
    let url = `wss://${myIp}/ws/${userId}`;
    ws = new WebSocket(url);

    ws.onopen = function (event) {
      console.log("👾 Connection established");
      let data = JSON.stringify({
        event: "first.send",
        data: "Hello from the client",
      });
      if (ws.readyState) {
        ws.send(data);
      }
      setMsg("👾 Connection established")
    };

    ws.onmessage = function (event) {
      let r = JSON.parse(event.data);

      console.log(r)

      if (r.event == "lobby.info") {
        let lobby = []
        for (const match of Object.values(r.data)) {
          lobby.push(match)
        }
        setLobbyData(lobby)

      }
      if (r.event == "new.game") {
        let lobby = []
        for (const match of Object.values(r.meta)) {
          lobby.push(match)
        }
        setLobbyData(lobby)
      }

      if (r.event == "error.info") {
        alert(r.error)
        window.location.assign("/")
      }
    };

    ws.onclose = function (event) {
      console.log("❌ Connection closed");
      setMsg("❌ Connection closed")
      setTimeout(function () {
        connect(localStorage.getItem(USERID));
      }, 1000);
    };
  }

  useEffect(() => {
    const isLogged = localStorage.getItem(USERID) && localStorage.getItem(USERNAME) && localStorage.getItem(USERTOKEN)
    if (!isLogged) {
      window.location.assign("/login")
    } else {
      connect(localStorage.getItem(USERID))
    }
  },)

  return (
    <>
      <Deposit />
      <p>{msg}</p>
      <Lobby data={lobbyData} />
      {/* <iframe className="w-100" height={1000} src="https://geco.vercel.app/index-2.html" allowTransparency frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> */}
    </>
  )
}