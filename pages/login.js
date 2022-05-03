import Link from "next/link";
import { useEffect, useState } from "react";
import { USERID, USERNAME } from "../constants";


export default function Login() {
  const [loading, setLoading] = useState(false)

  function LoginUser(e) {
    e.preventDefault()
    localStorage.setItem(USERID, Math.random())
    localStorage.setItem(USERNAME, e.target["name"].value)
    window.location.assign("/")
  }

  return (
    <main className="container">
      <div className="card w-50 rounded-lg shadow mx-auto my-5 p-5">

        <form className="p-5" onSubmit={(e) => LoginUser(e)}>
          <label htmlFor="name" className="form-label mb-3">Username: </label>
          <input type="text" className="form-control" id="name" required />

          {/* <label htmlFor="password" className="form-label mt-3 mb-3">Password: </label>
          <input type="password" className="form-control" id="password" required /> */}

          {/* <button type="button" disabled
            className="btn mt-3 text-lg text-muted text-decoration-underline">
            Forgot Password?
          </button> */}


          <button
            type="submit"
            className={(loading ? " disabled " : " ") + "form-control py-2 mt-3 text-center btn btn-dark"}>
            {loading ? <span className="spinner-border spinner-border-sm"></span> : "Sign in"}
          </button>

          {/* <Link href="/tiktak/signup">
            <button type="button"
              className="btn mt-3 text-lg text-primary text-decoration-underline form-control">
              Create Account Instead?
            </button>
          </Link> */}

        </form>
      </div>
    </main>
  )
}

