# vnstat-dashboard

Uses [Bottle](https://bottlepy.org/docs/dev/) and [Plotly JS](https://plotly.com/javascript/) to create
some graphs to monitor data usage from a device.

![Image of Web Frontend](https://github.com/microhacker07/vnstat-dashboard/blob/main/vnstat.png)

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


## How to run

1. Clone repo

`git clone https://github.com/microhacker07/vnstat-dashboard.git`

2. Install Python packages

`pip -r requirements.txt`

3. Run server.py

`python server.py`