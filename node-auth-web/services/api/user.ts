import { parseCookies, destroyCookie } from "nookies"
import axios from "../axios"

interface RegisterInfo {
  email: string
  password: string
}

export const registerUser = async (registerInfo: RegisterInfo) => {
  try {
    axios
      .post("https://api.nodeauth.dev/api/register", registerInfo)
      .then(res => console.log(res))
      .catch(err => console.log(err))
  } catch (e) {
    console.log(e)
  }
}
