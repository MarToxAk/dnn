<template>
  <div class="container">
    <div>
      <Logo />
      <h1 class="title">
        dnn222
      </h1>
      <div class="links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          rel="noopener noreferrer"
          class="button--green"
        >
          Documentation
        </a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          rel="noopener noreferrer"
          class="button--grey"
        >
          GitHub
        </a>
        <b-button variant="primary" @click="count++">++1</b-button>
      </div>
    </div>
    {{count}}
  </div>
</template>

<script>
import generateETag from 'etag'
import axios from 'axios'
export default {
   data: function () {
    return {
      count: 0
    }
  },

  async asyncData ({ res }) {
  let { data } = await axios.get('/api/orders?table=2')
  const etag = await generateETag(JSON.stringify(data))

    if (res) {
      res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
      res.setHeader("X-version", etag)
    }
    return { data: data, etag: etag }
  },
  mounted () {
    fetch(window.location, {
          headers: {
            pragma: "no-cache"
          }
        }).then(res => {
          if (res.ok && res.headers.get("x-version") !== this.etag) {
            window.location.reload()
          }
    })
  },
  methods:{
    button1(){
      return this.count + 1
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
