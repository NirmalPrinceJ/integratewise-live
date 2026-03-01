"use client";

import { useState, useEffect } from "react";
import { workspace } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Plus, RotateCcw, FileText } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
}

export function PersonalNotesView() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    try {
      setLoading(true);
      setError(null);
      const result = await workspace.view("notes");
      const data = result.data || result.notes || [];
      const noteList = Array.isArray(data) ? data : [];
      setNotes(noteList);
      setFilteredNotes(noteList);
    } catch (err: any) {
      setError(err.message || "Failed to load notes");
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(value: string) {
    setSearch(value);
    const filtered = notes.filter(n =>
      n.title?.toLowerCase().includes(value.toLowerCase()) ||
      n.excerpt?.toLowerCase().includes(value.toLowerCase()) ||
      n.content?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredNotes(filtered);
  }

  function getExcerpt(note: Note): string {
    const text = note.excerpt || note.content || "";
    return text.length > 100 ? text.substring(0, 100) + "..." : text;
  }

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Notes</h2>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">{error}</p>
              <Button size="sm" variant="outline" onClick={loadNotes} className="mt-2">
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
          <h2 className="text-xl font-semibold">Notes</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{filteredNotes.length} notes</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Input
            placeholder="Search notes..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="flex-1 min-w-64"
          />
          <Button size="sm" className="gap-2">
            <Plus className="w-3 h-3" /> New Note
          </Button>
          <Button size="sm" variant="outline" onClick={loadNotes}>
            Refresh
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-2/3 mb-3" />
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-4">
                {search ? "No notes match your search" : "No notes yet"}
              </p>
              <Button size="sm" className="gap-2">
                <Plus className="w-3 h-3" /> Create your first note
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-4">
            {filteredNotes.map(note => (
              <Card key={note.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{note.title}</h3>
                  {getExcerpt(note) && (
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                      {getExcerpt(note)}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex gap-1 flex-wrap">
                      {note.tags && note.tags.slice(0, 2).map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                      {note.tags && note.tags.length > 2 && (
                        <Badge variant="outline" className="text-[10px]">
                          +{note.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                    {note.updatedAt && (
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </p>
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
