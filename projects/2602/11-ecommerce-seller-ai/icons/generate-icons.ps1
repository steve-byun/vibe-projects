Add-Type -AssemblyName System.Drawing
$sizes = @(16, 48, 128)
$outDir = Split-Path -Parent $MyInvocation.MyCommand.Path

foreach ($s in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($s, $s)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = 'AntiAlias'
    $g.TextRenderingHint = 'AntiAlias'

    # Purple-blue gradient background
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Point(0, 0)),
        (New-Object System.Drawing.Point($s, $s)),
        [System.Drawing.Color]::FromArgb(124, 58, 237),
        [System.Drawing.Color]::FromArgb(59, 130, 246)
    )

    # Rounded rectangle
    $r = [int]($s * 0.18)
    if ($r -lt 1) { $r = 1 }
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddArc(0, 0, $r*2, $r*2, 180, 90)
    $path.AddArc($s - $r*2, 0, $r*2, $r*2, 270, 90)
    $path.AddArc($s - $r*2, $s - $r*2, $r*2, $r*2, 0, 90)
    $path.AddArc(0, $s - $r*2, $r*2, $r*2, 90, 90)
    $path.CloseFigure()
    $g.FillPath($brush, $path)

    # "LP" text
    $fontSize = [Math]::Max(6, [int]($s * 0.38))
    $font = New-Object System.Drawing.Font("Arial", $fontSize, [System.Drawing.FontStyle]::Bold)
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $rect = New-Object System.Drawing.RectangleF(0, -($s*0.05), $s, $s)
    $g.DrawString("LP", $font, [System.Drawing.Brushes]::White, $rect, $sf)

    # "AI" text (only for 48+ sizes)
    if ($s -ge 48) {
        $smallSize = [Math]::Max(5, [int]($s * 0.16))
        $smallFont = New-Object System.Drawing.Font("Arial", $smallSize, [System.Drawing.FontStyle]::Bold)
        $rect2 = New-Object System.Drawing.RectangleF(0, ($s*0.22), $s, $s)
        $g.DrawString("AI", $smallFont, [System.Drawing.Brushes]::White, $rect2, $sf)
    }

    $outPath = Join-Path $outDir "icon$s.png"
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created icon$s.png"
}
