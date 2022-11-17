import axios from 'axios'
import {store} from '../app/store'
const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:3000'

const axiosClient = axios.create({
    baseURL: `${baseURL}/api`,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
})

axiosClient.interceptors.request.use(function (config) {
  if(store.getState().auth.token)
    config.headers = {
      "Authorization": store.getState().auth.token,
    }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});
axiosClient.interceptors.response.use(
    function (response) {
        return response.data
    },
    function (error) {
        // let res = error.response;
        //   console.log(error);
        //   console.error('Looks like there was a problem. Status Code: ' + res.status);
        return Promise.reject(error)
    }
)

export default axiosClient
