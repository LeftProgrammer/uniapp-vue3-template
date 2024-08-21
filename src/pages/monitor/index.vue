<route lang="json5">
{
  style: {
    navigationBarTitleText: '视频监控',
  },
  needLogin: true,
}
</route>

<template>
  <view class="w-full h-full flex flex-col overflow-hidden bg-#F5F5F5">
    <view class="px-4 pb-4 bg-#1851E4">
      <uv-search
        placeholder="请输入设备名称"
        v-model="queryParams.equipmentSerial"
        shape="square"
        :showAction="false"
        :clearabled="true"
        @search="search"
      ></uv-search>
    </view>
    <view class="w-full">
      <uv-drop-down
        ref="dropDown"
        sign="dropDown_1"
        :extra-icon="{ name: 'arrow-down-fill', color: '#666', size: '26rpx' }"
        :extra-active-icon="{ name: 'arrow-up-fill', color: '#3c9cff', size: '26rpx' }"
        :custom-style="{ padding: '0 30rpx' }"
        @click="selectMenu"
        :defaultValue="defaultValue"
      >
        <uv-drop-down-item
          v-for="item in filters"
          :key="item.name"
          :name="item.name"
          :type="item.type"
          :label="item.label"
          :value="item.value"
        ></uv-drop-down-item>
      </uv-drop-down>

      <uv-drop-down-popup
        sign="dropDown_1"
        :click-overlay-on-close="true"
        :currentDropItem="currentDropItem"
        @clickItem="clickItem"
        @popupChange="change"
      ></uv-drop-down-popup>
    </view>

    <view class="w-full flex-1 flex flex-col overflow-hidden px-2.5 bg-#f5f5f5">
      <view class="flex items-center my-2.5">
        <view class="w-1 h-2.5 bg-#1851E4 mr-1.5"></view>
        <text class="text-4.5 c-#1D2129 font-600">监控列表（{{ total }}）</text>
      </view>
      <scroll-view class="flex-1 overflow-y-auto" :scroll-y="true" @scrolltolower="loadmore">
        <view class="w-full h-full flex flex-wrap justify-between">
          <view
            class="minitor-item w-48% h-50 bg-#FFFFFF mb-4 rounded-2 relative overflow-hidden"
            v-for="(item, index) in pageList"
            :key="index"
            @click="toDetail(item)"
          >
            <view
              class="w-8.25 h-6 absolute top-0 right-0 rounded-bl-2 rounded-tr-2"
              :class="item.minitorType"
            ></view>
            <image
              v-if="item.equipmentUrl"
              class="w-full h-29"
              src="../../static/monitor/online.png"
            />
            <view v-else class="w-full h-29 flex justify-center items-center bg-#D6D6D6">
              <image class="w-15.5 h-14.5" src="../../static/monitor/offline.png" />
            </view>
            <view class="px-2 pt-1 pb-2.5 text-3.5">
              <view class="c-#1D2129 mb-1.5">{{ item.minitorName }}</view>
              <view class="c-#999999 mb-1.5">编号：{{ item.equipmentSerial }}</view>
              <view class="c-#999999">类型：{{ getDictName(item.minitorType) }}</view>
            </view>
          </view>
          <view class="w-full">
            <uv-load-more :status="status" @loadmore="loadmore" />
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getDictItems } from '@/service/dict'
import { getMinitorList } from '@/service/home'

const filters = ref([
  {
    name: 'installArea',
    type: '2',
    label: '安装区域',
    value: '',
    child: [{ label: '安装区域-全部', value: '' }],
  },
  {
    name: 'minitorType',
    type: '2',
    label: '监控器类型',
    value: '',
    child: [{ label: '监控器类型-全部', value: '' }],
  },
])

const defaultValue = ref(['', ''])
const activeName = ref('installArea')

const queryParams = reactive({
  equipmentSerial: '',
  installArea: '', // 安装区域
  minitorType: '', // 监控类型
  pageNo: 1,
  pageSize: 10,
})

const pageList = ref([])
const total = ref(0)
const pages = ref(0)
const status = ref('loadmore')

const currentDropItem = computed(() => {
  return filters.value.find((item) => item.name === activeName.value)
})

onLoad(() => {
  getDictItems('installArea').then((res) => {
    console.log('installArea', res)
    const processedResult = (res.result || []).map((item) => {
      return {
        label: item.title,
        value: item.value,
      }
    })
    filters.value[0].child = filters.value[0].child.concat(processedResult)
  })
  getDictItems('minitorDeviceType').then((res) => {
    console.log('minitorDeviceType', res)
    const processedResult = (res.result || []).map((item) => {
      return {
        label: item.title,
        value: item.value,
      }
    })
    filters.value[1].child = filters.value[1].child.concat(processedResult)
  })
  getMonitors(queryParams)
})

const getDictName = (code) => {
  const item = filters.value[0].child.find((x) => x.value === code)
  return item ? item.label : ''
}

const getMonitors = async (params) => {
  const { code, message, result } = await getMinitorList(params)
  if (code === 200 && result) {
    total.value = result?.total || 0
    pages.value = Math.ceil(total.value / params.pageSize)
    pageList.value = pageList.value.concat(result?.records || [])
    status.value = params.pageNo >= pages.value ? 'nomore' : 'loadmore'
  } else {
    useToast(message)
  }
}

const loadmore = () => {
  if (queryParams.pageNo < pages.value) {
    status.value = 'loading'
    queryParams.pageNo += 1
    getMonitors(queryParams)
  } else {
    status.value = 'nomore'
  }
}

const initializeParams = () => {
  queryParams.pageNo = 1
  queryParams.pageSize = 10
  pageList.value = []
  total.value = 0
  status.value = 'loadmore'
}

const selectMenu = (e) => {
  activeName.value = e.name
}

const clickItem = (e) => {
  const selectedFilter = filters.value.find((item) => item.name === activeName.value)
  if (selectedFilter) {
    queryParams[activeName.value] = e.value
    selectedFilter.label = e.label
    selectedFilter.value = e.value
    initializeParams()
    getMonitors(queryParams)
  }
}

const change = (e) => {
  console.log('弹窗打开状态：', e)
  setTimeout(() => {
    console.error('currentDropItem.value', currentDropItem.value)
  }, 1000)
}

const search = () => {}

const toDetail = (item) => {
  uni.navigateTo({
    url: `/pages/monitor/detail?item=${encodeURIComponent(JSON.stringify(item))}`,
  })
}
</script>
<style lang="scss" scoped>
.minitor-item {
  .SpeedDomeCameras {
    background-image: url('../../static/monitor/SpeedDomeCameras.svg');
  }
  .GunMechanism {
    background-image: url('../../static/monitor/GunMechanism.svg');
  }
  .AIRecognition {
    background-image: url('../../static/monitor/AIRecognition.svg');
  }
  .Panorama {
    background-image: url('../../static/monitor/Panorama.svg');
  }
  &:nth-last-child(2),
  &:nth-last-child(3) {
    margin-bottom: 0;
  }
}
</style>
