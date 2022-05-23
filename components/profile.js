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

  useEffect(() => {
    GetDetails()
    GetRates()
  },[])

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
      <div className='gap-3 d-flex justify-content-end me-3 align-items-center'>
        <span className="material-icons">face</span>
        <div className='text-start p-1'>
          <h6>{details && details.username || "Unknown"}</h6>
          <span className="text-success">${details ? details.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0"}</span>
        </div>
        {details ?
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <button className="px-3 py-2 rounded-3 join-button" data-bs-toggle="modal" data-bs-target="#depositmodal">Deposit</button>
          </div>
          :
          <button className="px-3 py-2 rounded-3 join-button" onClick={(e) => Goto("/login")}>Login</button>
        }
      </div>

      <div className="modal fade" id="depositmodal">
        <div className="modal-dialog rounded-5">
          <div className="modal-content">

            <div className="modal-header">
              <h4 className="modal-title">Deposit</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div className="modal-body">
              {details ?
                <>
                  <form onSubmit={(e) => DepositCash(e)} className="d-grid gap-2">
                    <label htmlFor="amount" className="fs-italic form-label">Amount in Kes</label>
                    <input min={1} max={999_999} defaultValue={0} type="number" className="form-control" id="amount" placeholder="e.g 1000" onChange={(e) => setAmount(e.target.value)} required />
                    <Icon n="swap_vert" styles="fs-2 fw-bold mx-auto mt-1" />
                    <label htmlFor="usdt" className="form-label">USDC</label>
                    <input className="form-control" id="usdt" placeholder={1000 / rates} value={parseInt(amount / rates) + " USDC"} readOnly />
                    <button type="submit" className="mt-3 fs-5 join-button">Checkout</button>
                  </form>

                  <div className="my-4 fs-6">
                    <p>Wish To Deposit From External Address?</p>
                    <p>Enter Amount to deposit and <strong>Connect Your Wallet</strong>, then click <strong>Send Transaction</strong> button below.</p>
                  </div>
                  <Connect usdcAmt={parseInt(amount / rates)} />
                </>
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