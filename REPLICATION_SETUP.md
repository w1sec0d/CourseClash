# Base de Datos de Actividades - Configuración de Replicación

## Problema Identificado

La réplica de lectura para la base de datos de actividades no estaba configurada correctamente:
- Usaba imagen MySQL estándar en lugar de Bitnami MySQL
- No tenía configuración de replicación como slave
- La base de datos permanecía vacía porque no se replicaban los datos

## Solución Implementada

### Cambios en docker-compose.yml

1. **Imagen unificada**: Ambas bases de datos ahora usan `bitnami/mysql:8.0`
2. **Configuración de replicación slave**:
   ```yaml
   environment:
     - MYSQL_REPLICATION_MODE=slave
     - MYSQL_REPLICATION_USER=replicator
     - MYSQL_REPLICATION_PASSWORD=replicator123
     - MYSQL_MASTER_HOST=cc_activities_db
     - MYSQL_MASTER_PORT_NUMBER=3306
     - MYSQL_MASTER_ROOT_PASSWORD=password
   ```

### Arquitectura de Replicación

```
cc_activities_db (Master)          cc_activities_db_read (Slave)
Port: 3308:3306                   Port: 3309:3306
├── Escritura/Lectura             ├── Solo Lectura
├── Bitnami MySQL 8.0             ├── Bitnami MySQL 8.0
└── Replication User: replicator  └── Replica de: cc_activities_db
```

## Configuración del Servicio de Actividades

Para aprovechar la replicación, asegúrate de que el servicio de actividades use:

- **Base de datos Master** (`cc_activities_db:3306`) para operaciones de **escritura**
- **Base de datos Read Replica** (`cc_activities_db_read:3306`) para operaciones de **lectura**

### Variables de Entorno Actuales
```yaml
environment:
  - DATABASE_URL=mysql+pymysql://root:password@cc_activities_db:3306/activities_db
  - READ_DATABASE_URL=mysql+pymysql://root:password@cc_activities_db_read:3306/activities_db
```

## Verificación de la Replicación

### Script Automático
Ejecuta el script de verificación:
```bash
./verify_replication.sh
```

### Verificación Manual

1. **Verificar estado del master**:
   ```bash
   docker-compose exec cc_activities_db mysql -u root -ppassword -e "SHOW MASTER STATUS;"
   ```

2. **Verificar estado del slave**:
   ```bash
   docker-compose exec cc_activities_db_read mysql -u root -ppassword -e "SHOW SLAVE STATUS\G"
   ```

3. **Campos importantes en SLAVE STATUS**:
   - `Slave_IO_Running: Yes`
   - `Slave_SQL_Running: Yes`
   - `Seconds_Behind_Master: 0` (o número pequeño)
   - `Last_Error: (vacío)`

## Comandos Útiles

### Reiniciar la Replicación
```bash
# Detener servicios de BD
docker-compose stop cc_activities_db cc_activities_db_read

# Eliminar volúmenes (CUIDADO: esto borra los datos)
docker volume rm courseclash_activities_mysql_data courseclash_activities_mysql_read_data

# Reiniciar servicios
docker-compose up -d cc_activities_db cc_activities_db_read
```

### Monitoreo de la Replicación
```bash
# Ver logs del slave
docker-compose logs cc_activities_db_read

# Verificar lag de replicación
docker-compose exec cc_activities_db_read mysql -u root -ppassword -e "SHOW SLAVE STATUS\G" | grep Seconds_Behind_Master
```

## Beneficios de esta Configuración

1. **Escalabilidad**: Las consultas de lectura se distribuyen a la réplica
2. **Disponibilidad**: Si el master falla temporalmente, la réplica mantiene los datos
3. **Rendimiento**: Reduce la carga en la base de datos principal
4. **Separación de responsabilidades**: Escrituras y lecturas en instancias dedicadas

## Consideraciones Importantes

- La replicación puede tener un pequeño retraso (lag)
- Solo usar la réplica para operaciones de **solo lectura**
- Monitorear el estado de replicación regularmente
- En caso de problemas, verificar los logs del slave primero

## Troubleshooting

### La réplica no se conecta al master
1. Verificar que el master esté funcionando
2. Comprobar las credenciales de replicación
3. Revisar la conectividad de red entre contenedores

### Datos no se replican
1. Verificar que `Slave_IO_Running` y `Slave_SQL_Running` estén en `Yes`
2. Revisar `Last_Error` en el estado del slave
3. Verificar que no haya conflictos de datos

### High lag en la replicación
1. Verificar recursos del sistema
2. Comprobar el tamaño de las transacciones
3. Considerar optimizaciones de configuración MySQL 