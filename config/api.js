import request from "@/config/tokenRequest.js"

export default {
	// 密码登录
	passwordLogin(params) {
		return request("/user/login", params,{method:"POST"})
	},

	// 短信登录
	noteLogin(params) {
		return request("/platform/metadata/login", params)
	},

	// 获取验证码：用于短信登陆、密码找回、用户注销
	getAuthCode(params) {
		return request("/platform/metadata/sms", params)
	},
	// 获取注册账号验证码
	getRegistAuthCode(params) {
		return request("/platform/metadata/sms1", params)
	},

	// 登录者信息
	getMyInfo(params) {
		return request("/platform/metadata/bindinfo", params)
	},

// ***************************航班**********************************//
	// 查询航班信息
	getFlightQueryAll(params){
		return request("/flight/queryAll", params)
	},

// ***************************订单**********************************//
    toOrderPurchase(params){
		return request("/order/purchase",params,{method:"POST"})
	},


// ***************************乘机人**********************************//
   getPassengerByUserId(params){
	   return request("/passengerInformation/getByUserId",params)
   },
	
}
