export function set(key, value) {
  const username = wx.getStorageSync("username");
  wx.setStorageSync(`${username}:${key}`, value);
}

export function get(key) {
  const username = wx.getStorageSync("username");
  return wx.getStorageSync(`${username}:${key}`);
}
