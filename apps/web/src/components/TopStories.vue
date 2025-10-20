<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  bestImage,
  type NewsStory,
  type TopStoriesResponse,
} from "@/lib/api/topStories";

// shadcn-vue components (adjust import paths for your setup)
import {
  Card,
  Badge,
  Button,
  Alert,
  AlertDescription,
  AlertTitle,
  AspectRatio,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ThemeSwitch,
} from "ui";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";

// import StorySkeleton from "./TopStorySkeleton.vue";

import Article from "./Article.vue";

const sections = ["automobiles", "business", "world", "technology", "sports"];
const sources = ["all", "nytimes", "guardian"] as const;

const currentSection = ref<
  "automobiles" | "business" | "world" | "technology" | "sports"
>("automobiles");
const currentSource = ref<(typeof sources)[number]>("all");

const base = "http://localhost:3010/top-stories";

const { data, isLoading, error, refetch } = useQuery<TopStoriesResponse>({
  queryKey: ["top-stories", currentSection.value, currentSource.value],
  queryFn: async () => {
    const url = new URL(base);
    url.searchParams.set("section", currentSection.value);
    if (currentSource.value !== "all") {
      url.searchParams.set("source", currentSource.value);
    }
    const res = await fetch(url.toString(), {
      headers: { accept: "application/json" },
    });
    if (!res.ok) throw new Error(`Failed to fetch top stories: ${res.status}`);
    return (await res.json()) as TopStoriesResponse;
  },
  placeholderData: keepPreviousData,
});

watch([currentSection, currentSource], () => {
  refetch();
});
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6 p-4">
    <div class="flex items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">Top stories</h1>
      </div>
      <div class="flex items-center gap-2">
        <Select v-model="currentSection">
          <SelectTrigger class="w-[220px]">
            <SelectValue placeholder="Select section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="s in sections" :key="s" :value="s">
              {{ s }}
            </SelectItem>
          </SelectContent>
        </Select>
        <Select v-model="currentSource">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Select source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="s in sources" :key="s" :value="s">
              {{ s }}
            </SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" @click="refetch">Refresh</Button>
        <ThemeSwitch />
      </div>
    </div>

    <template v-if="isLoading">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <!-- <StorySkeleton v-for="i in 6" :key="i" /> -->
      </div>
    </template>

    <template v-else-if="error">
      <Alert variant="destructive">
        <AlertTitle>Could not load stories</AlertTitle>
        <AlertDescription>{{ (error as Error).message }}</AlertDescription>
      </Alert>
    </template>

    <template v-else>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Article
          v-for="story in data ?? []"
          :key="story.url"
          :article="story"
        />
      </div>
    </template>
  </div>
</template>
