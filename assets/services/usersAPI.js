import axios from "axios";
import { USERS_API } from "../js/config";

function Register(user) {
  return axios.post(USERS_API , user);
}

export default {
    Register
};