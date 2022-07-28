<template>
  <el-dialog :visible="isShowAdd" :title="`${showTitle}部门`" @close="close">
    <el-form ref="form" label-width="120px" :rules="rules" :model="form">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="form.code" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="form.manager" placeholder="请选择" @focus="getEmpList">
          <el-option
            v-for="item in options"
            :key="item.value"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="form.introduce" placeholder="1-300个字符" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button type="primary" size="small" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { addDepartments, getDepartDetail, getDepartments, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employee'

export default {
  props: {
    isShowAdd: {
      type: Boolean,
      default: false
    },
    currentNode: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    // 检验部门名称是否有重复的函数
    const checkName = async(rules, value) => {
      const { depts } = await getDepartments()
      let currentChildren = null
      // 校验时判断当前的
      if (this.form.id) {
        // 当编辑时，找出当前节点的同级节点，并排除自己
        // 通过判断是否有相同的pid，来查找同级节点
        currentChildren = depts.filter(item => {
          return item.pid === this.currentNode.pid && item.id !== this.currentNode.id
        })
      } else {
        currentChildren = depts.filter(item => {
          return item.pid === this.currentNode.id
        })
      }
      const isRoot = currentChildren.some(item => item.name === value)
      if (isRoot) {
        return Promise.reject('部门名称不能重复')
      }
    }
    const checkCode = async(rules, value) => {
      const { depts } = await getDepartments()
      let isRep = null
      if (this.form.id) {
        isRep = depts.some(item => (item.code === value && item.id !== this.currentNode.id))
      } else {
        isRep = depts.some(item => (item.code === value))
      }
      if (isRep) {
        return Promise.reject('部门编码不能重复')
      }
    }
    return {
      form: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称长度为1-50' },
          { validator: checkName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称长度为1-50' },
          { validator: checkCode, trigger: 'blur' }
        ],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门名称长度为1-50' }
        ]
      },
      options: []
    }
  },
  computed: {
    showTitle() {
      return this.form.id ? '编辑' : '添加'
    }
  },
  methods: {
    async getEmpList() {
      this.options = await getEmployeeSimple()
    },
    async submit() {
      await this.$refs.form.validate()
      // 判断当前是编辑还是增加
      if (this.form.id) {
        await updateDepartments(this.form)
      } else {
        await addDepartments({
          ...this.form,
          pid: this.currentNode.id
        })
      }
      this.$message.success(`${this.showTitle}成功`)
      this.$emit('getDepartments')
      this.close()
    },
    close() {
      this.$refs.form.resetFields()
      this.form = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$emit('update:isShowAdd', false)
    },
    async getDetailById(id) {
      this.form = await getDepartDetail(id)
    }
  }
}
</script>
<style></style>
