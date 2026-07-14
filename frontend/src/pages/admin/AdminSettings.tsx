import { AdminLayout } from "../../components/admin/AdminLayout";
import { User, Settings, LogIn, Check } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { API_URL } from "@/lib/api";

const AdminSettings = () => {
  const { user, isAuthenticated, updateUser } = useUser() as any;

  // Form state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form to current user data
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setRole(user.role || "");
      setPassword("");
      setConfirmPassword("");
      setErrors({});
    }
  }, [user]);

  // If the user is not authenticated or is not an admin, redirect
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <LogIn className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2 max-w-md">
            <h1 className="text-2xl font-bold">Admin Access Required</h1>
            <p className="text-muted-foreground">
              You need admin privileges to access this page
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Validate form fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (email && !/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Email is invalid";

    if (password) {
      if (password.length < 8)
        newErrors.password = "Password must be at least 8 characters";
      if (password !== confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form data
    if (!validateForm()) return;

    // Collect form data
    const updateData: { id: string; name: string; email: string; role: string; password?: string } = {
      id: user.id, // Use id for the database ID
      name,
      email,
      role,
    };

    if (password) {
      updateData.password = password;
    }

    const url = `${API_URL}/api/users/${user.id}`;
    const method = "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.statusText}`);
      }

      const result = await response.json();

      // Update the user context with new data
      updateUser(result);

      // Clear password fields
      setPassword("");
      setConfirmPassword("");

      // Show success message
      toast({ variant: "success", description: "Profile updated successfully" });
    } catch (error) {
      console.error("Error saving user:", error);
      toast({ variant: "destructive", description: "Failed to save user" });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <AdminLayout>
      <div className="container mx-auto px-4 pt-8 animate-fade-in">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 bg-background/50 p-6 rounded-lg shadow-sm">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-12 w-12 text-muted-foreground" />
            )}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-sm mt-1">
              Role: <span className="font-medium">{user.role}</span>
            </p>
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                disabled
                className="font-medium"
              >
                Admin Dashboard
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="settings" className="w-full">
          <TabsContent value="settings" className="mt-6 animate-fade-in">
            <div className="max-w-2xl mx-auto bg-background/50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="h-5 w-5" />
                <h2 className="text-xl font-bold">Admin Settings</h2>
              </div>

              <div className="space-y-6">
                {/* Display Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Display Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full rounded-md border ${
                      errors.name ? "border-red-500" : "border-input"
                    } bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full rounded-md border ${
                      errors.email ? "border-red-500" : "border-input"
                    } bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label htmlFor="role" className="block text-sm font-medium">
                    Role
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium"
                  >
                    New Password (leave blank to keep current)
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full rounded-md border ${
                      errors.password ? "border-red-500" : "border-input"
                    } bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring`}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full rounded-md border ${
                      errors.confirmPassword ? "border-red-500" : "border-input"
                    } bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Save Button */}
                <div className="pt-4">
                  <Button
                    type="button"
                    onClick={handleSaveChanges}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {isLoading ? (
                      <>
                        <span className="mr-2">⌛</span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
