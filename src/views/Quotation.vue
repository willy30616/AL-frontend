<template>
  <!-- <el-container style="height:100%"> -->
  <div>
    <div class="input-group" slot="header">
      <el-input
        v-model="search"
        widht=""
        type=""
        class="ob-search-input ob-shadow search-input mr-3"
        id=""
        placeholder="請輸入報價單號或公司名稱"
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
          >新增報價
        </el-button>
        <h1 style="width:100% ;text-align: center;">
          <i class="el-icon-edit-outline"></i> 報價管理
        </h1>
      </div>
      <br />

      <!-- Table內容 -->
      <el-table
        :data="
          datatable.filter(
            data =>
              !search ||
              data.reportid.toLowerCase().includes(search.toLowerCase()) ||
              data.customer.toLowerCase().includes(search.toLowerCase())
          )
        "
        style="width: 100%"
        height="618"
        border
        resizable
        fit
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
      >
        <el-table-column label="序" type="index"> </el-table-column>

        <el-table-column prop="reportid" label="報價單號" sortable>
        </el-table-column>

        <el-table-column prop="reportdate" label="報價日期" sortable>
        </el-table-column>

        <el-table-column prop="customer" label="公司名稱"> </el-table-column>

        <el-table-column prop="total" label="報價總價" sortable>
        </el-table-column>

        <el-table-column prop="workaddress" label="施工地址"> </el-table-column>

        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <!-- <el-button
            size="mini"
            type="info"
            icon="el-icon-view"
            @click="view(scope.row)"
            >檢示</el-button
          > -->
            <el-button
              size="mini"
              type="info"
              icon="el-icon-view"
              @click="print(scope.row)"
              >列印</el-button
            >
            <br />
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="edit(scope.row)"
              >編輯</el-button
            >
            <br />

            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              >作廢</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination
        layout="prev, pager, next"
        :total="datatable.length"
        @current-change="setPage"
        :page-size="pageSize"
      >
      </el-pagination> -->
    </el-card>
  </div>
  <!-- </el-container> -->
</template>

<script>
export default {
  name: "Quotation",
  created() {
    this.getProudctApi();
  },
  data() {
    return {
      datatable: [],
      page: 1,
      pageSize: 5,
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
    //Add
    add() {
      this.$router.push("/quotate/add");
    },
    //View
    view(row) {
      this.$router.push(`/quotate/view/${row.reportid}`);
    },
    setPage(val) {
      this.page = val;
    },
    //Edit
    edit(row) {
      console.log(row);
      this.$router.push(`/quotate/edit/${row.reportid}`);
    },

    //Delete API
    //刪除
    async handleDelete(row) {
      console.log(row);

      // 彈框 詢問使用者是否刪除
      const a = this.datatable.indexOf(row);
      if (a > -1) {
        console.log(a);
        // console.log(row);
        const confirmResult = await this.$confirm(
          "此操作將作廢該資料, 是否繼續?",
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

          var data = {
            reportid: row.reportid,
            customerid: row.customerid,
            customer: row.customer,
            total: row.total,
            workaddress: row.workaddress,
            reportdate: row.reportdate,
            invalid: true
          };
          this.axios({
            url: `/webreport/${row.reportid}`,
            method: "put",
            data: data
          })
            .then(res => {
              this.$message.warning({
                message: "此單已作廢"
              });
              console.log(res);
              this.datatable.splice(a, 1);
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
    },

    //get proudct請求
    getProudctApi() {
      this.$axios({
        url: "/reportjoin"
      })
        .then(res => {
          res.data.forEach(element => {
            if (element.invalid == false) {
              this.datatable.push({
                reportid: element.reportid,
                customerid: element.customerid,
                customer: element.customer,
                total: element.total,
                workaddress: element.workaddress,
                reportdate: element.reportdate,
                invalid: element.invalid
              });
            }
          });
        })
        .catch(err => {
          err.message;
        });
    },
    print(row) {
      window.location.href = `http://192.168.0.69:8777/aluminum/public/api/report/pdf/${row.reportid}/${row.customer}`;
    }
  }
};
</script>

<style></style>
