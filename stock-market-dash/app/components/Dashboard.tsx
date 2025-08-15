"use client";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Charts from "./Charts"
import StockDetails from "./StockDetails"
import TopPerformers from "./TopPerformers"
import { useState } from 'react';



export default function Dashboard() {

  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2}>
        {/* Left side: Vertical stack of StockDetails + TopPerformers */}
        <Grid >
          <Grid container direction="column" spacing={1}>
            <Grid>
              <StockDetails
                selectedSymbol={selectedSymbol}
                onSymbolChange={setSelectedSymbol}
              />
            </Grid>
            <Grid>
              <TopPerformers />
            </Grid>
          </Grid>
        </Grid>

        {/* Right side: Charts */}
        <Grid>
          <Charts
            selectedSymbol={selectedSymbol}
          />
        </Grid>
      </Grid>
    </Box>
  );
}