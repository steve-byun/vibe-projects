#!/usr/bin/env node

/**
 * 배포 자동화 스크립트
 *
 * 사용법:
 * node deploy.js <프로젝트명> <플랫폼>
 *
 * 플랫폼: netlify, vercel, github
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CONFIG = {
    projectsDir: path.join(__dirname, '..', 'projects')
};

/**
 * 명령어 실행 헬퍼
 */
function exec(command, cwd) {
    try {
        console.log(`\n🔧 실행: ${command}`);
        const result = execSync(command, {
            cwd,
            encoding: 'utf8',
            stdio: 'inherit'
        });
        return result;
    } catch (error) {
        console.error(`❌ 오류: ${error.message}`);
        process.exit(1);
    }
}

/**
 * Netlify 배포
 */
function deployToNetlify(projectPath, projectName) {
    console.log(`\n🌐 Netlify 배포 시작...\n`);

    // Netlify CLI 설치 확인
    try {
        execSync('netlify --version', { stdio: 'ignore' });
    } catch {
        console.log('📦 Netlify CLI 설치 중...');
        exec('npm install -g netlify-cli', process.cwd());
    }

    // netlify.toml 생성
    const netlifyConfig = `[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;

    fs.writeFileSync(path.join(projectPath, 'netlify.toml'), netlifyConfig);

    // 배포
    console.log('\n로그인이 필요합니다...');
    exec('netlify login', projectPath);
    exec('netlify init', projectPath);
    exec('netlify deploy --prod', projectPath);

    console.log(`\n✅ Netlify 배포 완료!`);
    console.log(`\n배포 URL은 위에서 확인하세요.`);
}

/**
 * Vercel 배포
 */
function deployToVercel(projectPath, projectName) {
    console.log(`\n▲ Vercel 배포 시작...\n`);

    // Vercel CLI 설치 확인
    try {
        execSync('vercel --version', { stdio: 'ignore' });
    } catch {
        console.log('📦 Vercel CLI 설치 중...');
        exec('npm install -g vercel', process.cwd());
    }

    // vercel.json 생성
    const vercelConfig = {
        version: 2,
        name: projectName,
        builds: [
            {
                src: "index.html",
                use: "@vercel/static"
            }
        ]
    };

    fs.writeFileSync(
        path.join(projectPath, 'vercel.json'),
        JSON.stringify(vercelConfig, null, 2)
    );

    // 배포
    console.log('\n로그인이 필요합니다...');
    exec('vercel login', projectPath);
    exec('vercel --prod', projectPath);

    console.log(`\n✅ Vercel 배포 완료!`);
}

/**
 * GitHub Pages 배포 안내
 */
function deployToGitHub(projectPath, projectName) {
    console.log(`\n🐙 GitHub Pages 배포 안내\n`);

    console.log(`다음 단계를 수행하세요:\n`);
    console.log(`1. GitHub에서 새 저장소 생성:`);
    console.log(`   https://github.com/new\n`);

    console.log(`2. 로컬 git 초기화 및 푸시:`);
    console.log(`   cd ${projectPath}`);
    console.log(`   git init`);
    console.log(`   git add .`);
    console.log(`   git commit -m "Initial commit"`);
    console.log(`   git branch -M main`);
    console.log(`   git remote add origin https://github.com/USERNAME/${projectName}.git`);
    console.log(`   git push -u origin main\n`);

    console.log(`3. GitHub 저장소 Settings > Pages:`);
    console.log(`   - Source: Deploy from a branch`);
    console.log(`   - Branch: main / (root)`);
    console.log(`   - Save\n`);

    console.log(`4. 배포 완료까지 1-2분 대기`);
    console.log(`   URL: https://USERNAME.github.io/${projectName}\n`);

    // .nojekyll 파일 생성 (GitHub Pages 최적화)
    fs.writeFileSync(path.join(projectPath, '.nojekyll'), '');
    console.log(`✅ .nojekyll 파일 생성 완료 (GitHub Pages 최적화)\n`);
}

/**
 * 배포 전 체크리스트
 */
function preDeployChecklist(projectPath) {
    console.log(`\n📋 배포 전 체크리스트\n`);

    const checks = [
        {
            name: 'index.html 존재',
            check: () => fs.existsSync(path.join(projectPath, 'index.html'))
        },
        {
            name: 'adsense-config.js testMode=false',
            check: () => {
                const configPath = path.join(projectPath, 'adsense-config.js');
                if (!fs.existsSync(configPath)) return null;
                const content = fs.readFileSync(configPath, 'utf8');
                return !content.includes('testMode: true');
            }
        },
        {
            name: 'AdSense 클라이언트 ID 설정',
            check: () => {
                const configPath = path.join(projectPath, 'adsense-config.js');
                if (!fs.existsSync(configPath)) return null;
                const content = fs.readFileSync(configPath, 'utf8');
                return !content.includes('ca-pub-XXXXXXXXXXXXXXXX');
            }
        }
    ];

    let warnings = 0;

    checks.forEach(({ name, check }) => {
        const result = check();
        if (result === null) {
            console.log(`⚠️  ${name}: 건너뜀`);
        } else if (result) {
            console.log(`✅ ${name}`);
        } else {
            console.log(`❌ ${name}`);
            warnings++;
        }
    });

    if (warnings > 0) {
        console.log(`\n⚠️  ${warnings}개의 경고가 있습니다. 계속 진행하시겠습니까?`);
        console.log(`(배포는 계속되지만, 수익화가 제대로 작동하지 않을 수 있습니다)\n`);
    } else {
        console.log(`\n✅ 모든 체크 통과!\n`);
    }
}

/**
 * 메인 배포 함수
 */
function deploy(projectName, platform) {
    console.log(`\n🚀 배포 프로세스 시작: ${projectName} → ${platform}\n`);

    // 프로젝트 경로 확인
    const projectPath = path.join(CONFIG.projectsDir, projectName);
    if (!fs.existsSync(projectPath)) {
        console.error(`❌ 프로젝트를 찾을 수 없습니다: ${projectName}`);
        console.log(`\n사용 가능한 프로젝트:`);
        if (fs.existsSync(CONFIG.projectsDir)) {
            fs.readdirSync(CONFIG.projectsDir).forEach(p => console.log(`  - ${p}`));
        }
        process.exit(1);
    }

    // 배포 전 체크
    preDeployChecklist(projectPath);

    // 플랫폼별 배포
    switch (platform.toLowerCase()) {
        case 'netlify':
            deployToNetlify(projectPath, projectName);
            break;
        case 'vercel':
            deployToVercel(projectPath, projectName);
            break;
        case 'github':
        case 'github-pages':
            deployToGitHub(projectPath, projectName);
            break;
        default:
            console.error(`❌ 지원하지 않는 플랫폼: ${platform}`);
            console.log(`\n지원 플랫폼: netlify, vercel, github`);
            process.exit(1);
    }
}

// CLI 실행
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length < 2 || args[0] === '--help' || args[0] === '-h') {
        console.log(`
사용법: node deploy.js <프로젝트명> <플랫폼>

플랫폼:
  netlify       - Netlify로 배포 (자동)
  vercel        - Vercel로 배포 (자동)
  github        - GitHub Pages 배포 (안내)

예시:
  node deploy.js my-calculator netlify
  node deploy.js todo-app vercel
  node deploy.js my-game github

옵션:
  --help, -h    이 도움말 표시
        `);
        process.exit(0);
    }

    const projectName = args[0];
    const platform = args[1];

    deploy(projectName, platform);
}

module.exports = { deploy };
