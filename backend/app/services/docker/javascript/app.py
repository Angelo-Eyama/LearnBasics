from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import subprocess
import tempfile
import os
import time
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="JavaScript Compiler Service")

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
    return {"message": "JavaScript Compiler Service", "runtime": "Node.js"}

@app.post("/execute", response_model=ExecuteResult)
async def execute_js_code(request: ExecuteRequest):
    """
    Ejecuta código JavaScript usando Node.js
    """
    start_time = time.time()
    temp_file = None
    
    try:
        # Crear archivo temporal para el código
        with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
            # Si hay input_data, lo agregamos al código
            if request.input_data:
                # Simulamos readline para obtener input
                input_lines = repr(request.input_data.split('\n'))
                modified_code = f"""
const readline = require('readline');
const rl = readline.createInterface({{
    input: process.stdin,
    output: process.stdout
}});

// Simular input predefinido
const inputData = {input_lines};
let inputIndex = 0;

// Sobrescribir console.log para capturar salida
const originalLog = console.log;
let output = [];
console.log = (...args) => {{
    output.push(args.join(' '));
}};

// Función para simular prompt/input
global.prompt = function(question) {{
    if (question) originalLog(question);
    return inputIndex < inputData.length ? inputData[inputIndex++] : '';
}};

// Ejecutar código del usuario
try {{
{request.code}
}} catch (error) {{
    console.error(error.message);
}}

// Mostrar output capturado
output.forEach(line => originalLog(line));
"""
            else:
                modified_code = request.code
                
            f.write(modified_code)
            temp_file = f.name
        
        # Ejecutar con Node.js
        process = subprocess.run(
            ['node', temp_file],
            input=request.input_data,
            capture_output=True,
            text=True,
            timeout=10
        )
        
        execution_time = time.time() - start_time
        
        return ExecuteResult(
            success=process.returncode == 0,
            output=process.stdout,
            error=process.stderr if process.stderr else "",
            execution_time=execution_time
        )
        
    except subprocess.TimeoutExpired:
        return ExecuteResult(
            success=False,
            output="",
            error="Error: El código tardó demasiado en ejecutarse (timeout 10s)",
            execution_time=10.0
        )
    except Exception as e:
        return ExecuteResult(
            success=False,
            output="",
            error=f"Error de ejecución: {str(e)}",
            execution_time=time.time() - start_time
        )
    finally:
        # Limpiar archivo temporal
        try:
            if temp_file and os.path.exists(temp_file):
                os.unlink(temp_file)
        except:
            pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
