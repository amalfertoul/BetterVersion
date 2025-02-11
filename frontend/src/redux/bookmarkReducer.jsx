const initialState = {
    isBookmarked: false,
  };
  
  const bookmarkReducer = (state = initialState, action) => {
    switch (action.type) {
      case "TOGGLE_BOOKMARK":
        return {
          ...state,
          isBookmarked: !state.isBookmarked,
        };
      default:
        return state;
    }
  };
  
  export default bookmarkReducer;
  