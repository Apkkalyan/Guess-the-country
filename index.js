(async function () {
	const flag = document.getElementById('flag');
	const instructionEl = document.getElementById('instruction');
	const choicesEl = document.getElementById('choices');
	const scoreEl = document.getElementById('score');
	const nextBtn = document.getElementById('nextBtn');
	const messageEl = document.getElementById('message');

	// modal elements (updated)
	const wrongModal = document.getElementById('wrongModal');
	const modalMsg = document.getElementById('modalMsg');
	const modalContinue = document.getElementById('modalContinue');
	const modalRestart = document.getElementById('modalRestart');

	let countries = [];
	let score = 0;
	let currentTarget = null;

	const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];
	const shuffle = arr => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };

	// build flag URL (ensure uppercase alpha-2 code)
	const flagUrl = code => `https://flagsapi.com/${String(code).trim().toUpperCase()}/flat/64.png`;

	// Ensure getCountries is available (provided by countries.js). If not, fall back to small builtin.
	const safeGetCountries = async () => {
		if (typeof window.getCountries === 'function') {
			return await window.getCountries();
		}
		return [
			{ name: "United States", code: "US" },
			{ name: "Canada", code: "CA" },
			{ name: "Germany", code: "DE" },
			{ name: "France", code: "FR" },
			{ name: "Japan", code: "JP" },
		];
	};

	async function start() {
		countries = await safeGetCountries();
		newRound();
	}

	// add onerror fallback so the user sees a placeholder if FlagsAPI fails
	function attachFlagFallback(imgEl) {
		if (!imgEl) return;
		imgEl.addEventListener('error', () => {
			console.warn('Flag failed to load for', imgEl.alt, imgEl.src);
			imgEl.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="256" height="160"><rect width="100%" height="100%" fill="%23eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23888" font-size="16">Flag not available</text></svg>';
		});
	}
	attachFlagFallback(flag);

	// show modal
	function showWrongModal(text) {
		modalMsg.textContent = text;
		wrongModal.classList.remove('hidden');
		wrongModal.setAttribute('aria-hidden', 'false');
		// focus the primary action (continue)
		modalContinue.focus();
	}

	function hideWrongModal() {
		wrongModal.classList.add('hidden');
		wrongModal.setAttribute('aria-hidden', 'true');
	}

	// get how many options to show based on score:
	// score < 10 => 2 options, 10 <= score < 20 => 3 options, score >= 20 => 4 options
	function optionsCountForScore(s) {
		if (s >= 20) return 4;
		if (s >= 10) return 3;
		return 2;
	}

	function newRound() {
		messageEl.textContent = '';
		nextBtn.disabled = true;
		choicesEl.innerHTML = '';

		// decide how many options to show this round
		const optionCount = Math.min(optionsCountForScore(score), 4);
		// pick target and (optionCount - 1) distractors
		const target = pickRandom(countries);
		currentTarget = target;
		const others = countries.filter(c => c.code !== target.code);
		shuffle(others);
		const distractors = others.slice(0, Math.max(0, optionCount - 1));

		// set flag
		flag.src = flagUrl(target.code);
		flag.alt = `Flag of ${target.name}`;

		instructionEl.textContent = 'Which country is this flag?';

		const options = shuffle([target, ...distractors]);
		options.forEach(opt => {
			const btn = document.createElement('button');
			btn.type = 'button';
			btn.className = 'choice-btn';
			btn.textContent = opt.name || '(unknown)';
			btn.dataset.code = opt.code;
			btn.addEventListener('click', onGuess);
			choicesEl.appendChild(btn);
		});
	}

	// persist last score to localStorage
	function saveLastScore() {
		try {
			localStorage.setItem('gtc_last_score', String(score));
		} catch (e) {
			// ignore (e.g. private mode)
		}
	}

	function onGuess(e) {
		const btn = e.currentTarget;
		Array.from(choicesEl.querySelectorAll('button')).forEach(b => b.disabled = true);

		const guessedCode = btn.dataset.code;
		const correctCode = currentTarget.code;
		const correctBtn = Array.from(choicesEl.querySelectorAll('button')).find(b => b.dataset.code === correctCode);

		if (guessedCode === correctCode) {
			btn.classList.add('choice-correct');
			messageEl.textContent = 'Correct!';
			score++;
			scoreEl.textContent = score;
			saveLastScore();

			// auto-advance after a short delay; do NOT show Next
			setTimeout(() => {
				newRound();
			}, 800);

			return;
		} else {
			btn.classList.add('choice-wrong');
			if (correctBtn) correctBtn.classList.add('choice-correct');
			messageEl.textContent = `Wrong — it was ${currentTarget.name}.`;
			// show popup/modal with correct name
			showWrongModal(`Wrong answer. The correct country is ${currentTarget.name}.`);
			// do NOT enable Next here — modal will control continuation
			return;
		}
	}

	// modal "Continue (+1)" adds one point and immediately starts next round
	modalContinue.addEventListener('click', () => {
		score++;
		scoreEl.textContent = score;
		saveLastScore();
		hideWrongModal();
		newRound();
	});

	// modal "Restart" resets score and starts fresh
	modalRestart.addEventListener('click', () => {
		score = 0;
		scoreEl.textContent = score;
		saveLastScore();
		hideWrongModal();
		newRound();
	});

	// support keyboard ESC to close modal
	document.addEventListener('keydown', (ev) => {
		if (ev.key === 'Escape' && !wrongModal.classList.contains('hidden')) {
			hideWrongModal();
		}
	});

	// start
	start();
})();