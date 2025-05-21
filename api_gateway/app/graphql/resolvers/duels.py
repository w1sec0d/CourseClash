"""
Módulo de Resolvers de Duelos para GraphQL

Este módulo implementa las operaciones relacionadas con duelos
del API Gateway de CourseClash utilizando GraphQL.
"""

import strawberry
from typing import List, Optional
from datetime import datetime
import httpx
import os

# Environment variables
DUEL_SERVICE_URL = os.getenv("DUEL_SERVICE_URL", "http://duel_service:8002")
