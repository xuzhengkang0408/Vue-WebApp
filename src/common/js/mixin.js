import {mapGetters,mapMutations,mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
//底部播放器==> playlistMixin
export const playlistMixin ={
  computed:{
    ...mapGetters([
      'playList'
    ])
  },
  mounted(){
    this.handlePlayList(this.playList)
    
  },
  activated(){
    this.handlePlayList(this.playList)
  },
  watch:{
    playList(newVal) {
			this.handlePlayList(newVal)
		}
  },
  methods:{
    handlePlayList(){
      throw new Error('components must implement handlePlayList method')
    }
  }
}


//随机播放按钮 ===>playerMixin 
export const playerMixin = {
  computed:{
    ...mapGetters([
      'sequenceList',
      'playList',
      'currentSong',
      'mode'
    ]),

    iconMode(){
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
  },

  methods:{
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex:'SET_CURRENT_INDEX',
      setPlayMode:'SET_PLAY_MODE',
      setPlayList:'SET_PLAYLIST'
    }),
    //改变播放模式
    changeMode(){
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      
      let list =null
      //随机播放
      if(this.mode ===playMode.random){
          list = shuffle(this.sequenceList)
      }else{
        list = this.sequenceList
      }
      this._resetCurrentIndex(list)

      this.setPlayList(list)
    },

    //重新定义CurrentIndex
    _resetCurrentIndex(list){
      let index =list.findIndex((item)=>{
        return item.id === this.currentSong.id
      })

      this.setCurrentIndex(index)
    },
  }
}


//搜索、保存历史 ===>searchMixin
export const searchMixin = {
  data(){
    return {
      query:'',
      refreshDelay:100,
    }
  },
  computed:{
    ...mapGetters([
      'searchHistory'
    ]),
  },
  methods:{
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ]),
    
    //添加数据
    addQuery(query){
      this.$refs.searchBox.setQuery(query)
    },
    //键盘失焦
     blurInput(){
      this.$refs.searchBox.blur()
    },
    //保存搜索结果
    saveSearch(){
      this.saveSearchHistory(this.query)
    },
    
    //获取query
    onQueryChange(query){
      this.query = query
    },
  }
}