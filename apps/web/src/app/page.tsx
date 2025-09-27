import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  BarChart3, 
  Settings, 
  Activity, 
  TrendingUp, 
  Database,
  ArrowRight,
  Layers,
  GitBranch
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: GitBranch,
      title: "Pipeline Editor",
      description: "Visual node-based pipeline creation with drag & drop",
      href: "/editor",
      color: "bg-emerald-500",
      badge: "New"
    },
    {
      icon: BarChart3,
      title: "Data Analytics",
      description: "Real-time data visualization and sensor monitoring",
      href: "/data",
      color: "bg-blue-500",
      badge: "Live"
    },
    {
      icon: Settings,
      title: "Sensor Management",
      description: "Configure and manage industrial sensors",
      href: "/sensors/new",
      color: "bg-purple-500",
      badge: "Config"
    }
  ];

  const stats = [
    { label: "Active Sensors", value: "24", icon: Activity },
    { label: "Data Points", value: "9K+", icon: Database },
    { label: "Uptime", value: "99.9%", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Industrial Automation Platform
              </h1>
              <p className="text-sm text-slate-500">Real-time monitoring & pipeline automation</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Layers className="w-4 h-4" />
            Production Ready
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Build Smart Industrial
            <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent block">
              Automation Pipelines
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12">
            Create visual data pipelines, monitor sensors in real-time, and automate your industrial processes 
            with our intuitive drag-and-drop editor.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600">
              <Link href="/editor" className="flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                Open Pipeline Editor
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/data" className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                View Analytics
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-slate-200/60">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group bg-white/80 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-slate-600">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="w-full group-hover:bg-slate-50">
                  <Link href={feature.href} className="flex items-center justify-center gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-lg border-t border-slate-200/60 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-slate-600">Industrial Automation MVP</span>
            </div>
            <div className="text-sm text-slate-500">
              Built with Next.js, React Flow & TimescaleDB
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}