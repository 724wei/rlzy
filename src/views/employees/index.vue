<template>
  <div class="dashboard-container">
    <div class="app-container">
      <ToolBar>
        <template #before>
          共100条数据
        </template>
        <template #after>
          <el-button size="mini" type="primary" @click="importEmp">导入</el-button>
          <el-button size="mini" type="danger" @click="exportRmp">导出</el-button>
          <el-button size="mini" type="warning" @click="isShowAdd=true">新增员工</el-button>
        </template>
      </ToolBar>
      <el-table
        border
        :data="employList"
        style="width: 100%"
      >
        <el-table-column
          label="序号"
          type="index"
          width="50px"
        />
        <el-table-column
          prop="username"
          label="姓名"
        />
        <el-table-column
          prop="address"
          label="头像"
        >
          <template v-slot="{row}">
            <el-avatar style="width: 80px;height: 80px;" :src="row.staffPhoto" @click.native="showCanvasInfo(row.staffPhoto)">
              <img src="@/assets/common/bigUserHeader.png" alt="">
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column
          prop="workNumber"
          label="工号"
        />
        <el-table-column
          prop="formOfEmployment"
          :formatter="formatter"
          label="聘用形式"
        />
        <el-table-column
          prop="departmentName"
          label="部门名称"
        />
        <el-table-column
          label="入职时间"
        >
          <template v-slot="{row}">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="账户状态"
        />
        <el-table-column
          prop="address"
          label="操作"
          width="280px"
        >
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
            <el-button type="text" size="small" :disabled="checkPermission('DELETE_USER')" @click="delEmploy(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="center">
        <el-pagination
          :page-size="page.size"
          layout="total, prev, pager, next"
          :total="page.total"
          @current-change="changeCur"
        />
      </el-row>
    </div>
    <AddDialog :is-show-add.sync="isShowAdd" />
    <el-dialog title="二维码预览" :visible.sync="showCanvas">
      <canvas ref="canvasInfo" />
    </el-dialog>
    <AssignRole ref="RoleRef" :current-id="currentId" :show-edit-role.sync="showEditRole" />
  </div>
</template>

<script>
import ToolBar from '@/components/ToolBar'
import { delEmployee, getEmployeeList } from '@/api/employee'
// 调用枚举文件
import EmployeeEnum from '@/api/constant/employees.js'
import AddDialog from '@/views/employees/component/AddDialog'
import { formatDate } from '@/filters'
// 二维码预览插件
import qrcode from 'qrcode'
import AssignRole from '@/views/employees/component/assign-role'
import { myMixin } from '@/utils/mixins'
export default {
  components: {
    AssignRole,
    AddDialog,
    ToolBar
  },
  mixins: [myMixin],
  data() {
    return {
      currentId: null,
      showEditRole: false,
      showCanvas: false,
      employList: [{ name: '', index: '', address: '' }],
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0 // 总数
      },
      isShowAdd: false,
      treeDate: []
    }
  },
  created() {
    this.getEmpList()
  },
  methods: {
    //  点击角色
    async editRole(id) {
      this.showEditRole = true
      await this.$refs.RoleRef.gerCurrentRoleId(id)
      this.currentId = id
    },
    // 点击预览图片二维码
    showCanvasInfo(url) {
      if (url) {
        this.showCanvas = true
        // 数据更新后dom节点还未更新，因此需要添加$nextTick去等到dom节点更新以后再去获取页面中的dom结构
        this.$nextTick(() => {
          qrcode.toCanvas(this.$refs.canvasInfo, url)
        })
      }
    },
    async getEmpList() {
      const { rows, total } = await getEmployeeList(this.page)
      this.employList = rows
      this.page.total = total
    },
    changeCur(page) {
      this.page.page = page
      this.getEmpList()
    },
    // 格式化日期
    formatter(row, column, cellValue) {
      const currentDate = EmployeeEnum.hireType.find(item => item.id === cellValue)?.value
      return currentDate || '未知'
    },
    // 删除员工
    async delEmploy(id) {
      try {
        await this.$confirm('是否删除？')
        await delEmployee(id)
        this.$message.success('删除成功')
        await this.getEmpList()
      } catch (e) {
        console.log(e)
      }
    },
    //  导入
    importEmp() {
      this.$router.push('/import')
    },
    //  导出
    async exportRmp() {
      // 预期导出一个excel
      // 动态导入一个模块的时候，使用import语法/import返回值是一个promise
      // 如果想要拿到模块内部导出的内容，then(res)接收
      // 使用’/* webpackChunkName: '文件名'*/‘可以设置打包后的js文件的名称
      const { export_json_to_excel } = await import('@/utils/Export2Excel')
      const headers = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const { rows } = await getEmployeeList({ page: 1, total: this.page.total })
      const arr = this.formatterDate(rows, headers)
      console.log(arr)
      export_json_to_excel({
        header: headers, // 表头 必填
        data: arr, // 具体数据 必填
        filename: 'excel-list', // 非必填
        autoWidth: true, // 非必填
        bookType: 'xlsx' // 非必填
      })
      // })
    },
    // 格式化excel信息
    formatterDate(rows, headers) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (['timeOfEntry', 'correctionTime'].includes(headers[key])) {
            return formatDate(item[headers[key]])
          }
          if (['formOfEmployment'].includes(headers[key])) {
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
    }

  }
}
</script>

<style scoped lang="scss">

</style>
