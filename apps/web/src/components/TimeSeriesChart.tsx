"use client";
import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

type SeriesResp = {
  bucket: string;
  agg: string;
  series: Record<string, { t: string; v: number | null }[]>;
};

async function fetchSeries(params: {
  tags: string[];
  start: string;
  end?: string;
  bucket?: string;
  agg?: "avg" | "min" | "max" | "last" | "first";
}): Promise<SeriesResp> {
  const qs = new URLSearchParams();
  if (params.tags.length === 1) qs.set("tags", params.tags[0]);
  else qs.set("tags", params.tags.join(","));
  qs.set("start", params.start);
  if (params.end) qs.set("end", params.end);
  if (params.bucket) qs.set("bucket", params.bucket);
  if (params.agg) qs.set("agg", params.agg);
  const r = await fetch(`/api/proxy/series?${qs.toString()}`);
  if (!r.ok) throw new Error("series fetch failed");
  return r.json();
}

export default function TimeSeriesChart({
  tags,
  start = "-15m",
  bucket = "1m",
  agg = "avg",
  refreshMs = 5000,
  height = 360,
}: {
  tags: string[];
  start?: string;
  bucket?: string;
  agg?: "avg" | "min" | "max" | "last" | "first";
  refreshMs?: number;
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const [data, setData] = useState<SeriesResp | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    chartRef.current = echarts.init(ref.current);
    
    // Add resize listener
    const handleResize = () => {
      chartRef.current?.resize();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      chartRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    let alive = true;
    async function pull() {
      try {
        if (!tags?.length) {
          console.log("TimeSeriesChart: No tags provided");
          return;
        }
        console.log("TimeSeriesChart: Fetching data for tags:", tags, "start:", start, "bucket:", bucket);
        const res = await fetchSeries({ tags, start, bucket, agg });
        console.log("TimeSeriesChart: Received data:", res);
        if (alive) setData(res);
      } catch (e) {
        console.error("TimeSeriesChart: series fetch error", e);
      }
    }
    pull();
    const id = setInterval(pull, refreshMs);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [tags.join(","), start, bucket, agg, refreshMs]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) {
      console.log("TimeSeriesChart: Chart not initialized");
      return;
    }
    
    console.log("TimeSeriesChart: Rendering chart with data:", data);
    console.log("TimeSeriesChart: Tags provided:", tags);
    
    if (!data || !data.series || Object.keys(data.series).length === 0) {
      console.log("TimeSeriesChart: No data available, showing empty state");
      chart.setOption({
        backgroundColor: 'transparent',
        title: {
          text: '📊 Veri Yok',
          subtext: 'Tag seçin veya veri aralığını kontrol edin',
          left: 'center',
          top: 'middle',
          textStyle: { color: '#64748b', fontSize: 18, fontWeight: 'bold' },
          subtextStyle: { color: '#94a3b8', fontSize: 14 }
        },
        series: [],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '10%',
          containLabel: true
        }
      });
      return;
    }

    const colors = [
      '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', 
      '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
    ];

    const series = Object.entries(data.series).map(([tag, arr], index) => {
      console.log(`TimeSeriesChart: Processing series ${tag} with ${arr.length} data points`);
      return {
        name: tag,
        type: "line" as const,
        showSymbol: arr.length < 50, // Show symbols for small datasets
        smooth: true,
        itemStyle: { color: colors[index % colors.length] },
        lineStyle: { 
          width: 3,
          shadowColor: colors[index % colors.length] + '40',
          shadowBlur: 5
        },
        data: arr.map((p) => [new Date(p.t).getTime(), p.v]),
        connectNulls: false,
        emphasis: {
          focus: 'series',
          lineStyle: { width: 4 }
        }
      };
    });

    console.log("TimeSeriesChart: Created series:", series.length, "series with data");

    chart.setOption({
      backgroundColor: 'transparent',
      title: {
        text: '📈 Live Data Visualization',
        left: 'center',
        top: 10,
        textStyle: { 
          color: '#334155', 
          fontSize: 16, 
          fontWeight: 'bold' 
        }
      },
      tooltip: { 
        trigger: "axis",
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderColor: '#10b981',
        borderWidth: 2,
        borderRadius: 8,
        textStyle: { color: '#334155', fontSize: 12 },
        formatter: function(params: any) {
          let result = `<div style="font-weight: bold; margin-bottom: 5px;">${new Date(params[0].axisValue).toLocaleString()}</div>`;
          params.forEach((param: any) => {
            result += `<div style="color: ${param.color}; margin: 2px 0;">
              <span style="display: inline-block; width: 10px; height: 10px; background: ${param.color}; border-radius: 50%; margin-right: 5px;"></span>
              ${param.seriesName}: <strong>${param.value[1]?.toFixed(2) || 'N/A'}</strong>
            </div>`;
          });
          return result;
        }
      },
      legend: { 
        type: "scroll",
        bottom: 5,
        textStyle: { color: '#64748b', fontSize: 11 },
        itemGap: 15
      },
      grid: {
        left: '4%',
        right: '4%', 
        bottom: '20%',
        top: '15%',
        containLabel: true
      },
      xAxis: { 
        type: "time",
        axisLabel: { color: '#64748b', fontSize: 10 },
        axisLine: { lineStyle: { color: '#e2e8f0' } },
        splitLine: { show: false }
      },
      yAxis: { 
        type: "value", 
        scale: true,
        axisLabel: { color: '#64748b', fontSize: 10 },
        axisLine: { lineStyle: { color: '#e2e8f0' } },
        splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed', opacity: 0.5 } }
      },
      dataZoom: [
        { 
          type: "inside",
          throttle: 100
        }, 
        { 
          type: "slider",
          height: 25,
          bottom: 35,
          borderColor: '#10b981',
          fillerColor: '#10b98120',
          textStyle: { color: '#64748b', fontSize: 10 }
        }
      ],
      animation: true,
      animationDuration: 750,
      series,
    } as echarts.EChartsOption);
    
    // Chart resize
    chart.resize();
  }, [data]);

  return <div ref={ref} style={{ width: "100%", height }} />;
}



