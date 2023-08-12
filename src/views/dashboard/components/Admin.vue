<template>
  <div>
    <div class="top-bar">
      <el-row :gutter="12">
        <el-col v-for="(info, index) in InfoList" :key="index" :span="8">
          <el-card class="info-card element-border" shadow="hover">
            <el-tooltip class="box-item" effect="dark" :content="info.tips" placement="bottom">
              <div class="content">
                <div class="title">{{ info.title }}</div>
                <div class="value">{{ info.value }}</div>
              </div>
            </el-tooltip>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="high_weight_info">
      <el-card class="high_weight_info_card">
        <el-tooltip class="box-item" effect="dark" content="权重值计算方法：" placement="top">
          <div class="high_weight_info_title">24小时高权重信息</div>
        </el-tooltip>
        <el-divider />
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
    <div style="margin: 20px">
      <h3 style="margin-left: 20px">采集节点信息</h3>
      <el-row :gutter="40" style="margin-bottom: 20px" v-for="(col, index) in nodeList" :key="index">
        <el-col :span="6" v-for="(node, index) in col" :key="index">
          <el-card class="node-info-card" :body-style="{ background: '#7ABBFF' }">
            <div class="node-info-content">
              <el-container>
                <el-aside width="50px"
                  ><svg-icon name="node" font-size="50px" class="icon" style="margin-top: 5px"
                /></el-aside>
                <el-container>
                  <el-header height="10px">{{ node["title"] }}</el-header>
                  <el-main>{{ node["value"] }}</el-main>
                </el-container>
              </el-container>
            </div></el-card
          >
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

const nodeList = [
  [
    {
      title: "在线节点",
      value: 1
    },
    {
      title: "项目",
      value: 2
    },
    {
      title: "爬虫",
      value: 0
    },
    {
      title: "定时任务",
      value: 0
    }
  ],
  [
    {
      title: "任务总数",
      value: 0
    },
    {
      title: "错误任务",
      value: 0,
      color: "Red",
      icon: "task"
    },
    {
      title: "结果总数",
      value: 3245235
    },
    {
      title: "用户",
      value: 0
    }
  ]
]

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

.node-info-card {
  border-radius: 10px;
}

.node-info-content {
  width: 100%; /* 使用百分比设置按钮宽度 */
  height: 60px; /* 设置按钮高度为固定值或百分比值 */
  font-size: 25px;
  color: #ffffff;
}
</style>
