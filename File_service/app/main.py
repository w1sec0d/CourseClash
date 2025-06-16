from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
# activities_service/app/main.py
from fastapi import FastAPI
from app.routers import activities  # asumiendo que tienes un archivo activities.py
import os
import shutil

app = FastAPI()
app.include_router(activities.router, prefix="/activities", tags=["Activities"])

# Directorio donde se guardan los archivos
UPLOAD_DIR = "uploaded_files"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Montar la carpeta como archivos estáticos accesibles vía /static
app.mount("/static", StaticFiles(directory=UPLOAD_DIR), name="static")


# 📤 Subir archivo
@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename}


# 📄 Listar archivos
@app.get("/files/")
def list_files():
    files = os.listdir(UPLOAD_DIR)
    return {"files": files}


# 🔗 Obtener URL pública para visualizar archivo
@app.get("/files/{filename}")
def get_file_url(request: Request, filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    file_url = request.url_for("static", path=filename)
    return {"filename": filename, "url": file_url}


# ⬇️ Descargar archivo directamente
@app.get("/download/{filename}")
def download_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=filename, media_type='application/octet-stream')


# 🗑️ Eliminar archivo
@app.delete("/files/{filename}")
def delete_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    os.remove(file_path)
    return {"detail": f"File '{filename}' deleted."}
