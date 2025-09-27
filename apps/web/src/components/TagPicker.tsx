"use client";
import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Activity, X } from "lucide-react";

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface TagPickerProps {
  onChange?: (tags: string[]) => void;
}

export default function TagPicker({ onChange }: TagPickerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: sensors, error } = useSWR("/api/proxy/sensors/list", fetcher);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filtered tags
  const filteredTags = useMemo(() => {
    if (!sensors) return [];
    const tags = sensors.map((s: any) => s.tag).filter(Boolean);
    if (!debouncedSearch) return tags;
    return tags.filter((tag: string) => 
      tag.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [sensors, debouncedSearch]);

  // Handle tag selection
  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    onChange?.(newTags);
  };

  const removeTag = (tag: string) => {
    const newTags = selectedTags.filter(t => t !== tag);
    setSelectedTags(newTags);
    onChange?.(newTags);
  };

  const clearAll = () => {
    setSelectedTags([]);
    onChange?.([]);
  };

  if (error) {
    return (
      <div className="text-sm text-red-500 p-3 bg-red-50 rounded-lg border border-red-200">
        Error loading sensors
      </div>
    );
  }

  if (!sensors) {
    return (
      <div className="text-sm text-slate-500 p-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          Loading sensors...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-500" />
        <Input
          placeholder="🔍 Search sensors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gradient-to-r from-white to-slate-50/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200"
        />
      </div>

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <Card className="gradient-card shadow-md">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-700 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                ✅ Selected ({selectedTags.length})
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="h-7 px-3 text-xs hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                🗑️ Clear all
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs bg-gradient-to-r from-emerald-100 to-blue-100 text-slate-700 border border-emerald-200 hover:shadow-md transition-all"
                >
                  <Activity className="w-3 h-3 mr-1 text-emerald-600" />
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTag(tag)}
                    className="h-4 w-4 p-0 ml-1 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors"
                  >
                    <X className="w-2 h-2" />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Tags */}
      <Card className="gradient-card shadow-md">
        <CardContent className="p-3">
          <div className="text-sm font-semibold text-slate-700 mb-3 bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">
            📊 Available Sensors ({filteredTags.length})
          </div>
          
          {filteredTags.length === 0 ? (
            <div className="text-sm text-slate-400 text-center py-6">
              {debouncedSearch ? '🔍 No sensors match your search' : '📡 No sensors available'}
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto scrollbar-thin space-y-2 pr-2">
              {filteredTags.map((tag: string) => (
                <div
                  key={tag}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 cursor-pointer transition-all duration-200 border border-transparent hover:border-emerald-200"
                  onClick={() => toggleTag(tag)}
                >
                  <Checkbox
                    checked={selectedTags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-blue-500"
                  />
                  <Activity className="w-3 h-3 text-emerald-500" />
                  <span className="text-xs text-slate-700 flex-1 truncate font-medium">
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}