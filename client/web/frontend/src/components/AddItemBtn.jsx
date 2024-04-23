import React from "react";
import { ItemContainer } from "../theme/theme";

const AddItem = (props) => {
  return (
    <ItemContainer onClick={() => props.handleItem(props.cat)}>
      <h3>{props.cat}</h3>
    </ItemContainer>
  );
};

export default AddItem;