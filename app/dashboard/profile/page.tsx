'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Loader as Loader2, Save, CircleCheck as CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: updateError } = await updateProfile({
        full_name: fullName,
        phone: phone,
        avatar_url: avatarUrl,
      });

      if (updateError) {
        setError(updateError);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">
          Update your personal information and preferences.
        </p>
      </div>

      {/* Avatar Section */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                <User className="h-10 w-10 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold">{profile.full_name || 'User'}</h3>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                  <span className="mr-1 font-semibold">{profile.loyalty_points ?? 0}</span>
                  Loyalty Points
                </span>
                <span className="text-xs text-muted-foreground">
                  Member since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-sm p-3 rounded-lg border border-emerald-500/20">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Profile updated successfully!
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              readOnly
              className="bg-white/[0.02] border-white/10 text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed. Contact support if you need to update it.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatarUrl">Avatar URL</Label>
            <Input
              id="avatarUrl"
              type="url"
              placeholder="https://example.com/avatar.jpg"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="bg-white/5 border-white/10"
            />
            <p className="text-xs text-muted-foreground">
              Paste a direct link to your profile picture.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setFullName(profile.full_name || '');
                setPhone(profile.phone || '');
                setAvatarUrl(profile.avatar_url || '');
                setError(null);
                setSuccess(false);
              }}
              className="border-white/10 hover:bg-white/5"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
