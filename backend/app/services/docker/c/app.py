from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import subprocess
import tempfile
import os
import time
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="C Compiler Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ExecuteRequest(BaseModel):
    code: str
    input_data: str = ""

class ExecuteResult(BaseModel):
    success: bool
    output: str
    error: str = ""
    execution_time: float

@app.get("/")
async def root():
    return {"message": "C Compiler Service", "compiler": "gcc"}

@app.post("/execute", response_model=ExecuteResult)
async def execute_c_code(request: ExecuteRequest):
    """
    Compila y ejecuta código C
    """
    start_time = time.time()
    temp_source = None
    temp_executable = None
    
    try:
        # Crear archivo temporal para el código fuente
        with tempfile.NamedTemporaryFile(mode='w', suffix='.c', delete=False) as f:
            f.write(request.code)
            temp_source = f.name
        
        # Nombre del ejecutable temporal
        temp_executable = temp_source.replace('.c', '')
        
        # Compilar el código
        compile_process = subprocess.run(
            ['gcc', temp_source, '-o', temp_executable],
            capture_output=True,
            text=True,
            timeout=15
        )
        
        if compile_process.returncode != 0:
            return ExecuteResult(
                success=False,
                output="",
                error=f"Error de compilación: {compile_process.stderr}",
                execution_time=time.time() - start_time
            )
        
        # Ejecutar el programa compilado
        execute_process = subprocess.run(
            [temp_executable],
            input=request.input_data,
            capture_output=True,
            text=True,
            timeout=10
        )
        
        execution_time = time.time() - start_time
        
        return ExecuteResult(
            success=execute_process.returncode == 0,
            output=execute_process.stdout,
            error=execute_process.stderr if execute_process.stderr else "",
            execution_time=execution_time
        )
        
    except subprocess.TimeoutExpired:
        return ExecuteResult(
            success=False,
            output="",
            error="Error: El código tardó demasiado en compilar/ejecutar (timeout)",
            execution_time=time.time() - start_time
        )
    except Exception as e:
        return ExecuteResult(
            success=False,
            output="",
            error=f"Error: {str(e)}",
            execution_time=time.time() - start_time
        )
    finally:
        # Limpiar archivos temporales
        try:
            if temp_source and os.path.exists(temp_source):
                os.unlink(temp_source)
            if temp_executable and os.path.exists(temp_executable):
                os.unlink(temp_executable)
        except:
            pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
