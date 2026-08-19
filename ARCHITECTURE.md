\# AMPDA Architecture



> Autonomous Music Production \& Distribution Agent



\---



\# Overview



AMPDA is a modular, provider-based AI platform for autonomous music production.



The system is composed of independent packages that communicate through well-defined interfaces.



Each package has a single responsibility and can evolve independently.



\---



\# High-Level Architecture



```text

&#x20;               CLI

&#x20;                │

&#x20;                ▼

&#x20;         Orchestrator

&#x20;                │

&#x20;                ▼

&#x20;        Pipeline Executor

&#x20;                │

&#x20;                ▼

&#x20;         Agent Registry

&#x20;                │

&#x20;    ┌───────────┼───────────┐

&#x20;    │           │           │

&#x20;    ▼           ▼           ▼

&#x20;Planner      Lyrics      Prompt

&#x20;    │           │           │

&#x20;    ▼           ▼           ▼

&#x20;Metadata     Artwork      Music

&#x20;                │

&#x20;                ▼

&#x20;          Provider Layer

&#x20;                │

&#x20;                ▼

&#x20;            AI Layer

&#x20;                │

&#x20;                ▼

&#x20;             Ollama

```



\---



\# Repository Structure



```text

apps/

├── cli/

├── orchestrator/

└── dashboard/



packages/

├── agent-runtime/

├── ai/

├── planner/

├── prompts/

├── quality/

├── memory/

├── exporter/

├── analytics/

├── distribution/

└── social/



plugins/



songs/

```



\---



\# Package Responsibilities



\## CLI



Responsible for:



\- User commands

\- Argument parsing

\- Launching workflows



\---



\## Orchestrator



Responsible for:



\- Workflow execution

\- Pipeline coordination

\- Agent scheduling



\---



\## Agent Runtime



Responsible for:



\- Agent interfaces

\- Agent registry

\- Providers

\- Execution lifecycle



\---



\## AI



Responsible for:



\- Ollama

\- Future cloud models

\- LLM abstraction



\---



\## Planner



Responsible for:



\- Workflow planning

\- BPM

\- Key

\- Song structure

\- Arrangement

\- Production direction



Planner is the single source of truth.



\---



\## Prompts



Responsible for:



\- Prompt loading

\- Prompt packs

\- Prompt templates

\- Prompt management



\---



\## Quality



Responsible for:



\- Lyrics scoring

\- Prompt scoring

\- Metadata validation

\- Automatic regeneration



\---



\## Memory



Responsible for:



\- Artist profiles

\- Brand voice

\- Album continuity

\- Long-term memory



\---



\## Exporter



Responsible for:



\- Project generation

\- Packaging

\- Release assets

\- File export



\---



\## Distribution



Responsible for:



\- Music publishing

\- Distribution providers

\- Release management



\---



\## Social



Responsible for:



\- Social captions

\- Scheduling

\- Publishing

\- Campaign generation



\---



\## Analytics



Responsible for:



\- Streams

\- Revenue

\- Playlist tracking

\- Reporting

\- Recommendations



\---



\# Generation Pipeline



```text

CLI

&#x20;│

&#x20;▼

Planner

&#x20;│

&#x20;▼

WorkflowPlan

&#x20;│

&#x20;├────────► Lyrics

&#x20;│

&#x20;├────────► Music Prompt

&#x20;│

&#x20;├────────► Artwork Prompt

&#x20;│

&#x20;├────────► Metadata

&#x20;│

&#x20;▼

Export

&#x20;│

&#x20;▼

Project

```



\---



\# Design Principles



\- Modular architecture

\- Provider-based design

\- Strong typing

\- Dependency injection

\- Configuration-driven

\- Testable components

\- Single responsibility

\- Scalable packages

\- Replaceable AI providers



\---



\# Future Pipeline



```text

Idea

&#x20;│

&#x20;▼

Planner

&#x20;│

&#x20;▼

Lyrics

&#x20;│

&#x20;▼

Quality

&#x20;│

&#x20;├── Pass

&#x20;│

&#x20;└── Rewrite

&#x20;│

&#x20;▼

Music Prompt

&#x20;│

&#x20;▼

Artwork

&#x20;│

&#x20;▼

Metadata

&#x20;│

&#x20;▼

Export

&#x20;│

&#x20;▼

Distribution

&#x20;│

&#x20;▼

Marketing

&#x20;│

&#x20;▼

Analytics

&#x20;│

&#x20;▼

Memory Update

```

