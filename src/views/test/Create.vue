<template>
    <div>
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ props }">
          <v-text-field
            v-bind="props"
            :modelValue="dateFormatted"
            variant="outlined"
            append-inner-icon="mdi-calendar"
          ></v-text-field>
        </template>
        <v-locale-provider>
          <v-date-picker
            color="primary"
            :modelValue="getDate"
            @update:modelValue="updateDate"
            hideHeader
          hideWeekdays
            
          ></v-date-picker>
        </v-locale-provider>
      </v-menu>
    </div>
  </template>
  
  <script setup>
import { ref, watch, computed } from 'vue';

const menu = ref(false);
const input = ref(null);

const value = {
  type: String,
  default() {
    return "2023-10-10"
  },
};

const dateFormatted = computed(() => {
  const date = input.value ? new Date(input.value) : new Date();
  let month = 1 + date.getMonth();
  if (month < 10) {
    month = `0${month}`;
  }
  let day = date.getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  return `${date.getFullYear()}-${month}-${day}`;
});

const getDate = computed(() => {
  /**
   * Return ISO 8601
   */
  let date = input.value ? new Date(input.value) : new Date();
  return date;
});

watch(() => value, (val) => {
  input.value = val;
}, { immediate: true });

const updateDate = (val) => {
  input.value = val;
  console.error(val);
};

</script>

  