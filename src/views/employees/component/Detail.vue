<template>
  <div>
    <el-card>
      <el-tabs>
        <el-tab-pane label="登录账户设置">
          <el-form ref="userForm" :rules="rules" :model="formDate" class="form" label-width="120px">
            <el-form-item label="姓名" prop="username">
              <el-input v-model="formDate.username" style="width: 40%;margin-left: 20px;" />
            </el-form-item>
            <el-form-item label="密码" prop="password2">
              <el-input v-model="formDate.password2" style="width: 40%;margin-left: 20px;" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateInfo">更新</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="配置管理">
          <!--          动态组件-->
          <component :is="UserInfo" />
        </el-tab-pane>
        <el-tab-pane label="角色管理">
          <component :is="JobInfo" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getUserDetailById, saveUserDetailById } from '@/api/employee'
import UserInfo from '@/views/employees/component/user-info'
import JobInfo from '@/views/employees/component/job-info'
export default {
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      UserInfo: UserInfo,
      JobInfo: JobInfo,
      formDate: {
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    // 获取用户的信息
    async getUserInfo() {
      this.formDate = await getUserDetailById(this.$route.params.id)
    },
    // 提交用户更新的信息
    async updateInfo() {
      try {
        // 校验
        await this.$refs.userForm.validate()
        await saveUserDetailById({ ...this.formDate, password: this.formDate.password2 }) // 将新密码的值替换原密码的值
        this.$message.success('保存成功')
        this.formDate.password2 = ''
      } catch (error) {
        console.log(error)
      }
    }

  }
}
</script>

<style></style>
