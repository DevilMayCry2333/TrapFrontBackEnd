<template>
  <iframe ref="iframe" src="http://localhost:8080/customMap" style="width:100%;height:80%;" @load="test"></iframe>
</template>
<script>
export default {
  mounted(){

  },
  methods:{
    test(){
          let role = this.$store.state.user.role;
      if (role == 1) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
      } else if (role == 2) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        this.city = this.$store.state.user.adcode.substr(0, 4);
      } else if (role == 3) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        this.city = this.$store.state.user.adcode.substr(0, 4);
        this.area = this.$store.state.user.adcode;
            }
            else if (role == 4) {
                          this.province = this.$store.state.user.adcode.substr(0, 2);
                          this.city = this.$store.state.user.adcode.substr(0, 4);
                          this.area = this.$store.state.user.adcode;
                          this.manager=this.$store.state.user.username;
                        }
                               
                               
                               
                               
      this.$cookies.set('area',this.area);
    }
  },
  data(){
    return{
      province:'',
      city:'',
      area:'',
      manager:'',
    }
  }
}
</script>