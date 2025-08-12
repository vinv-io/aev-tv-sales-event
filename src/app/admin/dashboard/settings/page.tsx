'use client';

// Disable static generation for this client-side page
export const dynamic = 'force-dynamic'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Site Settings</h1>
            <p className="text-muted-foreground">Manage your site settings and preferences.</p>
        </div>
        <Button>Save Changes</Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of your site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <Input id="logo" type="file" />
                <p className="text-sm text-muted-foreground">Upload a new logo for your site. (e.g., PNG, JPG, SVG)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="background-image">Homepage Background Image</Label>
                <Input id="background-image" type="file" />
                 <p className="text-sm text-muted-foreground">Upload a new background image for the homepage.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Navigation Menus</CardTitle>
              <CardDescription>Manage the links in your header and footer.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder for menu management */}
              <p className="text-muted-foreground">Header and footer menu management coming soon.</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
           <Card>
            <CardHeader>
              <CardTitle>Footer Information</CardTitle>
              <CardDescription>Update the contact details in your site&apos;s footer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="footer-address">Address</Label>
                <Textarea id="footer-address" defaultValue="123 Promotion Street, Suite 100\nHanoi, Vietnam" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footer-contact">Contact Phone</Label>
                <Input id="footer-contact" defaultValue="(123) 456-7890" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
