import argparse
import subprocess
import time
import requests
from pathlib import Path

def find_docker_compose_dir() -> Path:
    """Encuentra el directorio que contiene docker-compose.yml"""
    current_dir = Path(__file__).parent
    docker_services_dir = current_dir / "app" / "services" / "docker"
    
    if not docker_services_dir.exists():
        raise FileNotFoundError(f"No se encontró el directorio {docker_services_dir}")
        
    if not (docker_services_dir / "docker-compose.yml").exists():
        raise FileNotFoundError(f"No se encontró docker-compose.yml en {docker_services_dir}")
        
    return docker_services_dir

def start_docker_services(docker_dir: Path, rebuild: bool = False) -> None:
    """Inicia los servicios de Docker Compose"""
    try:
        print("Iniciando servicios Docker...")
        cmd = ["docker","compose", "up", "-d"]
        if rebuild:
            cmd.insert(3, "--build")
            print("Rebuild activado: reconstruyendo imágenes de Docker")
        subprocess.run(
            cmd,
            cwd=docker_dir,
            check=True
        )
    except subprocess.CalledProcessError as e:
        print(f"Error al iniciar los servicios Docker: {e}")
        raise

def check_service_health(port: int) -> bool:
    """Verifica si un servicio está respondiendo"""
    url = f"http://localhost:{port}/health"
    try:
        response = requests.get(url, timeout=5)
        return response.status_code == 200
    except requests.RequestException:
        return False

def monitor_services() -> None:
    """Monitorea el estado de los servicios"""
    services = {
        "Python Compiler": 8001,
        "C/C++ Compiler": 8002,
        "JavaScript Compiler": 8003
    }
    
    print("\nVerificando estado de los servicios...")
    
    all_healthy = True
    for service_name, port in services.items():
        is_healthy = check_service_health(port)
        status = "✅ ACTIVO" if is_healthy else "❌ INACTIVO"
        print(f"{service_name}: {status}")
        if not is_healthy:
            all_healthy = False
    
    if not all_healthy:
        print("\n⚠️  Advertencia: Algunos servicios no están respondiendo")
    else:
        print("\n✨ Todos los servicios están activos y respondiendo")

def main():
    parser = argparse.ArgumentParser(description="Iniciar servicios de compiladores en Docker")
    parser.add_argument(
        "--rebuild", 
        action="store_true", 
        help="Reconstruye las imágenes de Docker antes de iniciar los servicios"
    )
    args = parser.parse_args()
    try:
        # Encontrar directorio de docker-compose
        docker_dir = find_docker_compose_dir()
        print(f"Directorio de servicios Docker encontrado: {docker_dir}")
        
        # Iniciar servicios
        start_docker_services(docker_dir, args.rebuild)
        
        # Esperar a que los servicios se inicien
        print("\nEsperando a que los servicios se inicialicen...")
        time.sleep(10)  # Dar tiempo a que los contenedores se inicien completamente
        
        # Verificar estado de los servicios
        monitor_services()
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())