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
    <div class="agent-branch-box">
      <AgentWorkflow />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import AgentWorkflow from "./components/AgentWorkflow.vue"

const InfoList = ref([] as { title: string; value: string | number; tips: string }[])

onMounted(async () => {
  InfoList.value = [
    {
      title: "使用Token总量",
      value: 1,
      tips: ""
    },
    {
      title: "正在运行的Agent数量",
      value: 1,
      tips: ""
    },
    {
      title: "Agent总调用次数",
      value: 1,
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

.agent-branch-box {
  width: 100%;
  height: 1000px;
}
</style>
