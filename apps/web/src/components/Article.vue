<script setup lang="ts">
import { computed } from "vue";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  AspectRatio,
} from "ui";
import type { NewsStory } from "@/lib/api/topStories";
const props = defineProps<{
  article: NewsStory;
}>();
const sourceColor = computed(() => {
  return props.article.source === "nytimes"
    ? "bg-zinc-100 text-zinc-900"
    : "bg-blue-500 text-white";
});
const formattedDate = computed(() => {
  return new Date(props.article.publishedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
});
</script>
<template>
  <Card class="h-full flex flex-col overflow-hidden pt-0!">
    <div class="w-full">
      <AspectRatio :ratio="16 / 9" data-slot="cover">
        <img
          v-if="article.cover"
          :src="article.cover"
          :alt="article.title"
          class="h-full w-full object-cover"
        />
        <div
          v-else
          class="flex h-full w-full items-center border-b justify-center bg-muted"
        >
          <span class="text-sm text-muted-foreground">No Image Available</span>
        </div>
      </AspectRatio>
    </div>
    <CardHeader class="flex-1">
      <div class="flex items-center justify-between mb-1">
        <Badge :class="sourceColor">{{ article.source }}</Badge>
        <span class="text-sm text-muted-foreground">{{ formattedDate }}</span>
      </div>

      <CardTitle class="line-clamp-2">{{ article.title }}</CardTitle>
      <CardDescription v-if="article.abstract" class="line-clamp-3">
        {{ article.abstract }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div v-if="article.byline" class="text-sm text-muted-foreground mb-4">
        {{ article.byline }}
      </div>
      <div class="flex items-center justify-between mt-auto">
        <div class="flex items-center gap-2">
          <Badge variant="outline">{{ article.section }}</Badge>
          <Badge v-if="article.subsection" variant="outline">
            {{ article.subsection }}
          </Badge>
        </div>
        <a
          :href="article.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm font-medium text-primary hover:underline"
        >
          Read more →
        </a>
      </div>
    </CardContent>
  </Card>
</template>
