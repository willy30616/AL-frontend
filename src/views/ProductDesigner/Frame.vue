<template>
  <div>
    <div class="input-group" slot="header">
      <el-input
        v-model="search"
        widht=""
        type=""
        class="ob-search-input ob-shadow search-input mr-3"
        id=""
        placeholder="請輸入門框名稱(規格)"
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
          @click="$router.push('/frame/Add')"
          >新增門框</el-button
        >
        <h1 style="width:100% ;text-align: center;">
          <i class="bi bi-door-open-fill"></i>門框設定
        </h1>
      </div>
      <br />

      <!-- Table內容 -->
      <el-table
        :data="
          pagedTableData.filter(
            data =>
              !search ||
              data.specid.toLowerCase().includes(search.toLowerCase())
          )
        "
        style="width: 100%"
        height="602"
        border
        resizable
        fit
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
      >
        <el-table-column label="序" type="index"> </el-table-column>

        <el-table-column prop="specid" label="門框名稱(規格)">
        </el-table-column>

        <el-table-column prop="totalprice" label="價格"> </el-table-column>

        <el-table-column label="操作" width="100px">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <router-link :to="`/frame/view/${scope.row.specid}`">
              <el-button size="mini" type="info" icon="el-icon-view"
                >檢示</el-button
              >
            </router-link>
            <br />
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
  </div>
</template>

<script>
export default {
  name: "Frame",
  created() {
    this.getframeapi();
  },
  computed: {
    pagedTableData() {
      // console.log(this.tableData.slice(this.pageSize * this.page - this.pageSize, this.pageSize * this.page));
      return this.tableData.slice(
        this.pageSize * this.page - this.pageSize,
        this.pageSize * this.page
      );
    },
    title() {
      return this.editIndex === -1 ? "新增" : "編輯";
    }
  },
  data() {
    return {
      editIndex: -1,
      editDialogVisible: false, // 控制"編輯"對話方塊是否顯示
      page: 1, //分頁
      pageSize: 5, //分頁項次
      tableData: [],
      deleteData: [],
      search: ""
    };
  },
  methods: {
    //分頁
    setPage(val) {
      this.page = val;
    },

    //編輯
    editDialog(row) {
      this.editIndex = this.tableData.indexOf(row);
      // console.log(row);
      this.$router.push(`/frame/${row.specid}`);
    },

    //刪除對話視窗
    deleteDialog(row) {
      console.log(row.specid);

      this.$confirm("此操作將永久刪除該筆資料, 是否繼續?", "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          // console.log(res)
          if (res == "confirm") {
            console.log("ok");

            this.axios({
              url: `/findspec/${row.specid}`,
              method: "get"
            }).then(res => {
              console.log(res);
              if (res.data.length != 0) {
                console.log("有資料,不能刪");
                this.$message({
                  message:
                    "此規格在產品可能有資料，欲要執行此操作請先刪除該產品",
                  type: "error"
                });
              } else {
                this.getSingleReslut(row);
              }
            });
          }
        })
        .catch(err => err);
    },

    //get API請求
    getframeapi() {
      this.axios({
        method: "GET",
        url: "/frameprice"
      })
        .then(res => {
          res.data.forEach(element => {
            // if (element.doorinfofks.doorinfoid == 1) {
            this.tableData.push(element);
            // }
          });
        })
        .catch(err => {
          err;
        });
    },

    //post API請求
    postframeapi() {
      this.axios({
        method: "post",
        url: "/frameprice",
        data: this.editform
      })
        .then(res => {
          console.log("success", res);
          if (this.editIndex > -1) {
            Object.assign(this.tableData[this.editIndex], this.editform);
          } else {
            this.tableData.push(this.editform);
            this.editDialogVisible = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //put API請求
    putframeapi(id) {
      this.axios({
        method: "put",
        url: `/frame/${id}`,
        data: this.editform
      })
        .then(res => {
          console.log("success", res);
          this.tableData.push(this.editform);
        })
        .catch(err => {
          console.log(err);
        });
    },

    getSingleReslut(row) {
      this.axios({
        url: `/specname/${row.specid}`,
        method: "get"
      })
        .then(res => {
          res.data.materialcosts.forEach(element => {
            this.deleteData.push({
              materialid: element.materialid,
              specid: element.specid
            });
          });

          console.log(this.deleteData);
        })
        .then(() => {
          this.axios({
            url: "/materialcost/deleteall",
            method: "delete",
            data: this.deleteData
          }).then(res => {
            console.log(res);
            if (res.status == 204) {
              this.axios({
                url: `/specname/${row.specid}`,
                method: "delete"
              }).then(res => {
                res;
                console.log(res);
                if (res.status == 204) {
                  console.log("我在這");
                  console.log(row);
                  const index = this.tableData.indexOf(row);
                  console.log(index);
                  this.tableData.splice(index, 1);
                  this.$message({
                    message: "刪除成功",
                    type: "success"
                  });
                }
              });
            }
          });
        });
    }
  }
};
</script>

<style></style>
