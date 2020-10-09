import PrimaryItemDropdown from "./PrimaryItemDropdown";
import PrimaryItem from "./PrimaryItem";

const TasksDropdown = () => {
  const dropdownItems = {
    title: "Tasks",
    path: "/TasksPage",
    items: [
      {
        text: "Create Task",
        action: () => console.log("Create Task!"),
      },
      {
        text: "Show Tasks",
        link: "/TasksPage",
      },
    ],
  };
  return <PrimaryItemDropdown dropdownItems={dropdownItems} />;
};

const ExamsDropdown = () => {
  const dropdownItems = {
    title: "Exams",
    path: "/ExamsPage",
    items: [
      {
        text: "Start Exam!",
        action: () => console.log("Start Exam!"),
      },
      {
        text: "Create Exam",
        action: () => console.log("Create Exam!"),
      },
      {
        text: "Show Exams",
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