<template>
	<view>
		<view class="header" :style="{position:headerPosition,top:headerTop}">
			<view class="target" v-for="(target,index) in orderList" @tap="select(index)" :key="index" :class="[target.selected?'on':'']">
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
								<view class="pay" @tap="upgradeOrder(row)">升舱</view>
							</block>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				headerPosition:"fixed",
				headerTop:null,
				statusTop:null,
				showHeader:true,
				headerPosition:"fixed",
				headerTop:"0px",
				//订单列表 演示数据
				orderList:[
						{ type:"unpaid",ordersn:0,goods_id: 0, img: '/static/img/goods/p1.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '168.00',payment:168.00,freight:12.00,spec:'规格:S码',numner:1 },
						{ type:"unpaid",ordersn:1,goods_id: 1, img: '/static/img/goods/p2.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '168.00',payment:168.00,freight:12.00,spec:'规格:S码',numner:1 },
						{ type:"back",ordersn:2,goods_id: 1, img: '/static/img/goods/p3.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '168.00',payment:168.00,freight:12.00,spec:'规格:S码',numner:1 },
						{ type:"unreceived",ordersn:3,goods_id: 1, img: '/static/img/goods/p4.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '168.00',payment:168.00,freight:12.00,spec:'规格:S码',numner:1 },
						{ type:"received",ordersn:4,goods_id: 1, img: '/static/img/goods/p5.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '168.00',payment:168.00,freight:12.00,spec:'规格:S码',numner:1 },
						{ type:"completed",ordersn:5,goods_id: 1, img: '/static/img/goods/p6.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '168.00',payment:168.00,freight:12.00,spec:'规格:S码',numner:1 },
						{ type:"refunds",ordersn:6,goods_id: 1, img: '/static/img/goods/p5.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168',payment:168.00,freight:12.00,spec:'规格:S码',numner:1 },
						{ type:"cancelled",ordersn:7,goods_id: 1, img: '/static/img/goods/p5.jpg', name: '商品名称商品名称商品名称商品名称商品名称', price: '￥168',payment:168.00,freight:12.00,spec:'规格:S码',numner:1 }
					],
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
				let Timer = setInterval(()=>{
					let uniHead = document.getElementsByTagName('uni-page-head');
					if(uniHead.length>0){
						this.headerTop = uniHead[0].offsetHeight+'px';
						clearInterval(Timer);//清除定时器
					}
				},1);
			// #endif
			//兼容H5下结算条位置
			// #ifdef H5
				this.footerbottom = document.getElementsByTagName('uni-tabbar')[0].offsetHeight+'px';
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
		    }, 1000);
		},
		onPageScroll(e){
			return;
			//兼容iOS端下拉时顶部漂移
			this.headerPosition = e.scrollTop>=0?"fixed":"absolute";
		},
		mounted() {
			// this.queryAllOrder();
		},
		methods: {
			queryAllOrder(){
				console.log("queryAllOrder")
			    this.api.queryAllOrder().then(res=>{
					let upgradeList=[];
					console.log("trd",res)
					let data=res.data;
					for(let i=0;i<data.length;i++){
						if( data[i].isUse==0 && data[i].seatType=="0" && data[i].isCancelled=='0'){
							// data[i].type='upgrade'
							upgradeList.push(data[i]);
						}
					}
					console.log(upgradeList)
					this.orderList=upgradeList
					
				})	
			},
			upgradeOrder(row){
				console.log("upgradeOrder",row)
				 
				this.api.getFlightQueryAll({flightId:row.flightId,}).then(res=>{
					let FlightInfo=res.data[0]
					console.log("getFlightQueryAll",res.data)
					if(FlightInfo.firstClassNum){
						uni.showLoading({title: "正在查询头等仓余票"});
						let payOrder={
								orderName:"航班"+FlightInfo.aircraftCode+"升舱",
								paymentOrders:["ggrdg"],
								sumPrice: FlightInfo.firstClassPrice-FlightInfo.economyClassPrice
							}
						uni.setStorage({
						    key:"paymentOrder",
							data:payOrder
						})

						uni.hideLoading();
						uni.navigateTo({
							url: "../../pay/payment/payment"
						})
						row.amount=FlightInfo.firstClassPrice-FlightInfo.economyClassPrice
						this.api.upgradeTicket(
							row
						)
						// this.api.upgradeTicket
					}else{
						uni.showToast({title:"该航班票已经没有头等舱余票",icon:"error"}
				)
					}
				})
				// this.api.upgradeTicket(row)
			}
			
		}
	}
</script>

<style lang="scss">
page{
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
	height: var(--status-bar-height);//覆盖样式
	/*  #endif  */
}

.header{
	width: 92%;
	padding: 0 4%;
	height: 50upx;
	display: flex;
	justify-content: center;// 水平居中
	align-items: center;// 垂直居中
	text-align: center;//字体居中
	position: fixed;
	top: 0;
	z-index: 10;
	background-color: #fff;
	/*  #ifdef  APP-PLUS  */
	top: var(--status-bar-height);
	/*  #endif  */
	.title{
		font-size: 36upx;
	}
	
}
	

.order-list{
	// margin-top: 10upx;
	padding-top: 80upx;
	width: 100%;
	.list{
		width: 94%;
		margin: 0 auto;
		.onorder{
			width: 100%;
			height: 50vw;
			display: flex;
			justify-content: center;
			align-content: center;
			flex-wrap: wrap;
			image{
				width: 20vw;
				height: 20vw;
				border-radius: 100%;
			}
			.text{
				width: 100%;
				height: 60upx;
				font-size: 28upx;
				color: #444;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
		.row{
			width: calc(100% - 40upx);
			padding: 10upx 20upx;
			border-radius: 10upx;
			background-color: #fff;
			margin-bottom: 20upx;
			.order-top{
				width: 100%;
				display: flex;
				.aircraftCode{
					width: 20%;
					font-weight: bold;
					font-size: 26upx;
					height: 50upx;
					display: flex;
					align-items: center;
					// text-align: center;//字体居中
				}
				.city{
					width: 50%;
					margin-left: 5%;
					font-weight: bold;
					font-size: 26upx;
					height: 50upx;
					display: flex;
					align-items: center;
					// text-align: center;//字体居中
				}
				.type{
					 width: 30%;
					font-size: 26upx;
					color: #ec652f;
					height: 50upx;
					display: flex;
					justify-content: right;// 水平居中
					align-items: center;
					text-align: center;//字体居中
				}
			}

			.order-info{
				width: 100%;
				padding-top: 2%;
				padding-left: 2%;
				.order-botton{
					// display: flex;
					width: 100%;
					
					.left{
						// display: flex;
						width: 100%;

					}
				}
			}
			.detail{
				display: flex;
				justify-content: flex-end;
				align-items: flex-end;
				height: 60upx;
				font-size: 26upx;
				.sum{
					padding: 0 8upx;
					display: flex;
					align-items: flex-end;
					.price{
						font-size: 30upx;
					}
				}
				
			}
			.btns{
				height: 80upx;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				view{
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
				.default{
					border: solid 1upx #ccc;
					color: #666;
				}
				.pay{
					border: solid 1upx #ec652f;
					color: #ec652f;
				}
			}
		    }
	}
}
</style>
