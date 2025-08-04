import { Suspense, lazy } from "react";

const NotFoundSvg = lazy(() => import("./NotFoundSvg"));

const NotFound: React.FC = () => (
  <Suspense fallback={<div>Loading</div>}>
    <NotFoundSvg />
  </Suspense>
);

export default NotFound;
