Docker file for FindMyDevice
===

This file will build a docker.io image containing FindMyDevice. This
image will require some configuration (see Dockerfile and
config-sample.ini for details)

This service presumes you've installed docker and are running on a
Debian/Ubuntu system. See https://www.docker.com/ for information
specific to your system.

To create a new docker image:
---

    $ sudo docker build -t find_my_device .

This should generate an image called find\_my\_device. You will need
to modify the config.ini file (or copy a pre-configured config.ini
file into the container) before the application will run.

To start the image:
---

    $ sudo docker run find_my_device FindMyDevice


