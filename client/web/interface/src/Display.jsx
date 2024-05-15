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
    // Check if this component is the target for update
    if (nextProps.target === nextProps.dbName) {
      // If the 'update' prop has changed, allow re-render
      return prevProps.update === nextProps.update;
    }
    // If this component is not the target, prevent re-render
    return true;
  }
);

export default Display;