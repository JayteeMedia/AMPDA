$ErrorActionPreference = "Stop"

$Root = (Get-Location).Path

function Write-Section {
    param([string]$Title)

    Write-Host ""
    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host $Title -ForegroundColor Cyan
    Write-Host "=========================================" -ForegroundColor Cyan
}

function Assert-Path {
    param(
        [string]$Path,
        [string]$Description
    )

    if (-not (Test-Path $Path)) {
        throw "MISSING: $Description -> $Path"
    }

    Write-Host "PASS: $Description" -ForegroundColor Green
}

function Assert-Contains {
    param(
        [string]$File,
        [string]$Pattern,
        [string]$Description
    )

    $content = Get-Content $File -Raw

    if ($content -notmatch [regex]::Escape($Pattern)) {
        throw "FAIL: $Description"
    }

    Write-Host "PASS: $Description" -ForegroundColor Green
}

function Assert-NoMatch {
    param(
        [string]$Path,
        [string]$Pattern,
        [string]$Description
    )

    $matches = Get-ChildItem $Path -Recurse -File |
        Select-String -Pattern $Pattern

    if ($matches) {
        Write-Host ""
        $matches |
            Format-Table Path,LineNumber,Line -AutoSize

        throw "FAIL: $Description"
    }

    Write-Host "PASS: $Description" -ForegroundColor Green
}

function Run-Pnpm {
    param(
        [string[]]$Arguments,
        [string]$Description
    )

    Write-Host ""
    Write-Host "RUN: pnpm $($Arguments -join ' ')" -ForegroundColor Yellow

    & pnpm @Arguments

    if ($LASTEXITCODE -ne 0) {
        throw "FAILED: $Description"
    }

    Write-Host "PASS: $Description" -ForegroundColor Green
}

# ============================================================
# START
# ============================================================

Write-Section "AMPDA FULL WORKSPACE VALIDATION"

Write-Host "Root: $Root" -ForegroundColor DarkGray
Write-Host "PowerShell: $($PSVersionTable.PSVersion)" -ForegroundColor DarkGray

# ============================================================
# 1. ROOT STRUCTURE
# ============================================================

Write-Section "1. ROOT STRUCTURE"

$requiredRootPaths = @(
    ".\package.json",
    ".\pnpm-workspace.yaml",
    ".\tsconfig.base.json",
    ".\packages",
    ".\packages\core",
    ".\packages\openai-provider",
    ".\packages\planner",
    ".\packages\agent-runtime"
)

foreach ($path in $requiredRootPaths) {
    Assert-Path $path $path
}

# ============================================================
# 2. PACKAGE STRUCTURE
# ============================================================

Write-Section "2. PACKAGE STRUCTURE"

$packages = @(
    "core",
    "openai-provider",
    "planner",
    "agent-runtime"
)

foreach ($package in $packages) {

    $packageJson = ".\packages\$package\package.json"
    $src = ".\packages\$package\src"
    $dist = ".\packages\$package\dist"

    Assert-Path $packageJson "$package package.json"
    Assert-Path $src "$package src"
    Assert-Path $dist "$package dist"
}

# ============================================================
# 3. PACKAGE NAMES
# ============================================================

Write-Section "3. PACKAGE IDENTITIES"

$expectedNames = @{
    "core"           = "@ampda/core"
    "openai-provider" = "@ampda/openai-provider"
    "planner"        = "@ampda/planner"
    "agent-runtime"  = "@ampda/agent-runtime"
}

foreach ($package in $expectedNames.Keys) {

    $file = ".\packages\$package\package.json"

    $json = Get-Content $file -Raw | ConvertFrom-Json

    if ($json.name -ne $expectedNames[$package]) {
        throw "Incorrect package name in $file. Expected $($expectedNames[$package]), got $($json.name)"
    }

    Write-Host "PASS: $($json.name)" -ForegroundColor Green
}

# ============================================================
# 4. ILLEGAL DEPENDENCY GRAPH
# ============================================================

Write-Section "4. DEPENDENCY GRAPH"

Write-Host "Checking OpenAI provider -> Agent Runtime..." -ForegroundColor Yellow

Assert-NoMatch `
    ".\packages\openai-provider\src" `
    "@ampda/agent-runtime" `
    "OpenAI provider contains no agent-runtime imports"

$openaiPackage =
    Get-Content ".\packages\openai-provider\package.json" -Raw |
    ConvertFrom-Json

if ($openaiPackage.dependencies.PSObject.Properties.Name -contains "@ampda/agent-runtime") {
    throw "OpenAI provider package.json still depends on @ampda/agent-runtime."
}

Write-Host "PASS: OpenAI provider has no runtime dependency." -ForegroundColor Green


Write-Host ""
Write-Host "Checking Agent Runtime -> Planner..." -ForegroundColor Yellow

Assert-Contains `
    ".\packages\agent-runtime\package.json" `
    "@ampda/planner" `
    "Agent Runtime declares Planner dependency"

# ============================================================
# 5. CORE PROVIDER CONTRACTS
# ============================================================

Write-Section "5. CORE PROVIDER CONTRACTS"

$coreIndex = ".\packages\core\src\index.ts"

$requiredCoreExports = @(
    "./project/SongMetadata.js",
    "./project/SongProject.js",
    "./workflow/WorkflowPlan.js",
    "./providers/LyricsProvider.js",
    "./providers/PromptProvider.js",
    "./providers/MusicProvider.js",
    "./providers/ArtworkProvider.js",
    "./providers/MetadataProvider.js"
)

foreach ($export in $requiredCoreExports) {
    Assert-Contains `
        $coreIndex `
        $export `
        "Core exports $export"
}

# ============================================================
# 6. PROVIDER CONTRACT FILES
# ============================================================

Write-Section "6. PROVIDER CONTRACT FILES"

$providerFiles = @(
    "LyricsProvider.ts",
    "PromptProvider.ts",
    "MusicProvider.ts",
    "ArtworkProvider.ts",
    "MetadataProvider.ts"
)

foreach ($file in $providerFiles) {

    Assert-Path `
        ".\packages\core\src\providers\$file" `
        "Core provider contract $file"
}

# ============================================================
# 7. CORE TYPES
# ============================================================

Write-Section "7. CORE TYPES"

Assert-Path `
    ".\packages\core\src\project\SongMetadata.ts" `
    "SongMetadata source"

Assert-Path `
    ".\packages\core\src\project\SongProject.ts" `
    "SongProject source"

Assert-Path `
    ".\packages\core\src\workflow\WorkflowPlan.ts" `
    "WorkflowPlan source"

Assert-Contains `
    ".\packages\core\src\project\SongMetadata.ts" `
    "title: string" `
    "SongMetadata.title"

Assert-Contains `
    ".\packages\core\src\project\SongMetadata.ts" `
    "genre: string" `
    "SongMetadata.genre"

Assert-Contains `
    ".\packages\core\src\project\SongMetadata.ts" `
    "bpm: number" `
    "SongMetadata.bpm"

Assert-Contains `
    ".\packages\core\src\project\SongMetadata.ts" `
    "key: string" `
    "SongMetadata.key"

# ============================================================
# 8. OPENAI PROVIDER
# ============================================================

Write-Section "8. OPENAI PROVIDER"

Assert-Path `
    ".\packages\openai-provider\src\index.ts" `
    "OpenAI provider index"

Assert-Path `
    ".\packages\openai-provider\src\OpenAIClient.ts" `
    "OpenAIClient"

$openaiSourceFiles = @(
    "OpenAILyricsProvider.ts",
    "OpenAIPromptProvider.ts",
    "OpenAIMetadataProvider.ts",
    "OpenAIMusicPromptProvider.ts"
)

foreach ($file in $openaiSourceFiles) {
    Assert-Path `
        ".\packages\openai-provider\src\$file" `
        "OpenAI provider $file"
}

Assert-Contains `
    ".\packages\openai-provider\src\OpenAIClient.ts" `
    'from "openai"' `
    "OpenAI SDK import"

Assert-Contains `
    ".\packages\openai-provider\package.json" `
    '"@ampda/core"' `
    "OpenAI provider -> Core dependency"

# ============================================================
# 9. PLANNER
# ============================================================

Write-Section "9. PLANNER"

Assert-Path `
    ".\packages\planner\src\index.ts" `
    "Planner index"

Assert-Path `
    ".\packages\planner\src\OpenAIPlannerProvider.ts" `
    "OpenAIPlannerProvider"

Assert-Path `
    ".\packages\planner\src\PlannerProvider.ts" `
    "PlannerProvider"

Assert-Path `
    ".\packages\planner\src\WorkflowPlan.ts" `
    "Planner WorkflowPlan"

Assert-Contains `
    ".\packages\planner\src\OpenAIPlannerProvider.ts" `
    "@ampda/openai-provider" `
    "Planner -> OpenAI provider dependency"

# ============================================================
# 10. AGENT RUNTIME
# ============================================================

Write-Section "10. AGENT RUNTIME"

Assert-Path `
    ".\packages\agent-runtime\src\index.ts" `
    "Agent Runtime index"

$runtimeFiles = @(
    "agent\Agent.ts",
    "agent\BaseAgent.ts",
    "agents\PlannerAgent.ts",
    "agents\LyricsAgent.ts",
    "agents\PromptAgent.ts",
    "agents\MusicGeneratorAgent.ts",
    "agents\ArtworkGeneratorAgent.ts",
    "agents\MetadataGeneratorAgent.ts",
    "context\AgentContext.ts",
    "executor\AgentExecutor.ts",
    "registry\AgentRegistry.ts"
)

foreach ($file in $runtimeFiles) {
    Assert-Path `
        ".\packages\agent-runtime\src\$file" `
        "Agent Runtime $file"
}

Assert-Contains `
    ".\packages\agent-runtime\src\agents\PlannerAgent.ts" `
    "@ampda/planner" `
    "PlannerAgent -> Planner dependency"

# ============================================================
# 11. TSCONFIG VALIDATION
# ============================================================

Write-Section "11. TYPESCRIPT CONFIGURATION"

$tsconfigs = @(
    ".\packages\core\tsconfig.json",
    ".\packages\core\tsconfig.build.json",
    ".\packages\openai-provider\tsconfig.json",
    ".\packages\openai-provider\tsconfig.build.json",
    ".\packages\planner\tsconfig.json",
    ".\packages\planner\tsconfig.build.json",
    ".\packages\agent-runtime\tsconfig.json",
    ".\packages\agent-runtime\tsconfig.build.json"
)

foreach ($file in $tsconfigs) {
    Assert-Path $file $file
}

# ============================================================
# 12. CLEAN DIST DIRECTORIES
# ============================================================

Write-Section "12. CLEAN BUILD OUTPUT"

$distDirectories = @(
    ".\packages\core\dist",
    ".\packages\openai-provider\dist",
    ".\packages\planner\dist",
    ".\packages\agent-runtime\dist"
)

foreach ($dist in $distDirectories) {

    if (Test-Path $dist) {
        Remove-Item $dist -Recurse -Force
        Write-Host "Cleaned: $dist" -ForegroundColor DarkGray
    }
}

# ============================================================
# 13. BUILD CORE
# ============================================================

Write-Section "13. BUILD CORE"

Run-Pnpm `
    @("--filter", "@ampda/core", "build") `
    "Core build"

Assert-Path `
    ".\packages\core\dist\index.d.ts" `
    "Core declaration output"

# ============================================================
# 14. VERIFY CORE DECLARATIONS
# ============================================================

Write-Section "14. CORE DECLARATIONS"

$coreDistIndex =
    Get-Content ".\packages\core\dist\index.d.ts" -Raw

foreach ($export in $requiredCoreExports) {

    if ($coreDistIndex -notmatch [regex]::Escape($export)) {
        throw "Missing declaration export: $export"
    }

    Write-Host "PASS: dist export $export" -ForegroundColor Green
}

# ============================================================
# 15. BUILD OPENAI PROVIDER
# ============================================================

Write-Section "15. BUILD OPENAI PROVIDER"

Run-Pnpm `
    @("--filter", "@ampda/openai-provider", "build") `
    "OpenAI provider build"

Assert-Path `
    ".\packages\openai-provider\dist\index.d.ts" `
    "OpenAI provider declaration output"

# ============================================================
# 16. BUILD PLANNER
# ============================================================

Write-Section "16. BUILD PLANNER"

Run-Pnpm `
    @("--filter", "@ampda/planner", "build") `
    "Planner build"

Assert-Path `
    ".\packages\planner\dist\index.d.ts" `
    "Planner declaration output"

# ============================================================
# 17. BUILD AGENT RUNTIME
# ============================================================

Write-Section "17. BUILD AGENT RUNTIME"

Run-Pnpm `
    @("--filter", "@ampda/agent-runtime", "build") `
    "Agent Runtime build"

Assert-Path `
    ".\packages\agent-runtime\dist\index.d.ts" `
    "Agent Runtime declaration output"

# ============================================================
# 18. DECLARATION QUALITY
# ============================================================

Write-Section "18. DECLARATION QUALITY"

$declarationFiles = @(
    ".\packages\core\dist\index.d.ts",
    ".\packages\openai-provider\dist\index.d.ts",
    ".\packages\planner\dist\index.d.ts",
    ".\packages\agent-runtime\dist\index.d.ts"
)

foreach ($file in $declarationFiles) {

    $content = Get-Content $file -Raw

    if ([string]::IsNullOrWhiteSpace($content)) {
        throw "Empty declaration: $file"
    }

    if ($content -match "Could not find") {
        throw "Invalid declaration content: $file"
    }

    Write-Host "PASS: $file" -ForegroundColor Green
}

# ============================================================
# 19. STALE DECLARATION CHECK
# ============================================================

Write-Section "19. STALE DECLARATION CHECK"

$staleRuntimeRefs =
    Get-ChildItem ".\packages\openai-provider\dist" `
        -Recurse `
        -File `
        -ErrorAction SilentlyContinue |
        Select-String "@ampda/agent-runtime"

if ($staleRuntimeRefs) {

    $staleRuntimeRefs |
        Format-Table Path,LineNumber,Line -AutoSize

    throw "Stale @ampda/agent-runtime reference found in OpenAI provider dist."
}

Write-Host "PASS: No stale runtime references in OpenAI provider dist." -ForegroundColor Green

# ============================================================
# 20. PACKAGE DEPENDENCY AUDIT
# ============================================================

Write-Section "20. PACKAGE DEPENDENCY AUDIT"

$dependencyChecks = @{
    "openai-provider" = @(
        "@ampda/core",
        "@ampda/config",
        "@ampda/prompts"
    )

    "planner" = @(
        "@ampda/core",
        "@ampda/openai-provider",
        "@ampda/prompts"
    )

    "agent-runtime" = @(
        "@ampda/core",
        "@ampda/job-engine",
        "@ampda/planner"
    )
}

foreach ($package in $dependencyChecks.Keys) {

    $file = ".\packages\$package\package.json"

    $json =
        Get-Content $file -Raw |
        ConvertFrom-Json

    foreach ($dependency in $dependencyChecks[$package]) {

        $hasDependency =
            ($json.dependencies.PSObject.Properties.Name -contains $dependency) -or
            ($json.devDependencies.PSObject.Properties.Name -contains $dependency)

        if (-not $hasDependency) {
            throw "$package is missing dependency $dependency"
        }

        Write-Host "PASS: $package -> $dependency" -ForegroundColor Green
    }
}

# ============================================================
# 21. FULL WORKSPACE BUILD
# ============================================================

Write-Section "21. FULL WORKSPACE BUILD"

Run-Pnpm `
    @("-r", "build") `
    "Full recursive workspace build"

# ============================================================
# 22. FINAL OUTPUT AUDIT
# ============================================================

Write-Section "22. FINAL OUTPUT AUDIT"

foreach ($package in $packages) {

    $dist = ".\packages\$package\dist"

    $files =
        Get-ChildItem $dist -Recurse -File

    if (-not $files) {
        throw "No build output found for $package."
    }

    Write-Host ""
    Write-Host "${package}:" -ForegroundColor White

    $files |
        Select-Object FullName,Length |
        Format-Table -AutoSize
}

# ============================================================
# 23. FINAL STATUS
# ============================================================

Write-Section "AMPDA VALIDATION COMPLETE"

Write-Host ""
Write-Host "ALL CHECKS PASSED." -ForegroundColor Green
Write-Host ""
Write-Host "Architecture validation:" -ForegroundColor Green
Write-Host "  Core contracts              PASS" -ForegroundColor Green
Write-Host "  OpenAI provider isolation   PASS" -ForegroundColor Green
Write-Host "  Planner                     PASS" -ForegroundColor Green
Write-Host "  Agent Runtime               PASS" -ForegroundColor Green
Write-Host "  Type declarations           PASS" -ForegroundColor Green
Write-Host "  Dependency graph            PASS" -ForegroundColor Green
Write-Host "  Clean package builds        PASS" -ForegroundColor Green
Write-Host "  Recursive workspace build   PASS" -ForegroundColor Green
Write-Host ""

Write-Host "AMPDA WORKSPACE STATUS: HEALTHY" `
    -ForegroundColor Green

Write-Host ""

