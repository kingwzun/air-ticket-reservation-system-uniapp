import request from "@/config/tokenRequest.js"

export default {
	// 获取用户信息
	getLoginUser(params){
		return request("/user/getLoginUser",params);
	},
	getUserVip(params){
		return request("/vip/queryAll",params);
	},
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
    // 购买订单
	toOrderPurchase(params){
		return request("/order/purchase",params,{method:"POST"})
	},
	// 查询我 的所有订单
	queryAllOrder(params){
		return request("/order/getOrderByUser",params)
	},
	//退票 
	returnTicket(params){
		return request("/order/returnTicket",params,{method:"POST"})
	},
	// 升舱
	upgradeTicket(params){
		return request("/order/upgrade",params,{method:"POST"})
	},	
	// 改签
	rebuildTicket(params){
		return request("/order/rebook",params,{method:"POST"})
	},
	// 发送请求专门发送旧id
	rebookCancelOrigin(params){
		return request("/order/rebookCancelOrigin",params,{method:"POST"})
	},


// ***************************乘机人**********************************//
   getPassengerByUserId(params){
	   return request("/passengerInformation/getByUserId",params)
   },
	
	
// ***************************物品托运**********************************//
   deleteBaggageById(params){
	   return request("/baggage/delete",params,{method:"POST"})
   },
   updateBaggage(params){
   	   return request("/baggage/updateBaggage",params,{method:"POST"})
   },
   queryAllBaggage(params){
   	   return request("/baggage/queryAll",params)
   },
}
