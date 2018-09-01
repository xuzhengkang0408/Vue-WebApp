<template>
	<div class="rank" ref="rank">

		<scroll :data="topList" class="toplist"  ref="rankContent">
			<div>
				<ul v-for="(item,index) in topList" :key="index" @click="selectItem(item)">
					<li class="item" >
						<div class="icon">
							<img width="100%" height="100%" v-lazy="item.picUrl"/>
						</div>
						<ul class="songlist" >
							<li class="song" v-for="(subItem,index) in item.songList" :key="index">
								<span v-html="index+1"></span>
								<span v-html="subItem.singername"></span>
								<span v-html="subItem.songname"></span>
							</li>
						</ul>
					</li>
				</ul>
				<div class="loading-container" v-show="!topList.length">
					<loading></loading>
				</div>
			</div>
		</scroll>
		<router-view></router-view>

	</div>
	
</template>
<script type="text/ecmascript-6">
import {getToplist} from "api/rank"
import {ERR_OK} from "api/config"
import Scroll from "base/scroll/scroll"
import Loading from "base/loading/loading"
import {playlistMixin} from 'common/js/mixin'
import {getTopSong} from "api/rank"
import {mapMutations} from "vuex"
	export default {
		mixins:[playlistMixin],
		data() {
			return{
				topList:[]
			}
		},
		created() {
			this._initToplist()
		},
		components:{
			Scroll,
			Loading
		},
		methods:{
			selectItem(item) {
				console.log('select id'+item.id)
	
				this.$router.push({
					path:`/rank/${item.id}`
				})

				this.setToplist(item)
			},
			handlePlayList(playlist) {
				const bottom = playlist.length > 0 ? '60px':''
				this.$refs.rank.style.bottom = bottom
				this.$refs.rankContent.refresh()
			},
			_initToplist() {
				getToplist().then((res)=>{
					if(res.code ==ERR_OK){
						
						this.topList = res.data.topList
						
					}
				})
			},
			...mapMutations({
				setToplist:"SET_TOPLIST"
			})
		},

	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.rank
		position:fixed
		width:100%
		top:88px
		bottom:0
		.toplist
			height:100%
			overflow:hidden
			.loading-container
				position: absolute
				width: 100%
				top: 50%
				transform: translateY(-50%)
			.item
				display:flex
				margin:0 20px
				padding-top: 20px
				height: 100px
				&:last-child
					padding-bottom: 20px
					.icon
						flex: 0 0 100px
						width: 100px
						height: 100px
					.songlist
						flex: 1
						display: flex
						flex-direction: column
						justify-content: center
						padding: 0 20px
						height: 100px
						overflow: hidden
						background: $color-highlight-background
						color: $color-text-d
						font-size: $font-size-small
						.song
							no-wrap()
							line-height: 26px
		

</style>