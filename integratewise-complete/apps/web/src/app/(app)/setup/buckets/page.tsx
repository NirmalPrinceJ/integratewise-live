'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle2, Clock, Loader2, Plus, Pause, Play, Trash2 } from 'lucide-react';
import { useBuckets } from '@/hooks/useBuckets';
import AddBucketModal from '@/components/buckets/add-bucket-modal';

interface BaseBucketCardProps {
  bucket: ReturnType<typeof useBuckets>['buckets'][0];
  onPause: (bucketId: string) => Promise<void>;
  onResume: (bucketId: string) => Promise<void>;
  onDelete: (bucketId: string) => Promise<void>;
  onSeed: (bucketType: string) => void;
}

const BaseBucketCard = ({
  bucket,
  onPause,
  onResume,
  onDelete,
  onSeed,
}: BaseBucketCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const statusConfig = {
    OFF: {
      icon: <Plus className="h-4 w-4" />,
      label: 'Inactive',
      color: 'bg-gray-100 text-gray-800',
      action: 'Add',
      actionColor: 'default',
    },
    ADDING: {
      icon: <Loader2 className="h-4 w-4 animate-spin" />,
      label: 'Setting up',
      color: 'bg-blue-100 text-blue-800',
      action: undefined,
      actionColor: 'secondary',
    },
    SEEDED: {
      icon: <CheckCircle2 className="h-4 w-4" />,
      label: 'Seeded',
      color: 'bg-blue-100 text-blue-800',
      action: 'Enable Sync',
      actionColor: 'default',
    },
    LIVE: {
      icon: <CheckCircle2 className="h-4 w-4" />,
      label: 'Live',
      color: 'bg-green-100 text-green-800',
      action: 'Pause',
      actionColor: 'secondary',
    },
    PAUSED: {
      icon: <Clock className="h-4 w-4" />,
      label: 'Paused',
      color: 'bg-yellow-100 text-yellow-800',
      action: 'Resume',
      actionColor: 'default',
    },
    ERROR: {
      icon: <AlertCircle className="h-4 w-4" />,
      label: 'Error',
      color: 'bg-red-100 text-red-800',
      action: 'Retry',
      actionColor: 'destructive',
    },
  };

  const config = statusConfig[bucket.state as keyof typeof statusConfig] || statusConfig.OFF;
  const progress =
    bucket.state === 'OFF'
      ? 0
      : bucket.state === 'ADDING'
        ? 33
        : bucket.state === 'SEEDED'
          ? 66
          : bucket.state === 'LIVE'
            ? 100
            : 50;

  const handleAction = async () => {
    setIsLoading(true);
    try {
      if (bucket.state === 'OFF') {
        onSeed(bucket.bucket_type);
      } else if (bucket.state === 'LIVE') {
        await onPause(bucket.bucket_id);
      } else if (bucket.state === 'PAUSED' || bucket.state === 'SEEDED') {
        await onResume(bucket.bucket_id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-50 to-transparent opacity-50" />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{bucket.icon}</span>
              <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                {bucket.bucket_type}
              </span>
            </div>
            <CardTitle className="text-lg">{bucket.display_name}</CardTitle>
            <CardDescription className="text-xs mt-1">{bucket.description}</CardDescription>
          </div>
          <Badge className={config.color}>
            <span className="flex items-center gap-1">
              {config.icon}
              {config.label}
            </span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Progress bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-600">Readiness</span>
              <span className="text-xs text-gray-500">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Entity count */}
          {bucket.entity_count > 0 && (
            <div className="text-xs text-gray-600">
              <span className="font-semibold">{bucket.entity_count}</span> entities synced
            </div>
          )}

          {/* Last sync */}
          {bucket.last_sync_at && (
            <div className="text-xs text-gray-600">
              Last sync:{' '}
              <span className="font-mono">
                {new Date(bucket.last_sync_at).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Error message */}
          {bucket.error_message && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
              {bucket.error_message}
            </div>
          )}

          {/* Connector info */}
          {bucket.connected_source && (
            <div className="text-xs text-gray-600">
              Connected: <span className="font-semibold">{bucket.connected_source}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {config.action && (
              <Button
                size="sm"
                variant={config.actionColor as any}
                onClick={handleAction}
                disabled={isLoading || bucket.state === 'ADDING'}
              >
                {isLoading && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                {config.action}
              </Button>
            )}

            {bucket.state !== 'OFF' && bucket.state !== 'ADDING' && (
              <Button size="sm" variant="ghost" onClick={() => onDelete(bucket.bucket_id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * L0 Bucket Dashboard
 * Progressive data readiness activation system
 */
export default function BucketsPage() {
  const { buckets, isLoading, addBucket, pauseBucket, resumeBucket, deleteBucket } =
    useBuckets();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBucketType, setSelectedBucketType] = useState<string | null>(null);

  const handleSeed = (bucketType: string) => {
    setSelectedBucketType(bucketType);
    setShowAddModal(true);
  };

  const handleBucketAdded = async () => {
    setShowAddModal(false);
    setSelectedBucketType(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Buckets ordered by type
  const bucketOrder = ['B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7'];
  const sortedBuckets = [...buckets].sort(
    (a, b) => bucketOrder.indexOf(a.bucket_type) - bucketOrder.indexOf(b.bucket_type)
  );

  // Count active buckets
  const activeBuckets = buckets.filter((b) => b.state !== 'OFF').length;
  const completeBuckets = buckets.filter((b) => b.state === 'LIVE').length;

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Readiness</h1>
        <p className="text-gray-600 mt-1">Build your workspace step by step</p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Activated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeBuckets}</div>
            <p className="text-xs text-gray-500 mt-1">of 8 data sources</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Live</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completeBuckets}</div>
            <p className="text-xs text-gray-500 mt-1">actively syncing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Workspace Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {completeBuckets >= 2 ? '100%' : Math.round((completeBuckets / 8) * 100) + '%'}
            </div>
            <p className="text-xs text-gray-500 mt-1">full onboarding</p>
          </CardContent>
        </Card>
      </div>

      {/* Buckets grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Foundation Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedBuckets.map((bucket) => (
            <BaseBucketCard
              key={bucket.bucket_id}
              bucket={bucket}
              onPause={pauseBucket}
              onResume={resumeBucket}
              onDelete={deleteBucket}
              onSeed={handleSeed}
            />
          ))}
        </div>
      </div>

      {/* Add bucket modal */}
      {selectedBucketType && (
        <AddBucketModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          bucketType={selectedBucketType}
          onSuccess={handleBucketAdded}
        />
      )}
    </div>
  );
}
