<route lang="json5">
{
  style: {
    navigationBarTitleText: '避风通知',
  },
  needLogin: true,
}
</route>
<template>
  <view class="bg-#f5f5f5 h-100% box-border relative overflow-hidden">
    <view class="px-2 pt-2.5 pb-16 h-100% overflow-auto">
      <!-- <uv-loading-page :loading="loading" icon-size="50rpx"></uv-loading-page> -->
      <view class="mb-2.5 border-none relative overflow-hidden" v-for="item in list" :key="item.id">
        <uv-swipe-action>
          <uv-swipe-action-item
            :options="options"
            :disabled="item.disabled"
            @click="handlDelete(item.id)"
          >
            <jh-card
              :titleText="item.name"
              :tagText="item.tagText"
              v-bind="cardProps"
              @click="handleGoDetail(item)"
            >
              <template v-slot:right>
                <uv-tags :text="item.tagDesc" size="mini" :type="item.tagType || 'info'"></uv-tags>
              </template>

              <template v-slot:body>
                <view
                  class="py-3 mx-3 border-b border-[#e5e6eb] h-30 flex flex-col justify-between"
                >
                  <view class="text-4 c-#86909C">
                    计划避风开始时间:
                    <text class="text-4 c-#4E5969 ml-1">{{ item.planStartDate }}</text>
                  </view>
                  <view class="text-4 c-#86909C">
                    计划避风结束时间:
                    <text class="text-4 c-#4E5969 ml-1">{{ item.planEndDate }}</text>
                  </view>
                  <view class="text-4 c-#86909C">
                    本次截止上报时间:
                    <text class="text-4 c-#4E5969 ml-1">{{ item.deadline }}</text>
                  </view>
                </view>
              </template>

              <template v-slot:footer>
                <view class="w-full p-3 text-4 c-#1D2129 text-wrap break-all">
                  通知人员：
                  <!-- <uv-tags
                    v-for="(i, index) in item.receiver"
                    :key="index"
                    :text="i?.name + '-' + i?.phone"
                    plain
                    type="info"
                  ></uv-tags> -->
                  {{ item.receiver }}
                </view>
              </template>
            </jh-card>
          </uv-swipe-action-item>
        </uv-swipe-action>
      </view>
    </view>
    <view
      class="absolute bottom-0 left-0 right-0 h-16 flex items-center flex-justify-around bg-white z-10"
    >
      <view class="w-35">
        <uv-button type="primary" text="新增避风通知" @click="handleGoDetail({})"></uv-button>
      </view>
    </view>
  </view>
</template>

<script setup>
import JhCard from '@/components/jh-card/index.vue'
import { noticeList, noticeDelete } from '@/service/windShelter/notice/index'
import { useToast, useDialog } from '@/utils/modals'
import { isString } from 'lodash-es'

const tagObj = [
  {
    desc: '草稿',
    state: 0,
    type: 'info',
  },
  {
    desc: '已发布',
    state: 1,
    type: 'success',
  },
  {
    desc: '已结束',
    state: 2,
    type: 'primary',
  },
]
const cardProps = reactive({
  header: {
    bgcolor: 'linear-gradient( 360deg, rgba(157,214,255,0) 20%, rgba(50, 84, 255, 0.16) 100%)',
  },
  imageUrl: '../../../static/home/card-icon-1.png',
  // title: {
  //   text: '气象预警',
  // },
  tag: {
    text: '无',
  },
})
const list = ref([])
const loading = ref(false)

const options = [
  {
    text: '删除',
    style: {
      backgroundColor: '#f56c6c',
    },
  },
]

onShow(() => {
  getList()
})
/**
 * @description 获取报备列表
 */
const getList = () => {
  loading.value = true
  noticeList()
    .then((res) => {
      const { code, message, result } = res
      if (code === 200) {
        const unPublishedList = result.unPublishedList || []
        const publishedList = result.publishedList || []
        const hasEndedList = result.hasEndedList || []

        list.value = [...unPublishedList, ...publishedList, ...hasEndedList]
        list.value.forEach((item) => {
          item.tagText = item?.updateTime ? item?.updateTime : '无'
          const obj = tagObj.find((e) => e.state === item.state)
          item.tagDesc = obj.desc
          item.state = obj.state
          item.tagType = obj.type
          if (isString(item.receiverInfo)) {
            const receiverAry = JSON.parse(item.receiverInfo) || []
            item.receiver = receiverAry.map((item) => `${item.name}-${item.phone}`).join('; ')
          } else {
            item.receiver = '无'
          }
          // 数据更新后，恢复删除按钮的隐藏状态
          if ([1, 2].includes(item.state)) {
            item.disabled = true
          } else {
            item.disabled = false
          }
        })
      } else {
        useToast(message)
      }
    })
    .finally(() => {
      loading.value = false
    })
}
const handlDelete = async (id) => {
  await useDialog(`确认删除？`, {
    showCancelButton: true,
  })
  const { code, message } = await noticeDelete({ id })
  if (code === 200) {
    useToast('操作成功')
    getList()
  } else {
    useToast(message)
  }
}
const handleGoDetail = (item) => {
  uni.navigateTo({
    url: `/pages/windShelter/notice/detail?item=${encodeURIComponent(JSON.stringify(item))}`,
  })
}
</script>
