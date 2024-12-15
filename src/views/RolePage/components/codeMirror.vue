<template>
  <!-- :indent-with-tab="true" 是否自动获取焦点-->
  <codemirror
    v-model="code"
    placeholder="编写角色代码..."
    :style="{ height: '100%' }"
    :autofocus="true"
    :tabSize="2"
    :extensions="extensions"
  />
</template>

<script setup>
import { Codemirror } from 'vue-codemirror'
import { python } from '@codemirror/lang-python'
import { ref } from 'vue'
import { EditorView } from '@codemirror/view'

// 自定义主题
let myTheme = EditorView.theme(
  {
    // 输入的字体颜色
    '&': {
      color: '#0052D9',
      backgroundColor: '#FFFFFF'
    },
    '.cm-content': {
      caretColor: '#0052D9'
    },
    // 激活背景色
    '.cm-activeLine': {
      backgroundColor: '#FAFAFA'
    },
    // 激活序列的背景色
    '.cm-activeLineGutter': {
      backgroundColor: '#FAFAFA'
    },
    // 光标的颜色
    '&.cm-focused .cm-cursor': {
      borderLeftColor: '#0052D9'
    },
    // 选中的状态
    '&.cm-focused .cm-selectionBackground, ::selection': {
      backgroundColor: '#0052D9',
      color: '#FFFFFF'
    },
    // 左侧侧边栏的颜色
    '.cm-gutters': {
      backgroundColor: '#FFFFFF',
      color: '#ddd', // 侧边栏文字颜色
      border: 'none'
    }
  },
  { dark: true }
)

// 默认高度设置
// const props = withDefaults(defineProps(), {
//   height: '400px'
// })

const code = ref('')
const extensions = [python(), myTheme]

// 代码变化时的处理函数
// const Change = () => {
//   // 可以添加逻辑来处理代码变化
// }
</script>
