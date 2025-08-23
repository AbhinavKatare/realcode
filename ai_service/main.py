import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.ai_processor import analyze_code

app = FastAPI()

class Issue(BaseModel):
    line: int
    issue: str
    suggestion: Optional[str] = None

class CodeReviewRequest(BaseModel):
    code: str

class CodeReviewResponse(BaseModel):
    issues: List[Issue]

@app.post("/code-review", response_model=CodeReviewResponse)
async def code_review(request: CodeReviewRequest):
    try:
        issues = await analyze_code(request.code)
        return CodeReviewResponse(issues=issues)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
