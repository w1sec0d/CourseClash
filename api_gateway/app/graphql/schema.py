import strawberry
from typing import List, Optional
from datetime import datetime
import httpx
from app.graphql.resolvers.auth import Query as AuthQuery, Mutation as AuthMutation

# Combine resolvers
@strawberry.type
class Query(AuthQuery):
    pass

@strawberry.type
class Mutation(AuthMutation):
    pass

# Create the schema
schema = strawberry.Schema(query=Query, mutation=Mutation)
