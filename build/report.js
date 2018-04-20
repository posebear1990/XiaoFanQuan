import { getInformation } from "./information";
export default function report(type, config) {
    const information = getInformation();
    wx.request({
        url: config.apiUrl,
        data: information
    });
}
