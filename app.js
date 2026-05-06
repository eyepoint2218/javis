const clock = document.getElementById('clock');
const statusText = document.getElementById('system-status');
const messages = document.getElementById('messages');
const form = document.getElementById('command-form');
const input = document.getElementById('command-input');

function renderMessage(role, text) {
  const item = document.createElement('div');
  item.className = `message ${role}`;
  item.textContent = text;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}

function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString('ko-KR', { hour12: false });
}

function getJarvisReply(commandRaw) {
  const command = commandRaw.toLowerCase().trim();
  const now = new Date();

  if (command.includes('시간')) {
    return `현재 시간은 ${now.toLocaleTimeString('ko-KR', { hour12: false })} 입니다.`;
  }

  if (command.includes('날짜')) {
    return `오늘 날짜는 ${now.toLocaleDateString('ko-KR')} 입니다.`;
  }

  if (command.startsWith('계산')) {
    const expression = commandRaw.replace(/계산/i, '').trim();
    try {
      if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
        throw new Error('허용되지 않은 수식');
      }
      const value = Function(`"use strict"; return (${expression})`)();
      return `${expression} = ${value}`;
    } catch {
      return '수식을 이해하지 못했습니다. 예: 계산 15*3';
    }
  }

  if (command.includes('추천') || command.includes('할 일')) {
    const todo = [
      '오늘 목표 3개를 10분 안에 정리해보세요.',
      '25분 집중 + 5분 휴식 사이클을 2회 실행해보세요.',
      '운동 20분 또는 산책으로 에너지 리셋을 해보세요.'
    ];
    return `추천: ${todo[Math.floor(Math.random() * todo.length)]}`;
  }

  return '명령을 분석했습니다. 시간/날짜/계산/추천 관련 질문을 해보세요.';
}

function handleCommand(text) {
  renderMessage('user', text);
  statusText.textContent = '명령 처리 중';

  setTimeout(() => {
    const reply = getJarvisReply(text);
    renderMessage('assistant', reply);
    statusText.textContent = '대기 중';
  }, 300);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  handleCommand(text);
  input.value = '';
  input.focus();
});

document.querySelectorAll('[data-command]').forEach((button) => {
  button.addEventListener('click', () => handleCommand(button.dataset.command));
});

updateClock();
setInterval(updateClock, 1000);
renderMessage('assistant', '안녕하세요. J.A.R.V.I.S 웹 프로토타입이 준비되었습니다.');
