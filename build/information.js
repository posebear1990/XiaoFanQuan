function getInformation() {
    const { brand, // 品牌 1.5.0 版本以上
    model, // 型号
    pixelRatio, //设备像素比
    screenWidth, // 屏幕宽度 1.1.0 版本以上
    screenHeight, // 屏幕高度 1.1.0 版本以上
    windowWidth, // 可使用窗口宽度
    windowHeight, // 可使用窗口高度
    language, // 微信语言
    version, // 微信版本号
    system, // 操作系统版本
    platform // 客户端平台
     } = wx.getSystemInfoSync();
    return {
        brand,
        model,
        pixelRatio,
        resolution: screenWidth
            ? screenWidth + "x" + screenHeight
            : windowWidth + "x" + windowHeight,
        language,
        version,
        system,
        platform
    };
}
export { getInformation };
