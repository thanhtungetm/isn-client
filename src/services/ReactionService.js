import axiosClient from "../configs/axiosClient";

class ReactionService{
    static like = (postId) =>axiosClient.post(`/reaction/${postId}`);
    static unlike = (postId) =>axiosClient.delete(`/reaction/${postId}`);
}

export default ReactionService