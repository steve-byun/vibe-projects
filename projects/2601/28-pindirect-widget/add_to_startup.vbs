Set WshShell = CreateObject("WScript.Shell")
Set oShellLink = WshShell.CreateShortcut(WshShell.SpecialFolders("Startup") & "\PinDirect Widget.lnk")
oShellLink.TargetPath = "c:\Steve\01_Vibe_Projects\projects\2601\28-pindirect-widget\run_widget.bat"
oShellLink.WorkingDirectory = "c:\Steve\01_Vibe_Projects\projects\2601\28-pindirect-widget"
oShellLink.WindowStyle = 7
oShellLink.Save
WScript.Echo "시작프로그램에 등록 완료!"
