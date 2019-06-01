//app.js
App({
    serverUrl: "http://localhost:8080",
    userInfo: null,

    setGlobalUserInfo: function(user) {
        wx.setStorageSync("userInfo", user);
    },

    getGlobalUserInfo: function() {
        return wx.getStorageSync("userInfo");
    },
})