<template><view>
		<!-- 航班基本信息 -->
	<view class="flight-list">
			<view class="flight-info">
				<view class="info">
					<view class="title-class">
						<view class="title">{{yearAndMonth}} | {{dayString}} |{{paymentOrder.departureCity}}-{{paymentOrder.destCity}}</view>
						<!-- <view class="title"> 全程6小时16分</view> -->
					</view>

					<view class="title-class">
						<view class="title-time">
							<view>{{paymentOrder.departureTime}}</view>
							<view style="font-size: 16px;">{{paymentOrder.departureAirport}}</view>
						</view>
						<view style="margin-top: -10px;">--------</view>
						<view class="title-time">
							<view>{{paymentOrder.arrivalTime}}</view>
							<view style="font-size: 16px;">{{paymentOrder.destinationAirport}}</view>
						</view>
					</view>
					<!-- <view class="title">{{row.name}}</view> -->

					<view class="spec">
						航班{{paymentOrder.flightId}}|波音{{paymentOrder.aircraftCode}}
						
						<!-- 选择{{row.spec}} 数量:{{row.number}} -->
					</view>
					<!-- 						<view class="price-number">
						<view class="price">￥{{row.price*row.number}}</view>
						<view class="number"></view>
					</view> -->
				</view>
			</view>
	</view>
		
		<!-- 乘机人信息 -->
		<view class="passenger" >
			<view class="passenger-info"  v-for="(item,index) in passengers" v-if="selectedPassengers.includes(item.id)">
				<view class="passenger-name"  >{{item.passengerName}}</view>
				<view class="passenger-identificationCard"> {{item.identificationCard}}</view>
			</view>
			<view class="passenger-add" @tap="selectPassenger">
				+选择乘机人
			</view>
		</view>
		
		<!-- 手机号 -->
		<view class="order">			
			<view class="row">
				<view class="left">
					手机号 :
				</view>
				<view class="right">
					<input placeholder="选填,备注内容" v-model="phoneNumber" />
				</view>
			</view>
		</view>
		
		
		<!-- 明细 -->
		<view class="detail">
			<view class="row">
				<view class="nominal">
					机票金额
				</view>
				<view class="content">
					￥{{paymentOrder.seat_money|toFixed}}
				</view>
			</view>

			<view class="row" v-if="conditionData.purposeType=='home' ">
				<view class="nominal">
					会员抵扣
				</view>
				<view class="content">
					￥-{{deduction|toFixed}}
				</view>
			</view>
			<view class="row" v-if="conditionData.purposeType=='rebuildOrder'">
				<view class="nominal">
					原机票抵扣
				</view>
				<view class="content">
					￥-{{deduction|toFixed}}
				</view>
			</view>
		</view>
		<view class="blck">	
		</view>
		<view class="footer">
			<view class="settlement">
				<view class="sum">合计:<view class="money">￥{{sumPrice|toFixed}}</view></view>
				<view class="btn" @tap="toPay">提交订单</view>
			</view>
		</view>

</view></template>

<script>
	import axios from 'axios'
	import jsonBig from 'json-bigint'
import { defineSSRCustomElement } from "vue";
	export default {
		data() {
			return {
				dayString :null,
				yearAndMonth:null,
				sumPrice:0.0,	//用户总付款价格
				phoneNumber:'',
				deduction:0,	//抵扣价格
				passengerPrices:[],//每个人的价格
				
				passengers:[],// 乘机人信息
				selectedPassengers:[],//选中的乘机人编号
				selectSpec:null,
				userId:null,//用户id
				vipStatus:null,
				userDiscountRate:null,//用户会员打折信息
				paymentOrder:null,
				conditionData:null,
				
			};
		},
		onShow() {
			console.log("onShowConfirmation");
			//页面显示时，加载订单信息
			uni.getStorage({
				key:"conditionData",
				success:(res)=>{
					this.conditionData=res.data
					console.log("conditionData",this.conditionData)
				}
			})
			
			uni.getStorage({
				key: 'paymentOrder',
				success: (ret) => {
					this.paymentOrder=ret.data;
					// 获取星期几（0 表示星期日，1 表示星期一，以此类推）
					let date =new Date(this.paymentOrder.originDepartureTime);
					const dayOfWeek = date.getDay();
					// 根据数字返回对应的星期几字符串
					const days = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
					this.dayString=days[dayOfWeek];
					
					this.yearAndMonth= date.getFullYear() + "-" + date.getMonth()+"-"+date.getDate()
					console.log("hello confirmation")
					console.log(this.paymentOrder )
					// this.sumPrice =0.0;
					
					// 获取用户和乘机人信息
					this.getPassenger();
					// console.log("paymentOrder");	
				}
			});


			
		},
		onHide() {
			
		},
		onBackPress() {
			//页面后退时候，清除订单信息
			this.clearOrder();
		},
		filters: {
			toFixed:function(x) {
				return parseFloat(x).toFixed(2);
			}
		},

		methods: {
			
			// 获取用户和乘机人信息
			getPassenger(){
				//if userId ==null  then getUserId
				if(!this.userId){
					this.userId=uni.getStorageSync('userInfo').id
					this.userDiscountRate=uni.getStorageSync("userInfo").vipStatus;
				}
				// if passengerList is null 
				if(this.passengers.length==0){
					console.log("this.passengers.length==0")
					uni.setStorage({
						key: 'selectedPassengers',
						data: this.selectedPassengers,
					});
					this.api.getPassengerByUserId({id:this.userId}).then(res=>{
						this.passengers=res.data;
						console.log("res",res);
						uni.setStorage({
							key: 'Passengers',
							data: this.passengers,
						});
						// prevent no selected
						this.selectedPassengers.push(1);
						uni.setStorage({
							key: 'selectedPassengers',
							data: this.selectedPassengers,
						});
						console.log("selectedPassengers",this.selectedPassengers)	
						
						
						//get vipInfo
						console.log("getVipInfo")
						this.api.getUserVip().then(res=>{
							let vipData=res.data.records;
							for(let i=0;i<vipData.length;i++){
								if(vipData[i].level==this.userDiscountRate){
									this.userDiscountRate=vipData[i].discountRate;
									break;
								}
							};
							console.log("this.userDiscountRate",this.userDiscountRate)
							
							if(this.conditionData.purposeType=='rebuildOrder'){
								this.deduction=this.conditionData.rebuildMoney
								this.sumPrice=Math.max(0,(this.selectedPassengers.length*this.paymentOrder.seat_money)-this.deduction)
							}	
							else{
								this.sumPrice=(this.selectedPassengers.length*this.paymentOrder.seat_money) - this.paymentOrder.seat_money*(1-this.userDiscountRate)
								this.deduction=this.paymentOrder.seat_money*(1-this.userDiscountRate)
							}
							
						})
						
					
					});
					return //结束掉，不执行后面，因为是多线程，有进程问题
				}

                console.log("this.passengers.length！=0")
				// read selected 
				uni.getStorage({
					key:'selectedPassengers',
					success: (e) => {
						this.selectedPassengers = e.data;
						if(this.conditionData.purposeType=='rebuildOrder'){
							this.deduction=this.conditionData.rebuildMoney
							this.sumPrice=Math.max(0,(this.selectedPassengers.length*this.paymentOrder.seat_money)-this.deduction)
						}	
						else{
							this.sumPrice=(this.selectedPassengers.length*this.paymentOrder.seat_money) - this.paymentOrder.seat_money*(1-this.userDiscountRate)
							this.deduction=this.paymentOrder.seat_money*(1-this.userDiscountRate)
						}
						// this.sumPrice=(this.selectedPassengers.length*this.paymentOrder.seat_money) - this.paymentOrder.seat_money*(1-this.userDiscountRate)
						// this.deduction=this.paymentOrder.seat_money*(1-this.userDiscountRate)
					}
				})
				console.log(this.selectedPassengers.length)
				
			},
			

			toPay(){
				let len = this.selectedPassengers.length;
				if(len==0){
					uni.showToast({title:'请至少选择一个乘机人',icon:'none'});
					return
				}
				//generate paymetntOrders
				let paymentOrders = [];
				
				for(let i=0;i<len;i++){
					let passenger=this.passengers[ this.selectedPassengers[i]-1 ];
					console.log(passenger)
					console.log( "22selectedPassengers",this.selectedPassengers[i])
					if(i==0){
						paymentOrders.push({
							flightId:this.paymentOrder.flightId,
							seatType:this.paymentOrder.seat_type,
							// bookingPerson:this.userId,
							passenger:passenger.id,
							amount: this.paymentOrder.seat_money*this.userDiscountRate,
						});
					}else{
						paymentOrders.push({
							flightId:this.paymentOrder.flightId,
							seatType:this.paymentOrder.seat_type,
							// bookingPerson:this.userId,
							passenger:passenger.id,
							amount:this.paymentOrder.seat_money,
						});
					}
					console.log(paymentOrders)

				}
				 let payOrder={
					 orderName:"航班"+this.paymentOrder.flightId,
					 paymentOrders:paymentOrders,
					 sumPrice:this.sumPrice
				 }
				 console.log("payOrder",payOrder)
				uni.setStorage({
				    key:"paymentOrders",
					data:payOrder
				})
				console.log("payOrders",paymentOrders)

				// uni.showLoading({
				// 	title:'正在提交订单...'
				// })
				// 改签
				if(this.conditionData.purposeType=='rebuildOrder'){
					let rebuildOrder={
							flightId:this.paymentOrder.flightId,
							seatType:this.paymentOrder.seat_type,
							// bookingPerson:this.userId,
							passenger:this.passengers[ this.selectedPassengers[0]-1 ].id,
							amount: this.paymentOrder.seat_money-this.deduction,
						}
						console.log("rebuildOrder",rebuildOrder)
					this.api.rebookCancelOrigin(this.conditionData.orderId).then(			
						this.api.rebuildTicket(rebuildOrder).then(res=>{
							console.log("SuccessfulRebuildTicket",res.data)
						})
					)
				}else{
					this.api.toOrderPurchase({
						orders:paymentOrders
					}).then(res => {
						console.log("SuccessfulPurchase",res.data)
					
					});
				}

				
				uni.navigateTo({
					url: "../pay/payment/payment"
				})
				// uni.hideLoading()
			
			},
			//选择乘机人
			selectPassenger(){
				uni.navigateTo({
					url:'../user/passenger/passenger?type=select'
				})
			},

		}
	}
</script>

<style lang="scss">
.passenger{
	width: 86%;
	padding: 20upx 3%;
	margin: 30upx auto 20upx auto;
	box-shadow: 0upx 5upx 20upx rgba(0,0,0,0.1);
	border-radius: 20upx;
	.passenger-title{
		font-size: 28upx;
		font-weight: bold;
		
	}	
	.passenger-info{
		width:100%;
		height: 50px;
		align-items: center;

		border-bottom: solid 1upx #999;
		.passenger-name{
			margin-left: 20px;
			font-weight: bold;
			width:100%;
			font-size: 15px;
			padding: 5upx 0px;		
		}
		.passenger-identificationCard{
			margin-left:20px;
			width:100%;
			font-size: 10px;
			
		}

	}
	.passenger-add{
		height: 40px;
		line-height: 40px;
		text-align: center;//字体居中
		color: #f06c7a;
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
.order{
	width: 86%;
	padding: 10upx 3%;
	margin: 30upx auto 20upx auto;
	box-shadow: 0upx 5upx 20upx rgba(0,0,0,0.1);
	border-radius: 20upx;
	.row{
		margin: 20upx 0;
		height: 40upx;
		display: flex;
		.left{
			font-size: 28upx;
		}
		.right{
			margin-left: 40upx;
			font-size: 26upx;
			color: #999;
			input{
				font-size: 26upx;
				color: #999;
			}
		}
	}
}
.blck{
	width: 100%;
	height: 100upx;
}
.footer{
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
		
		.settlement{
			width: 80%;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			.sum{
				width: 50%;
				font-size: 28upx;
				margin-right: 10upx;
				display: flex;
				justify-content: flex-end;
				.money{
					font-weight: 600;
				}
			}
			.btn{
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
.detail{
	width: 86%;
	padding: 10upx 3%;
	margin: 30upx auto 20upx auto;
	box-shadow: 0upx 5upx 20upx rgba(0,0,0,0.1);
	border-radius: 20upx;
	.row{
		height: 60upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.nominal{
			font-size: 28upx;
		}
		.content{
			font-size: 26upx;
			color: #f06c7a;
		}
	}
}
</style>
