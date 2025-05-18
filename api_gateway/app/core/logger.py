"""
Configuración centralizada de logging para CourseClash API Gateway.

Este módulo configura el sistema de logging con:
- Formato estructurado para mejor legibilidad
- Manejo de logs en consola
- Rotación de archivos de log
- Niveles de log configurables por entorno
"""

import logging
import sys
from logging.handlers import RotatingFileHandler
from pathlib import Path
import json
from datetime import datetime
import os

# Directorio para logs
LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)


class StructuredFormatter(logging.Formatter):
    """Formateador de logs en formato JSON estructurado."""

    def format(self, record):
        log_record = {
            "timestamp": datetime.now(datetime.timezone.utc).isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "pathname": record.pathname,
            "lineno": record.lineno,
            "module": record.module,
        }

        # Agregar campos adicionales si existen
        if hasattr(record, "extra") and record.extra:
            log_record.update(record.extra)

        return json.dumps(log_record, ensure_ascii=False)


def setup_logger(name: str = "courseclash"):
    """Configura y retorna un logger con el nombre especificado."""
    logger = logging.getLogger(name)

    # Evitar múltiples manejadores
    if logger.handlers:
        return logger

    # Nivel de log basado en entorno
    logger.setLevel(
        logging.DEBUG if os.getenv("DEBUG", "false").lower() == "true" else logging.INFO
    )

    # Formateador estructurado para archivo
    json_formatter = StructuredFormatter()

    # Handler para consola (formato legible)
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(
        logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
    )

    # Handler para archivo con rotación
    file_handler = RotatingFileHandler(
        LOG_DIR / "api_gateway.log",
        maxBytes=10 * 1024 * 1024,  # 10MB
        backupCount=5,
        encoding="utf-8",
    )
    file_handler.setFormatter(json_formatter)

    # Agregar handlers al logger
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)

    # Configurar el nivel de log para librerías externas
    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").handlers = []

    return logger


# Logger raíz de la aplicación
logger = setup_logger()
