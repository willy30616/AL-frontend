<template>
  <el-card>
    <div>
      <el-form
        :model="doorleaf"
        :rules="rules"
        ref="doorleaf"
        @submit.native.prevent
      >
        <el-row style="margin-bottom: 20px">
          <!-- <el-col :span="5"> </el-col> -->

          <el-col :span="7">
            <el-form-item label="門扇名稱:" label-width="100px" prop="specid">
              <el-input
                placeholder="請輸入門扇名稱"
                v-model="doorleaf.specid"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-header>
        新增門扇
      </el-header>

      <el-table :data="dynamicValidateForm.domains" border>
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
              @click="removeDomain(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <br />
    <el-alert
      title="※材料請勿重複輸入，否則新增資料失敗※"
      type="warning"
      :closable="false"
      style="margin-bottom:20px"
    ></el-alert>
    <el-button type="warning" @click="additem">新增材料</el-button>
    <el-button type="primary" @click="submitForm('doorleaf')">確認</el-button>
    <el-button @click="$router.go(-1)">返回</el-button>
  </el-card>
</template>

<script>
export default {
  name: "DoorLeadfEdit",
  data() {
    return {
      specid: "",
      doorleaf: {
        specid: ""
      },
      datatable: {
        materialcosts: ""
      },
      materialdata: [
        {
          materialid: ""
        }
      ],
      dynamicValidateForm: {
        domains: [{}]
      },
      rules: {
        specid: [
          {
            required: true,
            message: "請輸入門扇名稱",
            trigger: "blur"
          }
        ]
      }
    };
  },

  methods: {
    compute(val) {
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
      return domain.cost * domain.dosage;
    },

    //提交確認
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.post();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //刪除列
    removeDomain(index, row) {
      row;
      this.dynamicValidateForm.domains.splice(index, 1);
    },

    //get SpecName API
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
          this.materialdata = res.data;
          // console.log(res.data);
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
          specid: this.doorleaf.specid,
          cost: element.cost,
          dosage: element.dosage,
          total: element.cost * element.dosage,
          doorjudge: "門扇"
        });
      });

      const data = {
        specid: this.doorleaf.specid,
        materialcosts: array,
        doorinfofks: {
          doorinfoid: 1,
          doorinfo: "門扇"
        }
      };
      console.log(data);

      this.axios({
        method: "POST",
        url: `/specname`,
        data: data
      })
        .then(res => {
          console.log("我在這", res);
          if (res.status == 204) {
            this.$message.error("重複使用產品規格名稱或該名稱已存在");
          } else {
            console.log(res, "success");
            this.$router.go(-1);
            this.$message({
              message: "成功新增一筆資料",
              type: "success"
            });
          }
        })
        .catch(err => {
          console.log(err, "error");
          this.$message.error("錯了哦，這是一條錯誤消息");
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
