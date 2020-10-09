// documentation
// https://atlaskit.atlassian.com/packages/design-system/drawer

// dependencies
import {
    SideNavigation,
    NavigationContent,
    ButtonItem,
  } from "@atlaskit/side-navigation";

  import CalendarIcon from "@atlaskit/icon/glyph/calendar";
  import EmojiObjectsIcon from "@atlaskit/icon/glyph/emoji/objects";
  import EmojiNatureIcon from "@atlaskit/icon/glyph/emoji/nature";


const forbidden = () => {
  alert("Not available yet")
}

// New SideNavigation
const CreateDrawer: React.FunctionComponent = () => (
    <SideNavigation label="project">
    <NavigationContent>
      <ButtonItem onClick={forbidden} iconBefore={<CalendarIcon label=""/>}>Start Exam <strong>right now</strong></ButtonItem>
      <ButtonItem onClick={forbidden} iconBefore={<EmojiObjectsIcon label=""/>}>Create Exam</ButtonItem>
      <ButtonItem onClick={forbidden} iconBefore={<EmojiNatureIcon label=""/>}>Create Assignment</ButtonItem>
    </NavigationContent>
  </SideNavigation>
);

export default CreateDrawer;