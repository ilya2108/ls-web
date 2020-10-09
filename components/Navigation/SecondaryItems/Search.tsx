import { Search as AKSearch } from "@atlaskit/atlassian-navigation";
import { useDispatch } from "react-redux";
import { openSearchDrawer } from "../../../modules/core/redux/drawer/drawer.actions";

const Search = () => {
  const dispatch = useDispatch();
  const dispatchOpenSearchDrawer = () => dispatch(openSearchDrawer());

  return (
    <AKSearch
      onClick={() => dispatchOpenSearchDrawer()}
      placeholder="Search..."
      tooltip="Search"
      label="Search"
    />
  );
};

export default Search;