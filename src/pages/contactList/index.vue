<route lang="json5">
{
  style: {
    navigationBarTitleText: '通讯录',
  },
  needLogin: true,
}
</route>
<template>
  <view class="contact-list">
    <uv-index-list :index-list="indexList" :sticky="true" @select="handleClick">
      <template v-for="key in indexList" :key="key">
        <uv-index-anchor :text="key" class="h-10"></uv-index-anchor>
        <template v-for="(item, index) in contactList[key]" :key="index">
          <view class="contact-item">
            <view class="item-left" @click="handleContactClick(item)">
              <uv-icon class="avatar" name="account-fill" size="38"></uv-icon>
              <view class="info">
                <text class="name">{{ item.name }}</text>
                <text class="phone">{{ item.phone }}</text>
              </view>
            </view>
            <view class="item-right" @click="makeCall(item)">
              <image class="w-8 h-8" src="../../static/images/phone.svg" />
            </view>
          </view>
        </template>
      </template>
    </uv-index-list>
  </view>
</template>

<script lang="ts" setup>
import { getPersons } from '@/service/common/index'
import { useToast } from '@/utils/modals'

interface Person {
  name: string
  avatar: string
  phone: string
  picture: string
}

const contactList = ref({})

const customSort = (arr) => {
  return arr.sort((a, b) => {
    // 如果 a 是 '#', 放在 b 后面
    if (a === '#') return 1
    // 如果 b 是 '#', 放在 a 后面
    if (b === '#') return -1
    // 正常比较
    return a.localeCompare(b)
  })
}

const indexList = computed(() => {
  return customSort(Object.keys(contactList.value))
})

onShow(async () => {
  const { code, message, result } = await getPersons()
  if (code === 200) {
    contactList.value = result || {}
    console.error('Object.keys(contactList.value)===>', Object.keys(contactList.value))
  } else {
    useToast(message)
  }
})

const handleClick = (index: number) => {
  const anchor = document.querySelectorAll('.uv-index-anchor')[index]
  if (anchor) {
    anchor.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const handleContactClick = (item: Person) => {
  uni.navigateTo({
    url: `/pages/contactList/detail?item=${encodeURIComponent(JSON.stringify(item))}`,
  })
}

const makeCall = (item: Person) => {
  const phoneNumber = item.phone // 假设联系人名字就是电话号码
  uni.makePhoneCall({
    phoneNumber,
    success: () => {
      console.log('拨打电话成功')
    },
    fail: (err) => {
      console.error('拨打电话失败', err)
    },
  })
}
</script>

<style lang="scss" scoped>
.contact-list {
  height: 100%;
  padding: 0px 4px 10px 4px;
  overflow: hidden;
  position: relative;
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 6px 32px 6px 12px;
  border-bottom: 1px solid #d6d7d9;
  .item-left {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin-right: 20rpx;
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .name {
    font-size: 28rpx;
  }
  .phone {
    font-size: 24rpx;
  }
  .item-right {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80rpx;
    height: 80rpx;
  }
}
</style>
