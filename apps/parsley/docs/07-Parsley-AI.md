# Parsley AI

Parsley AI is an intelligent assistant built directly into the **Parsley Log Viewer**. It’s designed to make debugging faster and easier by helping you understand your log files and related Evergreen task data.

## What Parsley AI Can Do

- **Understand your logs:**
  Ask questions in natural language and Parsley AI will parse the log file for you, explaining what happened and why.

- **Debug failures quickly:**
  If a task or test fails, Parsley AI can highlight the cause and summarize relevant error messages.

- **Query Evergreen for context:**
  Parsley AI can fetch information about the specific task or test from Evergreen to give you a more complete picture.

- **Cross-log analysis:**
  It can also read related log files and provide summaries, so you can understand issues across multiple runs in one view.

## How does Parsley AI work?

Parsley AI uses a combination of specialized agents to help you debug your log failure and suggest next steps. Every time you ask a question, Parsley AI will select the appropriate agent(s) to use to answer your question. It will analyze the question and come up with a plan of action.

- **Log Analyzer:** This agent, aka the "Log Core Analyzer", is responsible for analyzing the log file and identifying the root cause of the failure. It will use the log file to identify the root cause of the failure and is capable of analyzing a single log file with a guiding prompt on what it should look for.

- **Evergreen Agent**: This agent is responsible for querying Evergreen for information about the task or test. It can also research specific pieces of information pertaining to the task or test.

## Providing Feedback

Parsley AI is a work in progress and we are constantly improving it. It may not always get it right so use your best judgement. If you have any feedback, please let us know by filing a ticket in the DEVPROD Jira project and adding "Evergreen UI" as the service.
If you have feedback about specific responses you can use the "Thumbs Up" and "Thumbs Down" buttons to provide feedback on the response. We will use this feedback to improve the quality of the responses.

## Getting Started

1. Open a log file in the Parsley Log Viewer.
2. Click the **Parsley AI** button in the top right corner.
3. If you are not logged in, you will be prompted to login.
4. Ask a question about your task or test (for example: _“Why did this test fail?”_).
5. Review Parsley AI’s analysis and suggested next steps.

## Demo

👉 [Watch the video demo here](https://youtu.be/kHq4OGowFnk)
