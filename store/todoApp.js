import Vue from 'vue'
import lowdb from 'lowdb'
import _cloneDeep from 'lodash/cloneDeep'
import _forEachRight from 'lodash/forEachRight'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import cryptoRandomString from 'crypto-random-string'
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import _findIndex from 'lodash/findIndex'

export default {
  namespaced: true,
  state: () => ({
    // data는 함수여야한다. 객체 데이터반환
    db: null,
    todos: [],
    filter: 'all'
  }),
  getters: {
    filteredTodos (state) {
      switch (state.filter) {
        case 'all':
        default:
          return state.todos
        case 'active': // 해야 할 항목
          return state.todos.filter((todo) => !todo.done)
        case 'completed': // 완료된 항목
          return state.todos.filter((todo) => todo.done)
      }
    },
    total (state) {
      return state.todos.length
    },
    activeCount (state) {
      return state.todos.filter((todo) => !todo.done).length
    },
    completedCount (state, getters) {
      return getters.total - getters.activeCount
    }
  },
  mutations: {
    assignDB (state, db) {
      state.db = db
    },
    updateDB (state, { todo, value }) {
      state.db.get('todos').find({ id: todo.id }).assign(value).write()
    },
    deleteDB (state, todo) {
      state.db.get('todos').remove({ id: todo.id }).write()
    },
    pushTodo (state, newTodo) {
      // Update Client
      state.todos.push(newTodo) // 밀어넣기
    },
    assignTodo (state, { foundTodo, value }) {
      _assign(foundTodo, value)
    },
    createDB (state, newTodo) {
      // Create Client
      state.db
        .get('todos') // todos를 가져와서 (lodash)
        .push(newTodo) // 밀어넣기 (lodash)
        .write() // lowdb
    },
    assginTodos (state, todos) {
      state.todos = todos
    },
    deleteTodo (state, foundIndex) {
      Vue.delete(state.todos, foundIndex)
    },
    updateTodo (state, { todo, key, value }) {
      todo[key] = value
    },
    updateFilter (state, filter) {
      state.filter = filter
    }
  },
  actions: {
    initDB ({ state, commit }) {
      // const {state} = context

      const adapter = new LocalStorage('todo-app') // DB
      // state.db = lowdb(adapter)
      commit('assignDB', lowdb(adapter))

      console.log(state.db)

      const hasTodos = state.db.has('todos').value() // lodash

      if (hasTodos) {
        commit('assginTodos', _cloneDeep(state.db.getState().todos))
      } else {
        // LocalDB 초기화
        state.db
          .defaults({
            todos: [] // Collection
          })
          .write()
      }
    },
    createTodo ({ state, commit }, title) {
      const newTodo = {
        id: cryptoRandomString({ length: 10 }),
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
        done: false
      }

      commit('createDB', newTodo)
      commit('pushTodo', newTodo)
    },
    updateTodo ({ state, commit }, { todo, value }) {
      // update DB
      commit('updateDB', { todo, value })

      const foundTodo = _find(state.todos, { id: todo.id })
      commit('assignTodo', { foundTodo, value })
    },

    deleteTodo ({ state, commit }, todo) {
      commit('deleteDB', todo)
      const foundIndex = _findIndex(state.todos, { id: todo.id })
      commit('deleteTodo', foundIndex)
    },

    completeAll ({ state, commit }, checked) {
      // DB commit(mutation은 반환값 만들 수 없음)
      const newTodos = state.db
        .get('todos')
        .forEach((todo) => {
          // todo.done = checked
          commit('updateTodo', {
            todo,
            key: 'done',
            value: checked
          })
        })
        .write()

      commit('assginTodos', _cloneDeep(newTodos))
      //state.todos = _cloneDeep(newTodos)
    },

    clearCompleted ({ state, dispatch }) {
      _forEachRight(state.todos, (todo) => {
        if (todo.done) {
          dispatch('deleteTodo', todo)
        }
      })
    }
  }
}
