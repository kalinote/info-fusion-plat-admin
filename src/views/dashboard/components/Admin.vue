<template>
  <div class="app-container">
    <div class="top-bar">
      <el-card class="info-card">
        <el-row>
          <el-col class="content" :span="8" v-for="(info, index) in InfoList" :key="index">
            <div class="title">{{ info.title }}</div>
            <div class="value">{{ info.value }}</div>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="new_info">
      <el-card class="new_info_card">
        <el-tooltip class="box-item" effect="dark" content="权重值计算方法：" placement="top">
          <div class="new_info_title">最新信息</div>
        </el-tooltip>
        <el-divider />
        <div class="new_info_text" v-html="NewInfo.content" />
        <div class="new_info_tags">
          <el-row>
            <el-col style="margin-top: 5px">
              <el-tag v-for="item in NewInfo.tags" :key="item" class="mx-1">{{ item }}</el-tag>
            </el-col>
            <el-col style="margin-top: 5px">
              <el-tag type="warning" v-for="item in NewInfo.source" :key="item" class="mx-1">{{ item }}</el-tag>
            </el-col>
            <el-col style="margin-top: 5px">
              <el-tag type="danger" v-for="item in NewInfo.meta" :key="item" class="mx-1">{{ item }}</el-tag>
            </el-col>
          </el-row>
        </div>
        <el-pagination
          small
          layout="prev, pager, next"
          :page-size="1"
          v-model:current-page="DailyNewInfoPagination.CurrentPage"
          v-model:total="DailyNewInfoPagination.total"
          @current-change="currentPageChange"
        />
      </el-card>
    </div>
    <div style="margin-top: 20px">
      <h3 style="margin-left: 20px">信息收集节点</h3>
      <el-row :gutter="20" style="margin-bottom: 20px" v-for="(col, index) in nodeList" :key="index">
        <el-col :span="6" v-for="(node, index) in col" :key="index">
          <el-card class="node-info-card" :body-style="node['color']">
            <div class="node-info-content">
              <el-container style="margin-top: -5px">
                <el-aside width="40px"
                  ><svg-icon :name="node['icon']" font-size="40px" class="icon" style="margin-top: 5px"
                /></el-aside>
                <el-container>
                  <el-header height="10px">{{ node["title"] }}</el-header>
                  <el-main>{{ node["value"].toLocaleString() }}</el-main>
                </el-container>
              </el-container>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue"
import * as DashboardAPI from "@/api/dashboard"
import type * as DashboardType from "@/api/dashboard/types/dashboard"

const InfoList = ref([] as { title: string; value: string | number; tips: string }[])

//#region 采集节点信息
const nodeList = ref([] as DashboardType.getNodeInfoData[][])
//#endregion

//#region 24小时高权重信息分页
const NewInfo = ref({} as DashboardType.getDailyNewInfoData)
const NewInfoResponse = ref({} as DashboardType.getDailyNewInfoResponseData)
const NewInfoData = ref([] as DashboardType.getDailyNewInfoData[])

const DailyNewInfoPagination = reactive({
  total: 0,
  CurrentPage: 1
})

const currentPageChange = (PageNumber: number) => {
  NewInfo.value.tags = NewInfoResponse.value.data.list[PageNumber - 1].tags
  NewInfo.value.source = NewInfoResponse.value.data.list[PageNumber - 1].source
  NewInfo.value.meta = NewInfoResponse.value.data.list[PageNumber - 1].meta

  NewInfo.value.content = NewInfoResponse.value.data.list[PageNumber - 1].content
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
      value: CollectedInfodata.totalInfo.toLocaleString(),
      tips: "这里并非采集的信息量,而是处理过后的有效信息量,所以这里的数值与采集节点的信息量不一定相同。"
    },
    {
      title: "24小时新增信息量",
      value: CollectedInfodata.dailyNewInfo.toLocaleString(),
      tips: "这里并非采集的信息量,而是处理过后的有效信息量,所以这里的数值与采集节点的信息量不一定相同。"
    },
    {
      title: "24小时信息数量最多tag",
      value: CollectedInfodata.tags.join(", "),
      tips: "这里并非采集的信息量,而是处理过后的有效信息量,所以这里的数值与采集节点的信息量不一定相同。这里的tags是根据近24小时处理后的信息的tags出现次数来计算的。"
    }
  ]
  //#endregion

  //#region 查询24小时高权重信息
  NewInfoResponse.value = await DashboardAPI.getDailyNewInfoApi()
  NewInfoData.value = NewInfoResponse.value.data.list
  DailyNewInfoPagination.total = NewInfoData.value.length

  // 获取完显示
  NewInfo.value.tags = NewInfoResponse.value.data.list[DailyNewInfoPagination.CurrentPage - 1].tags
  NewInfo.value.source = NewInfoResponse.value.data.list[DailyNewInfoPagination.CurrentPage - 1].source
  NewInfo.value.meta = NewInfoResponse.value.data.list[DailyNewInfoPagination.CurrentPage - 1].meta

  NewInfo.value.content = NewInfoResponse.value.data.list[DailyNewInfoPagination.CurrentPage - 1].content
  //#endregion

  //#region 查询采集节点信息
  const NodeInfoResponse: DashboardType.getNodeInfoResponseData = await DashboardAPI.getNodeInfoApi()
  nodeList.value = NodeInfoResponse.data.list
  //#endregion
})
</script>

<style scoped>
.info-card {
  height: 100px; /* 调整合适的高度 */
  border-radius: 4px; /* 圆角设置 */
  align-items: center;
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

.new_info {
  padding-top: 20px;
}

.new_info_title {
  color: var(--el-text-color-regular);
  font-size: 25px; /* 调大字体大小 */
  font-weight: bold; /* 加粗字体 */
  margin-top: 20px;
  text-align: center;
}

.new_info_text {
  color: var(--el-text-color-primary);
  font-size: 18px; /* 调大字体大小 */
  margin: 20px;
  text-align: left;
}

.new_info_tags {
  margin: 20px;
}

.element-border {
  border: 1px;
  border-style: solid;
  border-color: var(--el-border-color);
}

.node-info-card {
  border-radius: 10px;
  height: 85px;
}

.node-info-content {
  width: 100%; /* 使用百分比设置按钮宽度 */
  height: 60px; /* 设置按钮高度为固定值或百分比值 */
  font-size: 25px;
  color: #ffffff;
}
</style>
