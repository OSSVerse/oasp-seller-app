## Description

Seller side backend service application for an OASP (Open Source Assurance Provider) to manage service catalogue and accept orders from the OSSVerse marketplace

## Pre-requisites

1. Install Docker and Docker compose

### Steps to follow:

# Step 1 — Installing Docker

The Docker installation package available in the official Ubuntu repository may not be the latest version. To ensure we get the latest version, we’ll install Docker from the official Docker repository. To do that, we’ll add a new package source, add the GPG key from Docker to ensure the downloads are valid, and then install the package.

# 1.1. First, update your existing list of packages:

       sudo apt update

# 1.2. Next, install a few prerequisite packages which let apt use packages over HTTPS:

       sudo apt install apt-transport-https ca-certificates curl software-properties-common

# 1.3. Then add the GPG key for the official Docker repository to your system:

       curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# 1.4. Add the Docker repository to APT sources:

       sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"

# 1.5. Make sure you are about to install from the Docker repo instead of the default Ubuntu repo:

       apt-cache policy docker-ce

#      You’ll see output like this, although the version number for Docker may be different:
       docker-ce:
        Installed: (none)
        Candidate: 5:19.03.9~3-0~ubuntu-focal
        Version table:
               5:19.03.9~3-0~ubuntu-focal 500
                      500 https://download.docker.com/linux/ubuntu focal/stable amd64 Packages

# 1.6. Finally, install Docker:

       sudo apt install docker-ce

# 1.7. Docker should now be installed, the daemon started, and the process enabled to start on boot. Check     that it’s running:

       sudo systemctl status docker

#      The output should be similar to the following, showing that the service is active and running:

 #      Output
●       docker.service - Docker Application Container Engine
           Loaded: loaded (/lib/systemd/system/docker.service; enabled; vendor preset: enabled)
           Active: active (running) since Tue 2020-05-19 17:00:41 UTC; 17s ago
       TriggeredBy: ● docker.socket
           Docs: https://docs.docker.com
       Main PID: 24321 (dockerd)
           Tasks: 8
       Memory: 46.4M
       CGroup: /system.slice/docker.service
             └─24321 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock



# Step 2 —  Installing Docker Compose

To make sure you obtain the most updated stable version of Docker Compose, you’ll download this software from its official Github repository.

First, confirm the latest version available in their releases page. At the time of this writing, the most current stable version is 1.29.2.



# 2.1. The following command will download the 1.29.2 release and save the executable file at /usr/local/bin/docker-compose, which will make this software globally accessible as docker-compose:

       sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 2.2. Next, set the correct permissions so that the docker-compose command is executable:

       sudo chmod +x /usr/local/bin/docker-compose

# 2.3. To verify that the installation was successful, you can run:

       docker-compose --version

# 2.4. You’ll see output similar to this:

#      Output
       docker-compose version 1.29.2, build 5becea4c




## Installation

### Using docker


1. Open the terminal.
2. Clone this repo.
   
       git clone https://github.com/OSSVerse/oasp-seller-app.git

4. Move into the dir

       cd oasp-seller-app

5. Run the docker-compose.yaml file

       docker-compose up --build


## Using the postman collections 

It contains the below postman collection
- Seller-App.postman_collection.json