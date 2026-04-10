// Nickname Management and Validation Script
(function() {
    const cleanNick = () => {
        const nickInput = document.getElementById("connect:nick");
        if (nickInput) {
            // Reset default nickname if it matches system default "thelounge"
            if (nickInput.value === "thelounge") {
                nickInput.value = "";
            }
            // Initialize placeholder text if not present
            if (!nickInput.getAttribute("placeholder")) {
                nickInput.setAttribute("placeholder", "Masukkan nama panggilan kamu...");
            }
        }
    };
    // Periodically sync UI state to ensure consistency
    setInterval(cleanNick, 100);
})();
