<template>

	<div class="music-list">
    <!--返回按钮-->
		<div class="back" @click="goback">
			<i class="icon-back"></i>
		</div>
    <!--头部Title-->
    <h1 class="title" v-html="title"></h1>
    <!--头部背景-->
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper" ref="play" >
        <div class="play" v-show="songs.length>0" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
			<div class="filter" ref="filter"></div>
		</div>
    <!--背景过度层-->
    <div class="bg-layer" ref="layer"></div>
    <!--底部歌曲列表-->
    <scroll @scroll="scroll" :data="songs" class="list" ref="list" :probe-type="probeType" :listen-scroll="listenScroll">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem" :rank="rank"></song-list>
      </div>
      <div class="loading-container" v-if="!songs.length">
        <loading></loading>
      </div>
    </scroll>
    
   

	</div>
</template>
<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Loading from 'base/loading/loading'
import {mapActions} from 'vuex'
import {playlistMixin} from 'common/js/mixin'
const RESERVED_HEIGHT = 40

 export default{
  mixins:[playlistMixin],
  props:{
    title:{
      type:String,
      default:''
    },
    bgImage:{
      type:String,
      default:''
    },
    songs:{
      type:Array,
      default:[]
    },
    rank:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return{
      scrollY:0
    }
    
  },
  computed:{
    //背景样式
    bgStyle(){
      return `background-image:url(${this.bgImage})`
    }
  },
  components:{
    SongList,
    Scroll,
    Loading
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
  },
  methods:{
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ]),
    //控制播放List
    handlePlayList(playList){
      const bottom = playList.length >0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    //scroll事件
    scroll(pos) {
      this.scrollY = pos.y
    },
    //返回
    goback(){
      this.$router.back()
    },
    //选择歌曲
    selectItem(item,index){
      this.selectPlay({
        list:this.songs,
        index:index
      })
    },
    //随机播放全部歌曲
    random(){
      this.randomPlay({
        list:this.songs
      })
    }
  },
  watch:{
    scrollY(newY){
      
      let translateY = Math.max(this.minTranslateY,newY)
      let zIndex = 0
      let scale = 1
      const percent = Math.abs(newY/this.imageHeight)

      if(newY > 0){
        scale = 1 + percent
        zIndex =2
      }
  

      this.$refs.layer.style['transform']=`translate3d(0,${translateY}px,0)`
      this.$refs.layer.style['webkitTransform']=`translate3d(0,${translateY}px,0)`

      //判断滚动的距离
      if(newY<this.minTranslateY){
        zIndex =10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height =RESERVED_HEIGHT+'px'

        this.$refs.play.style.display = 'none'
      }else{
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          this.$refs.play.style.display = 'block'
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style['transform'] ="scale("+scale+")"
      this.$refs.bgImage.style['webkitTransform'] ="scale("+scale+")"
      
    }
  },
  mounted(){
    this.imageHeight = this.$refs.bgImage.clientHeight //图片的高度
    this.minTranslateY = -this.imageHeight+ RESERVED_HEIGHT
    this.$refs.list.$el.style.top = this.imageHeight+'px'
  }
 }

 


</script>
<style scoped lang="stylus" ref="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background 
    .back 
      position absolute 
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
     
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>