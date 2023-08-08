<template>
  <div class="top-bar">
    <el-row :gutter="12">
      <el-col v-for="(info, index) in infoList" :key="index" :span="8">
        <el-card class="info-card" shadow="hover">
          <div class="content">
            <div class="title">{{ info.title }}</div>
            <div class="value">{{ info.value }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { getCollectedInfoSummaryDataApi } from "@/api/dashboard"
import { type getCollectedInfoSummaryData } from "@/api/dashboard/types/dashboard"

const infoList = ref([] as { title: string; value: string | number }[])

onMounted(async () => {
  //#region 查询dashboard顶部数据
  const response: getCollectedInfoSummaryData = await getCollectedInfoSummaryDataApi()
  const data = response.data
  console.log(data)
  infoList.value = [
    {
      title: "总信息量",
      value: data.totalInfo.toLocaleString()
    },
    {
      title: "24小时新增信息量",
      value: data.dailyNewInfo.toLocaleString()
    },
    {
      title: "24小时信息数量最多tag",
      value: data.tags.join(", ")
    }
  ]
})
//#endregion
</script>

<style scoped>
.top-bar {
  padding: 20px;
}

.info-card {
  height: 100px; /* 调整合适的高度 */
  border-radius: 4px; /* 圆角设置 */
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: box-shadow 0.3s ease; /* 添加过渡效果 */
}

.content {
  text-align: center;
}

.title {
  color: var(--el-text-color-regular);
  font-size: 20px;
  font-weight: bold; /* 加粗字体 */
  margin-bottom: 10px;
}

.value {
  color: var(--el-text-color-primary);
  font-size: 25px; /* 调大字体大小 */
}
</style>
