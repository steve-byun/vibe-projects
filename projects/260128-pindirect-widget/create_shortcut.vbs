Set WshShell = CreateObject("WScript.Shell")
Set Shortcut = WshShell.CreateShortcut(WshShell.SpecialFolders("Startup") & "\PinDirect Widget.lnk")
Shortcut.TargetPath = "C:\Steve\01_Vibe_Projects\projects\260128-pindirect-widget\run_widget.bat"
Shortcut.WorkingDirectory = "C:\Steve\01_Vibe_Projects\projects\260128-pindirect-widget"
Shortcut.Save
