<script setup>
import { ref, onMounted } from 'vue'
import ModelItem from './components/ModelItem.vue'
import { getEnvs, createEnv, getEnvRole } from '@/api/project'
import { getRoleList } from '@/api/role'

const envList = ref([])
const roleList = ref([])
onMounted(async () => {
  const res = await getEnvs()
  envList.value = res.data
  const resRole = await getRoleList()
  roleList.value = resRole.data
})

const drawer = ref(false)
const showEnvInfo = async (item, type = 'check') => {
  if (type === 'check') {
    // console.log('check')
    const res = await getEnvRole(item)
    form.value.role = res.data
    form.value.name = item
    console.log(item)
    console.log(form.value)
  } else {
    console.log('edit')
  }
  drawer.value = true
}

const form = ref({
  name: '',
  role: []
})

const handleClose = () => {
  drawer.value = false
  form.value = {
    name: '',
    role: []
  }
}

const createModel = async () => {
  await createEnv(form.value)
  ElMessage.success('创建成功')
  handleClose()
  const res = await getEnvs()
  envList.value = res.data
  const resRole = await getRoleList()
  roleList.value = resRole.data
}
</script>

<template>
  <div class="model-container h-full">
    <card-container>
      <div class="mc-canvas flex flex-wrap">
        <model-item
          type="new"
          class="w-16.6%"
          @click="showEnvInfo(item, 'new')"
        ></model-item>
        <model-item
          class="w-16.6%"
          v-for="(item, index) in envList"
          :name="item"
          :key="index"
          @click="showEnvInfo(item)"
        ></model-item>
      </div>
    </card-container>
    <el-drawer
      v-model="drawer"
      :with-header="false"
      size="50%"
      @close="handleClose"
    >
      <el-form>
        <el-form-item label="模板名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色选择">
          <el-select v-model="form.role" multiple>
            <el-option
              v-for="item in roleList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-end">
          <el-button type="primary" @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="createModel">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
.model-container {
  .mc-canvas {
    background-size: 20px 20px;
    background-position: left 0px top -40px;
    background-image: radial-gradient(
      circle at 10px 10px,
      #d9dee8 1px,
      transparent 0
    );
  }
}
:deep(input) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro',
    monospace;
}
</style>
