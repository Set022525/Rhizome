from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def hello(name: str):
    return f"Hello {name}!"