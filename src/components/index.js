// 将 components 文件夹下的所有组件进行全局化注册
import CardContainer from './modules/CardContainer/CardContainer.vue'
import SwitchButton from './modules/SwitchButton/SwitchButton.vue'
import IconCube from './modules/IconCube/IconCube.vue'
import { VCodeBlock } from '@wdns/vue-code-block'

export const componentPlugin = {
  install(app) {
    app.component('CardContainer', CardContainer)
    app.component('SwitchButton', SwitchButton)
    app.component('IconCube', IconCube)
    app.component('VCodeBlock', VCodeBlock)
  }
}
