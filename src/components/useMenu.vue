<template>
  <div class="useMenu">
    <div v-for="menu in subMenu">
      <p class="menuContent">{{ menu }}</p>
    </div>
  </div>
</template>
<script>
export default {
  mounted() {
    window.addEventListener("click", this.onClick)
  },
  methods: {
    onClick(e) {
      if (this.menuRef.indexOf(e.target.parentNode) === -1) {
        //결과 창 닫기
        this.$emit("subMenuViewBoolean")
      }
    }
  }
}
</script>

<script setup>
// 메뉴 내용들은 부모로부터 받아와서 출력하기
defineProps({
  subMenu: {
    type: Object
  },
  menuRef: {
    type: Object
  }
})
defineEmits(["subMenuViewBoolean"])
</script>

<style scoped>
.useMenu {
  position: absolute;
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2),
  0 6px 10px 0 rgba(0, 0, 0, 0.14),
  0 1px 18px 0 rgba(0, 0, 0, 0.12);
  margin-top: -70px;
  margin-left: 30px;
  background: #ffffff;
  border: #000000;
  border-radius: 3px;
  padding-top: 5px;
  padding-bottom: 5px;
}

.menuContent {
  font-family: "NanumSquareR", serif;
  font-size: 1.2rem;
  padding: 10px 15px 10px 15px;
  margin: 0;
  color: #000000;
  transition: 0.2s;
}

.menuContent:hover {
  background: #e7e7e7;
  color: #000000;
}
</style>