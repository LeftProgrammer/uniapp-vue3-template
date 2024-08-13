<route lang="json5">
{
  style: {
    navigationBarTitleText: '',
  },
  needLogin: true,
}
</route>

<template>
  <view class="page">
    <uni-table :border="false" :stripe="false" style="max-width: 100%">
      <!-- 表头 -->
      <uni-tr>
        <uni-th align="center" width="50px">序号</uni-th>
        <uni-th align="center">工序名称</uni-th>
        <uni-th align="center" width="90px">状态</uni-th>
      </uni-tr>

      <!-- 表格内容 -->
      <uni-tr v-for="(item, index) in tableData" :key="index" @click="handleClick(item)">
        <uni-td align="center">{{ index + 1 }}</uni-td>
        <uni-td align="left">{{ item.processName }}</uni-td>
        <uni-td align="center">
          <view v-if="item.id && item.startTime && item.endTime" class="c-#00B42A">已完成</view>
          <view v-else-if="item.startTime && item.endTime" class="c-#ff9026">已填报</view>
          <view v-else>未开始</view>
        </uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>
<script lang="ts" setup>
import { constructionQueryList } from '@/service/construction/index'
import { useConstructionStore } from '@/store/construction'
import { checkNetwork } from '@/utils/index'
import { useToast } from '@/utils/modals'

const tableData = ref([])
let params: any = { code: '', title: '', pbsId: '', processType: '' }
const constructionStore = useConstructionStore()

onLoad((options) => {
  params = { ...options }
  uni.setNavigationBarTitle({
    title: params.title,
  })
})

onShow(async () => {
  fetchData()
})

const fetchData = async () => {
  if (checkNetwork()) {
    const { code, message, result } = await constructionQueryList({ pbsId: params.pbsId })
    if (code === 200) {
      tableData.value = result || []
    } else {
      useToast(message)
    }
    await constructionStore.getAllProcesses()
  } else {
    // await constructionStore.getAllProcesses()
    const processList: any = constructionStore.processList[params.processType] || []
    console.log('constructionStore.processList', processList)
    // 过滤并匹配缓存的提交数据
    tableData.value = processList.map((item) => {
      const newItem = {
        id: '', // TODO
        processId: item.id || '',
        processName: item.name || '',
        pbsId: params.pbsId || '',
        startTime: '',
        endTime: '',
        useTime: '',
        createBy: '',
        createName: '',
        unitId: '',
        unitName: '',
        file: '',
        constructionState: '',
      }
      const cachedSubmission = constructionStore.pendingSubmissions.find(
        (sub) => sub.pbsId === params.pbsId && sub.processId === item.id,
      )

      if (cachedSubmission) {
        console.log('cachedSubmission===========>', cachedSubmission)
        Object.assign(newItem, cachedSubmission)
      }
      return newItem
    })

    console.error(
      'constructionStore.constructionStore.pendingSubmissions',
      constructionStore.pendingSubmissions,
    )
    console.log('constructionStore.tableData.value', tableData.value)
  }
}

const handleClick = (item) => {
  uni.navigateTo({
    url: `/pages/construction/detail?code=${params.code}&item=${encodeURIComponent(JSON.stringify(item))}`,
  })
}
</script>
<style lang="scss">
.uni-table {
  width: 100%; /* 表格宽度不超过父级元素 */
  border: none;
  .uni-table-tr:nth-child(2n) {
    background-color: #f1f3ff;
  }
  .uni-table-th {
    color: #ffffff;
    background-color: #007aff;
  }
  /* 描述列内容换行 */
  .uni-table-td:nth-child(2) {
    color: #3254ff;
    word-break: break-all;
    word-wrap: break-word;
    white-space: normal;
  }
}
</style>
