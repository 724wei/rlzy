<template>
  <UploadExcel :on-success="onSuccess" />
</template>
<script>
import { importEmployee } from '@/api/employee'

const userRelations = {
  '入职日期': 'timeOfEntry',
  '手机号': 'mobile',
  '姓名': 'username',
  '转正日期': 'correctionTime',
  '工号': 'workNumber'
}
export default {
  name: 'Import',
  methods: {
    async onSuccess({ results }) {
      const obj = []
      const resArr = results.map(item => {
        // 数据对象中的key改为英文
        for (const itemKey in item) {
          // 判断是否是时间，是时间就将时间格式化
          if (['correctionTime', 'timeOfEntry'].includes(userRelations[itemKey])) {
            obj[userRelations[itemKey]] = new Date(this.formatDate(item[itemKey], '/'))
          } else {
            obj[userRelations[itemKey]] = item[itemKey]
          }
        }
        return obj
      })
      await importEmployee(obj)
      this.$message.success('上传成功')
      console.log(resArr)
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }

  }
}
</script>
<style></style>
