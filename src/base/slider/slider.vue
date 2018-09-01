<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" 
        v-for="(item,index) in docs" 
        :class="{active :currentPageIndex === index}"
        :key="index">
      </span>
    </div>
   
  </div>
</template>

<script type="text/ecmascript-6">
import {addClass,hasClass} from 'common/js/dom'
import BScroll from 'better-scroll'
export default{
  data(){
    return {
      docs:[],
      currentPageIndex:0,
    }
  },
  props:{
    loop:{ // 循环轮播
      type:Boolean,
      default:true
    },
    autoPlay:{  // 自动轮播
      type:Boolean,
      default:true
    },
    interval:{//时间间隔
      type:Number,
      default:4000
    }

  },
  mounted(){
    setTimeout(() => {
        //设置slider宽度
        this._setSliderWidth()
        //设置小圆点
        this._initDocs()
        //初始化Slider
        this._initSlider()
        //自动播放
        if(this.autoPlay){
          this._play()
        }
      
    },20)

    window.addEventListener('resize',() => {
       if(!this.slider){
         return 
       }
       this._setSliderWidth(true)
       this.slider.refresh()
    })
  },
  //销毁组件
  beforeDestroy(){
    clearTimeout(this.timer)
  },
  methods:{
    //设置slider宽度
    _setSliderWidth(isResize){
      
      this.children =  this.$refs.sliderGroup.children
      //console.log(this.children)
      let width = 0
      let sliderWidth =this.$refs.slider.clientWidth
      //console.log(sliderWidth)
      for(let i=0;i < this.children.length ; i++){
        let child = this.children[i]
        addClass(child,'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }

      if(this.loop && !isResize){
        width += 2*sliderWidth
      }
      this.$refs.sliderGroup.style.width = width +'px'
      //console.log(width)
    },
    //初始化slider
    _initSlider(){
      this.slider = new BScroll(this.$refs.slider,{
        scrollX:true,
        scrollY:false,
        momentum:false,
        snap:true,
        snapLoop:this.loop,
        snapThreshold:0.3,
        snapSpeed:400,
      })
      this.slider.on('scrollEnd',()=>{
          let pageIndex = this.slider.getCurrentPage().pageX
          if(this.loop){
            pageIndex -= 1
          }
          this.currentPageIndex = pageIndex

          if(this.autoPlay){
            clearTimeout(this.timer);
            this._play()
          }
      })
    },
    //设置小圆点
    _initDocs(){
      this.docs = new Array(this.children.length)
    },
    //自动播放
    _play(){
      let pageIndex = this.currentPageIndex + 1
      if(this.loop){
        pageIndex += 1
      }
      this.timer =setTimeout(()=>{
        this.slider.goToPage(pageIndex,0,400)
      },this.interval)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    position relative
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>