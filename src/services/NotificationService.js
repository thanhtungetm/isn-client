import axiosClient from "../configs/axiosClient";

class NotificationService{
    static getAll =     () =>axiosClient.get(`/notifications/`);
    static updateNotifyStatus =     (data) =>axiosClient.put(`/notifications/`,data);
}

export default NotificationService