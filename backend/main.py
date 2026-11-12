from fastapi import FastAPI 


app = FastAPI()

@app.get("/")
def home():
    print("Succesfully connected Fatsapi")
    return {"message":"Succesfully connected"}