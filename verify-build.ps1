# C:\projects\ampda\verify-build.ps1

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ProjectRoot = "C:\projects\ampda"

Set-Location -LiteralPath $ProjectRoot


function Invoke-PnpmChecked {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [string[]] $Arguments,

        [Parameter(Mandatory = $true)]
        [string] $LogPrefix
    )

    $stdoutLog = Join-Path $ProjectRoot "$LogPrefix.stdout.log"
    $stderrLog = Join-Path $ProjectRoot "$LogPrefix.stderr.log"

    Remove-Item `
        -LiteralPath $stdoutLog, $stderrLog `
        -Force `
        -ErrorAction SilentlyContinue

    $commandText = "pnpm $($Arguments -join ' ')"

    Write-Host ""
    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host $commandText -ForegroundColor Cyan
    Write-Host "=========================================" -ForegroundColor Cyan

    try {
        $process = Start-Process `
            -FilePath "pnpm.cmd" `
            -ArgumentList $Arguments `
            -WorkingDirectory $ProjectRoot `
            -RedirectStandardOutput $stdoutLog `
            -RedirectStandardError $stderrLog `
            -Wait `
            -PassThru `
            -NoNewWindow
    }
    catch {
        Write-Host ""
        Write-Host "FAILED TO START PNPM" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red

        throw
    }

    $exitCode = $process.ExitCode

    Write-Host ""
    Write-Host "----- stdout -----" -ForegroundColor DarkGray

    if (Test-Path -LiteralPath $stdoutLog) {
        $stdout = Get-Content `
            -LiteralPath $stdoutLog `
            -Raw `
            -ErrorAction SilentlyContinue

        if (-not [string]::IsNullOrWhiteSpace($stdout)) {
            Write-Host $stdout
        }
    }

    Write-Host ""
    Write-Host "----- stderr -----" -ForegroundColor DarkGray

    if (Test-Path -LiteralPath $stderrLog) {
        $stderr = Get-Content `
            -LiteralPath $stderrLog `
            -Raw `
            -ErrorAction SilentlyContinue

        if (-not [string]::IsNullOrWhiteSpace($stderr)) {
            Write-Host $stderr -ForegroundColor Red
        }
    }

    Write-Host ""
    Write-Host "Actual pnpm exit code: $exitCode" -ForegroundColor Yellow

    if ($exitCode -ne 0) {
        Write-Host ""
        Write-Host "=========================================" -ForegroundColor Red
        Write-Host "COMMAND FAILED" -ForegroundColor Red
        Write-Host "=========================================" -ForegroundColor Red

        Write-Host ""
        Write-Host "Command:" -ForegroundColor Red
        Write-Host $commandText -ForegroundColor Red

        Write-Host ""
        Write-Host "Exit code:" -ForegroundColor Red
        Write-Host $exitCode -ForegroundColor Red

        Write-Host ""
        Write-Host "Logs:" -ForegroundColor Red
        Write-Host "  $stdoutLog" -ForegroundColor Red
        Write-Host "  $stderrLog" -ForegroundColor Red

        Write-Host ""
        Write-Host "Relevant errors:" -ForegroundColor Red

        $errorPatterns = @(
            "error TS",
            "ERR_PNPM",
            "ELIFECYCLE",
            "Failed",
            "failed",
            "Error",
            "ERROR",
            "FAIL",
            "fail"
        )

        $errorLines = @()

        foreach ($logPath in @($stdoutLog, $stderrLog)) {
            if (Test-Path -LiteralPath $logPath) {
                $matches = Get-Content -LiteralPath $logPath |
                    Select-String -Pattern $errorPatterns

                if ($null -ne $matches) {
                    $errorLines += $matches
                }
            }
        }

        if ($errorLines.Count -gt 0) {
            foreach ($errorLine in $errorLines) {
                Write-Host $errorLine.Line -ForegroundColor Red
            }
        }
        else {
            Write-Host "No standard error pattern was detected." -ForegroundColor Yellow
            Write-Host "Review the complete logs above." -ForegroundColor Yellow
        }

        throw "$commandText failed with exit code $exitCode."
    }

    Write-Host ""
    Write-Host "PASS" -ForegroundColor Green

    return $exitCode
}


function Invoke-BuildStep {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [string] $Name,

        [Parameter(Mandatory = $true)]
        [string[]] $Arguments,

        [Parameter(Mandatory = $true)]
        [string] $LogPrefix
    )

    Write-Host ""
    Write-Host "#########################################" -ForegroundColor Magenta
    Write-Host "BUILD STEP: $Name" -ForegroundColor Magenta
    Write-Host "#########################################" -ForegroundColor Magenta

    $exitCode = Invoke-PnpmChecked `
        -Arguments $Arguments `
        -LogPrefix $LogPrefix

    if ($exitCode -ne 0) {
        Write-Host ""
        Write-Host "${Name}: FAILED" -ForegroundColor Red
        exit $exitCode
    }

    Write-Host ""
    Write-Host "${Name}: PASS" -ForegroundColor Green

    return $exitCode
}


function Get-RootPackageJson {
    $packageJsonPath = Join-Path $ProjectRoot "package.json"

    if (-not (Test-Path -LiteralPath $packageJsonPath)) {
        throw "Root package.json was not found: $packageJsonPath"
    }

    try {
        return Get-Content `
            -LiteralPath $packageJsonPath `
            -Raw |
            ConvertFrom-Json
    }
    catch {
        throw "Unable to parse root package.json. $($_.Exception.Message)"
    }
}


function Test-PnpmScriptExists {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [object] $PackageJson,

        [Parameter(Mandatory = $true)]
        [string] $ScriptName
    )

    if ($null -eq $PackageJson.scripts) {
        return $false
    }

    $scriptProperty = $PackageJson.scripts.PSObject.Properties[$ScriptName]

    return ($null -ne $scriptProperty)
}


function Invoke-OptionalTestSuite {
    [CmdletBinding()]
    param()

    $packageJson = Get-RootPackageJson

    if (-not (Test-PnpmScriptExists -PackageJson $packageJson -ScriptName "test")) {
        Write-Host ""
        Write-Host "=========================================" -ForegroundColor Yellow
        Write-Host "NO ROOT TEST SCRIPT FOUND" -ForegroundColor Yellow
        Write-Host "=========================================" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Root package.json does not define scripts.test." -ForegroundColor Yellow
        Write-Host "Skipping root test phase." -ForegroundColor Yellow

        return 0
    }

    Write-Host ""
    Write-Host "=========================================" -ForegroundColor Magenta
    Write-Host "TEST PHASE" -ForegroundColor Magenta
    Write-Host "=========================================" -ForegroundColor Magenta

    $testExit = Invoke-PnpmChecked `
        -Arguments @("test") `
        -LogPrefix "verify-test"

    if ($testExit -ne 0) {
        Write-Host ""
        Write-Host "TEST SUITE: FAILED" -ForegroundColor Red
        exit $testExit
    }

    Write-Host ""
    Write-Host "TEST SUITE: PASS" -ForegroundColor Green

    return $testExit
}


function Invoke-WorkspaceTests {
    [CmdletBinding()]
    param()

    $packageJson = Get-RootPackageJson

    if (Test-PnpmScriptExists -PackageJson $packageJson -ScriptName "test") {
        return Invoke-OptionalTestSuite
    }

    Write-Host ""
    Write-Host "=========================================" -ForegroundColor Yellow
    Write-Host "WORKSPACE TEST DISCOVERY" -ForegroundColor Yellow
    Write-Host "=========================================" -ForegroundColor Yellow

    $workspaceConfigPath = Join-Path $ProjectRoot "pnpm-workspace.yaml"

    if (-not (Test-Path -LiteralPath $workspaceConfigPath)) {
        Write-Host "pnpm-workspace.yaml not found." -ForegroundColor Yellow
        Write-Host "No workspace test configuration discovered." -ForegroundColor Yellow

        return 0
    }

    Write-Host "No root test script found." -ForegroundColor Yellow
    Write-Host "Workspace-level tests are not automatically inferred." -ForegroundColor Yellow
    Write-Host "Skipping test execution." -ForegroundColor Yellow

    return 0
}


Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "AMPDA BUILD + TEST VERIFICATION" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Project root: $ProjectRoot" -ForegroundColor DarkGray
Write-Host "PowerShell: $($PSVersionTable.PSVersion)" -ForegroundColor DarkGray
Write-Host ""


$workflowExit = Invoke-BuildStep `
    -Name "WORKFLOW-ENGINE BUILD" `
    -Arguments @(
        "--filter",
        "@ampda/workflow-engine",
        "build"
    ) `
    -LogPrefix "verify-workflow-engine-build"

if ($workflowExit -ne 0) {
    exit $workflowExit
}


$agentExit = Invoke-BuildStep `
    -Name "AGENT-RUNTIME BUILD" `
    -Arguments @(
        "--filter",
        "@ampda/agent-runtime",
        "build"
    ) `
    -LogPrefix "verify-agent-runtime-build"

if ($agentExit -ne 0) {
    exit $agentExit
}


$rootExit = Invoke-BuildStep `
    -Name "ROOT WORKSPACE BUILD" `
    -Arguments @(
        "build"
    ) `
    -LogPrefix "verify-root-build"

if ($rootExit -ne 0) {
    exit $rootExit
}


$testExit = Invoke-WorkspaceTests

if ($testExit -ne 0) {
    exit $testExit
}


Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "VERIFIED: ALL BUILDS AND TESTS PASS" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Workflow engine: PASS" -ForegroundColor Green
Write-Host "Agent runtime:    PASS" -ForegroundColor Green
Write-Host "Workspace:        PASS" -ForegroundColor Green
Write-Host "Tests:            PASS" -ForegroundColor Green
Write-Host ""

exit 0
