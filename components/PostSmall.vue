<template>
  <v-card>
    <v-card-title class="headline">
      {{ post.title }}
      <v-spacer />
      {{ post.updatedAt }}
    </v-card-title>
    <v-card-subtitle>
      {{ post.author }}
    </v-card-subtitle>
    <v-card-text v-if="post.description">
      {{ post.description }}
    </v-card-text>
    <v-card-text v-else>
      {{ post.excerpt }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'PostSmall',
  props: ['post']
})
</script>
