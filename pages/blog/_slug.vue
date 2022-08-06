<template>
  <v-row justify="center" align="center">
    <v-col>
      <v-card class="ma-4" outlined>
        <v-card-title class="headline">
          {{ doc.title }}
        </v-card-title>
        <v-card-text>
          <nuxt-content :document="doc" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'BlogSlug',
  async asyncData({ $content, params }) {
    const doc = await $content('blog', params.slug).fetch()
    return { doc }
  }
})
</script>
