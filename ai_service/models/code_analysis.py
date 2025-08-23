from pydantic import BaseModel
from typing import Optional

class Issue(BaseModel):
    line: int
    issue: str
    suggestion: Optional[str]
