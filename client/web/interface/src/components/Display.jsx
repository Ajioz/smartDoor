import React, { memo } from "react";

const Display = memo(
  ({ message, id, target }) => {
    return (
      <div className="display">
        <h4>{message}</h4>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return nextProps.target === nextProps.id && nextProps.message;
  }
);

export default Display;