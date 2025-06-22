import json
from fastapi import FastAPI, status
from typing import List
import subprocess
import tempfile
import os
import time
import sys
from fastapi.middleware.cors import CORSMiddleware
from schemas import ExecuteRequest, ExecuteResult, FunctionTestRequest
from schemas import FunctionTestResult, TestResult

app = FastAPI(title="Python Compiler Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Python Compiler Service", "version": sys.version}

@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    """
    Endpoint de verificación de salud
    """
    return {"status": "OK", "compiler": "python"}

@app.post("/execute", response_model=ExecuteResult)
async def execute_python_code(request: ExecuteRequest):
    """
    Ejecuta código Python de manera segura
    """
    start_time = time.time()
    
    try:
        # Crear archivo temporal para el código
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False, encoding='utf-8') as f:
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

@app.post("/test-function", response_model=FunctionTestResult)
async def test_python_function(request: FunctionTestRequest):
    """
    Prueba una función Python con casos de prueba específicos
    """
    start_time = time.time()
    
    try:
        #Generar código de prueba
        test_code = generate_python_test_code(request.code, request.function_name, request.test_cases)
        
        # Crear archivo temporal para el código
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False, encoding='utf-8') as f:
            f.write(test_code)
            temp_file = f.name
        
        test_results = []
        passed_count = 0
        
        for i, test_case in enumerate(request.test_cases):
            try:
                # Convertir argumentos a JSON
                args_json = json.dumps(test_case.inputs)
                
                # Ejecutar el código con el caso de prueba específico
                process = subprocess.Popen(
                    [sys.executable, temp_file],
                    stdin=subprocess.PIPE,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True
                )
                # Convertir los argumentos de entrada a JSON
                stdin_data = f"{i}\n{args_json}\n"
                stdout, stderr = process.communicate(input=stdin_data, timeout=5)
                
                actual_output = stdout.strip()
                expected_output = test_case.expected_output.strip()
                test_passed = actual_output == expected_output and process.returncode == 0
                
                if test_passed:
                    passed_count += 1
                
                test_results.append(TestResult(
                    test_passed=test_passed,
                    input_used=test_case.inputs,
                    expected_output=expected_output,
                    actual_output=actual_output,
                    description=test_case.description,
                    error=stderr if stderr else ""
                ))
                
            except subprocess.TimeoutExpired:
                test_results.append(TestResult(
                    test_passed=False,
                    input_used=test_case.inputs,
                    expected_output=test_case.expected_output,
                    actual_output="",
                    description=test_case.description,
                    error="Timeout: La función tardó demasiado en ejecutarse"
                ))
        
        # Limpiar archivo temporal
        os.unlink(temp_file)
        
        execution_time = time.time() - start_time
        
        return FunctionTestResult(
            success=True,
            total_tests=len(request.test_cases),
            passed_tests=passed_count,
            failed_tests=len(request.test_cases) - passed_count,
            test_results=test_results,
            compilation_error="",
            execution_time=execution_time
        )
        
    except Exception as e:
        if 'temp_file' in locals():
            os.unlink(temp_file)
        return FunctionTestResult(
            success=False,
            total_tests=len(request.test_cases),
            passed_tests=0,
            failed_tests=len(request.test_cases),
            test_results=[],
            compilation_error=f"Error: {str(e)}",
            execution_time=time.time() - start_time
        )

def generate_python_test_code(user_code: str, function_name: str, test_cases: list) -> str:
    """
    Genera código Python que incluye la función del usuario y código de prueba
    """
    # Convertir los casos de prueba a un formato más simple
    simplified_test_cases = [
        {
            "inputs": test_case.inputs,
            "expected": test_case.expected_output,
            "description": test_case.description
        }
        for test_case in test_cases
    ]
    test_code = f"""
import sys
import json
{user_code}

def main():
    test_index = int(input())
    
    test_cases = {simplified_test_cases}
    
    if 0 <= test_index < len(test_cases):
        test_case = test_cases[test_index]
        args = json.loads(input())
        
        # Llamar a la función con los parámetros
        try:
            result = {function_name}(*args)  # Desempaquetar argumentos
            print(result)
        except Exception as e:
            print(f"Error al ejecutar la función: {{e}}", file=sys.stderr)
            sys.exit(1)
    else:
        print("Error: Caso de prueba no válido", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
"""
    
    return test_code

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
