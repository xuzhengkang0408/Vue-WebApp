import Vue from 'vue'
import Router from 'vue-router'

//推荐页
import Recommend from "components/recommend/recommend"
import Disc from 'components/disc/disc'


//歌手页
import Singer from "components/singer/singer"
import SingerDetail from "components/singer-detail/singer-detail"

//排行榜
import Rank from "components/rank/rank"
import TopList from "components/top-list/top-list"

//搜索页面
import Search from "components/search/search"

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children:[
        {
          path:':id',
          component:Disc,
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children:[
        {
          path: ':id',
          component: SingerDetail,
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children:[{
        path:':id',
        component:TopList
      }]
    },
    {
      path: '/search',
      component: Search,
      children:[
        {
          path: ':id',
          component: SingerDetail,
        }
      ]
    },
    
    
  ]
})
