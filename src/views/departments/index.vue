<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <TreeTool :isroot="true" :tree-date="company" @AddDept="AddDept" />
      </el-card>
      <el-tree :data="departs" default-expand-all :props="defaultProps">
        <!--        默认插槽-->
        <template v-slot="{data}">
          <TreeTool :isroot="false" :tree-date="data" @EditDept="EditDept" @AddDept="AddDept" @getDepartments="getDepartments" />
        </template>
      </el-tree>
    </div>
    <!--    新增部门弹层-->
    <!--    父组件的属性名后面添加.sync表示将属性双向绑定给子组件-->
    <!--    他给子组件添加了一个自定义事件，用来修改当前字段 -->
    <!--    事件名称updata:属性名-->
    <AddDept ref="addDept" :current-node="currentNode" :is-show-add.sync="isShowAdd" @getDepartments="getDepartments" />
  </div>
</template>

<script>
import TreeTool from '@/views/departments/components/treeTool'
import { getDepartments } from '@/api/departments'
import { transListTreeNew } from '@/utils'
import AddDept from '@/views/departments/components/AddDept'
export default {
  components: { AddDept, TreeTool },
  data() {
    return {
      isShowAdd: false,
      loading: false,
      currentNode: {},
      departs: [{ name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人', id: '' }
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    // 新增部门
    AddDept(node) {
      this.isShowAdd = true
      this.currentNode = node
    },
    // 编辑部门
    EditDept(node) {
      this.isShowAdd = true
      this.currentNode = node
      // 调用组件内部的方法
      this.$refs.addDept.getDetailById(node.id)
    },
    // 获取信息
    async getDepartments() {
      this.loading = true
      const res = await getDepartments()
      this.company = {
        name: res.companyName,
        manager: res.companyManager,
        id: ''
      }
      // this.company = { name: result.companyName, manager: '负责人' }
      this.departs = transListTreeNew(res.depts)
      // console.log(res)
      this.loading = false
    }
  }
}
</script>

<style scoped lang="scss">
.dashboard-container{
  min-height: 900px;
  .box-card{
    background-color: #99ccff;
  }
  .app-container{
    width: 800px;
    position: absolute;
    left: 50%;
    top: 10%;
    transform: translateX(-50%);
  }
}
</style>
