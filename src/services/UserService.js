import axiosClient from "../configs/axiosClient";
import {store} from '../app/store'

class UserService{
    static checkExistUsername = (username) =>axiosClient.post('/auths/signup/check',{username});
    static register = (data) =>axiosClient.post('/auths/signup',data);
    static login = (data) =>axiosClient.post('/auths/login',data);
    static update = (data) =>axiosClient.post('/auths/update',data);
    static get = (username) =>axiosClient.get(`/auths/${username}`,);
    static search = (username) =>axiosClient.get(`/auths/search/${username}`,);
    // static create = (data)=> axiosClient.post('/posts', data, {
    //     // headers: { "Content-Type": "multipart/form-data" },
    // })
}

export default UserService