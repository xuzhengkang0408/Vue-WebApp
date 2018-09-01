import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config'
import axios from 'axios'

//获取banner轮播图 JSONP
export function getRecommend(){

	const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
	const data = Object.assign({},commonParams,{
		platform:'h5',
		uin:0,
		needNewCode:1
	})
	return jsonp(url,data,options)
}
//获取歌单列表 axios
export function getDiscList(){
	const url = "/api/getDiscList"
	const data = Object.assign({},commonParams,{
		picmid:1,
		rnd:Math.random(),
		platform:'yqq',
		hostUin:0,
		needNewCode:0,
		sin:0,
		ein:29,
		sortId:5,
		categoryId:10000000
		
	})
	return axios.get(url,{
		params:data
	}).then((res)=>{
		return Promise.resolve(res)
	})
}


//获取推荐列表
export function getSongList(disstid){

	const url = "/api/getSongList"
	const data = Object.assign({},commonParams,{
		disstid:disstid,
		type:1,
		json:1,
		utf8:1,
		onlysong:0,
		platform:'yqq',
		hostUin:0,
		needNewCode:0
		
	})
	return axios.get(url,{
		params:data
	}).then((res)=>{
		return Promise.resolve(res)
	})
}
