let idleTimeout = null;

export function startIdleTimer(logoutCallback, minutes = 10) {
    resetIdleTimer(logoutCallback, minutes);

    window.addEventListener("mousemove", () => resetIdleTimer(logoutCallback, minutes));
    window.addEventListener("keypress", () => resetIdleTimer(logoutCallback, minutes));
    window.addEventListener("click", () => resetIdleTimer(logoutCallback, minutes));
}

function resetIdleTimer(logoutCallback, minutes) {
    clearTimeout(idleTimeout);

    idleTimeout = setTimeout(() => {
        logoutCallback();
    }, minutes * 60 * 1000);
}

export function stopIdleTimer() {
    clearTimeout(idleTimeout);

    window.removeEventListener("mousemove", resetIdleTimer);
    window.removeEventListener("keypress", resetIdleTimer);
    window.removeEventListener("click", resetIdleTimer);
}
