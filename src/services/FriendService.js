import axiosClient from "../configs/axiosClient";

class FriendService{
    static get = () =>axiosClient.get(`/friends`);
    static getMention = (search) =>axiosClient.get(`/friends/mentions/${search}`);
    static getNewRequestStatus = () =>axiosClient.get(`/friends/status`);
    static updateNewRequestStatus = () =>axiosClient.put(`/friends/status`);
    static getSuggest = () =>axiosClient.get(`/friends/suggest`);
    static removeFriend = (friendId) =>axiosClient.delete(`/friends/${friendId}`);
    static sendRequestMakeFriend = (friendId) =>axiosClient.post('/friends/invite',{friendId});
    static removeRequestMakeFriend = (friendId) =>axiosClient.delete(`/friends/invite/${friendId}`);
    static getAllRequestMakeFriend = () =>axiosClient.get(`/friends/invite/`);
    static refuseRequestMakeFriend = (friendId) =>axiosClient.post(`/friends/refuse/`,{friendId});
    static acceptRequestMakeFriend = (friendId) =>axiosClient.post(`/friends/accept/`,{friendId});
    
    
}

export default FriendService