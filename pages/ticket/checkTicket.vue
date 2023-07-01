<template>
	<view>
		<!-- 航班基本信息 -->
		<view class="flight-list">
				<view class="flight-info">
					<view class="info">
						<view class="title-class">
							<view class="title">06-26 今天出发</view>
							<view class="title"> 全程6小时16分</view>
						</view>

						<view class="title-class">
							<view class="title-time">
								<view>8:00</view>
								<view style="font-size: 16px;">首都</view>
							</view>
							<view style="margin-top: -10px;">--------</view>
							<view class="title-time">
								<view>10:15</view>
								<view style="font-size: 16px;">上海</view>
							</view>
						</view>
						<!-- <view class="title">{{row.name}}</view> -->

						<view class="spec">
							航班K1214|波音773
							<!-- 选择{{row.spec}} 数量:{{row.number}} -->
						</view>
						<!-- 						<view class="price-number">
							<view class="price">￥{{row.price*row.number}}</view>
							<view class="number"></view>
						</view> -->
					</view>
				</view>
		</view>
		<!-- <view class="list"> -->
		<view class="ticket-List">
			<view class="ticket" v-for="ticket in ticketList" :key="ticket.type">
				<view class="type">
					{{ticket.type}}
					<view style="font-size: 5px;margin-left: 12px;">行李20公斤></view>
				</view>
				<view class="price" style="margin-left: 90px;">
					{{ticket.price}}
					<view style="font-size: 5px;margin-left: 20px;">不含税费</view>
				</view>
				<view class="button" @tap="toMakeSure()">
					<view class="button-top" style="">订购</view>
					<view class="button-bottom">有座</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ticketList: [{
						type: '一等票',
						price: '$1000',
					},
					{
						type: '一等票',
						price: '$1000',
					}
				], //票价列表
				flightList:[],
				buylist: [], //订单列表
				goodsPrice: 0.0, //商品合计价格
				sumPrice: 0.0, //用户付款价格
				freight: 12.00, //运费
				note: '', //备注
				int: 1200, //抵扣积分
				deduction: 0, //抵扣价格
				recinfo: {
					id: 1,
					name: "大黑哥",
					head: "大",
					tel: "18816881688",
					address: {
						region: {
							"label": "广东省-深圳市-福田区",
							"value": [18, 2, 1],
							"cityCode": "440304"
						},
						detailed: '深南大道1111号无名摩登大厦6楼A2'
					},
					isDefault: true
				},
				// 乘机人信息
				passengers: {
					number: 2,
					name: ["王文正", "张继泽", "张亚崇"],
					service: [

						{
							name: "正品保证",
							description: "此商品官方保证为正品"
						},
						{
							name: "极速退款",
							description: "此商品享受退货极速退款服务"
						},
						{
							name: "7天退换",
							description: "此商品享受7天无理由退换服务"
						}
					],
					spec: ["XS", "S", "M", "L", "XL", "XXL"],
					comment: {
						number: 102,
						userface: '../../static/img/face.jpg',
						username: '大黑哥',
						content: '很不错，之前买了很多次了，很好看，能放很久，和图片色差不大，值得购买！'
					}
				},
				selectPassenger: null, //选中乘机人

			};
		},
		onReachBottom() {
			uni.showToast({
				title: '触发上拉加载'
			});
			let len = this.ticketList.length;
			if (len >= 40) {
				this.loadingText = '到底了';
				return false;
			}
		},
		onLoad() {
			this.loadmore()
		},
		onShow() {
			//页面显示时，加载订单信息
			uni.getStorage({
				key: 'flightList',
				success: (ret) => {
					this.flightList = ret.data;
					console.log(this.flightList )
					this.goodsPrice = 0;
				}
			});
			uni.getStorage({
				key: 'selectAddress',
				success: (e) => {
					this.recinfo = e.data;
					uni.removeStorage({
						key: 'selectAddress'
					})
				}
			})
		},
		onHide() {

		},
		onBackPress() {
			//页面后退时候，清除订单信息
			this.clearOrder();
		},
		filters: {
			toFixed: function(x) {
				return parseFloat(x).toFixed(2);
			}
		},
		methods: {
			// 列表滚动到底部触发事件（加载更多）
			scrolltolower() {
				this.loadmore()
			},
			// 获取更多列表
			loadmore() {
				for (let i = 0; i < 10; i++) {
					this.indexList.push({

					})
				}
			},
			//选择乘机人
			selectPassenger(index) {
				this.selectPassenger = index;
			},
			clearOrder() {
				uni.removeStorage({
					key: 'buylist',
					success: (res) => {
						this.buylist = [];
						console.log('remove buylist success');
					}
				});
			},
			toMakeSure() {
				//商品列表
				let paymentOrder = [];
				let goodsid = [];
				let len = this.buylist.length;
				for (let i = 0; i < len; i++) {
					paymentOrder.push(this.buylist[i]);
					goodsid.push(this.buylist[i].id);
				}
				if (paymentOrder.length == 0) {
					uni.showToast({
						title: '订单信息有误，请重新购买',
						icon: 'none'
					});
					return;
				}
				//本地模拟订单提交UI效果
				uni.showLoading({
					title: '正在提交订单...'
				})
				setTimeout(() => {
					uni.setStorage({
						key: 'paymentOrder',
						data: paymentOrder,
						success: () => {
							uni.hideLoading();
							uni.redirectTo({
								url: "../order/confirmation?amount=" + this.sumPrice
							})
						}
					})
				}, 1000)

			},
			//选择收货地址
			selectAddress() {
				uni.navigateTo({
					url: '../user/address/address?type=select'
				})
			}
		}
	}
</script>

<style lang="scss">
.passenger {
	width: 86%;
	padding: 20upx 3%;
	margin: 30upx auto 20upx auto;
	box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
	border-radius: 20upx;

	.passenger-title {
		font-size: 28upx;
		font-weight: bold;

	}

	.passenger-info {
		display: flex;
		// // 垂直居中
		align-items: center;
		// // 水平居中
		// justify-content: center;
		// padding: 0 10upx;
		border-radius: 20upx;

		// margin-bottom: 20vw;	
		.passenger-name {
			text-align: center; //字体居中
			width: 100px;
			font-size: 28upx;
			padding: 5upx 20upx;
			border-radius: 8upx;
			margin: 20upx 30upx 20upx 0;
			// background-color: #f6f6f6;
			border: solid 1upx #999;

			&.on {
				padding: 3upx 18upx;
				border: solid 1upx #f47925;
			}
		}
	}
}

.flight-list {
	width: 86%;
	padding: 10upx 3%;
	margin: 30upx auto 20upx auto;
	box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
	border-radius: 20upx;


		.flight-info {
			width: 100%;
			display: flex;

			.info {
				width: 100%;
				height: 30vw;
				overflow: hidden;
				display: flex;
				flex-wrap: wrap;
				position: relative;

				.title-class {
					width: 100%;
					height: 60upx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.title {
						// width: 100%;
						font-size: 28upx;
						font-weight: bold;
						// display: -webkit-box;
						// -webkit-box-orient: vertical;
						// -webkit-line-clamp: 2;
						// text-align: justify;
						// overflow: hidden;
					}

					.title-time {
						font-size: 50upx;
						display: flex;
						justify-content: space-between;
						flex-direction: column;
						/* 在一条轴线上对齐 */
						align-items: center;
					}
				}

				.spec {
					width: 100%;
					font-size: 22upx;
					background-color: #f3f3f3;
					color: #a7a7a7;
					// height: 40upx;
					display: flex;
					// 垂直居中
					align-items: center;
					// 水平居中
					justify-content: center;
					// padding: 0 10upx;
					border-radius: 20upx;
					// margin-bottom: 20vw;	
				}

				.price-number {
					position: absolute;
					width: 100%;
					bottom: 0upx;
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					font-size: 28upx;
					height: 40upx;

					.price {
						color: #f06c7a;
					}

					.number {
						display: flex;
						justify-content: center;
						align-items: center;

					}
				}
			}
		}
	
}

// .list{
// 	display: flex;
// 	justify-content: space-between;
// 	align-items: center;
.ticket-List {
	height: 60px;
	width: 92%;
	padding: 0 4% 3vw 4%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	border-bottom: 1px solid #35353561;

	.ticket {
		width: 100%;
		border-radius: 20upx;
		// background-color: #fff;
		margin: 0 0 15upx 0;

		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;

		.type {
			margin-top: 8px;
			font-size: 30px;
		}

		.price {
			margin-top: 8px;
			font-size: 30px
		}
	}

	.button {
		margin-top: 15px;
		border: 1px solid #f06c7acc;
		border-radius: 8px;
		font-size: 12px;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		flex-direction: column;
		height: 40px;
		text-align: center;

		.button-top {
			background-color: #f06c7acc;
			border-top-left-radius: 8px;
			border-top-right-radius: 8px;
			height: 20px;
			width: 30px;
		}

		.button-bottom {
			border-bottom-left-radius: 8px;
			border-bottom-right-radius: 8px;
			height: 20px;
			width: 30px;
		}
	}
}

// }

// .order{
// 	width: 86%;
// 	padding: 10upx 3%;
// 	margin: 30upx auto 20upx auto;
// 	box-shadow: 0upx 5upx 20upx rgba(0,0,0,0.1);
// 	border-radius: 20upx;
// 	.row{
// 		margin: 20upx 0;
// 		height: 40upx;
// 		display: flex;
// 		.left{
// 			font-size: 28upx;
// 		}
// 		.right{
// 			margin-left: 40upx;
// 			font-size: 26upx;
// 			color: #999;
// 			input{
// 				font-size: 26upx;
// 				color: #999;
// 			}
// 		}
// 	}
// }
// .blck{
// 	width: 100%;
// 	height: 100upx;
// }
.footer {
	width: 92%;
	padding: 0 4%;
	background-color: #fbfbfb;
	height: 100upx;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	font-size: 28upx;
	position: fixed;
	bottom: 0upx;
	z-index: 5;

	.settlement {
		width: 80%;
		display: flex;
		justify-content: flex-end;
		align-items: center;

		.sum {
			width: 50%;
			font-size: 28upx;
			margin-right: 10upx;
			display: flex;
			justify-content: flex-end;

			.money {
				font-weight: 600;
			}
		}

		.btn {
			padding: 0 30upx;
			height: 60upx;
			background-color: #f06c7a;
			color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 30upx;
			border-radius: 40upx;
		}
	}
}

.detail {
	width: 86%;
	padding: 10upx 3%;
	margin: 30upx auto 20upx auto;
	box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
	border-radius: 20upx;

	.row {
		height: 60upx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.nominal {
			font-size: 28upx;
		}

		.content {
			font-size: 26upx;
			color: #f06c7a;
		}
	}
}
</style>