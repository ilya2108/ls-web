import { Search as AKSearch } from "@atlaskit/atlassian-navigation";
import { useDispatch, useSelector } from "react-redux";
import { openSearchDrawer } from "../../../modules/core/redux/drawer/drawer.actions";

const Search = () => {
  const isOpen = useSelector(state => state.drawers.searchDrawer)
  const dispatch = useDispatch();
  const dispatchOpenSearchDrawer = () => dispatch(openSearchDrawer());

  return (
    <AKSearch
      onClick={() => dispatchOpenSearchDrawer()}
      placeholder="Search..."
      tooltip="Search"
      label="Search"
      isSelected={isOpen}
    />
  );
};

export default Search;