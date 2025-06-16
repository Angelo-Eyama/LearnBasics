from fastapi import FastAPI, status
import subprocess
import tempfile
import os
import time
from fastapi.middleware.cors import CORSMiddleware
from schemas import ExecuteRequest, ExecuteResult, FunctionTestRequest
from schemas import FunctionTestResult, TestResult

app = FastAPI(title="JavaScript Compiler Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "JavaScript Compiler Service", "runtime": "Node.js"}

@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    """
    Endpoint de verificación de salud
    """
    return {"status": "OK", "compiler": "javascript"}


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

@app.post("/test-function", response_model=FunctionTestResult)
async def test_javascript_function(request: FunctionTestRequest):
    """
    Prueba una función JavaScript con casos de prueba específicos
    """
    start_time = time.time()
    temp_file = None
    
    try:
        # Generar código de prueba
        test_code = generate_js_test_code(request.code, request.function_name, request.test_cases)
        
        # Crear archivo temporal para el código
        with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
            f.write(test_code)
            temp_file = f.name
        
        test_results = []
        passed_count = 0
        
        for i, test_case in enumerate(request.test_cases):
            try:
                # Ejecutar el código con Node.js
                process = subprocess.run(
                    ['node', temp_file],
                    input=f"{i}\n{test_case.input}",
                    capture_output=True,
                    text=True,
                    timeout=5
                )
                
                actual_output = process.stdout.strip()
                expected_output = test_case.expected_output.strip()
                test_passed = actual_output == expected_output and process.returncode == 0
                
                if test_passed:
                    passed_count += 1
                
                test_results.append(TestResult(
                    test_passed=test_passed,
                    input_used=test_case.input,
                    expected_output=expected_output,
                    actual_output=actual_output,
                    description=test_case.description,
                    error=process.stderr if process.stderr else ""
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
        # Limpiar archivo temporal
        if temp_file and os.path.exists(temp_file):
            os.unlink(temp_file)

def generate_js_test_code(user_code: str, function_name: str, test_cases: list) -> str:
    """
    Genera código JavaScript que incluye la función del usuario y código de prueba
    """
    test_code = f"""
{user_code}

// Leer entrada estándar
const readline = require('readline').createInterface({{
    input: process.stdin,
    output: process.stdout
}});

// Definir casos de prueba
const TEST_CASES = {[
    {"input": test_case.input, "expected": test_case.expected_output} 
    for test_case in test_cases
]};

let inputLines = [];
readline.on('line', (line) => {{
    inputLines.push(line);
    if (inputLines.length === 2) {{
        runTest();
        readline.close();
    }}
}});

function runTest() {{
    const testIndex = parseInt(inputLines[0]);
    if (testIndex < 0 || testIndex >= TEST_CASES.length) {{
        console.error('Índice de prueba inválido');
        process.exit(1);
    }}

    const testCase = TEST_CASES[testIndex];
    const inputs = inputLines[1].trim().split(' ').map(x => {{
        const num = Number(x);
        return isNaN(num) ? x : num;
    }});
    
    try {{
        let result;
        switch(inputs.length) {{
            case 1:
                result = {function_name}(inputs[0]);
                break;
            case 2:
                result = {function_name}(inputs[0], inputs[1]);
                break;
            case 3:
                result = {function_name}(inputs[0], inputs[1], inputs[2]);
                break;
            default:
                result = {function_name}(...inputs);
        }}
        
        // Convertir el resultado a string para comparación consistente
        console.log(String(result));
    }} catch (error) {{
        console.error(error.message);
        process.exit(1);
    }}
}}
"""
    return test_code

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
