FROM ubuntu:latest
MAINTAINER JR Conlin <jrconlin+di.fmd@mozilla.com>
RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install git golang mercurial make wget -y
RUN git clone https://github.com/mozilla-services/FindMyDevice.git
WORKDIR FindMyDevice
# For deployment testing:
#RUN git checkout dev
RUN make build
# Copy the config.ini file from central repository?
#Add config.ini /FindMyDevice/config.ini
# (If not config.ini will require editing for the current environment)
# Run the App
#CMD FindMyDevice
# FMD uses the following ports:
# 8080 (http/ws)
#EXPOSE 8080
