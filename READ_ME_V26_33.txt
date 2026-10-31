BENKEN STAGE PRO V26.33 — KEYBOARD AND MIXER SAVE

WHAT CHANGED
When a text field is being edited and the on-screen keyboard reduces the
visible page height, the bottom controls and waveform are temporarily hidden.
They return when the keyboard closes, including when the text field keeps
focus. A previously hidden control bar stays hidden. This does not change the
saved control-bar or waveform preferences. Hardware-keyboard focus and zoom
alone do not hide the bar.

SAVE MIXER SETTINGS is now in the mixer's fixed top heading, beside the close
button. It sits outside the scrolling area and remains above all editable
fields. It appears only while Mixer Settings is open. In Audio & Files, the
same action says SAVE NAMES.

The V26.32 changes are included: Mute Groups in Tracks is collapsed behind
a button for each track, showing the number of assigned groups. Closing the
section keeps its assignments. The editor uses two columns on wider screens.

UPDATE FROM V26.31 OR V26.32
This ZIP contains a web update only. Upload the contents to the root of the
existing kenhje/BenKenStagePro GitHub repository, replacing matching filenames.
Do not upload the ZIP itself or put its contents inside an extra subfolder.
Keep existing files and GitHub Pages settings. Wait for publishing to finish,
then close and reopen BenKen with internet and verify V26.33 in the mixer.
No Xcode source change or deletion of the installed app is required.

DATA AND PLAYBACK
Storage keys, audio databases, project formats and memory limits are unchanged.
The keyboard behavior changes the display only; it does not pause audio.
Automatic saving and track names, buses, routing and mute groups keep their
existing behavior.

IPAD CHECK
1. Open Mixer Settings > Tracks and tap a track-name field.
2. With the docked on-screen keyboard open, the control bar should disappear.
3. Scroll the tracks. SAVE MIXER SETTINGS should remain in the fixed top row.
4. Save a name and verify it after closing and reopening Mixer Settings.
5. Dismiss the keyboard and verify that the original controls return.
6. Test the same behavior in Audio & Files, notes and other text fields.
7. Check opening and closing per-track MUTE GROUPS and retained assignments.
8. After updating, verify a fresh start and song playback on the Ui24R network
   without internet. Physical keyboard/layout, offline and cue behavior still
   require iPad checks; the automated checks use models.

VERIFICATION
259 existing mixer integration, CSS layout and offline-cache checks passed.
Application smoke checks also cover software-keyboard opening and dismissal,
focus and name retention, hardware-keyboard focus, zoom, saved controls
preferences and the top save action outside the mixer scroll area. CSS
constraints were checked at 320, 375, 768, 1024 and 1366 pixels. These are DOM/audio models and CSS constraints;
actual iPad layout and native offline/cue operation still need device testing.
