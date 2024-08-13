<route lang="json5">
{
  style: {
    navigationBarTitleText: '观豚日志',
  },
  needLogin: true,
}
</route>
<template>
  <view class="position-relative">
    <uv-sticky>
      <view class="h-12 bg-#fff flex pl-2 pr-4 flex-justify-between flex-items-center w-100%">
        <view class="flex flex-items-center flex-1 h-100%" @click="open">
          <uv-image
            src="../../static/dolphinWatch/date-icon.png"
            width="24px"
            height="24px"
            class="mr-2"
          ></uv-image>
          <text v-if="date" class="color-#1D2129 font-3.5 line-height-5.5">{{ date }}</text>
          <text v-else class="color-#86909C font-3.5 line-height-5.5">请选择日期</text>
        </view>
        <uv-icon
          :name="date ? 'close-circle' : 'arrow-right'"
          color="#4E5969"
          class="px-4"
          size="16"
          @click="date ? reset() : open()"
        ></uv-icon>
      </view>
    </uv-sticky>
    <view class="box px-2 pb-16 pt-2.5 bg-#f5f5f5">
      <view v-for="(item, i) in listData" :key="item.id" class="bg-#fff h-33 border-rd-1 mb-2.5">
        <uv-swipe-action>
          <uv-swipe-action-item
            :options="options"
            @click="({ index }) => handlClick(index + 2, item, i)"
          >
            <view
              class="flex mb-2.5 pb-2.5 title-info position-relative"
              @click="handlClick(4, item)"
            >
              <uv-image
                src="../../static/dolphinWatch/dolphin.png"
                width="64px"
                height="64px"
                class="mr-2"
              ></uv-image>
              <view class="py-1.5">
                <view class="mb-2.5 color-#86909C font-size-3.5 line-height-5">
                  观测人员:{{ item.username }}
                </view>
                <view class="color-#86909C font-size-3.5 line-height-5">
                  所属船舶:{{ item.shipId_dictText || item.shipName }}
                </view>
              </view>
              <uv-tags
                class="position-absolute top-0 right-0"
                text="未提交"
                plain
                v-if="item.temporary"
                size="mini"
                type="warning"
              ></uv-tags>
            </view>
            <view
              class="flex mt-2.5 flex-justify-between line-height-5 font-size-3.5 color-#86909C"
            >
              <view class="">
                观测日期
                <text class="color-#3254FF font-500">{{ item.watchDate }}</text>
              </view>
              <view>
                记录数量
                <text class="color-#3254FF font-500">{{ item.details.length }}条</text>
              </view>
            </view>
          </uv-swipe-action-item>
        </uv-swipe-action>
      </view>
      <uv-load-more :status="status" />
    </view>
    <view style="z-index: 100" class="h-16 bg-#fff py-3 px-14 position-fixed bottom-0 w-100%">
      <uv-button
        type="primary"
        color="#3254FF"
        @click="handlClick(1, {})"
        text="新增记录"
      ></uv-button>
    </view>
  </view>
  <uv-calendars ref="calendars" @confirm="confirm" />
</template>

<script setup>
import { list, del } from '@/service/dolphinWatch/index'
import { onLoad } from '@dcloudio/uni-app'
import { useDataBaseStore } from '@/store/database'
import { useToast, useDialog } from '@/utils/modals/index'
import dayjs from 'dayjs'
const pageNo = ref(1)
const pageSize = ref(10)
const total = ref(0)
const pages = ref(0)
const listData = ref([])
const status = ref('loadmore')
const options = ref([
  {
    text: '编辑',
    style: {
      backgroundColor: '#3254FF',
    },
  },
  {
    text: '删除',
    style: {
      backgroundColor: '#f56c6c',
    },
  },
])
onShow(() => {
  pageNo.value = 1
  listData.value = []
  dataBaseStore.get('dolphinWatch').then((res) => {
    temporaryData.value = res
  })
  getList(true)
})
const dataBaseStore = useDataBaseStore()
const temporaryData = ref([])
const getList = (type) => {
  if (type) {
    pageNo.value = 1
    listData.value = []
  }
  list({
    start: date.value,
    end: date.value,
    pageNo: pageNo.value,
    pageSize: pageSize.value,
    myself: true,
  }).then((res) => {
    total.value = res.result.total
    pages.value = Math.ceil(total.value / pageSize.value)
    listData.value = [
      ...temporaryData.value
        .map((x) => {
          x.data.temporary = true
          x.data.timestamp = x.timestamp
          return x.data
        })
        .filter((x) => {
          if (!date.value) return x
          else
            return (
              dayjs(date.value).isBefore(dayjs(x.watchDate)) ||
              dayjs(date.value).isSame(dayjs(x.watchDate))
            )
        }),
      ...listData.value,
      ...res.result.records,
    ]
    status.value = 'loadmore'
  })
}
const reset = () => {
  date.value = ''
  pageNo.value = 1
  pageSize.value = 10
  listData.value = []
  getList(true)
}
onReachBottom(() => {
  if (pageNo.value < pages.value) {
    status.value = 'loading'
    pageNo.value += 1
    getList()
  } else {
    status.value = 'nomore'
  }
})
// 选择日期
const calendars = ref(null)
const date = ref('')
const open = () => {
  calendars.value.open()
}
const confirm = (e) => {
  date.value = e.fulldate
  listData.value = []
  getList(true)
}
// 跳转
/**
 *
 * @param type 1新增 2修改 3删除 4查看
 * @param item
 * @param index
 */
const handlClick = (type, item, index) => {
  console.log('item', item)
  if (type === 3) {
    useDialog('确定删除数据?', {
      showCancelButton: true,
    }).then((res) => {
      if (item.temporary) {
        dataBaseStore.del('dolphinWatch', item.timestamp)
        useToast('删除成功')
        listData.value.splice(index, 1)
      } else {
        del({ id: item.id }).then((res) => {
          useToast(res.result)
          getList(true)
        })
      }
    })
  } else {
    routerTo(item.temporary ? 5 : type, item.id, item.timestamp)
  }
}
/**
 *
 * @param type 1新增 2编辑 4查看
 * @param id 数据id
 * @param timestamp 处理暂存数据的时间戳
 */
const routerTo = (type, id, timestamp) => {
  if (type === 1) {
    // 新增 判断当天是否已经添加过数据 有数据进行编辑
    const nowDate = dayjs(new Date()).format('YYYY-MM-DD')
    const data = listData.value.find((x) => x.watchDate === nowDate)
    if (data) {
      if (data.temporary) {
        uni.navigateTo({
          url: `/pages/dolphinWatch/detail?type=7&timestamp=${data.timestamp}`,
        })
      } else {
        uni.navigateTo({
          url: `/pages/dolphinWatch/detail?type=6&id=${data.id}`,
        })
      }
    } else {
      uni.navigateTo({
        url: `/pages/dolphinWatch/detail?type=1`,
      })
    }
  } else if (type === 5) {
    // 处理暂存数据
    uni.navigateTo({
      url: `/pages/dolphinWatch/detail?type=${type}&timestamp=${timestamp}`,
    })
  } else {
    // 编辑 查看
    uni.navigateTo({
      url: `/pages/dolphinWatch/detail?type=${type}${id ? `&id=${id}` : ''}`,
    })
  }
}
</script>
<style scoped lang="scss">
.box {
  // height: calc(100% - 48px);
  .title-info {
    border-bottom: 1px solid #e5e6eb;
  }
  .uv-swipe-action {
    // background-color: #f5f5f5;
    height: 100%;
  }
  .uv-swipe-action-item {
    height: 100%;
    :deep(.uv-swipe-action-item__content) {
      height: 100%;
      padding: 12px 8px 0 8px;
    }
  }
  .swipe-action {
    border: none;
  }
}
</style>
