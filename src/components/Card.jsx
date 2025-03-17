import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { Avatar } from "antd";
import { FaRegClock, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { Tooltip } from "antd";  // Importer Tooltip d'Ant Design

const Container = styled.div`
    border-radius: 10px;
    box-shadow: 5px 5px 5px 2px grey;
    padding: 8px;
    color: #000;
    margin-bottom: 8px;
    min-height: 120px;
    margin-left: 10px;
    margin-right: 10px;
    background-color: ${(props) => bgcolorChange(props)};
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
`;

const TextContent = styled.div``;

const Icons = styled.div`
    display: flex;
    justify-content: space-between; /* Place les éléments aux extrémités */
    padding: 2px;
    align-items: center; /* Centrer verticalement les éléments */
`;

function bgcolorChange(props) {
    return props.isDragging
        ? "lightgreen"
        : props.isDraggable
            ? props.isBacklog
                ? "#F2D7D5"
                : "#DCDCDC"
            : props.isBacklog
                ? "#F2D7D5"
                : "#EAF4FC";
}

export default function Card({ task, index }) {
    const updateTaskStatus = (id, status) => {
        console.log(`Mettre à jour le statut de la tâche ${id} vers ${status}`);
        // Ajoutez ici votre logique pour mettre à jour le statut de la tâche
    };

    const TextContent = ({ children }) => (
        <div
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '500px',
          }}
        >
          {children}
        </div>
      );

    return (
        <Draggable draggableId={`${task.id}`} key={task.id} index={index}>
            {(provided, snapshot) => (
                <Container
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    isDragging={snapshot.isDragging}
                >
                    <div style={{ display: "flex", justifyContent: "start", padding: 2 }}>
                        <span>
                            <small>
                                #{task.id} {"  "}
                            </small>
                        </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", padding: 2 }}>
                        <TextContent>{task.title}</TextContent>
                    </div>
                    <Icons>
                        {/* Icônes à gauche */}
                        <div style={{ display: "flex", gap: "10px" }}>
                            <Tooltip title="Changer statut à TODO">
                                <FaRegClock
                                    size={15}
                                    color={task.status === "TODO" ? "gray" : "black"}
                                    onClick={() => updateTaskStatus(task.id, "TODO")}
                                />
                            </Tooltip>
                            <Tooltip title="Changer statut à En Cours">
                                <FaSpinner
                                    size={15}
                                    color={task.status === "IN_PROGRESS" ? "gray" : "black"}
                                    onClick={() => updateTaskStatus(task.id, "IN_PROGRESS")}
                                />
                            </Tooltip>
                            <Tooltip title="Changer statut à Terminé">
                                <FaCheckCircle
                                    size={15}
                                    color={task.status === "DONE" ? "gray" : "black"}
                                    onClick={() => updateTaskStatus(task.id, "DONE")}
                                />
                            </Tooltip>
                        </div>

                        {/* Avatar à droite */}
                        <Avatar
                            onClick={() => console.log(task)}
                            src={`/icon${task.utilisateur.id}.png`}
                        />
                    </Icons>
                    {provided.placeholder}
                </Container>
            )}
        </Draggable>
    );
}
