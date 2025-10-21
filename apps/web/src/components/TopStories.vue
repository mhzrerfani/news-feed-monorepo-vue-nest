<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import { useInfiniteQuery } from "@tanstack/vue-query";
import { type TopStoriesResponse } from "@/lib/types";
import {
  Button,
  Alert,
  AlertDescription,
  AlertTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ThemeSwitch,
  Input,
} from "ui";
import Article from "./Article.vue";
import TopStorySkeleton from "./TopStorySkeleton.vue";
import { API_URL, SECTIONS, SOURCES } from "@/lib/constants";
import { RotateCcw, Search } from "lucide-vue-next";

const currentSection = ref<string>("random");
const currentSource = ref<string>("all");
const query = ref("");
const step = ref(10);

const base = computed(() => `${API_URL}/top-stories`);

const {
  data,
  isLoading,
  isFetching,
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
  refetch,
  error,
} = useInfiniteQuery<TopStoriesResponse>({
  queryKey: ["top-stories", currentSection, currentSource, query, step],
  queryFn: async ({ pageParam = 1 }) => {
    const url = new URL(base.value);

    if (
      currentSection.value &&
      !["random", "all"].includes(currentSection.value)
    ) {
      url.searchParams.set("section", currentSection.value);
    }
    if (currentSource.value !== "all")
      url.searchParams.set("source", currentSource.value);
    if (query.value) url.searchParams.set("q", query.value);

    url.searchParams.set("page", String(pageParam));
    url.searchParams.set("step", String(step.value));

    const res = await fetch(url.toString(), {
      headers: { accept: "application/json" },
    });
    if (!res.ok) throw new Error(`Failed to fetch top stories: ${res.status}`);
    return (await res.json()) as TopStoriesResponse;
  },
  initialPageParam: 1,
  getNextPageParam: (lastPage, allPages) => {
    const size = Array.isArray(lastPage) ? lastPage.length : 0;
    return size === step.value ? allPages.length + 1 : undefined;
  },
});

const stories = computed(() => {
  const pages = data?.value?.pages ?? [];
  return pages.flat(); // if { items }, use: pages.flatMap(p => p.items)
});

const isInitialLoading = computed(() => isLoading && !data?.value);

function applyFilter() {
  refetch(); // queryKey changed via v-models → pages reset automatically
}

function resetFilters() {
  query.value = "";
  currentSource.value = "all";
  currentSection.value = "random";
  refetch();
}

watch([currentSection, currentSource], () => refetch());

const sentinel = ref<HTMLElement | null>(null);

useIntersectionObserver(
  sentinel,
  ([entry]) => {
    if (
      entry.isIntersecting &&
      hasNextPage.value &&
      !isFetchingNextPage.value
    ) {
      fetchNextPage();
    }
  },
  { root: null, rootMargin: "200px", threshold: 0 }
);
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6 p-4">
    <div class="flex items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">Top stories</h1>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <Select v-model="currentSection">
          <SelectTrigger class="w-[220px]">
            <SelectValue placeholder="Select section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sections</SelectItem>
            <SelectItem value="random">Random</SelectItem>
            <SelectItem v-for="s in SECTIONS" :key="s.value" :value="s.value">
              <span class="mr-2">{{ s.icon }}</span>
              {{ s.label }}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select v-model="currentSource" :disabled="isFetching">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Select source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="s in SOURCES" :key="s.value" :value="s.value">
              {{ s.label }}
            </SelectItem>
          </SelectContent>
        </Select>

        <form class="flex items-center gap-2" @submit.prevent="applyFilter">
          <Input
            v-model="query"
            type="search"
            class="rounded-md border px-2 py-1"
            placeholder="Search titles, abstracts, byline"
            :disabled="isFetching"
          />
          <Button
            size="sm"
            variant="ghost"
            :disabled="isFetching"
            aria-label="Apply search"
          >
            <Search />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            @click="resetFilters"
            :disabled="isFetching"
          >
            <RotateCcw />
          </Button>
        </form>

        <ThemeSwitch />
      </div>
    </div>

    <template v-if="isInitialLoading">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TopStorySkeleton v-for="i in 6" :key="i" />
      </div>
    </template>

    <template v-else-if="error">
      <Alert variant="destructive">
        <AlertTitle>Could not load stories</AlertTitle>
        <AlertDescription>{{ (error as Error).message }}</AlertDescription>
      </Alert>
    </template>

    <template v-else>
      <div
        :class="{
          'opacity-60 pointer-events-none': isFetching && !isInitialLoading,
        }"
      >
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Article v-for="story in stories" :key="story.url" :article="story" />
        </div>

        <div class="mt-4 flex flex-col items-center gap-2">
          <div v-if="isFetchingNextPage" class="text-sm text-muted-foreground">
            Loading more...
          </div>
          <div v-else-if="!hasNextPage" class="text-sm text-muted-foreground">
            No more results
          </div>
          <div ref="sentinel" aria-hidden="true" class="h-1 w-full"></div>
        </div>
      </div>
    </template>
  </div>
</template>
