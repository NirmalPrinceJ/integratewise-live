'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, Zap, Hand } from 'lucide-react';
import { useBuckets } from '@/hooks/useBuckets';
import { useSession } from '@/hooks/use-session';

interface AddBucketModalProps {
  isOpen: boolean;
  onClose: () => void;
  bucketType: string;
  onSuccess: () => void;
}

const BUCKET_NAMES = {
  B0: 'Identity & Workspace',
  B1: 'Tasks & Projects',
  B2: 'Calendar & Meetings',
  B3: 'Docs & Knowledge',
  B4: 'Communications',
  B5: 'CRM / Accounts',
  B6: 'Integrations & Automations',
  B7: 'Governance & Compliance',
};

const SEED_METHODS = [
  {
    id: 'manual',
    label: 'Add Manually',
    description: 'Create items directly in the workspace',
    icon: Hand,
  },
  {
    id: 'upload',
    label: 'Upload File',
    description: 'Import from CSV, JSON, or PDF',
    icon: Upload,
  },
  {
    id: 'connector',
    label: 'Connect Service',
    description: 'Sync from Salesforce, Google, Slack, etc.',
    icon: Zap,
  },
];

export default function AddBucketModal({
  isOpen,
  onClose,
  bucketType,
  onSuccess,
}: AddBucketModalProps) {
  const { addBucket } = useBuckets();
  const { user } = useSession();
  const [seedMethod, setSeedMethod] = useState('manual');
  const [connectedSource, setConnectedSource] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const displayName = BUCKET_NAMES[bucketType as keyof typeof BUCKET_NAMES] || bucketType;

  const handleSubmit = async () => {
    setIsLoading(true);
    setUploadError('');
    try {
      if (seedMethod === 'upload' && !uploadFile) {
        setUploadError('Please select a file to upload.');
        setIsLoading(false);
        return;
      }

      const bucketResponse = await addBucket(bucketType, seedMethod, connectedSource || undefined);
      const bucketId =
        bucketResponse?.bucket?.bucketId ||
        bucketResponse?.bucket?.bucket_id ||
        bucketResponse?.bucketId ||
        '';

      if (seedMethod === 'upload') {
        const loaderUrl = process.env.NEXT_PUBLIC_LOADER_URL || 'http://localhost:8787';
        const tenantId = user?.workspace_id || user?.id || 'default_tenant';

        const formData = new FormData();
        formData.append('file', uploadFile as File);
        formData.append('tenantId', tenantId);
        formData.append('bucketType', bucketType);
        formData.append('bucketId', bucketId);

        const res = await fetch(`${loaderUrl}/loader/ingest`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || 'Upload failed');
        }
      }

      onSuccess();
    } catch (error) {
      console.error('Error adding bucket:', error);
      if (seedMethod === 'upload') {
        setUploadError('Upload failed. Please try again or switch to manual/connector.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add {displayName}</DialogTitle>
          <DialogDescription>
            Choose how you want to populate this data source
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Seed method selection */}
          <div>
            <h3 className="text-sm font-semibold mb-4">How would you like to get started?</h3>
            <RadioGroup value={seedMethod} onValueChange={setSeedMethod} className="space-y-3">
              {SEED_METHODS.map((method) => {
                const Icon = method.icon;
                return (
                  <div key={method.id} className="flex items-start gap-3">
                    <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                    <Label
                      htmlFor={method.id}
                      className="flex-1 cursor-pointer rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-gray-600" />
                        <div className="text-left">
                          <div className="font-medium text-sm">{method.label}</div>
                          <div className="text-xs text-gray-600">{method.description}</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Connector source selection */}
          {seedMethod === 'connector' && (
            <div>
              <Label htmlFor="connector" className="text-sm font-semibold mb-2">
                Select a service
              </Label>
              <Input
                id="connector"
                placeholder="e.g., Salesforce, Google Calendar, Slack"
                value={connectedSource}
                onChange={(e) => setConnectedSource(e.target.value)}
                className="mt-2"
              />
              <p className="text-xs text-gray-600 mt-2">
                You'll be guided through authentication after activation
              </p>
            </div>
          )}

          {/* Info based on method */}
          {seedMethod === 'upload' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-900">
                Supported formats: <strong>CSV, JSON, PDF</strong>. Upload a file to auto-populate
                your workspace.
              </p>
              <div className="mt-3">
                <Label htmlFor="bucket-upload" className="text-xs font-semibold">
                  Select a file
                </Label>
                <Input
                  id="bucket-upload"
                  type="file"
                  accept=".csv,.json,.pdf"
                  className="mt-2"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    setUploadFile(file);
                    setUploadError('');
                  }}
                />
                {uploadFile && (
                  <p className="text-xs text-gray-700 mt-2">Selected: {uploadFile.name}</p>
                )}
                {uploadError && (
                  <p className="text-xs text-red-600 mt-2">{uploadError}</p>
                )}
              </div>
            </div>
          )}

          {seedMethod === 'manual' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-900">
                Start with the essentials. Add items one at a time as you work in the workspace.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
