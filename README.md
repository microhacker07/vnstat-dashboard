# vnstat-dashboard

Uses [Bottle](https://bottlepy.org/docs/dev/) and [Plotly JS](https://plotly.com/javascript/) to create some graphs to monitor data usage from a device.

![Image of Web Frontend](https://raw.githubusercontent.com/microhacker07/vnstat-dashboard/main/vnstat.png)

Displays:

- Installed version of VnStat
- The time since the VnStat database was updated
- Multiple Graphs!
  - Hourly Graph
  - Daily Graph
  - Monthly Graph

## Prerequisites

- Python 3
- vnstat

For the latest version of [vnstat](https://github.com/vergoh/vnstat) or
install from your package manager

For Debian/Ubuntu:

`sudo apt-get install vnstat`

For Arch:

`sudo pacman -S vnstat`

And (if you want vnstat to log data usage in the background) start the vnstat logging daemon with:

`vnstatd -d`

## How to run

1. Clone repo

`git clone https://github.com/microhacker07/vnstat-dashboard.git`
	
Or download the zip and extract it

2. Move into the directory

`cd path/to/vnstat-dashboard`

3. Install the required Python packages

`pip install -r requirements.txt`

4. Run server.py

`python server.py`
