<template>
  <div class="todo-app">
    <div class="todo-app__actions">
      <div class="filters">
        <router-link to="all" tag="button">
          모든 항목 ({{ total }})
        </router-link>
        <router-link to="active" tag="button">
          해야 할 항목 ({{ activeCount }})
        </router-link>
        <router-link to="completed" tag="button">
          완료된 항목 ({{ completedCount }})
        </router-link>
      </div>
      <div class="actions clearfix">
        <div class="float--left">
          <label>
            <input v-model="allDone" type="checkbox" />
            <span class="icon"><i class="material-icons">done_all</i></span>
          </label>
        </div>
        <div class="float--right clearfix">
          <button class="btn float--left" @click="scrollToTop">
            <i class="material-icons">expand_less</i>
          </button>
          <button class="btn float--left" @click="scrollToBottom">
            <i class="material-icons">expand_more</i>
          </button>
          <button class="btn btn--danger float--left" @click="clearCompleted">
            <i class="material-icons">delete_sweep</i>
          </button>
        </div>
      </div>
    </div>

    <div class="todo-app__list">
      <todo-item
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo="todo" />
    </div>

    <todo-creator class="todo-app__creator" />
  </div>
</template>

<script>

import scrollTo from 'scroll-to'
import TodoCreator from '~/components/TodoCreator'
import TodoItem from '~/components/TodoItem'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  components: {
    TodoCreator,
    TodoItem
  },
  computed: {
    ...mapState('todoApp', [
      'todos'
    ]), // String: namespace, Araay: db, todos 등을 넣을 수 있다.
    ...mapGetters('todoApp', [
      'filteredTodos',
      'total',
      'activeCount',
      'completedCount'
    ]),
    allDone: {
      get () {
        return this.total === this.completedCount && this.total > 0
      },
      set (checked) {
        this.completeAll(checked)
      }
    }
  },
  watch: {
    ...mapMutations('todoApp', [
      'updateFilter'
    ]),
    $route () { // route가 변경될때 마다 filter 갱신해주는 코드
      // state.filter = this.$route.params.id
      // this.$store.commit('todoApp/updateFilter', this.$route.params.id)
      this.updateFilter(this.$route.params.id)
    }
  },
  created () {
    this.initDB()
  },
  methods: {
    ...mapActions('todoApp', [
      'initDB',
      'completeAll',
      'clearCompleted'
    ]),
    scrollToTop () {
      scrollTo(0, 0, {
        ease: 'linear'
      })
    },
    scrollToBottom () {
      scrollTo(0, document.body.scrollHeight, {
        ease: 'linear'
      })
    }
  }
}
</script>

<style lang="scss">
@import 'scss/style';

.filters button.router-link-active {
  background: royalblue;
  color: white;
}
</style>
