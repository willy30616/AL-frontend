<template>
  <div>
    <h1>新增產品</h1>
    <el-card>
      <el-form :model="prodform" ref="prodform" :rules="rules">
        <el-form-item label="產品編號" label-width="100px" prop="prodid">
          <el-input v-model="prodform.prodid"> </el-input>
        </el-form-item>

        <el-card style="margin-bottom:20px">
          <el-button type="primary" @click="addFrame()">新增門框</el-button>

          <el-table border :data="dynamicValidateForm.domains">
            <el-table-column label="門框名稱">
              <template slot-scope="scope">
                <el-select
                  value-key="specid"
                  v-model="scope.row.specid"
                  placeholder="請選擇"
                >
                  <el-option
                    v-for="item in frame"
                    :key="item.specid"
                    :label="item.specid"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column label="門框成本" prop="specid.totalprice">
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="removeFrame(scope.$index, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-form-item label="成本計價 : " label-width="100px">
            <span v-if="isNaN(plusFrame)"></span>
            <span v-else> {{ plusFrame }}</span>
          </el-form-item>
        </el-card>
        <el-alert
          title="※材料請勿重複輸入，否則新增資料失敗※"
          type="warning"
          :closable="false"
          style="margin-bottom:20px"
        ></el-alert>
        <el-card style="margin-bottom:20px">
          <el-button type="primary" @click="addDoorleaf()">新增門扇</el-button>

          <el-table border :data="dynamicValidateForm1.domains">
            <el-table-column label="門扇名稱">
              <template slot-scope="scope">
                <el-select
                  value-key="specid"
                  v-model="scope.row.specid"
                  placeholder="請選擇"
                >
                  <el-option
                    v-for="item in doorleaf"
                    :key="item.specid"
                    :label="item.specid"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column label="門扇成本" prop="specid.totalprice">
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="removeDoorleaf(scope.$index, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-form-item label="成本計價 : " label-width="100px">
            <span v-if="isNaN(plusDoorleaf)"></span>
            <span v-else> {{ plusDoorleaf }}</span>
          </el-form-item>
        </el-card>

        <!-- <el-form-item label="產品數量" label-width="100px" prop="prodnum">
          <el-input v-model="prodform.prodnum"> </el-input>
        </el-form-item> -->
        <el-form-item label="產品備註" label-width="100px" prop="prodmark">
          <el-input v-model="prodform.prodmark"> </el-input>
        </el-form-item>
        <el-form-item label="安全係數" label-width="100px" prop="coefficient">
          <el-input v-model="prodform.coefficient"> </el-input>
        </el-form-item>
        <el-alert
          title="※成本計價 = (門框 + 門扇)※"
          type="warning"
          :closable="false"
        ></el-alert>
        <el-form-item label="成本計價" label-width="100px">
          <span v-if="isNaN(plus)"></span>
          <span v-else>{{ plusFrame }} + {{ plusDoorleaf }} = {{ plus }}</span>
        </el-form-item>
        <el-alert
          title="※成本單價 = (成本計價 * 安全係數)※"
          type="warning"
          :closable="false"
        ></el-alert>
        <el-form-item label="成本單價" label-width="100px">
          <span v-if="isNaN(clc)"></span>
          <span v-else>{{ clc }}</span>
        </el-form-item>
      </el-form>

      <!-- <el-button type="warning" @click="resetForm">重置</el-button> -->
      <el-button @click="$router.go(-1)">返回</el-button>
      <el-button type="primary" @click="submitForm('prodform')">確定</el-button>
      <!-- <el-button @click="clcFrame">test</el-button> -->
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getFrame();
    this.getDoorLeaf();
  },
  computed: {
    clc() {
      return this.plus * this.prodform.coefficient;
    },
    plus() {
      return this.plusFrame + this.plusDoorleaf;
    },
    plusFrame() {
      return this.clcFrame();
    },
    plusDoorleaf() {
      return this.clcDoorleaf();
    }
  },
  data() {
    return {
      frame: "",
      doorleaf: "",
      selectframe: "",
      selectdoorleaf: "",
      prodform: {
        prodid: ""
      },
      dynamicValidateForm: {
        domains: []
      },
      dynamicValidateForm1: {
        domains: []
      },
      rules: {
        prodid: [
          { required: true, message: "請輸入產品編號", trigger: "blur" }
        ],
        prodnum: [
          { required: true, message: "請輸入產品數量", trigger: "blur" }
        ],
        coefficient: [
          { required: true, message: "請輸入係數", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    addFrame() {
      this.dynamicValidateForm.domains.push({
        specid: ""
      });
    },

    clcFrame() {
      var framePrice = 0;
      this.dynamicValidateForm.domains.forEach(element => {
        // console.log(element.specid.totalprice);
        // console.log(framePrice);
        framePrice = framePrice + element.specid.totalprice;
        // console.log(framePrice);
      });
      // console.log(framePrice);
      return framePrice;
    },
    clcDoorleaf() {
      var doorleafPrice = 0;
      this.dynamicValidateForm1.domains.forEach(element => {
        // console.log(element.specid.totalprice);
        // console.log(doorleafPrice);
        doorleafPrice = doorleafPrice + element.specid.totalprice;
        // console.log(doorleafPrice);
      });
      // console.log(doorleafPrice);
      return doorleafPrice;
    },

    addDoorleaf() {
      this.dynamicValidateForm1.domains.push({
        specid: ""
      });
    },
    removeFrame(index, row) {
      row;
      this.dynamicValidateForm.domains.splice(index, 1);
    },
    removeDoorleaf(index, row) {
      row;
      this.dynamicValidateForm1.domains.splice(index, 1);
    },
    getFrame() {
      this.$axios({
        url: "/frameprice",
        method: "get"
      }).then(res => {
        // console.log(res);
        this.frame = res.data;
      });
    },
    getDoorLeaf() {
      this.$axios({
        url: "/doorleafprice",
        method: "get"
      }).then(res => {
        // console.log(res);
        this.doorleaf = res.data;
      });
    },
    postProd() {
      var prodspec = [];
      this.dynamicValidateForm.domains.forEach(element => {
        prodspec.push({
          prodid: this.prodform.prodid,
          specid: element.specid.specid,
          coefficient: this.prodform.coefficient,
          price: element.specid.totalprice
        });
      });
      this.dynamicValidateForm1.domains.forEach(element => {
        prodspec.push({
          prodid: this.prodform.prodid,
          specid: element.specid.specid,
          coefficient: this.prodform.coefficient,
          price: element.specid.totalprice
        });
      });

      var data = {
        prodid: this.prodform.prodid,
        prodmark: this.prodform.prodmark,

        prodspecs: prodspec
      };
      console.log(data);
      this.$axios({
        url: "/product",
        method: "post",
        data: data
      }).then(res => {
        res;
        console.log(res);
        if (res.status == 201) {
          this.$message({
            message: "成功新增一筆資料",
            type: "success"
          });

          this.$router.go(-1);
        } else if (res.status == 204) {
          this.$message.error({
            message: "重複的產品名稱"
          });
        }
      });
    },
    resetForm() {
      this.prodform.prodid = "";
      this.prodform.prodnum = "";
      this.prodform.prodmark = "";
      this.prodform.coefficient = "";
      this.selectdoorleaf = "";
      this.selectframe = "";
    },
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.postProd();
        } else {
          console.log("error submit");
        }
      });
    }
  }
};
</script>

<style></style>
