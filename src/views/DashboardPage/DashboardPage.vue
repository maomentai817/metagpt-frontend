<script setup>
import ProjectItem from './components/ProjectItem.vue'
import ProjectChat from './components/ProjectChat.vue'
import { ref, onMounted } from 'vue'
import { getProjectList, getProjectFile, getEnvs } from '@/api/project'

const chatShow = ref(false)
const activeItem = ref({})
const checkHandle = (info) => {
  chatShow.value = true
  activeItem.value = { ...info, type: 'old' }
  // 通过 name 匹配 data.value 中的desc
  let index = data.value.findIndex((item) => item.name === info.name)
  activeItem.value = { ...info, type: 'old', desc: data.value[index].desc }
}

// 新建工程
const dialogPro = ref(false)
const project = ref({
  name: '',
  desc: '',
  envName: ''
})
const proRef = ref(null)
const resetForm = () => {
  proRef.value.resetFields()
}
const openDialog = () => {
  dialogPro.value = true
  resetForm()
}

// 表单校验
let projectNameValidator = (rule, value, callback) => {
  var reg = /^(?! +$).+/
  if (!reg.test(value) || value == null) {
    callback(new Error('不能为空或空字符串'))
  } else if (value.trim().length > 100) {
    callback(new Error('长度在 1 到 100 个字符'))
  }
  callback()
}
const rules = {
  name: [{ required: true, validator: projectNameValidator, trigger: 'blur' }],
  desc: [{ required: false, message: '请填写描述信息', trigger: 'blur' }],
  envName: [{ required: true, message: '请选择场景', trigger: 'change' }]
}
const disabled = ref(false) // 提交按钮禁用

const newProject = () => {
  disabled.value = true
  proRef.value.validate(async (valid) => {
    if (valid) {
      ElNotification.success('创建工程成功')
      dialogPro.value = false
      setTimeout(() => {
        activeItem.value = { ...project.value, type: 'new' }
        chatShow.value = true
      }, 300)
    } else {
      ElNotification.error('请检查表单信息')
    }
    disabled.value = false
  })
}

const data = ref([])
const envs = ref([])
onMounted(async () => {
  const res = await getProjectList()
  data.value = res.data
  const resEnv = await getEnvs()
  envs.value = resEnv.data
})

// 各种原因需要刷新 project-list
const reGetProjectList = async () => {
  const res = await getProjectList()
  data.value = res.data
}

// chat 盒子隐藏
const hideChat = () => {
  chatShow.value = false
  reGetProjectList()
}

// 项目生成成功后刷新项目展示信息
const newProjectSuccess = async (name) => {
  reGetProjectList()
  const res = await getProjectFile(name)
  chatShow.value = true
  // 通过 name 匹配 data.value 中的desc
  let index = data.value.findIndex((item) => item.name === name)
  activeItem.value = { ...res.data, type: 'old', desc: data.value[index].desc }
}
</script>

<template>
  <div class="dash-board h-full">
    <card-container class="p-t-15 relative duration-300 overflow-x-hidden">
      <div
        class="pro-container flex flex-wrap"
        :class="chatShow ? 'fade-out' : ''"
      >
        <project-item
          type="new"
          class="w-16.6%"
          @click="openDialog"
        ></project-item>
        <project-item
          v-for="(item, index) in data"
          :key="index"
          :info="item"
          class="w-16.6%"
          @check="checkHandle"
        ></project-item>
      </div>
      <project-chat
        class="absolute top-0 left-0 pc-container"
        :class="chatShow ? 'fade-in' : 'no-show'"
        :item="activeItem"
        @hide="hideChat"
        @end="newProjectSuccess"
      ></project-chat>
    </card-container>
    <!-- 创建工程 -->
    <el-dialog v-model="dialogPro" title="新建工程" align="center">
      <div class="pro-form-content h-300 overflow-auto">
        <el-form
          :model="project"
          label-width="100px"
          ref="proRef"
          :rules="rules"
        >
          <el-form-item label="工程名称" class="m-t-30!" prop="name">
            <el-input
              v-model="project.name"
              autocomplete="off"
              placeholder="请输入工程名称"
            />
          </el-form-item>
          <el-form-item label="场景选择" class="m-t-30!" prop="envName">
            <el-select v-model="project.envName" placeholder="请选择场景">
              <el-option
                v-for="env in envs"
                :key="env"
                :label="env"
                :value="env"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="工程描述" class="m-t-30!" prop="desc">
            <el-input
              v-model="project.desc"
              :autosize="{ minRows: 2, maxRows: 6 }"
              :maxlength="500"
              type="textarea"
              placeholder="描述"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="resetForm">重置</el-button>
          <el-button type="primary" @click="newProject" :disabled="disabled"
            >确认</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.dash-board {
  .pc-container {
    &.no-show {
      transform: translateX(100%);
    }
  }
  .fade-in {
    animation-name: fadeIn;
    animation-duration: 0.5s;
  }
  .fade-out {
    animation-name: fadeOut;
    animation-duration: 0.5s;
  }
}
.hide-animation {
  animation: chatHide 1s forwards !important;
}

:deep(.el-dialog) {
  padding-top: 0;
  padding-left: 0;
  padding-right: 0;
}
:deep(.el-dialog__body) {
  padding: var(--el-dialog-padding-primary);
}
:deep(.el-dialog__footer) {
  padding: var(--el-dialog-padding-primary);
}
:deep(.el-dialog__header) {
  padding: 15px 0 !important;
  background-color: #27ba9b;
  text-align: center;
}
:deep(.el-dialog__title) {
  color: #fff;
}
:deep(.el-dialog__headerbtn) {
  font-size: 21px;
  line-height: 21px;
  i {
    color: #fff !important;
  }
}
:deep(.el-textarea__inner) {
  scrollbar-width: thin;
}
:deep(.el-card) {
  border-bottom-left-radius: 25px !important;
  border-bottom-right-radius: 25px !important;
  overflow-y: auto;
  scrollbar-width: none;
  padding-top: 0;
}
@keyframes chatHide {
  0% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(20%);
  }
  100% {
    transform: translateY(-100%);
  }
}
@keyframes fadeIn {
  0% {
    transform: translateX(100%);
  }
  30% {
    transform: translateX(120%);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes fadeOut {
  0% {
    transform: translateX(0);
  }
  30% {
    transform: translateX(20%);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
