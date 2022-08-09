<template>
  <el-dialog title="分配权限" :visible="showEditRole" @close="close">
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <el-button type="primary" @click="btnOK">确认</el-button>
      <el-button>取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employee'

export default {
  name: 'AssignRole',
  props: {
    showEditRole: {
      type: Boolean,
      default: false
    },
    currentId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      roleIds: [],
      list: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async btnOK() {
      try {
        await assignRoles({
          id: this.currentId,
          roleIds: this.roleIds
        })
        this.$message.success('修改成功')
        this.close()
      } catch (e) {
        this.close()
      }
    },
    close() {
      this.roleIds = []
      this.$emit('update:showEditRole', false)
    },
    async  getRoleList() {
      const { rows } = await getRoleList()
      console.log(rows)
      this.list = rows
    },
    //  获取到当前用户的额角色信息
    async gerCurrentRoleId(id) {
      // 给rolesIds一个默认值，防止提交的数据不是数组出现length的错误
      const { roleIds = [] } = await getUserDetailById(id)
      this.roleIds = roleIds
    }
  }
}
</script>

<style scoped>

</style>
