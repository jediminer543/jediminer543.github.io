<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col>
        <v-card class="ma-4" outlined>
          <v-card-text>
            <nuxt-content :document="doc" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="ma-4" outlined>
          <v-card-text>
            <h1>Latest</h1>
          </v-card-text>
          <v-card-text>
            <v-card v-for="post in latest" :key="post.title" outlined>
              <v-card-text>
                <nuxt-content :document="{ body: post.excerpt }" />
              </v-card-text>
              <v-card-actions>
                <v-btn
                  outlined
                  rounded
                  text
                  @click="$router.push('blog/'+post.slug)"
                >
                  Read more
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'BlogIndex',
  async asyncData ({ $content }) {
    const doc = await $content('indices/blog').fetch()
    const latest = await $content('blog')
      .where({
        tags: { $containsNone: ['blog-wip', 'wip', 'blog-preview'] }

      })
      .only(['authors', 'author', 'title', 'date', 'excerpt', 'slug'])
      .sortBy('date', 'desc')
      .limit(5)
      .fetch()
    // console.log(latest)
    return { doc, latest }
  }
})
</script>
