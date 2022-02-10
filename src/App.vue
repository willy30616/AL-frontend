<template>
  <div id="app">
    <el-container>
      <!-- 旁邊 -->
      <el-aside width="180px">
        <el-scrollbar>
          <el-menu
            :router="router"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-menu-item index="/">
              <i class="el-icon-s-home"></i>
              <span slot="title">首頁</span>
            </el-menu-item>
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-s-tools"></i
                ><span slot="title">基本設定</span>
              </template>
              <el-menu-item index="/cust">
                <i class="el-icon-s-custom"> </i
                ><span slot="title">客戶管理</span>
              </el-menu-item>
              <el-menu-item index="/product">
                <i class="el-icon-s-cooperation"></i
                ><span slot="title">產品管理</span>
              </el-menu-item>
              <el-menu-item index="/setting/material">
                <i class="el-icon-notebook-2"></i
                ><span slot="title">材料種類設定</span>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-menu"></i><span slot="title">產品設計</span>
              </template>
              <el-menu-item index="/material"
                ><i class="bi bi-plus-square"></i>材料設定
              </el-menu-item>
              <el-menu-item index="/doorleaf"
                ><i class="bi bi-door-open-fill"></i>門扇設定
              </el-menu-item>
              <el-menu-item index="/frame"
                ><i class="bi bi-file"></i>門框設定
              </el-menu-item>
            </el-submenu>
            <el-menu-item index="/Quotation">
              <i class="el-icon-edit-outline"></i>
              <span slot="title">報價管理</span>
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      router: true,
      isCollapse: false
    };
  }
};
</script>

<style leng="sass" scope="scoped">
html,
body,
#app,
.el-container {
  /* text-align: center; */
  padding: 0px;
  margin: 0px;
  height: 100%;
}
li a {
  text-decoration: none;
  color: inherit;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
}
.el-aside {
  background-color: #545c64;
  color: #333;
  /* width: 10px; */
}

.el-main {
  padding: 0;
}

.el-menu {
  width: 100%;
  /* height: 100%; */
}

.page-scroll {
  height: 100%;
}

.page-scroll .el-scrollbar__wrap {
  overflow-x: hidden;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
