import uuidv4 from "uuidv4";
import report from "./report";
export function getUUID(success, fail) {
    getItem("uuid", success, fail);
}
export function setUUID(success) {
    setItem("uuid", uuidv4(), success);
}
const config = {
    appKey: "",
    apiUrl: "http://www.test.com",
    prefix: "hwet",
    version: "1.0.0"
};
class WeChatTracker {
    constructor(option) {
        this.config = Object.assign(config, option);
        this.baseInfomation = {};
    }
    init() {
        getUUID(uuid => {
            report("init", Object.assign(this.config, { uuid }));
            this.baseInfomation = Object.assign(this.baseInfomation, { uuid });
        }, () => {
            setUUID(uuid => {
                report("init", Object.assign(this.config, { uuid }));
                this.baseInfomation = Object.assign(this.baseInfomation, { uuid });
            });
        });
        report("init", config);
    }
    pvReport(page) {
        const data = {
            url: page.route
        };
        report("pv", Object.assign(this.baseInfomation, data));
    }
}
export default WeChatTracker;
export function getItem(key, success, fail) {
    wx.getStorage({
        key: config.prefix + key,
        success,
        fail
    });
}
export function setItem(key, data, success) {
    wx.setStorage({
        key: config.prefix + key,
        data: data
    });
}
export { config };
