"use client";

import { useState, useEffect } from "react";
import { pipeline } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Mail, Building2, RotateCcw, Users } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  lastInteraction?: string;
  role?: string;
}

export function PersonalContactsView() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    try {
      setLoading(true);
      setError(null);
      const result = await pipeline.entities({ type: "contact", limit: 50 });
      const data = result.data || result.entities || [];
      const contactList = Array.isArray(data) ? data : [];
      setContacts(contactList);
      setFilteredContacts(contactList);
    } catch (err: any) {
      setError(err.message || "Failed to load contacts");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(value: string) {
    setSearch(value);
    const filtered = contacts.filter(c =>
      c.name?.toLowerCase().includes(value.toLowerCase()) ||
      c.company?.toLowerCase().includes(value.toLowerCase()) ||
      c.email?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredContacts(filtered);
  }

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Contacts</h2>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">{error}</p>
              <Button size="sm" variant="outline" onClick={loadContacts} className="mt-2">
                <RotateCcw className="w-3 h-3 mr-1" /> Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Contacts</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{filteredContacts.length} contacts</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Input
            placeholder="Search by name, company, email..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="flex-1 min-w-64"
          />
          <Button size="sm" variant="outline" onClick={loadContacts}>
            Refresh
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredContacts.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {search ? "No contacts match your search" : "No contacts found"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2 pr-4">
            {filteredContacts.map(contact => (
              <Card key={contact.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium">{contact.name}</h3>
                      {contact.role && (
                        <Badge variant="outline" className="mt-1 text-xs">{contact.role}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    {contact.company && (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3 h-3" />
                        <span>{contact.company}</span>
                      </div>
                    )}
                    {contact.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                    )}
                    {contact.lastInteraction && (
                      <p>Last contacted: {new Date(contact.lastInteraction).toLocaleDateString()}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
