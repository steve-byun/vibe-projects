# Claude Code 원격 PC 연동 설정 가이드

## 개요
pc_develop(Claude Code 실행)에서 pc_controller(원격 제어기 PC)의 코드를 직접 편집하고 빌드하기 위한 설정.

## 아키텍처
```
pc_develop (Claude Code)              pc_controller (원격/빌드)
+-----------------+                   +------------------+
| Claude Code     |                   | 소스코드 (C:\v3) |
| Read/Edit/Write |---[SMB 공유]----->| MSBuild / VS     |
| Bash            |---[SSH/WinRM]---->| 빌드 실행        |
+-----------------+                   +------------------+
```

- **파일 편집**: SMB 공유 (Claude의 도구가 UNC 경로로 직접 접근)
- **빌드 실행**: SSH 또는 WinRM (원격 명령 실행)

## 방식 비교

| 방식 | 파일 편집 | 빌드 명령 | 장단점 |
|------|----------|----------|--------|
| SMB + WinRM | SMB | WinRM | 추가 설치 불필요, 명령어 복잡 |
| SMB + SSH | SMB | SSH | OpenSSH 설치 필요, 명령어 간단 |

## 빠른 시작

### 방법 1: SMB + WinRM (추가 설치 없음)

1. `setup_controller_winrm.bat`를 pc_controller에 복사 → 관리자 권한으로 실행
2. `setup_develop_winrm.bat`를 pc_develop에서 관리자 권한으로 실행
3. bat 파일 상단의 변수(IP, 계정, 공유 경로)를 환경에 맞게 수정

### 방법 2: SMB + SSH (추천)

1. pc_develop(인터넷 되는 PC)에서 OpenSSH-Win64.zip 다운로드
   - https://github.com/PowerShell/Win32-OpenSSH/releases
   - `OpenSSH-Win64.zip` 다운로드
2. zip 파일과 `setup_controller_ssh.bat`를 pc_controller에 복사
3. pc_controller에서 `setup_controller_ssh.bat` 관리자 권한으로 실행
4. pc_develop에서 `setup_develop_ssh.bat` 실행

## Claude Code 사용법

### 파일 접근 (SMB - 공통)
```
Read/Edit/Write 도구에서 경로:
//192.168.100.31/v3/src/ctrlink/code/module/...
```

### 빌드 실행 (WinRM 방식)
```powershell
$cred = New-Object PSCredential("Administrator", (ConvertTo-SecureString "password" -AsPlainText -Force))
Invoke-Command -ComputerName 192.168.100.31 -Credential $cred -ScriptBlock {
    & "C:\Program Files (x86)\Microsoft Visual Studio\2019\Professional\MSBuild\Current\Bin\MSBuild.exe" `
      "C:\v3\src\ctrlink\build_win\Solution.sln" /t:Build /p:Configuration=Release /p:Platform=x64 /m /nologo /v:minimal
}
```

### 빌드 실행 (SSH 방식)
```bash
ssh Administrator@192.168.100.31 '"C:\Program Files (x86)\Microsoft Visual Studio\2019\Professional\MSBuild\Current\Bin\MSBuild.exe" "C:\v3\src\ctrlink\build_win\Solution.sln" /t:Build /p:Configuration=Release /p:Platform=x64 /m /nologo /v:minimal'
```

## 빌드 솔루션 목록

| 솔루션 | Configuration | Platform |
|--------|--------------|----------|
| build_win\ControLINK_V3_WIN.sln | Release | x64 |
| build_intime\ControLINK_V3_INTIME.sln | Release | INtime |
| build_win_for_intime\ControLINK_V3_WIN_FOR_INTIME.sln | Release | x64 |

## 새 소스파일 추가 시 주의사항

CMake 생성 VS 프로젝트는 소스파일을 `.vcxproj`에 명시적으로 등록해야 함.
3개 빌드 폴더의 해당 `.vcxproj` 파일에 `<ClCompile Include="..." />` 항목 추가 필요.

예시 (dynamics 모듈에 collision_detector.cpp 추가):
```xml
<!-- build_win/module/dynamics/dynamics.vcxproj -->
<!-- build_intime/module/dynamics/dynamics.vcxproj -->
<!-- build_win_for_intime/module/dynamics/dynamics.vcxproj -->
<ClCompile Include="C:\v3\src\ctrlink\code\module\dynamics\src\collision_detector.cpp" />
```

## 트러블슈팅

| 문제 | 원인 | 해결 |
|------|------|------|
| SMB "error 67" | 인증 필요 | `net use \\IP\share /user:ID PW` |
| WinRM "ServerNotTrusted" | TrustedHosts 미설정 | pc_develop에서 `Set-Item WSMan:\...\TrustedHosts` |
| WinRM "Access Denied" | 관리자 아님 | 관리자 PowerShell에서 `Enable-PSRemoting` |
| LNK2019 unresolved | vcxproj에 파일 미등록 | 3개 vcxproj에 ClCompile 항목 추가 |
| INTIME "invalid config" | 플랫폼 이름 다름 | Platform=INtime (x64 아님) |
