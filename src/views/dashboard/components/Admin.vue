<template>
  <div class="top-bar">
    <el-row :gutter="12">
      <el-col v-for="(info, index) in InfoList" :key="index" :span="8">
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
      <el-text v-for="(item, index) in HandledContent" :key="index" class="high_weight_info_text"
        >{{ item }}<br
      /></el-text>
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
      <el-pagination
        small
        layout="prev, pager, next"
        :page-size="1"
        v-model:current-page="DailyHighWeightInfoPagination.CurrentPage"
        v-model:total="DailyHighWeightInfoPagination.total"
        @current-change="currentPageChange"
      />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue"
import * as DashboardAPI from "@/api/dashboard"
import type * as DashboardType from "@/api/dashboard/types/dashboard"

const InfoList = ref([] as { title: string; value: string | number }[])

//#region 24小时高权重信息分页
const HighWeightInfo = ref({} as DashboardType.getDailyHighWeightInfoData)
const HandledContent = ref([] as string[])
const HighWeightInfoResponse = ref({} as DashboardType.getDailyHighWeightInfoResponseData)
const HighWeightInfoData = ref([] as DashboardType.getDailyHighWeightInfoData[])

const DailyHighWeightInfoPagination = reactive({
  total: 0,
  CurrentPage: 1
})

const currentPageChange = (PageNumber: number) => {
  HighWeightInfo.value.tags = HighWeightInfoResponse.value.data.list[PageNumber - 1].tags
  HighWeightInfo.value.source = HighWeightInfoResponse.value.data.list[PageNumber - 1].source
  HighWeightInfo.value.meta = HighWeightInfoResponse.value.data.list[PageNumber - 1].meta

  HighWeightInfo.value.content = HighWeightInfoResponse.value.data.list[PageNumber - 1].content
  HandledContent.value = HighWeightInfo.value.content.split("\n")
}
//#endregion

onMounted(async () => {
  //#region 查询dashboard顶部数据
  const CollectedInfoResponse: DashboardType.getCollectedInfoSummaryResponseData =
    await DashboardAPI.getCollectedInfoSummaryDataApi()
  const CollectedInfodata = CollectedInfoResponse.data
  InfoList.value = [
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
  HighWeightInfoResponse.value = await DashboardAPI.getDailyHighWeightInfoApi()
  HighWeightInfoData.value = HighWeightInfoResponse.value.data.list
  DailyHighWeightInfoPagination.total = HighWeightInfoData.value.length

  // 获取完显示
  HighWeightInfo.value.tags = HighWeightInfoResponse.value.data.list[DailyHighWeightInfoPagination.CurrentPage - 1].tags
  HighWeightInfo.value.source =
    HighWeightInfoResponse.value.data.list[DailyHighWeightInfoPagination.CurrentPage - 1].source
  HighWeightInfo.value.meta = HighWeightInfoResponse.value.data.list[DailyHighWeightInfoPagination.CurrentPage - 1].meta

  HighWeightInfo.value.content =
    HighWeightInfoResponse.value.data.list[DailyHighWeightInfoPagination.CurrentPage - 1].content
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
