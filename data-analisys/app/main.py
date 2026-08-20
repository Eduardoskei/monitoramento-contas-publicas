from fastapi import FastAPI

app = FastAPI()


@app.get("/health")
async def health():
    print('teste')
    return {"status": "healthy"}
