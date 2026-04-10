"use strict";!function(){const e=document.getElementById("loading-page-message");e&&(e.textContent="Loading the app…"),document.getElementById("loading-reload")?.addEventListener("click",(()=>location.reload()));const t=()=>{const e=document.getElementById("loading-reload");e&&(e.style.visibility="visible")},n=setTimeout((()=>{const e=document.getElementById("loading-slow");e&&(e.style.visibility="visible"),t()}),5e3),o=o=>{if(!e)return;e.textContent="An error has occurred that prevented the client from loading correctly.";const r=document.createElement("summary");r.textContent="More details";const i=document.createElement("pre");i.textContent=o.message;const s=document.createElement("p");s.textContent="Open the developer tools of your browser for more information.";const a=document.createElement("details");a.appendChild(r),a.appendChild(i),a.appendChild(s),e.parentNode?.insertBefore(a,e.nextSibling),window.clearTimeout(n),t()};window.addEventListener("error",o),window.g_TheLoungeRemoveLoading=()=>{delete window.g_TheLoungeRemoveLoading,window.clearTimeout(n),window.removeEventListener("error",o),document.getElementById("loading")?.remove()};try{const e=JSON.parse(localStorage.getItem("settings")||"{}"),t=document.getElementById("theme");if(!t)return;if("string"==typeof e.theme&&t?.dataset.serverTheme!==e.theme&&t.setAttribute("href",`themes/${e.theme}.css`),"string"==typeof e.userStyles&&!/[?&]nocss/.test(window.location.search)){const t=document.getElementById("user-specified-css");if(!t)return;t.innerHTML=e.userStyles}}catch(e){}if("serviceWorker"in navigator){navigator.serviceWorker.register("service-worker.js");const e=t=>{"fetch-error"===t.data.type&&(o({message:`Service worker failed to fetch an url: ${t.data.message}`}),navigator.serviceWorker.removeEventListener("message",e))};navigator.serviceWorker.addEventListener("message",e)}}();
/* UI Management and Localization Sync */
(function() {
    function applyOmegaMakeover() {
        // Localization: Set labels to Indonesian
        const labels = document.querySelectorAll('label[for="connect:nick"]');
        labels.forEach(l => {
            if (l.innerText !== 'Nama') l.innerText = 'Nama';
        });

        // UI Component: Standardize connection button text
        const buttons = document.querySelectorAll('.connect button, #connect');
        buttons.forEach(b => {
             // Use textContent to reach through potential child spans
             if (b.innerText !== 'MASUK') b.innerText = 'MASUK';
        });

        // Input Management: Set placeholders and clear default values
        const nickInput = document.getElementById('connect:nick');
        if (nickInput) {
            if (!nickInput.placeholder) nickInput.placeholder = 'Masukkan Nama Anda...';
            if (nickInput.value === 'thelounge') nickInput.value = ''; // Initialize empty connection state if default is detected
            // Remove pattern that blocks spaces in nicknames if they want to type freely
            if (nickInput.hasAttribute('pattern')) nickInput.removeAttribute('pattern');
        }

        // Layout Management: Hide non-essential UI elements
        const clutter = document.querySelectorAll('.connect h1, .connect h2, .connect .section-header');
        clutter.forEach(c => { c.style.setProperty('display', 'none', 'important'); });
        
        // Hide all rows except the Nick and Button rows
        const rows = document.querySelectorAll('.connect-row');
        rows.forEach(row => {
            if (row.querySelector('#connect\\:nick') || row.querySelector('button')) {
                row.style.setProperty('display', 'block', 'important');
            } else {
                row.style.setProperty('display', 'none', 'important');
            }
        });
    }

    // Run frequently to stay ahead of SPA state changes
    setInterval(applyOmegaMakeover, 200);

    // Credential Sync: Map nickname to internal username field
    window.addEventListener('input', (e) => {
        if (e.target && e.target.id === 'connect:nick') {
            const u = document.getElementById('connect:username');
            if (u) {
                // Synchronize nickname to username (ident): lowercase, no spaces
                u.value = e.target.value.trim().replace(/\s+/g, '_').toLowerCase();
            }
        }
    });

    console.log("UI Sync Engine Initialized");
})();
