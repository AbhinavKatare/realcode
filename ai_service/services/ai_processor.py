# With import it can help in processor for working 


from typing import List
from models.code_analysis import Issue

async def analyze_code(code: str) -> List[Issue]:
    # Placeholder for AI model inference logic
    # Replace this with your real AI calls (transformers, LLMs, static analyzers, custom ML models)

    issues = []

    # Example dummy/static detection logic for demo
    lines = code.split('\n')
    for i, line in enumerate(lines, 1):
        if 'eval(' in line:
            issues.append(Issue(line=i, issue="Security risk: use of eval()", suggestion="Avoid eval usage"))

        if len(line) > 120:
            issues.append(Issue(line=i, issue="Line too long", suggestion="Wrap line to max 120 characters"))

    return issues
