<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :switches="switches" :currentIndex="currentIndex" @select="selectIndex"></switches>
      </div>
      <div ref="playBtn" class="play-btn" >
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
         <scroll class="list-scroll" v-show="currentIndex===0"  :data="favoriteList">
            <div class="list-inner">
              <song-list @select="toplaysong" :rank="false" :songs="favoriteList" ></song-list>
            </div>
         </scroll>
          <scroll ref="songList" class="list-scroll" v-if="currentIndex === 1" :data="playHistory">
            <div class="list-inner">
              <song-list @select="toplaysong" :rank="false" :songs="playHistory" ></song-list>
            </div>
          </scroll>
         
      </div>
      <div class="no-result-wrapper" v-show="noresult">
        <no-result :title="title"></no-result>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import Switches from "base/switches/switches"
import Scroll from "base/scroll/scroll"
import SongList from "base/song-list/song-list"
import {mapGetters,mapActions} from "vuex"
import Song from "common/js/song"
import {getSingerPlay} from "api/singer"
import {ERR_OK} from "api/config"
import NoResult from "base/no-result/no-result"
export default{
  data(){
    return{
      switches:['我喜欢的','最近听的'],
      currentIndex:0,
      title:'抱歉，暂无数据'
    }
  },
  computed:{
      noresult(){
      if(this.currentIndex===0){
          return !this.favoriteList.length
        }else if(this.currentIndex===1){
          return !this.playHistory.length
        }
       
    },
    ...mapGetters([
      'playHistory',
      'favoriteList'
      ])
  },

  methods:{
   
    back(){
      this.$router.push('/')
    },
    selectIndex(index){
      this.currentIndex = index
    },
       toplaysong(item,index,url){
        var song = new Song(item)
        getSingerPlay(song).then((res)=>{
    if(res.code == ERR_OK){
    let url ='http://dl.stream.qqmusic.qq.com/C400' + song.mid+'.m4a?vkey='+res.data.items[0].vkey+'&guid=504753841&uin=0&fromtag=66'
    this.insertSong({
      song,
      url
    })
  }
 })
      },
      

      ...mapActions([
        'insertSong'
        ])
  },
   components:{
    Switches,
    Scroll,
    SongList,
    NoResult
  } 
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
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
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
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
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>