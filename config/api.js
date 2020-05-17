module.exports = {
  baseUrl: "https://api.fanfou.com",
  accessToken: "https://fanfou.com/oauth/access_token",
  userTimeLine: "/statuses/user_timeline.json",
  homeTimeLine: "/statuses/home_timeline.json",
  update: "/statuses/update.json",
  photoUpload: "/photos/upload.json",
  deleteStatus: "/statuses/destroy.json",
  addFavorit: "/favorites/create/:id.json",
  removeFavorit: "/favorites/destroy/:id.json",
  mentionLine: "/statuses/mentions.json",
  friends: "/users/friends.json",
  notification: '/account/notification.json',
  publicTimeline: '/search/public_timeline.json'
};
