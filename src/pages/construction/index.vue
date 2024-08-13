<route lang="json5">
{
  style: {
    navigationBarTitleText: '',
  },
  needLogin: true,
}
</route>

<template>
  <view class="page h-full px-2 bg-#F5F5F5">
    <view class="min-h-full py-2.5 bg-#F5F5F5">
      <uv-collapse accordion class="bg-#F5F5F5" :border="false">
        <template v-for="(value, key, index1) in list" :key="index1">
          <uv-collapse-item :title="key" :clickable="false">
            <view
              class="item"
              v-for="(item, index2) in value"
              :key="index2"
              @click="handleClick(item)"
            >
              <view class="item-header">
                <image class="img" src="../../static/shelterWind/list-icon.png"></image>
                <view class="title">{{ item.name }}</view>
              </view>
              <view class="item-content">
                <view class="content-left">
                  <view class="line"></view>
                </view>
                <view class="content-right">
                  <view class="right-content">
                    <view class="content">
                      <view class="content-desc">
                        <view class="text">已施工</view>
                        <view class="sign">{{ item.percentage }}%</view>
                      </view>
                      <uv-line-progress
                        class="progress"
                        :percentage="item.percentage"
                        activeColor="#3254FF"
                        height="16rpx"
                        :showText="false"
                      ></uv-line-progress>
                    </view>
                    <uv-button class="btn" type="primary" text="查看"></uv-button>
                  </view>
                </view>
              </view>
            </view>
          </uv-collapse-item>
        </template>
      </uv-collapse>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useConstructionStore } from '@/store/construction'

const list = ref([])
const urlType = ref('')
const constructionStore = useConstructionStore()

onLoad((options) => {
  console.log('options', options)
  const { code } = options
  urlType.value = code
  if (urlType.value === 'B06A01A01') {
    uni.setNavigationBarTitle({
      title: '风机施工',
    })
  } else if (urlType.value === 'B06A01A02') {
    uni.setNavigationBarTitle({
      title: '海缆施工',
    })
  }
})

onShow(async () => {
  await fetchData()
})

const fetchData = async () => {
  if (urlType.value === 'B06A01A01') {
    await constructionStore.getWindTurbineData()
  } else if (urlType.value === 'B06A01A02') {
    await constructionStore.getCableData()
  }

  // 使用 Pinia 的持久化缓存数据
  list.value =
    urlType.value === 'B06A01A01' ? constructionStore.windTurbineData : constructionStore.cableData
}

const handleClick = (item: any) => {
  const url =
    urlType.value === 'B06A01A01'
      ? `/pages/construction/list?code=B06A01A01&title=${item.name}&pbsId=${item.id}&processType=${item.processType}`
      : `/pages/construction/list?code=B06A01A02&title=${item.cableType}${item.name}&pbsId=${item.id}&processType=${item.processType}`

  uni.navigateTo({ url })
}
</script>

<style lang="scss" scoped>
.page {
  :deep(.uv-collapse-item) {
    margin-bottom: 10px;
    background: #ffffff;
    border-radius: 4px;
    .uv-cell__title-text {
      font-size: 18px;
      color: #3254ff;
      line-height: 20px;
      font-weight: bold;
    }
  }

  // :deep(.uv-cell-clickable) {
  //   background: #ffffff !important;
  // }
}
.item {
  display: flex;
  flex-direction: column;
}
.item-header {
  display: flex;
  align-items: center;
  .img {
    width: 24rpx;
    height: 24rpx;
    margin-right: 20rpx;
  }
  .title {
    font-size: 32rpx;
    line-height: 44rpx;
    color: #1d2129;
  }
}
.item-content {
  display: flex;
  flex: 1;
  .content-left {
    display: flex;
    justify-content: center;
    width: 24rpx;
    height: 100%;
    margin-right: 20rpx;
    .line {
      width: 4rpx;
      height: 100%;
      background: #e5e6eb;
    }
  }
  .content-right {
    flex: 1;
    margin: 32rpx 0;
    border-bottom: 1rpx solid #e5e6eb;
    .right-content {
      display: flex;
      justify-content: space-between;
      margin-bottom: 32rpx;
    }
    .content {
      flex: 1;
    }
    .content-desc {
      display: flex;
      align-items: center;
      margin-bottom: 10rpx;
      font-size: 28rpx;
      .text {
        margin-right: 14rpx;
        line-height: 44rpx;

        color: #4e5969;
      }
      .sign {
        color: #3254ff;
      }
    }
    .btn {
      width: 112rpx;
      height: 48rpx;
      margin-left: 90rpx;
    }
  }
}
</style>
