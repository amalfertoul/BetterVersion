
  export const deleteTask = (taskId) => ({
    type: "DELETE_TASK",
    payload: taskId,
  });

  


export const addTask = (task) => ({
  type: "ADD_TASK",
  payload: task,
});

export const toggleTask = (taskId) => ({
  type: "TOGGLE_TASK",
  payload: taskId,
});

export const addImagesToTask = (taskId, images) => ({
  type: "ADD_IMAGES_TO_TASK",
  payload: { taskId, images },
});

  

