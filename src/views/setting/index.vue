<template>
  <el-card class="box-card">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="角色管理" name="first">
        <el-button icon="el-icon-plus" size="mini" type="primary" @click="isShowEdit=true">新增角色</el-button>
        <el-table :data="list">
          <el-table-column
            type="index"
            label="序号"
            width="180"
          />
          <el-table-column
            prop="name"
            label="角色名称"
            width="180"
          />
          <el-table-column
            prop="description"
            label="描述"
          />
          <el-table-column label="操作">
            <template v-slot="{row}">
              <el-button type="success" size="small" @click="assignPrem(row.id)">分配权限</el-button>
              <el-button type="primary" size="small" @click="editRole(row.id)">编辑</el-button>
              <el-button type="danger" size="small" @click="del(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row style="margin-top: 20px" type="flex" justify="center">
          <el-pagination
            :current-page="page.page"
            :page-size="page.pagesize"
            layout="total, prev, pager, next"
            :total="page.total"
            @current-change="changeCur"
          />
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="公司设置" name="second">
        <el-alert
          title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
          type="info"
          show-icon
        />
        <el-form disabled label-width="120px" style="margin-top: 40px">
          <el-form-item label="公司名称">
            <el-input v-model="formDate.name" style="width:50%" />
          </el-form-item>
          <el-form-item label="公司地址">
            <el-input v-model="formDate.companyAddress" style="width:50%" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="formDate.mailbox" style="width:50%" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="formDate.remarks" style="width:50%" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="`${editForm.id?'编辑':'新增'}角色`" :visible="isShowEdit" @close="close">
      <el-form ref="editForm" :rules="editRules" label-width="120px">
        <el-form-item label="角色" prop="name">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.description" />
        </el-form-item>
      </el-form>
      <template>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="confirmEdit">确定</el-button>
      </template>
    </el-dialog>
    <el-dialog title="分配权限" :visible.sync="showAssignDialog" @close="closePremission">
      <el-tree
        ref="treeRef"
        :default-checked-keys="checkList"
        :data="premissionList"
        :props="props"
        default-expand-all
        show-checkbox
        check-strictly
        node-key="id"
      />
      <template #footer>
        <el-button>取消</el-button>
        <el-button type="primary" @click="permissionOK">确定</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>
<script>
import { addRole, deleteRole, getCompanyInfo, getRoleDetail, getRoleList, updateRole } from '@/api/setting'
import { assignPerm, getPermissionList } from '@/api/permission'
import { transListTree } from '@/utils'
export default {
  data() {
    return {
      premissionList: [],
      checkList: [],
      props: { label: 'name' },
      showAssignDialog: false,
      activeName: 'first',
      isShowEdit: false,
      list: [],
      editForm: {
        name: '',
        description: ''
      },
      editRules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 2,
        total: 0 // 记录总数
      },
      formDate: {},
      currentRoleId: null
    }
  },
  created() {
    this.getConfirmList()
    this.getCompanyInfo()
  },
  methods: {
    async permissionOK() {
      const checkedKeys = this.$refs.treeRef.getCheckedKeys()
      await assignPerm({
        id: this.currentRoleId,
        permIds: checkedKeys
      })
      this.$message.success('修改权限成功')
      this.closePremission()
    },
    closePremission() {
      this.showAssignDialog = false
      this.checkedKeys = []
    },
    // 点击分配权限
    async assignPrem(id) {
      this.currentRoleId = id
      this.showAssignDialog = true
      this.premissionList = transListTree(await getPermissionList(id), '0')
      const { permIds } = await getRoleDetail(id)
      console.log(permIds)
      this.checkList = permIds
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 获取角色数据
    async getConfirmList() {
      const { rows, total } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    changeCur(page) {
      this.page.page = page
      this.getConfirmList()
    },
    // 获取公司数据
    async getCompanyInfo() {
      this.formDate = await getCompanyInfo(this.$store.getters.companyId)
    },
    // 删除角色数据
    async del(id) {
      const len = this.list.length
      await this.$confirm('确认删除吗？')
      await deleteRole(id)
      if (len === 1 && this.page.page > 1) {
        this.page.page--
      }
      this.$message.success('删除成功')
      await this.getConfirmList()
    },
    //  编辑角色信息
    async editRole(id) {
      this.isShowEdit = true
      this.editForm = await getRoleDetail(id)
    },
    //  关闭弹层
    close() {
      this.isShowEdit = false
      this.$refs.editForm.resetFields()
      this.editForm = {
        name: '',
        description: ''
      }
    },
    //  确认按钮
    async confirmEdit() {
      if (this.editForm.id) {
        await updateRole(this.editForm)
      } else {
        await addRole(this.editForm)
      }
      this.$message.success('成功')
      this.close()
    }
  }
}
</script>
<style scoped lang="scss">
.box-card{
  margin: 20px;
}
</style>
