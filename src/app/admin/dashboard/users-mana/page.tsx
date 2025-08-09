'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { hasPermission, PERMISSIONS } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { formatDateForUI } from '@/lib/utils';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { UserPlus, Edit, Trash2, MoreHorizontal, Shield, User } from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  role: {
    id: string;
    name: string;
    displayName: string;
    permissions: string;
  };
  creator?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface AdminRole {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  permissions: string;
  isActive: boolean;
  _count: {
    users: number;
  };
}

export default function UsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    roleId: '',
    isActive: true,
  });

  // Check permissions
  const canRead = session?.user && hasPermission(session.user.permissions, PERMISSIONS.USER_READ);
  const canCreate = session?.user && hasPermission(session.user.permissions, PERMISSIONS.USER_CREATE);
  const canUpdate = session?.user && hasPermission(session.user.permissions, PERMISSIONS.USER_UPDATE);
  const canDelete = session?.user && hasPermission(session.user.permissions, PERMISSIONS.USER_DELETE);

  // Load data
  useEffect(() => {
    if (canRead) {
      loadData();
    }
  }, [canRead]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load users and roles in parallel
      const [usersResponse, rolesResponse] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/roles'),
      ]);

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData);
      }

      if (rolesResponse.ok) {
        const rolesData = await rolesResponse.json();
        setRoles(rolesData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      roleId: '',
      isActive: true,
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreate) return;

    try {
      setCreating(true);
      
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newUser = await response.json();
        setUsers([newUser, ...users]);
        setShowCreateDialog(false);
        resetForm();
        toast({
          title: 'Success',
          description: 'User created successfully',
          variant: 'default',
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to create user',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to create user',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canUpdate || !selectedUser) return;

    try {
      setEditing(true);
      
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(user => user.id === selectedUser.id ? updatedUser : user));
        setShowEditDialog(false);
        setSelectedUser(null);
        resetForm();
        toast({
          title: 'Success',
          description: 'User updated successfully',
          variant: 'default',
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to update user',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user',
        variant: 'destructive',
      });
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!canDelete || !selectedUser) return;

    try {
      setDeleting(true);
      
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== selectedUser.id));
        setShowDeleteDialog(false);
        setSelectedUser(null);
        toast({
          title: 'Success',
          description: 'User deleted successfully',
          variant: 'default',
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to delete user',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };

  const openEditDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      username: user.username,
      password: '',
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: user.role.id,
      isActive: user.isActive,
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Please log in to access this page.</p>
      </div>
    );
  }

  if (!canRead) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You don't have permission to view users.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage admin users and their roles
          </p>
        </div>
        {canCreate && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new admin user to the system.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.roleId} onValueChange={(value) => setFormData({ ...formData, roleId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateDialog(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={creating}>
                    {creating ? 'Creating...' : 'Create User'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            A list of all admin users in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <User className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No users found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        <div className="text-xs text-muted-foreground">@{user.username}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        <Shield className="h-3 w-3" />
                        {user.role.displayName}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDateForUI(user.createdAt)}
                      </div>
                      {user.creator && (
                        <div className="text-xs text-muted-foreground">
                          by {user.creator.firstName} {user.creator.lastName}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.lastLoginAt ? (
                        <div className="text-sm">
                          {formatDateForUI(user.lastLoginAt)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {canUpdate && (
                            <DropdownMenuItem onClick={() => openEditDialog(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {canDelete && user.id !== session.user.id && (
                            <DropdownMenuItem 
                              onClick={() => openDeleteDialog(user)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editFirstName">First Name</Label>
                <Input
                  id="editFirstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLastName">Last Name</Label>
                <Input
                  id="editLastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editEmail">Email</Label>
              <Input
                id="editEmail"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editUsername">Username</Label>
              <Input
                id="editUsername"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editPassword">New Password (leave blank to keep current)</Label>
              <Input
                id="editPassword"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter new password or leave blank"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editRole">Role</Label>
              <Select value={formData.roleId} onValueChange={(value) => setFormData({ ...formData, roleId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="editIsActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="editIsActive">Active</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEditDialog(false);
                  setSelectedUser(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={editing}>
                {editing ? 'Updating...' : 'Update User'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user &quot;{selectedUser?.firstName} {selectedUser?.lastName}&quot; 
              and remove all their access to the system. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDeleteDialog(false);
              setSelectedUser(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
