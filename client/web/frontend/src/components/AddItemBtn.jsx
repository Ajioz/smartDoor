import React from "react";
import { ItemContainer } from "../theme/theme";

const AddItem = (props) => {
  const handleClick = () => {
    if (props.new)
      return props.handleItem(
        false,
        " ",
        true,
        props.label1,
        props.label2,
        props.cat,
        ""
        // handleItem(delete, id, disable, label1, label2, category, name)
      );
    else return props.handleItem(props.cat);
  };

  return (
    <ItemContainer onClick={handleClick}>
      <h3>{props.cat}</h3>
    </ItemContainer>
  );
};

export default AddItem;
