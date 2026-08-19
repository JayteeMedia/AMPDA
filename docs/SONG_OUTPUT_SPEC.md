\# AMPDA Song Output Specification

Version: 1.0

Status: LOCKED

Milestone: v0.2



\---



\## Purpose



This document defines the canonical AMPDA song format.



Every lyrics provider, formatter, validator, exporter and future AI model MUST produce or consume this format.



This specification is considered a contract.



\---



\# General Rules



Maximum output:

3500 characters



Style Prompt:

Maximum 750 characters



Return only the completed song.



Never explain.



Never apologize.



Never include notes.



Never include reasoning.



Never output:



\- Done.

\- Finished.

\- End of song.

\- Lyrics...

\- Sound Elements...

\- Automation...

\- Dynamic...



Placeholder text is prohibited.



\---



\# Section Order



The order is fixed.



Song Title



Style, Vocals \& Production



Intro



Verse 1



Pre-Chorus



Chorus



Verse 2



Bridge



Final Chorus



Outro



No additional sections unless explicitly requested.



\---



\# Production Formatting



Production information MUST use square brackets.



Example



\[Sound Elements: ...]



\[Automation: ...]



\[Dynamic: ...]



\[Mood: ...]



Never use parentheses.



\---



\# Vocal Formatting



Only vocal annotations use parentheses.



(Ad-libs: "...")



(Echo: "...")



No other parenthetical annotations are permitted.



\---



\# Style Block



Exactly one.



Never duplicate.



Format:



\[Style, Vocals \& Production:

...

]



Maximum 750 characters.



\---



\# Intro



Must contain



\[Sound Elements]



\[Automation]



\[Dynamic]



Lyrics



(Ad-libs)



(Echo)



\---



\# Verse 1



Must contain



\[Sound Elements]



\[Automation]



\[Dynamic]



Lyrics



(Ad-libs)



(Echo)



\---



\# Pre-Chorus



Must contain



\[Sound Elements]



\[Automation]



\[Dynamic]



Lyrics



(Ad-libs)



(Echo)



\---



\# Chorus



Must contain



\[Sound Elements]



\[Automation]



\[Dynamic]



Lyrics



(Ad-libs)



(Echo)



\---



\# Verse 2



If production has NOT changed:



Do NOT repeat



\[Sound Elements]



\[Automation]



\[Dynamic]



Only include them if they change.



\---



\# Bridge



Same rule.



\---



\# Final Chorus



Same rule.



\---



\# Outro



Must always contain



\[Sound Elements]



\[Automation]



\[Dynamic]



Lyrics



(Ad-libs)



(Echo)



\---



\# Lyrics Rules



Natural cadence.



Modern songwriting.



Strong hook.



Commercial quality.



Internal rhymes where appropriate.



Genre authenticity.



Emotional progression.



No filler.



No placeholder text.



\---



\# Validation Rules



Song Formatter must verify



✓ Song Title exists



✓ Exactly one Style block



✓ Intro exists



✓ Verse 1 exists



✓ Chorus exists



✓ Outro exists



✓ No duplicate Style blocks



✓ No placeholder text



✓ Proper bracket formatting



✓ Proper Ad-libs



✓ Proper Echo formatting



\---



\# Planner Rules



Planner owns



\- BPM

\- Key

\- Structure

\- Vocal Style

\- Production Style

\- Artwork Style



Lyrics agent must not invent these.



\---



\# Formatter Rules



Formatter may



\- Remove duplicate sections

\- Normalize spacing

\- Normalize labels

\- Remove placeholders

\- Remove trailing "Done."



Formatter must never rewrite lyrics.



\---



\# Quality Rules



Quality Engine scores



\- Structure

\- Hook

\- Flow

\- Rhyme

\- Formatting

\- Replay Value

\- Commercial Appeal

\- Emotional Impact



\---



\# Contract



Every future AI model integrated into AMPDA must conform to this specification.



This document is the authoritative output contract for AMPDA.

