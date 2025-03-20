import config
import shutil
from typing import Annotated
from fastapi import FastAPI, Form, File, UploadFile, Depends
from fastapi.middleware.cors import CORSMiddleware
from fraction import get_fractions_FMI_parallel
import json
from utils import load_process
import json
app = FastAPI()


origins = [config.ORIGIN]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# app.mount("/data", StaticFiles(directory="static"), name="static")


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/process")
async def upload_process(file: UploadFile = File(), timegranu: str = Form()):
    with open(file.filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    # process = load_process(file.filename)
    with open(file.filename, "r") as f:
        process_ = json.load(f)
    workable_fractions = get_fractions_FMI_parallel(
        process=process_, battery_capacity=1000, time_granularity_process=int(timegranu), time_granularity_wind=10, step_size=1000)

    return {"file_name": file.filename, "process": process_, "fractions": workable_fractions}


# @app.post("/show_process")
# async def show_process(file: UploadFile = File(...)):
#     # open pickle file
#     with open(file.filename, 'rb') as infile:
#         obj = pickle.load(infile)

#     # convert pickle object to json object
#     json_obj = json.loads(json.dumps(obj, default=str))
#     return json_obj


# @app.get("/fractions")
# async def get_fractions(fractions: dict = Depends(get_fractions_FMI)):
#     return fractions


# @app.get("/favicon.ico")
# async def get_favicon():
#     return {}
