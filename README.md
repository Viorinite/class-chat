# Class Chat App

This project was developed to provide a secure, localized communication platform for my students during our Coding Class session. The primary goal was to minimize technical friction in sharing learning resources while maintaining a safe, private environment for the class.

## Overview

Currently, this app is built using [The Lounge](https://thelounge.chat/) (an open-source web chat client) connected to a local server. To make it easier for students, I customized the interface by injecting my own JavaScript and CSS. This hides all the confusing technical server settings and leaves just a simple "Nickname" prompt.

## What I Configured

- **Custom UI Features:** Wrote custom JavaScript to auto-fill settings and hide unnecessary login fields, making it "student-proof."
- **Indonesian Localization:** Used CSS to change the default English labels (like "Nick" to "Nama").
- **Docker Deployment:** Packaged the whole environment using `docker-compose` so it can be spun up quickly.

## Future Plans

This is the initial version of the infrastructure! In the future, I plan to build my own independent, real-time chat application from scratch using **Socket.io** and move away from this pre-built client.
