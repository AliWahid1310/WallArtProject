# PowerShell script to build and deploy to Shopify

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Gallery Wall Builder - Shopify Deploy" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Step 1: Install dependencies
Write-Host "`n[1/4] Installing dependencies..." -ForegroundColor Yellow
npm install

# Step 2: Install terser if not present
Write-Host "`n[2/4] Ensuring build tools are ready..." -ForegroundColor Yellow
npm install terser --save-dev

# Step 3: Build for Shopify
Write-Host "`n[3/4] Building React app for Shopify..." -ForegroundColor Yellow
npm run build:shopify

# Check if build was successful
if (Test-Path "extensions/gallery-extension/assets/gallery-app.js") {
    Write-Host "`n Build successful!" -ForegroundColor Green
    
    # Get file sizes
    $jsSize = (Get-Item "extensions/gallery-extension/assets/gallery-app.js").Length / 1KB
    Write-Host "   - gallery-app.js: $([math]::Round($jsSize, 2)) KB" -ForegroundColor Gray
    
    if (Test-Path "extensions/gallery-extension/assets/gallery-app.css") {
        $cssSize = (Get-Item "extensions/gallery-extension/assets/gallery-app.css").Length / 1KB
        Write-Host "   - gallery-app.css: $([math]::Round($cssSize, 2)) KB" -ForegroundColor Gray
    }
} else {
    Write-Host "`n Build failed! Check errors above." -ForegroundColor Red
    exit 1
}

# Step 4: Deploy to Shopify
Write-Host "`n[4/4] Ready to deploy to Shopify..." -ForegroundColor Yellow
Write-Host "`nRun the following command to deploy:" -ForegroundColor Cyan
Write-Host "   npx @shopify/cli app deploy" -ForegroundColor White

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  Build Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "  1. Update shopify.app.toml with your Client ID" -ForegroundColor White
Write-Host "  2. Run: npx @shopify/cli auth login" -ForegroundColor White
Write-Host "  3. Run: npx @shopify/cli app deploy" -ForegroundColor White
Write-Host "  4. Go to Shopify Admin -> Online Store -> Customize" -ForegroundColor White
Write-Host "  5. Add 'Gallery Wall Builder' app block to your page" -ForegroundColor White
