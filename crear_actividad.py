import requests

API_URL = "http://localhost:8000/graphql"  # Cambia el puerto si tu API Gateway está en otro
#API_TOKEN = "TU_TOKEN_DE_AUTENTICACION"    # Si usas autenticación Bearer

headers = {
    "Content-Type": "application/json",
    # "Authorization": f"Bearer {API_TOKEN}",  # Descomenta si usas auth
}

mutation = """
mutation CreateActivity(
  $courseId: Int!
  $title: String!
  $activityType: TypeActivity!
  $description: String
  $dueDate: DateTime
  $fileUrl: String
) {
  createActivity(
    courseId: $courseId
    title: $title
    activityType: $activityType
    description: $description
    dueDate: $dueDate
    fileUrl: $fileUrl
  ) {
    __typename
    ... on ActivitySuccess {
      activity {
        id
        title
        activityType
        dueDate
      }
    }
    ... on ActivityError {
      message
      code
    }
  }
}
"""

variables = {
    "courseId": 1,
    "title": "Tarea de ejemplo desde script",
    "activityType": "TASK",  # O "QUIZ"
    "description": "Esta tarea fue creada automáticamente.",
    "dueDate": "2024-07-01T23:59:00"
}

response = requests.post(API_URL, json={"query": mutation, "variables": variables}, headers=headers)
print(response.json())