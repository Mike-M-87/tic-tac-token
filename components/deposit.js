import { useEffect, useState } from "react";
import $ from 'jquery'
import Image from "next/image";
import { USERNAME } from "../constants";
import { LocalGet } from "../helpers";

export default function Deposit() {
  const [msg, setMsg] = useState("")
  const [name, setName] = useState("Unknown")

  useEffect(() => {
    function GetQueryParams() {
      let fragment = window.location.href.split("?")
      if (fragment[1]) {
        const params = fragment[1].split("&")
        const queryData = {}
        params.forEach(element => {
          const objectpair = element.split("=")
          queryData[objectpair[0]] = objectpair[1]
        });
        console.log(queryData.status);
        if (queryData.status == "successful") {
          setMsg("Payment Successful")
        } else {
          setMsg("Payment Failed")
        }
      }
    }
    GetQueryParams()
    setName(LocalGet(USERNAME))
  }, [])

  return (
    <>
      <div aria-live="polite" aria-atomic="true" className="d-flex position-absolute justify-content-center align-items-center w-100">
        <div className={"toast " + (msg !== "" ? "show" : "")} role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <strong className="me-auto">{name}</strong>
            <small>FlutterWave</small>
            <button type="button" className="btn-close" onClick={(e) => window.location.assign("/")} aria-label="Close"></button>
          </div>
          <div className="toast-body">
            {msg}
          </div>
        </div>
      </div>
    </>
  )
}