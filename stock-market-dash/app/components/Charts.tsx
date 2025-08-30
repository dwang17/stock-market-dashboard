"use client"
import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import ToggleData from "./ToggleData"
import ToggleButtons from "./ToggleButtons";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { useState, useEffect } from "react";

const margin = { bottom: 10, right: 50 };
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;


type ChartsType = {
  symbol: string,
  date: string,
  open: number,
  high: number,
  low: number,
  close: number,
  volume: number,
  change: number,
  changePercent: number,
  vwap: number
};

type ChartsProps = {
  selectedSymbol: string;
};

export default function Charts({ selectedSymbol }: ChartsProps) {

  const [dailyChartData, setDailyChartData] = React.useState<ChartsType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataType, setDataType] = useState("Historical");
  const [timeType, setTimeType] = React.useState<string | null>('day');


  useEffect(() => {
    const endpoint = dataType === "Historical" ? "daily-chart-data" : "predicted-chart-data";

    fetch(`${API_BASE}/${endpoint}?symbol=${selectedSymbol}&timeType=${timeType}`)
      .then((res) => res.json())
      .then((data) => {
        setDailyChartData(data); // data = { symbol, date, open, high, low, close, volume, change, changePercent, vwap }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load stock data:", err);
      });
  }, [selectedSymbol, dataType, timeType]);

  if (loading) return <Typography sx={{ color: "#fff", mt: 4, textAlign: "center" }}>Loading...</Typography>;

  if (!dailyChartData) return <Typography sx={{ color: "#fff", mt: 4, textAlign: "center" }}>No data available</Typography>;

  const xLabels: string[] = [];
  const dailyData: number[] = [];

  for (let i = 0; i < dailyChartData.length; i++){
    xLabels.push(dailyChartData[i].date);
    dailyData.push(dailyChartData[i].close)
  }

  // console.log("TIME TYPE: " + timeType)
  // console.log("DATA!!!: " + dailyData)
  // console.log("CHARTDATA!!!!! " + dailyChartData[0].date)

  return (
    <Card
      sx={{
        maxWidth: 1500,
        margin: "auto",
        mt: 4,
        
        backgroundColor: "#4A4F58", // dark card background
        color: "#fff"
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt:0.1}}>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: "#fff" }}>
          {dailyChartData[0].symbol} Stock Chart
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <ToggleButtons value={timeType} onChange={setTimeType} />
          <ToggleData value={dataType} onChange={setDataType}/>
        </Box>
        
        
          
        <Box sx={{ height: 600, width: "100%" }}>
          <LineChart
            sx={{
                ".MuiChartsAxis-root .MuiChartsAxis-line": {
                stroke: "#fff", // white axis lines
                },
                ".MuiChartsAxis-tick": {
                stroke: "#fff", // white tick marks (the small lines)
                strokeWidth: 1.5,
                },
                ".MuiChartsAxis-tickLabel": {
                fill: "#fff", // white tick labels (numbers/text)
                },
                ".MuiChartsGrid-line": {
                stroke: "#666", // subtle gray grid lines
                },
                
                
            }}
            height={600}
            width={800}
            series={[
              { data: dailyData, color: "#fff"} //closing date price
            ]}
            xAxis={[{ scaleType: "point", data: xLabels }]}
            yAxis={[{ width: 50, valueFormatter: (value: number | string) => `$${value}` }]}
            margin={margin}
          />
        </Box>
      </CardContent>
    </Card>
  );
}