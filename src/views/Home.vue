<template>
  <div class="home">
    <div style="text-align:center">
      <h1>歡迎使用{{ companyName }}報價系統</h1>
      <br />
      <!-- <h2>您好: {{ userName }}</h2> -->
    </div>

    <img
      style="width:53%; margin-top:5px"
      alt="Vue logo"
      src="../assets/AL系統架構.png"
    />
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      userName: "陳生",
      companyName: ""
    };
  }
};
</script>
<style>
body {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微軟正黑體", Arial, sans-serif;
}
.home {
  text-align: center;
}
</style>
