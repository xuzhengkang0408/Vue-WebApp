
import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config'
import axios from 'axios'
//获取歌词
export function getLyric(musicid){
		const  url ='api/getLyric'
		const  a = "MusicJsonCallback_lrc"
		const  data = Object.assign({},{
			g_tk:5381,
			inCharset:'utf-8',
			outCharset:'utf-8',
			pcachetime:+new Date(),
			notice:0,
			format:'jsonp',
			uin:0,
			platform:'yqq',
			needNewCode:0,
			loginUin:0,
			hostUin:0,
			songmid:musicid,
			callback:a
		})
		const option = {
			param:'jsonpCallback',
			name:a
		}
		
		return axios.get(url,{
			params:data
		}).then((res)=>{
			return Promise.resolve(res)
		})
}



		
