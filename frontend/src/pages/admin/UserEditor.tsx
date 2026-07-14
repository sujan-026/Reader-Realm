import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { API_URL } from "@/lib/api";

const UserEditor = () => {
  const { id } = useParams(); // `id` corresponds to the user _id
  const navigate = useNavigate();
  const isNewUser = id === "new";

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    isActive: true,
  });

  useEffect(() => {
    // Load user data when editing an existing user (not a new one)
    if (!isNewUser && id) {
      fetch(`${API_URL}/api/users/${id}`) // Fetch user by _id
        .then((response) => response.json())
        .then((data) => {
          setFormData({
            name: data.name,
            email: data.email,
            role: data.role,
            isActive: data.isActive,
          });
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
          toast.error("Failed to load user data");
        });
    }
  }, [id, isNewUser]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const url = isNewUser
      ? `${API_URL}/api/users`
      : `${API_URL}/api/users/${id}`;

    const method = isNewUser ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save user: ${response.statusText}`);
      }

      const result = await response.json();
      toast.success(
        isNewUser ? "User created successfully" : "User updated successfully"
      );
      navigate("/admin/users");
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Failed to save user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {isNewUser ? "Add New User" : "Edit User"}
            </h1>
            <p className="text-muted-foreground">
              {isNewUser ? "Add a new user" : "Update the details of this user"}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 border rounded-lg p-6"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  name="role"
                  title="User Role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">Active User</Label>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Toggle to activate or deactivate the user account
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save User
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default UserEditor;
