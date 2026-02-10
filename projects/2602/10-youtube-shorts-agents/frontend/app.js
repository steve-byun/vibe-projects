// Shorts Factory - Frontend Controller

const API_BASE = '';
let currentJobId = null;
let eventSource = null;
let startTime = null;
let timerInterval = null;

// DOM Elements
const topicInput = document.getElementById('topic');
const styleSelect = document.getElementById('style');
const durationSelect = document.getElementById('duration');
const generateBtn = document.getElementById('generateBtn');
const pipelineSection = document.getElementById('pipelineSection');
const resultSection = document.getElementById('resultSection');
const errorSection = document.getElementById('errorSection');
const elapsedTimeEl = document.getElementById('elapsedTime');

// Settings
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeModal = document.getElementById('closeModal');
const saveSettings = document.getElementById('saveSettings');

// Event Listeners
generateBtn.addEventListener('click', startGeneration);
settingsBtn.addEventListener('click', openSettings);
closeModal.addEventListener('click', () => settingsModal.classList.add('hidden'));
saveSettings.addEventListener('click', saveSettingsHandler);
document.getElementById('openFolderBtn').addEventListener('click', openFolder);
document.getElementById('newBtn').addEventListener('click', resetUI);
document.getElementById('retryBtn').addEventListener('click', () => {
    resetUI();
    startGeneration();
});

// Allow Ctrl+Enter to submit
topicInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') startGeneration();
});

async function startGeneration() {
    const topic = topicInput.value.trim();
    if (!topic) {
        topicInput.focus();
        return;
    }

    // Disable input
    generateBtn.disabled = true;
    generateBtn.textContent = '생성 중...';

    // Show pipeline, hide others
    pipelineSection.classList.remove('hidden');
    resultSection.classList.add('hidden');
    errorSection.classList.add('hidden');

    // Reset agent states
    document.querySelectorAll('.agent-node').forEach(node => {
        node.className = 'agent-node waiting';
        node.querySelector('.agent-message').textContent = '대기 중';
    });

    // Start timer
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 100);

    try {
        const response = await fetch(`${API_BASE}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topic: topic,
                style: styleSelect.value,
                duration_target: parseInt(durationSelect.value)
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        currentJobId = data.job_id;
        connectSSE(currentJobId);
    } catch (err) {
        showError(err.message);
    }
}

function connectSSE(jobId) {
    if (eventSource) eventSource.close();

    eventSource = new EventSource(`${API_BASE}/generate/${jobId}/stream`);

    eventSource.addEventListener('progress', (e) => {
        const data = JSON.parse(e.data);
        updateAgentStatus(data.agent, data.status, data.message);
    });

    eventSource.addEventListener('complete', (e) => {
        const result = JSON.parse(e.data);
        showResult(result);
        cleanup();
    });

    eventSource.addEventListener('error', (e) => {
        try {
            const data = JSON.parse(e.data);
            showError(data.message);
        } catch {
            // SSE connection error
            if (eventSource.readyState === EventSource.CLOSED) {
                showError('서버 연결이 끊어졌습니다');
            }
        }
        cleanup();
    });
}

function updateAgentStatus(agent, status, message) {
    const node = document.getElementById(`agent-${agent}`);
    if (!node) return;

    node.className = `agent-node ${status}`;
    const msgEl = node.querySelector('.agent-message');
    if (msgEl) msgEl.textContent = message;
}

function showResult(result) {
    resultSection.classList.remove('hidden');

    // Video
    const video = document.getElementById('resultVideo');
    if (result.video_url) {
        video.src = result.video_url;
    }

    // Meta
    document.getElementById('resultTitle').textContent = result.title || 'Untitled';
    document.getElementById('resultDuration').textContent =
        `${(result.duration || 0).toFixed(1)}초`;
    document.getElementById('resultSize').textContent =
        `${((result.file_size || 0) / 1024 / 1024).toFixed(1)}MB`;

    // Hashtags
    const hashtagsEl = document.getElementById('resultHashtags');
    hashtagsEl.innerHTML = '';
    (result.hashtags || []).forEach(tag => {
        const span = document.createElement('span');
        span.className = 'hashtag';
        span.textContent = tag;
        hashtagsEl.appendChild(span);
    });

    // Script
    if (result.script) {
        document.getElementById('resultScript').textContent =
            result.script.full_script || '';
    }

    // Download
    const downloadBtn = document.getElementById('downloadBtn');
    if (result.video_url) {
        downloadBtn.href = result.video_url;
        downloadBtn.download = `${result.title || 'shorts'}.mp4`;
    }
}

function showError(message) {
    errorSection.classList.remove('hidden');
    document.getElementById('errorMessage').textContent = message;
    cleanup();
}

function cleanup() {
    if (eventSource) {
        eventSource.close();
        eventSource = null;
    }
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    generateBtn.disabled = false;
    generateBtn.textContent = '생성하기';
}

function resetUI() {
    pipelineSection.classList.add('hidden');
    resultSection.classList.add('hidden');
    errorSection.classList.add('hidden');
    cleanup();
}

function updateTimer() {
    if (!startTime) return;
    const elapsed = (Date.now() - startTime) / 1000;
    const min = Math.floor(elapsed / 60);
    const sec = Math.floor(elapsed % 60);
    elapsedTimeEl.textContent = `경과 시간: ${min}:${sec.toString().padStart(2, '0')}`;
}

async function openSettings() {
    settingsModal.classList.remove('hidden');
    try {
        const res = await fetch(`${API_BASE}/config`);
        const cfg = await res.json();
        document.getElementById('aiProvider').value = cfg.ai_provider || 'gemini';
        document.getElementById('geminiKey').value = cfg.gemini_api_key || '';
        document.getElementById('anthropicKey').value = cfg.anthropic_api_key || '';
        document.getElementById('pexelsKey').value = cfg.pexels_api_key || '';
        toggleProviderKeys();
    } catch (e) {
        console.error('Failed to load config:', e);
    }
}

function toggleProviderKeys() {
    const provider = document.getElementById('aiProvider').value;
    document.getElementById('geminiKeyGroup').classList.toggle('hidden', provider !== 'gemini');
    document.getElementById('anthropicKeyGroup').classList.toggle('hidden', provider !== 'claude');
}

async function saveSettingsHandler() {
    const data = {
        ai_provider: document.getElementById('aiProvider').value,
        gemini_api_key: document.getElementById('geminiKey').value,
        anthropic_api_key: document.getElementById('anthropicKey').value,
        pexels_api_key: document.getElementById('pexelsKey').value
    };

    try {
        const res = await fetch(`${API_BASE}/config`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (result.status === 'ok') {
            settingsModal.classList.add('hidden');
        }
    } catch (e) {
        console.error('Failed to save config:', e);
    }
}

async function openFolder() {
    try {
        await fetch(`${API_BASE}/open-folder`, { method: 'POST' });
    } catch (e) {
        console.error('Failed to open folder:', e);
    }
}
