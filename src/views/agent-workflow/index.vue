<template>
  <div class="app-container">
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
              <!-- 这里的无限滚动不知道有没有使用正确 -->
              <el-timeline v-infinite-scroll="loadHistory">
                <el-timeline-item timestamp="2023/9/7 20:21:21" placement="top">
                  <el-card>
                    <h4>Global Main Agent 创建完成</h4>
                    <p>由 生命周期管理器 操作</p>
                  </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2023/9/7 22:13:15" placement="top">
                  <el-card>
                    <h4>Worker Agent A 创建完成</h4>
                    <p>由 数据收集调度 操作</p>
                  </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2023/9/7 22:13:18" placement="top">
                  <el-card>
                    <h4>Worker Agent B 创建完成</h4>
                    <p>由 信息分析 操作</p>
                  </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2023/9/7 23:08:28" placement="top">
                  <el-card>
                    <h4>Worker Agent A 开始思考</h4>
                    <p>由 Worker Agent A 操作</p>
                  </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2023/9/7 23:08:28" placement="top">
                  <el-card>
                    <h4>Worker subAgent A 创建完成</h4>
                    <p>由 Worker Agent B 操作</p>
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

const loadHistory = () => {
  console.log("test")
}

onMounted(async () => {
  InfoList.value = [
    {
      title: "使用Token总量",
      value: "15,468",
      tips: ""
    },
    {
      title: "正在运行的Agent数量",
      value: 3,
      tips: ""
    },
    {
      title: "Agent总调用次数",
      value: 4,
      tips: ""
    }
  ]
})
</script>

<style lang="scss" scoped>
//#region 顶部信息显示
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
