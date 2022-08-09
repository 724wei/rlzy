<template>
  <div class="dashboard-container">
    <div class="app-container">
      <ToolBar>
        <template #after>
          <el-button type="primary" size="mini" @click="addPermission('0',1)">添加权限</el-button>
        </template>
      </ToolBar>
      <!-- 表格 -->
      <el-table :data="list" row-key="id" border>
        <el-table-column type="index" label="序号" />
        <el-table-column label="名称" prop="name" />
        <el-table-column label="标识" prop="code" />
        <el-table-column label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{row}">
            <el-button v-if="row.type===1" type="text" @click="addPermission(row.id,2)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)"> 删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="`${title}权限`" :visible="showDialog" @close="close">
      <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { addPermission, delPermission, getPermissionDetail, getPermissionList, updatePermission } from '@/api/permission'
import { transListTree } from '@/utils'

export default {
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async editPermission(id) {
      this.showDialog = true
      this.formData = await getPermissionDetail(id)
    },
    async delPermission(id) {
      await this.$confirm('确认删除？')
      await delPermission(id)
      this.$message.success('删除成功')
      await this.getPermissionList()
    },
    // 点击添加的时候给formDate的pid和type赋初值
    addPermission(pid, type) {
      console.log(pid, type)
      this.formData.pid = pid
      this.formData.type = type
      console.log(this.formData)
      this.showDialog = true
    },
    async btnOK() {
      await this.$refs.perForm.validate()
      try {
        if (this.formData.id) {
          //  编辑
          await updatePermission(this.formData)
        } else {
          //  新增
          console.log(this.formData)
          await addPermission(this.formData)
        }
        this.$message.success(`${this.title}成功`)
      } catch (e) {
        console.log(e)
        this.$message.error('添加失败')
      }
      this.close()
      await this.getPermissionList()
    },
    close() {
      this.$refs.perForm.resetFields()
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.showDialog = false
    },
    btnCancel() {},
    async getPermissionList() {
      const res = await getPermissionList()
      // console.log(res)
      this.list = transListTree(res, '0')
    }
  }
}
</script>

<style>

</style>
