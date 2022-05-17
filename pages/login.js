import Link from "next/link";
import { useEffect, useState } from "react";
import { _makeRequest } from "../components/network";
import { loginURL, USERID, USERNAME, USERTOKEN } from "../constants";


export default function Login() {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function LoginUser(e) {
    e.preventDefault()
    setLoading(true)
    setErr('')

    const body = {
      username: e.target["name"].value,
      password: e.target["password"].value
    };

    const response = await _makeRequest({ url: loginURL, reqBody: body })
    if (response.success) {
      localStorage.setItem(USERID, response.body.userId)
      localStorage.setItem(USERTOKEN, response.body.token)
      localStorage.setItem(USERNAME,response.body.username)
      window.location.assign("/")
    } else if (!response.success) {
      setErr(response.errorMessage)
    }
    setLoading(false)
  }

  return (
    <main className="container">
      <div className="card shadow login">

        <form onSubmit={(e) => LoginUser(e)} className="d-grid gap-3">
          <p className="text-danger">{err}</p>
          <label htmlFor="name" className="form-label">Username: </label>
          <input type="text" className="form-control" id="name" required />

          <label htmlFor="password" className="form-label">Password: </label>
          <input type="password" className="form-control" id="password" />

          <button type="button" disabled
            className="btn text-lg text-muted text-decoration-underline btn-outline-white">
            Forgot Password?
          </button>

          <button
            type="submit"
            className={(loading ? " disabled " : " ") + "form-control py-2 text-center btn btn-dark"}>
            {loading ? <span className="spinner-border spinner-border-sm"></span> : "Enter"}
          </button>

          <Link passHref  href="/signup">
            <button type="button"
              className="btn text-lg text-primary text-decoration-underline bg-transparent form-control">
              Create Account Instead?
            </button>
          </Link>

        </form>
      </div>
    </main>
  )
}

