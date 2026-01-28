$wshell = New-Object -ComObject wscript.shell
$wshell.AppActivate('Visual Studio Code')
Start-Sleep -Milliseconds 300
$wshell.SendKeys('^{F4}')
Start-Sleep -Milliseconds 500
$wshell.SendKeys('^+p')
Start-Sleep -Milliseconds 500
$wshell.SendKeys('Claude Code: Open in New Tab')
Start-Sleep -Milliseconds 300
$wshell.SendKeys('{ENTER}')
Start-Sleep -Milliseconds 2000
$korean = [char]0xC791 + [char]0xC5C5 + [char]0xC900 + [char]0xBE44 + [char]0xD574 + [char]0xC918
Set-Clipboard -Value $korean
$wshell.SendKeys('^v')
Start-Sleep -Milliseconds 300
$wshell.SendKeys('{ENTER}')
