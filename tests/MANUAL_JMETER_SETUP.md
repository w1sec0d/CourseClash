# Configuración Manual de JMeter para CourseClash (Sin errores XML)

## ⚠️ Problemas con archivos .jmx

Si tienes problemas al cargar archivos `.jmx`, es mejor crear el test plan manualmente. Esto evita errores de estructura XML.

## 🛠️ Configuración Manual Paso a Paso

### 1. Crear Test Plan desde Cero

1. **Abrir JMeter**
2. **Hacer clic derecho** en `Test Plan`
3. **Add** → **Threads (Users)** → **Thread Group**

### 2. Configurar Thread Group

- **Name**: `Login Flow`
- **Number of Threads**: `1`
- **Ramp-up Period**: `1`
- **Loop Count**: `1`

### 3. Agregar Variables del Test Plan

1. **Clic derecho** en `Test Plan`
2. **Add** → **Config Element** → **User Defined Variables**
3. **Agregar estas variables**:

| Variable | Value                |
| -------- | -------------------- |
| SERVER   | localhost            |
| PORT     | 443                  |
| PROTOCOL | https                |
| EMAIL    | estudiante@gmail.com |
| PASSWORD | password123          |

### 4. Agregar Cookie Manager

1. **Clic derecho** en `Thread Group`
2. **Add** → **Config Element** → **HTTP Cookie Manager**

### 5. Agregar Header Manager

1. **Clic derecho** en `Thread Group`
2. **Add** → **Config Element** → **HTTP Header Manager**
3. **Agregar estos headers**:

| Name         | Value                   |
| ------------ | ----------------------- |
| Content-Type | application/json        |
| Accept       | application/json        |
| User-Agent   | JMeter CourseClash Test |

### 6. Primera Petición: GraphQL Login

1. **Clic derecho** en `Thread Group`
2. **Add** → **Sampler** → **HTTP Request**
3. **Configurar**:

   - **Name**: `1. GraphQL Login`
   - **Protocol**: `${PROTOCOL}`
   - **Server Name**: `${SERVER}`
   - **Port Number**: `${PORT}`
   - **HTTP Request → Method**: `POST`
   - **Path**: `/api/graphql`

4. **En la pestaña "Body Data"**, pegar este JSON:

```json
{
  "query": "mutation Login($email: String!, $password: String!) { login(email: $email, password: $password) { __typename ... on AuthSuccess { user { id username email fullName avatar role createdAt updatedAt } token refreshToken expiresAt } ... on AuthError { message code } } }",
  "variables": { "email": "${EMAIL}", "password": "${PASSWORD}" }
}
```

### 7. Extractor de Token (bajo Login Request)

1. **Clic derecho** en `1. GraphQL Login`
2. **Add** → **Post Processors** → **JSON Extractor**
3. **Configurar**:
   - **Name**: `Extract Token`
   - **Names of created variables**: `auth_token`
   - **JSON Path expressions**: `$.data.login.token`
   - **Default Values**: `NOT_FOUND`

### 8. Validación de Login (bajo Login Request)

1. **Clic derecho** en `1. GraphQL Login`
2. **Add** → **Assertions** → **Response Assertion**
3. **Configurar**:
   - **Name**: `Verify Login Success`
   - **Apply to**: `Main sample only`
   - **Response Field**: `Response Data`
   - **Pattern Matching Rules**: `Contains`
   - **Patterns to Test**: `AuthSuccess`

### 9. Segunda Petición: GraphQL Me Query

1. **Clic derecho** en `Thread Group`
2. **Add** → **Sampler** → **HTTP Request**
3. **Configurar**:

   - **Name**: `2. GraphQL Me Query`
   - **Protocol**: `${PROTOCOL}`
   - **Server Name**: `${SERVER}`
   - **Port Number**: `${PORT}`
   - **HTTP Request → Method**: `POST`
   - **Path**: `/api/graphql`

4. **En la pestaña "Body Data"**, pegar este JSON:

```json
{
  "query": "query Me { me { id username email fullName avatar role createdAt updatedAt } }"
}
```

### 10. Header de Autorización (bajo Me Query)

1. **Clic derecho** en `2. GraphQL Me Query`
2. **Add** → **Config Element** → **HTTP Header Manager**
3. **Agregar header**:

| Name          | Value                |
| ------------- | -------------------- |
| Authorization | Bearer ${auth_token} |

### 11. Validación de Me Query (bajo Me Query)

1. **Clic derecho** en `2. GraphQL Me Query`
2. **Add** → **Assertions** → **Response Assertion**
3. **Configurar**:
   - **Name**: `Verify Me Query Success`
   - **Response Field**: `Response Data`
   - **Pattern Matching Rules**: `Contains`
   - **Patterns to Test**: `estudiante@gmail.com`

### 12. Listeners para Ver Resultados

1. **Clic derecho** en `Thread Group`
2. **Add** → **Listener** → **View Results Tree**

3. **Clic derecho** en `Thread Group`
4. **Add** → **Listener** → **Summary Report**

## 🚀 Ejecutar el Test

1. **Guardar** el test plan: `File` → `Save As` → `CourseClash_Manual.jmx`
2. **Ejecutar**: Click en el botón **Start** (▶️)
3. **Ver resultados** en `View Results Tree`

## 📋 Estructura Final

```
CourseClash Login Test
└── Login Flow (Thread Group)
    ├── User Defined Variables
    ├── HTTP Cookie Manager
    ├── HTTP Header Manager
    ├── 1. GraphQL Login (HTTP Request)
    │   ├── Extract Token (JSON Extractor)
    │   └── Verify Login Success (Response Assertion)
    ├── 2. GraphQL Me Query (HTTP Request)
    │   ├── Authorization Header (HTTP Header Manager)
    │   └── Verify Me Query Success (Response Assertion)
    ├── View Results Tree
    └── Summary Report
```

## ✅ Resultados Esperados

**Primera petición (Login):**

```json
{
  "data": {
    "login": {
      "__typename": "AuthSuccess",
      "user": {
        "id": "3",
        "username": "estudiante",
        "email": "estudiante@gmail.com"
      },
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    }
  }
}
```

**Segunda petición (Me Query):**

```json
{
  "data": {
    "me": {
      "id": "3",
      "username": "estudiante",
      "email": "estudiante@gmail.com",
      "fullName": "Estudiante Ejemplo",
      "role": "STUDENT"
    }
  }
}
```

## 🔧 Troubleshooting

**Si las variables no se resuelven:**

- Verificar que las variables estén definidas en `User Defined Variables`
- Verificar que los nombres sean exactos: `SERVER`, `PORT`, etc.

**Si el token no se extrae:**

- Verificar que el JSON Path sea correcto: `$.data.login.token`
- Ver la respuesta en `View Results Tree` para debugging

**Si hay errores SSL:**

- Agregar este archivo de propiedades: `jmeter-https-config.properties`
- Usar `jmeter -p jmeter-https-config.properties`

¡Esta configuración manual debería funcionar sin problemas de XML! 🎉
