<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <!--搜索框-->
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="onQueryChange" :placeholder="placeholder" ></search-box>
        <div class="list-wrapper">
            <!--左边播放列表-->
            <Scroll ref="songList" class="list-scroll" v-if="currentIndex === 0" :data="playHistory" >
                <div class="list-inner">
                  <song-list @select="toplaysong" :rank="false" :songs="playHistory" ></song-list>
                </div>
            </Scroll>
            
            <!--右边历史数据-->
            <Scroll ref="searchList" :refreshDelay="refreshDelay" :class="list-scroll" v-if="currentIndex === 1" :data="searchHistory">
              <div class="list-inner">
                <search-list @select="addQuery" @delete="deleteSearchHistory" :searches="searchHistory"></search-list>
              </div>
            </Scroll>

        </div>
      </div>
      <!--中级tab切换-->
      <div class="shortcut" v-show="!query">
           <switches :switches="switches" :currentIndex ="currentIndex" @select="getIndex"></switches>
      </div>
      <!--搜索结果-->
      <div class="search-result" v-show="query">
        <suggest  @select="selectSuggest" :query="query" :showSinger="showSinger"  @listScroll="blurInput"></suggest>
      </div>

      <!--顶部显示-->
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import SearchBox from "base/search-box/search-box"
  import Suggest from "components/suggest/suggest"
  import Switches  from "base/switches/switches"
  import Scroll from 'base/scroll/scroll'
  import SongList from "base/song-list/song-list"
  import SearchList from "base/search-list/search-list"
  import TopTip from "base/top-tip/top-tip"
  import {searchMixin} from 'common/js/mixin'
  import {mapGetters,mapMutations,mapActions} from 'vuex'

  export default {
    mixins:[searchMixin],
    data(){
      return {
        showFlag:false ,
        placeholder:'搜索歌曲',
        showSinger:false,
        switches:['最近播放','搜索历史'],
        currentIndex:0,
      }
    },
    components:{
      SearchBox,
      Suggest,
      Switches,
      Scroll,
      SongList,
      SearchList,
      TopTip
    },
    computed:{
      ...mapGetters([
        'playHistory',
        'searchHistory'
      ])
    },
   
    methods:{
      ...mapActions([
        'insertSong'
      ]),
      //显示
      show(){
        this.showFlag =true
        setTimeout(()=>{
          if(this.currentIndex === 0){
            this.$refs.songList.refresh()
          }else if(this.currentIndex === 1){
            this.$refs.searchList.refresh()
          }
        },20)
      },
      //隐藏
      hide(){
        this.showFlag =false
      },
      //selectSuggest
      selectSuggest(){
        this.saveSearch()
        this.showTip()
      },
      //获取tabIndex
      getIndex(index){
        this.currentIndex = index
      },
      //播放点击的播放歌曲
      toplaysong(item,index){
        if(index !==0){
          this.insertSong(item)
          this.showTip()
        }
      },
      //展示showTip
      showTip(){
        this.$refs.topTip.show()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>