<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <ImageUpload />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { myMixin } from '@/utils/mixins'

export default {
  name: 'Dashboard',
  mixins: [myMixin],
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  // $router > 全局vueRouter实例，挂载到Vue原型上$router属性，可以获取全局路由配置信息，跳转方法$route >当前的路由信息对象，获取到路由参数，路径

  methods: {
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
