import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect to dashboard since we're using a layout-based routing system
  return <Navigate to="/" replace />;
};

export default Index;
