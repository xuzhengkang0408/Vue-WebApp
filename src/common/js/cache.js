import  storage from "good-storage"
import Song from "common/js/song"
//搜索历史
const SEARCH_KEY = "_search_"
const SEARCH_MAX_LENGTH =15


//播放历史
const PLAY_list = "_playlist_"
const PLAYHISTORY = "_playhistory_"
const PLAY_MAX_LENGTH =200


//我喜欢的歌
const FAVORITELIST = "_favoritelist_"
const FAVO_MAX_LENGTH =200

//插入数据
function insertArray(arr,val,compare,maxLen) { 
	const index = arr.findIndex(compare)
	if(index === 0 ){
		return 
	}else if(index > 0 ){
		arr.splice(index,1)
	}
	arr.unshift(val)
	if(maxLen && arr.length > maxLen){
		arr.pop()
	}
}
//删除数据
function deleteArray(arr,compare) { 
	const index = arr.findIndex(compare)
	if(index > -1){
		arr.splice(index,1)
	}
}
//搜索历史
export function saveSearch(query) {
	let searches = storage.get(SEARCH_KEY,[])
	insertArray(searches,query,(item) => {
		return item === query 
	},SEARCH_MAX_LENGTH)
	storage.set(SEARCH_KEY,searches)
	return searches
}
export function loadSearch(){
	return  storage.get(SEARCH_KEY,[])
}

export function deleteSearch(query) {
	let searches = storage.get(SEARCH_KEY,[])

	deleteArray(searches,(item)=>{
		return item === query 
	})
	
	storage.set(SEARCH_KEY,searches)
	return searches
}

export function deleteWholeSearch() {
	storage.remove(SEARCH_KEY)
	return []
}




//播放历史

export function savePlay(songs){
	let playkey = storage.get(PLAYHISTORY,[])
	
	insertArray(playkey,songs,(item)=>{
		return item.id === songs.id
	},PLAY_MAX_LENGTH)

	storage.set(PLAYHISTORY,playkey)
	return playkey

}

export function loadPlay(){
	let arr = []
	storage.get(PLAYHISTORY,[]).forEach((e)=>{
		arr.unshift(new Song(e))
	})
	return arr
}

export function deletewholePlayList() {
	storage.remove(PLAY_list)
	return []
}



//喜欢列表
export function loadFavoriteList(){
	return storage.get(FAVORITELIST,[])
}
export function saveFavorite(query){
	let favorites = storage.get(FAVORITELIST,[])
	
	insertArray(favorites,query,(item)=>{
		return item.id === query.id
	},FAVO_MAX_LENGTH)
	storage.set(FAVORITELIST,favorites)
	return favorites

}

export function deleteFavorite(query) {

	let favorites = storage.get(FAVORITELIST,[])

	deleteArray(favorites,(item)=>{

		return query.id === item.id
	})
	let index = favorites.findIndex((item)=>{
		return query.id === item.id
	})

	storage.set(FAVORITELIST,favorites)
	
	return favorites
}
