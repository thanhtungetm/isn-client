import axiosClient from "../configs/axiosClient";

class PostService{
    static get = () =>axiosClient.get('/posts');
    static getFriend = () =>axiosClient.get('/posts/friend');
    static getById = (id) =>axiosClient.get(`/posts/${id}`);
    static remove = (id) =>axiosClient.delete(`/posts/${id}`);
    static create = (data)=> axiosClient.post('/posts', data)
}

export default PostService