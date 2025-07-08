#!/usr/bin/env python3
"""
Performance Testing Script para CourseClash
Patrón: Read Replica + Multi-Level Intelligent Caching

Este script mide la efectividad del patrón implementado comparando:
1. Rendimiento antes vs después de la optimización
2. Métricas de cache hit/miss
3. Latencia de base de datos
4. Throughput bajo diferentes cargas
5. Escalabilidad horizontal

Autor: CourseClash Team
"""

import asyncio
import aiohttp
import time
import statistics
import random
import json
import logging
from typing import List, Dict, Any
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor, as_completed
import matplotlib.pyplot as plt
import numpy as np
from dataclasses import dataclass
import sys
import os

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('performance_test.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class PerformanceMetrics:
    """Métricas de rendimiento"""
    test_name: str
    total_requests: int
    successful_requests: int
    failed_requests: int
    avg_response_time: float
    min_response_time: float
    max_response_time: float
    p95_response_time: float
    p99_response_time: float
    requests_per_second: float
    cache_hit_ratio: float
    errors: List[str]

class PerformanceTester:
    """
    Tester de rendimiento para CourseClash
    """
    
    def __init__(self, base_url: str = "http://localhost:8003"):
        self.base_url = base_url
        self.session = None
        self.results = []
        
        # Configuración de test
        self.test_data = {
            "course_ids": [1, 2, 3, 4, 5],
            "activity_ids": list(range(1, 101)),  # 100 actividades de prueba
            "user_token": "test_token_123"
        }
    
    async def __aenter__(self):
        """Async context manager entry"""
        timeout = aiohttp.ClientTimeout(total=30)
        self.session = aiohttp.ClientSession(timeout=timeout)
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.session:
            await self.session.close()
    
    # ========================================================================
    # SETUP Y PREPARACIÓN DE DATOS
    # ========================================================================
    
    async def setup_test_data(self):
        """Crear datos de prueba para el testing"""
        logger.info("🔧 Configurando datos de prueba...")
        
        # Crear actividades de prueba
        for course_id in self.test_data["course_ids"]:
            for i in range(20):  # 20 actividades por curso
                activity_data = {
                    "course_id": course_id,
                    "title": f"Actividad de Prueba {i+1} - Curso {course_id}",
                    "description": f"Descripción de prueba para testing de rendimiento. Actividad {i+1}",
                    "activity_type": random.choice(["task", "quiz", "announcement"]),
                    "due_date": (datetime.now() + timedelta(days=random.randint(1, 30))).isoformat()
                }
                
                try:
                    async with self.session.post(
                        f"{self.base_url}/api/activities/",
                        json=activity_data,
                        headers={"User_id": "1"}
                    ) as response:
                        if response.status == 201:
                            logger.debug(f"✅ Creada actividad para curso {course_id}")
                        else:
                            logger.warning(f"⚠️ Error creando actividad: {response.status}")
                except Exception as e:
                    logger.error(f"❌ Error en setup: {e}")
        
        logger.info("✅ Datos de prueba configurados")
    
    # ========================================================================
    # TESTS DE RENDIMIENTO
    # ========================================================================
    
    async def test_read_performance(self, endpoint: str, concurrent_users: int = 10, duration: int = 60) -> PerformanceMetrics:
        """Test de rendimiento para operaciones de lectura"""
        logger.info(f"🚀 Iniciando test de lectura: {endpoint} con {concurrent_users} usuarios concurrentes")
        
        start_time = time.time()
        response_times = []
        successful_requests = 0
        failed_requests = 0
        errors = []
        
        async def make_request():
            nonlocal successful_requests, failed_requests
            
            try:
                # Seleccionar endpoint aleatorio
                if "course_id" in endpoint:
                    course_id = random.choice(self.test_data["course_ids"])
                    url = f"{self.base_url}{endpoint.format(course_id=course_id)}"
                elif "activity_id" in endpoint:
                    activity_id = random.choice(self.test_data["activity_ids"])
                    url = f"{self.base_url}{endpoint.format(activity_id=activity_id)}"
                else:
                    url = f"{self.base_url}{endpoint}"
                
                request_start = time.time()
                async with self.session.get(url) as response:
                    request_end = time.time()
                    response_time = request_end - request_start
                    response_times.append(response_time)
                    
                    if response.status == 200:
                        successful_requests += 1
                    else:
                        failed_requests += 1
                        errors.append(f"HTTP {response.status}")
                        
            except Exception as e:
                failed_requests += 1
                errors.append(str(e))
        
        # Ejecutar requests concurrentemente
        tasks = []
        end_time = start_time + duration
        
        while time.time() < end_time:
            # Crear batch de requests concurrentes
            batch_tasks = [make_request() for _ in range(concurrent_users)]
            tasks.extend(batch_tasks)
            
            # Esperar a que se complete el batch
            await asyncio.gather(*batch_tasks)
            
            # Pequeña pausa para evitar saturar
            await asyncio.sleep(0.1)
        
        # Calcular métricas
        total_time = time.time() - start_time
        total_requests = successful_requests + failed_requests
        
        if response_times:
            avg_response_time = statistics.mean(response_times)
            min_response_time = min(response_times)
            max_response_time = max(response_times)
            p95_response_time = np.percentile(response_times, 95)
            p99_response_time = np.percentile(response_times, 99)
        else:
            avg_response_time = min_response_time = max_response_time = p95_response_time = p99_response_time = 0
        
        requests_per_second = total_requests / total_time if total_time > 0 else 0
        
        # Obtener métricas de cache
        cache_hit_ratio = await self.get_cache_hit_ratio()
        
        metrics = PerformanceMetrics(
            test_name=endpoint,
            total_requests=total_requests,
            successful_requests=successful_requests,
            failed_requests=failed_requests,
            avg_response_time=avg_response_time,
            min_response_time=min_response_time,
            max_response_time=max_response_time,
            p95_response_time=p95_response_time,
            p99_response_time=p99_response_time,
            requests_per_second=requests_per_second,
            cache_hit_ratio=cache_hit_ratio,
            errors=list(set(errors))
        )
        
        logger.info(f"✅ Test completado: {total_requests} requests, {requests_per_second:.2f} RPS, Cache Hit: {cache_hit_ratio:.1%}")
        return metrics
    
    async def test_write_performance(self, concurrent_users: int = 5, duration: int = 30) -> PerformanceMetrics:
        """Test de rendimiento para operaciones de escritura"""
        logger.info(f"🚀 Iniciando test de escritura con {concurrent_users} usuarios concurrentes")
        
        start_time = time.time()
        response_times = []
        successful_requests = 0
        failed_requests = 0
        errors = []
        
        async def make_write_request():
            nonlocal successful_requests, failed_requests
            
            try:
                # Crear nueva actividad
                activity_data = {
                    "course_id": random.choice(self.test_data["course_ids"]),
                    "title": f"Test Activity {random.randint(1000, 9999)}",
                    "description": "Performance test activity",
                    "activity_type": random.choice(["task", "quiz", "announcement"]),
                    "due_date": (datetime.now() + timedelta(days=7)).isoformat()
                }
                
                request_start = time.time()
                async with self.session.post(
                    f"{self.base_url}/api/activities/",
                    json=activity_data,
                    headers={"User_id": "1"}
                ) as response:
                    request_end = time.time()
                    response_time = request_end - request_start
                    response_times.append(response_time)
                    
                    if response.status == 201:
                        successful_requests += 1
                    else:
                        failed_requests += 1
                        errors.append(f"HTTP {response.status}")
                        
            except Exception as e:
                failed_requests += 1
                errors.append(str(e))
        
        # Ejecutar requests concurrentemente por duración especificada
        end_time = start_time + duration
        
        while time.time() < end_time:
            # Crear batch de requests concurrentes
            batch_tasks = [make_write_request() for _ in range(concurrent_users)]
            
            # Esperar a que se complete el batch
            await asyncio.gather(*batch_tasks)
            
            # Pausa más larga para escrituras
            await asyncio.sleep(0.5)
        
        # Calcular métricas
        total_time = time.time() - start_time
        total_requests = successful_requests + failed_requests
        
        if response_times:
            avg_response_time = statistics.mean(response_times)
            min_response_time = min(response_times)
            max_response_time = max(response_times)
            p95_response_time = np.percentile(response_times, 95)
            p99_response_time = np.percentile(response_times, 99)
        else:
            avg_response_time = min_response_time = max_response_time = p95_response_time = p99_response_time = 0
        
        requests_per_second = total_requests / total_time if total_time > 0 else 0
        
        metrics = PerformanceMetrics(
            test_name="write_operations",
            total_requests=total_requests,
            successful_requests=successful_requests,
            failed_requests=failed_requests,
            avg_response_time=avg_response_time,
            min_response_time=min_response_time,
            max_response_time=max_response_time,
            p95_response_time=p95_response_time,
            p99_response_time=p99_response_time,
            requests_per_second=requests_per_second,
            cache_hit_ratio=0.0,  # No aplica para escrituras
            errors=list(set(errors))
        )
        
        logger.info(f"✅ Test de escritura completado: {total_requests} requests, {requests_per_second:.2f} RPS")
        return metrics
    
    async def test_concurrent_batch_operations(self, batch_size: int = 10) -> PerformanceMetrics:
        """Test de operaciones batch concurrentes"""
        logger.info(f"🚀 Iniciando test de operaciones batch concurrentes (batch_size={batch_size})")
        
        start_time = time.time()
        response_times = []
        successful_requests = 0
        failed_requests = 0
        errors = []
        
        # Preparar batches de activity_ids
        batches = []
        for i in range(0, len(self.test_data["activity_ids"]), batch_size):
            batch = self.test_data["activity_ids"][i:i + batch_size]
            batches.append(batch)
        
        async def make_batch_request(activity_ids):
            nonlocal successful_requests, failed_requests
            
            try:
                request_start = time.time()
                async with self.session.post(
                    f"{self.base_url}/api/activities/batch",
                    json=activity_ids,
                    headers={"User_id": "1"}
                ) as response:
                    request_end = time.time()
                    response_time = request_end - request_start
                    response_times.append(response_time)
                    
                    if response.status == 200:
                        successful_requests += 1
                    else:
                        failed_requests += 1
                        errors.append(f"HTTP {response.status}")
                        
            except Exception as e:
                failed_requests += 1
                errors.append(str(e))
        
        # Ejecutar todos los batches concurrentemente
        tasks = [make_batch_request(batch) for batch in batches]
        await asyncio.gather(*tasks)
        
        # Calcular métricas
        total_time = time.time() - start_time
        total_requests = successful_requests + failed_requests
        
        if response_times:
            avg_response_time = statistics.mean(response_times)
            min_response_time = min(response_times)
            max_response_time = max(response_times)
            p95_response_time = np.percentile(response_times, 95)
            p99_response_time = np.percentile(response_times, 99)
        else:
            avg_response_time = min_response_time = max_response_time = p95_response_time = p99_response_time = 0
        
        requests_per_second = total_requests / total_time if total_time > 0 else 0
        cache_hit_ratio = await self.get_cache_hit_ratio()
        
        metrics = PerformanceMetrics(
            test_name="batch_operations",
            total_requests=total_requests,
            successful_requests=successful_requests,
            failed_requests=failed_requests,
            avg_response_time=avg_response_time,
            min_response_time=min_response_time,
            max_response_time=max_response_time,
            p95_response_time=p95_response_time,
            p99_response_time=p99_response_time,
            requests_per_second=requests_per_second,
            cache_hit_ratio=cache_hit_ratio,
            errors=list(set(errors))
        )
        
        logger.info(f"✅ Test batch completado: {total_requests} batches, {requests_per_second:.2f} batches/s")
        return metrics
    
    # ========================================================================
    # MÉTRICAS Y UTILIDADES
    # ========================================================================
    
    async def get_cache_hit_ratio(self) -> float:
        """Obtener ratio de cache hit del servicio"""
        try:
            async with self.session.get(f"{self.base_url}/api/activities/metrics/performance") as response:
                if response.status == 200:
                    data = await response.json()
                    return data.get("cache_performance", {}).get("hit_ratio", 0.0)
        except Exception as e:
            logger.warning(f"No se pudo obtener cache hit ratio: {e}")
        return 0.0
    
    async def warm_up_cache(self):
        """Calentar cache antes de los tests"""
        logger.info("🔥 Calentando cache...")
        
        # Hacer requests a todos los endpoints para calentar cache
        for course_id in self.test_data["course_ids"]:
            try:
                async with self.session.get(f"{self.base_url}/api/activities/list/{course_id}") as response:
                    pass
            except Exception as e:
                logger.warning(f"Error en warm-up: {e}")
        
        # Precargar cache específicamente
        for course_id in self.test_data["course_ids"]:
            try:
                async with self.session.post(f"{self.base_url}/api/activities/preload-cache/{course_id}") as response:
                    pass
            except Exception as e:
                logger.warning(f"Error en precarga: {e}")
        
        logger.info("✅ Cache calentado")
    
    # ========================================================================
    # SUITE DE TESTS COMPLETA
    # ========================================================================
    
    async def run_performance_suite(self):
        """Ejecutar suite completa de tests de rendimiento"""
        logger.info("🎯 Iniciando suite completa de tests de rendimiento")
        
        # 1. Setup inicial
        await self.setup_test_data()
        
        # 2. Test sin cache (cold start)
        logger.info("❄️ Test 1: Cold start (sin cache)")
        cold_metrics = await self.test_read_performance(
            "/api/activities/list/{course_id}",
            concurrent_users=5,
            duration=30
        )
        self.results.append(cold_metrics)
        
        # 3. Calentar cache
        await self.warm_up_cache()
        
        # 4. Test con cache caliente
        logger.info("🔥 Test 2: Warm cache")
        warm_metrics = await self.test_read_performance(
            "/api/activities/list/{course_id}",
            concurrent_users=5,
            duration=30
        )
        self.results.append(warm_metrics)
        
        # 5. Test de escalabilidad (diferentes niveles de carga)
        logger.info("📈 Test 3: Escalabilidad")
        concurrent_levels = [10, 25, 50, 100]
        
        for level in concurrent_levels:
            logger.info(f"🚀 Test con {level} usuarios concurrentes")
            scale_metrics = await self.test_read_performance(
                "/api/activities/list/{course_id}",
                concurrent_users=level,
                duration=30
            )
            scale_metrics.test_name = f"scale_{level}_users"
            self.results.append(scale_metrics)
        
        # 6. Test de operaciones de escritura
        logger.info("✍️ Test 4: Operaciones de escritura")
        write_metrics = await self.test_write_performance(
            concurrent_users=5,
            duration=30
        )
        self.results.append(write_metrics)
        
        # 7. Test de operaciones batch
        logger.info("📦 Test 5: Operaciones batch")
        batch_metrics = await self.test_concurrent_batch_operations(batch_size=10)
        self.results.append(batch_metrics)
        
        # 8. Test de endpoints individuales
        logger.info("🎯 Test 6: Actividades individuales")
        individual_metrics = await self.test_read_performance(
            "/api/activities/{activity_id}",
            concurrent_users=20,
            duration=30
        )
        individual_metrics.test_name = "individual_activities"
        self.results.append(individual_metrics)
        
        logger.info("✅ Suite de tests completada")
    
    # ========================================================================
    # ANÁLISIS Y REPORTES
    # ========================================================================
    
    def analyze_results(self):
        """Analizar resultados y generar reporte"""
        logger.info("📊 Analizando resultados...")
        
        print("\n" + "="*80)
        print("📈 REPORTE DE PERFORMANCE - COURSECLASH")
        print("🎯 Patrón: Read Replica + Multi-Level Intelligent Caching")
        print("="*80)
        
        for metrics in self.results:
            print(f"\n🔍 Test: {metrics.test_name}")
            print(f"   Total Requests: {metrics.total_requests}")
            print(f"   Successful: {metrics.successful_requests}")
            print(f"   Failed: {metrics.failed_requests}")
            print(f"   Avg Response Time: {metrics.avg_response_time:.3f}s")
            print(f"   P95 Response Time: {metrics.p95_response_time:.3f}s")
            print(f"   P99 Response Time: {metrics.p99_response_time:.3f}s")
            print(f"   Requests/Second: {metrics.requests_per_second:.2f}")
            print(f"   Cache Hit Ratio: {metrics.cache_hit_ratio:.1%}")
            if metrics.errors:
                print(f"   Errors: {', '.join(metrics.errors)}")
        
        # Comparar cold vs warm
        cold_metrics = next((m for m in self.results if "cold" in m.test_name.lower()), None)
        warm_metrics = next((m for m in self.results if "warm" in m.test_name.lower()), None)
        
        if cold_metrics and warm_metrics:
            print(f"\n🔥 CACHE EFFECTIVENESS:")
            print(f"   Cold Start RPS: {cold_metrics.requests_per_second:.2f}")
            print(f"   Warm Cache RPS: {warm_metrics.requests_per_second:.2f}")
            improvement = ((warm_metrics.requests_per_second - cold_metrics.requests_per_second) / cold_metrics.requests_per_second) * 100
            print(f"   Performance Improvement: {improvement:.1f}%")
            
            latency_improvement = ((cold_metrics.avg_response_time - warm_metrics.avg_response_time) / cold_metrics.avg_response_time) * 100
            print(f"   Latency Improvement: {latency_improvement:.1f}%")
        
        # Análisis de escalabilidad
        scale_tests = [m for m in self.results if m.test_name.startswith("scale_")]
        if scale_tests:
            print(f"\n📈 SCALABILITY ANALYSIS:")
            for metrics in scale_tests:
                users = metrics.test_name.split("_")[1]
                print(f"   {users} users: {metrics.requests_per_second:.2f} RPS, {metrics.avg_response_time:.3f}s avg")
        
        print("\n" + "="*80)
    
    def generate_charts(self):
        """Generar gráficos de performance"""
        logger.info("📊 Generando gráficos...")
        
        # Gráfico de escalabilidad
        scale_tests = [m for m in self.results if m.test_name.startswith("scale_")]
        if scale_tests:
            users = [int(m.test_name.split("_")[1]) for m in scale_tests]
            rps = [m.requests_per_second for m in scale_tests]
            latency = [m.avg_response_time * 1000 for m in scale_tests]  # ms
            
            fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
            
            # Throughput vs Users
            ax1.plot(users, rps, 'b-o', linewidth=2, markersize=8)
            ax1.set_xlabel('Concurrent Users')
            ax1.set_ylabel('Requests per Second')
            ax1.set_title('Throughput vs Concurrent Users')
            ax1.grid(True, alpha=0.3)
            
            # Latency vs Users
            ax2.plot(users, latency, 'r-o', linewidth=2, markersize=8)
            ax2.set_xlabel('Concurrent Users')
            ax2.set_ylabel('Average Latency (ms)')
            ax2.set_title('Latency vs Concurrent Users')
            ax2.grid(True, alpha=0.3)
            
            plt.tight_layout()
            plt.savefig('performance_scalability.png', dpi=300, bbox_inches='tight')
            plt.close()
        
        # Gráfico de comparación cache
        cold_metrics = next((m for m in self.results if "cold" in m.test_name.lower()), None)
        warm_metrics = next((m for m in self.results if "warm" in m.test_name.lower()), None)
        
        if cold_metrics and warm_metrics:
            categories = ['Cold Start', 'Warm Cache']
            rps_values = [cold_metrics.requests_per_second, warm_metrics.requests_per_second]
            latency_values = [cold_metrics.avg_response_time * 1000, warm_metrics.avg_response_time * 1000]
            
            fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
            
            # RPS Comparison
            bars1 = ax1.bar(categories, rps_values, color=['lightcoral', 'lightblue'])
            ax1.set_ylabel('Requests per Second')
            ax1.set_title('Throughput: Cold vs Warm Cache')
            ax1.grid(True, alpha=0.3)
            
            # Add value labels on bars
            for bar, value in zip(bars1, rps_values):
                ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
                        f'{value:.1f}', ha='center', va='bottom', fontweight='bold')
            
            # Latency Comparison
            bars2 = ax2.bar(categories, latency_values, color=['lightcoral', 'lightblue'])
            ax2.set_ylabel('Average Latency (ms)')
            ax2.set_title('Latency: Cold vs Warm Cache')
            ax2.grid(True, alpha=0.3)
            
            # Add value labels on bars
            for bar, value in zip(bars2, latency_values):
                ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
                        f'{value:.1f}', ha='center', va='bottom', fontweight='bold')
            
            plt.tight_layout()
            plt.savefig('performance_cache_comparison.png', dpi=300, bbox_inches='tight')
            plt.close()
        
        logger.info("✅ Gráficos guardados como performance_*.png")
    
    def save_results(self, filename: str = "performance_results.json"):
        """Guardar resultados en archivo JSON"""
        logger.info(f"💾 Guardando resultados en {filename}")
        
        results_data = {
            "timestamp": datetime.now().isoformat(),
            "pattern": "Read Replica + Multi-Level Intelligent Caching",
            "test_config": {
                "base_url": self.base_url,
                "course_ids": self.test_data["course_ids"],
                "total_activities": len(self.test_data["activity_ids"])
            },
            "results": []
        }
        
        for metrics in self.results:
            results_data["results"].append({
                "test_name": metrics.test_name,
                "total_requests": metrics.total_requests,
                "successful_requests": metrics.successful_requests,
                "failed_requests": metrics.failed_requests,
                "avg_response_time": metrics.avg_response_time,
                "min_response_time": metrics.min_response_time,
                "max_response_time": metrics.max_response_time,
                "p95_response_time": metrics.p95_response_time,
                "p99_response_time": metrics.p99_response_time,
                "requests_per_second": metrics.requests_per_second,
                "cache_hit_ratio": metrics.cache_hit_ratio,
                "errors": metrics.errors
            })
        
        with open(filename, 'w') as f:
            json.dump(results_data, f, indent=2)
        
        logger.info(f"✅ Resultados guardados en {filename}")

# ============================================================================
# MAIN EXECUTION
# ============================================================================

async def main():
    """Función principal"""
    logger.info("🚀 Iniciando Performance Testing para CourseClash")
    
    # Configurar URL base
    base_url = os.getenv("API_BASE_URL", "http://localhost:8003")
    
    # Crear tester
    async with PerformanceTester(base_url) as tester:
        try:
            # Ejecutar suite completa
            await tester.run_performance_suite()
            
            # Analizar resultados
            tester.analyze_results()
            
            # Generar gráficos
            tester.generate_charts()
            
            # Guardar resultados
            tester.save_results()
            
            logger.info("✅ Testing completado exitosamente")
            
        except Exception as e:
            logger.error(f"❌ Error en testing: {e}")
            sys.exit(1)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("🛑 Testing interrumpido por usuario")
        sys.exit(0)
    except Exception as e:
        logger.error(f"❌ Error fatal: {e}")
        sys.exit(1) 