import React, { useState } from "react";
import login2 from "@/assets/login2.png";
import victory from "@/assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "../../utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store";

const AuthPage = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const loginHandler = async () => {
    try {
      const { data } = await axios.post(LOGIN_ROUTE, { email, password });
      setUserInfo(data);
      navigate("/");
      toast.success("Login Successfull");
    } catch (error) {
      console.log("error: ", error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const signUpHandler = async () => {
    try {
      const { data } = await axios.post(SIGNUP_ROUTE, { email, password });
      setUserInfo(data);
      navigate("/");
      toast.success("Sign Up Success");
    } catch (error) {
      console.log("error: ", error);
      toast.error(error?.response?.data?.message || data.message);
    }
  };
  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center ">
      {/* Auth Box */}
      <div className="h-[80vh] w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl bg-white shadow-xl grid xl:grid-cols-2">
        {/* Login & Sign Up Box */}
        <div className="w-full p-5 flex items-center justify-center gap-10 flex-col">
          {/* Text */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center">
              <h1 className="text-6xl font-bold">Welcome </h1>{" "}
              <img src={victory} alt="victory image" className="h-[100px]" />
            </div>
            <p className="font-medium">
              Sign up to get started with solution for your problems.
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs defaultValue="login" className="w-[90%] ">
              <TabsList className="w-full bg-transparent rounded-none">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent w-full  border-b-2 rounded-none  data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 "
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signUp"
                  className="data-[state=active]:bg-transparent w-full text-black border-b-2 rounded-none text-opacity-90x data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 "
                >
                  Sing Up
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="flex flex-col gap-5 mt-10">
                <Input
                  className="w-full rounded-full p-6"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  className="w-full rounded-full p-6"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button className="p-6 rounded-full" onClick={loginHandler}>
                  Login
                </Button>
              </TabsContent>
              <TabsContent value="signUp" className="flex flex-col gap-5">
                <Input
                  className="w-full rounded-full p-6"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  className="w-full rounded-full p-6"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  className="w-full rounded-full p-6"
                  placeholder="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button className="p-6 rounded-full" onClick={signUpHandler}>
                  Sing Up
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        {/* Image */}
        <div className="w-full hidden xl:flex">
          <img src={login2} alt="login image" />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
