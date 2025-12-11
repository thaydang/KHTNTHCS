# Code Review Report - KHTNTHCS Repository

## Executive Summary
This review identifies potential issues, bugs, and performance concerns across the Python and TypeScript/React codebase. The issues range from critical security vulnerabilities to potential runtime errors and performance inefficiencies.

---

## 🔴 CRITICAL ISSUES

### 1. **Missing Error Handling in `gen_exam.py` - Environment Variables**
**File:** [gen_exam.py](gen_exam.py#L42)  
**Severity:** HIGH  
**Issue:** 
- Line 42: `api_key = os.environ.get("GEMINI_API_KEY")` followed by `if not api_key: raise ValueError(...)`
- The code raises an error but doesn't handle potential failures from `pypandoc.convert_text()` in try-except block
- `convert_to_pdf()` can fail silently if `pypandoc` or other dependencies are missing

**Current Code:**
```python
convert_to_pdf(md_content, f'output/De_Thi_{topic}.pdf')

try:
    print("-> Đang xuất DOCX...")
    pypandoc.convert_text(md_content, 'docx', format='md', outputfile=f'output/De_Thi_{topic}.docx')
except Exception as e:
    print(f"Lỗi xuất Word: {e}")
```

**Problem:** `convert_to_pdf()` has no error handling; if it fails, the program crashes.

**Proposed Fix:**
```python
try:
    print("-> Đang xuất PDF...")
    convert_to_pdf(md_content, f'output/De_Thi_{topic}.pdf')
except Exception as e:
    print(f"❌ Lỗi xuất PDF: {e}")
    sys.exit(1)

try:
    print("-> Đang xuất DOCX...")
    pypandoc.convert_text(md_content, 'docx', format='md', outputfile=f'output/De_Thi_{topic}.docx')
except Exception as e:
    print(f"❌ Lỗi xuất Word: {e}")
```

---

### 2. **Unsafe Font File Download in `gen_exam.py`**
**File:** [gen_exam.py](gen_exam.py#L11-L18)  
**Severity:** HIGH  
**Issue:**
- Function `download_font()` downloads a file from the internet without verification
- No timeout handling - could hang indefinitely
- No checksum validation - could be compromised
- Network error not handled properly

**Current Code:**
```python
def download_font():
    font_url = "https://github.com/google/fonts/raw/main/apache/robotoslab/RobotoSlab-Regular.ttf"
    font_path = "VietnameseFont.ttf"
    if not os.path.exists(font_path):
        print("Đang tải font tiếng Việt...")
        r = requests.get(font_url)  # ⚠️ No timeout, no error handling
        with open(font_path, 'wb') as f:
            f.write(r.content)
    return font_path
```

**Proposed Fix:**
```python
import hashlib
from urllib.error import URLError

def download_font(timeout=30):
    """Download Vietnamese font with error handling and timeout."""
    font_url = "https://github.com/google/fonts/raw/main/apache/robotoslab/RobotoSlab-Regular.ttf"
    font_path = "VietnameseFont.ttf"
    
    if os.path.exists(font_path):
        return font_path
    
    try:
        print("Đang tải font tiếng Việt...")
        response = requests.get(font_url, timeout=timeout)
        response.raise_for_status()  # Raise for HTTP errors
        
        with open(font_path, 'wb') as f:
            f.write(response.content)
        
        print(f"✓ Font tải thành công: {len(response.content)} bytes")
        return font_path
        
    except requests.exceptions.Timeout:
        raise RuntimeError(f"Font download timed out after {timeout} seconds")
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Failed to download font: {e}")
```

---

### 3. **Memory Leak in `pptxService.ts` - Global Cache**
**File:** [Tai-lieu-chung/Mau-bieu/KHTN-v2/services/pptxService.ts](Tai-lieu-chung/Mau-bieu/KHTN-v2/services/pptxService.ts#L3)  
**Severity:** MEDIUM-HIGH  
**Issue:**
```typescript
const dimensionCache = new Map<string, { width: number; height: number }>();
```
- This global cache grows unbounded - never cleared
- For multiple presentations with many images, memory usage increases indefinitely
- No cache invalidation or size limit

**Proposed Fix:**
```typescript
class ImageDimensionCache {
  private cache = new Map<string, { width: number; height: number }>();
  private readonly MAX_SIZE = 100; // Limit cache size
  
  get(src: string): { width: number; height: number } | undefined {
    return this.cache.get(src);
  }
  
  set(src: string, dims: { width: number; height: number }): void {
    if (this.cache.size >= this.MAX_SIZE) {
      // Remove oldest entry (FIFO)
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(src, dims);
  }
  
  has(src: string): boolean {
    return this.cache.has(src);
  }
  
  clear(): void {
    this.cache.clear();
  }
}

const imageCache = new ImageDimensionCache();
```

---

### 4. **Unhandled Promise Rejection in `App.tsx`**
**File:** [Tai-lieu-chung/Mau-bieu/KHTN-v2/App.tsx](Tai-lieu-chung/Mau-bieu/KHTN-v2/App.tsx#L225)  
**Severity:** HIGH  
**Issue:**
```typescript
const handleDownloadDocx = () => {
    // ...
    setTimeout(() => {
        try {
            // Code that can throw
        } catch (e) {
            setError("Failed to generate PPTX: " + e.message);
        }
    }, 0);
}
```
- Promise from `file.arrayBuffer()` is not properly awaited in some code paths
- FileReader `onloadend` callback doesn't handle all error cases

**Problem Code (line ~240):**
```typescript
const reader = new FileReader();
reader.onloadend = () => {
    const base64String = reader.result as string; // ⚠️ No null check
    const base64Data = base64String.split(',')[1]; // Could fail if format unexpected
    setPdfData({...});
};
reader.readAsDataURL(file);
// Missing: reader.onerror handler
```

**Proposed Fix:**
```typescript
const reader = new FileReader();
reader.onload = () => {
    try {
        const base64String = reader.result;
        if (typeof base64String !== 'string') {
            throw new Error('FileReader did not return a string');
        }
        const base64Data = base64String.split(',')[1];
        if (!base64Data) {
            throw new Error('Invalid data URL format');
        }
        setPdfData({ data: base64Data, name: file.name });
    } catch (e: any) {
        setError(`Failed to process PDF: ${e.message}`);
    }
};
reader.onerror = (e) => {
    setError(`File read error: ${reader.error?.message || 'Unknown error'}`);
};
reader.onabort = () => {
    setError('File read was aborted');
};
reader.readAsDataURL(file);
```

---

## 🟠 SIGNIFICANT ISSUES

### 5. **Performance Issue: Inefficient History State Management in `App.tsx`**
**File:** [Tai-lieu-chung/Mau-bieu/KHTN-v2/App.tsx](Tai-lieu-chung/Mau-bieu/KHTN-v2/App.tsx#L80-L110)  
**Severity:** MEDIUM  
**Issue:**
```typescript
const { stack, index } = prev;
const newStack = stack.slice(0, index + 1);
newStack.push(val);

if (newStack.length > 50) {
    newStack.shift(); // ⚠️ O(n) operation when array hits limit
}
```

**Problem:** 
- `slice()` creates a new array copy on every keystroke
- `shift()` is O(n) operation
- For large strings (educational documents), this causes unnecessary performance hits

**Proposed Fix:**
```typescript
// Use a circular buffer or LinkedList for better performance
class HistoryManager {
  private stack: string[] = [];
  private index: number = 0;
  private readonly MAX_SIZE = 50;
  
  push(text: string): void {
    // Trim future if we undo then type
    this.stack = this.stack.slice(0, this.index + 1);
    
    // Append new entry
    this.stack.push(text);
    
    // Maintain size limit using a proper circular approach
    if (this.stack.length > this.MAX_SIZE) {
      this.stack = this.stack.slice(-this.MAX_SIZE);
      this.index = this.stack.length - 1;
    } else {
      this.index = this.stack.length - 1;
    }
  }
  
  undo(): string | null {
    if (this.index > 0) {
      this.index--;
      return this.stack[this.index];
    }
    return null;
  }
  
  redo(): string | null {
    if (this.index < this.stack.length - 1) {
      this.index++;
      return this.stack[this.index];
    }
    return null;
  }
}
```

---

### 6. **Regex Vulnerability in `pptxService.ts`**
**File:** [Tai-lieu-chung/Mau-bieu/KHTN-v2/services/pptxService.ts](Tai-lieu-chung/Mau-bieu/KHTN-v2/services/pptxService.ts#L35)  
**Severity:** MEDIUM  
**Issue:**
```typescript
const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
```
- This regex uses `.` which doesn't match newlines, but can be bypassed
- No validation of extracted URLs before using them

**Proposed Fix:**
```typescript
// More robust regex with better URL validation
const imageRegex = /!\[([^\]]*)\]\(([^\s)]+)\)/g;

const matches = [...markdown.matchAll(imageRegex)];
const uniqueUrls = Array.from(new Set(
  matches
    .map(m => m[2])
    .filter(url => {
      try {
        // Validate URL format
        new URL(url, window.location.href);
        return true;
      } catch {
        // Allow data URLs and relative paths
        return url.startsWith('data:') || url.startsWith('/') || !url.includes('://');
      }
    })
    .filter(url => url.length > 0)
));
```

---

### 7. **Missing Input Validation in `exam_to_docx.py`**
**File:** [scripts/exam_to_docx.py](scripts/exam_to_docx.py#L113-L125)  
**Severity:** MEDIUM  
**Issue:**
```python
def batch_convert(directory, output_dir=None):
    directory = Path(directory)
    md_files = list(directory.rglob("*.md"))
    # No check if directory exists or is readable
```

**Problem:** 
- If directory doesn't exist, code proceeds silently
- No permission checks
- Exceptions in the loop don't log the problematic file properly

**Proposed Fix:**
```python
def batch_convert(directory, output_dir=None):
    """Batch convert markdown files to DOCX format."""
    directory = Path(directory)
    
    # Validate directory
    if not directory.exists():
        raise FileNotFoundError(f"Directory not found: {directory}")
    if not directory.is_dir():
        raise NotADirectoryError(f"Path is not a directory: {directory}")
    
    md_files = list(directory.rglob("*.md"))
    if not md_files:
        print("⚠️ No markdown files found in:", directory)
        return
    
    print(f"Found {len(md_files)} markdown files")
    
    outdir = Path(output_dir) if output_dir else directory / "output"
    outdir.mkdir(parents=True, exist_ok=True)
    
    success_count = 0
    error_files = []
    
    for md in md_files:
        try:
            print(f"Processing: {md}")
            gen = ExamDocumentGenerator(str(md), outdir)
            gen.parse_and_generate()
            gen.save(md.stem + ".docx")
            success_count += 1
        except Exception as e:
            error_files.append((str(md), str(e)))
            print(f"❌ Error processing {md.name}: {e}")
    
    print(f"\n✓ Successfully converted: {success_count}/{len(md_files)}")
    if error_files:
        print(f"❌ Failed: {len(error_files)} files")
        for file, error in error_files:
            print(f"  - {file}: {error}")
```

---

### 8. **Type Coercion Issue in `exam_to_docx.py`**
**File:** [scripts/exam_to_docx.py](scripts/exam_to_docx.py#L100)  
**Severity:** MEDIUM  
**Issue:**
```python
def add_paragraphs_from_text(self, text):
    # ...
    while i < len(lines):
        line = lines[i].rstrip()
        # ...
        i += 1
    if buffer:
        self.doc.add_paragraph('\n'.join(buffer))
```

**Problem:** 
- Manual index management is error-prone
- If line processing throws exception, `i` may not increment properly
- Using `'\n'.join()` on potentially mixed content could cause formatting issues

**Proposed Fix:**
```python
def add_paragraphs_from_text(self, text):
    """Convert text to document paragraphs, preserving structure."""
    lines = text.splitlines()
    buffer = []
    
    for line in lines:  # Use iterator instead of manual index
        line = line.rstrip()
        
        if not line:
            # Flush buffer when blank line found
            if buffer:
                self.doc.add_paragraph(' '.join(buffer))
                buffer = []
            continue
        
        # Handle headings
        if line.startswith('# '):
            if buffer:
                self.doc.add_paragraph(' '.join(buffer))
                buffer = []
            self.add_heading(line[2:].strip(), level=1)
        elif line.startswith('## '):
            if buffer:
                self.doc.add_paragraph(' '.join(buffer))
                buffer = []
            self.add_heading(line[3:].strip(), level=2)
        elif line.startswith('### '):
            if buffer:
                self.doc.add_paragraph(' '.join(buffer))
                buffer = []
            self.add_heading(line[4:].strip(), level=3)
        else:
            buffer.append(line)
    
    # Flush remaining buffer
    if buffer:
        self.doc.add_paragraph(' '.join(buffer))
```

---

### 9. **Potential XSS Vulnerability in `App.tsx` - HTML Injection**
**File:** [Tai-lieu-chung/Mau-bieu/KHTN-v2/App.tsx](Tai-lieu-chung/Mau-bieu/KHTN-v2/App.tsx#L370)  
**Severity:** MEDIUM-HIGH  
**Issue:**
```typescript
const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        ...
    </head>
    <body>${content}</body>  // ⚠️ Direct interpolation of element.innerHTML
    </html>
`;
```

**Problem:** 
- `element.innerHTML` is directly inserted into HTML string
- If cleaned content contains HTML/JavaScript, it could execute in Word context
- No sanitization of user content

**Proposed Fix:**
```typescript
const handleDownloadDocx = () => {
    const element = document.getElementById('preview-content');
    
    if (!element?.innerText.trim()) {
        setError("Preview content is empty. Please process a document first.");
        return;
    }
    
    setExportMessage("Generating Word document...");
    
    setTimeout(() => {
        try {
            // Use textContent instead of innerHTML, then sanitize if needed
            const textContent = element.innerText;
            
            // For markdown content, use the cleaned markdown instead
            const safeContent = cleanedText || textContent;
            
            // Escape HTML special characters
            const escapeHtml = (text: string) => {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            };
            
            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        @page { size: A4; margin: 2.54cm; }
        body { font-family: 'Calibri', sans-serif; line-height: 1.5; }
    </style>
</head>
<body>
    ${escapeHtml(safeContent)}
</body>
</html>`;
            
            // Rest of export logic...
        } catch (e: any) {
            setError("Failed to generate DOCX: " + e.message);
        } finally {
            setExportMessage(null);
        }
    }, 100);
};
```

---

## 🟡 MINOR ISSUES & IMPROVEMENTS

### 10. **Missing Null Checks in `geminiService.ts`**
**File:** [Tai-lieu-chung/Mau-bieu/KHTN-v2/geminiService.ts](Tai-lieu-chung/Mau-bieu/KHTN-v2/geminiService.ts#L180)  
**Severity:** LOW-MEDIUM  
**Issue:**
```typescript
const response = await ai.models.generateContent({
    // ...
});

const parts = response.candidates?.[0]?.content?.parts;
if (parts) {
    for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
            return part.inlineData.data;
        }
    }
}

throw new Error("No image generated by Gemini.");
```

**Problem:** 
- Assumes specific structure; API changes could break this
- No validation of returned data
- Error message doesn't provide helpful debugging info

**Proposed Fix:**
```typescript
export const editImageWithGemini = async (
  imageSrc: string,
  prompt: string
): Promise<string> => {
  const ai = getClient();
  const modelId = 'gemini-2.5-flash-image';

  let data = imageSrc;
  let mimeType = 'image/jpeg';

  // ... (data extraction code)

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          { inlineData: { data, mimeType } },
          { text: prompt }
        ]
      }
    });

    // More defensive null checking
    if (!response?.candidates?.[0]?.content?.parts) {
      throw new Error("Invalid API response: missing candidates or content");
    }

    const parts = response.candidates[0].content.parts;
    for (const part of parts) {
      if (part?.inlineData?.data) {
        return part.inlineData.data;
      }
    }
    
    throw new Error("No image data returned by Gemini. Response: " + JSON.stringify(parts));
  } catch (error: any) {
    console.error("Gemini Image Edit Error:", error);
    throw new Error(`Image editing failed: ${error.message || 'Unknown error'}`);
  }
};
```

---

### 11. **Unused Import & Dead Code in `App.tsx`**
**File:** [Tai-lieu-chung/Mau-bieu/KHTN-v2/App.tsx](Tai-lieu-chung/Mau-bieu/KHTN-v2/App.tsx#L1-L10)  
**Severity:** LOW  
**Issue:**
- Some imported components may not be used
- Dead code paths that never execute

**Recommendation:** Run `mcp_pylance_mcp_s_pylanceInvokeRefactoring` tool to clean unused imports

---

### 12. **Flask Security Issues in `hello-world-1`**
**File:** [Tai-lieu-chung/Mau-bieu/hello-world-1/src/app.py](Tai-lieu-chung/Mau-bieu/hello-world-1/src/app.py)  
**Severity:** MEDIUM  
**Issues:**
1. Debug mode could be accidentally enabled in production
2. No CORS headers - could cause issues in deployed environment
3. No input validation or output encoding

**Proposed Fix:**
```python
import os
from signal import signal, SIGINT
from flask import Flask, render_template

def handler(signal_received, frame):
    """Handle graceful shutdown on SIGINT (Ctrl+C)."""
    print("\nShutting down gracefully...")
    exit(0)

# Initialize Flask app with safer defaults
app = Flask(__name__)

# Security: Ensure debug is explicitly controlled
app.config['DEBUG'] = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
app.config['ENV'] = os.environ.get('FLASK_ENV', 'production')
app.config['JSON_SORT_KEYS'] = False

# CORS handling for deployment
from flask_cors import CORS
CORS(app, resources={r"/*": {"origins": os.environ.get('ALLOWED_ORIGINS', 'localhost:3000').split(',')}})

@app.route('/')
def hello():
    """Return a simple HTML page with a friendly message."""
    message = "It's running!"
    return render_template('index.html', message=message)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for deployment."""
    return {'status': 'healthy'}, 200

if __name__ == '__main__':
    signal(SIGINT, handler)
    server_port = os.environ.get('PORT', '8080')
    
    try:
        server_port = int(server_port)
    except ValueError:
        print(f"Invalid PORT value: {server_port}, using 8080")
        server_port = 8080
    
    app.run(
        debug=app.config['DEBUG'],
        port=server_port,
        host='0.0.0.0',
        use_reloader=False  # Disable reloader in containerized environment
    )
```

---

### 13. **Missing Requirements in `requirements.txt`**
**File:** [requirements.txt](requirements.txt)  
**Severity:** MEDIUM  
**Issue:**
- `requirements.txt` is missing pinned versions
- Should specify versions to ensure reproducibility
- Missing some potentially needed dependencies

**Proposed Fix:**
```
google-generativeai>=0.3.0
markdown>=3.4.0
xhtml2pdf>=0.2.15
pypandoc>=1.11
requests>=2.31.0
Flask>=3.0.0
flask-cors>=4.0.0
python-docx>=0.8.11
```

Also add a `requirements-dev.txt` for development:
```
pytest>=7.4.0
black>=23.0.0
pylint>=3.0.0
mypy>=1.5.0
```

---

### 14. **Inefficient Image Dimension Fetching in `pptxService.ts`**
**File:** [Tai-lieu-chung/Mau-bieu/KHTN-v2/services/pptxService.ts](Tai-lieu-chung/Mau-bieu/KHTN-v2/services/pptxService.ts#L36-L40)  
**Severity:** LOW-MEDIUM  
**Issue:**
```typescript
const uniqueUrls = Array.from(new Set(
  matches.map(m => m[2]).filter(url => !!url && url.length > 10)
));
```

**Problem:**
- Filter `url.length > 10` is arbitrary and could exclude valid short URLs
- Data URLs can be much longer, filtering by length is unreliable

**Proposed Fix:**
```typescript
const uniqueUrls = Array.from(new Set(
  matches
    .map(m => m[2])
    .filter(url => {
      if (!url) return false;
      
      // Accept data URLs and file paths
      if (url.startsWith('data:') || url.startsWith('/')) {
        return true;
      }
      
      // Validate actual URLs
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    })
));
```

---

## 📋 SUMMARY TABLE

| # | Issue | Severity | Component | Fix Complexity |
|---|-------|----------|-----------|-----------------|
| 1 | Missing error handling in gen_exam.py | HIGH | Python | Low |
| 2 | Unsafe font download | HIGH | Python | Medium |
| 3 | Memory leak in image cache | MEDIUM-HIGH | TypeScript | Medium |
| 4 | Unhandled FileReader errors | HIGH | TypeScript/React | Medium |
| 5 | Inefficient history management | MEDIUM | TypeScript/React | Medium |
| 6 | Regex validation issues | MEDIUM | TypeScript | Low |
| 7 | Missing input validation | MEDIUM | Python | Low |
| 8 | Error-prone text processing | MEDIUM | Python | Medium |
| 9 | XSS vulnerability in DOCX generation | MEDIUM-HIGH | TypeScript | Low |
| 10 | Missing null checks | LOW-MEDIUM | TypeScript | Low |
| 11 | Unused imports | LOW | TypeScript | Low |
| 12 | Flask security issues | MEDIUM | Python | Medium |
| 13 | Missing version pinning | MEDIUM | Python | Low |
| 14 | Inefficient URL filtering | LOW-MEDIUM | TypeScript | Low |

---

## 🎯 Recommended Priority Order

1. **Immediate** (Fix before next release):
   - Issue #2: Unsafe font download
   - Issue #4: FileReader error handling
   - Issue #9: XSS vulnerability

2. **High Priority** (Fix within 1-2 weeks):
   - Issue #1: Error handling in gen_exam.py
   - Issue #3: Memory leak in cache
   - Issue #12: Flask security

3. **Medium Priority** (Plan for next sprint):
   - Issues #5, #6, #7, #8, #10
   - Add comprehensive testing

4. **Low Priority** (Refactor):
   - Issues #11, #13, #14
   - Code cleanup and optimization

---

## 📝 Testing Recommendations

1. **Unit Tests**: Add tests for error handling paths
2. **Integration Tests**: Test file upload and conversion workflows
3. **Security Tests**: Test XSS prevention, input validation
4. **Performance Tests**: Profile memory usage, history operations
5. **End-to-End Tests**: Test complete document generation workflows

