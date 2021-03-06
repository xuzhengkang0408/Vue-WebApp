<template>
  <scroll class="listview" 
      :data="data" 
      ref="listview"
      :listenScroll="listenScroll"
      :probeType="probeType"
      @scroll="scroll">
    <!--歌手循环-->
    <ul>
      <li class="list-group" v-for="(group,index) in data " :key="index" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
           <li  class="list-group-item" 
            v-for= "(item,index) in group.items" 
            :key="index"
            @click="selectItem(item)">
            <img  class="avatar" v-lazy="item.avatar" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!--A-Z循环-->
    <div class="list-shortcut" 
      @touchstart="onShortcutTouchstart"
      @touchmove.stop.prevent="onShortcutTouchmove">
      <ul class="item">
        <li v-for="(item,index) in shortcutlist" 
            :key="index"
            :data-index="index" 
            :class="['item',{'current':currentIndex==index}]">{{item}}</li>
      </ul>
    </div>

    <div class="list-fixed" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
  </scroll>


</template>
<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'

const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30
export default{ 
  props:{
    data:{
      type:Array,
      default:[]
    },
  },
  created() {
    this.touch = {}
    this.listenScroll = true
    this.listHeight= []
    this.probeType =3
  },
  data(){
    return{
      scrollY:-1,
      currentIndex:0,
      diff:-1
    }
  },
  components:{
      Scroll
  },
  computed:{
      //字母序列表
      shortcutlist(){
        return this.data.map((group)=>{
          return  group.title.substr(0,1)
        })
      },
      fixedTitle(){
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title:''
      }
  },
  watch:{
    //监听data发生变化时，计算高度
    data(){
      setTimeout(() => {
        this._calculateHeight()
      }, 20);
    },
    scrollY(newY){
 
      const listHeight = this.listHeight
      //当滚动到顶部，newY > 0
      if(newY > 0) {
        this.currentIndex = 0
        return
      }
      //在中间部分滚动
      for(let i=0;i<listHeight.length-1;i++){
        let height1 = listHeight[i]
        let height2 = listHeight[i+1]
        if(-newY >= height1 && -newY < height2){
          this.currentIndex = i
          this.diff = height2+newY
          return 
        }
      }
      //当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2

    },
    diff(newVal){
      let fixedTop = (newVal>0 && newVal<TITLE_HEIGHT) ? newVal-TITLE_HEIGHT : 0
      if(this.fixedTop ==fixedTop){
        return
      }
      this.fixedTop =fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  methods:{
    //重新刷新
    refresh(){
      this.$refs.listview.refresh()
    },
    //右侧列表拖动Touchstart
    onShortcutTouchstart(e){
      let anchorIndex = getData(e.target,'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY //第一次开始Y轴坐标
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
      
    },
    //右侧列表拖动Touchmove
    onShortcutTouchmove(e){
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY //第二次Touchmove开始Y轴坐标
      let delta = (this.touch.y2-this.touch.y1) / ANCHOR_HEIGHT | 0 
      let anchorIndex = parseInt(this.touch.anchorIndex)+delta
      this._scrollTo(anchorIndex)
    },
    //滑动到指定位置
    _scrollTo(index){
      this.scrollY  = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0)
    },
    scroll(pos){
        this.scrollY = pos.y
    },
    //计算A--Z每一个区间断的高度
    _calculateHeight(){
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for(let i = 0 ; i < list.length ;i++){
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
    },
    //选择item
    selectItem(item){
      this.$emit('select',item)
    }
  }
}
</script>
<style scroped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>