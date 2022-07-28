<template>
  <el-row type="flex" style="width: 100%">
    <el-col>
      <span>{{ treeDate.name }}</span>
    </el-col>
    <el-col :span="7">
      <el-row type="flex">
        <el-col>
          <span>{{ treeDate.manager }}</span>
        </el-col>
        <el-col :span="12">
          <el-dropdown @command="clickItem">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加部门</el-dropdown-item>
              <el-dropdown-item v-if="!isroot" command="del">删除部门</el-dropdown-item>
              <el-dropdown-item v-if="!isroot" command="edit">编辑部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    treeDate: {
      type: Object,
      default: () => ({})
    },
    isroot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async clickItem(type) {
      if (type === 'add') {
        this.$emit('AddDept', this.treeDate)
        console.log('add')
        console.log(this.treeDate)
      } else if (type === 'edit') {
        console.log('edit')
        this.$emit('EditDept', this.treeDate)
      } else {
        console.log('del')
        await this.$confirm('确认删除')
        await delDepartments(this.treeDate.id)
        this.$emit('getDepartments')
        this.$message.success('删除成功')
      }
    }
  }
}
</script>

<style></style>
