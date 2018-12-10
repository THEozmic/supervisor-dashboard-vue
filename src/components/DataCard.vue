<template>
  <div :class="`card card--${color}`">
    <div class="card__title">{{ title }}</div>
    <div class="card__content">{{ content }}</div>
  </div>
</template>

<script>
export default {
  name: "DataCard",
  props: {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
.card {
  display: inline-block;
  padding: 20px;
  margin-bottom: 30px;
  color: #ffffff;
  width: 30%;
  box-shadow: 0 15px 35px 0 rgba(42, 51, 83, 0.12),
    0 5px 15px rgba(0, 0, 0, 0.06);
  border-radius: 4px;
}

.card--blue {
  background-color: #375bae;
}

.card--green {
  background-color: #64ae37;
}

.card--red {
  background-color: #ae377f;
}

.card__title {
  font-size: 30px;
}

.card__content {
  font-size: 20px;
}

@media screen and (max-width: 999px) {
  .card {
    width: 100%;
  }
}
</style>
