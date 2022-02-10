<template>
  <el-card>
    <el-header>
      <h1 v-if="$route.path === '/doorleaf/' + $route.params.id">編輯</h1>
      <h1 v-else>檢視</h1>
    </el-header>

    <el-form
      :model="dynamicValidateForm"
      ref="dynamicValidateForm"
      label-width="100px"
      class="demo-dynamic"
      style="margin-top:20px"
    >
      <el-form-item
        prop="specid"
        label-width=""
        label="產品規格"
        style="width:50%;"
      >
        <div>
          <el-input v-model="specid" disabled></el-input>
        </div>
      </el-form-item>
      <br />

      <el-form-item
        v-for="(domain, index) in dynamicValidateForm.domains"
        :label="'材料' + (index + 1)"
        :key="domain.materialid"
        :prop="'domains.' + index + '.value'"
      >
        <el-row>
          <el-col :span="4">
            <el-select
              v-model="domain.materialid"
              placeholder="請選擇"
              disabled
            >
              <el-option
                v-for="item in materialdata"
                :key="item.materialid"
                :label="item.materialid"
                :value="item.materialid"
              >
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="2">
            <div>用量</div>
          </el-col>

          <el-col :span="2">
            <div>
              <el-input v-model="domain.dosage" disabled></el-input>
            </div>
          </el-col>

          <el-col :span="2">
            <div>
              成本
            </div>
          </el-col>

          <el-col :span="2">
            <div>
              <el-input v-model="domain.cost" disabled></el-input>
            </div>
          </el-col>
          <el-col :span="2">
            <div>
              小計
            </div>
          </el-col>

          <el-col :span="3">
            <div>
              <el-input
                :value="domain.dosage * domain.cost"
                disabled
              ></el-input>
            </div>
          </el-col>

          <el-col :span="4">
            <div style="text-align:right">
              <el-button
                v-if="$route.path === '/doorleaf/' + $route.params.id"
                @click.prevent="removeDomain(domain)"
                >删除</el-button
              >
            </div>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          v-if="$route.path === '/doorleaf/' + $route.params.id"
          @click="submitForm('dynamicValidateForm')"
          >提交</el-button
        >
        <el-button
          @click="addDomain"
          v-if="$route.path === '/doorleaf/' + $route.params.id"
          >新增</el-button
        >
        <el-button
          v-if="$route.path === '/doorleaf/' + $route.params.id"
          @click="resetForm('dynamicValidateForm')"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <br />
    <el-button @click="$router.go(-1)">返回</el-button>
  </el-card>
</template>

<script>
export default {
  name: "DoorLeafView",
  data() {
    return {
      specid: "",
      datatable: {
        specid: "",
        specname: "",
        materialcosts: ""
      },
      materialdata: [
        {
          materialid: ""
        }
      ],
      dynamicValidateForm: {
        domains: []
      },
      value: ""
    };
  },

  methods: {
    total(domain) {
      console.log(domain);
      return domain.cost * domain.dosage;
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$message({
            message: "恭喜你，这是一條成功消息",
            type: "success"
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },

    addDomain() {
      console.log("OK");
      console.log(this.$route.path);
      this.dynamicValidateForm.domains.push({
        key: Date.now()
      });
    },

    //get api
    getspecname() {
      this.axios({
        method: "GET",
        url: `/materialcost/join/${this.$route.params.id}`
      })
        .then(res => {
          console.log(res);
          const spec = res.data;
          this.datatable = res.data;
          // this.dynamicValidateForm = res.data
          spec.forEach(element => {
            this.specid = element.specid;
            this.dynamicValidateForm.domains.push({
              materialid: element.materialid,
              cost: element.cost,
              dosage: element.dosage,
              total: element.total
            });
          });
        })
        .catch(err => {
          err;
        });
    },
    getmaterail() {
      this.axios({
        method: "GET",
        url: `/material`
      })
        .then(res => {
          console.log(res);
          this.materialdata = res.data;
        })
        .catch(err => {
          err;
        });
    },

    post() {
      const specname = {
        specname: this.specname
      };
      this.axios({
        method: "POST",
        url: `/specname`,
        data: specname
      })
        .then(res => {
          console.log(res, "success");
        })
        .catch(err => {
          err;
        });
    }
  },

  created() {
    this.getspecname();
    this.getmaterail();
  }
};
</script>

<style></style>
