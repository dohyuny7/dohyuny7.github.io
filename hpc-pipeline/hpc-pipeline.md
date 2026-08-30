# BFR HPC Job Relay

**Berkeley Formula Racing - Python, aiohttp, asyncssh - Oracle Cloud + Sabalcore**

BFR runs CFD on Sabalcore, an external HPC provider, via a 60,000-core-hour sponsorship I secured for the 2026 season alongside a STAR-CCM+ Power-on-Demand license. Getting a job from a teammate's laptop onto that cluster, and a result back, is a problem most FSAE teams solve badly or not at all: it usually means SSH, PBS scripting, and manual file transfer, which places a long overhead on any CFD and becomes a tedious task for anyone who isn't already comfortable on the command line. I built and now maintain the tool that allows anyone on our team to submit a job, monitor it, and download the result, all within an hour.

## Rebuild

My first version worked, just barely. A GitHub pages frontend and a FastAPI backend that ran on our team's old workstation PC, and accessed from an outside campus network through a Tailscale tunnel, which SSH'd into Sabalcore's terminal. This is five spotty connections, one of which was an unreliable PC that had to be powered on 24/7 for a teammate to submit a job. It failed constantly, often in ways that were difficult to diagnose. 

I decommissioned all of it and rebuilt from a different starting question: what is the minimum number of connections with zero dependency on a personal machine? My answer was a relay that exists entirely on an infrastructure that constantly stays online. A tiny cloud VM serving as the frontend directly and holding open the only SSH connection to Sabalcore. That reduced five "jumps" into two, and removed the "is my PC asleep" as a failure mode entirely. 

## What it does

A teammate opens the tool, logs in, and gets four panels: submit, live job monitor, jobs/download, and cluster availability. Submitting a job means picking a `.sim` file, a cluster partition, and a core count. The backend validates that core count against each partition's actual node size (16 cores/node on most partitions, 36 on one, 24 and 64 on others) so a teammate can't request something the scheduler will reject, and generates the PBS script from a template reconciled line-for-line against the cluster admin's own working script, including a master-node oversubscription fix that was costing the team a 13x slowdown. The job-name field also enforces the team's naming convention directly in the placeholder text, so a run is self-describing before it's even submitted.

![Submit panel](figures/submit-panel.png)

![Cluster availability panel](figures/cluster-availability.png)

Once submitted, STAR-CCM+ runs a single chained batch process on the cluster: geometry operations, meshing, solving, and a post-processing export macro, all in one job, operating on the same in-memory solved simulation rather than reloading it for a separate export step. The console streams live, so a teammate can monitor solver residuals converge and then watch the export macro fire from the finished solution without leaving the browser.

![Live console output during a run](figures/live-console.png)

That macro writes every scene to PNG and every report value to a text file, formatted to the team's own CFD standards document (raw values, half-car, undoubled, with a locked downforce sign convention) so results are consistent regardless of who ran the job:

![Actual force_reports.txt output](figures/force-report-output.png)

Results come back as a single zip a teammate can pull from the jobs panel.

The cluster monitor and job status update live via server-sent events rather than polling, so a teammate watching a run doesn't refresh a page; the page pushes to them. That required moving off a naive per-request-SSH-connection model, which was failing intermittently under load, to two persistent SSH sessions held open by the relay: one dedicated to the live monitoring feed, one to submit/download/delete actions, so a slow download can't stall someone else's status update.

## How it works

The backend is a handful of focused Python modules: request handling and the frontend server, job validation and resource checking, and an SSH backend with a mock implementation swapped in for testing, so the submission and validation logic has real test coverage without needing a live cluster connection for every run. The service is deployed under systemd for automatic restart, served over TLS, and authenticates to the cluster with a dedicated SSH key rather than a shared password.

Getting it running exposed a few things nobody had documented anywhere. The cluster's actual home-directory path didn't match its own documentation, `qstat` output needed a proper key-value parser after the naive columnar one silently produced wrong job states, and the partition-availability parser broke on one specific partition name because it happened to contain the letter the field-splitter was matching on. None of that shows up in a demo; all of it is why the tool works reliably now instead of intermittently.

## CFD Standards

Building the pipeline surfaced a second problem: even with reliable job submission, results from different teammates weren't directly comparable, because nobody had written down the team's conventions for coordinate systems, reference values, half-car doubling, boundary naming, or sign conventions. I wrote a document, titled 'BFR CFD Standards' to lock these down: reference flow conditions, a fixed part naming scheme, mesh and solver baselines, a run naming convention, and a pre-run checklist, so a `.sim` file from any team member means the same thing. The post-processing macro enforces the reporting half of that standard automatically rather than relying on everyone remembering it.

## Result

Ten people (six returning teammates and four new recruits with no prior HPC experience), are all now running CFD through this tool without touching SSH, PBS, or a terminal. The team has run roughly 140 simulations and consumed over 20,000 of the sponsored core-hours through it this season, allowing BFR to iterate much more rapidly than was possible previously. 

![Jobs panel with live core-hour balance](figures/jobs-panel.png)
