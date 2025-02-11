import React from "react";
import { connect } from "react-redux";
import "../styles/bookmark.css";


const Bookmark = ({ isBookmarked, toggleBookmark }) => {
  return (
    <label className="ui-bookmark">
      <input type="checkbox" checked={isBookmarked} onChange={toggleBookmark} />
      <div className="bookmark">
        <svg viewBox="0 0 32 32">
          <g>
            <path d="M27 4v27a1 1 0 0 1-1.625.781L16 24.281l-9.375 7.5A1 1 0 0 1 5 31V4a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4z"></path>
          </g>
        </svg>
      </div>
    </label>
  );
};

const mapStateToProps = (state) => ({
  isBookmarked: state.bookmark.isBookmarked,
});

const mapDispatchToProps = (dispatch) => ({
  toggleBookmark: () => dispatch({ type: "TOGGLE_BOOKMARK" }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Bookmark);
