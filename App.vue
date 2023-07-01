<script>
import routingIntercept from '@/config/permission.js'
	export default {
		onLaunch: function () {
			console.log('App Launch')
			// 对路由进行统一拦截，实现路由导航守卫 router.beforeEach 功能
			routingIntercept()
		},
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
		@import "@/uni_modules/uview-ui/index.scss";
	/*每个页面公共css */
	@import "/static/iconfont/font.scss";
</style>
