<template>
  <div>
    <h1 style="text-align:center;">新增報價單</h1>
    <el-card>
      <el-form
        label-width="80px"
        :model="postQuotateForm"
        ref="postQuotateForm"
      >
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="10">
            <el-form-item label="報價單號:">
              <el-input v-model="postQuotateForm.reportid"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="報價日期">
              <el-date-picker
                type="date"
                placeholder="選擇日期"
                style="width: 100%;"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                v-model="postQuotateForm.reportdate"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="10">
            <el-form-item label="公司名稱:">
              <el-select
                value-key="customerid"
                v-model="custinfo"
                placeholder="選擇公司名稱"
                style="display: block;"
              >
                <el-option
                  v-for="item in cust"
                  :key="item.customerid"
                  :label="item.customer"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item label="公司統編:">
              <el-input v-model="custinfo.taxnumber" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="10">
            <el-form-item label="聯絡人員:">
              <el-input v-model="custinfo.contact" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="聯絡電話:">
              <el-input v-model="custinfo.tel" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="10">
            <el-form-item label="施工地址:">
              <el-input v-model="postQuotateForm.workaddress"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="備註:">
              <el-input v-model="postQuotateForm.reportmark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <br />

    <el-card>
      <div>
        <el-button type="primary" @click="additem()">新增產品</el-button>

        <el-header style="text-align:center;">
          <h1>新增</h1>
        </el-header>

        <el-table border :data="dynamicValidateForm.domains">
          <el-table-column label="產品名稱">
            <template slot-scope="scope">
              <el-select
                value-key="prodid"
                v-model="scope.row.prodid"
                placeholder="請選擇"
              >
                <el-option
                  v-for="item in product"
                  :key="item.prodid"
                  :label="item.prodid"
                  :value="item"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="產品成本(產品管理)" prop="prodid.price">
          </el-table-column>

          <el-table-column label="安全係數">
            <template slot-scope="scope">
              <el-input v-model="scope.row.coefficient"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="單價" prop="total">
            <template slot-scope="scope">
              <span v-if="isNaN(clcUnitPrice(scope.row))"></span>
              <span v-else>{{ clcUnitPrice(scope.row) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="產品數量">
            <template slot-scope="scope">
              <el-input v-model="scope.row.prodcount" type="number"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="合計金額" prop="total">
            <template slot-scope="scope">
              <span v-if="isNaN(total(scope.row))"></span>
              <span v-else>{{ total(scope.row) }}</span>
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

        <br />
        <el-button type="primary" @click="submitForm('postQuotateForm')"
          >提交</el-button
        >
        <el-button @click="$router.go(-1)">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "QuotateAdd",
  data() {
    return {
      form: {},
      dynamicValidateForm: {
        domains: []
      },
      product: "",
      prodinfo: "",
      cust: {},
      custinfo: "",
      postQuotateForm: {}
    };
  },
  created() {
    this.getCustomer();
    this.getProduct();
    this.getReportCount();
  },
  methods: {
    clcUnitPrice(row) {
      // console.log(row);
      return Math.round(row.prodid.price * row.coefficient);
    },

    getReportCount() {
      this.axios({
        url: "/webreportcount",
        method: "get"
      }).then(res => {
        // console.log(res.data[0].count);
        var count = res.data[0].count + 1;
        var a = new Date();
        console.log(a.getFullYear());
        var year = a.getFullYear();
        console.log(a.getMonth() + 1);
        var month = a.getMonth() + 1;
        var date = a.getDate().toString();
        console.log(date.padStart(2, "0"));
        console.log(count.toString().padStart(3, "0"));
        console.log(
          "Q" +
            year.toString() +
            month.toString() +
            date.padStart(2, "0") +
            count.toString().padStart(3, "0")
        );
        var reportid =
          "Q" +
          year.toString() +
          month.toString() +
          date.padStart(2, "0") +
          count.toString().padStart(3, "0");
        var reportdate =
          year.toString() +
          "-" +
          month.toString() +
          "-" +
          date.padStart(2, "0");
        this.postQuotateForm.reportid = reportid;
        this.postQuotateForm.reportdate = reportdate;
      });
    },

    total(row) {
      return Math.round(row.prodid.price * row.coefficient) * row.prodcount;
    },

    additem() {
      this.dynamicValidateForm.domains.push({
        prodid: ""
      });
    },

    removeDomain(index, row) {
      row;
      this.dynamicValidateForm.domains.splice(index, 1);
    },

    submitForm(form) {
      var postProduct = [];
      this.dynamicValidateForm.domains.forEach(element => {
        postProduct.push({
          reportid: this.postQuotateForm.reportid,
          prodid: element.prodid.prodid,
          prodprice: element.prodid.price,
          prodcount: element.prodcount,
          coefficient: element.coefficient,
          reportunitprice: element.prodid.price * element.coefficient,
          reportprice:
            element.prodid.price * element.coefficient * element.prodcount
        });
      });

      this.$refs[form].validate(valid => {
        if (valid) {
          var data = {
            customerid: this.custinfo.customerid,
            customer: this.custinfo.customer,
            title: null,
            address: this.custinfo.address,
            tel: this.custinfo.tel,
            fax: this.custinfo.fax,
            contact: this.custinfo.contact,
            cellphone: this.custinfo.cellphone,
            taxnumber: this.custinfo.taxnumber,
            webReports: [
              {
                reportid: this.postQuotateForm.reportid,
                reportdate: this.postQuotateForm.reportdate,
                workaddress: this.postQuotateForm.workaddress,
                reportmark: this.postQuotateForm.reportmark,
                reportDetails: postProduct
              }
            ]
          };

          this.axios({
            url: `/customer/${this.custinfo.customerid}`,
            method: "put",
            data: data
          })
            .then(res => {
              res;
              this.$router.go(-1);
              this.$message({
                message: "成功新增一筆資料",
                type: "success"
              });
            })
            .catch(err => {
              console.log(err);
              this.$message.error("錯了哦，這是一條錯誤消息");
            });
        } else {
          // console.log("error submit!!");
          this.$message.error("錯了哦，這是一條錯誤消息");
          // return false;
        }
      });
    },

    getCustomer() {
      this.axios({
        url: "/customer"
      }).then(res => {
        res;
        // console.log(res);
        this.cust = res.data;
        // console.log(this.cust);
      });
    },

    getProduct() {
      this.axios({
        url: "/prodspecprice"
      }).then(res => {
        res;
        // console.log(res);
        this.product = res.data;
        // console.log(this.product);
      });
    }
  }
};
</script>

<style></style>
