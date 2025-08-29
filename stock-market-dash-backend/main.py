from fastapi import FastAPI, Query
import httpx
import os
import json
import pandas as pd 
import numpy as np
import datetime
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("FMP_API_KEY")



@app.get("/top-performing-stocks")
async def get_top_stocks():
    url = f"https://financialmodelingprep.com/stable/biggest-gainers?apikey={API_KEY}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        data = response.json()
    return data[:10]  # top 10 gainers


@app.get("/stock-details") #past 7 days (for stock details)
async def get_stock_details_data(symbol: str = Query("AAPL")):
    url_prices = f"https://financialmodelingprep.com/stable/historical-price-eod/full?symbol={symbol}&apikey={API_KEY}"
    url_details = f"https://financialmodelingprep.com/stable/search-symbol?query={symbol}&apikey={API_KEY}"
    async with httpx.AsyncClient() as client:
        prices = await client.get(url_prices)
        price_json = prices.json()
        price_data = price_json[0]

        details = await client.get(url_details)
        detail_json = details.json()
        detail_data = detail_json[0]["name"]
    
    full_data = {
        **price_data,
        "companyName" : detail_data
    }

    return full_data

@app.get("/daily-chart-data") #historical
async def get_daily_chart_data(symbol: str = Query("AAPL"), timeType: str = Query("day")):
    url = f"https://financialmodelingprep.com/stable/historical-price-eod/full?symbol={symbol}&apikey={API_KEY}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        data = response.json()
    if timeType == "day":
        last_seven_days = data[:7]
        last_seven_days.reverse()
        return last_seven_days

    if timeType == "week":
        last_seven_weeks_dates = []
        last_ten_weeks = data[:50]
        count = 0
        for i in range(len(last_ten_weeks)):
            if (i % 5 == 0 and count < 7):
                last_seven_weeks_dates.append(last_ten_weeks[i])
                count += 1
        last_seven_weeks_dates.reverse()
        return last_seven_weeks_dates
    
    if timeType == "month":
        last_seven_months_dates = []
        last_ten_months = data[:220]
        count = 0
        for i in range(len(last_ten_months)):
            if (i % 20 == 0 and count < 7):
                last_seven_months_dates.append(last_ten_months[i])
                count += 1
        last_seven_months_dates.reverse()
        return last_seven_months_dates

    return []

@app.get("/predicted-chart-data") #predicted
async def get_predicted_chart_data(symbol: str = Query("AAPL"), timeType: str = Query("day")):
    url = f"https://financialmodelingprep.com/stable/historical-price-eod/full?symbol={symbol}&apikey={API_KEY}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        data = response.json()
    
    df = pd.DataFrame(data)

    df = df[["date", "close"]].head(60)

    df["date_index"] = np.arange(len(df))
    X = df[["date_index"]].values
    y = df[["close"]].values

    poly = PolynomialFeatures(degree=3) 
    X_poly = poly.fit_transform(X)
    model = LinearRegression()
    model.fit(X_poly, y)

    next_seven_date_indexes = np.arange(len(df), len(df) + 7).reshape(-1, 1)
    next_seven_poly = poly.transform(next_seven_date_indexes)
    predicted_prices = model.predict(next_seven_poly).ravel() # flatten to pass into DataFrame

    # Add some small random noise to make it less perfectly polynomial
    predicted_prices += np.random.normal(0, 0.01 * np.mean(y), size=predicted_prices.shape)   # adjust std dev as needed


    last_date = pd.to_datetime(df["date"].iloc[0])  # most recent date
    
    predicted_dates = []
    if timeType == "day":
        day_number = 1
        while len(predicted_dates) < 7:
            next_date = last_date + pd.Timedelta(days=day_number)
            if next_date.weekday() < 5:
                predicted_dates.append(next_date)
            day_number += 1
    if timeType == "week":
        week_number = 1
        while len(predicted_dates) < 7:
            next_date = last_date + pd.Timedelta(weeks=week_number)
            if next_date.weekday() == 5:
                next_date -= pd.Timedelta(days=1)
            if next_date.weekday() == 6:
                next_date -= pd.Timedelta(days=2)
            predicted_dates.append(next_date)
            week_number += 1
    if timeType == "month":
        month_number = 1
        while len(predicted_dates) < 7:
            next_date = last_date + pd.DateOffset(months=month_number)
            if next_date.weekday() == 5:
                next_date -= pd.Timedelta(days=1)
            if next_date.weekday() == 6:
                next_date -= pd.Timedelta(days=2)
            predicted_dates.append(next_date)    
            month_number += 1


    # Build predicted DataFrame
    pred_df = pd.DataFrame({
        "symbol": symbol,
        "date": [d.strftime("%Y-%m-%d") for d in predicted_dates],
        "close": predicted_prices
    })

    return pred_df.to_dict(orient="records")