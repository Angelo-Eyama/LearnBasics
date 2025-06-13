from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import subprocess
import tempfile
import os
import time
import sys
from contextlib import redirect_stdout, redirect_stderr
import io
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Python Compiler Service")

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
    return {"message": "Python Compiler Service", "version": sys.version}

@app.post("/execute", response_model=ExecuteResult)
async def execute_python_code(request: ExecuteRequest):
    """
    Ejecuta código Python de manera segura
    """
    start_time = time.time()
    
    try:
        # Crear archivo temporal para el código
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            f.write(request.code)
            temp_file = f.name
        
        # Ejecutar el código con timeout
        process = subprocess.Popen(
            [sys.executable, temp_file],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            # timeout=10  # 10 segundos timeout
        )
        
        stdout, stderr = process.communicate(input=request.input_data, timeout=10)
        execution_time = time.time() - start_time
        
        # Limpiar archivo temporal
        os.unlink(temp_file)
        
        if process.returncode == 0:
            return ExecuteResult(
                success=True,
                output=stdout,
                error=stderr if stderr else "",
                execution_time=execution_time
            )
        else:
            return ExecuteResult(
                success=False,
                output=stdout,
                error=stderr,
                execution_time=execution_time
            )
            
    except subprocess.TimeoutExpired:
        if 'temp_file' in locals():
            os.unlink(temp_file)
        return ExecuteResult(
            success=False,
            output="",
            error="Error: El código tardó demasiado en ejecutarse (timeout 10s)",
            execution_time=10.0
        )
    except Exception as e:
        if 'temp_file' in locals():
            os.unlink(temp_file)
        return ExecuteResult(
            success=False,
            output="",
            error=f"Error de ejecución: {str(e)}",
            execution_time=time.time() - start_time
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
