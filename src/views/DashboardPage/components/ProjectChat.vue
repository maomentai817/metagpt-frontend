<script setup>
import { ref, nextTick, watch } from 'vue'
import { Position, Delete } from '@element-plus/icons-vue'
import ava from '@/assets/mnkq.png'
import { useGlobalStore } from '@/stores'
import FileItem from './FileItem.vue'
import MarkdownIt from 'markdown-it'

const md = MarkdownIt()
const globalStore = useGlobalStore()
const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['hide'])
const hideItem = () => {
  const chatBox = document.querySelector('.pro-chat-container')
  chatBox.classList.add('hide-animation')
  setTimeout(() => {
    chatBox.classList.remove('hide-animation')
    chatBox.classList.remove('fade-in')
    emit('hide')
    // 清空对话
    messages.value = []
  }, 1000)
}

// 人类介入
const userInput = ref('')
const isLoading = ref(false)
const clearMessage = () => {
  userInput.value = ''
}
// 对话信息
const messages = ref([])
// 对已有项目做渲染处理
const renderProject = () => {
  // 遍历 props.item.steps 插入message
  props.item.steps.forEach((step, index) => {
    messages.value.push({
      type: index === 0 ? 'user' : step.role,
      text: step.context,
      roleName: step.roleName,
      roleJob: step.roleJob,
      action: step.action,
      fileName: step.fileName,
      fileType: step.fileType,
      toggle: false
    })
  })
}

watch(
  () => props.item,
  () => {
    // 已有项目, 请求数据
    if (props.item.type === 'old') {
      // 请求
      renderProject()
    }
    if (props.item.type === 'new') {
      messages.value.push({
        type: 'ai',
        text: '你好, 我是AI, 请问有什么可以帮到您的?'
      })
    }
  },
  { immediate: true },
  { deep: true }
)
// 插入聊天记录
const insertMessage = (type, text) => {
  messages.value.push({ type, text })
}

const chatBox = ref(null)
const scrollToBottom = async () => {
  await nextTick(() => {
    chatBox.value.scrollTop = chatBox.value.scrollHeight
  })
}

const sendMessage = async () => {
  if (userInput.value.trim() === '') return

  // 添加用户消息
  insertMessage('user', userInput.value)
  scrollToBottom()

  // 清空输入框
  userInput.value = ''

  // ai 信息流式输出
  //todo
  // 结束
  scrollToBottom()
  isLoading.value = false
}
</script>

<template>
  <div class="pro-chat-container wh-full fd-col">
    <div class="pro-chat-header h-60 f-s flex-shrink-0 sticky top-0 z-10">
      <div class="hide-btn w-20% h-full flex items-center p-l-30">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          class="cp"
          @click="hideItem"
        >
          <g id="arrow_up_fill" fill="none" fill-rule="nonzero">
            <path
              d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z"
            />
            <path
              class="hover-path"
              fill="#b2b9bc"
              d="M13.06 3.283a1.5 1.5 0 0 0-2.12 0L5.281 8.939a1.5 1.5 0 0 0 2.122 2.122L10.5 7.965V19.5a1.5 1.5 0 0 0 3 0V7.965l3.096 3.096a1.5 1.5 0 1 0 2.122-2.122L13.06 3.283Z"
            />
          </g>
        </svg>
      </div>
      <div class="pro-name f-1 f-c h-full fw-600 fs-16">{{ item?.name }}</div>
      <div class="place-holder w-20% h-full"></div>
    </div>
    <!-- 对话框 -->
    <div class="pro-chat-content f-1 h-80%">
      <div
        class="chat-box overflow-y-auto m-b-15 rounded-8 h-full fd-col relative p-t-20 p-b-10"
        ref="chatBox"
      >
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="chat-message mb-10 p-x-1.25em max-w-140rem!"
          :style="{
            'align-self': message.type === 'user' ? 'flex-end' : 'flex-start'
          }"
        >
          <div v-if="message.type === 'user'" class="user-message f-c">
            <div class="chat chat-end">
              <div
                class="chat-bubble duration-500"
                :class="globalStore.isDark ? '' : 'bubble-light'"
              >
                {{ message.text }}
              </div>
              <div class="chat-image avatar">
                <div class="w-40 rounded-full">
                  <img :src="ava" />
                </div>
              </div>
            </div>
          </div>
          <div v-else class="ai-message flex">
            <div class="chat chat-start">
              <div class="chat-image avatar">
                <div class="w-40 rounded-full">
                  <div class="role-ava wh-full f-c bg-#27ba9b">
                    {{ message.type[0].toUpperCase() }}
                  </div>
                </div>
              </div>
              <div class="chat-right">
                <div class="role-include fs-12 m-l-8 m-b-3">
                  {{ message.roleName }} | {{ message.roleJob }}
                </div>
                <div
                  class="chat-bubble duration-500 max-w-160rem! p-b-1"
                  :class="globalStore.isDark ? '' : 'bubble-light'"
                  v-show="message.toggle"
                  @dblclick.stop="message.toggle = !message.toggle"
                >
                  <!-- {{ message.text }} -->
                  <template v-if="message.fileType === 'md'">
                    <span
                      v-html="md.render(message.text)"
                      class="markdown"
                    ></span>
                  </template>
                  <template v-else>
                    <VCodeBlock
                      :browser-window="true"
                      :code="message.text"
                      highlightjs
                      :lang="message.fileType"
                      :theme="globalStore.isDark ? 'github-dark' : 'github'"
                    />
                  </template>
                </div>
                <div
                  class="chat-bubble duration-500"
                  :class="globalStore.isDark ? '' : 'bubble-light'"
                  v-show="!message.toggle"
                  @dblclick.stop="message.toggle = !message.toggle"
                >
                  <file-item :file="message"></file-item>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 输入框 -->
    <div class="input-box flex-shrink-0">
      <!-- <div class="tip-btn bg-red">快捷短语</div> -->
      <el-input
        v-model="userInput"
        placeholder="请输入您的问题..."
        @keyup.enter="sendMessage"
        :disabled="isLoading"
      >
        <template #suffix>
          <el-button type="primary" @click="sendMessage" size="large" round>
            <el-icon size="20"> <Position /></el-icon>
          </el-button>
        </template>
        <template #prefix>
          <div class="clear-btn f-c cursor-pointer" @click="clearMessage">
            <el-icon size="24"> <Delete /></el-icon>
          </div>
        </template>
      </el-input>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pro-chat-container {
  background: var(--el-card-bg-color);
  border: 1px solid var(--el-card-border-color);
  .pro-chat-header {
    border-bottom: 1px solid var(--el-card-border-color);
    background-color: var(--el-card-bg-color);
    .hide-btn {
      svg {
        &:hover {
          .hover-path {
            fill: #27ba9b;
          }
        }
      }
    }
  }
  .pro-chat-content {
    .chat-box {
      scrollbar-width: none;
    }
  }
}
// Markdown 样式重置
:deep(.markdown) {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  margin: 20px 0;

  // 标题样式
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0.15em 0;
    font-weight: bold;

    &:nth-of-type(1) {
      font-size: 2em;
    }

    &:nth-of-type(2) {
      font-size: 1.75em;
    }

    &:nth-of-type(3) {
      font-size: 1.5em;
    }

    &:nth-of-type(4) {
      font-size: 1.25em;
    }

    &:nth-of-type(5) {
      font-size: 1.1em;
    }

    &:nth-of-type(6) {
      font-size: 1em;
    }
  }

  // 段落样式
  p {
    margin: 0.5em 0;
    line-height: 1.5;
    &:first-child {
      margin-top: 0;
    }
  }

  // 列表样式
  ul,
  ol {
    margin: 0.5em 0;
    padding-left: 20px; // 添加左侧内边距
    list-style-type: disc;

    li {
      margin-bottom: 0.5em; // 列表项之间的间距
    }
  }

  // 链接样式
  a {
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  // 代码块样式
  pre {
    background: #f8f8f8;
    border: 1px solid #ddd;
    padding: 10px;
    overflow: auto;
  }

  code {
    background: #f8f8f8;
    padding: 2px 4px;
    border-radius: 3px;
  }

  // 图片样式
  img {
    max-width: 100%;
    height: auto;
  }

  // 块引用样式
  blockquote {
    border-left: 4px solid #007bff;
    padding-left: 10px;
    margin: 0;
    color: #555;
    font-style: italic;
  }
}

.bubble-light {
  background-color: #f4f4f4;
  color: #0d0d0d;
}
:deep(code) {
  scrollbar-width: thin;
}
:deep(.hljs) {
  background: transparent;
}
:deep(.el-input) {
  --el-input-border-radius: 50px;
}
:deep(.el-input__wrapper) {
  padding-right: 0 !important;
  padding-left: 0 !important;
}
:deep(.el-card__body) {
  padding-top: 0 !important;
}
:deep(.el-input__prefix) {
  margin-left: 18px;
}
</style>
