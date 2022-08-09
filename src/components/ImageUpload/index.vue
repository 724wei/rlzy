<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :class="{complete:isComplete}"
      :limit="1"
      :on-change="changeList"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="isShow" style="width: 200px" :percentage="percentage" />
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDHNCk27vTjiRwA7oGRLyKPDk11kBMGsDI', // 身份识别 ID
  SecretKey: 'pNeeNq2yd18yXqtfAOL1QYS5RWLuBBvO' // 身份密钥
})
export default {
  name: 'ImageUpload',
  data() {
    return {
      isShow: false,
      percentage: 0,
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [
        // { url: 'https://img1.baidu.com/it/u=1118735667,2873017093&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=814' }
      ]
    }
  },
  computed: {
    isComplete() {
      return this.fileList.length === 1
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    changeList(file, fileList) {
      // fileList是最终的文件列表
      this.fileList = fileList
    },
    beforeUpload(file) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('文件类型错误')
        return false
      }
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('文件太大了')
        return false
      }
      this.isShow = true
    },
    upload({ file }) {
      if (file) {
        cos.putObject({
          Bucket: 'storage-1313213516', // 存储桶
          Region: 'ap-nanjing', // 地域
          Key: file.name, // 文件名
          Body: file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
          // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
          onProgress: ({ percent }) => {
            this.percentage = percent * 100
          }
        }, (err, data) => {
          // data返回数据之后 应该如何处理
          console.log(err || data)
          if (err) {
            this.$message.error(err?.message || '上传出错')
          }
          // 通过uid查找到上传前的文件，将地址，替换为上传后服务器端的地址
          this.fileList.forEach(item => {
            if (item.uid === file.uid) {
              item.url = `http://${data.Location}`
              // 通过该属性，来判断图片是否上传成功，以免图片未上传成功就提交信息
              item.upload = true
            }
          })
          setTimeout(() => {
            this.isShow = false
          }, 500)
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.complete{
  ::v-deep .el-upload--picture-card{
    display: none;
  }
}
</style>
