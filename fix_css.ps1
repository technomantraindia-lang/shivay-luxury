$file = "c:\Users\techn\Documents\chetan project\slviay\styles.css"
$lines = Get-Content $file -Encoding UTF8

# Find start line of icon-circle block
$startIdx = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "Circular icon") {
        $startIdx = $i
        break
    }
}

Write-Host "Start index: $startIdx"

# Find end: 3 closing braces after startIdx
$braceCount = 0
$endIdx = $startIdx
for ($i = $startIdx; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "^\}") { $braceCount++ }
    if ($braceCount -ge 3) { $endIdx = $i; break }
}

Write-Host "End index: $endIdx"
Write-Host "Block to replace:"
$lines[$startIdx..$endIdx] | ForEach-Object { Write-Host $_ }

$newBlock = @(
'/* -- Circular brand logo -- */',
'.pb__card-logo-circle {',
'  flex-shrink: 0;',
'  display: grid;',
'  place-items: center;',
'  width: 56px;',
'  height: 56px;',
'  border-radius: 50%;',
'  background: rgba(20, 12, 4, 0.72);',
'  border: 1.5px solid rgba(196, 154, 82, 0.75);',
'  overflow: hidden;',
'  padding: 7px;',
'  transition: border-color 280ms ease, transform 280ms ease, background-color 280ms ease;',
'}',
'.pb__card-logo-circle img {',
'  width: 100%;',
'  height: 100%;',
'  object-fit: contain;',
'  display: block;',
'  transition: transform 320ms ease;',
'}',
'.pb__card:hover .pb__card-logo-circle {',
'  border-color: #c49a52;',
'  background: rgba(20, 12, 4, 0.9);',
'  transform: scale(1.1);',
'}',
'.pb__card:hover .pb__card-logo-circle img {',
'  transform: scale(1.08);',
'}',
'.pb__card-logo-circle--gold {',
'  border-color: #c49a52;',
'  background: rgba(30, 18, 6, 0.82);',
'}'
)

$before = $lines[0..($startIdx - 1)]
$after  = $lines[($endIdx + 1)..($lines.Count - 1)]
$result = $before + $newBlock + $after
Set-Content -Path $file -Value $result -Encoding UTF8
Write-Host "Done. Total lines: $($result.Count)"
