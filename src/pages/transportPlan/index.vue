<route lang="json5">
{
  style: {
    navigationBarTitleText: '运输计划',
  },
  needLogin: true,
}
</route>
<template>
  <view class="h-full flex flex-col relative overflow-hidden">
    <view class="bg-white z-10">
      <uv-tabs
        :current="current"
        :list="tabList"
        @click="handleClick"
        :lineWidth="100"
        :lineColor="'#3254ff'"
        :customStyle="{ bottom: 0 }"
        :itemStyle="{ width: '50%', height: '48px' }"
      ></uv-tabs>
    </view>
    <scroll-view
      class="flex-1 p-2 relative overflow-auto"
      :scroll-y="true"
      @scrolltolower="loadmore"
    >
      <template v-for="(item, index) in dataList" :key="index">
        <view class="bg-#FFFFFF rounded-1.5 mb-2 px-2" @click="clickItem(item.id)">
          <view class="h-12.5 flex items-center border-b-1">
            <image class="w-6 h-6 m-r-2" src="../../static/images/title-icon.png" />
            <text class="text-4 c-#1D2129 font-700">{{ item.transportCode }}</text>
          </view>
          <uv-cell
            title="承运人："
            :value="item.carrier"
            :border="false"
            @click="clickItem(item.id)"
          ></uv-cell>
          <uv-cell
            title="联系电话："
            :value="item.phone"
            :border="false"
            @click="clickItem(item.id)"
          ></uv-cell>
          <uv-cell
            title="运输货物："
            :value="item.transportGoods"
            :border="false"
            @click="clickItem(item.id)"
          ></uv-cell>
          <uv-cell
            title="运输船舶MMSI："
            :value="item.mmsi"
            :border="false"
            @click="clickItem(item.id)"
          >
            <!-- <template v-slot:right-icon>
              <uv-icon size="30rpx" name="arrow-right"></uv-icon>
            </template> -->
          </uv-cell>
          <uv-cell
            title="预计送达时间："
            :value="item.arriveDate"
            :border="false"
            @click="clickItem(item.id)"
          ></uv-cell>
        </view>
      </template>
      <uv-load-more :status="status" @loadmore="loadmore" />
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
import { planList } from '@/service/transportPlan/index'
import { useToast } from '@/utils/modals'

interface Tab {
  name: string
  code: string
}

const tabList: Tab[] = [
  { name: '进行中', code: 'underway' },
  { name: '已完成', code: 'over' },
]

const current = ref(0)
const dataList = ref<any[]>([])
const status = ref('loadmore')
const total = ref(0)
const pages = ref(0)

const param = reactive({
  pageNo: 1,
  pageSize: 6, // 提高分页数量
  status: tabList[current.value].code,
})

const initializeParams = () => {
  param.pageNo = 1
  param.pageSize = 6 // 提高分页数量
  param.status = tabList[current.value].code
  dataList.value = []
  status.value = 'loadmore'
}

const handleClick = ({ index }: { index: number }) => {
  current.value = index
  initializeParams()
  getData()
}

const getData = async () => {
  const { code, message, result } = await planList(param)
  if (code === 200 && result) {
    total.value = result?.total || 0
    pages.value = Math.ceil(total.value / param.pageSize)
    dataList.value = dataList.value.concat(result?.records || [])
    status.value = param.pageNo >= pages.value ? 'nomore' : 'loadmore'
  } else {
    useToast(message)
  }
}

const loadmore = () => {
  if (param.pageNo < pages.value) {
    status.value = 'loading'
    param.pageNo += 1
    getData()
  } else {
    status.value = 'nomore'
  }
}

onShow(() => {
  initializeParams()
  getData()
})

const clickItem = (id: number | string) => {
  console.error('111111111', id)
  uni.navigateTo({
    url: `/pages/transportPlan/detail?id=${id}`,
  })
}

onReachBottom(loadmore)
</script>
