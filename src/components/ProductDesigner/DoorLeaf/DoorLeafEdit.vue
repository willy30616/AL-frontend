<template>
  <el-card>
    <div>
      <el-button type="primary" @click="additem">新增材料</el-button>

      <el-header>
        <h1>編輯門扇:{{ $route.params.id }}</h1>
      </el-header>

      <el-table :data="dynamicValidateForm.domains" border height="602">
        <el-table-column label="材料">
          <template slot-scope="scope">
            <el-select v-model="scope.row.materialid" placeholder="請選擇">
              <el-option
                v-for="item in materialdata"
                :key="item.materialid"
                :label="item.materialid"
                :value="item.materialid"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="用量">
          <template slot-scope="scope">
            <el-input v-model="scope.row.dosage"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="成本">
          <template slot-scope="scope" prop="cost">
            <el-input
              disabled
              placeholder="自動帶入"
              v-model="scope.row.cost"
            ></el-input>
            <h1 v-show="0">
              {{ (scope.row.cost = compute(scope.row)) }}
            </h1>
          </template>
        </el-table-column>

        <el-table-column label="小計" prop="total">
          <template slot-scope="scope">
            <span v-if="isNaN(computetotal(scope.row))"></span>
            <span v-else>{{ computetotal(scope.row) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="removeDomain(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-alert
        title="※如果不進行編輯按返回即可※"
        type="warning"
        :closable="false"
      ></el-alert>
    </div>
    <br />
    <el-button type="primary" @click="submitForm">確認</el-button>
    <el-button @click="$router.go(-1)">返回</el-button>
  </el-card>
</template>

<script>
export default {
  name: "DoorLeadfEdit",
  data() {
    return {
      specid: "",
      datatable: {
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
    compute(val) {
      // console.log(val);
      // return val;
      var cost;
      this.materialdata.forEach(element => {
        if (val.materialid == element.materialid) {
          cost = element.cost;
        }
      });
      return cost;
    },

    computetotal(val) {
      return val.cost * val.dosage;
    },

    additem() {
      this.dynamicValidateForm.domains.push({});
    },

    total(domain) {
      console.log(domain);
      return domain.cost * domain.dosage;
    },

    //提交確認
    submitForm() {
      this.post();
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    removeDomain(item) {
      console.log(item);
      var data = [];
      data.push({
        materialid: item.materialid,
        specid: item.specid
      });

      this.$confirm("此操作將永久刪除該筆資料, 是否繼續?", "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        if (res == "confirm") {
          this.axios({
            url: "/materialcost/deleteall",
            method: "delete",
            data: data
          }).then(res => {
            if (res.status == 204) {
              var index = this.dynamicValidateForm.domains.indexOf(item);
              if (index !== -1) {
                this.dynamicValidateForm.domains.splice(index, 1);
              }
              const h = this.$createElement;
              this.$message({
                message: h("p", null, [
                  h("span", null, "該筆資料 "),
                  h("i", { style: "color: teal" }, "已成功刪除")
                ])
              });
            }
          });
        }
      });
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
        url: `/specname/${this.$route.params.id}`
      })
        .then(res => {
          // console.log(res);
          const spec = res.data;
          this.datatable = res.data;
          // this.dynamicValidateForm = res.data
          spec.materialcosts.forEach(element => {
            // console.log(element);
            this.dynamicValidateForm.domains.push({
              materialid: element.materialid,
              specid: element.specid,
              cost: element.cost,
              dosage: element.dosage,
              total: element.total
            });

            this.specid = this.$route.params.id;
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
          // console.log(res);
          this.materialdata = res.data;
        })
        .catch(err => {
          err;
        });
    },

    post() {
      var array = [];
      this.dynamicValidateForm.domains.forEach(element => {
        array.push({
          materialid: element.materialid,
          specid: this.specid,
          cost: element.cost,
          dosage: element.dosage,
          total: element.cost * element.dosage,
          doorjudge: "門扇"
        });
      });

      const data = {
        specid: this.specid,
        materialcosts: array,
        doorinfofks: {
          doorinfoid: 1,
          doorinfo: "門扇"
        }
      };
      console.log(data);

      this.axios({
        method: "PUT",
        url: `/specname/${this.$route.params.id}`,
        data: data
      })
        .then(res => {
          console.log(res, "success");
          this.$router.go(-1);
          this.$message({
            message: "成功新增一筆資料",
            type: "success"
          });
        })
        .catch(err => {
          console.log(err, "error");
          this.$message.error("新增資料異常");
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
