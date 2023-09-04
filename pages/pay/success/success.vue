<template>
	<view>
		<view class="icon">
			<image src="/static/img/success.png"></image>
		</view>
		<view class="tis">
			订单支付成功
		</view>
		<view class="pay-amount">
			支付金额:{{amount}}元
		</view>
		<view class="back">
			<view class="btn" @tap="toBaggage">选择托运</view>
			<view class="toHomeBtn" @tap="toHome">返回主页</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				amount:0
			};
		},
		onLoad(e) {
			this.amount = parseFloat(e.amount).toFixed(2);
		},
		methods: {
			toHome() {
				// uni.navigateBack({delta: 2})
				uni.switchTab({
					url: '/pages/tabBar/home/home'
				});
			},
			toBaggage() {
				uni.switchTab({
					url: '/pages/tabBar/home/home'
				});
			}
		},
	}
</script>

<style lang="scss">
	view{
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
.icon{
	width: 100%;
	margin-top: 50vw;
	image{
		width: 25vw;
		height: 25vw;
	}
}
.tis{
	width: 100%;
	margin-top: 20upx;
	font-size: 48upx;
}
.pay-amount{
	width: 100%;
	margin-top: 10upx;
	font-size: 32upx;
}
.back{
	margin-top: 50%;
	display: flex;
	width: 100%;
	.btn{
		width: 70%;
		padding: 0 50upx;
		height: 70upx;
		border: solid 2upx black;
		color: black;
		align-items: center;
		border-radius: 10upx;
		font-size: 34upx;
	}
	.toHomeBtn{
		width: 70%;
		margin-top: 10%;
		padding: 0 50upx;
		height: 70upx;
		border: solid 2upx #f06c7a;
		color: #f06c7a;
		align-items: center;
		border-radius: 10upx;
		font-size: 34upx;
	}
}
</style>
