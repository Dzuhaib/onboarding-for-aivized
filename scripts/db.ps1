param(
  [Parameter(Mandatory = $true)]
  [ValidateSet("start", "stop", "status")]
  [string]$Action
)

$pgBin = "C:\Program Files\PostgreSQL\18\bin"
$dataDir = Join-Path (Split-Path -Parent $PSScriptRoot) ".pgdata"
$logFile = Join-Path $dataDir "server.log"
$port = 5433

switch ($Action) {
  "start" {
    & "$pgBin\pg_ctl.exe" -D $dataDir -o "-p $port" -l $logFile start
  }
  "stop" {
    & "$pgBin\pg_ctl.exe" -D $dataDir stop -m fast
  }
  "status" {
    & "$pgBin\pg_ctl.exe" -D $dataDir status
  }
}
