from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from .core.config import settings

# Crear el motor de SQLAlchemy
engine = create_engine(settings.DATABASE_URL)

# Crear una clase de sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Crear una clase base para los modelos
Base = declarative_base()

# Dependencia para obtener la sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Función para sincronizar usuario de Auth0 con la base de datos
def sync_auth0_user(db, auth0_user):
    """Sincroniza un usuario de Auth0 con la base de datos local
    
    Args:
        db: Sesión de base de datos
        auth0_user: Datos del usuario desde Auth0
        
    Returns:
        User: El usuario sincronizado
    """
    from .models.user import User
    
    # Buscar usuario por auth0_id
    user = db.query(User).filter(User.auth0_id == auth0_user["sub"]).first()
    
    if not user:
        # Crear nuevo usuario si no existe
        user = User(
            auth0_id=auth0_user["sub"],
            email=auth0_user.get("email"),
            name=auth0_user.get("name"),
            nickname=auth0_user.get("nickname"),
            picture=auth0_user.get("picture"),
            is_active=True
        )
        db.add(user)
    else:
        # Actualizar usuario existente
        user.email = auth0_user.get("email", user.email)
        user.name = auth0_user.get("name", user.name)
        user.nickname = auth0_user.get("nickname", user.nickname)
        user.picture = auth0_user.get("picture", user.picture)
        user.last_login = func.now()
    
    db.commit()
    db.refresh(user)
    
    return user
