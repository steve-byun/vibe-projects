#!/usr/bin/env node

/**
 * 프로젝트 자동 생성 스크립트
 *
 * 사용법:
 * node create-project.js <프로젝트명> [템플릿명]
 *
 * 예시:
 * node create-project.js my-calculator utility-webapp
 */

const fs = require('fs');
const path = require('path');

// 설정
const CONFIG = {
    templatesDir: path.join(__dirname, '..', 'templates'),
    projectsDir: path.join(__dirname, '..', 'projects'),
    defaultTemplate: 'utility-webapp'
};

/**
 * 폴더 복사 (재귀적)
 */
function copyFolderSync(from, to) {
    if (!fs.existsSync(to)) {
        fs.mkdirSync(to, { recursive: true });
    }

    fs.readdirSync(from).forEach(element => {
        const fromPath = path.join(from, element);
        const toPath = path.join(to, element);

        if (fs.lstatSync(fromPath).isDirectory()) {
            copyFolderSync(fromPath, toPath);
        } else {
            fs.copyFileSync(fromPath, toPath);
        }
    });
}

/**
 * 파일 내용 치환 (프로젝트명 등)
 */
function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');

    for (const [key, value] of Object.entries(replacements)) {
        const regex = new RegExp(key, 'g');
        content = content.replace(regex, value);
    }

    fs.writeFileSync(filePath, content, 'utf8');
}

/**
 * 프로젝트 생성
 */
function createProject(projectName, templateName = CONFIG.defaultTemplate) {
    console.log(`\n🚀 프로젝트 생성 시작: ${projectName}\n`);

    // 1. 템플릿 경로 확인
    const templatePath = path.join(CONFIG.templatesDir, templateName);
    if (!fs.existsSync(templatePath)) {
        console.error(`❌ 템플릿을 찾을 수 없습니다: ${templateName}`);
        console.log(`\n사용 가능한 템플릿:`);
        fs.readdirSync(CONFIG.templatesDir).forEach(t => console.log(`  - ${t}`));
        process.exit(1);
    }

    // 2. 프로젝트 폴더 생성
    const projectPath = path.join(CONFIG.projectsDir, projectName);
    if (fs.existsSync(projectPath)) {
        console.error(`❌ 프로젝트가 이미 존재합니다: ${projectName}`);
        process.exit(1);
    }

    console.log(`📁 프로젝트 폴더 생성: ${projectPath}`);
    fs.mkdirSync(projectPath, { recursive: true });

    // 3. 템플릿 복사
    console.log(`📋 템플릿 복사 중...`);
    copyFolderSync(templatePath, projectPath);

    // 4. 프로젝트 정보로 파일 내용 치환
    console.log(`✏️  프로젝트 정보 업데이트 중...`);
    const replacements = {
        'Text Utilities': projectName,
        '무료 텍스트 도구 모음': projectName,
        'utility-webapp': projectName.toLowerCase().replace(/\s+/g, '-')
    };

    const htmlFile = path.join(projectPath, 'index.html');
    if (fs.existsSync(htmlFile)) {
        replaceInFile(htmlFile, replacements);
    }

    // 5. package.json 생성
    console.log(`📦 package.json 생성 중...`);
    const packageJson = {
        name: projectName.toLowerCase().replace(/\s+/g, '-'),
        version: '1.0.0',
        description: `${projectName} - Revenue project`,
        scripts: {
            start: 'npx serve .',
            deploy: 'echo "배포 스크립트를 설정하세요"'
        },
        keywords: ['web', 'utility', 'adsense'],
        author: 'Your Name',
        license: 'MIT'
    };

    fs.writeFileSync(
        path.join(projectPath, 'package.json'),
        JSON.stringify(packageJson, null, 2),
        'utf8'
    );

    // 6. README.md 생성
    console.log(`📄 README.md 생성 중...`);
    const readme = `# ${projectName}

이 프로젝트는 **Revenue Project Factory**로 생성되었습니다.

## 🚀 시작하기

\`\`\`bash
# 로컬에서 실행
npx serve .

# 또는
python -m http.server 8000
\`\`\`

브라우저에서 http://localhost:8000 (또는 다른 포트) 열기

## 💰 수익화 설정

1. [Google AdSense](https://www.google.com/adsense/) 계정 생성
2. 사이트 승인 받기
3. \`adsense-config.js\` 파일에서 설정 업데이트:
   - \`clientId\`: 본인의 AdSense 클라이언트 ID
   - \`slots\`: 광고 단위 슬롯 ID들
   - \`testMode\`: false로 변경 (배포 시)
4. \`index.html\`에 AdSense 스크립트 추가

## 📤 배포

### Netlify (추천)
\`\`\`bash
# Netlify CLI 설치
npm install -g netlify-cli

# 배포
netlify deploy --prod
\`\`\`

### Vercel
\`\`\`bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel --prod
\`\`\`

### GitHub Pages
1. GitHub 저장소 생성
2. Settings > Pages에서 활성화
3. \`git push\`

## 📈 SEO 최적화

- [ ] meta 태그 수정 (description, keywords)
- [ ] Open Graph 태그 추가
- [ ] sitemap.xml 생성
- [ ] robots.txt 설정
- [ ] Google Search Console 등록
- [ ] Google Analytics 설정

## 🔧 커스터마이징

- \`style.css\`: 디자인 변경
- \`script.js\`: 기능 추가/수정
- \`index.html\`: 구조 변경

생성 날짜: ${new Date().toLocaleDateString('ko-KR')}
`;

    fs.writeFileSync(path.join(projectPath, 'README.md'), readme, 'utf8');

    // 7. 완료 메시지
    console.log(`\n✅ 프로젝트 생성 완료!\n`);
    console.log(`📍 위치: ${projectPath}\n`);
    console.log(`다음 단계:`);
    console.log(`  1. cd projects/${projectName}`);
    console.log(`  2. npx serve .`);
    console.log(`  3. 브라우저에서 열기`);
    console.log(`  4. adsense-config.js 설정`);
    console.log(`  5. 배포!\n`);
}

// CLI 실행
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
        console.log(`
사용법: node create-project.js <프로젝트명> [템플릿명]

예시:
  node create-project.js my-calculator
  node create-project.js todo-app utility-webapp

옵션:
  --help, -h    이 도움말 표시
  --list, -l    사용 가능한 템플릿 목록 표시
        `);
        process.exit(0);
    }

    if (args[0] === '--list' || args[0] === '-l') {
        console.log('\n사용 가능한 템플릿:\n');
        fs.readdirSync(CONFIG.templatesDir).forEach(t => {
            console.log(`  - ${t}`);
        });
        console.log('');
        process.exit(0);
    }

    const projectName = args[0];
    const templateName = args[1] || CONFIG.defaultTemplate;

    createProject(projectName, templateName);
}

module.exports = { createProject };
