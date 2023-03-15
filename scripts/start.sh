#!/bin/bash
npm run start:production &
chromium-browser --noerrors --disable-session-crashed-bubble --disable-infobars --start-fullscreen