<script setup>
import { useGlobalStore } from '@/stores'

const globalStore = useGlobalStore()

const props = defineProps({
  type: {
    type: String,
    default: 'item'
  },
  info: {
    type: Object,
    default: () => {}
  }
})

const emit = defineEmits(['check'])
const checkItem = () => {
  emit('check', props.info)
}
</script>

<template>
  <div class="pro-item-container m-x-15 cp duration-300" @click="checkItem()">
    <div class="pro-item-content h-250 f-c">
      <div
        class="new flex fd-col items-center duration-300"
        v-if="type === 'new'"
      >
        <div class="plus-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
          >
            <g id="add_fill" fill="none">
              <path
                d="M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z"
              />
              <path
                class="hover-path"
                fill="#b2b9bc"
                d="M10.5 20a1.5 1.5 0 0 0 3 0v-6.5H20a1.5 1.5 0 0 0 0-3h-6.5V4a1.5 1.5 0 0 0-3 0v6.5H4a1.5 1.5 0 0 0 0 3h6.5z"
              />
            </g>
          </svg>
        </div>
        <div class="txt color-#b2b9bc p-t-8">新建工程</div>
      </div>
      <div class="item wh-full relative" v-else>
        <div
          class="id w-25% h-26 flex items-center p-l-10 p-r-15 bg-#fff0d9 rounded-r-13 m-t-11 overflow-hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <g id="diamond_2_line" fill="none" fill-rule="evenodd">
              <path
                d="M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z"
              />
              <path
                fill="#fc9901"
                d="M17 3a2 2 0 0 1 1.492.668l.108.132 3.704 4.939a2 2 0 0 1-.012 2.416l-.108.13-9.259 10.184a1.25 1.25 0 0 1-1.753.096l-.097-.096-9.259-10.185a2 2 0 0 1-.215-2.407l.095-.138L5.4 3.8a2 2 0 0 1 1.43-.793L7 3zm-2.477 8H9.477L12 17.307zm5.217 0h-3.063l-2.406 6.015zM7.323 11H4.261l5.468 6.015zm5.059-6h-.764l-2 4h4.764zM17 5h-2.382l2 4H20zM9.382 5H7L4 9h3.382z"
              />
            </g>
          </svg>
        </div>
        <div class="title fs-15 h-44 m-y-12 m-x-15 text-overflow">
          {{ info.name }}
        </div>
        <div
          class="desc fs-13 h-75 color-#acacac m-x-15 text-overflow whitespace-normal"
        >
          {{ info.desc }}
        </div>
        <div
          class="sort m-t-20 m-x-15 h-24 leading-24 overflow-hidden color-#fff bg-#27ba9b text-center relative"
        >
          <span class="fs-14 wh-full">案例</span>
          <span class="angle tl absolute top-0 left-0"></span>
          <span class="angle tr absolute top-0 right-0"></span>
          <span class="angle bl absolute bottom-0 left-0"></span>
          <span class="angle br absolute bottom-0 right-0"></span>
        </div>
        <div class="msk absolute wh-full top-0 left-0 opacity-0">
          <span class="animated wh-full f-c fd-col">
            <div class="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
              >
                <g id="black_board_2_fill" fill="none" fill-rule="evenodd">
                  <path
                    d="M24 0v24H0V0zM12.594 23.258l-.012.002-.071.035-.02.004-.014-.004-.071-.036c-.01-.003-.019 0-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01z"
                  />
                  <path
                    fill="#27ba9b"
                    d="M10.586 4a2 2 0 0 1 2.701-.117l.127.117 3 3H19a2 2 0 0 1 1.995 1.85L21 9v10a2 2 0 0 1-1.85 1.994L19 21H5a2 2 0 0 1-1.995-1.85L3 19V9a2 2 0 0 1 1.85-1.995L5 7h2.586zM10 15H8a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2m4-4H8a1 1 0 0 0-.117 1.993L8 13h6a1 1 0 0 0 .117-1.993zm-2-5.586L10.414 7h3.172z"
                  />
                </g>
              </svg>
            </div>
            <div class="txt color-#27ba9b m-t-8">查看案例</div>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pro-item-container {
  box-shadow:
    0 2px 4px 0 rgba(0, 0, 0, 0.12),
    0 0 6px 0 rgba(0, 0, 0, 0.04);
  border: 1px solid var(--el-card-border-color);
  &:hover {
    transform: scale(1.1);
    .new {
      animation-name: fadeInUps;
      animation-duration: 0.3s;
      .plus-icon {
        svg {
          .hover-path {
            fill: #27ba9b;
          }
        }
      }
      .txt {
        color: #27ba9b !important;
      }
    }
    .msk {
      opacity: 1;
      background-color: v-bind(
        "globalStore.isDark ? ' #1d1e1fe6 ' : ' #ffffffe6 '"
      );
      .animated {
        animation-name: fadeInUps;
        animation-duration: 0.3s;
      }
    }
  }
  .sort {
    .angle {
      width: 0;
      height: 0;
    }
    .tl {
      border-top: 12px solid var(--el-card-bg-color);
      border-right: 12px solid transparent;
    }
    .tr {
      border-top: 12px solid var(--el-card-bg-color);
      border-left: 12px solid transparent;
    }
    .bl {
      border-bottom: 12px solid var(--el-card-bg-color);
      border-right: 12px solid transparent;
    }
    .br {
      border-bottom: 12px solid var(--el-card-bg-color);
      border-left: 12px solid transparent;
    }
  }
}

@keyframes fadeInUps {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
