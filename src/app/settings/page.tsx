"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Mail, Shield } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    eventReminders: boolean;
    eventUpdates: boolean;
    newMessages: boolean;
  };
  privacy: {
    showEmail: boolean;
    showProfile: boolean;
    allowMessaging: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
  };
}

const SettingsPage = () => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      push: true,
      eventReminders: true,
      eventUpdates: true,
      newMessages: true,
    },
    privacy: {
      showEmail: false,
      showProfile: true,
      allowMessaging: true,
    },
    preferences: {
      theme: 'system',
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/user/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast({
          title: "Error",
          description: "Failed to load settings.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchSettings();
    }
  }, [session, toast]);

  const handleSettingChange = (category: keyof UserSettings, setting: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      toast({
        title: "Success",
        description: "Settings saved successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          
          <Tabs defaultValue="notifications" className="space-y-6">
            <TabsList>
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Preferences
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Email Notifications</label>
                      <p className="text-sm text-gray-500">Receive email updates about your events</p>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => 
                        handleSettingChange('notifications', 'email', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Push Notifications</label>
                      <p className="text-sm text-gray-500">Get notified about updates on your device</p>
                    </div>
                    <Switch
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) => 
                        handleSettingChange('notifications', 'push', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Event Reminders</label>
                      <p className="text-sm text-gray-500">Get reminded about upcoming events</p>
                    </div>
                    <Switch
                      checked={settings.notifications.eventReminders}
                      onCheckedChange={(checked) => 
                        handleSettingChange('notifications', 'eventReminders', checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Show Email Address</label>
                      <p className="text-sm text-gray-500">Make your email visible to other users</p>
                    </div>
                    <Switch
                      checked={settings.privacy.showEmail}
                      onCheckedChange={(checked) => 
                        handleSettingChange('privacy', 'showEmail', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Public Profile</label>
                      <p className="text-sm text-gray-500">Make your profile visible to others</p>
                    </div>
                    <Switch
                      checked={settings.privacy.showProfile}
                      onCheckedChange={(checked) => 
                        handleSettingChange('privacy', 'showProfile', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Allow Messaging</label>
                      <p className="text-sm text-gray-500">Let others send you messages</p>
                    </div>
                    <Switch
                      checked={settings.privacy.allowMessaging}
                      onCheckedChange={(checked) => 
                        handleSettingChange('privacy', 'allowMessaging', checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Theme</label>
                    <select
                      className="w-full px-3 py-2 border rounded-lg"
                      title='Theme'
                      value={settings.preferences.theme}
                      onChange={(e) => 
                        handleSettingChange('preferences', 'theme', e.target.value)
                      }
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Language</label>
                    <select
                      className="w-full px-3 py-2 border rounded-lg"
                      title='Language'
                      value={settings.preferences.language}
                      onChange={(e) => 
                        handleSettingChange('preferences', 'language', e.target.value)
                      }
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Timezone</label>
                    <select
                      className="w-full px-3 py-2 border rounded-lg"
                      title='Timezone'
                      value={settings.preferences.timezone}
                      onChange={(e) => 
                        handleSettingChange('preferences', 'timezone', e.target.value)
                      }
                    >
                      {Intl.supportedValuesOf('timeZone').map((zone) => (
                        <option key={zone} value={zone}>{zone}</option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={saveSettings}
              disabled={isSaving}
              className="w-full sm:w-auto"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;