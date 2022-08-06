<template>
  <v-row justify="center" align="center">
    <v-col>
      <v-card class="ma-4" outlined>
        <!--
        <v-card-title class="headline" >
          {{ doc.title }}
        </v-card-title>
        -->
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
  name: 'MainIndex',
  async asyncData ({ $content }) {
    const doc = await $content('indices/index').fetch()
    return { doc }
  }
})
</script>
