<template>
	<div class="singer" ref="singer">
		<listview :data="singers"  ref="list" @select="selectSinger"></listview>
		<router-view></router-view>
	</div>
</template>
<script type="text/ecmascript-6">
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
import Listview from 'base/listview/listview'
import {mapMutations} from 'vuex'
import {playlistMixin} from 'common/js/mixin'
const HOT_NAME="热门"
const HOT_SINGER_LEN = 10

export default{
	mixins:[playlistMixin],
	data() {
		return{
			singers:[]
		}
	},
	components:{
		Listview
	},
	created(){
		this._getSingerList()
	},
	methods:{
		...mapMutations({
			setSinger: 'SET_SINGER'
		}),
		//控制播放List
		handlePlayList(playList){
			const bottom = playList.length >0 ? '60px' : ''
			this.$refs.singer.style.bottom = bottom
			this.$refs.list.refresh()
		},
		//获取歌手列表
		_getSingerList(){
			getSingerList().then((res)=>{
				if(res.code == ERR_OK){
					this.singers =this._normalizeSinger(res.data.list) 
				}
			})
		},
		//处理字母排序
		_normalizeSinger(list){
			//初始化数据结构
			let map={
				//热门数据
				hot:{
					title:HOT_NAME,
					items:[]
				}
				//A---Z聚类
			}
			list.forEach((item,index)=>{
				//循环热门数据
				if(index<HOT_SINGER_LEN){
					map.hot.items.push(new Singer({
						id:item.Fsinger_id,
						name:item.Fsinger_name,
						mid:item.Fsinger_mid
					}))
				}
				//设置 A--Z聚类K值
				const key = item.Findex
				if(!map[key]){
					map[key]={
						title:key,
						items:[]
					}
				}
				//循环A--Z聚类
				map[key].items.push(new Singer({
					id:item.Fsinger_id,
					name:item.Fsinger_name,
					mid:item.Fsinger_mid
				}))
			})
			
			//为了得到有序列表，处理map,因为遍历对象是无序的
			let hot=[]
			let ret =[]
			var aug=/[a-zA-Z]/
			for(let key in map){
				let val = map[key]
				if(aug.test(val.title)){
					ret.push(val)
				}else if(val.title==HOT_NAME){
					hot.push(val)
				}
			}
			//升序排序 A--Z
			ret.sort((a,b)=>{
				return a.title.charCodeAt(0) - b.title.charCodeAt(0)
			})
			return hot.concat(ret)//concat() 链接两个数组链接

		},
		//选中元素
		selectSinger(singer){
			//console.log(singer)
			this.$router.push({
				path:`/singer/${singer.mid}`
			})
			this.setSinger(singer)
		},
		
		
	}
}

</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
.singer
	position:fixed
	top:88px
	bottom:0
	width:100%
</style>