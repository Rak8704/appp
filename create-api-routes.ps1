
$routes = @(
    "news",
    "news/[slug]",
    "news/breaking",
    "news/featured",
    "news/popular",
    "news/trending",
    "search",
    "categories",
    "categories/[slug]",
    "tags",
    "tags/[slug]",
    "authors",
    "authors/[id]",
    "gallery",
    "gallery/[slug]",
    "videos",
    "videos/[slug]",
    "epaper",
    "epaper/[slug]",
    "ads",
    "site-settings",
    "contact",
    "auth/register",
    "auth/login",
    "auth/logout",
    "auth/forgot-password",
    "auth/reset-password",
    "profile",
    "saved-news",
    "saved-news/[articleId]",
    "reading-history",
    "notifications",
    "notifications/[id]",
    "comments",
    "comments/[id]",
    "newsletter",
    "newsletter/unsubscribe",
    "career",
    "career/[slug]",
    "career/applications",
    "submit-news",
    "admin/dashboard",
    "admin/users",
    "admin/users/[id]",
    "admin/users/[id]/status",
    "admin/articles",
    "admin/articles/[id]",
    "admin/articles/[id]/status",
    "admin/categories",
    "admin/categories/[id]",
    "admin/tags",
    "admin/comments",
    "admin/comments/[id]",
    "admin/media",
    "admin/media/[id]",
    "admin/ads",
    "admin/ads/[id]",
    "admin/settings",
    "admin/epaper",
    "admin/epaper/[id]",
    "admin/gallery",
    "admin/gallery/[id]",
    "admin/videos",
    "admin/videos/[id]",
    "admin/careers",
    "admin/careers/[id]",
    "admin/applications",
    "admin/submissions",
    "admin/audit-logs"
)

$root = Join-Path (Get-Location).Path "src\app\api"
$created = 0
$preserved = 0

foreach ($route in $routes) {

    $folder = Join-Path $root $route
    $file = Join-Path $folder "route.ts"

    if (-not (Test-Path -LiteralPath $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
    }

    if (-not (Test-Path -LiteralPath $file)) {

        $code = @'
// TODO: Implement API logic.
export async function GET() {
  return Response.json(
    {
      success: false,
      message: "API implementation pending"
    },
    { status: 501 }
  );
}
'@

        [System.IO.File]::WriteAllText(
            $file,
            $code,
            (New-Object System.Text.UTF8Encoding($false))
        )

        $created++
        Write-Host "CREATED: $route/route.ts" -ForegroundColor Green
    }
    else {
        $preserved++
        Write-Host "EXISTS: $route/route.ts" -ForegroundColor Yellow
    }
}

$actual = @(
    Get-ChildItem -LiteralPath $root -Recurse -Filter "route.ts" -File
).Count

Write-Host ""
Write-Host "========== API FILE REPORT ==========" -ForegroundColor Cyan
Write-Host "Planned routes: $($routes.Count)"
Write-Host "New files: $created"
Write-Host "Existing files preserved: $preserved"
Write-Host "Total route.ts files in API folder: $actual"
