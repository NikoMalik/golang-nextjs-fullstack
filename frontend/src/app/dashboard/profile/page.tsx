"use client";
import { useState } from "react";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/components/Usercontext";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface User {
  name: string;
  email: string;
  imageUrl: string | null | undefined;
  subscriptionPlan: string | null | undefined;
  stripeCurrentPeriodEnd: string | null | undefined;
}

const ProfileTab = ({ user }: { user: User }) => {
  const { setUser } = useUser();
  const [avatar, setAvatar] = useState<File | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm()

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatar) return;

    const formData = new FormData();
    formData.append("image", avatar);

    try {
      const response = await fetch("http://localhost:8000/api/auth/update-avatar", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user); 
        toast.success('Avatar updated successfully');
      } else {
        toast.error('Failed to upload avatar');
      }
    } catch (error) {
      toast.error('Error uploading avatar');
    }
  };

  const handleProfileUpdate = async (data) => {
    try {
      const response = await fetch("http://localhost:8000/api/auth/updateInfo", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser.user); 
        toast.success('Profile updated successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleProfileUpdate)}>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your profile information.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="avatar">Avatar</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage alt={user.name} src={user.imageUrl || "/placeholder-avatar.jpg"} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <Input type="file" id="picture" onChange={handleAvatarChange} />
                <Button variant="outline" className="w-full md:w-auto" onClick={handleAvatarUpload}>
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Upload new
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea className="resize-none" id="bio" placeholder="Tell us about yourself..." />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={user.name} placeholder="Enter your name" {...register("name")} className={cn({ "focus-visible:ring-red-500": errors.name })} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={user.email} placeholder="Enter your email" type="email" {...register("email")} className={cn({ "focus-visible:ring-red-500": errors.email })} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full md:w-auto" disabled={false} onClick={handleSubmit(handleProfileUpdate)}>Save</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

const PlanTab = ({ user }: { user: User }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan</CardTitle>
        <CardDescription>Manage your subscription plan.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="subscriptionPlan">Subscription Plan</Label>
          <Input id="subscriptionPlan" defaultValue={user.subscriptionPlan} readOnly />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="stripeCurrentPeriodEnd">Subscription End Date</Label>
          <Input id="stripeCurrentPeriodEnd" defaultValue={user.stripeCurrentPeriodEnd} readOnly />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full md:w-auto">Manage Subscription</Button>
      </CardFooter>
    </Card>
  );
};

const NotificationsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Manage your notification preferences.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center gap-4">
          <Label htmlFor="email-notifications">Email Notifications</Label>
          <Switch id="email-notifications" />
        </div>
        <div className="flex items-center gap-4">
          <Label htmlFor="sms-notifications">SMS Notifications</Label>
          <Switch id="sms-notifications" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full md:w-auto">Save Preferences</Button>
      </CardFooter>
    </Card>
  );
};

const Page = () => {
  const { user, loading, error } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user data</div>;
  }

  return (
    <MaxWidthWrapper className="flex flex-col p-4 md:p-8">
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileTab user={user} />
        </TabsContent>
        <TabsContent value="plan">
          <PlanTab user={user} />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
      </Tabs>
    </MaxWidthWrapper>
  );
};

function UploadIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

export default Page;