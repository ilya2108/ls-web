import PrimaryItemDropdown, {dropdownItemsType} from "./PrimaryItemDropdown";
import PrimaryItem from "./PrimaryItem";

const TasksDropdown = () => {
  const dropdownItems: dropdownItemsType = {
    title: "Tasks",
    items: [
      {
        label: "Create Task",
        action: () => console.log("Create Task!"),
      },
      {
        label: "Show Tasks",
        link: "/TasksPage",
      },
    ],
  };
  return <PrimaryItemDropdown dropdownItems={dropdownItems} />;
};

const ExamsDropdown = () => {
  const dropdownItems: dropdownItemsType = {
    title: "Exams",
    items: [
      {
        label: "Start Exam!",
        action: () => console.log("Start Exam!"),
      },
      {
        label: "Create Exam",
        action: () => console.log("Create Exam!"),
      },
      {
        label: "Show Exams",
        link: "/ExamsPage",
      },
    ],
  };
  return <PrimaryItemDropdown dropdownItems={dropdownItems} />;
};

const PrimaryItems = [
    <TasksDropdown />,
    <ExamsDropdown />,
    <PrimaryItem href="/UsersPage">Users</PrimaryItem>,
];

export default PrimaryItems;