<template>
    <section class="home">
        <div>
            <h1>
                DAIN's Home page!
            </h1>
            <router-link to="/about" tag="h2">
                About
            </router-link>
            <router-link to="/todos" tag="h2">
                Todo App
            </router-link>
        </div>
    </section>
</template>

<script>
export default {
  methods: {
  }
}
</script>
