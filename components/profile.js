import Image from "next/image";
import { useEffect, useState } from "react";
import { depositURL, DetailsURL, ratesURL, USERTOKEN } from "../constants";
import { Goto, LocalGet } from "../helpers";
import Connect from "./connect";
import Icon from "./Icon";
import { _makeRequest } from "./network";


export default function Profile() {
  const [details, setDetails] = useState(null)
  const [rates, setRates] = useState(null)
  const [amount, setAmount] = useState(0)
  const [rainbowD, setRainbowd] = useState(true)

  useEffect(() => {
    async function GetDetails() {
      if (LocalGet(USERTOKEN)) {
        const body = {
          token: localStorage.getItem(USERTOKEN),
        }
        const response = await _makeRequest({ url: DetailsURL, reqBody: body })
        if (response.success) {
          setDetails(response.body)
        } else {
          alert(response.errorMessage)
        }
      }
    }

    async function GetRates() {
      try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD")
        const parsedResp = await response.json();
        const kes = parsedResp.rates["KES"]
        setRates(kes)
      } catch (error) {
        console.log(error);
      }
    }
    GetDetails()
    GetRates()
  }, [])

  async function DepositCash(e) {
    e.preventDefault()
    const kesAmount = parseInt(e.target["amount"].value)
    const body = {
      token: LocalGet(USERTOKEN),
      amount: kesAmount,
    }
    const response = await _makeRequest({ url: depositURL, reqBody: body })
    if (response.success) {
      console.log(response);
      const flwlink = response.body["PaymentLink"]
      window.open(flwlink, "_self").focus();
    } else {
      console.log(response);
    }
  }

  return (
    <>
      <div className='gap-3 d-flex justify-content-end align-items-center'>
        <span className="material-icons">face</span>
        <div className='text-start p-1'>
          <h6>{details && details.username || "Unknown"}</h6>
          <span className="text-success">${details ? details.balance : "0"}</span>
        </div>
        {details ?
          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-dark px-3 rounded-4" data-bs-toggle="modal" data-bs-target="#depositmodal">Deposit</button>
            {rainbowD && <Connect />}
          </div>
          :
          <button className="btn btn-dark" onClick={(e) => Goto("/login")}>Login</button>
        }
      </div>

      <div className="modal fade" id="depositmodal">
        <div className="modal-dialog rounded-5">
          <div className="modal-content bg-black text-light">

            <div className="modal-header">
              <h4 className="modal-title">Deposit</h4>
              <button type="button" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              {details ?
                <form onSubmit={(e) => DepositCash(e)} className="d-grid gap-2">
                  <label htmlFor="amount" className="fs-italic form-label">Amount in Kes</label>
                  <input type="number" className="form-control" id="amount" placeholder="Kes 1000" onChange={(e) => setAmount(e.target.value)} />
                  <Icon n="swap_vert" styles="fs-2 fw-bold mt-3" />
                  <label htmlFor="usdt" className="mt-2 form-label">USDT</label>
                  <input className="form-control" id="usdt" placeholder={1000 / rates} value={parseFloat(amount / rates).toFixed(2) + " USDT"} readOnly />
                  <div className="d-flex justify-content-between mt-3">
                    <button type="button" className="btn text-light btn-outline-none" data-bs-dismiss="modal" onClick={(e) => setRainbowd(!rainbowD)}>{rainbowD ? "Disconnect External Address" : "Connect External Address?"}</button>
                    <button type="submit" className="btn btn-light">Deposit</button>
                  </div>

                </form>
                :
                <div>
                  <p>Please Login to Deposit</p>
                  <button className="btn btn-warning rounded-5" onClick={(e) => Goto("/login")}>Login</button>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

    </>
  )
}