# noa-mc

Semi-functional port of minecraft preclassic to js using [noa](https://github.com/fenomas/noa).

## Play [here](https://git.itsmeow.cat/noa-mc/noagame/build/)!
[Mobile](https://git.itsmeow.cat/noa-mc/noagame/build/?mobile)

# **_DISCLAIMER_**

## I DO NOT OWN ANY OF THESE ASSETS

## I AM NOT AFFILIATED WITH MOJANG IN ANY WAY

### ASSETS &copy; MOJANG AB

<br>

# Q & A

- ### What devices have you tested this on?
  - Firefox on iOS 12 (equivalent to safari 12)
  - Firefox on Windows 10 (v95)
  - Occasionally using Chrome on Windows 10 (v93)
  - _If something doesn't work right (blank page, console errors, etc) make an issue with your device and browser version/name._

---

- ### Why did you make this?
  - I wanted to make something better than the official classic port. The controls are kinda weird and it's prone to bugs.

---

- ### Is this against Mojang's Terms?
  - No, i'm following everything [here](https://account.mojang.com/terms#brand).
  - This is not for a commercial use.
  - I'm not making money off of this.
  - I'm not giving away copies of Minecraft.
  - I'm not "letting other people get access to anything we've made in a way that is unfair or unreasonable" as far as i know.
  - [I'm not misleading anyone into thinking this is official.](#i-am-not-affiliated-with-mojang-in-any-way)
  - I'm not damaging Mojang's brand as far as i know.

# Changelog

## v0.5.4

- Fixed mobile detection for iPads.
- Added query parameter to force mobile mode.

## v0.5.3

- Fixed tooltip rendering bug.
- Made items "magnet" toward you if you are close enough.
- Added sprinting when you hold shift.

## v0.5.2

- Added tooltips on items.

## v0.5.1

- Fixed inventory rendering bug.

## v0.5.0

- Added settings page with sensitivity slider.
- Added save game button.
- The world and inventory now save in localStorage.

## v0.4.1

- Removed slabs, they were glitchy.
- Fixed flower render bug.
- Added border that you can't pass or place past.

## v0.4.0

- Blocks drop proper things now.
- Added unobtainable oak slabs.

## v0.3.3

- Trees generate naturally.

## v0.3.2

- Limited jumps to 3.

## v0.3.1

- Fixed mobile hotbar.
- Made item count numbers resize with hotbar.

## v0.3.0

- You can now move items around in your inventory.

## v0.2.1

- You can no longer place blocks inside your character's space.

## v0.2.0

- Made the inventory and hotbar functional.
- Added functional item counts.

## v0.1.3

- Made items bigger.
- Added inventory screen.

## v0.1.2

- Added flowers.
- Added random flower generation.
- Fixed mobile block breaking.
- Blocks now drop items that disappear when you collide with them.

## v0.1.1

- Added ore, tnt, metal, and more blocks.

## v0.1.0

- Added pause menu.

## v0.0.9

- Fixed hotbar clicking on mobile.
- Added proper mobile placing/breaking
- Add inventory button.
- Added hotbar scale modification.
- Made hotbar smaller for mobile.

## v0.0.8

- Fixed inventory updating in chrome.
- Switched to esbuild.
- Switched to typescript.
- Combined clean/build-assets files.

## v0.0.7

- Added 3d renders to hotbar.
- Fixed break particle sampling.
- Pickblock updates current hotbar slot.
- Inventory updates current hotbar slot.

## v0.0.6

- Increased gravity.
- Added working hotbar.

## v0.0.5

- Added more blocks.
- Revamped block creation system.
- Added autojump for touch mode.
- Added sapling-type blocks.
- Fixed break textures being upside-down.

## v0.0.4

- Hopefully fixed mobile resizing bug.
- Increased touch mode sensitivity.
- Added block choose menu.

## v0.0.3

- Added mobile control pad.
- Fixed mobile scrolling.
- Added temporary button to force touch mode.
- Added blockpick.

## v0.0.2

- Added hold-to-mine.
- Added hold-to-place based on the PreciseBlockPlacing mod.
- Increased camera sensitivity.

## v0.0.1

- Initial release.
