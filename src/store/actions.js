import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch,deleteSearch,deleteWholeSearch,savePlay,loadPlay,deletewholePlayList,deleteFavorite,saveFavorite} from "common/js/cache"

//找索引值
function findIndex(list,song){
    return list.findIndex((item)=>{
        return item.id === song.id
    })
}
//设置选择播放
export const selectPlay = function({commit,state},{list,index}){
    commit(types.SET_SEQUENCE_LIST,list)

    if(state.mode===playMode.random){
        let randomList = shuffle(list)
        commit(types.SET_PLAYLIST,randomList)
        index = findIndex(randomList,list[index])
       
    }else{
        commit(types.SET_PLAYLIST,list)
    }
    
    commit(types.SET_CURRENT_INDEX,index)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PLAYING_STATE,true)
}

//设置随机播放
export const randomPlay = function({commit},{list}) {
    commit(types.SET_PLAY_MODE,playMode.random)
    commit(types.SET_SEQUENCE_LIST,list)
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST,randomList)
    commit(types.SET_CURRENT_INDEX,0)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PLAYING_STATE,true)
}

//插入播放列表
export const insertSong = function ({commit,state},song) {
    let playList = state.playList.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex

    //记录当前歌曲
    let currentSong = playList[currentIndex]

    //查找当前列表中是否有待插入的歌曲，并返回其索引值
    let fpIndex = findIndex(playList,song)

    //因为是插入歌曲，索引+1
    currentIndex++
    //插入这首歌到当前索引位置
    playList.splice(currentIndex,0,song) 

    //当前列表中，已经有待插入歌曲，
    if(fpIndex>-1){
        //如果当前插入的序号大于列表中的序号
        if(currentIndex > fpIndex){
            playList.splice(fpIndex,1) 
            currentIndex--
        } //如果当前插入的序号小于列表中的序号
        else{
            playList.splice(fpIndex+1,1)     
        }
    }
    

    let currentSIndex = findIndex(sequenceList,currentSong)+1

    let fsIndex = findIndex(sequenceList,song)

    sequenceList.splice(currentSIndex,0,song)

    if(fsIndex>-1){
        if(currentSIndex>fsIndex){
            sequenceList.splice(fsIndex,1) 
          
        }else{
            sequenceList.splice(fsIndex+1,1)  
        }
    }

    commit(types.SET_PLAYLIST,playList)
	commit(types.SET_SEQUENCE_LIST,sequenceList)
    commit(types.SET_CURRENT_INDEX,currentIndex)
    commit(types.SET_PLAYING_STATE,true)
	commit(types.SET_FULL_SCREEN,true)

}

//保存搜索历史
export const saveSearchHistory = function ({commit},query){
    commit(types.SET_SEARCH_HISTORY,saveSearch(query))
}

//删除单个历史查询
 export const deleteSearchHistory = function({commit},query){
     commit(types.SET_SEARCH_HISTORY,deleteSearch(query))
 }

//删除整个历史查询
export const deleteWholeSearchHistory = function ({commit}){
	commit(types.SET_SEARCH_HISTORY,deleteWholeSearch())
}

//在播放列表里 删除一首歌曲
export const deleteSong = function ({commit,state},song){
    let playList = state.playList.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex

    //播放列表
    let pIndex = findIndex(playList,song)
    playList.splice(pIndex,1)
    //循环列表
    let sIndex = findIndex(sequenceList,song)
    sequenceList.splice(sIndex,1)

    if(currentIndex>pIndex || currentIndex===playList.length){
        currentIndex --
    }

    commit(types.SET_PLAYLIST,playList)
    commit(types.SET_SEQUENCE_LIST,sequenceList)
    commit(types.SET_CURRENT_INDEX,currentIndex)

    if(!playList.length){
        commit(types.SET_PLAYING_STATE,false)
    }else{
        commit(types.SET_PLAYING_STATE,true)
    }

}

//从播放列表里 删除全部歌曲
export const deleteWholeplayList = function ({commit}){
    commit(types.SET_PLAYLIST,[])
    commit(types.SET_SEQUENCE_LIST,[])
    commit(types.SET_CURRENT_INDEX,-1)
    commit(types.SET_PLAYING_STATE,false)
}


//播放记录插入数据
export const savePlayHistory = function ({commit},song){
    commit(types.SET_PLAY_HISTORY,savePlay(song))
}

