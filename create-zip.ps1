# PCBM Career Institute - Create ZIP for GitHub
$source = "C:\Users\Vansh\pcbm-career-institute"
$destination = "C:\Users\Vansh\Desktop\pcbm-career-institute.zip"

# Remove old zip if exists
if (Test-Path $destination) {
    Remove-Item $destination
    Write-Host "Removed old ZIP file." -ForegroundColor Yellow
}

# Create ZIP (excluding .ps1 file and .claude folder)
$exclude = @("*.ps1", ".claude")
$files = Get-ChildItem -Path $source -Recurse | Where-Object {
    $_.FullName -notlike "*\.claude*" -and
    $_.Name -notlike "*.ps1"
}

Compress-Archive -Path "$source\index.html", "$source\gallery.html", "$source\faculty.html", "$source\css", "$source\js" -DestinationPath $destination -Force

Write-Host ""
Write-Host "✅ ZIP created successfully!" -ForegroundColor Green
Write-Host "📁 Location: $destination" -ForegroundColor Cyan
Write-Host ""
Write-Host "Now go to your GitHub repo and upload the ZIP!" -ForegroundColor White
