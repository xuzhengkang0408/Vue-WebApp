<template>
	<div class="player" v-show="playList.length > 0">
    <!--全屏播放器-->
    <transition name="normal" 
        @enter="enter"  
        @after-enter="afterEnter">
      <div class="normal-player" v-show="fullScreen" >
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <!--头部名称-->
        <div class="top">
            <div class="back" @click="back()">
                <i class="icon-back"></i>
            </div>
            <h1 class="title" v-html="currentSong.songname"></h1>
            <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <!--中间转盘-->
        <div class="middle" @touchstart="middleTouchStart" @touchmove="middleTouchMove" @touchend="middleTouchEnd">
          <!--左部图片-->
          <div class="middle-l" ref="middleL"> 
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <!--右部歌词-->
          <Scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" 
                   v-for="(line,index) in currentLyric.lines" :key="index"
                   class="text" 
                   :class="{'current' :currentLineNum === index}">{{line.txt}}
                </p>
              </div>
            </div>
          </Scroll>
        </div>
        <!--底部按钮-->
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow ==='cd'}">></span>
            <span class="dot" :class="{'active':currentShow ==='lyric'}">></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.interval)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i  class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon"></i>
            </div>
          </div>
        </div>

        
       
      </div>
    </transition>
    <!--mini播放器-->
    <transition name="mini" >
      <div class="mini-player"  v-show="!fullScreen" @click="open()">
        <div class="icon">
          <img  width="40" height="40" :src="currentSong.image" :class="cdCls" >
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.songname"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
            <progress-circle :radius="radius" :percents="percent">
              <i @click.stop="togglePlaying" :class="['icon-mini',miniIcon]"></i>
            </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
            <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>

    <!--播放列表-->

    <playlist ref="playlist"></playlist>


    <!--播放器-->
    <audio ref="audio" 
      :src="currentSong.url"
      @canplay="ready" 
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
      ></audio>
	</div>
</template>
<script type="text/ecmascript-6">
import {mapGetters,mapMutations,mapActions} from 'vuex'
import {getClass} from 'common/js/dom'
import animations from 'create-keyframe-animation'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from  'base/progress-circle/progress-circle'
import {playMode} from 'common/js/config.js'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'
import Playlist from 'components/playlist/playlist'
import {playerMixin} from 'common/js/mixin.js'
export default {
    mixins:[playerMixin],
    created() {
      this.touch = {}
    },
    data(){
      return {
        songReady:false ,
        currentTime:0,
        radius:32,
        currentLyric:null,
        currentLineNum:0,
        currentShow:'cd',
        playingLyric:null
      }
    },
    components:{
      ProgressBar,
      ProgressCircle,
      Scroll,
      Playlist
    },
    computed:{
      ...mapGetters([
        'fullScreen',
        'playing',
        'currentIndex',
      ]),
      playIcon(){
        return this.playing ?  'icon-pause' : 'icon-play' 
      },
      miniIcon(){
        return this.playing ?  'icon-pause-mini' :'icon-play-mini'
      },
      cdCls(){
        return this.playing ?  'play' :'play pause'
      },
      disableCls(){
        return this.songReady ? '' :'disable'
      },
      percent() {
        return this.currentTime / this.currentSong.interval
      },
    },
    watch:{
      //当前歌曲
      currentSong(newSong,oldSong){
        if(!newSong.id){
          return 
        }
        if(newSong.id===oldSong.id){
          return
        }
        if(this.currentLyric){
          this.currentLyric.stop()
          this.playingLyric = ''
          this.currentLineNum = 0
        }

        setTimeout(()=>{
          this.$refs.audio.play()
          this.getLyric()
        },1000)
        
      },
      //播放状态
      playing(newPlaying){
        const audio = this.$refs.audio
        this.$nextTick(()=>{
          newPlaying ? audio.play() : audio.pause()
        })
        
      }
    },
    methods:{
      ...mapActions([
        'savePlayHistory'
      ]),
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
      }),
      //中间区域移动开始
      middleTouchStart(e){
        this.touch.initiated =true
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      //中间区域移动中Ing
      middleTouchMove(e) {
        if(!this.touch.initiated){
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if(Math.abs(deltaY) > Math.abs(deltaX) ){ //只允许相左滑动
          return
        }

        const left = this.currentShow ==="cd" ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0,Math.max(-window.innerWidth,left+deltaX)) //滑动的距离

        this.touch.percent = Math.abs(offsetWidth / window.innerWidth) //滑动百分比

        this.$refs.lyricList.$el.style.transform= 'translate3d('+offsetWidth+'px,0,0)'

        this.$refs.middleL.style.opacity =1-this.touch.percent
     

      },

      //中间区域移动结束
      middleTouchEnd(){
          let offsetWidth
          let opacity
          if(this.currentShow==='cd'){
            opacity =1
            if(this.touch.percent > 0.1){
              opacity = 0
              offsetWidth =-window.innerWidth
              this.currentShow ='lyric'
            }else{
              offsetWidth =0
            }
          }else{
            if(this.touch.percent < 0.9){
              this.currentShow ='cd'
              opacity = 1
            }else{
              offsetWidth = -window.innerWidth
              opacity = 0
            }
          }
          
          this.$refs.lyricList.$el.style.transform= 'translate3d('+offsetWidth+'px,0,0)'
          this.$refs.middleL.style.opacity = opacity

      },

      //最小化
      back(){
        this.setFullScreen(false)
      },
      //打开全屏
      open(){
        this.setFullScreen(true)
      },
      //enter动画
      enter(el,done){
        const {x,y,scale} =this._getPosAndScale()
        let animation ={
          0:{
            transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60:{
            transform:`translate3d(0,0,0) scale(1.1)`
          },
          100:{
            transform:`translate3d(0,0,0) scale(1)`
          }
        }
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear',
            delay: 500
          }
        }),
        animations.runAnimation(this.$refs.cdWrapper,'move',done)
      },
      //afterEnter动画
      afterEnter(){
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation =''
      },
      //获取缩放位置
      _getPosAndScale(){
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom =30
        const paddingTop =80
        const width = window.innerWidth*0.8
        const scale = targetWidth / width
        const x =-((window.innerWidth / 2)-paddingLeft)
        const y = window.innerHeight -paddingTop - width/2 - paddingBottom

        return {
          x,
          y,
          scale
        }

      },
      //切换播放
      togglePlaying(){
        if(!this.songReady){
          return
        }
        this.setPlayingState(!this.playing)
      },
      //audou ready之后
      ready(){
        this.songReady =true
        this.savePlayHistory(this.currentSong)
      },
      error(){
        this.songReady =true
      },
      //播放下一首歌
      next(){
        if(!this.songReady){
          return
        }
        if(this.playList.length ===1){

          this.loop()

        }else{
          let index =this.currentIndex + 1
          if(index === this.playList.length){
            index = 0
          }

          this.setCurrentIndex(index)
          if(!this.playing){
            this.togglePlaying()
          }

          this.songReady = false
        }

        
      },
      //播放上一首歌
      prev(){
        if(!this.songReady){
          return
        }
        let index =this.currentIndex - 1
        if(index === -1){
          index = this.playlist.length -1
        }

        this.setCurrentIndex(index)
        if(!this.playing){
          this.togglePlaying()
        }

        this.songReady = false
      },
      //获取当前播放时间
      updateTime(e){
        this.currentTime = e.target.currentTime
      },
      //将时间戳改成正规时间
      format(interval){
        interval = interval | 0 
        const minute = interval /60 | 0
        const second = interval %60
        return this._pad(minute) +':'+this._pad(second)
      },
      //补0
      _pad(num,n=2) {
        let len = num.toString().length
        while(len < n){
          num = '0'+num
          len++
        }
        return  num
      },
      //进度条拖拽
      onProgressBarChange(percent) {
          
          let currentTime =this.$refs.audio.currentTime * percent
          this.$refs.audio.currentTime = currentTime
          if(!this.playing){
            this.togglePlaying()
          }
          if(this.currentLyric){
            this.currentLyric.seek(currentTime * 1000)
          }
      },
      //audio结束播放
      end() { 
        if(this.mode === playMode.loop){
          this.loop()
        }else{

          this.next()
        }
      },
      //循环播放模式
      loop(){
        this.$resf.audio.currentTime =0
        this.$refs.audio.play()
      },
      //获取歌词
      getLyric(){
        this.currentSong.getLyric().then((lyric)=>{
            this.currentLyric = new Lyric(lyric,this.handleLyric)
            
        }).catch(() => {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
      },
      //控制歌词
      handleLyric({lineNum, txt}){
          this.currentLineNum = lineNum
          if(lineNum>=5){
            let lineEl = this.$refs.lyricLine[lineNum - 7]
            this.$refs.lyricList.scrollToElement(lineEL,1000)
          }else{
            this.$refs.lyricList.scrollToElement(0,0,1000)
          }

          this.playingLyric = txt

      },
      //展示播放列表
      showPlaylist(){

        this.$refs.playlist.show()
      }

    }

   
}
 
 
 
 
 
   

 


</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              margin-right:2%
              text-align: left
            &.time-r
              margin-left:2%
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
              
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          top: 0px;
          left: 0px;

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>