<template>
  <el-tabs type="border-card">
    <el-tab-pane label="材料種類設定">
      <materialCategory />
    </el-tab-pane>
    <!-- <el-tab-pane label="扇開向係數"><door-cofficent /></el-tab-pane> -->
    <!-- <el-tab-pane label="尺寸係數"><size-cofficent /></el-tab-pane> -->
  </el-tabs>
</template>

<script>
import materialCategory from "./MaterialCategory/MaterialCategory.vue";

export default {
  components: {
    materialCategory
  },
  data() {
    return {
      ruleForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "請輸入客戶名稱",
            trigger: "blur"
          }
        ],
        address: [{ required: true, message: "請輸入地址", trigger: "blur" }],
        contact: [{ required: true }],
        phone: [{ required: true }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style>
.el-main {
  text-align: left;
}
.el-form-item {
  margin: 10px 20px;
}
#btn {
  text-align: right;
}
</style>
