const initialState = {
    tasks: [
      { 
        id: 1, 
        title: "Buy Groceries", 
        category: "daily", 
        completed: false, 
        details: "Need to buy vegetables and milk.",
        moodboard: ["https://i.pinimg.com/736x/88/06/b0/8806b09ae8f2fbe1a27595226bc92c10.jpg", "https://i.pinimg.com/736x/88/06/b0/8806b09ae8f2fbe1a27595226bc92c10.jpg"]
      },
      { 
        id: 2, 
        title: "Exercise", 
        category: "weekly", 
        completed: false, 
        details: "Gym workout plan.",
        moodboard: ["https://i.pinimg.com/736x/88/06/b0/8806b09ae8f2fbe1a27595226bc92c10.jpg", "https://i.pinimg.com/736x/88/06/b0/8806b09ae8f2fbe1a27595226bc92c10.jpg"]
      },
    ],
  };
  
  
  const taskReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_TASK":
            return {
              ...state,
              tasks: [...state.tasks, { ...action.payload, moodboard: [] }],
            };
      
          case "TOGGLE_TASK":
            return {
              ...state,
              tasks: state.tasks.map((task) =>
                task.id === action.payload ? { ...task, completed: !task.completed } : task
              ),
            };
      
            case "ADD_IMAGES_TO_TASK":
                return {
                  ...state,
                  tasks: state.tasks.map((task) =>
                    task.id === action.payload.taskId
                      ? { ...task, moodboard: [...task.moodboard, ...action.payload.images] }
                      : task
                  ),
                };
      case "DELETE_TASK":
        return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload) };
  
      default:
        return state;
    }
  };
  
  export default taskReducer;
  