import styled from "styled-components";
import Tooltip, {TooltipPrimitive} from '@atlaskit/tooltip';


// Tooltip styled component
export const SearchResultToolTip = styled(TooltipPrimitive)`
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  box-sizing: content-box; /* do not set this to border-box or it will break the overflow handling */
  color: #333;
  min-width:400px;
  max-width: 1200px;
  padding: 8px 12px;
`;
