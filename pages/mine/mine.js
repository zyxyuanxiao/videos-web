const app = getApp()

Page({
  	data: {
		faceUrl: "../resource/images/noneface.png",
  	},

	onLoad: function(params) {
		var me = this;
		var user = app.userInfo;
		var userId = user.id;
		var serverUrl = app.serverUrl;

		wx.showLoading({
			title: '请等待...',
		});

		wx.request({
			url: serverUrl + '/user/query?userId=' + userId,
			method: "POST",
			header: {
				'content-type': 'application/json', // 默认值
			},
			success: function(res) {
				console.log(res.data.data);
				wx.hideLoading();
				if (res.data.status == 200) {
					var userInfo = res.data.data;
					var faceUrl = "../resource/images/noneface.png";
					if (userInfo.faceImage != null && userInfo.faceImage != '' && userInfo.faceImage != undefined) {
						faceUrl = serverUrl + userInfo.faceImage;
					}
					me.setData({
						faceUrl: faceUrl,
						fansCounts: userInfo.fansCounts,
						followCounts: userInfo.followCounts,
						receiveLikeCounts: userInfo.receiveLikeCounts,
						nickname: userInfo.nickname,
					});
				}
			}
		})
	},

	logout: function () {
		var user = app.userInfo;
		var serverUrl = app.serverUrl;
		wx.showLoading({
			title: '请等待...',
		});
		// 调用后端
		wx.request({
			url: serverUrl + '/logout?userId=' + user.id,
			method: "POST",
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				console.log(res.data);
				wx.hideLoading();
				if (res.data.status == 200) {
					// 注销成功
					wx.showToast({
						title: '注销成功',
						icon: 'success',
						duration: 2000
					});
					app.userInfo = null;
					// 页面跳转
					wx.redirectTo({
						url: '../userLogin/login',
					})
				}
			}
		})
	},

	changeFace: function () {
		var me = this;
		var serverUrl = app.serverUrl;
		var user = app.userInfo;

		wx.chooseImage({
			count: 1,
			sizeType: ['compressed'],
			sourceType: ['album'],
			success: function (res) {
				var tempFilePaths = res.tempFilePaths;
				console.log(tempFilePaths);

				wx.showLoading({
					title: '上传中...',
				})
				
				wx.uploadFile({
					url: serverUrl + '/user/uploadFace?userId=' + user.id,  
					filePath: tempFilePaths[0],
					name: 'file',
					header: {
						'content-type': 'application/json', // 默认值
					},
					success: function (res) {
						var data = JSON.parse(res.data);
						console.log(data);
						wx.hideLoading();
						if (data.status == 200) {
							wx.showToast({
								title: '上传成功!~~',
								icon: "success"
							});

							var imageUrl = data.data;
							me.setData({
								faceUrl: serverUrl + imageUrl
							});

						} else if (data.status == 500) {
							wx.showToast({
								title: data.msg
							});
						} else if (res.data.status == 502) {
							wx.showToast({
								title: res.data.msg,
								duration: 2000,
								icon: "none",
								success: function () {
									wx.redirectTo({
										url: '../userLogin/login',
									})
								}
							});
						}
					}
				})
			}
		})
	},
})