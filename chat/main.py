from fastapi import FastAPI, UploadFile, File, WebSocket
from fastapi.responses import StreamingResponse, JSONResponse
from rag_chain import ingest_document, build_rag_chain
from utils import save_uploaded_file
import asyncio

app = FastAPI()


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = save_uploaded_file(file)
    ingest_document(file_path)
    return {"status": "uploaded and ingested"}


@app.websocket("/chat")
async def chat_stream(websocket: WebSocket):
    await websocket.accept()
    chain = build_rag_chain()

    while True:
        data = await websocket.receive_text()

        async def gen():
            response = ""
            for chunk in chain.stream({"question": data}):
                token = chunk.get("answer", "")
                response += token
                yield token

        async for token in gen():
            await websocket.send_text(token)


# Optional: GET endpoint for health check
@app.get("/")
async def root():
    return {"message": "SBK Assistant API running."}