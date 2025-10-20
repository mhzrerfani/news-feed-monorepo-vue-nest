<script setup lang="ts">
import { useDark } from "@vueuse/core";
import { Button } from "../button"; // adjust path if needed
import { Sun as SunIcon, Moon as MoonIcon } from "lucide-vue-next";

const isDark = useDark({
  selector: document.documentElement,
  storageKey: "vueuse-color-scheme",
});

const toggleDark = () => {
  isDark.value = !isDark.value;
};
</script>

<template>
  <Button variant="outline" size="icon" @click="toggleDark()">
    <SunIcon v-if="!isDark" class="h-5 w-5" />
    <MoonIcon v-else class="h-5 w-5" />
    <span class="sr-only">Toggle theme</span>
  </Button>
</template>
