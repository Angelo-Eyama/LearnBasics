from fastapi import FastAPI, status
from pydantic import BaseModel
import subprocess
import tempfile
import os
import time
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.code import ExecuteRequest, ExecuteResult, FunctionTestRequest, FunctionTestResult, TestResult

app = FastAPI(title="C Compiler Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "C Compiler Service", "compiler": "gcc"}

@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    """
    Endpoint de verificación de salud
    """
    return {"status": "OK", "compiler": "gcc"}

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

@app.post("/test-function", response_model=FunctionTestResult)
async def test_c_function(request: FunctionTestRequest):
    """
    Prueba una función C con casos de prueba específicos
    """
    start_time = time.time()
    temp_source = None
    temp_executable = None
    
    try:
        # Generar código de prueba
        test_code = generate_c_test_code(request.code, request.function_name, request.test_cases)
        
        # Crear archivo temporal para el código fuente
        with tempfile.NamedTemporaryFile(mode='w', suffix='.c', delete=False) as f:
            f.write(test_code)
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
            return FunctionTestResult(
                success=False,
                total_tests=len(request.test_cases),
                passed_tests=0,
                failed_tests=len(request.test_cases),
                test_results=[],
                compilation_error=f"Error de compilación: {compile_process.stderr}",
                execution_time=time.time() - start_time
            )
        
        # Ejecutar las pruebas
        test_results = []
        passed_count = 0
        
        for i, test_case in enumerate(request.test_cases):
            try:
                # Ejecutar con el caso de prueba específico
                execute_process = subprocess.run(
                    [temp_executable],
                    input=f"{i}\n{test_case.input}",  # Enviar índice del test y entrada
                    capture_output=True,
                    text=True,
                    timeout=5
                )
                
                actual_output = execute_process.stdout.strip()
                expected_output = test_case.expected_output.strip()
                test_passed = actual_output == expected_output and execute_process.returncode == 0
                
                if test_passed:
                    passed_count += 1
                
                test_results.append(TestResult(
                    test_passed=test_passed,
                    input_used=test_case.input,
                    expected_output=expected_output,
                    actual_output=actual_output,
                    description=test_case.description,
                    error=execute_process.stderr if execute_process.stderr else ""
                ))
                
            except subprocess.TimeoutExpired:
                test_results.append(TestResult(
                    test_passed=False,
                    input_used=test_case.input,
                    expected_output=test_case.expected_output,
                    actual_output="",
                    description=test_case.description,
                    error="Timeout: La función tardó demasiado en ejecutarse"
                ))
        
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
        return FunctionTestResult(
            success=False,
            total_tests=len(request.test_cases),
            passed_tests=0,
            failed_tests=len(request.test_cases),
            test_results=[],
            compilation_error=f"Error: {str(e)}",
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

def generate_c_test_code(user_code: str, function_name: str, test_cases: list) -> str:
    """
    Genera código C que incluye la función del usuario y código de prueba
    """
    test_code = f"""
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

{user_code}

int main() {{
    int test_index;
    scanf("%d", &test_index);
    
    switch(test_index) {{
"""
    
    for i, test_case in enumerate(test_cases):
        # Parsear la entrada para extraer parámetros
        # Asumimos que la entrada son números separados por espacios
        inputs = test_case.input.strip().split()
        
        if len(inputs) == 1:
            test_code += f"""
        case {i}:
            printf("%d", {function_name}({inputs[0]}));
            break;
"""
        elif len(inputs) == 2:
            test_code += f"""
        case {i}:
            printf("%d", {function_name}({inputs[0]}, {inputs[1]}));
            break;
"""
        elif len(inputs) == 3:
            test_code += f"""
        case {i}:
            printf("%d", {function_name}({inputs[0]}, {inputs[1]}, {inputs[2]}));
            break;
"""
        # Añadir más casos según sea necesario
    
    test_code += """
        default:
            printf("Error: Caso de prueba no válido");
            return 1;
    }
    return 0;
}
"""
    
    return test_code

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
