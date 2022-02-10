<template>
  <div>
    <div class="input-group" slot="header">
      <el-input
        v-model="search"
        widht=""
        type=""
        class="ob-search-input ob-shadow search-input mr-3"
        id=""
        placeholder="請輸入產品名稱"
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
          @click="add"
          >新增產品</el-button
        >
        <h1 style="width:100% ;text-align: center;">
          <i class="el-icon-edit-outline"></i> 產品管理
        </h1>
      </div>
      <br />

      <!-- Table內容 -->
      <el-table
        :data="
          pagedTableData.filter(
            data =>
              !search ||
              data.prodid.toLowerCase().includes(search.toLowerCase())
          )
        "
        style="width: 100%"
        height="459"
        border
        resizable
        fit
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
      >
        <el-table-column label="序" type="index"> </el-table-column>

        <el-table-column prop="prodid" label="產品編號"> </el-table-column>

        <!-- <el-table-column prop="prodname" label="產品名稱"> </el-table-column> -->

        <el-table-column prop="price" label="產品價格"> </el-table-column>

        <el-table-column label="操作" width="100px">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="info"
              icon="el-icon-view"
              @click="view(scope.row)"
              >檢示</el-button
            >
            <br />

            <!-- <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="edit(scope.row)"
              >編輯</el-button
            >
            <br /> -->

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
      <el-pagination
        layout="prev, pager, next"
        :total="datatable.length"
        @current-change="setPage"
        :page-size="pageSize"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Product",
  created() {
    this.getProudct();
  },
  data() {
    return {
      datatable: [],
      page: 1,
      pageSize: 5,
      deleteData: [],
      search: ""
    };
  },
  computed: {
    pagedTableData() {
      // console.log(this.tableData.slice(this.pageSize * this.page - this.pageSize, this.pageSize * this.page));
      return this.datatable.slice(
        this.pageSize * this.page - this.pageSize,
        this.pageSize * this.page
      );
    }
  },
  methods: {
    //新增產品
    add() {
      this.$router.push("/product/add");
    },
    //View
    view(row) {
      this.$router.push(`/product/view/${row.prodid}`);
    },
    //Edit
    edit(row) {
      this.$router.push(`/product/edit/${row.prodid}`);
    },
    setPage(val) {
      this.page = val;
    },

    //get api
    getProudct() {
      this.axios({
        url: "/prodspecprice"
      })
        .then(response => {
          this.datatable = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },

    //Delete API
    //刪除
    async handleDelete(row) {
      // 彈框 詢問使用者是否刪除
      const a = this.datatable.indexOf(row);
      if (a > -1) {
        console.log(a);
        // console.log(row);
        const confirmResult = await this.$confirm(
          "此操作將永久刪除該筆資料, 是否繼續?",
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
            url: `/reportdetailfind/${row.prodid}`
          }).then(res => {
            if (res.data.length == 0) {
              this.getSingleReslut(row);
            } else {
              this.$message.error({
                message: "資料刪除失敗，報價單可能有此資料"
              });
            }
          });
        }
      }
    },
    getSingleReslut(row) {
      console.log(row);
      this.axios({
        url: `/product/${row.prodid}`,
        method: "get"
      })
        .then(res => {
          res.data.prodspecs.forEach(element => {
            this.deleteData.push({
              prodid: element.prodid,
              specid: element.specid
            });
          });

          console.log(this.deleteData);
        })
        .then(() => {
          this.axios({
            url: "/prodspec/deleteall",
            method: "delete",
            data: this.deleteData
          }).then(res => {
            console.log(res);
            if (res.status == 204) {
              this.axios({
                url: `/product/${row.prodid}`,
                method: "delete"
              }).then(res => {
                res;
                console.log(res);
                if (res.status == 204) {
                  console.log("我在這");
                  console.log(row);
                  const index = this.datatable.indexOf(row);
                  console.log(index);
                  this.datatable.splice(index, 1);
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
