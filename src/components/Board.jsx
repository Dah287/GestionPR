import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";

import Column from "./Column";

const TaskBoard = () => {
    const [todo, setTodo] = useState([]);
    const [inProgress, setInProgress] = useState([]);
    const [done, setDone] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/tasks")
            .then((response) => response.json())
            .then((json) => {
                setTodo(json.filter((task) => task.status === "TODO"));
                setInProgress(json.filter((task) => task.status === "IN_PROGRESS"));
                setDone(json.filter((task) => task.status === "DONE"));
            });
    }, []);

    const handleDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        if (!destination || source.droppableId === destination.droppableId) return;

        const task = findItemById(draggableId, [...todo, ...inProgress, ...done]);
        if (!task) return;

        deletePreviousState(source.droppableId, draggableId);
        setNewState(destination.droppableId, task);
    };

    function deletePreviousState(sourceDroppableId, taskId) {
        switch (sourceDroppableId) {
            case "1":
                setTodo(removeItemById(taskId, todo));
                break;
            case "2":
                setInProgress(removeItemById(taskId, inProgress));
                break;
            case "3":
                setDone(removeItemById(taskId, done));
                break;
        }
    }

    function setNewState(destinationDroppableId, task) {
        let updatedTask;
        switch (destinationDroppableId) {
            case "1":
                updatedTask = { ...task, status: "TODO" }; // TODO en majuscule
                setTodo([updatedTask, ...todo]);
                break;
            case "2":
                updatedTask = { ...task, status: "IN_PROGRESS" }; // IN_PROGRESS en majuscule
                setInProgress([updatedTask, ...inProgress]);
                break;
            case "3":
                updatedTask = { ...task, status: "DONE" }; // DONE en majuscule
                setDone([updatedTask, ...done]);
                break;
        }
        updateTaskInDatabase(updatedTask);
    }

    function updateTaskInDatabase(task) {
        console.log("Updating task in DB:", task); // Debugger pour voir la tâche envoyée
        fetch(`http://localhost:8080/api/tasks/${task.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task)
        })
        .then((response) => response.json())
        .then((json) => console.log("Response from DB:", json))
        .catch((error) => console.error("Error updating task in DB:", error)); // Log d'erreur
    }

    function findItemById(id, array) {
        return array.find((item) => item.id == id);
    }

    function removeItemById(id, array) {
        return array.filter((item) => item.id != id);
    }

    const handleStatusChange = (task, newStatus) => {
        const updatedTask = { ...task, status: newStatus.toUpperCase() }; // Conversion en majuscule
        updateTaskInDatabase(updatedTask);
        
        if (newStatus === "TODO") {
            setTodo([updatedTask, ...todo]);
            setInProgress(removeItemById(task.id, inProgress));
            setDone(removeItemById(task.id, done));
        } else if (newStatus === "IN_PROGRESS") {
            setInProgress([updatedTask, ...inProgress]);
            setTodo(removeItemById(task.id, todo));
            setDone(removeItemById(task.id, done));
        } else if (newStatus === "DONE") {
            setDone([updatedTask, ...done]);
            setInProgress(removeItemById(task.id, inProgress));
            setTodo(removeItemById(task.id, todo));
        }
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <h2 style={{ textAlign: "center" }}>Tableau de tâches</h2>
            <div style={{ display: "flex", justifyContent: "space-between", width: "90%", margin: "0 auto",paddingLeft:"110px" }}>
                <Column title={"À Faire"} tasks={todo} id={"1"} style={{ flexGrow: 1 }} />
                <Column title={"En Cours"} tasks={inProgress} id={"2"} style={{ flexGrow: 1 }} />
                <Column title={"Terminées"} tasks={done} id={"3"} style={{ flexGrow: 1 }} />
            </div>
        </DragDropContext>
    );
    
};

export default TaskBoard;
