const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        bgmList: [],
        serverUrl: "",
        videoParams: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(params) {
        var me = this;
        var serverUrl = app.serverUrl;
        me.setData({
            videoParams: params
        })
        wx.showLoading({
            title: '请等待...',
        });
        wx.request({
            url: serverUrl + '/bgm/list',
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                console.log(res)
                wx.hideLoading();
                if (res.data.status == 200) {
                    var bgmList = res.data.data;
                    me.setData({
                        bgmList: bgmList,
                        serverUrl: serverUrl
                    });
                } else if (res.data.status == 502) {
                    wx.showToast({
                        title: res.data.msg,
                        duration: 2000,
                        icon: "none",
                        success: function() {
                            wx.redirectTo({
                                url: '../userLogin/login',
                            })
                        }
                    });
                }
            }
        })
    },

    upload: function(e) {
        var me = this;
        console.log(e)
        var bgmId = e.detail.value.bgmId;
        var desc = e.detail.value.desc;

        var duration = me.data.videoParams.duration;
        var tmpHeight = me.data.videoParams.tmpHeight;
        var tmpWidth = me.data.videoParams.tmpWidth;
        var tmpVideoUrl = me.data.videoParams.tmpVideoUrl;
        var tmpCoverUrl = me.data.videoParams.tmpCoverUrl;
        
        wx.showLoading({
            title: '上传中...',
        });

        var serverUrl = app.serverUrl;
		var userInfo = app.getGlobalUserInfo();

        wx.uploadFile({
            url: serverUrl + '/video/upload',
            formData: {
                userId: userInfo.id,
                bgmId: bgmId,
                desc: desc,
                videoSeconds: duration,
                videoHeight: tmpHeight,
                videoWidth: tmpWidth
            },
            filePath: tmpVideoUrl,
            name: 'file',
            header: {
                'content-type': 'application/json', // 默认值
            },
            success: function(res) {
				wx.hideLoading();
                var data = JSON.parse(res.data);
                if (data.status == 200) {
					wx.showToast({
						title: '上传成功!',
						icon: "success"
					});

                    // var videoId = data.data;

                    // wx.uploadFile({
                    //     url: serverUrl + '/video/uploadCover',
                    //     formData: {
                    //         userId: app.userInfo.id,
                    //         videoId: videoId
                    //     },
                    //     filePath: tmpCoverUrl,
                    //     name: 'file',
                    //     header: {
                    //         'content-type': 'application/json' // 默认值
                    //     },
                    //     success: function(res) {
                    //         var data = JSON.parse(res.data);
                    //         wx.hideLoading();
                    //         if (data.status == 200) {
                    //             wx.showToast({
                    //                 title: '上传成功!~~',
                    //                 icon: "success"
                    //             }); 
                    //         } else {
                    //             wx.showToast({
                    //                 title: '上传失败!~~',
                    //                 icon: "success"
                    //             });
                    //         }
                    //     }
                    // })
                } else if (res.data.status == 502) {
                    wx.showToast({
                        title: res.data.msg,
                        duration: 2000,
                        icon: "none"
                    });
                } else {
                    wx.showToast({
                        title: '上传失败!~~',
                        icon: "success"
                    });
                }
            }
        })
    }
})