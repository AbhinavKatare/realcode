# For code analysis this code will make an issue basemodel  
from pydantic import BaseModel
from typing import Optional

class Issue(BaseModel):
    line: int
    issue: str
    suggestion: Optional[str]
