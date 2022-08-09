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
            <v-card v-for="post in latest" :key="post.title" outlined class="ma-4">
              <v-card-title class="headline">
                {{ post.title }}<v-spacer /><div v-if="post.authors" class="text-subtitle-2 text-center pa-0 ma-0">
                  Written by: {{ post.authors?.join(", ") }}
                </div>
              </v-card-title>
              <v-card-subtitle v-if="post.tags || post.description" class="d-flex justify-space-between">
                <div class="text-subtitle-2 pa-2">
                  Tags: {{ post.tags?.join(", ") }}
                </div>
                <div class="text-subtitle-2 text-center pa-0 ma-0">
                  Posted: <time class="text-subtitle-2 text-center pa-0 ma-0" :datetime="post.date">{{ new Date(post.date).toLocaleDateString() }}</time>
                </div>
                <!--<p v-if="post.description">{{post.description}}</p>-->
              </v-card-subtitle>
              <v-card-text>
                <nuxt-content v-if="post.excerpt" :document="{ body: post.excerpt }" />
              </v-card-text>
              <v-card-actions>
                <v-btn
                  rounded
                  color="primary"
                  @click="$router.push('/blog/'+post.slug)"
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
      .only(['authors', 'author', 'title', 'date', 'tags', 'excerpt', 'description', 'slug'])
      .sortBy('date', 'desc')
      .limit(5)
      .fetch()
    // console.log(latest)
    return { doc, latest }
  }
})
</script>
