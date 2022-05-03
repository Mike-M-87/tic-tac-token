import { useEffect, useState } from "react";
import { myIp, serverPort, USERID, USERNAME } from "../constants";
import Lobby from "../components/lobby";
import Login from "./login";


let ws;


export default function Game() {
  const [userStatus, setUserStatus] = useState("lobby")
  const [allData, setAllData] = useState({
    lobbyInfo: null,
    gameInfo: null,
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
          gameInfo: event.data
        }));
        // let gameInfo = document.getElementById("gameInfo");
        // gameInfo.innerHTML = JSON.stringify(event.data, null, 2);
      }

      if (r.meta != undefined) {
        setAllData(prevData => ({
          ...prevData,
          lobbyInfo: r.meta
        }));
        // lobby.innerHTML = "";
        // for (const match of Object.entries(r.meta)) {
        //   lobby.innerHTML += `<li>${match[1].GameID} <button onclick="subscribeToGame('${match[1].GameID}')"> Join </button></li>`;
        // }
      }

      if (r.event == "lobby.info") {
        setAllData(prevData => ({
          ...prevData,
          lobbyInfo: r.data
        }));
        // lobby.innerHTML = "";
        // for (const match of Object.entries(r.data)) {
        //   lobby.innerHTML += `<li>${match[1].GameID} <button onclick="subscribeToGame('${match[1].GameID}')"> Join </button></li>`;
        // }
      }

      if (r.newguy != undefined) {
        // lobby.innerHTML += `<li>${r.newguy}</li>`
      }
    };

    ws.onclose = function (event) {
      console.log("❌ Connection closed");

      // So some cool way to ensure we are always connected to our websocket connetion
      setTimeout(function () {
        // connect();
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
      {userStatus == "lobby" ?
        <Lobby data={allData.lobbyInfo} />
        : userStatus == "playing" ?
          <Game data={allData.gameInfo} /> : ''
      }
    </>
  )
}
