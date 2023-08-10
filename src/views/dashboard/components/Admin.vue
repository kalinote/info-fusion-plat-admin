<template>
  <div class="top-bar">
    <el-row :gutter="12">
      <el-col v-for="(info, index) in infoList" :key="index" :span="8">
        <el-card class="info-card element-border" shadow="hover">
          <div class="content">
            <div class="title">{{ info.title }}</div>
            <div class="value">{{ info.value }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
  <div class="high_weight_info">
    <el-card class="high_weight_info_card">
      <div class="high_weight_info_title">24小时高权重信息</div>
      <hr />
      <el-text v-for="item in HandledContent" :key="item" class="high_weight_info_text">{{ item }}<br /></el-text>
      <div class="high_weight_info_tags">
        <el-row>
          <el-col style="margin-top: 5px">
            <el-tag v-for="item in HighWeightInfo.tags" :key="item" class="mx-1">{{ item }}</el-tag>
          </el-col>
          <el-col style="margin-top: 5px">
            <el-tag type="warning" v-for="item in HighWeightInfo.source" :key="item" class="mx-1">{{ item }}</el-tag>
          </el-col>
          <el-col style="margin-top: 5px">
            <el-tag type="danger" v-for="item in HighWeightInfo.meta" :key="item" class="mx-1">{{ item }}</el-tag>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import * as DashboardAPI from "@/api/dashboard"
import type * as DashboardType from "@/api/dashboard/types/dashboard"

const infoList = ref([] as { title: string; value: string | number }[])
const HighWeightInfo = ref({} as DashboardType.getDailyHighWeightInfoData)
const HandledContent = ref([] as string[])

onMounted(async () => {
  //#region 查询dashboard顶部数据
  const CollectedInfoResponse: DashboardType.getCollectedInfoSummaryResponseData =
    await DashboardAPI.getCollectedInfoSummaryDataApi()
  const CollectedInfodata = CollectedInfoResponse.data
  infoList.value = [
    {
      title: "总信息量",
      value: CollectedInfodata.totalInfo.toLocaleString()
    },
    {
      title: "24小时新增信息量",
      value: CollectedInfodata.dailyNewInfo.toLocaleString()
    },
    {
      title: "24小时信息数量最多tag",
      value: CollectedInfodata.tags.join(", ")
    }
  ]
  //#endregion

  //#region 查询24小时高权重信息
  const HighWeightInfoResponse: DashboardType.getDailyHighWeightInfoResponseData =
    await DashboardAPI.getDailyHighWeightInfoApi()
  const HighWeightInfodata = HighWeightInfoResponse.data

  HighWeightInfo.value.tags = HighWeightInfodata.list[0].tags
  HighWeightInfo.value.source = HighWeightInfodata.list[0].source
  HighWeightInfo.value.meta = HighWeightInfodata.list[0].meta

  HighWeightInfo.value.content = HighWeightInfodata.list[0].content
  HandledContent.value = HighWeightInfo.value.content.split("\n")
  //#endregion
})
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

.high_weight_info {
  padding: 20px;
}

.high_weight_info_title {
  color: var(--el-text-color-regular);
  font-size: 25px; /* 调大字体大小 */
  font-weight: bold; /* 加粗字体 */
  margin-top: 20px;
  text-align: center;
}

.high_weight_info_text {
  color: var(--el-text-color-primary);
  font-size: 18px; /* 调大字体大小 */
  /* line-height: 75px; */
  margin: 20px;
  text-align: left;
}

.high_weight_info_tags {
  margin: 20px;
}

.element-border {
  border: 1px;
  border-style: solid;
  border-color: var(--el-border-color);
}
</style>
