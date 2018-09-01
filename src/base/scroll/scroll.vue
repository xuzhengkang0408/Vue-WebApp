 <template>
	<div ref="wrapper">
		<slot></slot>
	</div>
</template>
<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'
	export default{
		props:{
			//probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件
			probeType:{
				type:Number,
				default:1
			},
			//better-scroll 默认会阻止浏览器的原生 click 事件。当设置为 true，better-scroll 会派发一个 click 事件
			click:{
				type:Boolean,
				default:true
			},
			data:{
				type:Array,
				default:null
			},
			listenScroll:{
				type:Boolean,
				default:false
			},
			//是否上拉刷新
			pullUp:{
				type:Boolean,
				default:false
			},
			//滚动之前
			beforeScroll:{
				type:Boolean,
				default:false
			},
			refreshDelay:{
				type:Number,
				default:20
			}
			
		},
		mounted() {
			setTimeout(() => {
				this._initScroll()
			},20) 
		},
		methods:{
			//初始化Scroll
			_initScroll(){
				if(!this.$refs.wrapper){
					return
				}
				this.scroll = new BScroll(this.$refs.wrapper,{
					probeType:this.probeType,
					click:this.click
				})
				//监听派发事件
				if(this.listenScroll){
					let me = this
					this.scroll.on('scroll',(pos)=>{
						me.$emit('scroll',pos)
					})
				}


				//监听上拉刷新
				if(this.pullUp){
					this.scroll.on('scrollEnd',()=>{
						if(this.scroll.y <= this.scroll.maxScrollY +50){
							this.$emit('scrollToEnd')
						}
					})
				}

				if(this.beforeScroll){
					this.scroll.on('beforeScrollStart',()=>{
						
						this.$emit('beforeScroll')
						
					})
				}
			},
			//启动 better-scroll
			enable(){
				this.scroll && this.scroll.enable()
			},
			//禁止滚动 better-scroll
			disable(){
				this.scroll && this.scroll.disable()
			},
			//重新计算 better-scroll
			refresh(){
				this.scroll && this.scroll.refresh()
			},
			//滚动到指定的位置
			scrollTo(){
				this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments)
			},
			//滚动到指定的目标元素。
			scrollToElement(){
				this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments)
			}
		},
		watch:{
			data(){
				setTimeout(()=>{
					this.refresh()
				},this.refreshDelay)
			}
		}
	}
</script>
<style scoped lang="stylus" ref="stylesheet/stylus"></style>