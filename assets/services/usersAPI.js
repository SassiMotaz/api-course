import axios from "axios";

function Register(user) {
  return axios.post("https://127.0.0.1:8000/api/users", user);
}

export default {
    Register
};