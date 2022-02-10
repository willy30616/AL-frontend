<template>
  <div>

    <h1 style="text-align:center;">檢視報價單</h1>
    <el-card>
      <el-form label-width="80px" :model="custinfo" ref="custinfo">
        <el-row type="flex" justify="space-around">
          <el-col :span="10">
            <el-form-item label="報價單號:" prop="reportid">
              {{ postQuotateForm.reportid }}
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="報價日期:">
              {{ postQuotateForm.reportdate }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="space-around">
          <el-col :span="10">
            <el-form-item label="公司名稱:">
              {{ custinfo.customer }}
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item label="公司統編:">
              {{ custinfo.taxnumber }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="space-around">
          <el-col :span="10">
            <el-form-item label="聯絡人員:">
              {{ custinfo.contact }}
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item label="聯絡電話:">
              {{ custinfo.tel }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-around">
          <el-col :span="10">
            <el-form-item label="施工地址:">
              {{ postQuotateForm.workaddress }}
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="備註:">
              
              {{postQuotateForm.reportmark}}
            </el-form-item>
            </el-col>
        </el-row>
      </el-form>
    </el-card>
    <br />
    <el-card>
      <div>
        <!-- <el-button type="primary" @click="additem">新增產品</el-button> -->
        <el-header>
          <h1>編輯</h1>
        </el-header>

        <el-table border :data="dynamicValidateForm.domains">
          <el-table-column label="產品名稱">
            <template slot-scope="scope">
              <!-- <el-select value-key="prodid" v-model="scope.row.prodid" placeholder="請選擇">
                <el-option
                  v-for="item in product"
                  :key="item.prodid"
                  :label="item.prodid"
                  :value="item.prodid"
                >
                </el-option>
              </el-select> -->
              {{scope.row.prodid}}
            </template>
            
          </el-table-column>

          <el-table-column   label="產品成本(產品管理)" >
            <template slot-scope="scope">
              <el-input
              disabled
              placeholder="自動帶入"
              v-model="scope.row.prodprice"
            ></el-input>
            <h1 v-show="false">
              {{ (scope.row.prodprice = compute(scope.row)) }}
            </h1>
            </template>
          </el-table-column>

          <el-table-column label="安全係數" >
            <template slot-scope="scope">
              <!-- <el-input v-model="scope.row.coefficient"></el-input> -->
              {{scope.row.coefficient}}
            </template>
          </el-table-column>

          <el-table-column v-if="status" label="單價" prop="total">
            <template slot-scope="scope">
              <span v-if="isNaN(clcUnitPrice(scope.row))"></span>
              <span v-else>{{ clcUnitPrice(scope.row) }}</span>
              
            </template>
          </el-table-column>

          <el-table-column label="產品數量">
            <template slot-scope="scope">
              <!-- <el-input type="number" v-model="scope.row.prodcount"></el-input> -->
              {{scope.row.prodcount}}
            </template>
          </el-table-column>

          <el-table-column v-if="status" label="合計金額" prop="total">
            <template slot-scope="scope">
               <span v-if="isNaN(total(scope.row))"></span>
              <span v-else>{{ total(scope.row) }}</span>
              
            </template>
          </el-table-column>
 
          <!-- <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="removeDomain(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column> -->

        </el-table>

        <br />
        <!-- <el-button type="info" @click="submitForm('postQuotateForm')">提交</el-button>
        <el-button type="danger" @click="$router.go(-1)">取消</el-button> -->
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "QuotateEdit",
  data() {
    return {
      status:true,
      dynamicValidateForm: {
        domains: []
      },
      product: [],
      webreport: {},

      custinfo: {},
      postQuotateForm:{}
      
    };
  },
  created() {

    this.getcurrent();
    this.getProduct();
  },
  methods: {
    compute(val) {

      var price;
      this.product.forEach(element => {
        // console.log(element);
        if (val.prodid == element.prodid) {
          price = element.price;
        }
      });
      // console.log(price);
      return price;
    },




    submitForm() {
      
      var postProduct = [];
      this.dynamicValidateForm.domains.forEach(element => {
        postProduct.push({
          reportid: this.postQuotateForm.reportid,
          prodid: element.prodid,
          prodprice: element.prodprice,
          prodcount: element.prodcount,
          coefficient: element.coefficient,
          reportunitprice: element.prodprice * element.coefficient,
          reportprice:
            element.prodprice * element.coefficient * element.prodcount
        });
      });

      
       
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
          console.log(data);

          this.axios({
            url: `/customer/${this.custinfo.customerid}`,
            method: "put",
            data: data
          }).then(res => {
            res;
            
            if(res.status==200){
              this.$message({
                message: "編輯成功",
                type: "success"
              });
              this.$router.go(-1);
            }
          });
          
       
      
    },

    removeDomain(index, row) {
      row;
      this.dynamicValidateForm.domains.splice(index, 1);
    },

    total(row) {
      return Math.round(row.prodprice * row.coefficient) * row.prodcount;
    },

    total1(row) {
      
      return Math.round(row.prodid.prodprice * row.coefficient) * row.prodcount;
    },

    additem() {
      this.dynamicValidateForm.domains.push({
      
      });
    },

    clcUnitPrice(row) {
      // console.log(row)
      
      return Math.round(row.prodprice * row.coefficient);
    },
    clcUnitPrice1(row) {
      return Math.round(row.prodid.prodprice * row.coefficient);
    },

    getcurrent() {
      this.axios({
        url: `/reportdetailjoinall2/${this.$route.params.id}`
      }).then(res => {
        // this.info=res.data;
        console.log(res);
        var temp=[];
        res.data.forEach(element => {
          this.postQuotateForm = {
            reportid: element.reportid,
            reportdate: element.reportdate,
            workaddress: element.workaddress,
            reportmark:element.reportmark
          };
          this.custinfo = {
            customerid:element.customerid,
            customer: element.customer,
            taxnumber: element.taxnumber,
            contact: element.contact,
            tel: element.tel
        };
        temp.push({
          prodid:element.prodid,
          coefficient:element.coefficient,
          prodcount:element.prodcount
        })
        });
        console.log(temp);

        this.dynamicValidateForm.domains=temp;

        

        
        
      });
    },





    getProduct() {
      this.axios({
        url: "/prodspecprice"
      }).then(res => {
        res;
        // console.log(res);
        this.product = res.data;
      });
    }
  }
};
</script>

<style></style>
