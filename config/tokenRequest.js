const defauls = {
	method: "GET",
	loading: true
}

// 全局请求封装
export default (url, data = {}, config = defauls) => {
	console.log('%c请求拦截：', ' background:orange', data);
	console.log(url);
	const token = uni.getStorageSync('token')? uni.getStorageSync('token') :"";
	const authorization = token ? uni.getStorageSync('token') : "";
	

	console.log(authorization)
	if (config.loading) {
		uni.showLoading({
			title: "加载中",
			mask: true
		});
	};
	return new Promise((resolve, reject) => {
		uni.request({
			header: {
				authorization
			},
			url:  'http://localhost:8081/atrs'+url,
			method: config.method,
			data,
			success(response) {
				 console.log('%c响应拦截：', ' background:green', response);
				if (response.data.code === 3001) {
					logout()
				}
				resolve(response.data);
			},
			fail(err) {
				uni.showToast({
					icon: "none",
					title: '服务响应失败'
				});
				console.error("服务响应失败");
				reject(err);
			},
			complete() {
				uni.hideLoading();
			}
		});
	});
};

