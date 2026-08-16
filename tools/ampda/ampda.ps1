<#
.SYNOPSIS
AMPDA CLI Entry Point

.DESCRIPTION
Primary command-line interface for AMPDA.

.VERSION
0.1.0
#>

[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [string]$Command = "help",

    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Arguments
)

$ErrorActionPreference = "Stop"

$Version = "0.1.0"

function Show-Banner {

    Write-Host ""
    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host " AMPDA - Autonomous Music Platform" -ForegroundColor Cyan
    Write-Host " Version $Version" -ForegroundColor Cyan
    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host ""

}

function Show-Help {

    Show-Banner

    Write-Host "Usage:"
    Write-Host ""
    Write-Host "ampda <command>"
    Write-Host ""
    Write-Host "Commands"
    Write-Host ""
    Write-Host "help"
    Write-Host "version"
    Write-Host ""
}

try {

    switch ($Command.ToLower()) {

        "help" {

            Show-Help

        }

        "version" {

            Write-Host $Version

        }

        default {

            Write-Host ""
            Write-Host "Unknown command: $Command" -ForegroundColor Yellow
            Write-Host ""

            Show-Help

            exit 1

        }

    }

}
catch {

    Write-Host ""
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""

    exit 1

}
