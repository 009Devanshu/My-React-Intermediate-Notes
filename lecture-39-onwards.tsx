GLOBAL STATE MANAGEMENT

**********************************************Consolidating State Logic with Reducer**************************

Reducer--> A function that allows us to centralize state updates in a component. 

---------------
counter.tsx
---------------
import { useState } from 'react';

const Counter = () => {
  const [value, setValue] = useState(0);

  return (
    <div>
      Counter ({value})
      <button
        onClick={() => setValue(value + 1)}
        className="btn btn-primary mx-1"
      >
        Increment
      </button>
      <button
        onClick={() => setValue(0)}
        className="btn btn-primary mx-1"
      >
        Reset
      </button>
    </div>
  );
};

export default Counter;

###################################################################
 const [value, setValue] = useState(0); Is used to set and store value. 
 And we have two buttons for resetting it. 
 This component is little bit simple. But, if the component gets more complex, identifying how the states are being changed become little bit challenging. 
 
 So, using reducer we can take all the state management logic outside of this component and centralize it inside a single function. 
 
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>START

state-management
  reducers
    counterReducer.ts
    

A reducer function should have two parameters, 

const counterReducer = (state,action)		//state=> current state, action=> what action should reducer function follow 

and return a new state. 

const counterReducer = (state:number,action:string)  //state is number because state in counter is of number type. 

//There is no hard and fast rule for action, But we are giving string as a type. 

-------------------------
counterReducer.ts
-------------------------
interface Action{
    type:string
}

const counterReducer = (state:number,action:Action):number=>{
    if(action.type==='INCREMENT') return state+1;
    if(action.type==='RESET') return 0;
    return state;

}

export default counterReducer;

---------------------
Counter.tsx
---------------------
import { useReducer, useState } from "react";
import counterReducer from "./reducers/counterReducer";

const Counter = () => {
  const [value, dispatch] = useReducer(counterReducer, 0);

  return (
    <div>
      Counter ({value})
      <button
        onClick={() => dispatch({ type: "INCREMENT" })}
        className="btn btn-primary mx-1"
      >
        Increment
      </button>
      <button
        onClick={() => dispatch({ type: "RESET" })}
        className="btn btn-primary mx-1"
      >
        Reset
      </button>
    </div>
  );
};

export default Counter;

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>END

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>START

---------------------
counterReducer.ts
---------------------
interface Action{
    type:'INCREMENT'|'RESET'
}

const counterReducer = (state:number,action:Action):number=>{
    if(action.type==='INCREMENT') return state+1;
    if(action.type==='RESET') return 0;
    return state;

}

export default counterReducer;

--------------
Counter.tsx
--------------
import { useReducer, useState } from "react";
import counterReducer from "./reducers/counterReducer";

const Counter = () => {
  const [value, dispatch] = useReducer(counterReducer, 0);

  return (
    <div>
      Counter ({value})
      <button
        onClick={() => dispatch({ type: "INCREMENT" })}
        className="btn btn-primary mx-1"
      >
        Increment
      </button>
      <button
        onClick={() => dispatch({ type: "RESET" })}
        className="btn btn-primary mx-1"
      >
        Reset
      </button>
    </div>
  );
};

export default Counter;

-------------
App.tsx
-------------
import "./App.css";
import Counter from "./state-management/Counter";

function App() {
  return <Counter />;
}

export default App;

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>END
  

***************************************************Creating Complex Actions****************************

Let's take more complex example.

Code without modifications.

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>START
----------------
TaskList.tsx
----------------
import { useState } from 'react';

interface Task {
  id: number;
  title: string;
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  return (
    <>
      <button
        onClick={() =>
          setTasks([
            { id: Date.now(), title: 'Task ' + Date.now() },
            ...tasks,
          ])
        }
        className="btn btn-primary my-3"
      >
        Add Task
      </button>
      <ul className="list-group">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span className="flex-grow-1">{task.title}</span>
            <button
              className="btn btn-outline-danger"
              onClick={() =>
                setTasks(tasks.filter((t) => t.id !== task.id))
              }
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TaskList;

---------------
App.tsx
---------------
import "./App.css";
import Counter from "./state-management/Counter";
import TaskList from "./state-management/TaskList";

function App() {
  return <TaskList />;
}

export default App;

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>END


>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>START

----------------
TaskList.tsx
----------------
import { useReducer, useState } from "react";
import tasksReducer from "./reducers/tasksReducer";

const TaskList = () => {
  const [tasks, dispatch] = useReducer(tasksReducer, []);

  return (
    <>
      <button
        onClick={() =>
          dispatch({
            type: "ADD",
            task: { id: Date.now(), title: "Task" + Date.now() },
          })
        }
        className="btn btn-primary my-3"
      >
        Add Task
      </button>
      <ul className="list-group">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span className="flex-grow-1">{task.title}</span>
            <button
              className="btn btn-outline-danger"
              onClick={() => dispatch({ type: "DELETE", taskId: task.id })}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TaskList;

-----------------
tasksReducer.ts
-----------------
interface Task {
    id: number;
    title: string;
  }

interface AddTask{
    type:'ADD';
    task:Task
}

interface DeleteTask{
    type:'DELETE';
    taskId:number
}

type TaskAction = AddTask | DeleteTask;
const tasksReducer = (tasks:Task[],action:TaskAction):Task[]=>{
    switch(action.type){
        case 'ADD':
            return [action.task,...tasks]
        case 'DELETE':
            return tasks.filter(t=>t.id!==action.taskId)
    }
}

export default tasksReducer;

-----------
App.tsx
-----------
import "./App.css";
import Counter from "./state-management/Counter";
import TaskList from "./state-management/TaskList";

function App() {
  return <TaskList />;
}

export default App;


>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>END


************************************************Exercise:Working With Reducer****************************

We have following original code. 

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>START

------------------
LoginStatus.tsx
------------------
import { useState } from "react";

const LoginStatus = () => {
  const [user, setUser] = useState('');

  if (user)
    return (
      <>
        <div>
          <span className="mx-2">{user}</span>
          <a onClick={() => setUser('')} href="#">
            Logout
          </a>
        </div>
      </>
    );
  return (
    <div>
      <a onClick={() => setUser('mosh.hamedani')} href="#">
        Login
      </a>
    </div>
  );
};

export default LoginStatus;


>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>END

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>START

reducers
  authReducer.ts

------------------
LoginStatus.tsx
------------------
import { useReducer, useState } from "react";
import authReducer from "./reducers/authReducer";

const LoginStatus = () => {
  const [user, dispatch] = useReducer(authReducer, "");

  if (user)
    return (
      <>
        <div>
          <span className="mx-2">{user}</span>
          <a onClick={() => dispatch({ type: "LOGOUT" })} href="#">
            Logout
          </a>
        </div>
      </>
    );
  return (
    <div>
      <a
        onClick={() => dispatch({ type: "LOGIN", username: "mosh.hamedani" })}
        href="#"
      >
        Login
      </a>
    </div>
  );
};

export default LoginStatus;

-------------------
authReducer.ts
-------------------
interface LoginAction{
    type:'LOGIN';
    username:string
}
interface LogoutAction{
    type:'LOGOUT';

}

type AuthAction = LoginAction|LogoutAction;
const authReducer = (state:string,action:AuthAction):string=>{
    if(action.type==='LOGIN') return action.username;
    if(action.type==='LOGOUT') return '';
    return state;
}

export default authReducer;

----------------
App.tsx
----------------
import "./App.css";
import LoginStatus from "./state-management/LoginStatus";

function App() {
  return <LoginStatus />;
}

export default App;

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>END


***********************************************Sharing State Using React Context****************************

Sharing State as We know---> 
Lift the state up to the closest parent and pass it down as props to child components. 

React Context
Allows sharing data without passing it down through many components in the middle. 

state-management
  contexts
    tasksContext.ts








