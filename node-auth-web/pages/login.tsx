import React, { useState } from "react"
import { registerUser } from "../services/api/user"

export interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const values = { email, password }

  return (
    <div>
      <form
        onSubmit={async e => {
          e.preventDefault()
          await registerUser(values)
        }}
      >
        <label>
          Email
          <input
            type="email"
            name="email"
            value={email}
            onChange={e => {
              setEmail(e.target.value)
            }}
          ></input>
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={password}
            onChange={e => {
              setPassword(e.target.value)
            }}
          ></input>
        </label>
        <input type="submit" value="Sign up" />
      </form>
    </div>
  )
}

export default Login
