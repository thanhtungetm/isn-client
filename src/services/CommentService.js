import axiosClient from "../configs/axiosClient";

class CommentService{
    static add = (data) =>axiosClient.post(`/comments/`,data);
    static get = (postId) =>axiosClient.get(`/comments/${postId}`);
}

export default CommentService