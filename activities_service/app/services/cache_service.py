import redis
import json
import hashlib
import logging
import pickle
from typing import Optional, Any, Union, List, Dict
from datetime import datetime, timedelta
from functools import wraps
import os

logger = logging.getLogger(__name__)

class CacheService:
    """
    Servicio de cache multinivel inteligente para CourseClash
    
    Proporciona cache L2 (Redis distribuido) con:
    - Invalidación automática por eventos
    - Claves jerárquicas para gestión eficiente
    - Fallback graceful en caso de errores
    - Métricas de cache hit/miss
    """
    
    def __init__(self, redis_url: str = None):
        """Initialize Redis connection with connection pooling"""
        if redis_url is None:
            redis_url = os.getenv("REDIS_URL", "redis://:courseclash123@cc_redis_cache:6379/0")
            
        try:
            self.redis_client = redis.from_url(
                redis_url, 
                decode_responses=False,  # Keep as bytes for pickle
                socket_connect_timeout=5,
                socket_timeout=5,
                retry_on_timeout=True,
                health_check_interval=30,
                max_connections=20  # Pool de conexiones
            )
            # Test connection
            self.redis_client.ping()
            logger.info("✅ Redis cache connection established")
            
            # Initialize metrics
            self._hits = 0
            self._misses = 0
            
        except Exception as e:
            logger.error(f"❌ Failed to connect to Redis: {e}")
            self.redis_client = None

    def _generate_key(self, prefix: str, *args, **kwargs) -> str:
        """Generate a consistent cache key with hierarchical structure"""
        key_parts = [prefix] + [str(arg) for arg in args]
        if kwargs:
            sorted_kwargs = sorted(kwargs.items())
            key_parts.extend([f"{k}:{v}" for k, v in sorted_kwargs])
        
        key_string = ":".join(key_parts)
        
        # Hash long keys to prevent Redis key length limits
        if len(key_string) > 200:
            key_hash = hashlib.md5(key_string.encode()).hexdigest()
            return f"{prefix}:hash:{key_hash}"
        return key_string

    def get(self, key: str) -> Optional[Any]:
        """Get value from cache with metrics tracking"""
        if not self.redis_client:
            return None
            
        try:
            cached_data = self.redis_client.get(key)
            if cached_data:
                self._hits += 1
                logger.debug(f"🎯 Cache HIT for key: {key}")
                return pickle.loads(cached_data)
            else:
                self._misses += 1
                logger.debug(f"💨 Cache MISS for key: {key}")
                return None
        except Exception as e:
            logger.warning(f"Cache GET error for key {key}: {e}")
            self._misses += 1
            return None

    def set(self, key: str, value: Any, ttl: int = 300) -> bool:
        """Set value in cache with TTL (seconds)"""
        if not self.redis_client:
            return False
            
        try:
            serialized_value = pickle.dumps(value)
            result = self.redis_client.setex(key, ttl, serialized_value)
            logger.debug(f"💾 Cache SET for key: {key} (TTL: {ttl}s)")
            return result
        except Exception as e:
            logger.warning(f"Cache SET error for key {key}: {e}")
            return False

    def delete(self, key: str) -> bool:
        """Delete key from cache"""
        if not self.redis_client:
            return False
            
        try:
            result = bool(self.redis_client.delete(key))
            if result:
                logger.debug(f"🗑️ Cache DELETE for key: {key}")
            return result
        except Exception as e:
            logger.warning(f"Cache DELETE error for key {key}: {e}")
            return False

    def delete_pattern(self, pattern: str) -> int:
        """Delete all keys matching pattern"""
        if not self.redis_client:
            return 0
            
        try:
            keys = self.redis_client.keys(pattern)
            if keys:
                deleted = self.redis_client.delete(*keys)
                logger.debug(f"🗑️ Cache DELETE PATTERN {pattern}: {deleted} keys deleted")
                return deleted
            return 0
        except Exception as e:
            logger.warning(f"Cache DELETE PATTERN error for {pattern}: {e}")
            return 0

    # ========================================================================
    # CACHE METHODS ESPECÍFICOS PARA ACTIVITIES
    # ========================================================================

    def cache_activity(self, activity_id: int, activity_data: Any, ttl: int = 600) -> bool:
        """Cache activity data for 10 minutes"""
        key = self._generate_key("activity", activity_id)
        return self.set(key, activity_data, ttl)

    def get_cached_activity(self, activity_id: int) -> Optional[Any]:
        """Get cached activity data"""
        key = self._generate_key("activity", activity_id)
        return self.get(key)

    def cache_course_activities(self, course_id: int, activities_data: List[Any], ttl: int = 300) -> bool:
        """Cache course activities list for 5 minutes"""
        key = self._generate_key("course_activities", course_id)
        return self.set(key, activities_data, ttl)

    def get_cached_course_activities(self, course_id: int) -> Optional[List[Any]]:
        """Get cached course activities"""
        key = self._generate_key("course_activities", course_id)
        return self.get(key)

    def cache_user_submissions(self, user_id: int, submissions_data: List[Any], ttl: int = 180) -> bool:
        """Cache user submissions for 3 minutes"""
        key = self._generate_key("user_submissions", user_id)
        return self.set(key, submissions_data, ttl)

    def get_cached_user_submissions(self, user_id: int) -> Optional[List[Any]]:
        """Get cached user submissions"""
        key = self._generate_key("user_submissions", user_id)
        return self.get(key)

    def cache_activity_grades(self, activity_id: int, grades_data: List[Any], ttl: int = 300) -> bool:
        """Cache activity grades for 5 minutes"""
        key = self._generate_key("activity_grades", activity_id)
        return self.set(key, grades_data, ttl)

    def get_cached_activity_grades(self, activity_id: int) -> Optional[List[Any]]:
        """Get cached activity grades"""
        key = self._generate_key("activity_grades", activity_id)
        return self.get(key)

    # ========================================================================
    # INVALIDACIÓN INTELIGENTE
    # ========================================================================

    def invalidate_activity_cache(self, activity_id: int, course_id: int = None):
        """Invalidate all caches related to an activity"""
        # Delete specific activity cache
        activity_key = self._generate_key("activity", activity_id)
        self.delete(activity_key)
        
        # Delete activity grades cache
        grades_key = self._generate_key("activity_grades", activity_id)
        self.delete(grades_key)
        
        # Delete course activities cache if course_id provided
        if course_id:
            course_key = self._generate_key("course_activities", course_id)
            self.delete(course_key)
        
        logger.info(f"🗑️ Invalidated cache for activity {activity_id}")

    def invalidate_user_cache(self, user_id: int):
        """Invalidate all caches related to a user"""
        submissions_key = self._generate_key("user_submissions", user_id)
        self.delete(submissions_key)
        
        logger.info(f"🗑️ Invalidated cache for user {user_id}")

    def invalidate_course_cache(self, course_id: int):
        """Invalidate all caches related to a course"""
        course_key = self._generate_key("course_activities", course_id)
        self.delete(course_key)
        
        logger.info(f"🗑️ Invalidated cache for course {course_id}")

    # ========================================================================
    # MÉTRICAS Y MONITOREO
    # ========================================================================

    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache performance statistics"""
        total_requests = self._hits + self._misses
        hit_ratio = self._hits / total_requests if total_requests > 0 else 0
        
        stats = {
            "cache_hits": self._hits,
            "cache_misses": self._misses,
            "total_requests": total_requests,
            "hit_ratio": hit_ratio,
            "hit_ratio_percentage": hit_ratio * 100
        }
        
        # Add Redis info if available
        if self.redis_client:
            try:
                redis_info = self.redis_client.info('memory')
                stats.update({
                    "redis_memory_used": redis_info.get('used_memory_human', 'N/A'),
                    "redis_connected_clients": self.redis_client.info('clients').get('connected_clients', 0)
                })
            except Exception as e:
                logger.warning(f"Error getting Redis stats: {e}")
        
        return stats

    def reset_stats(self):
        """Reset cache statistics"""
        self._hits = 0
        self._misses = 0
        logger.info("📊 Cache statistics reset")

# ============================================================================
# CACHE DECORATOR FOR AUTOMATIC CACHING
# ============================================================================

def cache_result(prefix: str, ttl: int = 300, cache_on_args: List[str] = None):
    """
    Decorator to automatically cache function results
    
    Args:
        prefix: Cache key prefix
        ttl: Time to live in seconds
        cache_on_args: List of argument names to include in cache key
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Get cache service instance (assuming it's available in the service)
            cache_service = getattr(args[0], 'cache', None) if args else None
            if not cache_service:
                return func(*args, **kwargs)

            # Generate cache key based on function name and specified arguments
            cache_args = []
            if cache_on_args:
                for arg_name in cache_on_args:
                    if arg_name in kwargs:
                        cache_args.append(f"{arg_name}:{kwargs[arg_name]}")
            
            cache_key = cache_service._generate_key(
                f"{prefix}:{func.__name__}", 
                *cache_args
            )

            # Try to get from cache first
            cached_result = cache_service.get(cache_key)
            if cached_result is not None:
                logger.debug(f"🎯 Cache HIT for {func.__name__}")
                return cached_result

            # Execute function and cache result
            result = func(*args, **kwargs)
            cache_service.set(cache_key, result, ttl)
            logger.debug(f"💾 Cache MISS - stored result for {func.__name__}")
            return result
            
        return wrapper
    return decorator

# Global cache instance
cache_service = CacheService() 