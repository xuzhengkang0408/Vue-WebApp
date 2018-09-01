import {playMode} from 'common/js/config'
import {loadSearch,loadPlay} from 'common/js/cache'
const state = {
	singer:{},//歌手数据
	playing:false,//播放状态
	fullScreen:false,//全屏状态
	playList:[],//播放列表
	sequenceList:[],//排序列表
	mode:playMode.random,//播放模式
	currentIndex:-1,//播放索引
	disc:{},//歌单推荐数据
	topList:{},//排行榜数据
	searchHistory:loadSearch(),//搜索历史数据,
	playHistory:loadPlay() //播放历史数据,



}

export default state