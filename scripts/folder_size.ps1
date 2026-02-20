Get-ChildItem 'C:\Work' -Directory | ForEach-Object {
    $size = (Get-ChildItem $_.FullName -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    [PSCustomObject]@{
        Name   = $_.Name
        SizeGB = [math]::Round($size / 1GB, 2)
        SizeMB = [math]::Round($size / 1MB, 0)
    }
} | Sort-Object SizeGB -Descending | Format-Table Name, SizeGB, SizeMB -AutoSize
