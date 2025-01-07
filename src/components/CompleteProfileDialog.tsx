import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { toast } from "@/hooks/use-toast";

interface GoogleUser {
  id?: string;
  name?: string;
  email?: string;
  provider?: string;
}

interface CompleteProfileDialogProps {
  isOpen: boolean;
  googleUser: GoogleUser;
  onProfileComplete: (data: any) => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

const CompleteProfileDialog: React.FC<CompleteProfileDialogProps> = ({ 
  isOpen, 
  googleUser, 
  onProfileComplete 
}) => {
  const { update: updateSession } = useSession();
  const [formData, setFormData] = useState<FormData>({
    firstName: googleUser?.name?.split(' ')[0] || '',
    lastName: googleUser?.name?.split(' ').slice(1).join(' ') || '',
    email: googleUser?.email || '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Please enter both first and last name');
      return false;
    }
    if (!formData.password || formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (!formData.role) {
      setError('Please select a role');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          googleId: googleUser.id,
          provider: 'google'
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error creating profile');
      }

      // First update the session with new user data
      await updateSession({
        user: {
          name: `${formData.firstName} ${formData.lastName}`,
          role: formData.role,
          email: formData.email,
        }
      });

      // Then notify parent component
      onProfileComplete({
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role
      });

      toast({
        title: "Success",
        description: "Account details updated! Please login back to see the changes",
        variant: "default",
        className: 'bg-green-100 border-green-300 text-white-700'
      });

    } catch (err: any) {
      setError(err.message || 'An error occurred while creating your profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Please provide additional information to complete your profile. This is required for Google sign-in users.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 text-sm bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  firstName: e.target.value
                }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  lastName: e.target.value
                }))}
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
              disabled
              className="bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Create Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                password: e.target.value
              }))}
              required
              minLength={8}
            />
            <p className="text-sm text-gray-500">
              Password must be at least 8 characters long
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Select Role</Label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                role: e.target.value
              }))}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select a role</option>
              <option value="Organizer">Organizer</option>
              <option value="Co-organizer">Co-organizer</option>
              <option value="Attendee">Attendee</option>
            </select>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Complete Profile'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteProfileDialog;