<template>
  <div :class="{ done }" class="todo-item">
    <div v-if="isEditMode" class="item__inner item__edit">
      <input
        ref="titleInput"
        :value="editedTitle"
        type="text"
        @input="editedTitle = $event.target.value"
        @keypress.enter="editedTodo"
        @keypress.esc="offEditMode"
      />
      <div class="item__actions">
        <button class="btn btn--primary" key="complete" @click="editedTodo">
          <i class="material-icons">done</i>
        </button>
        <button class="btn" key="cancel" @click="offEditMode">
          <i class="material-icons">clear</i>
        </button>
      </div>
    </div>

    <div v-else class="item__inner item__normal">
      <div class="item__title-wrap">
        <div class="item__title">{{ todo.title }}</div>
        <div class="item__date">{{ date }}</div>
      </div>
      <div class="item__actions">
        <button class="btn" key="update" @click="onEditMode">
          <i class="material-icons">edit</i>
        </button>
        <button class="btn btn--danger" key="delete" @click="deleteTodo">
          <i class="material-icons">delete</i>
        </button>
      </div>
    </div>

<label>
      <input v-model="done" type="checkbox" />
      <span class="icon">
        <i class="material-icons">check</i>
        </span>
</label>

  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  props: {
    todo: Object
  },
  data () {
    return {
      isEditMode: false,
      editedTitle: ''
    }
  },
  computed: {
    done: {
      get () {
        return this.todo.done
      },
      set (done) {
        this.updateTodo({
          done
        })
      }
    },
    date () {
      const date = dayjs(this.todo.createdAt)
      const isSame = date.isSame(this.todo.updatedAt)

      if (isSame) {
        return date.format('YYYY년 MM월 DD일')
      } else {
        return `${date.format('YYYY년 MM월 DD일')} (edited)`
      }
    }
  },
  methods: {
    editedTodo () {
      if (this.todo.title !== this.editedTitle) {
        this.updateTodo({
          title: this.editedTitle,
          updatedAt: new Date()
        })
      }

      this.offEditMode()
    },
    onEditMode () {
      this.isEditMode = true
      this.editedTitle = this.todo.title

      this.$nextTick(() => {
        this.$refs.titleInput.focus()
      })
    },
    offEditMode () {
      this.isEditMode = false
    },
    updateTodo (value) {
      this.$store.dispatch('todoApp/updateTodo', {
        todo: this.todo,
        value
      })
      // this.$emit('update-todo', this.todo, value) //update-todo라는 이벤트, todo 객체, 어떤 값이 업데이트 될 것인지 전달
    },
      deleteTodo () {
      this.$store.dispatch('todoApp/deleteTodo', this.todo)
      // this.$emit('delete-todo', this.todo)
    }
  }
}
</script>
