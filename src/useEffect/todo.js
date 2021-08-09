import React, { useEffect, useState } from 'react';

function Todo() {
    const [value, setValue] = useState("");
    const [taskList, setTaskList] = useState([]);
    const setTask = function () {
        let newTaskList = [...taskList];
        newTaskList.push({
            id: Date.now(),
            task: value
        })
        setTaskList(newTaskList);
        setValue("");
    }
    const removeTask = function (id) {
        let restOftasks = taskList.filter(function (taskObject) {
            return taskObject.id != id;
        })
        setTaskList(restOftasks);
    }

    function cleanUP(){
        console.log("Main Clean")
    }

    //multile useEffect can be used

    //    empty dependnecy array -> it will run only once just after first render 
    // useEffect(() => {
    //     console.log("use effect of todo run")
    //     return cleanUP;
    // },[])
    
    //cdm+cdu -> with dependency in arr
    // cleanup function run before useEffect
    // useEffect(() => {
    //     console.log("use effect of todo run")
    //       return cleanUp; 
    // },[value])

    //without any dependency
    // cleanup function run before useEffect
    // useEffect(()=>{
    //     console.log("everyTime");
    // })

    return (
        <>
            <div>
                <input
                    type="text"
                    placeholder="Input Task"
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value)
                    }}
                ></input>
                <button
                    onClick={setTask}
                >Add Task </button>
            </div>
            {taskList.map((taskObj) => {
                return (
                    <Task key={taskObj.id} id={taskObj.id} task={taskObj.task}
                        removeTask={removeTask}
                    ></Task>
                )
            })}
        </>
    )
}
function Task(props) {
    let { id, task, removeTask } = props;
    // useEffect(() => {
    //     console.log("use effect of todo run")
    //     return function(){
    //         console.log(task);
    //     };
    // },[])
    return (
        <li
            onClick={() => {
                removeTask(id)
            }}
        >
            {task}
        </li>
    )
}
export default Todo
