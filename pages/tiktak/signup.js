import Link from "next/link";
import { useEffect, useState } from "react";

export default function Login() {
  const [loading, setLoading] = useState(false)
  return (
    <main className="container">
      <div className="card w-75 rounded-lg shadow mx-auto my-5 p-5">
        <form className="p-5">
          <label htmlFor="name" className="form-label mb-3">Username: </label>
          <input type="text" className="form-control" id="name" required />
          <label htmlFor="password" className="form-label mt-3 mb-3">Password: </label>
          <input type="password" className="form-control" id="password" required />

          <button type="button" disabled
            className="btn mt-3 text-lg text-muted text-decoration-underline">
            Forgot Password?
          </button>


          <button
            type="submit"
            className={(loading ? " disabled " : " ") + "form-control py-2 mt-3 text-center btn btn-dark"}>
            {loading ? <span className="spinner-border spinner-border-sm"></span> : "Sign up"}
          </button>


          <Link href="/tiktak/login">
            <button type="button"
              className="btn mt-3 text-lg text-primary text-decoration-underline form-control">
              Login Instead?
            </button>
          </Link>

        </form>
      </div>
    </main>
  )
}

