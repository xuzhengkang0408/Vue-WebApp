<template>
	<div class="search">
    <!--搜索框-->
		<div class="search-box-wrapper">
			<search-box ref="searchBox" @query="onQueryChange"></search-box>
		</div>
    <!--热门搜索&&历史搜索-->
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
      <scroll class="shortcut" ref="shortcut" :data="shortcut" :refreshDelay="refreshDelay">
        <div>
          <!--热门搜索-->
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="(item,index) in hotKey" :key="index" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <!--搜索历史-->
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear"  @click="deleteAll">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list  :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
          </div>

        </div>
      </scroll>
    </div>
    
    <!--搜索结果-->
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest ref="suggest" :query="query"  @listScroll="blurInput" @select="saveSearch"></suggest>
    </div>
    
    <!--删除全部历史-->
    <confirm ref="confirm" text="是否删除全部搜索历史" cancelBtnText="取消"  confirmBtnText="确认" @confirm="deleteWholeSearchHistory"></confirm>

    <router-view></router-view>

 
	</div>

</template>
<script type="text/ecmascript-6">
import SearchBox from "base/search-box/search-box"
import Scroll from "base/scroll/scroll"
import Suggest from "components/suggest/suggest"
import SearchList from "base/search-list/search-list"
import Confirm from "base/confirm/confirm"
import {getHotKey} from "api/search"
import {ERR_OK} from 'api/config'
import {mapActions} from "vuex"
import {playlistMixin,searchMixin} from 'common/js/mixin'
export default{
  mixins:[playlistMixin,searchMixin],
  components:{
    SearchBox,
    Scroll,
    Suggest,
    SearchList,
    Confirm
  },
  data(){
    return {
      hotKey:[],
    }
  },
  created(){
    this._getHotKey()
  },
  computed:{
    //滚动数据
    shortcut(){
      return this.hotKey.concat(this.searchHistory)
    }
  },
  methods:{
    ...mapActions([
      'deleteWholeSearchHistory'
    ]),
    handlePlayList(playlist){
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
    },  
    //获取热门搜索
    _getHotKey(){
      getHotKey().then((res)=>{
        if(res.code ===ERR_OK){
          this.hotKey = res.data.hotkey.slice(0,10)
        }
      })
    },
    //删除全部按钮
    deleteAll() {
      this.$refs.confirm.show()
    },
  
    
  }
}

</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
 @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>