import Link from "next/link";
import { useEffect, useState } from "react";
import { _makeRequest } from "../components/network";
import { signupURL } from "../constants";

export default function SignUp() {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function AddUser(e) {
    e.preventDefault()
    setLoading(true)
    setErr('')

    const body = {
      username: e.target["name"].value,
      password: e.target["password"].value
    };
    const response = await _makeRequest({ url: signupURL, reqBody: body })

    if (response.success) {
      localStorage.setItem(USERID, response.body.userId)
      localStorage.setItem(USERTOKEN, response.body.token)
      localStorage.setItem(USERNAME, response.body.username)
      window.location.assign("/")
    } else if (!response.success) {
      setErr(response.errorMessage)
    }
    setLoading(false)
  }

  return (
    <main className="container">
      <div className="card shadow login">

        <form className="d-grid gap-3" onSubmit={(e) => AddUser(e)}>
          <p className="text-danger">{err}</p>
          <label htmlFor="name" className="form-label">Username: </label>
          <input type="text" className="form-control" id="name" required />
          <label htmlFor="password" className="form-label">Password: </label>
          <input type="password" className="form-control" id="password" required />


          <button
            type="submit"
            className={(loading ? " disabled " : " ") + "form-control py-2 text-center btn btn-dark"}>
            {loading ? <span className="spinner-border spinner-border-sm"></span> : "Sign up"}
          </button>


          <Link href="/login">
            <button type="button"
              className="btn text-lg text-primary text-decoration-underline form-control">
              Login Instead?
            </button>
          </Link>

        </form>
      </div>
    </main>
  )
}

