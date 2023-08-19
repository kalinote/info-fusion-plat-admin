<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true">
        <el-form-item prop="environment_variable_name" label="环境变量名">
          <el-input placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="platform_name" label="平台名称">
          <el-input placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="console.log('点击查询')">查询</el-button>
          <el-button :icon="Refresh" @click="console.log('点击重置')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增环境变量</el-button>
          <el-button type="danger" :icon="Delete">批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="console.log('点击刷新')" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="env_var_name" label="环境变量名" align="center" />
          <el-table-column prop="value" label="值" align="center" />
          <el-table-column prop="platform" label="平台" align="center" />
          <el-table-column prop="description" label="描述" align="center" />
          <el-table-column prop="is_using" label="使用状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.is_using" type="success" effect="plain">启用</el-tag>
              <el-tag v-else type="danger" effect="plain">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" />
          <el-table-column prop="updataTime" label="更新时间" align="center" />
          <el-table-column prop="status" label="Token状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.status" type="success" effect="plain">正常</el-tag>
              <el-tag v-else type="danger" effect="plain">失效</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="deploy-wrapper">
        <el-button type="primary" :icon="Check" @click="console.log('点击部署')">RssHub部署</el-button>
      </div>
    </el-card>
    <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === undefined ? '新增用户' : '修改用户'"
      @close="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="env_var_name" label="用户名">
          <el-input v-model="formData.env_var_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="value" label="值" v-if="currentUpdateId === undefined">
          <el-input v-model="formData.value" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="platform" label="平台" v-if="currentUpdateId === undefined">
          <el-input v-model="formData.platform" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="description" label="描述" v-if="currentUpdateId === undefined">
          <el-input v-model="formData.description" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import dayjs from "dayjs"
import { Search, Refresh, Download, RefreshRight, CirclePlus, Delete, Check } from "@element-plus/icons-vue"
import { type FormInstance, type FormRules, ElMessage } from "element-plus"
import { reactive, ref } from "vue"
import { createPlatformTokenDataApi } from "@/api/token-management"

interface TableItem {
  env_var_name: string
  value: string
  platform: string
  description: string
  is_using: boolean
  createTime: string
  updataTime: string
  status: boolean
}

const tableData: TableItem[] = []

const formatTime = (timestamp: number) => {
  return dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss")
}

//#region 新增token
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  env_var_name: "",
  value: "",
  platform: "",
  description: "",
  is_using: false,
  create_time: Date.now(),
  update_time: Date.now(),
  status: true
})

const formRules: FormRules = reactive({
  env_var_name: [{ required: true, trigger: "blur", message: "请输入环境变量名" }],
  value: [{ required: true, trigger: "blur", message: "请输入值" }],
  platform: [{ required: true, trigger: "blur", message: "请输入平台" }]
})

const handleCreate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        createPlatformTokenDataApi(formData)
          .then(() => {
            ElMessage.success("新增成功")
            // getTableData()
          })
          .finally(() => {
            dialogVisible.value = false
          })
      } else {
        // 进行修改操作
      }
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}

const resetForm = () => {
  currentUpdateId.value = undefined
  formData.env_var_name = ""
  formData.value = ""
  formData.platform = ""
}
//#endregion

//#region 修改token
const currentUpdateId = ref<undefined | string>(undefined)
//#endregion

//#region 行操作
/** 修改数据 */
function handleUpdate(row: TableItem): void {
  console.log(row)
}

/** 删除数据 */
function handleDelete(row: TableItem): void {
  console.log(row)
}
//#endregion

// 生成随机字符串
function getRandomString(length: number): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

// 随机生成一个布尔值
function getRandomBoolean(): boolean {
  return Math.random() < 0.5
}

// 随机生成日期
function getRandomDate(): string {
  const start = new Date(2020, 0, 1)
  const end = new Date()
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleString()
}

// 生成随机数据
for (let i = 0; i < 10; i++) {
  tableData.push({
    env_var_name: getRandomString(8),
    value: getRandomString(6),
    platform: getRandomString(10),
    description: `${getRandomString(8)}@example.com`,
    is_using: getRandomBoolean(),
    createTime: getRandomDate(),
    updataTime: formatTime(Date.now()),
    status: getRandomBoolean()
  })
}
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

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}

.deploy-wrapper {
  display: flex;
  justify-content: flex-end;
}

.right-align {
  margin-left: auto;
}
</style>
