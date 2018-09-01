
import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config'
import axios from 'axios'
//获取歌曲列表
export function getSingerList(){
	const url ="https://c.y.qq.com/v8/fcg-bin/v8.fcg"
	const data = Object.assign({},commonParams,{
		channel:'singer',
		page:'list',
		key:'all_all_all',
		pagesize:100,
		pagenum:1,
		loginUin:0,
		hostUin:0,
		platform:'yqq',
		needNewCode:0
	})
	
	return jsonp(url,data,options)
}

//获取歌手详情
export function getSingerDetail(singerId){
		const  url ='https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

		const  data = Object.assign({},commonParams,{
			uin:0,
			platform:'h5page',
			needNewCode:1,
			num:15,
			begin:0,
			singerid:singerId

		})
		return jsonp(url,data,options)
	}

export function getSingerPlay(musicid){
		const  url ='https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
		const  a = "MusicJsonCallback" + (Math.random() + "").replace("0.", "")
		const  data = Object.assign({},{
				g_tk:5381,
				inCharset:'utf-8',
				outCharset:'utf-8',
				notice:0,
				format:'json',
				uin:0,
				platform:'yqq',
				needNewCode:1,
				loginUin:0,
				hostUin:0,
				guid:'504753841',
				cid:'205361747',
				filename:'c400'+musicid.mid+'.m4a',
				songmid:musicid.mid,
				callback:a
				})
				const option = {
				param:'jsonpCallback',
				name:a
		}
		
		return jsonp(url,data,option)
}

		
	