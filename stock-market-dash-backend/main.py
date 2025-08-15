from fastapi import FastAPI, Query
import httpx
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

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

# @app.get("/stock-details")
# async def get_stock_details(symbol: str = Query("AAPL")):
#     url = f"https://financialmodelingprep.com/stable/historical-price-eod/light?symbol={symbol}&apikey={API_KEY}"
#     async with httpx.AsyncClient() as client:
#         response = await client.get(url)
#         data = response.json()
    
#     return data[0]

@app.get("/stock-details") #past 7 days (for stock details)
async def get_daily_chart_data(symbol: str = Query("AAPL")):
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

@app.get("/daily-chart-data") #past 7 days (for charts)
async def get_daily_chart_data(symbol: str = Query("AAPL")):
    url = f"https://financialmodelingprep.com/stable/historical-price-eod/full?symbol={symbol}&apikey={API_KEY}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        data = response.json()
    
    last_seven_days = data[:7]
    last_seven_days.reverse()
    
    return last_seven_days