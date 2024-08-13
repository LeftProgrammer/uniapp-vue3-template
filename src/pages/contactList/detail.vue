<route lang="json5">
{
  style: {
    navigationBarTitleText: '人员信息',
  },
  needLogin: true,
}
</route>
<template>
  <view class="px-2">
    <uv-cell-group>
      <uv-cell title="姓名" :value="person.name"></uv-cell>
      <uv-cell title="性别" :value="person.sexText"></uv-cell>
      <uv-cell title="手机号码" :value="person.phone"></uv-cell>
      <uv-cell title="人员类型" :value="person.personType"></uv-cell>
      <uv-cell title="所属单位" :value="person.department"></uv-cell>
      <uv-cell title="单位类型" :value="person.departmentType"></uv-cell>
      <uv-cell title="岗位" :value="person.job"></uv-cell>
      <uv-cell title="进场时间" :value="person.enterDate"></uv-cell>
      <uv-cell title="退场时间" :value="person.leaveDate"></uv-cell>
      <!-- <uv-cell title="照片">
        <template v-slot:right-icon>
          <uv-icon size="30" name="account"></uv-icon>
        </template>
      </uv-cell> -->
    </uv-cell-group>
  </view>
</template>

<script lang="ts" setup>
const sexMap: { [key: string]: string } = {
  '1': '男',
  '2': '女',
}

const person = ref({})
onLoad((options) => {
  person.value = JSON.parse(decodeURIComponent(options.item))
  person.value.sexText = person.value.sex ? sexMap[person.value.sex] : ''
  console.log('person', person)
})
</script>
