<template>
	<view>
		<view class="list">
			<view class="item" :class="{cur:curDate===i}" v-for="(item,i) in dateList" :key="i"
			@click="pickerDate(i)">
				<view class="date">{{item.date}}</view>
				<view class="week">{{item.week}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "calendar-tab",
		data() {
			return {
				dateList: [],
				nowDate: '',
				curDate:''
			};
		},
		mounted() {
			var weekText = new Array("日", "一", "二", "三", "四", "五", "六");  
			var date = new Date();
			var base = new Date(date).getTime();
			var oneDay = 24 * 3600 * 1000;
			var date = [];
			var data = [Math.random() * 300];
			var time = new Date(base);
			date.push({
				date:[time.getMonth() + 1, time.getDate()].join('-'),
				week:'今天',
				originDate:time
			});
			for (var i = 1; i < 7; i++) { //控制需要的天数
				var now = new Date(base += oneDay); //这里控制往前一周还是往后一周
				date.push({
					date:[now.getMonth() + 1, now.getDate()].join('-'),
					week: `星期${weekText[now.getDay()]}`,
					originDate:now
				});
			}
			
			this.dateList = date
			console.log(this.dateList)
		},
		methods: {
			pickerDate(i){
				console.log(i)
				if(i===this.curDate){
					this.curDate = ''
					this.$emit('click','')
					return
				}
				this.curDate = i
				this.$emit('click',this.dateList[i].originDate)
			}
		}
	}
</script>

<style lang="scss" scoped>
.list{
	@include menu-list(7);
	height: 42px;
	.item{
		// color: #fff;
		color: black;
		height: 36px;
		margin-bottom: 4px;
		// @include flex-center;
		flex-direction: column;
		border-radius: 10upx;
		.date{
			font-size: 20upx;
		}
		.week{
			font-size: 22upx;
		}
	}
	.cur{
		background: #fff;
		color: red;
		// color: $color-primary;
	}
}
</style>
