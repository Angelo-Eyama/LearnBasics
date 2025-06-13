from abc import ABC, abstractmethod
from typing import Any

class BaseService(ABC):
    """Clase base para todos los servicios"""
    
    async def initialize(self) -> None:
        """Inicializa el servicio"""
        pass
    
    async def shutdown(self) -> None:
        """Limpia recursos del servicio"""
        pass