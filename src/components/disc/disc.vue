<template>
	<transition name="slide">
		<music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
	</transition>
</template>
<script type="text/ecmascript-6">
	import musicList from 'components/music-list/music-list'
	import {mapGetters} from 'vuex'
	import {getSongList} from 'api/recommend'
	import {ERR_OK} from 'api/config'
	import {createSong} from 'common/js/song'
	export default{
		data() {
			return {
				songs:[]
			}
		},
		computed:{
			title() {
				return this.disc.song
			},
			bgImage() {
				return this.disc.url
			},
			...mapGetters([
				'disc'
				])
		},
		created() {
			this._getSongList()
		},
		methods:{
			_getSongList() {
				if(!this.disc.dissid) {
					this.$router.push('/recommend')
					return 
				}
				getSongList(this.disc.dissid).then((res) => {
					if(typeof res.data === 'object'){
							if(res.data.code === ERR_OK){
						this.songs = this._normalizeSongs(res.data.cdlist[0].songlist)
						
					}
					}else if(typeof res.data === 'string'){
						let songObj = JSON.parse(res.data.substring(13,res.data.length-1))
						var songList = songObj.cdlist[0].songlist
						this.songs = this._normalizeSongs(songList)
						
					}
				
				})
			},
			_normalizeSongs(list) { 
		let ret = []
		list.forEach((item) => {
			

		let musicData = item
			
		if(musicData.songid && musicData.albummid){
		ret.push(createSong(musicData))
		}
	})
	return ret
	
}
		},
		components:{
			musicList
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable"
	.slide-enter-active, .slide-leave-active
	  transition:all 0.3s

	.slide-enter, .slide-leave-to
	  transform:translate3d(100%,0,0)
</style>