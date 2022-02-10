<template>
  <!-- <el-container> -->

  <div>
    <div class="input-group" slot="header">
      <el-input
        v-model="search"
        widht=""
        type=""
        class="ob-search-input ob-shadow search-input mr-3"
        id=""
        placeholder="請輸入材料名稱"
        style="margin-bottom:20px"
      />
    </div>
    <el-card style="width: 100%">
      <!--新增按鈕  -->
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
          @click="editDialog"
          >新增材料</el-button
        >
        <h1
          style="width:100% ;
        text-align: center;"
        >
          <i class="bi bi-plus-square"></i>材料設定
        </h1>
      </div>

      <br />

      <!-- 表內容 -->
      <el-table
        :data="
          pagedTableData.filter(
            data =>
              !search ||
              data.materialid.toLowerCase().includes(search.toLowerCase())
          )
        "
        style="width: 100%"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        height="459"
        border
        resizable
        stripe
        fit
        fixed
      >
        <el-table-column label="序" type="index"> </el-table-column>

        <el-table-column prop="materialid" label="材料名稱"> </el-table-column>
        <el-table-column prop="category" label="材料種類"> </el-table-column>
        <el-table-column prop="coefficient" label="材料係數"> </el-table-column>

        <el-table-column prop="cost" label="成本"> </el-table-column>
        <el-table-column prop="unitprice" label="材料單價"> </el-table-column>
        <el-table-column prop="memo" label="材料備註"> </el-table-column>

        <el-table-column label="操作" width="100px">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editDialog(scope.row)"
              >編輯</el-button
            >
            <br />
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteDialog(scope.row)"
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
    </el-card>

    <!-- Edit編輯材料的對話方塊 -->
    <el-dialog
      :title="title"
      width="35%"
      :visible.sync="editDialogVisible"
      top="10vh"
    >
      <el-form>
        <el-form-item label="材料名稱" prop="materialid" label-width="100px">
          <div v-if="this.editIndex > -1">
            <el-input disabled v-model="editform.materialid"></el-input>
          </div>
          <div v-else>
            <el-input v-model="editform.materialid"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="材料種類" prop="category" label-width="100px">
          <!-- <el-input v-model="editform.category"></el-input> -->
          <el-select
            value-key="materialcategoryid"
            v-model="editform.category"
            placeholder="請選擇"
            style="display:block"
          >
            <el-option
              v-for="item in category"
              :key="item.materialcategoryid"
              :label="item.category"
              :value="item.category"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="材料係數" prop="coefficient" label-width="100px">
          <el-input v-model="editform.coefficient"></el-input>
        </el-form-item>

        <el-form-item label="成本" prop="cost" label-width="100px">
          <el-input v-model="editform.cost"></el-input>
        </el-form-item>

        <el-form-item label="材料單價" prop="unitprice" label-width="100px">
          <!-- <el-input v-model="clcVal"></el-input> -->
          <span v-if="isNaN(clcVal)"></span>
          <span v-else>{{ clcVal }}</span>
        </el-form-item>

        <el-form-item label="材料備註" prop="memo" label-width="100px">
          <el-input v-model="editform.memo"></el-input>
        </el-form-item>
      </el-form>

      <!--底部按鈕區域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          v-if="this.editIndex == -1"
          type="warning"
          @click="editform = {}"
          >重置</el-button
        >
        <el-button type="primary" @click="postmeterialapi">確 定</el-button>
      </span>
    </el-dialog>
  </div>
  <!-- </el-container> -->
</template>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

<script>
export default {
  name: "Material",
  data() {
    return {
      editIndex: -1,
      editDialogVisible: false, // 控制編輯材料對話方塊是否顯示
      tableData: [],
      page: 1,
      pageSize: 5,
      //編輯&新增表單
      editform: {
        materialid: "",
        category: "",
        coefficient: "",
        unitprice: "",
        units: "",
        cost: "",
        memo: ""
      },
      search: "",
      category: ""
    };
  },
  methods: {
    //分頁
    setPage(val) {
      this.page = val;
    },
    //檢視
    viewDialog(row) {
      row;
      // console.log(row.materialid);
      // this.$router.push('/material/materialid/' + row.materialid);
    },
    //編輯對話視窗true false
    editDialog(row) {
      this.editIndex = this.tableData.indexOf(row);

      this.editDialogVisible = true;
      // document.getElementById("materialid").disabled = true;

      // console.log(row);
      this.editform = Object.assign({}, row);
    },
    //刪除對話視窗
    deleteDialog(row) {
      const a = this.tableData.indexOf(row);
      console.log(row);
      this.$confirm("此操作將永久刪除該筆資料, 是否繼續?", "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          // console.log(res)
          if (res == "confirm") {
            console.log("ok");
            //delete API請求
            this.axios({
              url: `/material/${row.materialid}`,
              method: "delete"
            })
              .then(res => {
                console.log(res);
                this.$message({
                  message: "刪除成功",
                  type: "success"
                });
                this.tableData.splice(a, 1);
              })
              .catch(err => {
                console.log(err);
                this.$message({
                  message:
                    "此材料可能與規格有關聯，欲要執行此操作請先刪除該規格",
                  type: "error"
                });
              });
          }
        })
        .catch(err => err);
    },

    //get API請求
    getmeterialapi() {
      this.axios({
        method: "GET",
        url: "/material"
      })
        .then(res => {
          this.tableData = res.data;
        })
        .catch(err => {
          err;
        });
    },

    //post API請求
    postmeterialapi() {
      var data = {
        materialid: this.editform.materialid,
        category: this.editform.category,
        coefficient: this.editform.coefficient,
        unitprice: this.clcVal,
        units: this.editform.units,
        cost: this.editform.cost,
        memo: this.editform.memo
      };
      if (this.title == "新增") {
        this.axios({
          url: `/findmaterial/${this.editform.materialid}`,
          method: "get"
        }).then(res => {
          if (res.data == false) {
            console.log("ok");
            this.axios({
              method: "post",
              url: "/material",
              data: data
            })
              .then(res => {
                console.log("success", res);

                if (this.editIndex > -1) {
                  Object.assign(this.tableData[this.editIndex], data);
                  this.editDialogVisible = false;
                } else {
                  this.tableData.push(data);
                  this.editDialogVisible = false;
                  this.$message.success({
                    message: "成功新增資料"
                  });
                }
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            this.$message.error({
              message: "此材料重複"
            });
          }
        });
      } else {
        this.axios({
          method: "post",
          url: "/material",
          data: data
        })
          .then(res => {
            console.log("success", res);

            if (this.editIndex > -1) {
              Object.assign(this.tableData[this.editIndex], data);
              this.editDialogVisible = false;
              this.$message.success({
                message: "成功修改資料"
              });
            } else {
              this.tableData.push(data);
              this.editDialogVisible = false;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },

    //put API請求
    putmeterialapi(id) {
      this.axios({
        method: "put",
        url: `/material/${id}`,
        data: this.editform
      })
        .then(res => {
          console.log("success", res);
          this.tableData.push(this.editform);
          this.editDialogVisible = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMaterialCategory() {
      this.axios({
        method: "get",
        url: "/materialcategory"
      }).then(res => {
        this.category = res.data;
      });
    }
  },

  computed: {
    pagedTableData() {
      // console.log(this.tableData.slice(this.pageSize * this.page - this.pageSize, this.pageSize * this.page));
      return this.tableData.slice(
        this.pageSize * this.page - this.pageSize,
        this.pageSize * this.page
      );
    },

    clcVal() {
      return Math.round(this.editform.cost * this.editform.coefficient);
    },

    title() {
      return this.editIndex === -1 ? "新增" : "編輯";
    }
  },

  created() {
    this.getmeterialapi();
    this.getMaterialCategory();
  }
};
</script>
