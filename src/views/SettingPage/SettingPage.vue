<script setup>
import { ref } from 'vue'
import { useGlobalStore } from '@/stores'

const options = [
  {
    value: 'openai',
    label: 'OpenAI',
    children: [
      {
        value: 'gpt-3.5-turbo',
        label: 'GPT-3.5-Turbo'
      },
      {
        value: 'gpt-3.5-turbo-0125',
        label: 'GPT-3.5-Turbo-0125'
      },
      {
        value: 'gpt-3.5-turbo-1106',
        label: 'GPT-3.5-Turbo-1106'
      },
      {
        value: 'gpt-3.5-turbo-0613',
        label: 'GPT-3.5-Turbo-0613'
      },
      {
        value: 'gpt-4-1106-preview',
        label: 'GPT-4-1106-Preview'
      },
      {
        value: 'gpt-4-0125-preview',
        label: 'GPT-4-0125-Preview'
      },
      {
        value: 'gpt-4o',
        label: 'GPT-4o'
      },
      {
        value: 'gpt-4o-mini',
        label: 'GPT-4o-Mini'
      },
      {
        value: 'gpt-4-turbo',
        label: 'GPT-4-Turbo'
      },
      {
        value: 'gpt-4',
        label: 'GPT-4'
      }
    ]
  },
  {
    value: 'zhipuai',
    label: '智谱',
    children: [
      {
        value: 'glm-4-plus',
        label: 'GLM-4-Plus'
      },
      {
        value: 'glm-4-flash',
        label: 'GLM-4-Flash'
      },
      {
        value: 'glm-4-flashx',
        label: 'GLM-4-FlashX'
      },
      {
        value: 'glm-4-0520',
        label: 'GLM-4-0520'
      },
      {
        value: 'glm-4-airx',
        label: 'GLM-4-AirX'
      },
      {
        value: 'glm-4-air',
        label: 'GLM-4-Air'
      },
      {
        value: 'glm-4-9b',
        label: 'GLM-4-9B'
      },
      {
        value: 'codegeex-4',
        label: 'CodeGeeX-4'
      }
    ]
  }
]

const defaultForm = {
  model: '',
  apikey: '',
  baseurl: '',
  nround: 5,
  codeReview: true,
  codeTest: false
}
const form = ref({
  ...defaultForm
})

const globalStore = useGlobalStore()

// 连通测试
const connect = ref(false)
const connectTest = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      // TODO: 连通测试
      connect.value = true
      if (connect.value) {
        ElNotification.success('连通测试通过, 当前服务可使用')
      } else {
        ElNotification.error('连通测试失败, 请检查配置信息')
      }
    } else {
      ElNotification.error('请检查配置信息')
      connect.value = false
      return false
    }
  })
}
// 保存配置
const saveConfig = () => {
  if (connect.value) {
    formRef.value.validate(async (valid) => {
      if (valid) {
        ElNotification.success('配置保存成功')
      } else {
        ElNotification.error('请检查配置信息')
        return false
      }
    })
  } else {
    ElNotification.error('请先连通测试')
  }
}

// 表单校验
const formRef = ref(null)
const rules = {
  model: [{ required: true, message: '请选择模型', trigger: 'blur' }],
  apikey: [{ required: true, message: '请输入APIKEY', trigger: 'blur' }],
  baseurl: [{ required: true, message: '请输入API接口地址', trigger: 'blur' }]
}
</script>

<template>
  <div class="setting-container h-full">
    <card-container>
      <el-form
        :model="form"
        label-width="auto"
        :rules="rules"
        ref="formRef"
        class="m-x-auto m-t-4%"
      >
        <el-form-item label="模型" prop="model" label-position="top">
          <el-cascader
            v-model="form.model"
            :options="options"
            :props="{ expandTrigger: 'hover' }"
            class="w-20vw!"
          />
        </el-form-item>
        <el-form-item label="APIKEY" prop="apikey" label-position="top">
          <el-input
            v-model="form.apikey"
            type="password"
            placeholder="APIKEY"
            show-password
            class="w-40vw!"
          />
        </el-form-item>
        <el-form-item
          label="自定义API接口地址"
          prop="baseurl"
          label-position="top"
        >
          <el-input
            v-model="form.baseurl"
            placeholder="apiurl"
            class="w-40vw!"
          />
        </el-form-item>
        <el-form-item label="对话轮次" prop="nround" label-position="right">
          <el-input-number v-model="form.nround" :min="1" :max="20" />
        </el-form-item>
        <el-form-item label="代码审查" prop="codeReview" label-position="right">
          <el-switch v-model="form.codeReview" />
        </el-form-item>
        <el-form-item label="代码测试" prop="codeTest" label-position="right">
          <el-switch v-model="form.codeTest" />
        </el-form-item>
        <el-button class="subBtn" type="primary" @click="connectTest"
          >连通测试</el-button
        >
        <el-button class="subBtn" type="primary" @click="saveConfig"
          >保存配置</el-button
        >
      </el-form>
    </card-container>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-switch.is-checked .el-switch__core) {
  --el-switch-on-color: v-bind("globalStore.isDark ? '#409eff' : '#27ba9b'");
  --el-switch-border-color: #fff;
}
</style>
