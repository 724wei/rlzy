<template>
  <div>
    <el-card class="page-tools">
      <el-row type="flex">
        <el-col>
          <div v-if="$slots.before" class="before">
            <i class="el-icon-info" />
            <slot name="before" />
          </div>
        </el-col>
        <el-row type="flex" justify="end">
          <slot name="after" />
          <!--          <el-button size="mini" type="primary">导入</el-button>-->
          <!--          <el-button size="mini" type="danger">导出</el-button>-->
          <!--          <el-button size="mini" type="warning">新增员工</el-button>-->
        </el-row>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="scss">
.page-tools {
  margin: 10px 0;
  .before {
    line-height: 34px;
    i {
      margin-right: 5px;
      color: #409eff;
    }
    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
}
</style>
