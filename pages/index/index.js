const app = getApp()

Page({
    data: {
		// 用于分页的属性
		totalPage: 1,
		pageNum: 1,
		screenWidth: 350,
		videoList: [],
		serverUrl: '',
		searchContent: ''
    },

    onLoad: function(params) {
		var me = this;
		
		var screenWidth = wx.getSystemInfoSync().windowWidth;
		me.setData({
			screenWidth: screenWidth
		});

		var searchContent = params.search;
		var isSaveRecord = params.isSaveRecord;
		if (isSaveRecord == null || isSaveRecord == '' || isSaveRecord == undefined) {
			isSaveRecord = 0;
		}

		me.setData({
			searchContent: searchContent
		});

		// 获取当前的分页数
		var pageNum = me.data.pageNum;
		me.getAllVideoList(pageNum, isSaveRecord);
    },

	getAllVideoList: function (pageNum, isSaveRecord) {
		var me = this;
		wx.showLoading({
			title: '加载中，请等待...',
		})

		var serverUrl = app.serverUrl;
		var searchContent = me.data.searchContent;
		wx.request({
			url: serverUrl + '/video/queryAll?pageNum=' + pageNum + "&isSaveRecord=" + isSaveRecord,
			method: 'POST',
			data: {
				videoDesc: searchContent
			},
			success: function (res) {
				console.log(res.data)
				wx.hideLoading();
				wx.hideNavigationBarLoading();
				// 停止当前页面下拉刷新
				wx.stopPullDownRefresh();

				// 判断当前页pageNum是否是第一页，如果是第一页，那么设置videoList为空
				if (pageNum === 1) {
					me.setData({
						videoList: []
					});
				}

				var videoList = res.data.data.rows;
				var newVideoList = me.data.videoList;

				me.setData({
					videoList: newVideoList.concat(videoList),
					pageNum: pageNum,
					totalPage: res.data.data.total,
					serverUrl: serverUrl
				});
			}
		})
	},

	// 上拉刷新
	onReachBottom: function () {
		var me = this;
		var currentPage = me.data.pageNum;
		var totalPage = me.data.totalPage;

		// 判断当前页数和总页数是否相等，如果想的则无需查询
		if (currentPage === totalPage) {
			wx.showToast({
				title: '已经没有视频啦~~',
				icon: "none"
			})
			return;
		}

		var pageNum = currentPage + 1;
		me.getAllVideoList(pageNum, 0);
	},

	// 下拉刷新，需要在 index.json 配置
	onPullDownRefresh: function () {
		wx.showNavigationBarLoading();
		this.getAllVideoList(1, 0);
	},

	showVideoInfo: function (e) {
		var me = this;
		var videoList = me.data.videoList;
		var arrindex = e.target.dataset.arrindex;
		var videoInfo = JSON.stringify(videoList[arrindex]);

		wx.redirectTo({
			url: '../videoinfo/videoinfo?videoInfo=' + videoInfo
		})
	}
})