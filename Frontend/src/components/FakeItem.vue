<template>
  <div class="item">
    <div class="image">
      <img alt="" />
    </div>
    <div class="detail">
      <div class="title"></div>
      <div class="description one"></div>
      <div class="description two"></div>
      <div class="description three"></div>
    </div>
  </div>
</template>

<style scoped>
.item {
  display: flex;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 0 10px 1px green;
  margin: 6px;
  border: 2px solid rgb(255, 0, 0);
  border-style: dotted;
  border-radius: 8px;
  padding: 8px;
  height: 120px;
  width: 250px;
}

.image {
  width: 100px;
  height: 100px;
  box-shadow: 0 0 6px 0px #ccc;
  border-radius: 8px;
  animation: 1s shine-avatar linear infinite;
  background-size: 600px 100% !important;
}

.detail {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0px 9px;
}

.title {
  height: 20px;
  width: 100%;
}

.description {
  height: 20px;
  width: 100%;
  margin-top: 4px;
}

.title,
.description {
  border-radius: 4px;
  background-size: 600px 100% !important;
  animation: 1s shine-lines linear infinite;
}

.image,
.title,
.description {
  background: linear-gradient(90deg, #ccc 8%, #e8e8e8 18%, #ccc 33%);
  /* background: linear-gradient(90deg, #ddd 8%, #e8e8e8 18%, #ddd 33%); */
}

.description.one {
  margin-top: 12px;
  width: 90%;
}
.description.two {
}
.description.three {
  width: 55%;
}

@keyframes shine-avatar {
  0% {
    background-position-x: -100px ;
  }
  40%, 100% {
    background-position-x: 130px;
  }
}
@keyframes shine-lines {
  0% {
    background-position-x: -320px;
  }
  40%, 100% {
    background-position-x: 220px;
  }
}
</style>
