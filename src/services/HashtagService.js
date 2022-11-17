import axiosClient from "../configs/axiosClient";

class HashtagService{
    static search = (name) =>axiosClient.get(`/hashtags/${name}`);
}

export default HashtagService