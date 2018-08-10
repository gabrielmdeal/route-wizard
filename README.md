# route-wizard

Tools for planning trips to the mountains

http://yellowleaf.org/route-wizard/

# Todo

* Change To & From columns to "Starting point" and "Ending point".
  * Rename Description column to "Starting point information"
  * Stop propogating the line description to all of the lines it gets split to.
* Add a "cumulative distance" column.
* Accept GPX files.
* Compute elevation gain more accurately.  Currently it only computes the gain between points in a line, which only works well if there are a lot of points.
* Support folders.
* Non-hacky sorting of segments. https://stackoverflow.com/questions/49883480/combine-a-sequence-of-linestring
* Get tooltip working for load route button.  https://stackoverflow.com/questions/50107641/material-ui-tooltip-on-select-menuitem-component-stays-displayed-after-selecti
* Display errors in red and prefix with "Error:".
