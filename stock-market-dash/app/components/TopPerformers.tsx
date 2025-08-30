"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type TopPerformersType = {
  symbol: string;
  price: number;
  name: string;
  change: number;
  changesPercentage: number;
  exchange: string;
};

export default function TopPerformers() {

  const [topPerformers, setTopPerformers] = React.useState<TopPerformersType[] | null>(null);
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    fetch(`${API_BASE}/top-performing-stocks`)
      .then((res) => res.json())
      .then((data) => {
        setTopPerformers(data); // data = { symbol, price, name, change, changesPercentage, exchange }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load stock data:", err);
      });
  }, []);

  if (loading) return <Typography sx={{ color: "#fff", mt: 4, textAlign: "center" }}>Loading...</Typography>;

  if (!topPerformers) return <Typography sx={{ color: "#fff", mt: 4, textAlign: "center" }}>No data available</Typography>;
  console.log(topPerformers)
  return (
    <Card sx={{ maxWidth: 1100, margin: "auto", mt: 4, boxShadow: 3, backgroundColor: "#4A4F58", color: "#fff" }}>
      <CardContent>
        <Box sx={{ height: 400, width: "100%" }}>
            <Typography variant="h5" component="div" sx={{ mb: 3 }}>
                Top Performers
            </Typography>
            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
              {topPerformers[0].symbol}{" "}
              <Box component="span" sx={{ fontSize: '1.25rem' }}>
                +{topPerformers[0].change.toFixed(2)} ({topPerformers[0].changesPercentage.toFixed(2)}%)
              </Box>
            </Typography>
            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
              {topPerformers[1].symbol}{" "}
              <Box component="span" sx={{ fontSize: '1.25rem' }}>
                +{topPerformers[1].change.toFixed(2)} ({topPerformers[1].changesPercentage.toFixed(2)}%)
              </Box>
            </Typography>
            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
              {topPerformers[2].symbol}{" "}
              <Box component="span" sx={{ fontSize: '1.25rem' }}>
                +{topPerformers[2].change.toFixed(2)} ({topPerformers[2].changesPercentage.toFixed(2)}%)
              </Box>
            </Typography>
            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
              {topPerformers[3].symbol}{" "}
              <Box component="span" sx={{ fontSize: '1.25rem' }}>
                +{topPerformers[3].change.toFixed(2)} ({topPerformers[3].changesPercentage.toFixed(2)}%)
              </Box>
            </Typography>
            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
              {topPerformers[4].symbol}{" "}
              <Box component="span" sx={{ fontSize: '1.25rem' }}>
                +{topPerformers[4].change.toFixed(2)} ({topPerformers[4].changesPercentage.toFixed(2)}%)
              </Box>
            </Typography>
            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
              {topPerformers[5].symbol}{" "}
              <Box component="span" sx={{ fontSize: '1.25rem' }}>
                +{topPerformers[5].change.toFixed(2)} ({topPerformers[5].changesPercentage.toFixed(2)}%)
              </Box>
            </Typography>
            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
              {topPerformers[6].symbol}{" "}
              <Box component="span" sx={{ fontSize: '1.25rem' }}>
                +{topPerformers[6].change.toFixed(2)} ({topPerformers[6].changesPercentage.toFixed(2)}%)
              </Box>
            </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}