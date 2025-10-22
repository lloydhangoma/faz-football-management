import React from "react";

const LoaderSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-8">
    <div className="flex space-x-2">
      <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
      <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
      <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
    </div>
  </div>
);

export default LoaderSpinner;