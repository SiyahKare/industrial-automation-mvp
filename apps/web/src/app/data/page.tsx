"use client";
import useSWR from "swr";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Database, 
  Activity, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  Filter,
  RefreshCw,
  Download,
  Zap
} from "lucide-react";

const fetcher = (u: string) => fetch(u).then(r => r.json());

export default function DataPage() {
  const [tag, setTag] = useState("");
  const [start, setStart] = useState("-1h");
  const [limit, setLimit] = useState(200);
  const [refreshing, setRefreshing] = useState(false);
  
  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (tag) p.set("tag", tag);
    if (start) p.set("start", start);
    p.set("limit", String(limit));
    return p.toString();
  }, [tag, start, limit]);

  const { data: sensors, mutate: mutateSensors } = useSWR("/api/proxy/sensors/list", fetcher);
  const { data: rows, isLoading, mutate: mutateRows } = useSWR(`/api/proxy/measurements?${qs}`, fetcher);
  const { data: stats, mutate: mutateStats } = useSWR(
    tag ? `/api/proxy/measurements/stats?tag=${encodeURIComponent(tag)}&start=${encodeURIComponent(start)}` : null, 
    fetcher
  );

  useEffect(() => {
    if (!tag && sensors?.length) setTag(sensors[0].tag);
  }, [sensors, tag]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([mutateRows(), mutateStats(), mutateSensors()]);
    setRefreshing(false);
  };

  const formatValue = (value: number | null | undefined) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return 'N/A';
    }
    if (Math.abs(value) >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toFixed(2);
  };

  const formatTimestamp = (ts: string) => {
    return new Date(ts).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                  Data Analytics
                </h1>
                <p className="text-sm text-slate-500">Real-time sensor measurements & statistics</p>
              </div>
            </div>
            <Button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Data Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Sensor Tag</label>
                <Select value={tag} onValueChange={setTag}>
                  <SelectTrigger className="bg-white/80">
                    <SelectValue placeholder="Select sensor..." />
                  </SelectTrigger>
                  <SelectContent>
                    {sensors?.map((s: any) => (
                      <SelectItem key={s.tag} value={s.tag}>
                        <div className="flex items-center gap-2">
                          <Activity className="w-3 h-3 text-blue-500" />
                          {s.tag}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Time Range</label>
                <Select value={start} onValueChange={setStart}>
                  <SelectTrigger className="bg-white/80">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-15m">Last 15 minutes</SelectItem>
                    <SelectItem value="-1h">Last 1 hour</SelectItem>
                    <SelectItem value="-6h">Last 6 hours</SelectItem>
                    <SelectItem value="-24h">Last 24 hours</SelectItem>
                    <SelectItem value="-7d">Last 7 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Limit</label>
                <Select value={limit.toString()} onValueChange={(v) => setLimit(Number(v))}>
                  <SelectTrigger className="bg-white/80">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50 rows</SelectItem>
                    <SelectItem value="100">100 rows</SelectItem>
                    <SelectItem value="200">200 rows</SelectItem>
                    <SelectItem value="500">500 rows</SelectItem>
                    <SelectItem value="1000">1000 rows</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Actions</label>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Count</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.count}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Average</p>
                    <p className="text-2xl font-bold text-slate-900">{formatValue(stats.avg)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Maximum</p>
                    <p className="text-2xl font-bold text-slate-900">{formatValue(stats.max)}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Minimum</p>
                    <p className="text-2xl font-bold text-slate-900">{formatValue(stats.min)}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Data Table */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Database className="w-5 h-5" />
                Measurement Data
              </CardTitle>
              <div className="flex items-center gap-2">
                {tag && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    <Activity className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                )}
                <Badge variant="outline">
                  {rows?.length || 0} rows
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
                  <span className="text-slate-600">Loading measurements...</span>
                </div>
              </div>
            ) : !rows?.length ? (
              <div className="text-center py-12">
                <Database className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-700 mb-2">No Data Found</h3>
                <p className="text-slate-500">Try adjusting your filters or time range.</p>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left p-3 font-medium text-slate-700">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Timestamp
                        </div>
                      </th>
                      <th className="text-left p-3 font-medium text-slate-700">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          Tag
                        </div>
                      </th>
                      <th className="text-right p-3 font-medium text-slate-700">
                        <div className="flex items-center justify-end gap-2">
                          <Zap className="w-4 h-4" />
                          Value
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {rows.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-mono text-slate-600">
                          {formatTimestamp(row.ts)}
                        </td>
                        <td className="p-3">
                          <Badge variant="secondary" className="text-xs">
                            {row.tag}
                          </Badge>
                        </td>
                        <td className="p-3 text-right font-mono font-medium text-slate-900">
                          {formatValue(row.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}