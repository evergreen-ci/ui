import { useState, useEffect } from "react";
import { ShortenedRouterLink } from "components/styles";
import { getTaskRoute } from "constants/routes";

interface TaskLinkProps {
  "data-cy": string;
  taskId: string;
}

export const TaskLink: React.FC<TaskLinkProps> = ({
  "data-cy": dataCy,
  taskId,
}) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const linkWidth = screenWidth > 1200 ? screenWidth - 1000 : 200;

  return (
    <ShortenedRouterLink
      data-cy={dataCy}
      title={taskId}
      to={getTaskRoute(taskId)}
      width={linkWidth}
    >
      {taskId + taskId}
    </ShortenedRouterLink>
  );
};
