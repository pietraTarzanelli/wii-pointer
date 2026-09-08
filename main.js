"use strict";

let lastScreenId = "";
let lastPlayer = 0;

function cfg(key, fallback) {
    return String(readConfig(key, fallback));
}

function enabled() {
    const v = cfg("enabled", "true").toLowerCase();
    return ["true", "1", "yes", "on"].includes(v);
}

function matches(screen, player) {
    const manufacturer = cfg(`p${player}_manufacturer`, "");
    const model = cfg(`p${player}_model`, "");
    const serial = cfg(`p${player}_serial`, "");

    if (!manufacturer && !model && !serial)
        return false;

    if (manufacturer && String(screen.manufacturer) !== manufacturer)
        return false;

    if (model && String(screen.model) !== model)
        return false;

    if (serial && String(screen.serialNumber) !== serial)
        return false;

    return true;
}

function playerForScreen(screen) {
    for (let p = 1; p <= 4; ++p) {
        if (matches(screen, p))
            return p;
    }

    return 0;
}

function physicalScreenId(screen) {
    return [
        String(screen.manufacturer),
        String(screen.model),
        String(screen.serialNumber)
    ].join("|");
}

function applyPlayer(player) {
    if (player === 0 || player === lastPlayer)
        return;

    print("Wii Cursor Monitor: cambio a Player", player);

    callDBus(
        "org.freedesktop.systemd1",
        "/org/freedesktop/systemd1",
        "org.freedesktop.systemd1.Manager",
        "StartUnit",
        `wii-cursor-player@${player}.service`,
        "replace",
        function(reply) {
            print("Wii Cursor Monitor: systemd Player", player, "avviato");
        }
    );

    lastPlayer = player;
}

function checkScreen() {
    if (!enabled())
        return;

    const screen = workspace.screenAt(workspace.cursorPos);

    if (!screen)
        return;

    const id = physicalScreenId(screen);

    if (id === lastScreenId)
        return;

    lastScreenId = id;

    print(
        "Wii Cursor Monitor: monitor =",
        screen.manufacturer,
        "/",
        screen.model
    );

    const player = playerForScreen(screen);

    if (player !== 0)
        applyPlayer(player);
}

workspace.cursorPosChanged.connect(checkScreen);

checkScreen();

print("Wii Cursor Monitor: ATTIVO");
