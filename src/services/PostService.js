import axiosClient from "../configs/axiosClient";

class PostService{
    static get = () =>axiosClient.get('/posts');
    static getById = (id) =>axiosClient.get(`/posts/${id}`);
    static create = (data)=> axiosClient.post('/posts', data, {
        // headers: { "Content-Type": "multipart/form-data" },
    })
}

export default PostService