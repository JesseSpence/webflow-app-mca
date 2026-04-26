# run-api-smoke-tests.ps1
# MCA Phase 1 API smoke tests (7 endpoints)

param(
  [string]$BaseUrl = "http://localhost:3000",
  [string]$Token = ""
)

if ([string]::IsNullOrWhiteSpace($Token)) {
  Write-Host "ERROR: Missing token." -ForegroundColor Red
  Write-Host "Run with: .\run-api-smoke-tests.ps1 -Token 'YOUR_INTERNAL_API_BEARER_TOKEN'" -ForegroundColor Yellow
  exit 1
}

$Headers = @{
  "Authorization" = "Bearer $Token"
  "Content-Type"  = "application/json"
}

$Results = @()

function Add-Result {
  param(
    [string]$Name,
    [bool]$Success,
    [string]$Message
  )

  $Results += [PSCustomObject]@{
    Test    = $Name
    Status  = if ($Success) { "PASS" } else { "FAIL" }
    Message = $Message
  }

  if ($Success) {
    Write-Host "[PASS] $Name - $Message" -ForegroundColor Green
  } else {
    Write-Host "[FAIL] $Name - $Message" -ForegroundColor Red
  }
}

function Invoke-Test {
  param(
    [string]$Name,
    [ValidateSet("GET","POST")] [string]$Method,
    [string]$Path,
    [object]$Body = $null
  )

  try {
    $uri = "$BaseUrl$Path"

    if ($null -ne $Body) {
      $json = $Body | ConvertTo-Json -Depth 10
      $response = Invoke-RestMethod -Method $Method -Uri $uri -Headers $Headers -Body $json -ErrorAction Stop
    } else {
      $response = Invoke-RestMethod -Method $Method -Uri $uri -Headers $Headers -ErrorAction Stop
    }

    Add-Result -Name $Name -Success $true -Message "HTTP OK"
    return $response
  }
  catch {
    $msg = $_.Exception.Message
    if ($_.ErrorDetails -and $_.ErrorDetails.Message) {
      $msg = "$msg | Body: $($_.ErrorDetails.Message)"
    }
    Add-Result -Name $Name -Success $false -Message $msg
    return $null
  }
}

Write-Host "Starting MCA API smoke tests against $BaseUrl" -ForegroundColor Cyan
Write-Host "------------------------------------------------------------"

# 1) POST /api/pages/upsert
$upsertPageBody = @{
  slug = "same-day"
  full_path = "/types/same-day"
  page_template = "type"
  page_group = "types"
  title = "Same Day Merchant Cash Advance | MCA Loan UK"
  meta_title = "Same Day Merchant Cash Advance | MCA Loan UK"
  meta_description = "Learn how same day merchant cash advance funding works."
  h1 = "Same Day Merchant Cash Advance"
  intro_html = "<p>Updated via smoke test.</p>"
  body_html = "<section><p>Body content from smoke test.</p></section>"
  canonical_url = "https://mcaloan.co.uk/types/same-day"
  status = "published"
  indexable = $true
  publish_mode = "page"
}
Invoke-Test -Name "1) POST /api/pages/upsert" -Method POST -Path "/api/pages/upsert" -Body $upsertPageBody | Out-Null

# 2) POST /api/pages/section
$upsertSectionBody = @{
  target_page_slug = "restaurant"
  section_key = "cashflow_gaps"
  heading = "Common Restaurant Cashflow Gaps"
  content_html = "<p>Section test update from smoke script.</p>"
  keyword_theme = "restaurant cash flow"
  sort_order = 2
}
Invoke-Test -Name "2) POST /api/pages/section" -Method POST -Path "/api/pages/section" -Body $upsertSectionBody | Out-Null

# 3) POST /api/pages/faq
$faqBody = @{
  target_page_slug = "restaurant"
  question = "Can restaurants get an MCA with bad credit?"
  answer_html = "<p>Potentially yes, depending on sales profile and lender criteria.</p>"
  schema_enabled = $true
  keyword = "restaurant MCA bad credit"
}
Invoke-Test -Name "3) POST /api/pages/faq" -Method POST -Path "/api/pages/faq" -Body $faqBody | Out-Null

# 4) POST /api/pages/publish
$publishBody = @{
  slug = "restaurant"
}
Invoke-Test -Name "4) POST /api/pages/publish" -Method POST -Path "/api/pages/publish" -Body $publishBody | Out-Null

# 5) POST /api/revalidate
$revalidateBody = @{
  full_path = "/sectors/restaurant"
}
Invoke-Test -Name "5) POST /api/revalidate" -Method POST -Path "/api/revalidate" -Body $revalidateBody | Out-Null

# 6) GET /api/pages/[slug]
Invoke-Test -Name "6) GET /api/pages/restaurant" -Method GET -Path "/api/pages/restaurant" | Out-Null

# 7) POST /api/keywords/upsert
$keywordBody = @{
  keyword = "merchant cash advance for restaurants"
  mapped_page_slug = "restaurant"
  live_decision = "live"
  usage_type = "section_only"
  notes = "Merged into parent sector page"
  source_cluster = "sector_restaurant"
}
Invoke-Test -Name "7) POST /api/keywords/upsert" -Method POST -Path "/api/keywords/upsert" -Body $keywordBody | Out-Null

Write-Host "------------------------------------------------------------"
Write-Host "Summary:" -ForegroundColor Cyan
$Results | Format-Table -AutoSize

$failCount = ($Results | Where-Object { $_.Status -eq "FAIL" }).Count
if ($failCount -gt 0) {
  Write-Host "Completed with $failCount failure(s)." -ForegroundColor Red
  exit 1
} else {
  Write-Host "All tests passed." -ForegroundColor Green
  exit 0
}
