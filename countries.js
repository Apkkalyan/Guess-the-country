(function () {
	// Returns Promise<[ {name, code} ]>
	async function fetchRestCountries() {
		try {
			const res = await fetch('https://restcountries.com/v3.1/all');
			if (!res.ok) throw new Error('restcountries failed');
			const data = await res.json();
			const list = data.map(c => {
				const name = c.name && c.name.common;
				const code = c.cca2;
				return (name && code && code.length === 2) ? { name, code: code.toUpperCase() } : null;
			}).filter(Boolean);
			if (list.length < 10) throw new Error('not enough countries');
			return list;
		} catch (e) {
			return null;
		}
	}

	async function fetchFromCopiedHTML() {
		try {
			const res = await fetch('ccopiedhtml.html');
			if (!res.ok) throw new Error('no ccopiedhtml');
			const text = await res.text();
			const parser = new DOMParser();
			const doc = parser.parseFromString(text, 'text/html');
			const items = Array.from(doc.querySelectorAll('.item_country'));
			const list = items.map(it => {
				const codeEl = it.querySelector('p.mb0.bold');
				let code = codeEl ? codeEl.textContent.trim() : '';
				let name = '';
				if (codeEl && codeEl.nextElementSibling) name = codeEl.nextElementSibling.textContent.trim();
				if (!code) {
					const img = it.querySelector('img');
					if (img && img.src) {
						const m = img.src.match(/flagsapi\.com\/([A-Z]{2})\/?/i);
						if (m) code = m[1].toUpperCase();
					}
				}
				if (!name) {
					const p = it.querySelectorAll('p');
					for (const el of p) {
						if (!el.classList.contains('mb0') && el.textContent.trim()) { name = el.textContent.trim(); break; }
					}
				}
				return (name && code) ? { name, code: code.toUpperCase() } : null;
			}).filter(Boolean);
			return list.length ? list : null;
		} catch (e) {
			return null;
		}
	}

	const LOCAL_FALLBACK = [
		{ name: "Andorra", code: "AD" },
		{ name: "United Arab Emirates", code: "AE" },
		{ name: "Afghanistan", code: "AF" },
		{ name: "Antigua and Barbuda", code: "AG" },
		{ name: "Anguilla", code: "AI" },
		{ name: "", code: "AH" },
		{ name: "", code: "AK" },
		{ name: "Albania", code: "AL" },
		{ name: "Armenia", code: "AM" },
		{ name: "Netherlands Antilles", code: "AN" },
		{ name: "Angola", code: "AO" },
		{ name: "Antarctica", code: "AQ" },
		{ name: "Argentina", code: "AR" },
		{ name: "American Samoa", code: "AS" },
		{ name: "Austria", code: "AT" },
		{ name: "Australia", code: "AU" },
		{ name: "Aruba", code: "AW" },
		{ name: "Åland Islands", code: "AX" },
		{ name: "Azerbaijan", code: "AZ" },
		{ name: "Bosnia and Herzegovina", code: "BA" },
		{ name: "Barbados", code: "BB" },
		{ name: "Bangladesh", code: "BD" },
		{ name: "Belgium", code: "BE" },
		{ name: "Burkina Faso", code: "BF" },
		{ name: "Bulgaria", code: "BG" },
		{ name: "Bahrain", code: "BH" },
		{ name: "Burundi", code: "BI" },
		{ name: "Benin", code: "BJ" },
		{ name: "Saint Barthélemy", code: "BL" },
		{ name: "Bermuda", code: "BM" },
		{ name: "Brunei Darussalam", code: "BN" },
		{ name: "Bolivia", code: "BO" },
		{ name: "Bonaire, Sint Eustatius and Saba", code: "BQ" },
		{ name: "Brazil", code: "BR" },
		{ name: "Bahamas", code: "BS" },
		{ name: "Bhutan", code: "BT" },
		{ name: "Bouvet Island", code: "BV" },
		{ name: "Botswana", code: "BW" },
		{ name: "Belarus", code: "BY" },
		{ name: "Belize", code: "BZ" },
		{ name: "Canada", code: "CA" },
		{ name: "Cocos (Keeling) Islands", code: "CC" },
		{ name: "Congo, The Democratic Republic Of The", code: "CD" },
		{ name: "Central African Republic", code: "CF" },
		{ name: "Congo", code: "CG" },
		{ name: "Switzerland", code: "CH" },
		{ name: "Côte D'Ivoire", code: "CI" },
		{ name: "Cook Islands", code: "CK" },
		{ name: "Chile", code: "CL" },
		{ name: "Cameroon", code: "CM" },
		{ name: "China", code: "CN" },
		{ name: "Colombia", code: "CO" },
		{ name: "Costa Rica", code: "CR" },
		{ name: "Cuba", code: "CU" },
		{ name: "Cape Verde", code: "CV" },
		{ name: "Curaçao", code: "CW" },
		{ name: "Christmas Island", code: "CX" },
		{ name: "Cyprus", code: "CY" },
		{ name: "Czech Republic", code: "CZ" },
		{ name: "Germany", code: "DE" },
		{ name: "Djibouti", code: "DJ" },
		{ name: "Denmark", code: "DK" },
		{ name: "Dominica", code: "DM" },
		{ name: "Dominican Republic", code: "DO" },
		{ name: "Algeria", code: "DZ" },
		{ name: "Ecuador", code: "EC" },
		{ name: "Estonia", code: "EE" },
		{ name: "Egypt", code: "EG" },
		{ name: "Western Sahara", code: "EH" },
		{ name: "Eritrea", code: "ER" },
		{ name: "Spain", code: "ES" },
		{ name: "Ethiopia", code: "ET" },
		{ name: "", code: "EU" },
		{ name: "Finland", code: "FI" },
		{ name: "Fiji", code: "FJ" },
		{ name: "Falkland Islands (Malvinas)", code: "FK" },
		{ name: "Micronesia, Federated States Of", code: "FM" },
		{ name: "Faroe Islands", code: "FO" },
		{ name: "France", code: "FR" },
		{ name: "Gabon", code: "GA" },
		{ name: "United Kingdom", code: "GB" },
		{ name: "Grenada", code: "GD" },
		{ name: "Georgia", code: "GE" },
		{ name: "French Guiana", code: "GF" },
		{ name: "Guernsey", code: "GG" },
		{ name: "Ghana", code: "GH" },
		{ name: "Gibraltar", code: "GI" },
		{ name: "Greenland", code: "GL" },
		{ name: "Gambia", code: "GM" },
		{ name: "Guinea", code: "GN" },
		{ name: "Guadeloupe", code: "GP" },
		{ name: "Equatorial Guinea", code: "GQ" },
		{ name: "Greece", code: "GR" },
		{ name: "South Georgia and the South Sandwich Islands", code: "GS" },
		{ name: "Guatemala", code: "GT" },
		{ name: "Guam", code: "GU" },
		{ name: "Guinea-Bissau", code: "GW" },
		{ name: "Guyana", code: "GY" },
		{ name: "Hong Kong", code: "HK" },
		{ name: "Heard and McDonald Islands", code: "HM" },
		{ name: "Honduras", code: "HN" },
		{ name: "Croatia", code: "HR" },
		{ name: "Haiti", code: "HT" },
		{ name: "Hungary", code: "HU" },
		{ name: "", code: "IC" },
		{ name: "Indonesia", code: "ID" },
		{ name: "Ireland", code: "IE" },
		{ name: "Israel", code: "IL" },
		{ name: "Isle of Man", code: "IM" },
		{ name: "India", code: "IN" },
		{ name: "British Indian Ocean Territory", code: "IO" },
		{ name: "Iraq", code: "IQ" },
		{ name: "Iran, Islamic Republic Of", code: "IR" },
		{ name: "Iceland", code: "IS" },
		{ name: "Italy", code: "IT" },
		{ name: "Jersey", code: "JE" },
		{ name: "Jamaica", code: "JM" },
		{ name: "Jordan", code: "JO" },
		{ name: "Japan", code: "JP" },
		{ name: "Kenya", code: "KE" },
		{ name: "Kyrgyzstan", code: "KG" },
		{ name: "Cambodia", code: "KH" },
		{ name: "Kiribati", code: "KI" },
		{ name: "Comoros", code: "KM" },
		{ name: "Saint Kitts And Nevis", code: "KN" },
		{ name: "Korea, Democratic People's Republic Of", code: "KP" },
		{ name: "Korea, Republic of", code: "KR" },
		{ name: "Kuwait", code: "KW" },
		{ name: "Cayman Islands", code: "KY" },
		{ name: "Kazakhstan", code: "KZ" },
		{ name: "Lao People's Democratic Republic", code: "LA" },
		{ name: "Lebanon", code: "LB" },
		{ name: "Saint Lucia", code: "LC" },
		{ name: "Liechtenstein", code: "LI" },
		{ name: "Sri Lanka", code: "LK" },
		{ name: "Liberia", code: "LR" },
		{ name: "Lesotho", code: "LS" },
		{ name: "Lithuania", code: "LT" },
		{ name: "Luxembourg", code: "LU" },
		{ name: "Latvia", code: "LV" },
		{ name: "Libya", code: "LY" },
		{ name: "Morocco", code: "MA" },
		{ name: "Monaco", code: "MC" },
		{ name: "Moldova, Republic of", code: "MD" },
		{ name: "Montenegro", code: "ME" },
		{ name: "Saint Martin", code: "MF" },
		{ name: "Madagascar", code: "MG" },
		{ name: "Marshall Islands", code: "MH" },
		{ name: "Macedonia, the Former Yugoslav Republic Of", code: "MK" },
		{ name: "Mali", code: "ML" },
		{ name: "Myanmar", code: "MM" },
		{ name: "Mongolia", code: "MN" },
		{ name: "Macao", code: "MO" },
		{ name: "Northern Mariana Islands", code: "MP" },
		{ name: "Martinique", code: "MQ" },
		{ name: "Mauritania", code: "MR" },
		{ name: "Montserrat", code: "MS" },
		{ name: "Malta", code: "MT" },
		{ name: "Mauritius", code: "MU" },
		{ name: "Maldives", code: "MV" },
		{ name: "Malawi", code: "MW" },
		{ name: "Mexico", code: "MX" },
		{ name: "Malaysia", code: "MY" },
		{ name: "Mozambique", code: "MZ" },
		{ name: "Namibia", code: "NA" },
		{ name: "New Caledonia", code: "NC" },
		{ name: "Niger", code: "NE" },
		{ name: "Norfolk Island", code: "NF" },
		{ name: "Nigeria", code: "NG" },
		{ name: "Nicaragua", code: "NI" },
		{ name: "Netherlands", code: "NL" },
		{ name: "Norway", code: "NO" },
		{ name: "Nepal", code: "NP" },
		{ name: "Nauru", code: "NR" },
		{ name: "Niue", code: "NU" },
		{ name: "", code: "NY" },
		{ name: "New Zealand", code: "NZ" },
		{ name: "Oman", code: "OM" },
		{ name: "Panama", code: "PA" },
		{ name: "Peru", code: "PE" },
		{ name: "French Polynesia", code: "PF" },
		{ name: "Papua New Guinea", code: "PG" },
		{ name: "Philippines", code: "PH" },
		{ name: "Pakistan", code: "PK" },
		{ name: "Poland", code: "PL" },
		{ name: "Saint Pierre And Miquelon", code: "PM" },
		{ name: "Pitcairn", code: "PN" },
		{ name: "Puerto Rico", code: "PR" },
		{ name: "Palestine, State of", code: "PS" },
		{ name: "Portugal", code: "PT" },
		{ name: "Palau", code: "PW" },
		{ name: "Paraguay", code: "PY" },
		{ name: "Qatar", code: "QA" },
		{ name: "Réunion", code: "RE" },
		{ name: "Romania", code: "RO" },
		{ name: "Serbia", code: "RS" },
		{ name: "Russian Federation", code: "RU" },
		{ name: "Rwanda", code: "RW" },
		{ name: "Saudi Arabia", code: "SA" },
		{ name: "Solomon Islands", code: "SB" },
		{ name: "Seychelles", code: "SC" },
		{ name: "Sudan", code: "SD" },
		{ name: "Sweden", code: "SE" },
		{ name: "Singapore", code: "SG" },
		{ name: "Saint Helena", code: "SH" },
		{ name: "Slovenia", code: "SI" },
		{ name: "Svalbard And Jan Mayen", code: "SJ" },
		{ name: "Slovakia", code: "SK" },
		{ name: "Sierra Leone", code: "SL" },
		{ name: "San Marino", code: "SM" },
		{ name: "Senegal", code: "SN" },
		{ name: "Somalia", code: "SO" },
		{ name: "Suriname", code: "SR" },
		{ name: "South Sudan", code: "SS" },
		{ name: "Sao Tome and Principe", code: "ST" },
		{ name: "El Salvador", code: "SV" },
		{ name: "Sint Maarten", code: "SX" },
		{ name: "Syrian Arab Republic", code: "SY" },
		{ name: "Swaziland", code: "SZ" },
		{ name: "Turks and Caicos Islands", code: "TC" },
		{ name: "Chad", code: "TD" },
		{ name: "French Southern Territories", code: "TF" },
		{ name: "Togo", code: "TG" },
		{ name: "Thailand", code: "TH" },
		{ name: "Tajikistan", code: "TJ" },
		{ name: "Tokelau", code: "TK" },
		{ name: "Timor-Leste", code: "TL" },
		{ name: "Turkmenistan", code: "TM" },
		{ name: "Tunisia", code: "TN" },
		{ name: "Tonga", code: "TO" },
		{ name: "Turkey", code: "TR" },
		{ name: "Trinidad and Tobago", code: "TT" },
		{ name: "Tuvalu", code: "TV" },
		{ name: "Taiwan, Republic Of China", code: "TW" },
		{ name: "Tanzania, United Republic of", code: "TZ" },
		{ name: "Ukraine", code: "UA" },
		{ name: "Uganda", code: "UG" },
		{ name: "United States Minor Outlying Islands", code: "UM" },
		{ name: "United States", code: "US" },
		{ name: "Uruguay", code: "UY" },
		{ name: "Uzbekistan", code: "UZ" },
		{ name: "Holy See (Vatican City State)", code: "VA" },
		{ name: "Saint Vincent And The Grenadines", code: "VC" },
		{ name: "Venezuela, Bolivarian Republic of", code: "VE" },
		{ name: "Virgin Islands, British", code: "VG" },
		{ name: "Virgin Islands, U.S.", code: "VI" },
		{ name: "Vietnam", code: "VN" },
		{ name: "Vanuatu", code: "VU" },
		{ name: "Wallis and Futuna", code: "WF" },
		{ name: "Samoa", code: "WS" },
		{ name: "", code: "XK" },
		{ name: "Yemen", code: "YE" },
		{ name: "Mayotte", code: "YT" },
		{ name: "South Africa", code: "ZA" },
		{ name: "Zambia", code: "ZM" },
		{ name: "Zimbabwe", code: "ZW" }
	];

	// Expose a single function on window for simplicity in the browser environment.
	window.getCountries = async function getCountries() {
		// Try REST API
		const fromRest = await fetchRestCountries();
		if (fromRest) return fromRest;
		// Try parsing the local HTML copy you provided
		const fromHtml = await fetchFromCopiedHTML();
		if (fromHtml) return fromHtml;
		// Fallback
		return LOCAL_FALLBACK;
	};
})();
