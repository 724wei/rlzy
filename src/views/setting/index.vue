<template>
  <el-card class="box-card">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="角色管理" name="first">
        <el-button icon="el-icon-plus" size="mini" type="primary">新增角色</el-button>
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
              <el-button type="success" size="small">分配权限</el-button>
              <el-button type="primary" size="small">编辑</el-button>
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
    <el-dialog title="编辑角色" :visible="isShowEdit">
      <el-form :rules="editRules" label-width="120px">
        <el-form-item label="角色" prop="name">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.description" />
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>
<script>
import { deleteRole, getCompanyInfo, getRoleList } from '@/api/setting'
export default {
  data() {
    return {
      activeName: 'first',
      isShowEdit: true,
      list: [],
      editForm: {
        name: '',
        description: ''
      },
      editRules: {
        name: [{ required: true, message: '不能为空' }]
      },
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 2,
        total: 0 // 记录总数
      },
      formDate: {}
    }
  },
  created() {
    this.getConfirmList()
    this.getCompanyInfo()
  },
  methods: {
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
    }
  }
}
</script>
<style scoped lang="scss">
.box-card{
  margin: 20px;
}
</style>
