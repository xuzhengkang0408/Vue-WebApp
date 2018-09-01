<template>
  <scroll class="suggest" 
      ref="suggest" 
      :data="result" 
      :pullUp="pullUp" 
      :beforeScroll="beforeScroll"
      @scrollToEnd="searchMore"
      @beforeScroll="listScroll">
    <ul class="suggest-list" >
      <li @click="selectItem(item)" class="suggest-item" v-for="(item,index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>

    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉,暂无搜索结果"></no-result>
    </div>
  </scroll>
  
</template>

<script type="text/ecmascript-6">
import {search} from "api/search"
import {ERR_OK} from 'api/config'
import {createSong} from "common/js/song"
import Scroll from "base/scroll/scroll"
import Loading from "base/loading/loading"
import NoResult from "base/no-result/no-result"
import Singer from "common/js/singer"
import {mapMutations,mapActions} from "vuex"
const TYPE_SINGER = 'singer'
const perpage = 20

  export default {
    props:{
       query:{
         type:String,
         default:''
       },
       showSinger:{
         type:Boolean,
         default:true
       }
    },
    data(){
      return {
        page:1,
        result:[],
        pullUp:true,
        beforeScroll:true,
        hasMore:true,
        resultMes:''
      }
    },
    components:{
      Scroll,
      Loading,
      NoResult
    },
    watch:{
      query(){
        this._search()
      }
    },
    methods:{
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ]),
      //请求搜索
      _search(){
        this.page = 1
        this.$refs.suggest.scrollTo(0,0)
        this.hasMore = true
        search(this.query,this.page,this.showSinger,perpage).then((res)=>{
          if(res.code === ERR_OK){
            this.result = this._genResult(res.data)
            this._checkMore(res.data)
          }
        })
      },
      //处理数据
      _genResult(data){
        let ret=[]
        if(data.zhida && data.zhida.singerid){
          ret.push({...data.zhida,...{type:TYPE_SINGER}})
        }

        if(data.song){
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs(list){
        let ret =[]
        list.forEach((musicData)=>{
          
          if(musicData.songid && musicData.albumid){
              ret.push(createSong(musicData))
          }
        })
        return ret
      },
      //处理Class
      getIconCls(item){
        if(item.type===TYPE_SINGER){
          return 'icon-mine'
        }else{
          return 'icon-music'
        }
      },
      //处理name
      getDisplayName(item){
        if(item.type === TYPE_SINGER){
          return item.singername
        }else{
          return item.songname +'-'+(item.singer)
        }
      },
      _checkMore(data) {
        const song = data.song
        if(!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
          this.hasMore = false
        }
      },
      //加载更多
      searchMore(){
        if(!this.hasMore){
          return
        }

        this.page++

        search(this.query,this.page,this.showSinger,perpage).then((res)=>{
          if(res.code === ERR_OK){
      
            this.result = this.result.concat( this._genResult(res.data) )
           
            this._checkMore(res.data)
          }
        })
      },
      //选择item
      selectItem(item){
        
        if(item.type === TYPE_SINGER){ //===>歌手页面
            const singer = new Singer({
              id:item.singerid,
						  name:item.singername,
					  	mid:item.singermid
            })
            
            this.$router.push({
              path:`/search/${singer.mid}`
            })

            this.setSinger(singer)
        }else{ //===>歌曲页面

           this.insertSong(item)
        }

        this.$emit('select')
      },
      //列表滚动
      listScroll(){
        this.$emit('listScroll')
      },
      //刷新refresh
      refresh(){
        this.$refs.suggest.refresh()
      }
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
      .no-result-content
            text-align:center
</style>