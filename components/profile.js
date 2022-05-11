import { useEffect, useState } from "react";
import { DetailsURL, USERTOKEN } from "../constants";
import { _makeRequest } from "./network";

export default function Profile() {
  const [details, setDetails] = useState(null)

  useEffect(() => {
    async function GetDetails() {
      const body = {
        token: localStorage.getItem(USERTOKEN),
      };
      const response = await _makeRequest({ url: DetailsURL, reqBody: body })
      if (response.success) {
        setDetails(response.body)
      } else {
        alert(response.errorMessage)
      }
    }
    GetDetails()
  }, [])

  return (
    <div className='gap-3 d-flex justify-content-end align-items-center'>
      <span className="material-icons">face</span>
      <div className='text-start p-1'>
        <h6>{details && details.username || "No Name"}</h6>
        <span className="text-success">${details && details.balance || "0"}</span>
      </div>
      <button className="btn btn-dark btn-sm" onClick={(e) => { localStorage.clear(); window.location.reload() }}>Logout</button>
    </div>
  )
}