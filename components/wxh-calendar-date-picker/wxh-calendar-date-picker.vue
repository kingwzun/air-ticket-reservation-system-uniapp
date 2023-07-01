<template>
	<view class="datepick" v-if="open" :class="ani?'open':'close'">
		<view class="close-view" @tap="hide"></view>
		<view class="cont">
			<view class="title">
				<view class="text">{{title}}</view>
				<view class="btn-close">
					<view class="close" @tap="hide">X</view>
				</view>
				<view class="weeks-title">
					<ul>
						<li v-for="(item,index) in week" :key="index">{{item}}</li>
					</ul>
				</view>
			</view>
			<view class="date-board">
				<div class="imt-holiday">
					<div class="holiday-date">
						<div class="holiday-date-wrapper" v-for="(item,index) in calendar" :key="index"
							v-show="!item[0].lostmonth">
							<div class="month">{{item[10].month}}月<span class="year">/ {{item[10].year}}</span></div>
							<div v-for="(value,key) in item" :key="key" :class="{
									lostday:value.lostday,
									today:value.today,
									beginday:value.beginday,
									holiday:value.holiday,
									startday:value.startday,
									date:true,
									weekend:value.weekend
									}" @click="pickDate(value)">{{value.date}}</div>
						</div>
					</div>
				</div>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'calendar-date-picker',
		props: {
			holidays: {
				type: Array,
				default: () => ['']
			},
			maxMonth: {
				type: Number,
				default: 6
			},
			week: {
				type: Array,
				default: () => ['日', '一', '二', '三', '四', '五', '六']
			},
			title: {
				type: String,
				default: '日期选择'
			},
			lostdayCanPick: {
				type: Boolean,
				default: false,
			},
			weekendCanPick: {
				type: Boolean,
				default: false,
			},
			holidayCanPick: {
				type: Boolean,
				default: false,
			},
			beginDate: {
				type: Date,
				default: () => new Date()
			},
			startDate: {
				type: String,
				default: ''
			},
			startYear: {
				type: String,
				default: () => `${new Date().getFullYear()}`
			},
			startMonth: {
				type: Number,
				default: () => new Date().getMonth()
			}
		},
		data() {
			return {
				ani: false,
				open: false,
				calendar: [],
			};
		},
		watch: {
			holidays(newV, oldV) {
				this.buildDate()
			},
			beginDate(newV, oldV) {
				this.buildDate()
			},
			startDate(newV, oldV) {
				this.buildDate()
			}
		},
		created() {
			this.buildDate()
		},
		methods: {
			pickDate(value) {
				if (!this.lostdayCanPick && value.lostday) return false
				if (!this.weekendCanPick && value.weekend) return false;
				if (!this.holidayCanPick && value.holiday) return false;
				this.hide();
				let newMonth = value.month < 10 ? '0' + value.month : value.month;
				let newDate = value.date < 10 ? '0' + value.date : value.date;
				let data = value.year + '-' + newMonth + '-' + newDate;
				this.$emit('pickSuccess', data);
			},
			hide() {
				this.ani = false;
				this.$nextTick(() => {
					setTimeout(() => {
						this.open = false;
					}, 300)
				})
			},
			show() {
				this.open = true;
				this.$nextTick(() => {
					setTimeout(() => {
						this.ani = true
					}, 10)
				})
			},
			buildDate() {
				const weekday = (item, index) => {
					const weekend = [1, 7, 8, 14, 15, 21, 22, 28, 29, 35, 36];
					weekend.forEach(i => {
						if (index + 1 === i && item.date !== '') {
							item.weekend = true;
						}
					})
				}
				this.calendar = [...Array(this.maxMonth).keys()].map(i => this.getDate(this.format(i)))
				let begindayIsShow = false
				let isuueDayMonth = 0
				this.calendar.forEach((calendar, c) => {
					calendar.forEach((date, d) => {
						weekday(date, d);
						if (date.beginday) {
							begindayIsShow = true
							isuueDayMonth = c
						}
						if (this.holidays.length > 0) {
							this.holidays.forEach(holiday => {
								if (date.year + '-' + date.month + '-' + date.date === holiday) {
									date.holiday = true
								}
							})
						}
					})
				})
				if (isuueDayMonth !== 0 && this.beginDate !== '') {
					this.calendar[0][0].lostmonth = true
				}
			},
			getDate(e) {
				let time = e.split('-')
				return [...Array(new Date(`${time[0]}-${time[1]}`).getDay())].map(i => ({
					date: ''
				})).concat([...Array([4, 6, 9, 11].includes(time[1] * 1) ? 30 : (time[1] != 2 ? 31 : (time[0] % 4 ==
					0 ? 29 :
					28))).keys()].map(i => ({
					date: i + 1,
					year: parseInt(time[0]),
					month: parseInt(time[1]),
					today: parseInt(time[1]) === new Date().getMonth() + 1 && i + 1 === new Date()
					.getDate(),
					beginday: parseInt(time[1]) === new Date(this.beginDate).getMonth() + 1 && i + 1 ===
						new Date(this.beginDate).getDate(),
					startday: parseInt(time[1]) === new Date(this.startDate).getMonth() + 1 && i + 1 ===
						new Date(this.startDate).getDate(),
					lostday: parseInt(time[1]) === new Date(this.beginDate !== '' ? this.beginDate : this
						.startDate).getMonth() + 1 && i + 1 <= new Date(this.beginDate !== '' ? this
						.beginDate : this.startDate).getDate() - 1
				})))
			},
			format(e) {
				let time = new Date(new Date(this.startYear).setMonth(this.startMonth + e))
				return `${time.getFullYear()}-${(time.getMonth()<9 && '0')+(time.getMonth()+1)}`
			}
		}
	};
</script>

<style lang="scss">
	.datepick {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0);
		position: fixed;
		top: 0;
		z-index: 10;
		display: flex;
		align-items: flex-end;
		transition: all 0.5s;
	}

	.close-view {
		width: 100%;
		height: 100%;
	}

	.datepick>.cont {
		width: 100%;
		height: 70%;
		right: 0%;
		bottom: -100%;
		background: #fff;
		position: absolute;
		opacity: 1;
		transition: all 0.5s;
		overflow: auto;
	}

	.datepick.open>.cont {
		bottom: 0;
	}

	.datepick.open {
		background: rgba(0, 0, 0, 0.7);
	}

	.datepick {
		.cont {
			.title {
				height: 120rpx;
				margin-top: -80rpx;
				background: #fff;
				position: fixed;
				border-top-left-radius: 25rpx;
				border-top-right-radius: 25rpx;

				.text {
					text-align: center;
					height: 80rpx;
					line-height: 80rpx;
				}

				.btn-close {
					position: absolute;
					right: 0;
					top: 0;
					padding: 25rpx;

					.close {
						font-size: 20rpx;
						color: #666;
						width: 30rpx;
						height: 30rpx;
						line-height: 30rpx;
						text-align: center;
						border-radius: 50%;
						border: 1rpx solid #666;
					}
				}

				.weeks-title {
					width: 750rpx;

					ul {
						margin: 0 25rpx;
						padding: 0;

						li {
							list-style: none;
							float: left;
							width: 100rpx;
							height: 40rpx;
							line-height: 40rpx;
							background: #eee;
							text-align: center;
							font-size: 22rpx;
							color: #666;
						}
					}
				}
			}

			.date-board {
				padding-top: 80rpx;
				background: #fff;
				height: 100%;
			}
		}

		.open {
			opacity: 1;
			margin-bottom: 0;
			height: 70%;
		}
	}


	.date-picker {
		height: 70rpx;
		padding: 15rpx;
		border-top: 1rpx solid #eee;
	}

	.holiday-date:after {
		content: '';
		display: table;
		clear: both;
	}

	.info {
		height: 60rpx;
		line-height: 56rpx;
		text-align: left;
		border-top: 1rpx solid #eee;
	}

	.holiday-icon,
	.weekday-icon {
		display: inline-block;
		width: 20rpx;
		height: 20rpx;
		margin-left: 10rpx;
		background: #fb6b8c;
		border-radius: 50%;
		text-align: center;
		line-height: 20rpx;
		color: #fff;
		font-size: 14rpx;
	}

	.weekday-icon {
		margin-left: 30rpx;
		background: #66d6f5;
	}

	.info-text {
		display: inline-block;
		font-size: 14rpx;
		color: #666;
	}

	.imt-holiday {
		background: #fff;
		text-align: center;
		color: #333;
	}

	.holiday-week-wrapper {
		display: flex;
		background: #eee;
		width: 350rpx;
		padding: 0rpx 25rpx;
	}

	.holiday-week {
		flex: 1;
		font-size: 18rpx;
		line-height: 30rpx;
		text-align: center;
	}

	.weekday {
		color: #66d6f5;
	}

	.holiday-date-wrapper {
		border-bottom: 1rpx solid #eee;
		margin: 15rpx;
		width: 700rpx;
		min-height: 280rpx;
		display: block;
		float: left;
		margin: 0rpx 25rpx;
		padding: 25rpx 0rpx;
	}

	.date {
		text-align: center;
		width: 38rpx;
		height: 38rpx;
		font-size: 24rpx;
		line-height: 38rpx;
		float: left;
		cursor: pointer;
		margin: 30rpx;
		margin-top: 10rpx;
		border: 1rpx solid #fff;
	}


	.date:hover {}

	.month {
		width: 100%;
		text-align: center;
		font-size: 28rpx;
		color: #666;
		font-weight: bold;
	}

	.month:after {
		content: '';
		display: block;
		width: 150rpx;
		border-bottom: 1rpx solid #eee;
		margin: 10rpx auto 20rpx;
	}

	.year {
		font-size: 24rpx;
		color: #ccc;
		font-weight: 400;
		padding-left: 10rpx;
	}

	.selected {
		background: #fb6b8c;
		color: #fff;
	}

	.weekend {
		color: #66d6f5;
	}

	.lostday {
		color: #ddd;
		background: #fff;
	}

	.today {}

	.beginday:after {
		content: '起';
		text-align: center;
		font-size: 20rpx;
		background: #FFF;
		display: block;
		width: 30rpx;
		height: 30rpx;
		line-height: 30rpx;
		color: #ED6A0C;
		border-radius: 50%;
		border: 1rpx solid #ED6A0C;
		margin: 0 auto;
	}

	.holiday:after {
		content: '休';
		text-align: center;
		font-size: 20rpx;
		background: #fb6b8c;
		display: block;
		width: 30rpx;
		height: 30rpx;
		line-height: 30rpx;
		color: #fff;
		border-radius: 50%;
		margin: 0 auto;
	}

	.startday:after {
		content: '选';
		text-align: center;
		font-size: 20rpx;
		background: #07C160;
		display: block;
		width: 30rpx;
		height: 30rpx;
		line-height: 30rpx;
		color: #fff;
		border-radius: 50%;
		margin: 0 auto;
	}
</style>
