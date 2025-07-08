"""
Database package for the activities service.
Contains configuration for master/read replica setup and legacy database functions.
"""

# Import from the original database.py file (for backward compatibility)
from ..database import (
    engine,
    create_tables,
    get_db,
    SessionLocal,
    Base
)

# Import from the new config.py file (for master/replica setup)
from .config import (
    get_master_session,
    get_read_session,
    get_db_master,
    get_db_read,
    DatabaseRouter,
    check_database_health,
    get_database_stats,
    init_database,
    master_engine,
    read_engine,
    Base
)

# Create an instance of DatabaseRouter for convenience
db_router = DatabaseRouter()

__all__ = [
    # Legacy database functions (for backward compatibility)
    'engine',
    'create_tables',
    'get_db',
    'SessionLocal',
    
    # New master/replica functions
    'get_master_session',
    'get_read_session', 
    'get_db_master',
    'get_db_read',
    'DatabaseRouter',
    'db_router',
    'check_database_health',
    'get_database_stats',
    'init_database',
    'master_engine',
    'read_engine',
    'Base'
]