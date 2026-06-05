# Local compilation script using Docker to avoid installing LaTeX locally.
# Requirements: Docker Desktop must be running.

# Get paths
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = (Resolve-Path "$ScriptDir\..").Path

Write-Host "Compiling LaTeX CV using Docker..." -ForegroundColor Cyan

# Run LaTeX compilation inside a lightweight texlive container
docker run --rm -v "${ProjectRoot}:/workdir" -w /workdir/cv paperist/texlive-ja pdflatex cv.tex

if ($LASTEXITCODE -eq 0) {
    Write-Host "Compilation succeeded!" -ForegroundColor Green
    
    $SourcePdf = Join-Path $ScriptDir "cv.pdf"
    $DestFolder = Join-Path $ProjectRoot "assets\docs"
    $DestPdf = Join-Path $DestFolder "Bui_Duong_Tri.pdf"
    
    # Ensure destination directory exists
    if (-not (Test-Path $DestFolder)) {
        New-Item -ItemType Directory -Path $DestFolder -Force | Out-Null
    }
    
    # Copy PDF to the website's assets directory
    Copy-Item -Force -Path $SourcePdf -Destination $DestPdf
    Write-Host "Updated $DestPdf successfully." -ForegroundColor Green
    
    # Clean up auxiliary compilation files
    Write-Host "Cleaning up auxiliary files..." -ForegroundColor Gray
    $auxFiles = @("cv.aux", "cv.log", "cv.out", "cv.toc", "cv.synctex.gz")
    foreach ($file in $auxFiles) {
        $path = Join-Path $ScriptDir $file
        if (Test-Path $path) {
            Remove-Item -Path $path -Force
        }
    }
} else {
    Write-Error "Compilation failed. Please check the LaTeX syntax and try again."
}
