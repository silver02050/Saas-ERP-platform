
import React from "react";

const Login = async () => {

  return (
    
    <div className="flex flex-col min-w-[80%] h-full min-h-[80vh] justify-center items-center">
      <h1 className="text-4xl font-mono text-center font-bold text-primary mb-5">
        You have to have an account to use IGNITE.
      </h1>
      <a href="/api/auth/login" className="text-2xl font-semibold text-primary underline px-2.5 border-2 border-[#fff0] py-1 hover:no-underline hover:border-primary hover:border-b-2">Login or Sign up</a>
    </div>
  );
};

export default Login;
