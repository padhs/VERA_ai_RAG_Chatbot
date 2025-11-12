from fastapi import FastAPI
from fastapi.applications import BaseHTTPMiddleware
from fastapi.middleware.cors import CORSMiddleware
from routes.route import router
import logging
import time



logging.basicConfig(
    level=logging.INFO, 
    format="%(asctime)s - %(message)s"
    )

# ------------ Logging Middleware ------------
class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        start_time = time.time()
        response = await call_next(request)
        duration = time.time() - start_time
        logging.info(f"Request: {request.method} {request.url.path} - Duration: {duration:.2f}s")
        return response


app = FastAPI(title="Vera[backend]: Legal AI Assistant")

# ------------ CORS Middleware ------------
# allow local frontend to access the API
app.add_middleware( # everything is allowd 🤣 
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(LoggingMiddleware)

app.include_router(router) # include all routes from the router

