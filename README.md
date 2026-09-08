# Wii Pointer Monitor Switcher

Script per **KDE Plasma / KWin** che permette di utilizzare automaticamente un diverso tema del cursore Wii Pointer in base al monitor sul quale si trova il cursore.

Il progetto è pensato principalmente per configurazioni multi-monitor in cui ogni schermo deve utilizzare un **Wii Pointer diverso**.

## ✨ Funzionalità

* Rileva il monitor sul quale si trova il cursore.
* Associa ogni monitor a un Wii Pointer specifico.
* Cambia automaticamente il tema del cursore quando il puntatore passa da un monitor all'altro.
* Supporta più pointer, ad esempio:

  * Wii Pointer
  * Wii Pointer Player 2
  * Wii Pointer Player 3
  * Wii Pointer Player 4
* Utilizza un **KWin Script**, quindi il cambio viene gestito direttamente da KDE Plasma.

---

# 📋 Requirements

## Software

* **KDE Plasma**
* **KWin**
* Sessione **Wayland** consigliata
* `kpackagetool6` per installare il KWin Script
* `kreadconfig6` / strumenti KDE eventualmente utilizzati dalla configurazione

## Hardware

Non sono richiesti componenti hardware particolari.

Il progetto funziona con qualsiasi configurazione di monitor che venga correttamente rilevata da KDE/KWin.

---

# 🖥️ Compatibilità

### KDE Plasma + KWin

**Supportato.**

È l'ambiente per cui il progetto è stato sviluppato e testato.

### KDE Plasma Wayland

**Supportato.**

È l'ambiente consigliato.

### KDE Plasma X11

**Potenzialmente compatibile**, ma il comportamento può differire a seconda della gestione dei cursori e della versione di Plasma/KWin.

### GNOME

**Non supportato direttamente.**

Il progetto utilizza le API e il sistema di scripting di **KWin**, quindi non può essere utilizzato come KWin Script su GNOME.

### XFCE / Cinnamon / MATE / altri Desktop Environment

**Non supportati direttamente.**

Il codice dipende da KWin e non è quindi uno script generico per Linux.

### Altri window manager Wayland

Non supportati direttamente.

Potrebbero essere necessari adattamenti specifici per il window manager utilizzato.

---

# 📁 Struttura delle cartelle

Il KWin Script deve essere installato nella directory:

```text
~/.local/share/kwin/scripts/wii-cursor-monitor/
```

La struttura deve essere:

```text
~/.local/share/kwin/scripts/wii-cursor-monitor/
├── metadata.json
└── contents/
    └── code/
        └── main.js
```

La configurazione dei monitor si trova invece in:

```text
~/.config/wii-cursor-monitor.conf
```

I temi dei cursori vengono installati in:

```text
~/.icons/
```

Ad esempio:

```text
~/.icons/Wii Pointer/
~/.icons/Wii Pointer Player 2/
~/.icons/Wii Pointer Player 3/
~/.icons/Wii Pointer Player 4/
```

---

# 📦 Installazione

## 1. Installare i temi dei cursori

Copia le cartelle dei pointer in:

```bash
mkdir -p ~/.icons
```

Poi copia:

```text
Wii Pointer/
Wii Pointer Player 2/
Wii Pointer Player 3/
Wii Pointer Player 4/
```

all'interno di:

```text
~/.icons/
```

Il risultato dovrebbe essere:

```text
~/.icons/Wii Pointer/
~/.icons/Wii Pointer Player 2/
~/.icons/Wii Pointer Player 3/
~/.icons/Wii Pointer Player 4/
```

---

## 2. Installare il KWin Script

Crea la directory:

```bash
mkdir -p ~/.local/share/kwin/scripts/wii-cursor-monitor/contents/code
```

Copia quindi i file del progetto:

```text
metadata.json
contents/code/main.js
```

rispettivamente in:

```text
~/.local/share/kwin/scripts/wii-cursor-monitor/metadata.json
```

e:

```text
~/.local/share/kwin/scripts/wii-cursor-monitor/contents/code/main.js
```

---

## 3. Installare la configurazione

Copia:

```text
wii-cursor-monitor.conf
```

in:

```text
~/.config/wii-cursor-monitor.conf
```

Creazione manuale della directory:

```bash
mkdir -p ~/.config
```

---

# ⚙️ Abilitare lo script

Dopo aver copiato i file, installa il pacchetto KWin:

```bash
kpackagetool6 --type KWin/Script -i ~/.local/share/kwin/scripts/wii-cursor-monitor/
```

Se lo script è già installato e vuoi aggiornarlo:

```bash
kpackagetool6 --type KWin/Script -u ~/.local/share/kwin/scripts/wii-cursor-monitor/
```

Poi abilitalo con:

```bash
kwriteconfig6 --file kwinrc --group Plugins --key wii-cursor-monitorEnabled true
```

Infine riavvia KWin oppure riavvia la sessione KDE.

Su Wayland, il metodo più semplice e affidabile è generalmente **disconnettersi e accedere nuovamente**.

---

# 🔍 Verificare l'installazione

Controlla che il pacchetto sia presente:

```bash
kpackagetool6 --type KWin/Script --list
```

Controlla che i file esistano:

```bash
ls -l ~/.local/share/kwin/scripts/wii-cursor-monitor/
```

e:

```bash
ls -l ~/.local/share/kwin/scripts/wii-cursor-monitor/contents/code/
```

Dovresti vedere:

```text
metadata.json
main.js
```

---

# 🖥️ Identificare i monitor

Per configurare correttamente il cambio pointer è necessario conoscere gli identificatori utilizzati da KDE/KWin.

È possibile controllare i monitor con:

```bash
kscreen-doctor -o
```

Esempio:

```text
Output: 1 eDP-1
Output: 2 HDMI-A-1
Output: 3 DP-1
```

Ulteriori informazioni possono essere ottenute con:

```bash
kscreen-doctor -o
```

Il file di configurazione deve utilizzare gli identificatori previsti dal codice del progetto.

---

# 🖱️ Configurazione dei Pointer

La configurazione associa un monitor a un tema:

```text
Monitor → Pointer
```

Esempio concettuale:

```text
eDP-1 → Wii Pointer
HDMI-A-1 → Wii Pointer Player 2
DP-1 → Wii Pointer Player 3
```

I nomi devono corrispondere alle directory presenti in:

```text
~/.icons/
```

---

# 🔗 Pointer personalizzati

Il progetto può utilizzare anche symlink all'interno delle directory `cursors`.

Esempio:

```bash
cd ~/.icons/'Wii Pointer Player 2'/cursors
```

Un cursore può essere sostituito creando un collegamento:

```bash
ln -sf nome-cursore-glow link
```

In questo modo è possibile utilizzare un'immagine/cursore personalizzato senza modificare l'intero tema.

---

# 🧪 Debug

Per controllare eventuali messaggi generati da KWin:

```bash
journalctl --user -f
```

Per filtrare i messaggi relativi allo scripting/KWin:

```bash
journalctl --user -f | grep -Ei 'kwin|script|cursor|pointer'
```

Questo è particolarmente utile quando il cursore non cambia passando da un monitor all'altro.

---

# 🔄 Dopo aver modificato `main.js`

Dopo una modifica al codice:

```bash
kpackagetool6 --type KWin/Script -u ~/.local/share/kwin/scripts/wii-cursor-monitor/
```

Successivamente riavvia la sessione KDE se KWin non ricarica automaticamente lo script.

---

# 🗑️ Disinstallazione

Per rimuovere il KWin Script:

```bash
kpackagetool6 --type KWin/Script -r wii-cursor-monitor
```

È possibile eliminare anche la configurazione:

```bash
rm ~/.config/wii-cursor-monitor.conf
```

e, se non servono più:

```bash
rm -rf ~/.icons/'Wii Pointer'
rm -rf ~/.icons/'Wii Pointer Player 2'
rm -rf ~/.icons/'Wii Pointer Player 3'
rm -rf ~/.icons/'Wii Pointer Player 4'
```

---

# ⚠️ Note

Il progetto modifica il comportamento del cursore tramite **KWin Script**.

Di conseguenza:

* non è un sistema universale per Linux;
* richiede KDE Plasma/KWin;
* il comportamento dipende dalla versione di KDE Plasma e KWin;
* Wayland è l'ambiente principale considerato dal progetto;
* altri Desktop Environment richiedono un'implementazione differente.

Il progetto non modifica fisicamente il monitor né il firmware del mouse: il cambio riguarda esclusivamente il tema del cursore utilizzato dalla sessione grafica.

---

# 📄 License

NON SONO DELLA NINTENDO NON MI APPARTIENE NULLA FATE QUELLO CHE VOLETE

---

