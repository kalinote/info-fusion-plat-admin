<template>
  <div class="app-container">
    <div class="top-bar">
      <el-card class="info-card">
        <el-row>
          <el-col class="content" :span="6" v-for="(info, index) in InfoList" :key="index">
            <div class="title">{{ info.title }}</div>
            <div class="value">{{ info.value }}</div>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <el-row class="workflow-box">
      <el-col :span="18">
        <div class="agent-branch-box">
          <AgentWorkflow />
        </div>
      </el-col>
      <el-col :span="6">
        <el-card class="agent-history-list">
          <el-container>
            <el-header class="agent-history-header">Agent 历史记录</el-header>
            <el-divider />
            <el-main>
              <el-timeline v-infinite-scroll="loadHistory">
                <el-timeline-item
                  v-for="(item, index) in timelineItems"
                  :key="index"
                  :timestamp="item.timestamp"
                  placement="top"
                >
                  <el-card>
                    <h4>{{ item.title }}</h4>
                    <p>{{ item.description }}</p>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </el-main>
          </el-container>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import AgentWorkflow from "./components/AgentWorkflow.vue"

const InfoList = ref([] as { title: string; value: string | number; tips: string }[])
const timelineItems = ref([] as { timestamp: string; title: string; description: string }[])

const loadHistory = () => {
  // console.log("test")
}

onMounted(async () => {
  InfoList.value = [
    {
      title: "Token使用总量",
      value: "15,468",
      tips: ""
    },
    {
      title: "当前存在的Agent",
      value: 5,
      tips: ""
    },
    {
      title: "Agent创建总量",
      value: 5,
      tips: ""
    },
    {
      title: "当前代理IP地址",
      value: "139.59.162.0",
      tips: ""
    }
  ]

  timelineItems.value = [
    {
      timestamp: "2023/9/7 20:21:21",
      title: "Global Main Agent 创建完成",
      description: "由 生命周期管理器 操作"
    },
    {
      timestamp: "2023/9/7 22:13:15",
      title: "Worker Agent A 创建完成",
      description: "由 数据收集调度 操作"
    },
    {
      timestamp: "2023/9/7 22:13:18",
      title: "Worker Agent B 创建完成",
      description: "由 信息分析 操作"
    },
    {
      timestamp: "2023/9/7 23:08:28",
      title: "Worker Agent A 开始思考",
      description: "由 Worker Agent A 操作"
    },
    {
      timestamp: "2023/9/7 23:08:28",
      title: "Worker subAgent A 创建完成",
      description: "由 Worker Agent B 操作"
    }
  ]
})
</script>

<style lang="scss" scoped>
//#region 顶部信息显示
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
//#endregion

.workflow-box {
  margin-top: 20px;
  width: 100%;
  height: 1000px;
}

.agent-branch-box {
  width: 100%;
  height: 100%;
}

.agent-history-list {
  height: 100%;
}

.agent-history-header {
  font-size: 30px;
  text-align: center;
}
</style>
