import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserSignupForm from "@/components/auth/UserSignupForm";
import VendorSignupForm from "@/components/auth/VendorSignupForm";
import Navbar from "@/components/Navbar";

const Signup = () => {
  const [activeTab, setActiveTab] = useState("user");

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Navbar />
      <div className="flex items-center justify-center p-4 pt-20">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Choose how you want to join Shadiejo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">Sign up as User</TabsTrigger>
              <TabsTrigger value="vendor">Sign up as Vendor</TabsTrigger>
            </TabsList>
            
            <TabsContent value="user" className="mt-6">
              <UserSignupForm />
            </TabsContent>
            
            <TabsContent value="vendor" className="mt-6">
              <VendorSignupForm />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline font-medium">
              Login
            </a>
          </div>
        </CardFooter>
      </Card>
      </div>
    </div>
  );
};

export default Signup;

