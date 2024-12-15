<script setup>
import RoleItem from './components/RoleItem.vue'
import {
  getRoleList,
  getRoleActionList,
  getRoleCode,
  createRole,
  createRoleCode
} from '@/api/role'
import { getActionInfo, getActionList } from '@/api/action'
import { ref, onMounted } from 'vue'
import { useGlobalStore } from '@/stores'
import CodeMirror from './components/codeMirror.vue'

const roleList = ref([])
const actionList = ref([])
onMounted(async () => {
  const res = await getRoleList()
  roleList.value = res.data

  const actionRes = await getActionList()
  actionList.value = actionRes.data
})
const globalStore = useGlobalStore()

const activeRole = ref({
  name: '角色名称',
  actions: [],
  code: ''
})
const drawer = ref(false)
const showRoleInfo = async (role) => {
  const res = await getRoleActionList(role)
  activeRole.value = {
    name: role,
    actions: res.data,
    code: ''
  }
  drawer.value = true
}

const getRoleCodeHandle = async () => {
  const res = await getRoleCode(activeRole.value.name)
  activeRole.value.code = res.data
}
// 转换大驼峰命名法为下划线命名法
const toSnakeCase = (str) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2') // 在小写字母与大写字母之间添加下划线
    .replace(/([A-Z]+)/g, '_$1') // 在大写字母前添加下划线
    .toLowerCase() // 转换为小写
    .replace(/_+/g, '_') // 替换多个下划线为一个下划线
    .replace(/^_/, '') // 去掉开头的下划线
    .replace(/_$/, '') // 去掉结尾的下划线
}
// 模态框内查看action源码
const actionCode = ref('')
const dialogVisible = ref(false)
const showRoleActionCode = async (action) => {
  const actionName = toSnakeCase(action)
  const res = await getActionInfo(actionName, activeRole.value.name, action)
  if (res.status === 404) {
    ElNotification.warning({
      message: res.msg
    })
  } else if (res.status === 200) {
    actionCode.value = res.data
    dialogVisible.value = true
  }
}

// 新建角色
const newDrawer = ref(false)
const createRoleOpen = async () => {
  newDrawer.value = true
}
const activeTab = ref('option')
const form = ref({
  roleName: '',
  profile: '',
  actions: []
})

const newClose = () => {
  form.value = {
    roleName: '',
    profile: '',
    actions: []
  }
  activeTab.value = 'option'
  newDrawer.value = false
  code.value = ''
  codeName.value = ''
}

const code = ref('')
const codeName = ref('')
// 提交
const submitRole = async () => {
  if (activeTab.value === 'option') {
    await createRole(form.value)
  } else {
    await createRoleCode({
      codeName: codeName.value,
      code: code.value
    })
  }

  ElMessage.success('创建成功')
  newClose()
  const res = await getRoleList()
  roleList.value = res.data

  const actionRes = await getActionList()
  actionList.value = actionRes.data
}
</script>

<template>
  <div class="role-container h-full">
    <card-container>
      <div class="rc-canvas flex flex-wrap">
        <role-item
          type="new"
          class="w-16.6%"
          @click="createRoleOpen"
        ></role-item>
        <role-item
          class="w-16.6%"
          v-for="(item, index) in roleList"
          :name="item"
          :key="index"
          @click="showRoleInfo(item)"
        ></role-item>
      </div>
    </card-container>
    <el-drawer v-model="drawer" :with-header="false" size="50%">
      <div class="role-name m-b-20">角色名: {{ activeRole.name }}</div>
      <div class="actions m-b-20">
        <div class="m-b-10">行为列表:</div>
        <div class="tags flex flex-wrap gap-10">
          <template v-if="activeRole.actions.length">
            <el-tag
              v-for="tag in activeRole.actions"
              :key="tag"
              closable
              class="cp"
              @click="showRoleActionCode(tag)"
            >
              {{ tag }}
            </el-tag>
          </template>
          <template v-else>
            <div class="no-data">暂无行为</div>
          </template>
        </div>
      </div>
      <div class="code-container">
        <div class="m-b-10">源码:</div>
        <el-button v-if="!activeRole.code" @click="getRoleCodeHandle"
          >查看代码</el-button
        >
        <VCodeBlock
          v-else
          :browser-window="true"
          :code="activeRole.code"
          highlightjs
          lang="python"
          :theme="globalStore.isDark ? 'github-dark' : 'github'"
        />
      </div>
    </el-drawer>
    <el-drawer
      v-model="newDrawer"
      :with-header="false"
      size="50%"
      @close="newClose"
    >
      <div class="role-name m-b-20">新建角色</div>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="选项" name="option">
          <el-form>
            <el-form-item label="角色名">
              <el-input v-model="form.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="form.profile"></el-input>
            </el-form-item>
            <el-form-item label="角色行为">
              <el-select v-model="form.actions" multiple>
                <el-option
                  v-for="item in actionList"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="代码" name="code">
          <el-form>
            <el-form-item label="角色名"
              ><el-input v-model="codeName"></el-input
            ></el-form-item>
          </el-form>
          <codeMirror v-model="code" />
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <div class="footer-btn">
          <el-button @click="newClose">取消</el-button>
          <el-button type="primary" @click="submitRole">确定</el-button>
        </div>
      </template>
    </el-drawer>
    <el-dialog v-model="dialogVisible" :destroy-on-close="true">
      <VCodeBlock
        :browser-window="true"
        :code="actionCode"
        highlightjs
        lang="python"
        :theme="globalStore.isDark ? 'github-dark' : 'github'"
      />
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-card__body) {
  .content {
    scrollbar-width: thin;
    background-size: 20px 20px;
    background-position: left 0px top -40px;
    background-image: radial-gradient(
      circle at 10px 10px,
      #d9dee8 1px,
      transparent 0
    );
  }
}
:deep(code) {
  scrollbar-width: thin;
}
:deep(.el-overlay-dialog) {
  scrollbar-width: none;
}
:deep(.el-dialog) {
  --el-dialog-margin-top: 10vh;
  padding: 10px !important;
  // background-color: transparent !important;
}
:deep(.el-dialog__header) {
  padding: 0 !important;
}
</style>
