<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { checkAndRedirect } from '@/interceptors/route'

onLaunch(() => {
  console.log('App onLaunch')
  checkAndRedirect()
})
onShow(() => {
  console.log('App onShow')
  checkAndRedirect()
})
onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
@import '@/style/index.scss';
@import '@climblee/uv-ui/index.scss';
button::after {
  border: none;
}

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

// 单行省略，优先使用 unocss: text-ellipsis
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 两行省略
.ellipsis-2 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

// 三行省略
.ellipsis-3 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
