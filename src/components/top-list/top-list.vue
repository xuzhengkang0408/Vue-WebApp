<template>
	<transition name="slide">
		<music-list :rank="rank" @changeImg="changeImg" :title="title" :bgImage="bgImage" :songs="songs"></music-list>
	</transition>
</template>
<script type="text/ecmascript-6">
import musicList from "components/music-list/music-list"
import {mapGetters} from "vuex"
import {createSong} from "common/js/song"
import {getTopSong} from "api/rank"
export default{
	data() {
		return{
			songs:[],
			imgUrl:'',
			rank:true
		}
	},
	computed:{
		bgImage() {
			
			if(this.songs.length){
				return this.songs[0].image
			}else{
				return this.topList.picUrl
			}
		},
		title() {
			return this.topList.topTitle
		},
		...mapGetters([
			'topList'
		])
	},
	created() {
		this._getMusicList()
	},
	methods:{

		_getMusicList(){
			if(!this.topList.id){
				this.$router.push('/rank')
			}
			getTopSong(this.topList.id).then((res)=>{
				this.songs = this._normalizeSongs(res.songlist)
				//console.log(this.songs)
			})
		},
		_normalizeSongs(list) {
			let ret=[]
			list.forEach((item)=> {
				const musicData =item.data
				if(musicData.songid && musicData.albumid){
					ret.push(createSong(musicData))
				}
			})
			return ret
		},
		changeImg(item) {
			this.imgUrl = item.image
		}
	},
	components:{
		musicList
	}
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	.slide-enter-active, .slide-leave-active
		transition:all 0.3s ease
	.slide-enter ,.slide-leave-to
		transition: translate3d(100%,0,0)
</style>