"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

type StockDetailsType = {
  symbol: string;
  date: string;
  close: number;
  volume: number;
  change: number;
  changePercent: number;
  companyName: string;
};

const allSymbols = [
  "AAPL", "TSLA", "AMZN", "MSFT", "NVDA",
  "GOOGL", "META", "NFLX", "JPM", "V",
  "BAC", "AMD", "PYPL", "DIS", "T", 
  "PFE", "COST", "INTC", "KO", "TGT", 
  "NKE", "SPY", "BA", "BABA", "XOM", 
  "WMT", "GE", "CSCO", "VZ", "JNJ", 
  "CVX", "PLTR", "SQ", "SHOP", "SBUX", 
  "SOFI", "HOOD", "RBLX", "SNAP", 
  "UBER", "FDX", "ABBV", "ETSY", "MRNA", 
  "LMT", "GM", "F", "RIVN", "LCID", 
  "CCL", "DAL", "UAL", "AAL", "TSM", 
  "SONY", "ET", "NOK", "MRO", "COIN", 
  "SIRI", "RIOT", "CPRX", 
  "VWO", "SPYG", 
  "ROKU", "VIAC", "ATVI", "BIDU", 
  "DOCU", "ZM", "PINS", "TLRY", "WBA", 
  "MGM", "NIO", "C", 
  "GS", "WFC", "ADBE", "PEP", "UNH", 
  "CARR", "FUBO", "HCA", "TWTR", "BILI", 
  "RKT"
]

type StockDetailsProps = {
  selectedSymbol: string;
  onSymbolChange: React.Dispatch<React.SetStateAction<string>>;
};


export default function StockDetails({ selectedSymbol, onSymbolChange }: StockDetailsProps) {

  const [stockDetails, setStockDetails] = React.useState<StockDetailsType | null>(null);
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    fetch(`http://localhost:8000/stock-details?symbol=${selectedSymbol}`)
      .then((res) => res.json())
      .then((data) => {
        setStockDetails(data); // data = { symbol, date, price, volume }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load stock data:", err);
      });
  }, [selectedSymbol]);

  if (loading) return <Typography sx={{ color: "#fff", mt: 4, textAlign: "center" }}>Loading...</Typography>;

  if (!stockDetails) return <Typography sx={{ color: "#fff", mt: 4, textAlign: "center" }}>No data available</Typography>;
  
  console.log("DATA:", stockDetails)

  return (
    <Card sx={{ maxWidth: 1100, margin: "auto", mt: 4, boxShadow: 3, backgroundColor: "#4A4F58", color: "#fff" }}>
      <CardContent>
        <Typography gutterBottom sx={{ fontSize: 14 }}>
          {stockDetails.symbol}
        </Typography>
            <Box sx={{ height: 200, width: "100%" }}>
                <Typography variant="h5" component="div">
                {stockDetails.companyName || stockDetails.symbol}
                </Typography>
                <Typography sx={{ mb: 1.5 }}>
                  {stockDetails.change >= 0
                    ? `+${stockDetails.change.toFixed(2)} (+${stockDetails.changePercent.toFixed(2)}%)`
                    : `${stockDetails.change} (${stockDetails.changePercent.toFixed(2)}%)`}
                </Typography>
                <Typography variant="h4" component="div">
                ${stockDetails.close.toFixed(2)}
                </Typography>

                {/* Dropdown Search */}
                <Autocomplete
                  options={allSymbols}
                  sx={{ mt: 2, backgroundColor: "#4A4F58", borderRadius: 1 }}
                  value={selectedSymbol}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      onSymbolChange(newValue);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Search stock symbol" variant="outlined" />
                  )}
                  filterOptions={(options, state) =>
                    options.filter((opt) =>
                      opt.toLowerCase().includes(state.inputValue.toLowerCase())
                    )
                  }
                />

            </Box>

      </CardContent>
    </Card>
  );
}