<template>
  <div>
    <button @click="createTodo">
      <i class="material-icons">add</i>
    </button>
    <input
      :value="title"
      :placeholder="placeholder"
      type="text"
      @input="title = $event.target.value"
      @keypress.enter="createTodo"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      placeholder: '할 일을 추가하세요!'
    }
  },
  methods: {
    createTodo () {
      const validatedTitle = this.title && this.title.trim() // 타이틀이 있어야하고, 앞 뒤 공백 없애서 확인

      if (!validatedTitle) {
        alert('유효하지 않은 제목입니다!')
        this.title = this.title.trim() // 공백 지워보기
        return
      }

      // 생성
      // this.$emit('create-todo', this.title) //이벤트 이름
      this.$store.dispatch('todoApp/createTodo', this.title)
      this.title = ''

      // 화면 랜더링이 끝나고, 동작을 도와주는 것
      this.$nextTick(() => {
        window.scrollTo(0, document.body.scrollHeight)
      })
    }
  }
}
</script>
