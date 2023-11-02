<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true">
        <el-form-item prop="platform_name" label="平台采集程序名称">
          <el-input placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button :icon="Refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" disabled>新建平台采集程序</el-button>
          <el-button type="danger" :icon="Delete" disabled>批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table>
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="name" label="名称" align="center" />
          <el-table-column prop="project_name" label="项目" align="center" />
          <el-table-column prop="status" label="最后运行状态" align="center" />
          <el-table-column prop="statistical" label="统计数据" align="center" />
          <el-table-column prop="description" label="描述" align="center" />
          <el-table-column prop="target_site" label="目标站点" align="center" />
          <el-table-column prop="tags" label="标签" align="center" />
          <el-table-column prop="operate" label="操作" align="center" />
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { Search, Refresh, Download, RefreshRight, CirclePlus, Delete } from "@element-plus/icons-vue"
</script>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}
</style>
