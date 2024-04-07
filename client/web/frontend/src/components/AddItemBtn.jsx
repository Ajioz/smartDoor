import React from "react";
import { ItemContainer } from "../theme/theme";

const AddItem = (props) => {


  return (
    <ItemContainer onClick={() => props.handleItem(props.id)}>
      <h3>{props.id}</h3>
    </ItemContainer>
  );
};

export default AddItem;
