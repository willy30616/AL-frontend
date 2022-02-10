<template>
  <div>
    <el-card style="width: 100%">
      <div style="width: 100%">
        <!--新增客戶按鈕  -->
        <div
          style="text-align: left;
                  width: 100%; 
                  display: inline-flex;  
                  align-items:center"
        >
          <el-button
            style="height: 40px"
            type="success"
            icon="el-icon-plus"
            @click="handleAdd"
            >新增客戶</el-button
          >
          <h1
            style="width:100% ;
        text-align: center;"
          >
            <i class="el-icon-s-custom"></i> 客戶管理
          </h1>
        </div>
        <br />

        <!-- 客戶表內容 -->
        <el-table
          :data="pagedTableData"
          :header-cell-style="headClass"
          :cell-style="rowClass"
          style="width: 100% "
          height="500"
          stripe
          border
          resizable
          fit
        >
          <el-table-column label="客戶編號" prop="customerid" width="120">
          </el-table-column>
          <el-table-column label="客戶名稱" prop="customer" width="150">
          </el-table-column>
          <el-table-column label="統一編號" prop="taxnumber"> </el-table-column>
          <el-table-column label="客戶地址" prop="address" fit="true">
          </el-table-column>
          <el-table-column label="客戶電話" prop="tel"> </el-table-column>
          <el-table-column label="客戶傳真" prop="fax"> </el-table-column>
          <el-table-column label="聯絡人員" prop="contact"> </el-table-column>
          <el-table-column label="操作" align="right" width="200px">
            <!-- 作用域插槽 -->
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="showEditDialog(scope.row)"
                >編輯</el-button
              >
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                >刪除</el-button
              >
            </template>
            <router-view />
          </el-table-column>
        </el-table>

        <!-- 分頁 -->
        <el-pagination
          layout="prev, pager, next"
          :total="this.tableData.length"
          @current-change="setPage"
          :page-size="pageSize"
        >
        </el-pagination>
      </div>

      <!--Add新增使用者的對話方塊-->
      <el-dialog
        title="新增使用者"
        :visible.sync="addDialogVisible"
        width="35%"
        @close="addDialogClosed"
        top="10vh"
      >
        <!--內容主體區域-->
        <el-form
          :model="userForm"
          ref="userForm"
          label-width="80px"
          :rules="rules"
        >
          <el-form-item label="客戶名稱" prop="customer">
            <el-input v-model="userForm.customer"></el-input>
          </el-form-item>
          <el-form-item label="統一編號" prop="taxnumber">
            <el-input v-model="userForm.taxnumber" type="number"></el-input>
          </el-form-item>
          <el-form-item label="客戶地址" prop="address">
            <el-input v-model="userForm.address"></el-input>
          </el-form-item>
          <el-form-item label="客戶電話" prop="tel">
            <el-input v-model="userForm.tel"></el-input>
          </el-form-item>
          <el-form-item label="客戶傳真" prop="fax">
            <el-input v-model="userForm.fax"></el-input>
          </el-form-item>
          <el-form-item label="聯絡人員" prop="contact">
            <el-input v-model="userForm.contact"></el-input>
          </el-form-item>
        </el-form>
        <!--底部按鈕區域-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="warning" @click="resetForm('userForm')"
            >重置</el-button
          >
          <el-button type="primary" @click="submitForm('userForm')"
            >確 定</el-button
          >
        </span>
      </el-dialog>

      <!--Edit修改使用者的對話方塊-->
      <el-dialog
        title="修改使用者"
        :visible.sync="editDialogVisible"
        width="50%"
        top="10vh"
      >
        <!--內容主體區域-->
        <el-form
          :model="editeItem"
          ref="editeItem"
          label-width="100px"
          :rules="rules"
        >
          <el-form-item label="客戶編號" prop="customerid">
            <el-input v-model="editeItem.customerid" disabled></el-input>
          </el-form-item>
          <el-form-item label="客戶名稱" prop="customer">
            <el-input v-model="editeItem.customer"></el-input>
          </el-form-item>
          <el-form-item label="統一編號" prop="taxnumber">
            <el-input v-model="editeItem.taxnumber"></el-input>
          </el-form-item>
          <el-form-item label="客戶地址" prop="address">
            <el-input v-model="editeItem.address"></el-input>
          </el-form-item>
          <el-form-item label="客戶電話">
            <el-input
              v-model="editeItem.tel"
              type="number"
              @keydown.native="channelInputLimit"
            ></el-input>
          </el-form-item>
          <el-form-item label="客戶傳真" prop="fax">
            <el-input v-model="editeItem.fax"></el-input>
          </el-form-item>
          <el-form-item label="聯絡人員" prop="contact">
            <el-input v-model="editeItem.contact"></el-input>
          </el-form-item>
        </el-form>
        <!--底部按鈕區域-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser('editeItem')"
            >確 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Cust",
  created() {
    this.GetCustApi();
  },
  computed: {
    pagedTableData() {
      return this.tableData.slice(
        this.pageSize * this.page - this.pageSize,
        this.pageSize * this.page
      );
    }
  },
  data() {
    return {
      editIndex: -1,
      addDialogVisible: false, // 控制新增使用者對話方塊是否顯示
      editDialogVisible: false, // 控制編輯使用者對話方塊是否顯示
      dialogDelete: false,
      tableData: [
        {
          customerid: "1",
          customer: "凱德資訊有限公司",
          taxnumber: "8447116",
          address: "台中市漢翔路518號",
          tel: "0427070621",
          fax: "0427070677",
          contact: "陳董事"
        },
        {
          customerid: "2",
          customer: "凱德資訊有限公司",
          taxnumber: "8447116",
          address: "台中市漢翔路518號",
          tel: "0427070621",
          fax: "0427070677",
          contact: "陳董事"
        }
      ],
      // 新增表單
      userForm: {},
      //編輯表單
      editeItem: {
        customerid: "",
        customer: "",
        taxnumber: "",
        address: "",
        tel: "",
        fax: "",
        contact: ""
      },

      get: [],
      list: [],
      page: 1,
      pageSize: 10,
      rules: {
        customer: [
          { required: true, message: "請輸入客戶名稱", trigger: "change" }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
        ],
        taxnumber: [
          {
            required: false,
            min: 8,
            max: 8,
            message: "統一編號8碼",
            trigger: "change"
          }
        ],
        tel: [
          {
            required: false,
            min: 10,
            max: 10,
            message: "電話10碼",
            trigger: "change"
          }
        ],
        tex: [
          {
            required: false,
            min: 10,
            max: 10,
            message: "傳真10碼",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    //驗證數字input
    channelInputLimit(e) {
      let key = e.key;
      // 不允许输入'e'和'.'
      if (key === "e" || key === ".") {
        e.returnValue = false;
        return false;
      }
      return true;
    },
    //表內容物居中
    rowClass() {
      return "text-align:center";
    },
    //表頭居中
    headClass() {
      return "text-align:center";
    },
    //分頁
    setPage(val) {
      this.page = val;
    },

    //編輯客戶
    showEditDialog(custinfo) {
      console.log(custinfo);
      this.editDialogVisible = true;
      this.editIndex = this.tableData.indexOf(custinfo);
      this.editeItem = Object.assign({}, custinfo);
      console.log(this.editeItem);
    },

    //編輯確認
    editUser(editform) {
      // console.log(this.$refs[editform]);
      this.$refs[editform].validate(valid => {
        if (valid) {
          this.editDialogVisible = false;
          this.putcustapi(this.editeItem.customerid);
          Object.assign(this.tableData[this.editIndex], this.editeItem);
          console.log(this.userForm.customerid);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //新增表單驗證
    submitForm(formName) {
      console.log(this.$refs[formName]);
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert('submit!');
          this.postcustapi();
          this.$message.success({
            message: "新增成功!"
          });
          // this.$swal.fire("新增成功!", "", "success");

          // this.addDialogVisible = false;
        } else {
          this.$message.error({
            message: "刪除失敗"
          });
          console.log("error submit!!");
          return false;
        }
      });
    },

    //Delete API
    //客戶刪除
    async handleDelete(row) {
      // 彈框 詢問使用者是否刪除
      const a = this.tableData.indexOf(row);
      if (a > -1) {
        // console.log(a);
        // console.log(row);
        const confirmResult = await this.$confirm(
          "此操作將永久刪除該客戶, 是否繼續?",
          "提示",
          {
            confirmButtonText: "確定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).catch(err => err);
        // 如果使用者確認刪除，則返回值為字串 confirm
        // 如果使用者取消刪除，則返回值為字串 cancel
        // console.log(confirmResult)
        if (confirmResult == "confirm") {
          //刪除使用者

          this.axios({
            url: `/customer/${row.customerid}`,
            method: "delete"
          })
            .then(res => {
              // this.$swal.fire("刪除成功!", "", "success");
              this.$message.success({
                message: "刪除成功!"
              });
              console.log(res);
              this.tableData.splice(a, 1);
            })
            .catch(err => {
              this.$message.error({
                message: "刪除失敗，報價單可能有該筆資料"
              });
              console.log(err);
            });
        }
      }
    },

    //開啟新增dialog
    handleAdd() {
      this.addDialogVisible = true;
    },

    //關閉新增dialog
    addDialogClosed() {
      console.log("OK");
      this.userForm = {};
    },

    //重置按鈕
    resetForm(userForm) {
      this.$refs[userForm].resetFields();
    },

    //GET API請求
    GetCustApi() {
      // this.axios.get("http://192.168.0.223:5000/aluminum/public/api/customer")
      // this.axios.get("public/api/customer")
      // this.axios.get("http://localhost:8085/aluminum/public/api/customer")
      this.axios
        .get("/customer")
        .then(response => {
          // const x = response;
          // this.tableData = response.data;
          // response.data.forEach(element => {
          //   this.get.push({
          //     id: element.id,
          //     name: element.title,
          //     desc: element.body,
          //   })
          // });
          // this.tableData = this.get;

          this.tableData = response.data;
          // console.log(this.tableData)
          // console.log(this.tableData);
        })
        .catch(err => {
          // console.log(err)
          err;
          // this.$message.error("修改使用者失敗");
          // console.log(error);
        });
    },

    //POST API請求
    postcustapi() {
      this.axios({
        method: "post",
        url: "/customer",
        data: this.userForm
      })
        .then(res => {
          console.log(res);
          // var test = {
          //   customer: this.userForm.customer,
          //   taxnumber: this.userForm.taxnumber,
          //   address: this.userForm.address,
          //   tel: this.userForm.tel,
          //   fax: this.userForm.fax,
          //   contact: this.userForm.contact,
          // }
          this.tableData.push(this.userForm);
          this.addDialogVisible = false;
          this.addDialogClosed();
        })
        .catch(err => {
          err;
          // console.log(err);
        });
    },

    //PUT API請求
    putcustapi(id) {
      this.axios
        .put(`/customer/${id}`, this.editeItem)
        // this.axios.put(`http://192.168.0.223:5000/aluminum/public/api/customer/${id}`, this.editeItem)
        .then(response => {
          if (response.status == 200) {
            console.log("put成功");
            // console.log(response);
            // this.tableData.push(this.editeItem);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
/* input type number without arrow */
// input::-webkit-outer-spin-button,
// input::-webkit-inner-spin-button {
//   -webkit-appearance: none;
//   margin: 0;
// }
</style>
