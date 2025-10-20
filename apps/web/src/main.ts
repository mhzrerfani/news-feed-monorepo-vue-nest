import { createApp } from "vue";
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from "./app.vue";
import { vueQueryOptions } from './lib/query-client';

const app = createApp(App);

app.use(VueQueryPlugin, vueQueryOptions);

app.mount("#app");
