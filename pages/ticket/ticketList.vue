<template>
	<view>
		<view v-if="showHeader" class="status" :style="{position:headerPosition,top:statusTop}"></view>
		
		
		<view v-if="showHeader" class="header" :style="{position:headerPosition,top:headerTop}">
			<view class="header-top">
				<view class="back"><view class="icon xiangqian" @tap="back" v-if="showBack"></view></view>
				<view class="title">{{conditionData.departureCity}} ⇒ {{conditionData.destCity}}</view>
				<view class="icon-btn">
					<view class="icon tongzhi" @tap="toChat"></view>
				</view>
			</view>
			<view class="header-botton">
				<!-- 日期选择 -->
				<calendarTab @click="pickerDate"></calendarTab>
			</view>
		</view>

		
		<!-- 占位 -->
		<view v-if="showHeader" class="place"></view>
		

		
		<!-- 机票列表 -->
		<view class="flight-list">
			<view class="tis" v-if="flightData.length==0">今日无飞机哦~</view>
            <view class="row" v-for="(row,index) in flightData" :key="index" >
				<!-- 机票列表 -->
				<uni-list >
					<!-- 机票信息 -->
					<view class="flight-info" @tap="buy(row)">
						<view class="info-top">
							<view class="info-left">
								<view class="time">
									<view class="departureTime"> {{row.departureTime}}</view>
									<view class="arrivalTime">{{row.arrivalTime}}</view>
								</view>
								<view class="airport">
									<view>{{row.departureAirport}}</view>
									<view>{{row.destinationAirport}}</view>									
								</view>

							</view>
							<view class="info-right">
								<view class="price">￥{{row.economyClassPrice}}</view>
								<text>经济舱</text>
							</view>
						</view>
						<view class="info-botton">
							<view class="aircraftCode">飞机编号：{{row.aircraftCode}}</view>
							<view class="firstClassPrice">头等舱￥{{row.firstClassPrice}}</view>
						</view>
					</view>
				</uni-list>

			</view>
        </view>
		
		
		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="discard" @tap="hideSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer" @tap.stop="discard">
				<view class="content">
					<view class="title">选择规格：</view>
					<view class="sp">
						<view @tap="toMakeSure(1)">头等舱： {{this.buyData.firstClassPrice}}</view>						
						<view @tap="toMakeSure(2)">经济舱： {{this.buyData.economyClassPrice}}</view>
					</view>
				</view>
				<view class="btn"><view class="button" @tap="hideSpec">取消</view></view>
			</view>
		</view>
		<!-- 脚部菜单 -->
		<view class="footer" :style="{bottom:footerbottom}">
			<view class="settlement">
				<view class="btn" @tap="toConfirmation">结算({{selectedList.length}})</view>
			</view>
		</view>
	</view>
</template>

<script>
import calendarTab from '@/components/calendar-tab/calendar-tab.vue'
	export default {
		components: {
			calendarTab,
		},
		data() {
			return {
				showBack:true,//显示back icon
				sumPrice:'0.00',
				headerPosition:"fixed",
				headerTop:null,
				statusTop:null,
				showHeader:true,
				selectedList:[],
				conditionData:{
					departureCity:null,
					destCity:null,
					departureTime:null
				},
				// 列表信息
				flightData: [],
				buyData:[],
				specClass: '',//规格弹窗css类，控制开关动画
				//控制滑动效果
				theIndex:null,
				oldIndex:null,
				isStop:false
			}
		},
		onPageScroll(e){
			//兼容iOS端下拉时顶部漂移
			this.headerPosition = e.scrollTop>=0?"fixed":"absolute";
			this.headerTop = e.scrollTop>=0?null:0;
			this.statusTop = e.scrollTop>=0?null:-this.statusHeight+'px';
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
		    setTimeout(function () {
		        uni.stopPullDownRefresh();
		    }, 1000);
		},
		onLoad() {

			//兼容H5下结算条位置
			// #ifdef H5
				this.footerbottom = document.getElementsByTagName('uni-tabbar')[0].offsetHeight+'px';
			// #endif
			// #ifdef APP-PLUS
			this.showHeader = false;
			this.statusHeight = plus.navigator.getStatusbarHeight();
			// #endif
			
			
			
		},
		mounted() {
			this.queryAll();
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
			this.conditionData=option
			console.log(this.conditionData)
		},
		methods: {
			//返回上一页
			back() {
				uni.navigateBack();
			},
			// 客服
			toChat(){
				this.queryAll();
				uni.navigateTo({
					url:"../msg/chat/chat?name=客服008"
				})
			},
			// 字符串时间格式化
			dateFormat(time) {
				let date = new Date(time);
				let year = date.getFullYear();
				// 在日期格式中，月份是从0开始的，因此要加0，使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
				let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
				let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
				let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
				// 拼接
				return hours + ":" + minutes;
			},
			// 格式化日期
			dateFormat2(date){
				// 创建一个日期对象
				// const date = new Date();
				
				// 获取年、月、日，并使用 padStart() 方法补齐前导零
				const year = date.getFullYear();
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const day = date.getDate().toString().padStart(2, '0');
				
				// 拼接成指定的格式
				const formattedDate = `${year}-${month}-${day}`;
				this.conditionData.departureTime=formattedDate
				console.log(this.conditionData.departureTime); // 输出格式化后的日期字符串
			},
			// 查询所有数据
			queryAll() {
				this.api.getFlightQueryAll(
					 {
						pageNum: 1,
						pageSize: 10,
						departureCity: this.conditionData.departureCity,
						destinationCity: this.conditionData.destCity,
						aircraftCode: this.conditionData.aircraftCode,
						departureTime: this.conditionData.departureTime
					}).then(res => {
						if(res.code === 200){
							this.flightData = res.data.records
							console.log("2333333")
							for(let i=0;i<this.flightData.length;i++){
								this.flightData[i].originDepartureTime=this.flightData[i].departureTime;
								this.flightData[i].originArrivalTime=this.flightData[i].arrivalTime;
								this.flightData[i].departureTime=this.dateFormat(this.flightData[i].departureTime);	
								this.flightData[i].arrivalTime=this.dateFormat(this.flightData[i].arrivalTime);
							}
						  console.log(this.flightData)
						} else {
							console.log("333333")
							uni.showToast({
							  title: res.data.data,
							  icon: 'none'
							});
						}
					})
			},
			// 选择日期
			pickerDate(e) {
				console.log(e)
				console.log('========================')
				console.log('自定义下拉刷新被触发')
				this.curDate = e
				if (this.$refs.uWaterfall) {
					this.$refs.uWaterfall.clear();
				}
				this.list = []
				this.page = 1
				this.status = 'loading'
				this.dateFormat2(e)
				this.queryAll()
			},			
			//规格弹窗
			showSpec(fun) {
				console.log('show');
				this.specClass = 'show';
				this.specCallback = fun;
			},
			specCallback(){
				return;
			},
			//关闭规格弹窗
			hideSpec() {
				this.specClass = 'hide';
				//回调
			
				this.selectSpec&&this.specCallback&&this.specCallback();
				this.specCallback = false;
				setTimeout(() => {
					this.specClass = 'none';
				}, 200);
			},
			discard() {
				//丢弃
			},
			// 去确认订单界面
			toMakeSure(checkNum) {
				let seat_money
				if(checkNum==1){
					seat_money=this.buyData.firstClassPrice;
				}else{
					seat_money=this.buyData.economyClassPrice;
				}
				let paymentOrder={
					flightId:this.buyData.flightId,
					seat_type:checkNum,
					seat_money:seat_money,
					aircraftCode:this.buyData.aircraftCode,
					
					departureAirport:this.buyData.departureAirport,
					departureCity:this.buyData.departureCity,
					destinationAirport:this.buyData.destinationAirport,
					
					destCity:this.buyData.destinationCity,
					destinationCity:this.buyData.desdtinationCity,
					departureTime:this.buyData.departureTime,
					arrivalTime:this.buyData.arrivalTime,
					originDepartureTime:this.buyData.originDepartureTime,
					originArrivalTime:this.buyData.originArrivalTime,
					
				};
				//本地模拟订单提交UI效果
				uni.showLoading({
					title: '正在查询订单...'
				})
				setTimeout(() => {
					uni.setStorage({
						key: 'paymentOrder',
						data: paymentOrder,
						success: () => {
							uni.hideLoading();
							uni.navigateTo({
								url: "../order/confirmation"
							})
						}
					})
				}, 1000)
			
			},
			//点击选择头等舱和经济舱界面
			buy(row){
				this.buyData=row
				if(this.selectSpec==null){
					return this.showSpec(()=>{
						this.toConfirmation();
					});
				}
				this.toConfirmation();
			},		
		}
	}
</script>
<style lang="scss">
	page{position: relative;background-color: #fff;}
	@keyframes showPopup {
			0% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}
		@keyframes hidePopup {
			0% {
				opacity: 1;
			}
			100% {
				opacity: 0;
			}
		}
		@keyframes showLayer {
			0% {
				transform: translateY(0);
			}
			100% {
				transform: translateY(-100%);
			}
		}
		@keyframes hideLayer {
			0% {
				transform: translateY(-100%);
			}
			100% {
				transform: translateY(0);
			}
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
		width: 100%;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: #fff;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);
		/*  #endif  */
		.header-top{
		width: 100%;
		padding: 0 4%;
		height: 100upx;
		display: flex;
		align-items: center;
		justify-content: space-between;//让子布局对称分布
				.back {
					width: 125upx;
					height: 60upx;
					flex-shrink: 0;
					.icon {
						margin-left: -10%;
						width: 60upx;
						height: 60upx;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 42upx;
					}
				}
				.title{
					wight: 100%;
					text-align: center;//字体居中
					font-size: 36upx;
					justify-content: center;
					align-items: center;
					padding: 0 7%;
				}
				.icon-btn {
					width: 125upx;
					height: 60upx;
					flex-shrink: 0;
					display: flex;
					.icon {
						&:first-child{
							margin-right: 5upx;
						}
						width: 60upx;
						height: 60upx;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 42upx;
					}
				}
					
		}
		.header-botton{
			
		}
		
	}
	.place{
		
		background-color: #ffffff;
		height: 150upx;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
	}
	.flight-list{
		width: 100%;
		padding: 20upx 0 120upx 0;
		.tis{
			width: 100%;
			height: 60upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
		}
		.row{
			width: calc(92%);
			height: calc(22vw + 40upx); 
			margin: 20upx auto;
			border-radius: 15upx;
			box-shadow: 0upx 5upx 20upx rgba(0,0,0,0.1);
			
			display: flex;
			align-items: center;
			overflow: hidden;
			z-index: 4;
			border: 0;
			.flight-info{
				width: calc(92vw);
				height: 100%;
				margin-top: 25px;
				margin-right: 10px;
				justify-content: space-between;
				.info-top{
					width: 100%;
					height: 80%;
					overflow: hidden;
					display: flex;
					justify-content: space-between;
					.info-left{
					    padding-left: 15px;
						padding-right: 15px;
						margin-top: 10px;
						
						width: 80%;
						justify-content: space-between;
						.time{
							font-size: 28px;
							font-weight: bold;
							display: flex;
							justify-content: space-between;
							 text-align: center;//字体居中
						}
						.airport{
							margin-top: 5px;
							font-size: 5px;
							display: flex;
							justify-content: space-between;
							 text-align: center;//字体居中
						}
					}
					.info-right{
						width: 20%;
						  text-align: right;
						  margin-right: 20px;
						  margin-top: 20px;
						.price{
							font-size: 23px;
							color: #f06c7a;
						}	
					}

					
				}
				.info-botton{
					border-top: 1px solid #ccc;
					display: flex;
					height: 20%;
					margin-bottom: 20px;
					justify-content: space-between;
					.aircraftCode{
						margin-left: 10px;
						// font-size: 8px;
					}
					.firstClassPrice{
						font-style: italic;
						margin-right: 10px;
					}
				}
				
			}
		}
	}
	.footer{
		width: 92%;
		padding: 0 4%;
		background-color: #fbfbfb;
		height: 100upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28upx;
		position: fixed;
		bottom: 0upx;
		z-index: 5;
		.delBtn{
			border: solid 1upx #f06c7a;
			color: #f06c7a;
			padding: 0 30upx;
			height: 50upx;
			border-radius: 30upx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.settlement{
			width: 60%;
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
				height: 50upx;
				background-color: #f06c7a;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				
				border-radius: 30upx;
			}
		}
	}
	.popup {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 20;
		display: none;
		.mask{
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 21;
			background-color: rgba(0, 0, 0, 0.6);
		}
		.layer {
			position: fixed;
			z-index: 22;
			bottom: -60%;
			width: 92%;
			padding: 0 4%;
			height: 60%;
			border-radius: 20upx 20upx 0 0;
			background-color: #fff;
			display: flex;
			flex-wrap: wrap;
			align-content: space-between;
			.content {
				width: 100%;
				padding: 20upx 0;
				.sp{
					uni-view{
						height: 150px;
					}
				}
			}
			
			
			.btn {
				width: 100%;
				height: 100upx;
				margin-bottom: 50px;
				.button {
					width: 100%;
					height: 80upx;
					border-radius: 40upx;
					color: #fff;
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: #f47952;
					font-size: 28upx;
				}
			}
		}
		
		&.show {
			display: block;
			.mask{
				animation: showPopup 0.2s linear both;
			}
			.layer {
				animation: showLayer 0.2s linear both;
			}
		}
		&.hide {
			display: block;
			.mask{
				animation: hidePopup 0.2s linear both;
			}
			
			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}
		&.none {
			display: none;
		}
		&.service {
			.row {
				margin: 30upx 0;
				.title {
					font-size: 30upx;
					margin: 10upx 0;
				}
				.description {
					font-size: 28upx;
					color: #999;
				}
			}
		}
		&.spec {
			.title {
				font-size: 30upx;
				margin: 30upx 0;
			}
			.sp {
				// display: flex;
				view {
					width: 94%;
					font-size: 30px;
					padding: 5upx 20upx;
					border-radius: 8upx;
					margin: 0 30upx 20upx 0;
					background-color: #f6f6f6;
					&.on {
						padding: 3upx 18upx;
						border: solid 1upx #f47925;
					}
				}
			}
			.length{
				margin-top: 30upx;
				border-top: solid 1upx #aaa;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-top: 20upx;
				.text{
					font-size: 30upx;
				}
				.number{
					display: flex;
					justify-content: center;
					align-items: center;
					.input{
						width: 80upx;
						height: 60upx;
						margin: 0 10upx;
						background-color: #f3f3f3;
						display: flex;
						justify-content: center;
						align-items: center;
						text-align: center;
						input{
							width: 80upx;
							height: 60upx;
							display: flex;
							justify-content: center;
							align-items: center;
							text-align: center;
							font-size: 26upx;
						}
					}
					
					.sub ,.add{
						width: 60upx;
						height: 60upx;
						background-color: #f3f3f3;
						border-radius: 5upx;
						.icon{
							font-size: 30upx;
							width: 60upx;
							height: 60upx;
							display: flex;
							justify-content: center;
							align-items: center;
							
						}
					}
				}
			}
			
		}
	}
	
</style>
