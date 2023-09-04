<template>
	<view>
		<view class="header">
		<view class="add">
			<view class="btn" @tap="add">
				<view class="icon tianjia"></view>新增乘机人
			</view>
		</view>
		</view>

			
		<!-- 乘机人列表 -->
		<view class="content">
		<view class="passenger-list">
			<view class="tis" v-if="passengerList.length==0">没有乘机人哦~
			</view>
		    <view class="row" v-for="(row,index) in passengerList" :key="index" >
				<view class="checkbox-box" @tap="selected(index)">
					<view class="checkbox">
						<view :class="[ selectedPassengers.includes(row.id) ?'on':'']"></view>
					</view>
				</view>
				<view class="center">
					<view class="name-tel">
						<view class="name">{{row.passengerName}}</view>
						<!-- <view class="tel">{{row.phoneNumber}}</view> -->
						<view class="default" >
							{{row.identificationCard}}
						</view>
					</view>
				</view>
				<view class="right">
					<view class="icon bianji" @tap.stop="edit(row)"/>
				</view>
			</view>
		</view>
		</view>
		<!-- 脚部菜单 -->
		<view class="footer" >
			<view class="checkbox-box" @tap="allSelect">
				<view class="checkbox">
					<view :class="[isAllselected?'on':'']"></view>
				</view>
				<view class="text">全选</view>
			</view>
			<view class="finish">
				<view class="finish-btn" @tap="finish">
					完成
				</view>
			</view>
		</view>
		

		


	</view>
</template>
<script>
	export default {
		data() {
			return {
				isSelect:false,
				selectedPassengers:[],
				isAllselected:false,
				passengerList:[],
				selectedPassengers:[],
			};
		},
		mounted() {
			this.getByUserId();
		},
		onShow() {
		},
		onLoad(e) {
			
			if(e.type=='select'){
				this.isSelect = true;
			}
		},
		methods:{
			getByUserId(){
				uni.getStorage({
					key:'Passengers',
					success: (res) => {
						this.passengerList=res.data;
						// uni.removeStorage({
						// 	key:'Passengers'
						// })
					}
				}),
				uni.getStorage({
					key:'selectedPassengers',
					success: (res) => {
						this.selectedPassengers=res.data
						// uni.removeStorage({
						// 	key:'selectedPassengers'
						// })
					}
				})
			},
			finish(){
				uni.removeStorage({
					key:'selectedPassengers'
				}),
				uni.setStorage({
					key: 'selectedPassengers',
					data: this.selectedPassengers,
				});
				uni.navigateBack();
				
			},
			edit(row){
				uni.setStorage({
					key:'address',
					data:row,
					success() {
						uni.navigateTo({
							url:"editPassenger?type=edit"
						})
					}
				});
				
			},
			add(){
				uni.navigateTo({
					url:"editPassenger?type=add"
				})
			},
			select(row){
				//是否需要返回地址(从订单确认页跳过来选收货地址)
				if(!this.isSelect){
					return ;
				}
				uni.setStorage({
					key:'selectAddress',
					data:row,
					success() {
						uni.navigateBack();
					}
				})
			},
			// 选中商品
			selected(index){
				this.passengerList[index].selected = this.passengerList[index].selected?false:true;
				let i = this.selectedPassengers.indexOf(this.passengerList[index].id);
				i>-1 ? this.selectedPassengers.splice(i, 1) :this.selectedPassengers.push(this.passengerList[index].id);
				this.isAllselected = this.selectedPassengers.length == this.passengerList.length;
				console.log("sfsdf",this.selectedPassengers);
			},
			//全选
			allSelect(){
				let len = this.passengerList.length;
				let arr = [];
				for(let i=0;i<len;i++){
					this.passengerList[i].selected = this.isAllselected? false : true;
					arr.push(this.passengerList[i].id);
				}
				this.selectedPassengers = this.isAllselected?[]:arr;
				this.isAllselected = this.isAllselected||this.passengerList.length==0?false : true;
			},			
		}
	}
</script>

<style lang="scss">
// 定义checkbox的形状
.checkbox-box{
	display: flex;
	align-items: center;
	.checkbox{
		width: 35upx;
		height: 35upx;
		border-radius: 100%;
		border: solid 2upx #f06c7a;
		display: flex;
		justify-content: center;
		align-items: center;
		.on{
			width: 25upx;
			height: 25upx;
			border-radius: 100%;
			background-color: #f06c7a;
		}
	}
	.text{
		font-size: 28upx;
		margin-left: 10upx;
	}
}
.header{
	z-index: 4;
	position: fixed;
	top: 45px;
	height: 120upx;
	width:100%;
	background-color: #fff;
	justify-content: center;// 水平居中
	align-items: center;// 垂直居中
	text-align: center;//字体居中
	// display: flex;
	.add{
		width: 100%;
		height: 120upx;
		justify-content: center;// 水平居中
		align-items: center;// 垂直居中
		text-align: center;//字体居中
		.btn{
			width: 94%;
			height: 80upx;
			margin-left: 3%;
			display: flex;
			border-radius: 20upx;		
			color: #777;
			border: solid 1upx #aaa;
			justify-content: center;// 水平居中
			align-items: center;// 垂直居中
			text-align: center;//字体居中
			.icon{
				height: 80upx;
				color: #777;
				font-size: 30upx;
				line-height: 80upx; /*设置line-height与父级元素的height相等*/
				justify-content: center;// 水平居中
				align-items: center;// 垂直居中
				text-align: center;//字体居中
			}
			font-size: 30upx;
		}
	}
}

.content{
.passenger-list{
	margin-top: 50px;
	width: 100%;
	padding: 20upx 0 20upx 0;
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
		position: relative;
		overflow: hidden;

		border: 0;
		.center{
			width: 75%;
		}

		.checkbox-box{
			padding-left: 20upx;
			flex-shrink: 0;
			height: 22vw;
			margin-right: 20upx;
		}

	
	}
}
}
.footer{
	z-index: 4;
	display: flex;
	position: fixed;
	bottom: 0;
	width: 100%;
	background-color: #fff;
	.checkbox-box{
		// 垂直居中
		align-items: center;
		// 水平居中
		justify-content: center;
		width:30%;
	}
	.finish{

		display: flex;
		width:70%;
		height: 120upx;
		// 垂直居中
		align-items: center;
		// 水平居中
		justify-content: center;
		.finish-btn{
			box-shadow: 0upx 5upx 10upx rgba(0,0,0,0.4);
			width: 70%;
			height: 80upx;
			border-radius: 80upx;
			background-color: #f06c7a;
			color: #fff;
			// padding-top: 20upx;
			justify-content: center;// 水平居中
			align-items: center;// 垂直居中
			text-align: center;//字体居中
			font-size: 30upx;
			line-height: 80upx; /*设置line-height与父级元素的height相等*/
		}
	}	
}

</style>
