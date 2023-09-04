<template>
	<view>
		<view class="header" :style="{position:headerPosition,top:headerTop}">
			<view class="target" v-for="(target,index) in orderList" @tap="select(index)" :key="index"
				:class="[target.selected?'on':'']">
				{{target.text}}
				<view v-if="target.orderbyicon" class="icon" :class="target.orderbyicon[target.orderby]"></view>
			</view>
		</view>
		<!-- 占位 -->
		<view class="place"></view>

		<!-- 考虑非APP端长列表和复杂的DOM使用scroll-view会卡顿，所以漂浮顶部选项卡使用page本身的滑动 -->
		<view class="order-list">
			<view class="list">
				<view class="onorder" v-if="orderList.length==0">
					<image src="../../../static/img/noorder.png"></image>
					<view class="text">
						没有相关订单
					</view>
				</view>

				<view class="row" v-for="(row,index) in orderList" :key="index">
					<view class="order-top">
						<view class="aircraftCode"> {{row.aircraftCode}}</view>
						<view class="city"> {{row.departureCity}}-{{row.destinationCity}}</view>
					</view>
					<view class="order-info">
						<view class="order-botton">
							<view class="left"> 订单编号：{{row.orderId}}</view>
							<view class="left">起飞机场：{{row.departureAirport}}</view>
							<view class="left">到达机场：{{row.destinationAirport}}</view>
						</view>
						<view class="btns">
							<block>
								<view class="pay" @tap="rebuildOrder(row)">改签</view>
								<view class="delete" @tap="returnOrder(row)">退票</view>
							</block>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import axios from 'axios'
	import jsonBig from 'json-bigint'
	import toast from '../../../uni_modules/uview-ui/libs/config/props/toast';
	export default {
		data() {
			return {
				headerPosition: "fixed",
				headerTop: null,
				statusTop: null,
				showHeader: true,
				headerPosition: "fixed",
				headerTop: "0px",
				//订单列表 演示数据
				orderList: [],
				date:null,
			};
		},
		onLoad(option) {
			console.log(option.cid); //打印出上个页面传递的参数。
			uni.setNavigationBarTitle({
				title: option.name
			});
			this.queryAllOrder();

			//兼容H5下排序栏位置
			// #ifdef H5
			let Timer = setInterval(() => {
				let uniHead = document.getElementsByTagName('uni-page-head');
				if (uniHead.length > 0) {
					this.headerTop = uniHead[0].offsetHeight + 'px';
					clearInterval(Timer); //清除定时器
				}
			}, 1);
			// #endif
			//兼容H5下结算条位置
			// #ifdef H5
			this.footerbottom = document.getElementsByTagName('uni-tabbar')[0].offsetHeight + 'px';
			// #endif
			// #ifdef APP-PLUS
			this.showHeader = false;
			this.statusHeight = plus.navigator.getStatusbarHeight();
			// #endif
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
		    setTimeout(function () {
		        uni.stopPullDownRefresh();
				// this.queryAllOrder();
		    }, 1000);
			 this.queryAllOrder();
		},
		onPageScroll(e) {
			return;
			//兼容iOS端下拉时顶部漂移
			this.headerPosition = e.scrollTop >= 0 ? "fixed" : "absolute";
		},
		mounted() {
			// this.queryAllOrder();
		},
		methods: {
			queryAllOrder() {
				console.log("queryAllOrder")
				this.api.queryAllOrder().then(res => {
					let upgradeList = [];
					console.log("trd", res)
					let data = res.data;
					for (let i = 0; i < data.length; i++) {
						if (data[i].isUse == 0  && data[i].isCancelled == '0') {
							// data[i].type='upgrade'
							upgradeList.push(data[i]);
						}
					}
					console.log(upgradeList)
					this.orderList = upgradeList

				})
			},
			returnOrder(row) {
				uni.showModal({
					title: '退票',
					content: '确定退订此机票吗？',
					success: (res)=>{
						if (res.confirm) {
							console.log('用户点击确定',row.orderId);
							this.api.returnTicket(row.orderId).then(res=>{
								this.queryAllOrder()
								uni.showToast({
									title: '退票成功',
									icon: 'success',
									duration: 2000,
								})
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

				
			},
			rebuildOrder(row) {
				this.initDate(),
				console.log("rebuildOrder", row)
				uni.showModal({
					title: '确定改签此机票吗？',
					content: '点击确认后，将进入选择新机票页面',
					success: (res)=>{
						if (res.confirm) {
							console.log('用户点击确定',row.orderId);
							uni.navigateTo({
								url: '../../ticket/ticketList?departureCity='+row.departureCity+'&destCity='+row.destinationCity+'&departureTime='+this.date+'&purposeType=rebuildOrder'
								+'&rebuildMoney='+row.amount
								+'&orderId='+row.orderId
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
							
							let bigInt = jsonBig.parse('9999999999999999999');
							console.log(bigInt)
							console.log(parseInt("9999999999999999999"))
						}
					}
				});
				// this.api.returnTicket("returnTicket", row.data)
			},
			initDate(){
				// 创建一个日期对象
				const date = new Date();
				
				// 获取年、月、日，并使用 padStart() 方法补齐前导零
				const year = date.getFullYear();
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const day = date.getDate().toString().padStart(2, '0');
				
				// 拼接成指定的格式
				const formattedDate = `${year}-${month}-${day}`;
				this.date=formattedDate;
				console.log("formattedDate"); // 输出格式化后的日期字符串
			},

		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f3f3f3;
	}

	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		background-color: #fff;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height); //覆盖样式
		/*  #endif  */
	}

	.header {
		width: 92%;
		padding: 0 4%;
		height: 50upx;
		display: flex;
		justify-content: center; // 水平居中
		align-items: center; // 垂直居中
		text-align: center; //字体居中
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: #fff;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);

		/*  #endif  */
		.title {
			font-size: 36upx;
		}

	}

	

	.order-list {
		// margin-top: 60upx;
		padding-top: 73upx;
		width: 100%;

		.list {
			width: 94%;
			margin: 0 auto;

			.onorder {
				width: 100%;
				height: 50vw;
				display: flex;
				justify-content: center;
				align-content: center;
				flex-wrap: wrap;

				image {
					width: 20vw;
					height: 20vw;
					border-radius: 100%;
				}

				.text {
					width: 100%;
					height: 60upx;
					font-size: 28upx;
					color: #444;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}

			.row {
				width: calc(100% - 40upx);
				padding: 10upx 20upx;
				border-radius: 10upx;
				background-color: #fff;
				margin-bottom: 20upx;

				.order-top {
					width: 100%;
					display: flex;

					.aircraftCode {
						width: 20%;
						font-weight: bold;
						font-size: 26upx;
						height: 50upx;
						display: flex;
						align-items: center;
						// text-align: center;//字体居中
					}

					.city {
						width: 50%;
						margin-left: 5%;
						font-weight: bold;
						font-size: 26upx;
						height: 50upx;
						display: flex;
						align-items: center;
						// text-align: center;//字体居中
					}

					.type {
						width: 30%;
						font-size: 26upx;
						color: #ec652f;
						height: 50upx;
						display: flex;
						justify-content: right; // 水平居中
						align-items: center;
						text-align: center; //字体居中
					}
				}

				.order-info {
					width: 100%;
					padding-top: 2%;
					padding-left: 2%;

					.order-botton {
						// display: flex;
						width: 100%;

						.left {
							// display: flex;
							width: 100%;

						}
					}
				}

				.detail {
					display: flex;
					justify-content: flex-end;
					align-items: flex-end;
					height: 60upx;
					font-size: 26upx;

					.sum {
						padding: 0 8upx;
						display: flex;
						align-items: flex-end;

						.price {
							font-size: 30upx;
						}
					}

				}

				.btns {
					height: 80upx;
					display: flex;
					align-items: center;
					justify-content: flex-end;

					view {
						min-width: 120upx;
						height: 50upx;
						padding: 0 20upx;
						border-radius: 50upx;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 28upx;
						margin-left: 20upx;
					}

					.default {
						border: solid 1upx #ccc;
						color: #666;
					}

					.pay {
						border: solid 1upx #ec652f;
						color: #ec652f;
					}

					.delete {
						border: solid 1upx #ec652f;
						color: #ec652f;
					}
				}
			}
		}
	}
</style>