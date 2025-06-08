import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Loading from "@components/Loading";
import "@fontsource-variable/public-sans";

const AuthLayout = () => {
  return (
    <>
      <div className="bg-dark-200 flex h-screen items-center justify-center">
        <div className="width-[450px] h-fit rounded-lg bg-white px-8 py-10 shadow-md">
          <div className="mx-auto mb-6 h-[55px] w-[58px]">
            <img src="/threads.png" alt="Logo" className="h-full w-full" />
          </div>
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
