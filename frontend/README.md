Voice2FA is a prototype of a two-factor authentication that employs a username and password as the first factor and a voice recording as the second factor. By generating short phrases at login and validating that both the correct phrase was read and the audio sample matches the voice signature of samples on record, this system ensures secure user authentication.

# Prerequisites
Download and install the LTS version of Node.js here: https://nodejs.org/en
Download and install a git-enabled terminal, such as git bash: https://git-scm.com/downloads
Download and install Google Cloud CLI here: https://cloud.google.com/sdk/docs/install. Follow the installation instructions, then setup a service account for Google Speech-To-Text and follow the appropriate authentication steps on the development machine.

# Installation
In a git-enabled terminal, clone the repository and install the dependencies:
`git clone https://github.com/starphys/Voice2FA.git`
`cd frontend`
`npm install`
`cd ../backend`
`npm install`
To generate and self-sign certificates for HTTPS:
`mkdir certificate`
`cd certificate`
`openssl genrsa -out key.pem`
`openssl req -new -key key.pem -out csr.pem`
`openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem`
`rm csr.pem`

# Usage
This is a prototype, and is intended to be run as a standalone project. 
To run the backend, in a separate terminal:
`cd backend`
`npm start`
Launch a browser and navigate to the listed IP address. Because the server's certificates are self-signed, you need to manually navigate to the server's home page for requests from the frontend to be processed correctly. 

To run the frontend, in a separate terminal:
`cd frontend`
`npm run dev`
Open the listed IP address in the same browser you used for the previous step.