import React, { useState } from 'react'
import { useSubscription, useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import { auth } from 'util/nhost'

const GET_TODOS = gql`
  subscription {
    todos {
      id
      created_at
      name
      completed
    }
  }
`

const INSERT_TODO = gql`
  mutation($todo: todos_insert_input!) {
    insert_todos(objects: [$todo]) {
      affected_rows
    }
  }
`

const UPDATE_TODO = gql`
  mutation($todo_id: uuid!, $done: Boolean) {
    update_todos_by_pk(
      pk_columns: { id: $todo_id }
      _set: { completed: $done }
    ) {
      id
    }
  }
`

const DELETE_TODO = gql`
  mutation($todo_id: uuid!) {
    delete_todos_by_pk(id: $todo_id) {
      id
    }
  }
`

const TodoItem = ({ todo }) => {
  const [updateTodo] = useMutation(UPDATE_TODO)
  const [deleteTodo] = useMutation(DELETE_TODO)

  const doComplete = () => {
    updateTodo({
      variables: {
        todo_id: todo.id,
        done: true,
      },
    })
  }

  const doMarkUnfinished = () => {
    updateTodo({
      variables: {
        todo_id: todo.id,
        done: false,
      },
    })
  }

  const doDelete = () => {
    if (
      window.confirm(`Are you sure you want to delete todo '${todo.name}'?`)
    ) {
      deleteTodo({ variables: { todo_id: todo.id } })
    }
  }

  let completed = null
  let btn = null
  if (todo.completed) {
    completed = 'Completed'
    btn = <button onClick={doMarkUnfinished}>Mark unfinished</button>
  } else {
    completed = 'Unfinished'
    btn = <button onClick={doComplete}>Complete</button>
  }

  return (
    <li key={todo.id}>
      {todo.name} ({completed}) {btn} <button onClick={doDelete}>Delete</button>
    </li>
  )
}

function App() {
  const { data, loading } = useSubscription(GET_TODOS)
  const [insertTodo] = useMutation(INSERT_TODO)
  const [todoName, setTodoName] = useState('')

  if (loading) {
    return <div>Loading</div>
  }

  return (
    <div>
      <Link to='/login'>Login</Link>
      <div onClick={() => auth.logout()}>Logout</div>
      <div>
        <form
          onSubmit={async (e) => {
            e.preventDefault()

            try {
              await insertTodo({
                variables: {
                  todo: {
                    name: todoName,
                  },
                },
              })
            } catch (error) {
              alert('Error creating todo')
              console.log(error)
            }
            alert('Todo created')
            setTodoName('')
          }}
        >
          <input
            type='text'
            placeholder='todo'
            value={todoName}
            onChange={(e) => setTodoName(e.target.value)}
          />
          <button>Add todo</button>
        </form>
      </div>
      {!data ? (
        'no data'
      ) : (
        <ul>
          {data.todos.map((todo) => {
            return <TodoItem key={todo.id} todo={todo} />
          })}
        </ul>
      )}
    </div>
  )
}

export default App
