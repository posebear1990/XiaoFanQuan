var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function uuidv4() {
    return "test";
}
function report(type, config) {
    var information = getInformation();
    console.log("report", {
        url: config.apiUrl,
        data: information
    });
    wx.request({
        url: config.apiUrl,
        data: information
    });
}
function getItem(key) {
    return new Promise(function (resolve, reject) {
        wx.getStorage({
            key: key,
            success: resolve,
            fail: reject
        });
    });
}
function setItem(key, data, success) {
    wx.setStorage({
        key: key,
        data: data
    });
}
function getUUID() {
    return getItem("uuid");
}
function setUUID(success) {
    setItem("uuid", uuidv4(), success);
}
function getInformation() {
    var _a = wx.getSystemInfoSync(), brand = _a.brand, // 品牌 1.5.0 版本以上
    model = _a.model, // 型号
    pixelRatio = _a.pixelRatio, //设备像素比
    screenWidth = _a.screenWidth, // 屏幕宽度 1.1.0 版本以上
    screenHeight = _a.screenHeight, // 屏幕高度 1.1.0 版本以上
    windowWidth = _a.windowWidth, // 可使用窗口宽度
    windowHeight = _a.windowHeight, // 可使用窗口高度
    language = _a.language, // 微信语言
    version = _a.version, // 微信版本号
    system = _a.system, // 操作系统版本
    platform = _a.platform // 客户端平台
    ;
    return {
        brand: brand,
        model: model,
        pixelRatio: pixelRatio,
        resolution: screenWidth
            ? screenWidth + "x" + screenHeight
            : windowWidth + "x" + windowHeight,
        language: language,
        version: version,
        system: system,
        platform: platform
    };
}
var WeChatTracker = /** @class */ (function () {
    function WeChatTracker(option) {
        this.config = {
            appKey: "",
            apiUrl: "http://www.test.com",
            prefix: "hwet",
            version: "1.0.0"
        };
        this.baseInfomation = {};
        this.uuid = "";
        this.config = Object.assign(this.config, option);
    }
    WeChatTracker.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var uuid, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("init");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, getUUID()];
                    case 2:
                        uuid = _a.sent();
                        report("init", Object.assign(this.config, { uuid: uuid }));
                        this.baseInfomation = Object.assign(this.baseInfomation, { uuid: uuid });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        setUUID(function (uuid) {
                            report("init", Object.assign(_this.config, { uuid: uuid }));
                            _this.baseInfomation = Object.assign(_this.baseInfomation, { uuid: uuid });
                            _this.uuid = uuid;
                        });
                        return [3 /*break*/, 4];
                    case 4:
                        report("init", this.config);
                        return [2 /*return*/];
                }
            });
        });
    };
    WeChatTracker.prototype.pvReport = function (page) {
        var data = {
            url: page.route
        };
        report("pv", Object.assign(this.config, this.baseInfomation, data));
    };
    return WeChatTracker;
}());
export { WeChatTracker };
