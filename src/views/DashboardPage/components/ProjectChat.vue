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
const emit = defineEmits(['hide', 'end'])
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
  messages.value = []
  messages.value.push({
    type: 'user',
    text: props.item.desc,
    toggle: false
  })
  props.item.steps.forEach((step) => {
    messages.value.push({
      type: step.role,
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
    userInput.value = ''
    // 已有项目, 请求数据
    if (props.item.type === 'old') {
      // 请求
      renderProject()
    }
    if (props.item.type === 'new') {
      messages.value.push({
        type: 'ai',
        text: '你好, 我是AI, 请问有什么可以帮到您的?',
        toggle: true
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
let typeInterval
const sendMessage = async () => {
  if (userInput.value.trim() === '') return

  // 添加用户消息
  insertMessage('user', userInput.value)
  scrollToBottom()

  const desc = userInput.value
  // 清空输入框
  userInput.value = ''

  // ai 信息流式输出
  const params = new URLSearchParams({
    description: desc,
    projectName: props.item.name,
    envName: props.item.envName
  })

  // 打字机相关逻辑
  let isTyping = false
  let currentMessage = ''
  let messageIndex = 0
  let cachedText = '' // 用来缓存当前打字机渲染的内容

  // 存储待处理的消息
  const messageQueue = []
  let isTypingComplete = false // 标志，确保所有消息打字机效果完成后触发结束

  // 打字机函数
  const typeText = (text, callback) => {
    if (isTyping) {
      // 如果当前正在打字，加入消息队列，等待处理
      messageQueue.push({ text, callback })
      return
    }

    // 开始打字机效果
    isTyping = true
    currentMessage = text
    messageIndex = 0
    cachedText = '' // 清空缓存

    typeInterval = setInterval(() => {
      messageIndex++
      cachedText = currentMessage.slice(messageIndex - 1, messageIndex)
      messages.value[messages.value.length - 1].text += cachedText

      // 更新渲染的 messages 数组
      messages.value = [...messages.value]

      if (messageIndex === currentMessage.length) {
        // 换行
        messages.value[messages.value.length - 1].text += '\n\n'
        clearInterval(typeInterval)
        isTyping = false
        callback && callback() // 执行回调，通知打字机效果完成
        processNextMessage() // 处理下一个消息
      }
    }, 10)
  }
  scrollToBottom()
  // 处理下一个待处理的消息
  const processNextMessage = () => {
    if (messageQueue.length > 0) {
      const nextMessage = messageQueue.shift() // 获取队列中的下一个消息
      typeText(nextMessage.text, nextMessage.callback) // 继续执行打字机效果
    } else {
      // 如果队列为空，表示打字机效果已经完成
      isTypingComplete = true
    }
  }

  // 信息处理逻辑
  const eventSource = new EventSource(
    `http://localhost:3007/start?${params.toString()}`
  )
  messages.value.push({
    type: 'ai',
    text: '',
    toggle: true
  })

  eventSource.onmessage = (event) => {
    // console.log(event.data) // 处理接收到的数据

    if (event.data !== 'Script ended with code 0') {
      // 逐字渲染数据
      typeText(event.data, () => {
        // console.log('Message typing complete')
      })
    } else {
      // 如果收到 'Script ended with code 0'，在所有打字机效果完成后关闭连接并触发结束
      eventSource.close()
      scrollToBottom()

      // 这里需要等待打字机效果完成再继续
      const waitForTypingCompletion = setInterval(() => {
        if (isTypingComplete) {
          clearInterval(waitForTypingCompletion) // 停止检查
          clearInterval(typeInterval)
          setTimeout(() => {
            ElNotification.success('项目生成成功')
            scrollToBottom()
            emit('end', props.item.name)
          }, 2000)
        }
      }, 100) // 每 100 毫秒检查一次打字机是否完成
    }

    scrollToBottom()
  }

  eventSource.onerror = (error) => {
    console.error('EventSource failed:', error)
    eventSource.close()
    scrollToBottom()
  }

  // 结束
  scrollToBottom()
  isLoading.value = false
}

// 程序运行
const runDialog = ref(false)
const iframe = ref(null)
const runCode = () => {
  runDialog.value = true
  // 通过 blob 创建 url
  // const blob = new Blob([code], { type: 'text/html' })
  // const blobUrl = URL.createObjectURL(blob)
  // console.log(code)
  // 将 Blob URL 设置到 iframe 的 src 属性中
  nextTick(() => {
    if (iframe.value) {
      iframe.value.src = `http://127.0.0.1:5500/metagpt/workspace/${props.item.name}/${props.item.name}/index.html`
    }
  })
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
                class="chat-bubble duration-500 min-w-20rem!"
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
                <div
                  class="role-include fs-12 m-l-8 m-b-3"
                  v-show="item.type !== 'new'"
                >
                  {{ message.roleName }} | {{ message.roleJob }}
                </div>
                <div
                  class="chat-bubble duration-500 max-w-160rem! p-b-1"
                  :class="globalStore.isDark ? '' : 'bubble-light'"
                  v-show="message.toggle"
                  @dblclick.stop="message.toggle = !message.toggle"
                >
                  <!-- {{ message.text }} -->
                  <template
                    v-if="message.fileType === 'md' || item.type === 'new'"
                  >
                    <span
                      v-html="md.render(message.text)"
                      class="markdown"
                    ></span>
                  </template>
                  <template v-else>
                    <VCodeBlock
                      highlightjs
                      tabs
                      run-text="运行"
                      :copy-tab="false"
                      :browser-window="true"
                      :code="message.text"
                      :lang="message.fileType"
                      :run-tab="message.fileType === 'html'"
                      :theme="globalStore.isDark ? 'github-dark' : 'github'"
                      @run="runCode"
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
    <!-- 程序运行 -->
    <el-dialog v-model="runDialog" title="程序运行" fullscreen id="run-code">
      <iframe ref="iframe" frameborder="0" width="100%" height="100%"></iframe>
    </el-dialog>
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
:deep(#run-code .el-dialog__body) {
  width: 100%;
  height: calc(100% - 31px - var(--el-font-line-height-primary));
  padding: 0;
}
:deep(#run-code) {
  padding-bottom: 0;
}
.bubble-light {
  background-color: #f4f4f4;
  color: #0d0d0d;
}
:deep(.chat-bubble) {
  max-width: none;
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
:deep(.v-code-block--tab-highlightjs-github) {
  background-color: transparent !important;
}
:deep(.v-code-block--tab-highlightjs-github-dark) {
  background-color: transparent !important;
}
</style>
