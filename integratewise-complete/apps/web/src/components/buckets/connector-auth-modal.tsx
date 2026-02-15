'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';

interface ConnectorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectorType: string;
  bucketId: string;
  bucketType: string;
  tenantId: string;
  onSuccess: () => void;
}

const CONNECTOR_INFO: Record<string, { name: string; icon: string; description: string }> = {
  salesforce: {
    name: 'Salesforce',
    icon: '☁️',
    description: 'Connect your Salesforce org to sync accounts, contacts, and opportunities',
  },
  hubspot: {
    name: 'HubSpot',
    icon: '🔵',
    description: 'Sync contacts, companies, and deals from HubSpot',
  },
  google_calendar: {
    name: 'Google Calendar',
    icon: '📅',
    description: 'Sync events and meetings from Google Calendar',
  },
  google_drive: {
    name: 'Google Drive',
    icon: '📁',
    description: 'Sync documents and files from Google Drive',
  },
  slack: {
    name: 'Slack',
    icon: '💬',
    description: 'Sync messages, channels, and user data from Slack',
  },
  microsoft_teams: {
    name: 'Microsoft Teams',
    icon: '👥',
    description: 'Sync messages and calendar from Microsoft Teams',
  },
  gmail: {
    name: 'Gmail',
    icon: '📧',
    description: 'Sync emails and messages from Gmail',
  },
  github: {
    name: 'GitHub',
    icon: '🐙',
    description: 'Sync repositories, issues, and pull requests',
  },
  jira: {
    name: 'Jira',
    icon: '⚙️',
    description: 'Sync issues, epics, and sprints from Jira',
  },
  notion: {
    name: 'Notion',
    icon: '📝',
    description: 'Sync pages and databases from Notion',
  },
};

/**
 * ConnectorAuthModal: OAuth flow for connecting external services
 */
export default function ConnectorAuthModal({
  isOpen,
  onClose,
  connectorType,
  bucketId,
  bucketType,
  tenantId,
  onSuccess,
}: ConnectorAuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [authWindow, setAuthWindow] = useState<Window | null>(null);
  const [step, setStep] = useState<'init' | 'auth' | 'success' | 'error'>('init');
  const [errorMessage, setErrorMessage] = useState('');

  const connectorInfo = CONNECTOR_INFO[connectorType] || {
    name: connectorType,
    icon: '🔗',
    description: 'Connect to this service',
  };

  const handleStartAuth = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Get auth URL from backend
      const response = await fetch(
        `/api/connectors/auth-url/${connectorType}?tenantId=${tenantId}&bucketId=${bucketId}&bucketType=${bucketType}`
      );

      if (!response.ok) {
        throw new Error('Failed to get auth URL');
      }

      const { authUrl } = await response.json();

      setStep('auth');

      // Open auth window
      const width = 500;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const window_ = window.open(
        authUrl,
        'ConnectorAuth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!window_) {
        throw new Error('Failed to open auth window - popup may be blocked');
      }

      setAuthWindow(window_);

      // Poll for auth completion
      const pollInterval = setInterval(() => {
        try {
          // Check if window closed (user completed auth or cancelled)
          if (window_.closed) {
            clearInterval(pollInterval);
            // Verify auth actually succeeded
            verifyAuthSuccess();
          }
        } catch (error) {
          console.error('Auth window polling error:', error);
        }
      }, 500);

      // Timeout after 10 minutes
      const timeoutId = setTimeout(() => {
        clearInterval(pollInterval);
        window_?.close();
        setStep('error');
        setErrorMessage('Authentication timed out. Please try again.');
        setIsLoading(false);
      }, 10 * 60 * 1000);

      return () => {
        clearInterval(pollInterval);
        clearTimeout(timeoutId);
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setStep('error');
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  const verifyAuthSuccess = async () => {
    try {
      const response = await fetch(`/api/connectors/status/${connectorType}?tenantId=${tenantId}&bucketId=${bucketId}`);

      if (!response.ok) {
        throw new Error('Auth verification failed');
      }

      const { status } = await response.json();

      if (status === 'connected') {
        setStep('success');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setStep('error');
        setErrorMessage('Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Auth verification error:', error);
      setStep('error');
      setErrorMessage('Failed to verify authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{connectorInfo.icon}</span>
            Connect {connectorInfo.name}
          </DialogTitle>
          <DialogDescription>{connectorInfo.description}</DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {step === 'init' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  You'll be redirected to {connectorInfo.name} to authorize access. This is secure and
                  encrypted.
                </p>
              </div>
            </div>
          )}

          {step === 'auth' && (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm text-gray-600">Complete authorization in the opened window...</p>
              <p className="text-xs text-gray-500">
                If the window didn't open, check your popup blocker settings
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
              <p className="text-sm font-semibold text-gray-900">Connection successful!</p>
              <p className="text-xs text-gray-600 text-center">
                Your {connectorInfo.name} account is now connected and syncing.
              </p>
            </div>
          )}

          {step === 'error' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-900">{errorMessage}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading || step === 'auth'}>
            {step === 'success' ? 'Close' : 'Cancel'}
          </Button>

          {step === 'init' && (
            <Button onClick={handleStartAuth} disabled={isLoading}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Connect {connectorInfo.name}
            </Button>
          )}

          {step === 'error' && (
            <Button onClick={handleStartAuth} disabled={isLoading}>
              Try Again
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
